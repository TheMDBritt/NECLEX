import type { Metadata } from "next";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { PageFrame } from "@/components/shell/page-frame";
import { MultipleChoice } from "@/components/quiz/multiple-choice";
import type { MultipleChoiceQuestion } from "@/lib/types/question";

export const metadata: Metadata = {
  title: "Demo · A single question, fully shown",
  description:
    "A look at how a single NCLEX-style multiple-choice item is rendered, scored, and reviewed.",
};

/**
 * Demo question — written for accuracy and CJMM-step alignment, but kept
 * short for the marketing surface. Real production items live in the DB.
 */
const demoQuestion: MultipleChoiceQuestion = {
  id: "demo-mc-001",
  itemType: "multiple_choice",
  scoringRule: "dichotomous",
  stem:
    "A nurse is caring for a client receiving furosemide 40 mg PO daily. Morning labs show a serum potassium of 3.0 mEq/L (normal 3.5–5.0). The client reports new muscle weakness. Which action should the nurse take FIRST?",
  options: [
    {
      id: "a",
      label: "Hold the next furosemide dose and notify the provider.",
      isCorrect: true,
      feedback:
        "Hypokalemia in a client on a loop diuretic with new neuromuscular symptoms warrants immediate provider notification and holding the contributing medication while orders are obtained.",
    },
    {
      id: "b",
      label: "Encourage the client to eat more bananas at lunch.",
      isCorrect: false,
      feedback:
        "Dietary potassium is appropriate teaching, but it does not address the immediate risk and is not the FIRST action.",
    },
    {
      id: "c",
      label: "Document the lab value and reassess in four hours.",
      isCorrect: false,
      feedback:
        "Documentation alone delays treatment; potassium of 3.0 with symptoms requires intervention now.",
    },
    {
      id: "d",
      label: "Administer the next scheduled furosemide dose as ordered.",
      isCorrect: false,
      feedback:
        "Continuing the diuretic would worsen the hypokalemia and increase the risk of dysrhythmia.",
    },
  ],
  rationale: {
    body:
      "A potassium of 3.0 mEq/L in a client on a loop diuretic with new muscle weakness places the client at risk for cardiac dysrhythmia. The priority nursing action is to prevent further potassium loss by holding the next dose, then notify the provider so replacement (oral or IV) can be ordered. This question maps to the CJMM step Take Actions and the Reduction of Risk Potential client need.",
    sources: [
      {
        label: "NCSBN 2026 NCLEX-RN Test Plan",
        url: "https://www.ncsbn.org/publications/2026-nclex-rn-test-plan",
      },
      { label: "FDA label — furosemide (DailyMed)" },
      { label: "Lippincott Drug Guide for Nurses" },
    ],
  },
  tags: {
    examTarget: "RN",
    clientNeed: "physiological-integrity",
    subCategory: "reduction-of-risk-potential",
    integratedProcess: "nursing-process",
    cjmmStep: "take-actions",
    bodySystem: "renal",
    contentTopic: "electrolytes",
    specialty: "med-surg",
  },
};

/**
 * In production, the seed comes from the persisted attempt row. Here we use
 * a fixed string so screenshots and the marketing demo are stable. Visit the
 * page repeatedly and option order will be the same; change the seed and it
 * shuffles.
 */
const DEMO_SEED = "demo-attempt-2026-05-01";

export default function QuestionDemoPage() {
  return (
    <PageFrame>
      <Container size="md">
        <section className="pb-24 pt-20 sm:pt-28 lg:pt-32">
          <Eyebrow>Demo · One full question</Eyebrow>
          <h1 className="mt-4 max-w-[24ch] font-display text-[clamp(2rem,4.6vw,3.5rem)] font-light leading-[1.08] tracking-[-0.025em] text-ink">
            How a single item is rendered, scored, and reviewed.
          </h1>
          <p className="mt-6 max-w-[58ch] font-body text-[1.0625rem] leading-[1.65] text-ink-soft">
            This is exactly the layout a learner sees during a study session — soft typography,
            warm feedback, full rationale with cited sources. Option order shuffles per attempt;
            the seed is persisted so review mode replays what was actually shown.
          </p>

          <div className="mt-12">
            <MultipleChoice question={demoQuestion} shuffleSeed={DEMO_SEED} />
          </div>
        </section>
      </Container>
    </PageFrame>
  );
}
