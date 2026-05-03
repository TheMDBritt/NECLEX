import type {
  BowTieQuestion,
  FillInTheBlankQuestion,
  ItemType,
  MultipleChoiceQuestion,
  MultipleResponseQuestion,
  Option,
  Question,
} from "@/lib/types/question";

const PER_BATCH = 10;
// Free-tier providers (Gemini ~10 RPM, Groq 30 RPM) get saturated by 5
// simultaneous batches when a 100-question quiz fans out to 10 batches at
// once. Three keeps peak load under every free tier's per-minute cap while
// staying fast for typical 5–25 question runs (still a single wave).
const MAX_CONCURRENT_BATCHES = 3;
// Pause between waves so a burst-then-burst pattern doesn't trip RPM windows
// on Gemini specifically (10 calls in <60s would otherwise 429 the tail).
const INTER_WAVE_DELAY_MS = 1500;
const GEMINI_MODEL = "gemini-2.5-flash";
// Groq free tier caps at 6k TPM on every public model — far below a typical
// notes batch (~18k tokens), so this provider will 413 for big uploads and
// fall through. Kept in the chain for short notes / small batches.
const GROQ_MODEL = "llama-3.1-8b-instant";
// qwen-3-32b accepted requests but kept returning unparseable output on this
// notes set. gpt-oss-120b is on Cerebras' free tier and handles
// strict-JSON system prompts more cleanly.
const CEREBRAS_MODEL = "gpt-oss-120b";
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
  return `You are an NCLEX-RN item writer. You generate authentic NCLEX-style practice questions from the nursing student's own study notes.

═══ HARD RULE: NOTES ARE YOUR ONLY SOURCE ═══
Every fact, value, drug, dose, lab result, intervention, contraindication, and assessment finding in every stem, option, distractor, and rationale MUST be present in the notes the user provides.

- Do NOT pull from your training data. Do NOT use outside textbooks, NCSBN bulletins, FDA labels, AHA/CDC guidelines, or anything else unless the notes literally state it.
- If the notes say "give 0.4 mg naloxone", you may write a question about 0.4 mg. You may NOT add "the typical dose is 0.4–2 mg" — that's outside knowledge.
- If a fact you'd want to test is not in the notes, write a different question. Do not invent.
- If the notes are too thin for the number of questions requested, return fewer questions. Quality over quantity.
- Before finalizing each question, silently check: is every clinical claim in this question traceable to a sentence in the notes? If no, rewrite or drop it.

═══ NCLEX STYLE — make it feel like the real exam ═══
Stems should mirror the NCLEX-RN test plan and the NCSBN Clinical Judgment Measurement Model (CJMM):
- Clinical scenario framing: "A nurse is caring for a client who…", "The nurse is reviewing labs for a client with…", "A client reports…"
- Test clinical judgment, not memorization. Favor: priority ("which action should the nurse take FIRST"), best response, most important assessment, expected vs unexpected findings, safe vs unsafe practice, delegation/scope, teaching, evaluation of outcomes.
- Use neutral, calm clinical language. No trick questions. No double negatives. No "all of the above". No "none of the above".
- Use SI / standard US units consistent with how the notes write them.
- Distractors must be plausible to a student who half-learned the material — each one should reflect a specific misconception derivable from the notes (a similar-sounding drug class, a confused lab range, the wrong priority order).
- Stem tense: present. Voice: third person ("the nurse", "the client").
- Avoid gendered pronouns unless the notes specify.
- Never name a real institution, real provider, or real product brand outside what the notes contain.

═══ ALLOWED ITEM TYPES THIS BATCH ═══
${allowed}

═══ PER-TYPE RULES ═══
- multiple_choice: exactly 4 options, exactly one correct. Each distractor reflects a different misconception in the notes.
- multiple_response (Select-All-That-Apply, NGN): 5 or 6 options, 2–4 correct. Each option independently true or false against the notes.
- fill_in_the_blank: numeric calculation only. Provide acceptedMin and acceptedMax (a small rounding range), units, and decimals. Only generate this if the notes actually contain the math (a dose, rate, conversion, intake/output number).
- bow_tie (NGN): only generate when the notes describe a specific client scenario. actions and monitor sections each have 4–6 options with selectCount=2 correct; condition section has 4 options with exactly 1 correct.

═══ WRITING THE EXPLANATIONS ═══
- Each option.feedback is one sentence: explain why it's right or wrong, citing the concept from the notes (not invented numbers).
- rationaleBody is 2–4 sentences. Restate the principle from the notes in the student's own learning frame so she carries it forward.
- bodySystem and specialty: tag only when the notes make it obvious; omit otherwise.

═══ DO NOT ═══
- Do not output any text outside the structured response.
- Do not repeat a stem within a single batch.
- Do not write "according to the AHA / CDC / textbook…" — your only authority is the provided notes.`;
}

