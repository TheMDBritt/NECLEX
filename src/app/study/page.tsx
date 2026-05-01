import type { Metadata } from "next";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { PageFrame } from "@/components/shell/page-frame";
import { MultipleChoice } from "@/components/quiz/multiple-choice";
import type { MultipleChoiceQuestion } from "@/lib/types/question";

export const metadata: Metadata = {
  title: "Study",
};

/**
 * Seed item bank — written for accuracy and CJMM-step alignment. As the DB
 * comes online, these move into Supabase and are sourced via a server action.
 */
const seedItem: MultipleChoiceQuestion = {
  id: "seed-mc-001",
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

const SESSION_SEED = `session-${new Date().toISOString().slice(0, 10)}`;

export default function StudyPage() {
  return (
    <PageFrame>
      <Container size="md">
        <section className="pb-16 pt-12 sm:pt-16">
          <div className="flex items-center justify-between">
            <Eyebrow>Today's mix · 1 of 25</Eyebrow>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
              Untimed
            </p>
          </div>

          <div className="mt-8">
            <MultipleChoice question={seedItem} shuffleSeed={SESSION_SEED} />
          </div>

          <p className="mt-8 text-center font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            Take a breath between items. There's no rush.
          </p>
        </section>
      </Container>
    </PageFrame>
  );
}
