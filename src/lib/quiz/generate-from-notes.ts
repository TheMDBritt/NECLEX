import Anthropic from "@anthropic-ai/sdk";
import type {
  BowTieQuestion,
  FillInTheBlankQuestion,
  ItemType,
  MultipleChoiceQuestion,
  MultipleResponseQuestion,
  Option,
  Question,
} from "@/lib/types/question";

const PER_BATCH = 12;
const MODEL = "claude-opus-4-7";
const SOURCE_LABEL = "From your uploaded notes";

interface RawOption {
  label: string;
  isCorrect: boolean;
  feedback?: string;
}

interface RawQuestion {
  itemType: ItemType;
  stem: string;
  options?: RawOption[];
  acceptedMin?: number;
  acceptedMax?: number;
  units?: string;
  decimals?: number;
  actions?: { selectCount: number; options: RawOption[] };
  condition?: { options: RawOption[] };
  monitor?: { selectCount: number; options: RawOption[] };
  rationaleBody: string;
  bodySystem?: string;
  specialty?: string;
}

const optionSchema = {
  type: "object",
  properties: {
    label: { type: "string", description: "Answer choice text." },
    isCorrect: { type: "boolean" },
    feedback: {
      type: "string",
      description: "One-sentence explanation tied back to the notes.",
    },
  },
  required: ["label", "isCorrect", "feedback"],
  additionalProperties: false,
} as const;

const questionTool: Anthropic.Tool = {
  name: "submit_questions",
  description:
    "Submit NCLEX-style practice questions derived strictly from the user's notes.",
  input_schema: {
    type: "object",
    properties: {
      questions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            itemType: {
              type: "string",
              enum: [
                "multiple_choice",
                "multiple_response",
                "fill_in_the_blank",
                "bow_tie",
              ],
            },
            stem: {
              type: "string",
              description: "The question stem. Clinically realistic.",
            },
            options: {
              type: "array",
              description:
                "For multiple_choice (exactly 4, one correct) or multiple_response (5–6, 2–4 correct).",
              items: optionSchema,
            },
            acceptedMin: {
              type: "number",
              description: "fill_in_the_blank: minimum accepted numeric answer.",
            },
            acceptedMax: {
              type: "number",
              description: "fill_in_the_blank: maximum accepted numeric answer.",
            },
            units: {
              type: "string",
              description:
                "fill_in_the_blank: unit label shown to learner (e.g., mL/hr).",
            },
            decimals: {
              type: "number",
              description: "fill_in_the_blank: decimal places to display.",
            },
            actions: {
              type: "object",
              description: "bow_tie: actions section.",
              properties: {
                selectCount: { type: "number" },
                options: { type: "array", items: optionSchema },
              },
              required: ["selectCount", "options"],
              additionalProperties: false,
            },
            condition: {
              type: "object",
              description: "bow_tie: condition section (single-select).",
              properties: {
                options: { type: "array", items: optionSchema },
              },
              required: ["options"],
              additionalProperties: false,
            },
            monitor: {
              type: "object",
              description: "bow_tie: parameters to monitor section.",
              properties: {
                selectCount: { type: "number" },
                options: { type: "array", items: optionSchema },
              },
              required: ["selectCount", "options"],
              additionalProperties: false,
            },
            rationaleBody: {
              type: "string",
              description:
                "2–4 sentence explanation grounded in the notes. No outside facts.",
            },
            bodySystem: { type: "string" },
            specialty: { type: "string" },
          },
          required: ["itemType", "stem", "rationaleBody"],
          additionalProperties: false,
        },
      },
    },
    required: ["questions"],
    additionalProperties: false,
  },
};

