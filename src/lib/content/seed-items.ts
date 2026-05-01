/**
 * Seed item bank — every question SME-checked and source-cited.
 * Sources cited in each item's `rationale.sources`.
 *
 * Scope of this seed: a small mix across body systems and CJMM steps so
 * the early /study sessions feel varied. Real production items move into
 * Supabase as the content pipeline comes online.
 */

import type {
  MultipleChoiceQuestion,
  MultipleResponseQuestion,
  Question,
} from "@/lib/types/question";

const NCSBN_RN_PLAN = {
  label: "NCSBN 2026 NCLEX-RN Test Plan",
  url: "https://www.ncsbn.org/publications/2026-nclex-rn-test-plan",
};

export const seedMultipleChoiceItems: MultipleChoiceQuestion[] = [
  {
    id: "mc-renal-001",
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
        feedback: "Dietary potassium is appropriate teaching, but it is not the FIRST action.",
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
        feedback: "Continuing the diuretic would worsen the hypokalemia and dysrhythmia risk.",
      },
    ],
    rationale: {
      body: "Potassium of 3.0 mEq/L in a client on a loop diuretic with new muscle weakness places the client at risk for cardiac dysrhythmia. Priority action is to prevent further potassium loss by holding the next dose, then notify the provider so replacement can be ordered.",
      sources: [NCSBN_RN_PLAN, { label: "FDA label — furosemide (DailyMed)" }],
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
  },

  {
    id: "mc-cardiac-001",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is reviewing the rhythm strip of a client admitted with chest pain. The strip shows a regular rhythm at 78 bpm, P waves before each QRS, PR interval 0.16 seconds, and QRS 0.08 seconds. How should the nurse interpret this rhythm?",
    options: [
      {
        id: "a",
        label: "Normal sinus rhythm.",
        isCorrect: true,
        feedback:
          "All criteria for NSR are met: regular rhythm, rate 60–100, P before each QRS, PR 0.12–0.20 s, QRS < 0.12 s.",
      },
      {
        id: "b",
        label: "First-degree AV block.",
        isCorrect: false,
        feedback: "First-degree AV block requires PR interval > 0.20 s; this PR is 0.16 s.",
      },
      {
        id: "c",
        label: "Sinus tachycardia.",
        isCorrect: false,
        feedback: "Sinus tachycardia is a sinus rhythm > 100 bpm; this is 78 bpm.",
      },
      {
        id: "d",
        label: "Atrial fibrillation.",
        isCorrect: false,
        feedback:
          "Atrial fibrillation has an irregularly irregular rhythm with no discernible P waves.",
      },
    ],
    rationale: {
      body: "Normal sinus rhythm: rate 60–100, regular, P wave before every QRS, PR 0.12–0.20 s, QRS < 0.12 s. The strip described meets all five criteria.",
      sources: [NCSBN_RN_PLAN, { label: "American Heart Association — ACLS Provider Manual" }],
    },
    tags: {
      examTarget: "RN",
      clientNeed: "physiological-integrity",
      subCategory: "reduction-of-risk-potential",
      integratedProcess: "nursing-process",
      cjmmStep: "analyze-cues",
      bodySystem: "cardiac",
      contentTopic: "ekg-basics",
      specialty: "med-surg",
    },
  },

  {
    id: "mc-neuro-001",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse assesses a client 24 hours after a left-sided ischemic stroke. Which finding requires the MOST immediate intervention?",
    options: [
      {
        id: "a",
        label: "Right-sided weakness with intact gag reflex.",
        isCorrect: false,
        feedback:
          "Right-sided weakness is expected with a left-hemisphere stroke; safety teaching is appropriate but not immediate.",
      },
      {
        id: "b",
        label: "Expressive aphasia with frustration when speaking.",
        isCorrect: false,
        feedback:
          "Expressive (Broca) aphasia is expected with a left-hemisphere stroke; supportive communication is appropriate.",
      },
      {
        id: "c",
        label: "New onset of bradycardia, widening pulse pressure, and irregular respirations.",
        isCorrect: true,
        feedback:
          "Cushing's triad indicates rising intracranial pressure — a life-threatening change requiring immediate provider notification and intervention.",
      },
      {
        id: "d",
        label: "Mild headache controlled with acetaminophen.",
        isCorrect: false,
        feedback: "A controlled mild headache is expected post-stroke and does not require immediate action.",
      },
    ],
    rationale: {
      body: "Cushing's triad — bradycardia, widening pulse pressure, and irregular respirations — is a late sign of increased intracranial pressure and requires immediate intervention.",
      sources: [NCSBN_RN_PLAN, { label: "American Stroke Association guidelines (current)" }],
    },
    tags: {
      examTarget: "RN",
      clientNeed: "physiological-integrity",
      subCategory: "physiological-adaptation",
      integratedProcess: "nursing-process",
      cjmmStep: "prioritize-hypotheses",
      bodySystem: "neuro",
      contentTopic: "stroke",
      specialty: "med-surg",
    },
  },

  {
    id: "mc-pharm-001",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A client is starting warfarin 5 mg PO daily for atrial fibrillation. Which statement by the client requires further teaching?",
    options: [
      {
        id: "a",
        label: '"I will keep my green-leafy vegetable intake about the same each week."',
        isCorrect: false,
        feedback:
          "Consistent vitamin K intake is the correct teaching; sudden increases or decreases destabilize INR.",
      },
      {
        id: "b",
        label: '"I will switch to taking ibuprofen for my arthritis pain."',
        isCorrect: true,
        feedback:
          "NSAIDs increase bleeding risk in clients on warfarin and should be avoided. Acetaminophen is preferred. This statement requires correction.",
      },
      {
        id: "c",
        label: '"I will use a soft toothbrush and an electric razor."',
        isCorrect: false,
        feedback: "Bleeding precautions are correct teaching for warfarin therapy.",
      },
      {
        id: "d",
        label: '"I will get my INR checked at the schedule the clinic gives me."',
        isCorrect: false,
        feedback: "Routine INR monitoring is essential and is correct teaching.",
      },
    ],
    rationale: {
      body: "NSAIDs (including ibuprofen) inhibit platelet function and increase the risk of GI bleeding when combined with warfarin. Acetaminophen is the preferred analgesic. The other statements reflect correct teaching: consistent vitamin K intake, bleeding precautions, and INR monitoring.",
      sources: [NCSBN_RN_PLAN, { label: "FDA label — warfarin (DailyMed)" }],
    },
    tags: {
      examTarget: "RN",
      clientNeed: "physiological-integrity",
      subCategory: "pharmacological-and-parenteral-therapies",
      integratedProcess: "teaching-learning",
      cjmmStep: "evaluate-outcomes",
      bodySystem: "hematologic",
      contentTopic: "anticoagulants",
      specialty: "med-surg",
    },
  },

  {
    id: "mc-respiratory-001",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is teaching a client newly diagnosed with asthma about using a metered-dose inhaler with a spacer. Which instruction is correct?",
    options: [
      {
        id: "a",
        label: "Press the canister and inhale deeply through the mouth, then hold the breath for about 10 seconds.",
        isCorrect: true,
        feedback:
          "Slow deep inhalation followed by a 10-second breath hold maximizes deposition of medication in the lower airways.",
      },
      {
        id: "b",
        label: "Press the canister and exhale forcefully through the spacer.",
        isCorrect: false,
        feedback: "Exhaling through the spacer wastes the dose; the client should inhale through the spacer.",
      },
      {
        id: "c",
        label: "Take rapid shallow breaths through the spacer for 30 seconds after each puff.",
        isCorrect: false,
        feedback:
          "Rapid shallow breathing deposits drug in the upper airway, not the lungs; one slow deep breath per puff is correct.",
      },
      {
        id: "d",
        label: "Skip rinsing the mouth — it does not affect inhaled corticosteroids.",
        isCorrect: false,
        feedback:
          "When using inhaled corticosteroids, the client should rinse and spit after each use to prevent oral candidiasis.",
      },
    ],
    rationale: {
      body: "Correct MDI-with-spacer technique: shake, attach spacer, exhale fully, place mouthpiece in mouth, press canister once, inhale slowly and deeply, hold breath ~10 seconds, exhale slowly. With inhaled corticosteroids, rinse and spit afterward.",
      sources: [NCSBN_RN_PLAN, { label: "Global Initiative for Asthma (GINA) — patient education guide" }],
    },
    tags: {
      examTarget: "RN",
      clientNeed: "physiological-integrity",
      subCategory: "pharmacological-and-parenteral-therapies",
      integratedProcess: "teaching-learning",
      cjmmStep: "take-actions",
      bodySystem: "respiratory",
      contentTopic: "asthma",
      specialty: "med-surg",
    },
  },

  {
    id: "mc-peds-001",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is caring for a 4-month-old infant scheduled for a routine well-child visit. The infant's parent asks which immunizations are due. Per current CDC schedule, which combination is correct for the 4-month visit?",
    options: [
      {
        id: "a",
        label: "DTaP, Hib, IPV, PCV13 or PCV15, RV.",
        isCorrect: true,
        feedback:
          "These are the routinely scheduled 4-month vaccines per the CDC immunization schedule, mirroring the 2-month visit.",
      },
      {
        id: "b",
        label: "MMR and Varicella.",
        isCorrect: false,
        feedback: "MMR and Varicella are first given at 12–15 months of age, not at 4 months.",
      },
      {
        id: "c",
        label: "HepB only.",
        isCorrect: false,
        feedback:
          "HepB is given at birth, 1–2 months, and 6–18 months — not as the only vaccine at 4 months.",
      },
      {
        id: "d",
        label: "Influenza injectable only.",
        isCorrect: false,
        feedback: "Annual influenza vaccine begins at 6 months of age.",
      },
    ],
    rationale: {
      body: "The CDC routine immunization schedule for the 4-month visit includes DTaP, Hib, IPV, PCV (13 or 15), and RV (rotavirus). MMR and Varicella are first given at 12–15 months. Influenza begins at 6 months.",
      sources: [
        NCSBN_RN_PLAN,
        {
          label: "CDC Recommended Child and Adolescent Immunization Schedule",
          url: "https://www.cdc.gov/vaccines/schedules/hcp/imz/child-adolescent.html",
        },
      ],
    },
    tags: {
      examTarget: "RN",
      clientNeed: "health-promotion-and-maintenance",
      integratedProcess: "teaching-learning",
      cjmmStep: "generate-solutions",
      bodySystem: "immune",
      contentTopic: "immunizations",
      specialty: "peds",
    },
  },
];

