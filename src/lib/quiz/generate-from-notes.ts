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
const ANTHROPIC_MODEL = "claude-opus-4-7";
const GEMINI_MODEL = "gemini-2.5-flash";
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
} as const;

const questionsSchema = {
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
          stem: { type: "string" },
          options: { type: "array", items: optionSchema },
          acceptedMin: { type: "number" },
          acceptedMax: { type: "number" },
          units: { type: "string" },
          decimals: { type: "number" },
          actions: {
            type: "object",
            properties: {
              selectCount: { type: "number" },
              options: { type: "array", items: optionSchema },
            },
            required: ["selectCount", "options"],
          },
          condition: {
            type: "object",
            properties: {
              options: { type: "array", items: optionSchema },
            },
            required: ["options"],
          },
          monitor: {
            type: "object",
            properties: {
              selectCount: { type: "number" },
              options: { type: "array", items: optionSchema },
            },
            required: ["selectCount", "options"],
          },
          rationaleBody: { type: "string" },
          bodySystem: { type: "string" },
          specialty: { type: "string" },
        },
        required: ["itemType", "stem", "rationaleBody"],
      },
    },
  },
  required: ["questions"],
} as const;

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
- Tag bodySystem (e.g., cardiac, neuro, renal) and specialty (e.g., med-surg, peds, ob, mental-health) when the notes make it obvious; omit otherwise.`;
}

function userPrompt(notes: string, allowedTypes: ItemType[], count: number): string {
  return `NOTES (your only source of truth):\n\n${notes}\n\n---\n\nGenerate ${count} NCLEX practice question${count === 1 ? "" : "s"} from these notes. Allowed item types: ${allowedTypes.join(", ")}. Mix the types proportionally to what fits the material. Stay strictly within the notes.`;
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

interface BatchInput {
  notes: string;
  allowedTypes: ItemType[];
  count: number;
}

async function generateBatchAnthropic(
  apiKey: string,
  input: BatchInput,
): Promise<RawQuestion[]> {
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 16000,
    system: [
      {
        type: "text",
        text: `${systemPrompt(input.allowedTypes)}\n\nYou MUST respond by calling the submit_questions tool with your questions. Do not write anything outside the tool call.`,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [
      {
        name: "submit_questions",
        description:
          "Submit NCLEX-style practice questions derived strictly from the user's notes.",
        input_schema: questionsSchema as unknown as Anthropic.Tool["input_schema"],
      },
    ],
    tool_choice: { type: "tool", name: "submit_questions" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: userPrompt(input.notes, input.allowedTypes, input.count),
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
  const data = toolBlock.input as { questions?: RawQuestion[] };
  return Array.isArray(data.questions) ? data.questions : [];
}

async function generateBatchGemini(
  apiKey: string,
  input: BatchInput,
): Promise<RawQuestion[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt(input.allowedTypes) }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt(input.notes, input.allowedTypes, input.count) }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: questionsSchema,
        maxOutputTokens: 16000,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${body.slice(0, 300)}`);
  }
  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return [];
  let parsed: { questions?: RawQuestion[] };
  try {
    parsed = JSON.parse(text);
  } catch {
    return [];
  }
  return Array.isArray(parsed.questions) ? parsed.questions : [];
}

async function generateBatch(
  input: BatchInput,
  batchIdx: number,
): Promise<Question[]> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  let raws: RawQuestion[] = [];
  let lastErr: unknown = null;

  if (anthropicKey) {
    try {
      raws = await generateBatchAnthropic(anthropicKey, input);
    } catch (err) {
      lastErr = err;
      console.warn("Anthropic generation failed, attempting Gemini fallback:", err);
    }
  }

  if (raws.length === 0 && geminiKey) {
    try {
      raws = await generateBatchGemini(geminiKey, input);
    } catch (err) {
      lastErr = err;
    }
  }

  if (raws.length === 0) {
    if (lastErr) throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
    if (!anthropicKey && !geminiKey) {
      throw new Error(
        "Set ANTHROPIC_API_KEY or GEMINI_API_KEY in .env.local to enable quiz generation.",
      );
    }
    return [];
  }

  const questions: Question[] = [];
  raws.forEach((raw, idx) => {
    if (!input.allowedTypes.includes(raw.itemType)) return;
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
  if (!process.env.ANTHROPIC_API_KEY && !process.env.GEMINI_API_KEY) {
    throw new Error(
      "Set ANTHROPIC_API_KEY or GEMINI_API_KEY in .env.local to enable quiz generation.",
    );
  }

  const trimmedNotes = notes.trim();
  if (trimmedNotes.length < 80) {
    throw new Error(
      "These notes look too short. Paste at least a few sentences of study material.",
    );
  }

  const allowedTypes =
    itemTypes.length > 0
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
      generateBatch(
        {
          notes: trimmedNotes,
          allowedTypes,
          count: b.count,
        },
        b.batchIdx,
      ),
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