function systemPrompt(allowedTypes: ItemType[]): string {
  const allowed = allowedTypes.join(", ");
  return `You write NCLEX-RN practice questions for a nursing student based ONLY on the notes she gives you.

ABSOLUTE RULES
- Every fact in every question, option, and rationale must come from the provided notes. Do NOT add outside knowledge, drug doses, lab values, or guidelines that are not stated in the notes. If the notes don't say it, you don't know it.
- If the notes don't contain enough material for the requested number of questions, generate fewer rather than inventing content.
- Only use these item types: ${allowed}.
- Never reuse the same stem twice in a single batch.

ITEM TYPE RULES
- multiple_choice: exactly 4 options, exactly one correct. Distractors must be plausible and tied to a specific misconception in the notes.
- multiple_response (Select All That Apply): 5 or 6 options, 2 to 4 correct. Each option independently true or false based on the notes.
- fill_in_the_blank: numeric answer with an accepted range (acceptedMin, acceptedMax) and units. Use this for dosage / calculation content only when the notes contain the math.
- bow_tie: only generate when the notes describe a specific clinical scenario. actions and monitor sections each have 4–6 options with selectCount=2 correct; condition has 4 options with exactly one correct.

WRITING STYLE
- Stems are clinically realistic, calm, and unambiguous.
- Each option's feedback is one sentence and explains why it is right or wrong using only what's in the notes.
- The rationale (rationaleBody) is 2–4 sentences. Re-anchor the underlying concept so the learner can carry it forward.
- Tag bodySystem (e.g., cardiac, neuro, renal) and specialty (e.g., med-surg, peds, ob, mental-health) when the notes make it obvious; omit otherwise.

You MUST respond by calling the submit_questions tool with your questions. Do not write anything outside the tool call.`;
}

function asOption(raw: RawOption, idx: number): Option {
  return {
    id: `opt-${idx}`,
    label: raw.label,
    isCorrect: Boolean(raw.isCorrect),
    feedback: raw.feedback,
  };
}

function buildId(itemType: ItemType, batchIdx: number, idx: number): string {
  return `notes-${itemType}-${batchIdx}-${idx}-${Math.random().toString(36).slice(2, 8)}`;
}

function toQuestion(raw: RawQuestion, batchIdx: number, idx: number): Question | null {
  const baseTags = {
    examTarget: "RN" as const,
    clientNeed: "physiological-integrity",
    bodySystem: raw.bodySystem,
    specialty: raw.specialty,
  };
  const rationale = {
    body: raw.rationaleBody,
    sources: [{ label: SOURCE_LABEL }],
  };

  switch (raw.itemType) {
    case "multiple_choice": {
      if (!raw.options || raw.options.length < 2) return null;
      const opts = raw.options.map(asOption);
      if (opts.filter((o) => o.isCorrect).length !== 1) return null;
      const q: MultipleChoiceQuestion = {
        id: buildId(raw.itemType, batchIdx, idx),
        itemType: "multiple_choice",
        scoringRule: "dichotomous",
        stem: raw.stem,
        options: opts,
        rationale,
        tags: baseTags,
      };
      return q;
    }
    case "multiple_response": {
      if (!raw.options || raw.options.length < 3) return null;
      const opts = raw.options.map(asOption);
      const correctCount = opts.filter((o) => o.isCorrect).length;
      if (correctCount < 1 || correctCount === opts.length) return null;
      const q: MultipleResponseQuestion = {
        id: buildId(raw.itemType, batchIdx, idx),
        itemType: "multiple_response",
        scoringRule: "polytomous_plus_minus",
        stem: raw.stem,
        options: opts,
        rationale,
        tags: baseTags,
      };
      return q;
    }
    case "fill_in_the_blank": {
      if (
        typeof raw.acceptedMin !== "number" ||
        typeof raw.acceptedMax !== "number" ||
        !raw.units
      ) {
        return null;
      }
      const q: FillInTheBlankQuestion = {
        id: buildId(raw.itemType, batchIdx, idx),
        itemType: "fill_in_the_blank",
        scoringRule: "dichotomous",
        stem: raw.stem,
        acceptedMin: Math.min(raw.acceptedMin, raw.acceptedMax),
        acceptedMax: Math.max(raw.acceptedMin, raw.acceptedMax),
        units: raw.units,
        decimals: raw.decimals,
        rationale,
        tags: baseTags,
      };
      return q;
    }
    case "bow_tie": {
      if (!raw.actions || !raw.condition || !raw.monitor) return null;
      const actions = raw.actions.options.map(asOption);
      const condition = raw.condition.options.map(asOption);
      const monitor = raw.monitor.options.map(asOption);
      if (
        actions.length < 3 ||
        condition.length < 3 ||
        monitor.length < 3 ||
        condition.filter((o) => o.isCorrect).length !== 1
      ) {
        return null;
      }
      const q: BowTieQuestion = {
        id: buildId(raw.itemType, batchIdx, idx),
        itemType: "bow_tie",
        scoringRule: "polytomous_rationale",
        stem: raw.stem,
        actions: { selectCount: raw.actions.selectCount ?? 2, options: actions },
        condition: { options: condition },
        monitor: { selectCount: raw.monitor.selectCount ?? 2, options: monitor },
        rationale,
        tags: baseTags,
      };
      return q;
    }
    default:
      return null;
  }
}