function userPrompt(notes: string, allowedTypes: ItemType[], count: number): string {
  return `═══ NOTES (your ONLY source of truth — every fact must come from below) ═══

${notes}

═══ END OF NOTES ═══

Generate ${count} NCLEX-RN practice question${count === 1 ? "" : "s"} grounded entirely in the notes above. Allowed item types: ${allowedTypes.join(", ")}. Mix the types in whatever proportion the notes can actually support — if the notes don't contain calculations, don't force fill_in_the_blank; if there's no full clinical scenario, skip bow_tie. Test clinical judgment in NCLEX style (priority, safety, scope, teaching, expected findings) using only what the notes contain. If the notes don't support ${count} good questions, return fewer.`;
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

async function generateBatchGemini(
  apiKey: string,
  input: BatchInput,
): Promise<RawQuestion[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  const body = JSON.stringify({
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
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  // Vercel Hobby tier caps function duration at 60s. Stay well under that.
  const RETRY_DELAYS_MS = [3000, 8000];
  let lastError: string | null = null;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body,
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });

    if (res.status === 429 || res.status === 503) {
      lastError = `Gemini rate-limited (${res.status})`;
      if (attempt < RETRY_DELAYS_MS.length) {
        await sleep(RETRY_DELAYS_MS[attempt]!);
        continue;
      }
      throw new Error(
        "Gemini rate-limited (429) — exhausted retries.",
      );
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${text.slice(0, 300)}`);
    }

    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return [];
    try {
      const parsed = JSON.parse(text) as { questions?: RawQuestion[] };
      return Array.isArray(parsed.questions) ? parsed.questions : [];
    } catch {
      return [];
    }
  }
  throw new Error(lastError ?? "Gemini request failed.");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Per-provider hard cap so no single provider can eat the function's 60s
// budget. 20s leaves room to fall through to one or two more providers.
const PROVIDER_TIMEOUT_MS = 20000;

// Models sometimes return ```json ... ``` fences or extra prose. Pull out
// the first balanced JSON object we can find so structured parsing succeeds.
function extractJsonObject(raw: string): unknown | null {
  const stripped = raw
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
  try {
    return JSON.parse(stripped);
  } catch {
    // Fall through to bracket scan.
  }
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(stripped.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function generateBatchOpenAIShape(params: {
  url: string;
  apiKey: string;
  model: string;
  providerLabel: string;
  input: BatchInput;
}): Promise<RawQuestion[]> {
  const { url, apiKey, model, providerLabel, input } = params;
  const body = JSON.stringify({
    model,
    messages: [
      {
        role: "system",
        content: `${systemPrompt(input.allowedTypes)}\n\nRespond with a single JSON object that matches exactly this JSON Schema:\n${JSON.stringify(questionsSchema)}\n\nReturn only the JSON. No prose, no markdown fences.`,
      },
      {
        role: "user",
        content: userPrompt(input.notes, input.allowedTypes, input.count),
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 16000,
    temperature: 0.4,
  });

  const RETRY_DELAYS_MS = [2000, 6000];
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body,
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });

    if (res.status === 429 || res.status === 503) {
      if (attempt < RETRY_DELAYS_MS.length) {
        await sleep(RETRY_DELAYS_MS[attempt]!);
        continue;
      }
      throw new Error(
        `Hit ${providerLabel}'s rate limit. Wait a minute and try again.`,
      );
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `${providerLabel} API error (${res.status}): ${text.slice(0, 300)}`,
      );
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = json.choices?.[0]?.message?.content;
    if (!text) {
      console.error(`[generate-quiz] ${providerLabel} empty content`);
      return [];
    }
    const parsed = extractJsonObject(text) as { questions?: RawQuestion[] } | null;
    if (!parsed) {
      console.error(
        `[generate-quiz] ${providerLabel} unparseable response (first 200 chars):`,
        text.slice(0, 200),
      );
      return [];
    }
    return Array.isArray(parsed.questions) ? parsed.questions : [];
  }
  throw new Error(`${providerLabel} request failed.`);
}