export const seedMultipleResponseItems: MultipleResponseQuestion[] = [
  {
    id: "mr-cardiac-001",
    itemType: "multiple_response",
    scoringRule: "polytomous_plus_minus",
    stem:
      "A nurse is reviewing the medical record of a client admitted with new-onset heart failure. Which findings would the nurse expect to see in left-sided heart failure? Select all that apply.",
    options: [
      {
        id: "a",
        label: "Crackles auscultated bilaterally in the lung bases.",
        isCorrect: true,
        feedback: "Pulmonary congestion is a hallmark of left-sided HF.",
      },
      {
        id: "b",
        label: "Dyspnea on exertion and orthopnea.",
        isCorrect: true,
        feedback: "Backward pressure into the pulmonary circulation produces dyspnea and orthopnea.",
      },
      {
        id: "c",
        label: "Pink, frothy sputum.",
        isCorrect: true,
        feedback:
          "Pink, frothy sputum indicates pulmonary edema — an acute manifestation of left-sided failure.",
      },
      {
        id: "d",
        label: "Jugular venous distension.",
        isCorrect: false,
        feedback:
          "JVD is more characteristic of right-sided failure (systemic venous congestion).",
      },
      {
        id: "e",
        label: "Dependent peripheral edema.",
        isCorrect: false,
        feedback:
          "Peripheral edema is typically a right-sided HF finding, not isolated left-sided.",
      },
      {
        id: "f",
        label: "S3 gallop on cardiac auscultation.",
        isCorrect: true,
        feedback: "An S3 gallop reflects ventricular volume overload, common in left-sided HF.",
      },
    ],
    rationale: {
      body: "Left-sided heart failure causes blood to back up into the pulmonary circulation, producing pulmonary congestion: crackles, dyspnea on exertion, orthopnea, pink/frothy sputum (pulmonary edema), and an S3 gallop. JVD and dependent peripheral edema reflect systemic venous congestion and are signs of right-sided failure.",
      sources: [
        NCSBN_RN_PLAN,
        { label: "American Heart Association — heart failure clinical practice guidelines" },
      ],
    },
    tags: {
      examTarget: "RN",
      clientNeed: "physiological-integrity",
      subCategory: "physiological-adaptation",
      integratedProcess: "nursing-process",
      cjmmStep: "recognize-cues",
      bodySystem: "cardiac",
      contentTopic: "heart-failure",
      specialty: "med-surg",
    },
  },
];

/**
 * The combined session feed — a small mix of MC + SATA so /study has variety
 * out of the box.
 */
export const seedSession: Question[] = [
  seedMultipleChoiceItems[0]!,
  seedMultipleChoiceItems[1]!,
  seedMultipleResponseItems[0]!,
  seedMultipleChoiceItems[2]!,
  seedMultipleChoiceItems[3]!,
  seedMultipleChoiceItems[4]!,
  seedMultipleChoiceItems[5]!,
];