async function generateBatch(params: {
  notes: string;
  allowedTypes: ItemType[];
  count: number;
  batchIdx: number;
  client: Anthropic;
}): Promise<Question[]> {
  const { notes, allowedTypes, count, batchIdx, client } = params;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system: [
      {
        type: "text",
        text: systemPrompt(allowedTypes),
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [questionTool],
    tool_choice: { type: "tool", name: "submit_questions" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `NOTES (your only source of truth):\n\n${notes}\n\n---\n\nGenerate ${count} NCLEX practice question${count === 1 ? "" : "s"} from these notes. Allowed item types: ${allowedTypes.join(", ")}. Mix the types proportionally to what fits the material. Stay strictly within the notes.`,
            cache_control: { type: "ephemeral" },
          },
        ],
      },
    ],
  });

  const toolBlock = response.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
  );
  if (!toolBlock) return [];
  const input = toolBlock.input as { questions?: RawQuestion[] };
  if (!Array.isArray(input.questions)) return [];

  const questions: Question[] = [];
  input.questions.forEach((raw, idx) => {
    if (!allowedTypes.includes(raw.itemType)) return;
    const q = toQuestion(raw, batchIdx, idx);
    if (q) questions.push(q);
  });
  return questions;
}

export interface GenerateRequest {
  notes: string;
  itemTypes: ItemType[];
  count: number;
}

export async function generateQuizFromNotes({
  notes,
  itemTypes,
  count,
}: GenerateRequest): Promise<Question[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env.local to enable quiz generation.",
    );
  }
  const client = new Anthropic({ apiKey });

  const trimmedNotes = notes.trim();
  if (trimmedNotes.length < 80) {
    throw new Error(
      "These notes look too short. Paste at least a few sentences of study material.",
    );
  }

  const allowedTypes = itemTypes.length > 0
    ? itemTypes
    : (["multiple_choice", "multiple_response"] as ItemType[]);

  const targetCount = Math.max(1, Math.min(100, Math.floor(count)));

  const batches: { batchIdx: number; count: number }[] = [];
  let remaining = targetCount;
  let batchIdx = 0;
  while (remaining > 0) {
    const take = Math.min(PER_BATCH, remaining);
    batches.push({ batchIdx, count: take });
    remaining -= take;
    batchIdx += 1;
  }

  const results = await Promise.all(
    batches.map((b) =>
      generateBatch({
        notes: trimmedNotes,
        allowedTypes,
        count: b.count,
        batchIdx: b.batchIdx,
        client,
      }),
    ),
  );

  const flat = results.flat();
  if (flat.length === 0) {
    throw new Error(
      "Couldn't generate any questions from those notes. Try pasting more material or picking a different question type.",
    );
  }
  return flat.slice(0, targetCount);
}