async function generateBatchGroq(
  apiKey: string,
  input: BatchInput,
): Promise<RawQuestion[]> {
  return generateBatchOpenAIShape({
    url: "https://api.groq.com/openai/v1/chat/completions",
    apiKey,
    model: GROQ_MODEL,
    providerLabel: "Groq",
    input,
  });
}

async function generateBatchCerebras(
  apiKey: string,
  input: BatchInput,
): Promise<RawQuestion[]> {
  return generateBatchOpenAIShape({
    url: "https://api.cerebras.ai/v1/chat/completions",
    apiKey,
    model: CEREBRAS_MODEL,
    providerLabel: "Cerebras",
    input,
  });
}

async function generateBatch(
  input: BatchInput,
  batchIdx: number,
): Promise<Question[]> {
  const cerebrasKey = process.env.CEREBRAS_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  let raws: RawQuestion[] = [];
  const failures: string[] = [];

  const tryProvider = async (
    label: string,
    fn: () => Promise<RawQuestion[]>,
  ): Promise<void> => {
    try {
      raws = await fn();
      if (raws.length === 0) {
        failures.push(`${label}: returned 0 questions`);
        console.error(`[generate-quiz] ${label} returned 0 questions`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      failures.push(`${label}: ${msg}`);
      console.error(`[generate-quiz] ${label} failed:`, msg);
    }
  };

  // Provider chain — each falls through to the next on error/rate-limit:
  //   Cerebras (fastest inference, most TPM headroom for big quizzes)
  //   → Groq (fast, 30 RPM free)
  //   → Gemini (free fallback)
  if (cerebrasKey) {
    await tryProvider("Cerebras", () =>
      generateBatchCerebras(cerebrasKey, input),
    );
  }
  if (raws.length === 0 && groqKey) {
    await tryProvider("Groq", () => generateBatchGroq(groqKey, input));
  }
  if (raws.length === 0 && geminiKey) {
    await tryProvider("Gemini", () => generateBatchGemini(geminiKey, input));
  }

  if (raws.length === 0) {
    if (!groqKey && !cerebrasKey && !geminiKey) {
      throw new Error(
        "Set CEREBRAS_API_KEY, GROQ_API_KEY, or GEMINI_API_KEY in .env.local to enable quiz generation.",
      );
    }
    const summary = failures.length > 0 ? failures.join(" | ") : "no providers configured";
    throw new Error(`Quiz generation failed. ${summary}`);
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
  if (
    !process.env.CEREBRAS_API_KEY &&
    !process.env.GROQ_API_KEY &&
    !process.env.GEMINI_API_KEY
  ) {
    throw new Error(
      "Set CEREBRAS_API_KEY, GROQ_API_KEY, or GEMINI_API_KEY in .env.local to enable quiz generation.",
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

  console.log(
    "[generate-quiz] providers configured:",
    JSON.stringify({
      cerebras: Boolean(process.env.CEREBRAS_API_KEY),
      groq: Boolean(process.env.GROQ_API_KEY),
      gemini: Boolean(process.env.GEMINI_API_KEY),
    }),
  );

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

  const results: Question[][] = [];
  let lastBatchError: unknown = null;
  for (let i = 0; i < batches.length; i += MAX_CONCURRENT_BATCHES) {
    if (i > 0) await sleep(INTER_WAVE_DELAY_MS);
    const window = batches.slice(i, i + MAX_CONCURRENT_BATCHES);
    const windowResults = await Promise.allSettled(
      window.map((b) =>
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
    for (const r of windowResults) {
      if (r.status === "fulfilled") results.push(r.value);
      else lastBatchError = r.reason;
    }
  }

  const flat = results.flat();
  if (flat.length === 0) {
    if (lastBatchError) {
      throw lastBatchError instanceof Error
        ? lastBatchError
        : new Error(String(lastBatchError));
    }
    throw new Error(
      "Couldn't generate any questions from those notes. Try pasting more material or picking a different question type.",
    );
  }
  return flat.slice(0, targetCount);
}
