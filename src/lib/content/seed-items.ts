/**
 * Seed item bank — every question SME-checked and source-cited.
 *
 * Scope: a working bank for early study sessions. Tagged across body system,
 * specialty, and CJMM step so the filter UI on /study can build sets.
 */

import type {
  BowTieQuestion,
  FillInTheBlankQuestion,
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
          "Hypokalemia in a client on a loop diuretic with new neuromuscular symptoms warrants immediate provider notification and holding the contributing medication.",
      },
      {
        id: "b",
        label: "Encourage the client to eat more bananas at lunch.",
        isCorrect: false,
        feedback: "Dietary potassium is appropriate teaching, but it is not the first action.",
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
      { id: "a", label: "Normal sinus rhythm.", isCorrect: true, feedback: "All criteria for NSR are met." },
      { id: "b", label: "First-degree AV block.", isCorrect: false, feedback: "Requires PR > 0.20 s." },
      { id: "c", label: "Sinus tachycardia.", isCorrect: false, feedback: "Sinus tachycardia is a sinus rhythm > 100 bpm." },
      { id: "d", label: "Atrial fibrillation.", isCorrect: false, feedback: "AF is irregularly irregular with no P waves." },
    ],
    rationale: {
      body: "Normal sinus rhythm: rate 60–100, regular, P wave before every QRS, PR 0.12–0.20 s, QRS < 0.12 s. The strip described meets all five criteria.",
      sources: [NCSBN_RN_PLAN, { label: "American Heart Association — ACLS Provider Manual" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "reduction-of-risk-potential", integratedProcess: "nursing-process", cjmmStep: "analyze-cues", bodySystem: "cardiac", contentTopic: "ekg-basics", specialty: "med-surg" },
  },

  {
    id: "mc-neuro-001",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse assesses a client 24 hours after a left-sided ischemic stroke. Which finding requires the MOST immediate intervention?",
    options: [
      { id: "a", label: "Right-sided weakness with intact gag reflex.", isCorrect: false, feedback: "Expected with a left-hemisphere stroke." },
      { id: "b", label: "Expressive aphasia with frustration when speaking.", isCorrect: false, feedback: "Broca aphasia is expected with left-hemisphere stroke." },
      { id: "c", label: "New onset of bradycardia, widening pulse pressure, and irregular respirations.", isCorrect: true, feedback: "Cushing's triad — late sign of rising ICP." },
      { id: "d", label: "Mild headache controlled with acetaminophen.", isCorrect: false, feedback: "Controlled mild headache is expected post-stroke." },
    ],
    rationale: {
      body: "Cushing's triad — bradycardia, widening pulse pressure, and irregular respirations — is a late sign of increased intracranial pressure and requires immediate intervention.",
      sources: [NCSBN_RN_PLAN, { label: "American Stroke Association guidelines (current)" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "nursing-process", cjmmStep: "prioritize-hypotheses", bodySystem: "neuro", contentTopic: "stroke", specialty: "med-surg" },
  },

  {
    id: "mc-pharm-001",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A client is starting warfarin 5 mg PO daily for atrial fibrillation. Which statement by the client requires further teaching?",
    options: [
      { id: "a", label: '"I will keep my green-leafy vegetable intake about the same each week."', isCorrect: false, feedback: "Consistent vitamin K intake is correct teaching." },
      { id: "b", label: '"I will switch to taking ibuprofen for my arthritis pain."', isCorrect: true, feedback: "NSAIDs increase bleed risk; acetaminophen is preferred." },
      { id: "c", label: '"I will use a soft toothbrush and an electric razor."', isCorrect: false, feedback: "Bleeding precautions are correct teaching." },
      { id: "d", label: '"I will get my INR checked at the schedule the clinic gives me."', isCorrect: false, feedback: "Routine INR monitoring is essential and correct." },
    ],
    rationale: {
      body: "NSAIDs (including ibuprofen) inhibit platelet function and increase the risk of GI bleeding when combined with warfarin. Acetaminophen is the preferred analgesic.",
      sources: [NCSBN_RN_PLAN, { label: "FDA label — warfarin (DailyMed)" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "pharmacological-and-parenteral-therapies", integratedProcess: "teaching-learning", cjmmStep: "evaluate-outcomes", bodySystem: "hematologic", contentTopic: "anticoagulants", specialty: "med-surg" },
  },

  {
    id: "mc-respiratory-001",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is teaching a client newly diagnosed with asthma about using a metered-dose inhaler with a spacer. Which instruction is correct?",
    options: [
      { id: "a", label: "Press the canister and inhale deeply through the mouth, then hold the breath for about 10 seconds.", isCorrect: true, feedback: "Slow deep inhalation + 10-second hold maximizes deposition." },
      { id: "b", label: "Press the canister and exhale forcefully through the spacer.", isCorrect: false, feedback: "The client should inhale through the spacer." },
      { id: "c", label: "Take rapid shallow breaths through the spacer for 30 seconds after each puff.", isCorrect: false, feedback: "Rapid shallow breathing deposits drug in the upper airway." },
      { id: "d", label: "Skip rinsing the mouth — it does not affect inhaled corticosteroids.", isCorrect: false, feedback: "Rinse and spit after ICS to prevent oral candidiasis." },
    ],
    rationale: {
      body: "Correct MDI-with-spacer technique: shake, attach spacer, exhale fully, place mouthpiece in mouth, press canister once, inhale slowly and deeply, hold breath ~10 seconds, exhale slowly. With inhaled corticosteroids, rinse and spit afterward.",
      sources: [NCSBN_RN_PLAN, { label: "Global Initiative for Asthma (GINA) — patient education guide" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "pharmacological-and-parenteral-therapies", integratedProcess: "teaching-learning", cjmmStep: "take-actions", bodySystem: "respiratory", contentTopic: "asthma", specialty: "med-surg" },
  },

  {
    id: "mc-peds-001",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is caring for a 4-month-old infant scheduled for a routine well-child visit. The parent asks which immunizations are due. Per current CDC schedule, which combination is correct for the 4-month visit?",
    options: [
      { id: "a", label: "DTaP, Hib, IPV, PCV13 or PCV15, RV.", isCorrect: true, feedback: "These are the routinely scheduled 4-month vaccines per CDC." },
      { id: "b", label: "MMR and Varicella.", isCorrect: false, feedback: "MMR and Varicella are first given at 12–15 months." },
      { id: "c", label: "HepB only.", isCorrect: false, feedback: "HepB is at birth, 1–2 mo, and 6–18 mo — not alone at 4 months." },
      { id: "d", label: "Influenza injectable only.", isCorrect: false, feedback: "Annual flu vaccine begins at 6 months." },
    ],
    rationale: {
      body: "The CDC routine immunization schedule for the 4-month visit includes DTaP, Hib, IPV, PCV (13 or 15), and RV (rotavirus).",
      sources: [
        NCSBN_RN_PLAN,
        { label: "CDC Recommended Child and Adolescent Immunization Schedule", url: "https://www.cdc.gov/vaccines/schedules/hcp/imz/child-adolescent.html" },
      ],
    },
    tags: { examTarget: "RN", clientNeed: "health-promotion-and-maintenance", integratedProcess: "teaching-learning", cjmmStep: "generate-solutions", bodySystem: "immune", contentTopic: "immunizations", specialty: "peds" },
  },

  {
    id: "mc-endo-001",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A client with type 1 diabetes reports feeling shaky, sweaty, and dizzy 2 hours after their morning insulin. A fingerstick blood glucose is 58 mg/dL. The client is awake and able to swallow. Which action should the nurse take FIRST?",
    options: [
      { id: "a", label: "Give 4 oz of orange juice.", isCorrect: true, feedback: "15 g of fast-acting carbs is the first-line treatment for conscious hypoglycemia." },
      { id: "b", label: "Administer glucagon 1 mg IM.", isCorrect: false, feedback: "Glucagon is reserved for unconscious or unable-to-swallow clients." },
      { id: "c", label: "Hold the next dose of insulin and notify the provider.", isCorrect: false, feedback: "Treat the hypoglycemia first; reassess insulin afterward." },
      { id: "d", label: "Give a peanut butter sandwich to prevent rebound hypoglycemia.", isCorrect: false, feedback: "A protein-and-carb snack is appropriate AFTER glucose normalizes, not first." },
    ],
    rationale: {
      body: "For conscious hypoglycemia, give 15 g of fast-acting carbohydrate (e.g., 4 oz juice, glucose tablets) and recheck in 15 minutes — the rule of 15s. A longer-acting snack follows if the next meal is more than an hour away.",
      sources: [NCSBN_RN_PLAN, { label: "American Diabetes Association — Standards of Care" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "nursing-process", cjmmStep: "take-actions", bodySystem: "endocrine", contentTopic: "diabetes", specialty: "med-surg" },
  },

  {
    id: "mc-gi-001",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is caring for a client with cirrhosis admitted for acute upper GI bleed. Which finding requires the MOST immediate notification of the provider?",
    options: [
      { id: "a", label: "BP 92/58 with HR 118.", isCorrect: true, feedback: "Hemodynamic instability indicates ongoing bleeding and possible shock." },
      { id: "b", label: "Hgb 9.8 g/dL on morning labs.", isCorrect: false, feedback: "Anemia is expected with GI bleed and warrants treatment but is not as immediate as instability." },
      { id: "c", label: "One episode of small black stool overnight.", isCorrect: false, feedback: "Melena is consistent with the diagnosis; trend matters." },
      { id: "d", label: "Mild ankle edema.", isCorrect: false, feedback: "Peripheral edema is common with cirrhosis." },
    ],
    rationale: {
      body: "Tachycardia with hypotension in an active GI bleed signals hypovolemic shock and requires immediate intervention — fluid resuscitation, blood products, and reassessment.",
      sources: [NCSBN_RN_PLAN],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "nursing-process", cjmmStep: "prioritize-hypotheses", bodySystem: "gi", contentTopic: "gi-bleed", specialty: "med-surg" },
  },

  {
    id: "mc-mh-001",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is admitting a client to an inpatient mental health unit who has expressed active suicidal ideation with a plan. Which intervention is the nurse's HIGHEST priority?",
    options: [
      { id: "a", label: "Place the client on continuous one-to-one observation and remove harmful objects.", isCorrect: true, feedback: "Safety is the top priority for active SI with a plan." },
      { id: "b", label: "Begin therapeutic communication about coping skills.", isCorrect: false, feedback: "Important, but not the immediate priority." },
      { id: "c", label: "Administer the prescribed antidepressant.", isCorrect: false, feedback: "Antidepressants take weeks to work; safety comes first." },
      { id: "d", label: "Schedule the client for cognitive behavioral therapy.", isCorrect: false, feedback: "CBT is helpful long-term but is not the immediate priority." },
    ],
    rationale: {
      body: "For a client with active suicidal ideation and a plan, the priority is keeping the client physically safe — usually one-to-one observation, environmental safety check, and removing means.",
      sources: [NCSBN_RN_PLAN, { label: "American Psychiatric Association — Practice Guidelines for Suicide Risk" }],
    },
    tags: { examTarget: "RN", clientNeed: "psychosocial-integrity", integratedProcess: "nursing-process", cjmmStep: "take-actions", bodySystem: "mental-health", contentTopic: "suicide-risk", specialty: "mental-health" },
  },

  {
    id: "mc-ob-001",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is assessing a client at 32 weeks gestation who reports a sudden severe headache, blurred vision, and epigastric pain. BP is 162/108. Which is the nurse's priority concern?",
    options: [
      { id: "a", label: "Severe preeclampsia with risk for eclampsia.", isCorrect: true, feedback: "These are severe-feature symptoms requiring urgent action." },
      { id: "b", label: "Normal third-trimester discomforts.", isCorrect: false, feedback: "These symptoms are not normal and require evaluation." },
      { id: "c", label: "Migraine headache.", isCorrect: false, feedback: "Cannot assume migraine in setting of HTN and visual changes during pregnancy." },
      { id: "d", label: "Gastroesophageal reflux disease.", isCorrect: false, feedback: "Epigastric pain in this setting suggests HELLP, not GERD." },
    ],
    rationale: {
      body: "BP ≥ 160/110 with severe headache, visual changes, or epigastric pain in pregnancy ≥ 20 weeks indicates preeclampsia with severe features and risk for eclampsia and HELLP syndrome. Magnesium sulfate seizure prophylaxis and antihypertensive therapy are typical next steps.",
      sources: [NCSBN_RN_PLAN, { label: "ACOG — Hypertension in Pregnancy guideline" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "nursing-process", cjmmStep: "analyze-cues", bodySystem: "repro", contentTopic: "preeclampsia", specialty: "ob" },
  },

  {
    id: "mc-infection-001",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is caring for a client with active pulmonary tuberculosis. Which type of isolation precautions is required?",
    options: [
      { id: "a", label: "Airborne precautions in a negative-pressure room with N95 respirator.", isCorrect: true, feedback: "TB requires airborne precautions per CDC." },
      { id: "b", label: "Droplet precautions with surgical mask.", isCorrect: false, feedback: "Droplet precautions cover larger particles like influenza, not TB." },
      { id: "c", label: "Contact precautions with gown and gloves only.", isCorrect: false, feedback: "Contact precautions are for organisms transmitted by direct or indirect contact." },
      { id: "d", label: "Standard precautions only.", isCorrect: false, feedback: "Standard precautions alone are insufficient for active TB." },
    ],
    rationale: {
      body: "Pulmonary TB is transmitted via airborne droplet nuclei. CDC requires a negative-pressure (AIIR) room and N95 (or higher) respiratory protection for staff entering the room.",
      sources: [NCSBN_RN_PLAN, { label: "CDC — Guidelines for Preventing Transmission of M. tuberculosis" }],
    },
    tags: { examTarget: "RN", clientNeed: "safe-and-effective-care-environment", subCategory: "safety-and-infection-control", integratedProcess: "nursing-process", cjmmStep: "take-actions", bodySystem: "respiratory", contentTopic: "tuberculosis", specialty: "med-surg" },
  },

  {
    id: "mc-pharm-002",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is preparing to administer digoxin 0.125 mg PO to a client with heart failure. The client's apical pulse is 54 beats per minute. Which is the nurse's BEST action?",
    options: [
      { id: "a", label: "Hold the dose and notify the provider.", isCorrect: true, feedback: "Hold for HR < 60 (adults); notify provider before next dose." },
      { id: "b", label: "Administer the dose as scheduled.", isCorrect: false, feedback: "Bradycardia is a contraindication for the next dose." },
      { id: "c", label: "Recheck the radial pulse instead.", isCorrect: false, feedback: "Apical is the standard for digoxin; recheck apical, not radial." },
      { id: "d", label: "Give half the dose and document the reason.", isCorrect: false, feedback: "Splitting a dose without an order is outside scope." },
    ],
    rationale: {
      body: "Hold digoxin and notify the provider when the apical heart rate is < 60 in adults (or < 70 in children, < 90 in infants). Administer only after provider review.",
      sources: [NCSBN_RN_PLAN, { label: "FDA label — digoxin (DailyMed)" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "pharmacological-and-parenteral-therapies", integratedProcess: "nursing-process", cjmmStep: "take-actions", bodySystem: "cardiac", contentTopic: "digoxin", specialty: "med-surg" },
  },

  {
    id: "mc-cardiac-002",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A client comes to the ED reporting chest pressure radiating to the left jaw and arm for 30 minutes. Which intervention should the nurse implement FIRST?",
    options: [
      { id: "a", label: "Obtain a 12-lead ECG.", isCorrect: true, feedback: "12-lead ECG is the priority diagnostic to identify STEMI within 10 minutes of arrival." },
      { id: "b", label: "Draw cardiac enzymes.", isCorrect: false, feedback: "Important and obtained early, but the ECG comes first." },
      { id: "c", label: "Administer morphine 4 mg IV.", isCorrect: false, feedback: "Treatment follows diagnosis; ECG first." },
      { id: "d", label: "Insert a urinary catheter for fluid balance.", isCorrect: false, feedback: "Not indicated and delays critical evaluation." },
    ],
    rationale: {
      body: "Per AHA chest-pain protocol, a 12-lead ECG within 10 minutes of arrival is the single highest-priority action — it determines whether the patient is having a STEMI and triggers reperfusion timing.",
      sources: [NCSBN_RN_PLAN, { label: "AHA Acute Coronary Syndrome Guidelines" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "nursing-process", cjmmStep: "take-actions", bodySystem: "cardiac", contentTopic: "acs", specialty: "med-surg" },
  },

  {
    id: "mc-respiratory-002",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is caring for a client with COPD on 2 L/min nasal cannula oxygen. The client becomes confused with an SpO2 of 95%. What is the nurse's PRIORITY action?",
    options: [
      { id: "a", label: "Lower the oxygen flow rate to 1 L/min.", isCorrect: true, feedback: "Suspect CO2 retention; reduce supplemental O2 to maintain SpO2 88–92%." },
      { id: "b", label: "Increase the oxygen flow rate to 4 L/min.", isCorrect: false, feedback: "Higher O2 in chronic CO2 retainers may worsen hypercapnia and AMS." },
      { id: "c", label: "Switch to a non-rebreather mask.", isCorrect: false, feedback: "Higher FiO2 worsens the problem." },
      { id: "d", label: "Encourage the client to take deep breaths.", isCorrect: false, feedback: "Helpful, but does not address the immediate cause." },
    ],
    rationale: {
      body: "In some clients with chronic CO2 retention, supplemental oxygen can suppress the hypoxic respiratory drive and cause hypercapnic encephalopathy. Target SpO2 88–92% with COPD; reduce O2 and reassess.",
      sources: [NCSBN_RN_PLAN, { label: "GOLD COPD report (current)" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "nursing-process", cjmmStep: "prioritize-hypotheses", bodySystem: "respiratory", contentTopic: "copd", specialty: "med-surg" },
  },

  {
    id: "mc-renal-002",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A client receiving IV vancomycin for MRSA bacteremia has a trough level of 24 mcg/mL (target 15–20) and a serum creatinine that has risen from 0.9 to 1.6 over 48 hours. What is the nurse's PRIORITY action?",
    options: [
      { id: "a", label: "Hold the next dose and notify the provider.", isCorrect: true, feedback: "Supratherapeutic trough + rising creatinine = nephrotoxicity risk; hold and call." },
      { id: "b", label: "Administer the next dose as scheduled.", isCorrect: false, feedback: "Continuing would worsen nephrotoxicity." },
      { id: "c", label: "Increase the IV fluid rate without further orders.", isCorrect: false, feedback: "Outside RN scope without an order." },
      { id: "d", label: "Document and reassess in 24 hours.", isCorrect: false, feedback: "Delays a needed intervention." },
    ],
    rationale: {
      body: "A vancomycin trough above target with a rising creatinine indicates evolving nephrotoxicity. Hold the next dose and notify the provider so the dose, level timing, or drug can be adjusted.",
      sources: [NCSBN_RN_PLAN, { label: "ASHP/IDSA Vancomycin Therapeutic Monitoring Guidelines" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "reduction-of-risk-potential", integratedProcess: "nursing-process", cjmmStep: "evaluate-outcomes", bodySystem: "renal", contentTopic: "antibiotics", specialty: "med-surg" },
  },

  {
    id: "mc-mh-002",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A client taking lithium for bipolar disorder presents to the clinic with new-onset coarse tremor, blurred vision, slurred speech, and confusion. Which is the nurse's PRIORITY action?",
    options: [
      { id: "a", label: "Hold the next lithium dose and obtain a stat lithium level.", isCorrect: true, feedback: "These are signs of lithium toxicity; hold and confirm with a level." },
      { id: "b", label: "Reassure the client these are common early side effects.", isCorrect: false, feedback: "Coarse tremor, slurring, and confusion are toxicity, not benign side effects." },
      { id: "c", label: "Increase the lithium dose for better mood control.", isCorrect: false, feedback: "Would worsen toxicity." },
      { id: "d", label: "Encourage extra coffee and decreased water.", isCorrect: false, feedback: "Caffeine and dehydration increase lithium toxicity risk." },
    ],
    rationale: {
      body: "Coarse tremor, ataxia, dysarthria, and confusion are classic signs of lithium toxicity (level usually > 1.5 mEq/L). Hold the medication, send a stat level, and prepare for IV fluids; severe toxicity may require dialysis.",
      sources: [NCSBN_RN_PLAN, { label: "FDA label — lithium (DailyMed)" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "pharmacological-and-parenteral-therapies", integratedProcess: "nursing-process", cjmmStep: "recognize-cues", bodySystem: "mental-health", contentTopic: "lithium", specialty: "mental-health" },
  },

  {
    id: "mc-peds-002",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A 6-year-old child is admitted with new-onset type 1 diabetes. Which finding requires the MOST immediate intervention?",
    options: [
      { id: "a", label: "Kussmaul respirations and a fruity breath odor.", isCorrect: true, feedback: "Indicates DKA — life-threatening." },
      { id: "b", label: "Increased thirst and urination.", isCorrect: false, feedback: "Classic but not immediately life-threatening." },
      { id: "c", label: "Blood glucose of 280 mg/dL.", isCorrect: false, feedback: "Elevated but expected at presentation." },
      { id: "d", label: "Recent weight loss of 4 lb.", isCorrect: false, feedback: "Common with new T1DM; not the immediate priority." },
    ],
    rationale: {
      body: "Kussmaul respirations and fruity (acetone) breath are signs of diabetic ketoacidosis. Priority interventions include IV fluids, IV insulin, and electrolyte (especially potassium) management.",
      sources: [NCSBN_RN_PLAN, { label: "ADA Standards of Care — DKA in pediatrics" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "nursing-process", cjmmStep: "prioritize-hypotheses", bodySystem: "endocrine", contentTopic: "dka", specialty: "peds" },
  },

  {
    id: "mc-ob-002",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse on a postpartum unit assesses a client 2 hours after a vaginal delivery. The fundus is boggy, displaced to the right, and the perineal pad is saturated. Which is the nurse's FIRST action?",
    options: [
      { id: "a", label: "Massage the fundus and assist the client to empty her bladder.", isCorrect: true, feedback: "Boggy, deviated fundus + bleeding = uterine atony with bladder distension." },
      { id: "b", label: "Administer methylergonovine 0.2 mg IM.", isCorrect: false, feedback: "Indicated, but check BP first; methylergonovine is contraindicated in HTN." },
      { id: "c", label: "Begin a 500 mL IV fluid bolus.", isCorrect: false, feedback: "Treats hemodynamic effect, not the cause; address the cause first." },
      { id: "d", label: "Notify the provider immediately without intervening.", isCorrect: false, feedback: "Notification will follow, but first-action interventions are within RN scope." },
    ],
    rationale: {
      body: "A boggy fundus deviated from midline often indicates a full bladder preventing uterine contraction. Massage the fundus to firmness and help the client void. If atony persists, escalate to medications (oxytocin, methylergonovine if not hypertensive, carboprost, misoprostol).",
      sources: [NCSBN_RN_PLAN, { label: "AWHONN — Postpartum Hemorrhage Practice Brief" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "nursing-process", cjmmStep: "take-actions", bodySystem: "repro", contentTopic: "postpartum-hemorrhage", specialty: "ob" },
  },

  {
    id: "mc-delegation-001",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A charge nurse is making assignments. Which task is appropriate to delegate to unlicensed assistive personnel (UAP)?",
    options: [
      { id: "a", label: "Recording intake and output for a stable post-op client.", isCorrect: true, feedback: "I&O on a stable client is within UAP scope." },
      { id: "b", label: "Performing the initial admission assessment of a new client.", isCorrect: false, feedback: "Initial assessment must be done by an RN." },
      { id: "c", label: "Teaching a newly diagnosed diabetic client about insulin injection technique.", isCorrect: false, feedback: "Patient teaching is the RN's responsibility." },
      { id: "d", label: "Administering a scheduled IV antibiotic.", isCorrect: false, feedback: "IV medication administration is outside UAP scope." },
    ],
    rationale: {
      body: "UAPs may perform tasks that are routine, predictable, and have low risk: I&O on stable clients, vital signs, ADL assistance, ambulation. Initial assessment, teaching, and medication administration remain RN responsibilities.",
      sources: [NCSBN_RN_PLAN, { label: "NCSBN — National Guidelines for Nursing Delegation" }],
    },
    tags: { examTarget: "RN", clientNeed: "safe-and-effective-care-environment", subCategory: "management-of-care", integratedProcess: "nursing-process", cjmmStep: "generate-solutions", bodySystem: "multisystem", contentTopic: "delegation", specialty: "leadership" },
  },
  {
    id: "mc-neuro-002",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is caring for a client with a traumatic brain injury and ICP of 22 mm Hg (normal < 15). Which intervention should the nurse implement?",
    options: [
      { id: "a", label: "Elevate the head of the bed to 30 degrees with the head in midline alignment.", isCorrect: true, feedback: "Promotes venous drainage from the brain — first-line non-invasive ICP management." },
      { id: "b", label: "Cluster nursing care to allow long uninterrupted rest periods.", isCorrect: false, feedback: "Clustering activities causes spikes in ICP — space them out." },
      { id: "c", label: "Suction the airway every 2 hours regardless of need.", isCorrect: false, feedback: "Suctioning increases ICP — perform only when clinically indicated." },
      { id: "d", label: "Position the client in a knee-chest position.", isCorrect: false, feedback: "Hip flexion increases intra-abdominal pressure and ICP." },
    ],
    rationale: {
      body: "HOB at 30° with neutral head alignment promotes cerebral venous drainage and is a first-line ICP-lowering measure. Avoid neck flexion/rotation, hip flexion, clustering of stimulating activities, and unnecessary suctioning — all increase ICP.",
      sources: [NCSBN_RN_PLAN, { label: "AANN — Care of the Patient with Increased ICP" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "nursing-process", cjmmStep: "take-actions", bodySystem: "neuro", contentTopic: "icp", specialty: "med-surg" },
  },
  {
    id: "mc-neuro-003",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A client with a generalized tonic-clonic seizure begins seizing in the bed. What is the nurse's PRIORITY action?",
    options: [
      { id: "a", label: "Turn the client onto their side and protect the head.", isCorrect: true, feedback: "Side-lying position prevents aspiration; padding protects from injury." },
      { id: "b", label: "Insert a tongue blade between the teeth to prevent biting.", isCorrect: false, feedback: "Never put anything in the mouth during a seizure — risk of dental injury and airway obstruction." },
      { id: "c", label: "Restrain the client's arms and legs until the seizure stops.", isCorrect: false, feedback: "Restraining can cause fractures and joint injury." },
      { id: "d", label: "Begin a fingerstick blood glucose immediately.", isCorrect: false, feedback: "Glucose check follows safety; airway and protection come first." },
    ],
    rationale: {
      body: "During an active seizure, the priority is safety: side-lying position to maintain airway and reduce aspiration, padding/clearing the area, and timing the seizure. Never insert objects into the mouth or restrain limbs.",
      sources: [NCSBN_RN_PLAN, { label: "Epilepsy Foundation — First Aid Guidelines" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "nursing-process", cjmmStep: "take-actions", bodySystem: "neuro", contentTopic: "seizure", specialty: "med-surg" },
  },
  {
    id: "mc-neuro-004",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A client with myasthenia gravis presents to the ED with severe muscle weakness, difficulty breathing, and increased respiratory secretions. Which finding helps differentiate myasthenic crisis from cholinergic crisis?",
    options: [
      { id: "a", label: "Improvement after edrophonium (Tensilon) test indicates myasthenic crisis.", isCorrect: true, feedback: "Myasthenic crisis improves with anticholinesterase; cholinergic crisis worsens." },
      { id: "b", label: "Both crises are managed identically with high-dose anticholinesterase.", isCorrect: false, feedback: "They are opposite — anticholinesterase helps one and worsens the other." },
      { id: "c", label: "Bradycardia and pinpoint pupils indicate myasthenic crisis.", isCorrect: false, feedback: "Those are cholinergic excess findings (SLUDGEM)." },
      { id: "d", label: "Cholinergic crisis is treated with neostigmine.", isCorrect: false, feedback: "Neostigmine WORSENS cholinergic crisis. Treat with atropine." },
    ],
    rationale: {
      body: "Myasthenic crisis = too little ACh activity (under-medicated) — improves with anticholinesterase. Cholinergic crisis = too much ACh activity (over-medicated) — worsens with anticholinesterase, presents with SLUDGEM signs, and is treated with atropine. Both can compromise respiratory muscles and need ICU support.",
      sources: [NCSBN_RN_PLAN, { label: "AAN — Myasthenia Gravis Management" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "nursing-process", cjmmStep: "analyze-cues", bodySystem: "neuro", contentTopic: "myasthenia-gravis", specialty: "med-surg" },
  },
  {
    id: "mc-cardiac-003",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse identifies a wide QRS rhythm at 180 bpm with no P waves on a client who is awake and reports palpitations and lightheadedness. BP is 102/68. What is the nurse's PRIORITY action?",
    options: [
      { id: "a", label: "Stay with the client, prepare for synchronized cardioversion if instability worsens, and notify the provider.", isCorrect: true, feedback: "Stable wide-complex tachycardia — prepare but do not yet cardiovert." },
      { id: "b", label: "Begin chest compressions immediately.", isCorrect: false, feedback: "The client has a pulse and is awake — compressions are not indicated." },
      { id: "c", label: "Apply defibrillator pads and shock at 200 J unsynchronized.", isCorrect: false, feedback: "Defibrillation is for pulseless VT/VF, not stable VT." },
      { id: "d", label: "Encourage the client to bear down for vagal maneuver.", isCorrect: false, feedback: "Vagal maneuvers are for SVT (narrow complex), not VT." },
    ],
    rationale: {
      body: "Wide-complex tachycardia with a pulse in a stable patient: monitor closely, IV access, 12-lead ECG, antidysrhythmic per ACLS (amiodarone or procainamide), prepare for synchronized cardioversion if instability develops. Defibrillation is reserved for pulseless rhythms.",
      sources: [NCSBN_RN_PLAN, { label: "AHA ACLS Guidelines (current)" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "reduction-of-risk-potential", integratedProcess: "nursing-process", cjmmStep: "prioritize-hypotheses", bodySystem: "cardiac", contentTopic: "dysrhythmias", specialty: "med-surg" },
  },
  {
    id: "mc-cardiac-004",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is teaching a client about a new permanent pacemaker. Which client statement requires further teaching?",
    options: [
      { id: "a", label: '"I should avoid contact sports and heavy lifting on that side for several weeks."', isCorrect: false, feedback: "Correct teaching during pocket healing." },
      { id: "b", label: '"I should hold my cell phone to the opposite ear from the pacemaker."', isCorrect: false, feedback: "Correct precaution." },
      { id: "c", label: '"I should walk through MRI machines without concern as long as I tell the tech."', isCorrect: true, feedback: "Standard pacemakers are MRI-incompatible unless specifically labeled MRI-conditional." },
      { id: "d", label: '"I will check my pulse daily and report any new dizziness or fainting."', isCorrect: false, feedback: "Appropriate self-monitoring." },
    ],
    rationale: {
      body: "Standard pacemakers are MRI-unsafe — MRI scanners can heat the leads and disrupt programming. MRI-conditional pacemakers exist but require verification of the device model, careful programming, and an in-magnet supervised scan. Other teaching points (avoiding lifting, holding phones to opposite ear, daily pulse) are correct.",
      sources: [NCSBN_RN_PLAN, { label: "Heart Rhythm Society — Pacemaker Patient Education" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "reduction-of-risk-potential", integratedProcess: "teaching-learning", cjmmStep: "evaluate-outcomes", bodySystem: "cardiac", contentTopic: "pacemaker", specialty: "med-surg" },
  },
  {
    id: "mc-respiratory-003",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A client is admitted with suspected pulmonary embolism after a long flight. Which assessment finding most strongly supports this diagnosis?",
    options: [
      { id: "a", label: "Sudden onset of pleuritic chest pain, dyspnea, and tachycardia.", isCorrect: true, feedback: "Classic PE triad." },
      { id: "b", label: "Productive cough with green sputum for one week.", isCorrect: false, feedback: "Suggests pneumonia, not PE." },
      { id: "c", label: "Bilateral lower-extremity edema with weight gain over months.", isCorrect: false, feedback: "Suggests right-sided heart failure." },
      { id: "d", label: "Wheezing improved with bronchodilator.", isCorrect: false, feedback: "Suggests reactive airway disease." },
    ],
    rationale: {
      body: "PE classically presents with sudden pleuritic chest pain, dyspnea, and tachycardia. Risk factors (Virchow's triad) include immobility, hypercoagulability, and venous injury. Prolonged flight is a classic risk. Initial workup: D-dimer, CT-PA, anticoagulation while awaiting imaging.",
      sources: [NCSBN_RN_PLAN, { label: "ACCP — VTE Management Guidelines" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "nursing-process", cjmmStep: "recognize-cues", bodySystem: "respiratory", contentTopic: "pe", specialty: "med-surg" },
  },
  {
    id: "mc-respiratory-004",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is caring for a client with a chest tube to a closed water-seal drainage system. The nurse notes continuous bubbling in the water-seal chamber. What does this indicate?",
    options: [
      { id: "a", label: "An air leak in the system or in the client's lung.", isCorrect: true, feedback: "Continuous bubbling = air leak; intermittent bubbling on exhalation is normal." },
      { id: "b", label: "Normal functioning of the drainage system.", isCorrect: false, feedback: "Only intermittent bubbling on exhalation is normal." },
      { id: "c", label: "The chest tube needs to be clamped immediately.", isCorrect: false, feedback: "Clamping a chest tube can cause tension pneumothorax." },
      { id: "d", label: "The system requires more sterile water in the suction chamber.", isCorrect: false, feedback: "Suction chamber bubbling is separate from water-seal bubbling." },
    ],
    rationale: {
      body: "Continuous bubbling in the water-seal chamber indicates an air leak. Check the system from the dressing outward for loose connections, then assess the client's lung. Never clamp a chest tube without an order — it can cause tension pneumothorax.",
      sources: [NCSBN_RN_PLAN, { label: "AACN — Procedure Manual" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "reduction-of-risk-potential", integratedProcess: "nursing-process", cjmmStep: "analyze-cues", bodySystem: "respiratory", contentTopic: "chest-tube", specialty: "med-surg" },
  },
  {
    id: "mc-gi-002",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is admitting a client with acute pancreatitis. Which intervention should the nurse anticipate?",
    options: [
      { id: "a", label: "NPO with IV fluids and pain control.", isCorrect: true, feedback: "Bowel rest reduces pancreatic stimulation; IV fluids prevent third-spacing shock." },
      { id: "b", label: "High-fat diet to provide calorie support.", isCorrect: false, feedback: "Fat is the strongest pancreatic stimulant — contraindicated." },
      { id: "c", label: "Encourage ambulation to relieve pain.", isCorrect: false, feedback: "Pain often improves with knee-to-chest, not ambulation." },
      { id: "d", label: "Administer oral promethazine for nausea.", isCorrect: false, feedback: "While NPO, antiemetics are given IV." },
    ],
    rationale: {
      body: "Acute pancreatitis management: NPO (bowel rest), aggressive IV fluid resuscitation, opioid pain control, and treat the underlying cause. Knee-to-chest or fetal position can ease pain. Resume nutrition once symptoms improve.",
      sources: [NCSBN_RN_PLAN, { label: "American College of Gastroenterology — Pancreatitis Guidelines" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "nursing-process", cjmmStep: "generate-solutions", bodySystem: "gi", contentTopic: "pancreatitis", specialty: "med-surg" },
  },
  {
    id: "mc-gi-003",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is caring for a client with cirrhosis and worsening hepatic encephalopathy. Which medication does the nurse expect to administer?",
    options: [
      { id: "a", label: "Lactulose.", isCorrect: true, feedback: "Lowers ammonia levels by trapping it in the colon for excretion." },
      { id: "b", label: "Acetaminophen.", isCorrect: false, feedback: "Hepatotoxic in cirrhosis — avoid or use cautiously." },
      { id: "c", label: "Diphenhydramine for sleep.", isCorrect: false, feedback: "Sedatives worsen encephalopathy." },
      { id: "d", label: "Ondansetron with a high dose of opioid for comfort.", isCorrect: false, feedback: "Opioids are dangerous in encephalopathy and are metabolized poorly in cirrhosis." },
    ],
    rationale: {
      body: "Hepatic encephalopathy is treated with lactulose, which acidifies the colon and traps ammonia (NH3 → NH4+) for excretion. Goal is 2–3 soft stools per day. Rifaximin may be added. Avoid sedatives, opioids, and acetaminophen in cirrhosis when possible.",
      sources: [NCSBN_RN_PLAN, { label: "AASLD — Hepatic Encephalopathy Guidelines" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "pharmacological-and-parenteral-therapies", integratedProcess: "nursing-process", cjmmStep: "generate-solutions", bodySystem: "gi", contentTopic: "cirrhosis", specialty: "med-surg" },
  },
  {
    id: "mc-renal-003",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A client with end-stage renal disease has just completed hemodialysis. Which finding should the nurse report to the provider?",
    options: [
      { id: "a", label: "Drop in blood pressure to 88/54 with new dizziness.", isCorrect: true, feedback: "Hypotension after dialysis is common but symptomatic — needs evaluation." },
      { id: "b", label: "Weight loss of 2 kg from pre-dialysis weight.", isCorrect: false, feedback: "Expected — represents fluid removed during dialysis." },
      { id: "c", label: "Mild fatigue for several hours after dialysis.", isCorrect: false, feedback: "Common and expected." },
      { id: "d", label: "Bruit and thrill present at the AV fistula site.", isCorrect: false, feedback: "These are normal and expected findings — confirm fistula patency." },
    ],
    rationale: {
      body: "Symptomatic hypotension after dialysis (especially with dizziness) signals over-removal of fluid or rapid volume shift — notify the provider. Weight loss reflects fluid removed (expected), and bruit/thrill at the fistula confirm patency (also expected).",
      sources: [NCSBN_RN_PLAN, { label: "ANNA — Standards of Practice for Nephrology Nursing" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "reduction-of-risk-potential", integratedProcess: "nursing-process", cjmmStep: "evaluate-outcomes", bodySystem: "renal", contentTopic: "dialysis", specialty: "med-surg" },
  },
  {
    id: "mc-endo-002",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is caring for a client newly diagnosed with hyperthyroidism. Which finding requires the MOST urgent action?",
    options: [
      { id: "a", label: "T 39.8°C, HR 142, BP 168/96, agitation, and altered mental status.", isCorrect: true, feedback: "Thyroid storm — life-threatening." },
      { id: "b", label: "Reports of feeling warm and intolerant of heat.", isCorrect: false, feedback: "Common in hyperthyroidism." },
      { id: "c", label: "Weight loss of 5 lb over the past 6 weeks.", isCorrect: false, feedback: "Expected with hyperthyroidism." },
      { id: "d", label: "Mild tremor of the hands at rest.", isCorrect: false, feedback: "Common finding." },
    ],
    rationale: {
      body: "Thyroid storm presents with high fever, severe tachycardia/HTN, altered mental status, and possible cardiac dysrhythmias. Treatment includes beta-blockers, antithyroid drugs (PTU or methimazole), iodine, glucocorticoids, and supportive care.",
      sources: [NCSBN_RN_PLAN, { label: "American Thyroid Association — Hyperthyroidism Guidelines" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "nursing-process", cjmmStep: "prioritize-hypotheses", bodySystem: "endocrine", contentTopic: "thyroid", specialty: "med-surg" },
  },
  {
    id: "mc-endo-003",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A client with newly diagnosed hypothyroidism is starting levothyroxine. Which client teaching is correct?",
    options: [
      { id: "a", label: '"Take it on an empty stomach in the morning, 30–60 minutes before food, and avoid taking calcium or iron at the same time."', isCorrect: true, feedback: "Standard correct teaching for absorption." },
      { id: "b", label: '"Take it with breakfast for best absorption."', isCorrect: false, feedback: "Food significantly reduces absorption." },
      { id: "c", label: '"Stop the medication once symptoms improve."', isCorrect: false, feedback: "Lifelong therapy." },
      { id: "d", label: '"Double the dose if you miss a day."', isCorrect: false, feedback: "Take the missed dose if remembered the same day; do not double up." },
    ],
    rationale: {
      body: "Levothyroxine should be taken on an empty stomach 30–60 minutes before food (or at bedtime > 3 h after the last meal). Calcium, iron, and PPIs reduce absorption. Therapy is lifelong and dose adjustments are based on TSH every 6–8 weeks initially.",
      sources: [NCSBN_RN_PLAN, { label: "FDA label — levothyroxine (DailyMed)" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "pharmacological-and-parenteral-therapies", integratedProcess: "teaching-learning", cjmmStep: "evaluate-outcomes", bodySystem: "endocrine", contentTopic: "thyroid", specialty: "med-surg" },
  },
  {
    id: "mc-mh-003",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is caring for a client experiencing alcohol withdrawal 48 hours after admission. The client is tremulous, diaphoretic, anxious, and reports seeing bugs on the wall. What is the nurse's PRIORITY?",
    options: [
      { id: "a", label: "Implement seizure precautions and administer scheduled benzodiazepines.", isCorrect: true, feedback: "Withdrawal seizures peak 24–48 h; DTs at 48–96 h. Benzos are first-line." },
      { id: "b", label: "Restrain the client to prevent self-harm.", isCorrect: false, feedback: "Restraints are last resort and require an order." },
      { id: "c", label: "Reassure the client that the bugs are not real.", isCorrect: false, feedback: "Reality reorientation is supportive but not the priority over safety." },
      { id: "d", label: "Encourage the client to drink coffee for stimulation.", isCorrect: false, feedback: "Caffeine may worsen anxiety and tremor." },
    ],
    rationale: {
      body: "Severe alcohol withdrawal (DTs) carries 1–4% mortality. Priority: seizure precautions, benzodiazepines (lorazepam, diazepam, chlordiazepoxide) titrated with CIWA-Ar, IV fluids, thiamine BEFORE glucose to prevent Wernicke encephalopathy, and folate.",
      sources: [NCSBN_RN_PLAN, { label: "ASAM — Alcohol Withdrawal Management Guidelines" }],
    },
    tags: { examTarget: "RN", clientNeed: "psychosocial-integrity", integratedProcess: "nursing-process", cjmmStep: "prioritize-hypotheses", bodySystem: "mental-health", contentTopic: "substance-use", specialty: "mental-health" },
  },
  {
    id: "mc-peds-003",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is caring for an infant admitted with bronchiolitis from RSV. Which intervention is most important?",
    options: [
      { id: "a", label: "Suction the nares with bulb syringe before feedings.", isCorrect: true, feedback: "Clearing nasal secretions improves feeding and reduces respiratory effort." },
      { id: "b", label: "Administer prescribed antibiotics promptly.", isCorrect: false, feedback: "RSV is viral; antibiotics are not indicated." },
      { id: "c", label: "Encourage solid foods to maintain calorie intake.", isCorrect: false, feedback: "Inappropriate for infant developmental stage." },
      { id: "d", label: "Place the infant prone for sleep.", isCorrect: false, feedback: "Always place infants supine — Back to Sleep." },
    ],
    rationale: {
      body: "RSV bronchiolitis care is supportive: suction nares before feedings (small frequent breastfeeding or formula), maintain hydration, monitor SpO2, and administer humidified oxygen as needed. Use contact + droplet isolation. Antibiotics are not indicated unless secondary bacterial infection develops.",
      sources: [NCSBN_RN_PLAN, { label: "AAP — Bronchiolitis Clinical Practice Guideline" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "basic-care-and-comfort", integratedProcess: "nursing-process", cjmmStep: "generate-solutions", bodySystem: "respiratory", contentTopic: "rsv", specialty: "peds" },
  },
  {
    id: "mc-peds-004",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A 2-year-old admitted with possible meningitis is irritable, febrile, and has a stiff neck. Which positioning is appropriate to keep the child comfortable?",
    options: [
      { id: "a", label: "Side-lying with the head and neck flexed naturally, room dim and quiet.", isCorrect: false, feedback: "Neck flexion worsens meningismus pain." },
      { id: "b", label: "Side-lying without neck flexion, room dim and quiet, minimal stimulation.", isCorrect: true, feedback: "Avoids worsening pain; reduces seizure-trigger stimuli." },
      { id: "c", label: "Prone, brightly lit room with active stimulation.", isCorrect: false, feedback: "Stimulation worsens irritability and increases ICP risk." },
      { id: "d", label: "High Fowler with the chin tucked to the chest.", isCorrect: false, feedback: "Chin tuck = neck flexion = pain." },
    ],
    rationale: {
      body: "For meningitis, avoid neck flexion (worsens meningismus and ICP), keep the environment dim and quiet to reduce seizure triggers, and place on droplet precautions until 24 h of effective antibiotics for bacterial cause.",
      sources: [NCSBN_RN_PLAN, { label: "CDC — Meningitis Clinical Resources" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "basic-care-and-comfort", integratedProcess: "nursing-process", cjmmStep: "generate-solutions", bodySystem: "neuro", contentTopic: "meningitis", specialty: "peds" },
  },
  {
    id: "mc-ob-003",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse is monitoring a client in active labor. The fetal heart rate suddenly drops to 80 bpm and remains there for over 90 seconds. What is the nurse's FIRST action?",
    options: [
      { id: "a", label: "Reposition the client to her left side.", isCorrect: true, feedback: "Repositioning relieves cord compression and improves placental perfusion." },
      { id: "b", label: "Begin chest compressions on the maternal client.", isCorrect: false, feedback: "Mother is not in arrest." },
      { id: "c", label: "Stop monitoring and document the finding.", isCorrect: false, feedback: "Failure to act on a non-reassuring tracing." },
      { id: "d", label: "Increase the rate of oxytocin if running.", isCorrect: false, feedback: "Increasing oxytocin worsens hyperstimulation and fetal distress." },
    ],
    rationale: {
      body: "Prolonged decelerations (> 90 s but < 10 min) are non-reassuring and require immediate intrauterine resuscitation: reposition (left side), stop oxytocin if infusing, give IV fluid bolus, administer oxygen 10 L/min via non-rebreather, and notify the provider.",
      sources: [NCSBN_RN_PLAN, { label: "AWHONN — Intrapartum Fetal Heart Monitoring" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "reduction-of-risk-potential", integratedProcess: "nursing-process", cjmmStep: "take-actions", bodySystem: "repro", contentTopic: "fetal-monitoring", specialty: "ob" },
  },
  {
    id: "mc-pharm-003",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A client is receiving IV heparin per protocol. The morning aPTT is 95 seconds (control 30, therapeutic 1.5–2.5× control). What action should the nurse take FIRST?",
    options: [
      { id: "a", label: "Hold the heparin infusion and notify the provider.", isCorrect: true, feedback: "aPTT well above therapeutic — bleeding risk; hold and adjust." },
      { id: "b", label: "Increase the heparin rate per the high-aPTT box of the protocol.", isCorrect: false, feedback: "Backwards — increase is for sub-therapeutic." },
      { id: "c", label: "Administer protamine sulfate without an order.", isCorrect: false, feedback: "Antidote requires an order." },
      { id: "d", label: "Continue the current rate and recheck in 6 hours.", isCorrect: false, feedback: "Bleeding could occur in the interim." },
    ],
    rationale: {
      body: "An aPTT > 2.5× control is supratherapeutic and increases bleeding risk. Most heparin nomograms direct the nurse to hold the infusion for a defined period and decrease the rate. Notify the provider per protocol and assess the client for bleeding.",
      sources: [NCSBN_RN_PLAN, { label: "FDA label — heparin (DailyMed)" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "pharmacological-and-parenteral-therapies", integratedProcess: "nursing-process", cjmmStep: "evaluate-outcomes", bodySystem: "hematologic", contentTopic: "heparin", specialty: "med-surg" },
  },
  {
    id: "mc-pharm-004",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A client is prescribed prednisone 40 mg PO daily long-term. Which finding requires immediate provider notification?",
    options: [
      { id: "a", label: "Black tarry stools and reports of new midline back pain.", isCorrect: true, feedback: "GI bleed and possible vertebral compression fracture — adverse effects of chronic steroids." },
      { id: "b", label: "Mild facial fullness and weight gain over weeks.", isCorrect: false, feedback: "Expected with chronic steroid use." },
      { id: "c", label: "Mood changes including increased irritability.", isCorrect: false, feedback: "Common; report if severe but not as urgent." },
      { id: "d", label: "Insomnia for two nights after dose increase.", isCorrect: false, feedback: "Common; manage by morning dosing." },
    ],
    rationale: {
      body: "Chronic corticosteroids cause peptic ulcer disease (GI bleed → black stools) and osteoporosis (vertebral compression fractures → midline back pain). These warrant urgent evaluation. Cushingoid features, mood changes, and insomnia are expected and managed with monitoring and morning dosing.",
      sources: [NCSBN_RN_PLAN, { label: "FDA label — prednisone (DailyMed)" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "pharmacological-and-parenteral-therapies", integratedProcess: "nursing-process", cjmmStep: "recognize-cues", bodySystem: "multisystem", contentTopic: "corticosteroids", specialty: "med-surg" },
  },
  {
    id: "mc-safety-001",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A nurse witnesses another nurse remove a client's medication from the dispensing cabinet, walk to the supply room, and pocket the syringe. What is the appropriate action?",
    options: [
      { id: "a", label: "Report the observed behavior to the charge nurse and complete a written incident report.", isCorrect: true, feedback: "Mandatory reporting protects clients and meets professional/legal duty." },
      { id: "b", label: "Confront the nurse privately and ask them to return the medication.", isCorrect: false, feedback: "Confrontation does not protect future clients and undermines investigation." },
      { id: "c", label: "Document only if the client reports inadequate pain control later.", isCorrect: false, feedback: "Reporting is required regardless of client outcome." },
      { id: "d", label: "Ignore the event because it could be misinterpreted.", isCorrect: false, feedback: "Failing to report violates the duty to clients and the public." },
    ],
    rationale: {
      body: "Suspected medication diversion must be reported promptly to the charge nurse, supervisor, or per institutional policy. Most state nurse practice acts and the ANA Code of Ethics impose a mandatory duty to report. Document objectively what was observed.",
      sources: [NCSBN_RN_PLAN, { label: "ANA Code of Ethics for Nurses" }],
    },
    tags: { examTarget: "RN", clientNeed: "safe-and-effective-care-environment", subCategory: "management-of-care", integratedProcess: "nursing-process", cjmmStep: "take-actions", bodySystem: "multisystem", contentTopic: "ethics-legal", specialty: "leadership" },
  },
  {
    id: "mc-immune-001",
    itemType: "multiple_choice",
    scoringRule: "dichotomous",
    stem:
      "A client with HIV has a CD4 count of 180 cells/mm³. Which prophylactic medication does the nurse anticipate the provider ordering?",
    options: [
      { id: "a", label: "Trimethoprim-sulfamethoxazole (TMP-SMX) for Pneumocystis pneumonia prophylaxis.", isCorrect: true, feedback: "Started when CD4 < 200 to prevent PCP." },
      { id: "b", label: "Vancomycin for all gram-positive organisms.", isCorrect: false, feedback: "Not used as primary HIV prophylaxis." },
      { id: "c", label: "Acyclovir for routine prophylaxis at any CD4.", isCorrect: false, feedback: "Used for known HSV/VZV, not routine HIV prophylaxis." },
      { id: "d", label: "Prednisone for immune support.", isCorrect: false, feedback: "Steroids further suppress immunity." },
    ],
    rationale: {
      body: "CD4 < 200 cells/mm³ defines AIDS and warrants Pneumocystis jirovecii pneumonia (PCP) prophylaxis with TMP-SMX (or dapsone if sulfa allergy). Below 50, MAC prophylaxis with azithromycin is added. Antiretroviral therapy is the foundation.",
      sources: [NCSBN_RN_PLAN, { label: "DHHS HIV Adult Opportunistic Infection Guidelines" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "pharmacological-and-parenteral-therapies", integratedProcess: "nursing-process", cjmmStep: "generate-solutions", bodySystem: "immune", contentTopic: "hiv", specialty: "med-surg" },
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
      { id: "a", label: "Crackles auscultated bilaterally in the lung bases.", isCorrect: true, feedback: "Pulmonary congestion is a hallmark of left-sided HF." },
      { id: "b", label: "Dyspnea on exertion and orthopnea.", isCorrect: true, feedback: "Backward pressure into the pulmonary circulation produces dyspnea and orthopnea." },
      { id: "c", label: "Pink, frothy sputum.", isCorrect: true, feedback: "Indicates pulmonary edema." },
      { id: "d", label: "Jugular venous distension.", isCorrect: false, feedback: "JVD is more characteristic of right-sided failure." },
      { id: "e", label: "Dependent peripheral edema.", isCorrect: false, feedback: "Peripheral edema is typically a right-sided HF finding." },
      { id: "f", label: "S3 gallop on cardiac auscultation.", isCorrect: true, feedback: "Reflects ventricular volume overload." },
    ],
    rationale: {
      body: "Left-sided heart failure causes blood to back up into the pulmonary circulation, producing pulmonary congestion: crackles, dyspnea on exertion, orthopnea, pink/frothy sputum (pulmonary edema), and an S3 gallop. JVD and dependent peripheral edema reflect systemic venous congestion and are signs of right-sided failure.",
      sources: [NCSBN_RN_PLAN, { label: "American Heart Association — heart failure clinical practice guidelines" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "nursing-process", cjmmStep: "recognize-cues", bodySystem: "cardiac", contentTopic: "heart-failure", specialty: "med-surg" },
  },

  {
    id: "mr-renal-001",
    itemType: "multiple_response",
    scoringRule: "polytomous_plus_minus",
    stem:
      "A nurse is monitoring a client with chronic kidney disease for signs of hyperkalemia. Which findings should the nurse report? Select all that apply.",
    options: [
      { id: "a", label: "Peaked T waves on ECG.", isCorrect: true, feedback: "Classic ECG change with hyperkalemia." },
      { id: "b", label: "Muscle weakness and twitching.", isCorrect: true, feedback: "Neuromuscular instability with hyperkalemia." },
      { id: "c", label: "Diarrhea.", isCorrect: true, feedback: "GI hyperactivity is a feature of hyperkalemia." },
      { id: "d", label: "Polyuria.", isCorrect: false, feedback: "Polyuria is more characteristic of hypokalemia or hyperglycemia." },
      { id: "e", label: "Bradycardia or AV block.", isCorrect: true, feedback: "Severe hyperkalemia causes conduction delays." },
      { id: "f", label: "Constipation.", isCorrect: false, feedback: "Constipation is associated with hypokalemia, not hyper-." },
    ],
    rationale: {
      body: "Hyperkalemia (K+ > 5.0) produces neuromuscular irritability (weakness, twitching), GI hyperactivity (diarrhea, cramping), and dangerous cardiac changes (peaked T waves progressing to widened QRS, AV blocks). Treat with calcium gluconate (membrane stabilization), insulin + dextrose, and Kayexalate or dialysis.",
      sources: [NCSBN_RN_PLAN],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "nursing-process", cjmmStep: "recognize-cues", bodySystem: "renal", contentTopic: "electrolytes", specialty: "med-surg" },
  },

  {
    id: "mr-sepsis-001",
    itemType: "multiple_response",
    scoringRule: "polytomous_plus_minus",
    stem:
      "A nurse is caring for a client suspected of having sepsis. According to the Surviving Sepsis Campaign hour-1 bundle, which actions should be initiated within the first hour? Select all that apply.",
    options: [
      { id: "a", label: "Measure lactate level.", isCorrect: true, feedback: "Hour-1 bundle component." },
      { id: "b", label: "Obtain blood cultures BEFORE administering antibiotics.", isCorrect: true, feedback: "Cultures before antibiotics — bundle requirement." },
      { id: "c", label: "Administer broad-spectrum antibiotics.", isCorrect: true, feedback: "Within the first hour." },
      { id: "d", label: "Begin IV crystalloid 30 mL/kg for hypotension or lactate ≥ 4.", isCorrect: true, feedback: "Initial fluid resuscitation per bundle." },
      { id: "e", label: "Administer vasopressors only after fluid resuscitation is complete.", isCorrect: false, feedback: "Vasopressors are added during or after fluids if MAP < 65 — not delayed until fluids are 'complete.'" },
      { id: "f", label: "Wait for chest X-ray results before starting antibiotics.", isCorrect: false, feedback: "Antibiotics should not be delayed for imaging." },
    ],
    rationale: {
      body: "The Surviving Sepsis Campaign hour-1 bundle: measure lactate, obtain blood cultures before antibiotics, give broad-spectrum antibiotics, begin 30 mL/kg crystalloid for hypotension or lactate ≥ 4, and add vasopressors during/after fluid resuscitation if MAP < 65 mm Hg. Do not delay antibiotics for diagnostics.",
      sources: [
        NCSBN_RN_PLAN,
        { label: "Surviving Sepsis Campaign — hour-1 bundle", url: "https://www.sccm.org/SurvivingSepsisCampaign/Guidelines/Adult-Patients" },
      ],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "nursing-process", cjmmStep: "take-actions", bodySystem: "multisystem", contentTopic: "sepsis", specialty: "med-surg" },
  },

  {
    id: "mr-pharm-001",
    itemType: "multiple_response",
    scoringRule: "polytomous_plus_minus",
    stem:
      "A nurse is reinforcing teaching for a client newly prescribed metoprolol for hypertension. Which statements indicate the client understands the teaching? Select all that apply.",
    options: [
      { id: "a", label: '"I will check my pulse before each dose and call if it is below 60."', isCorrect: true, feedback: "Hold and notify for HR < 60 — correct teaching." },
      { id: "b", label: '"I will rise slowly from sitting or lying to prevent dizziness."', isCorrect: true, feedback: "Orthostatic hypotension is common — slow position changes prevent falls." },
      { id: "c", label: '"I will not stop this medication suddenly even if I feel fine."', isCorrect: true, feedback: "Abrupt discontinuation can cause rebound hypertension and ischemia." },
      { id: "d", label: '"If I feel my heart racing, I should double the dose."', isCorrect: false, feedback: "Doubling a dose is unsafe; call the provider for symptoms." },
      { id: "e", label: '"This medication will cure my high blood pressure."', isCorrect: false, feedback: "Antihypertensives manage but do not cure HTN; lifestyle changes still matter." },
      { id: "f", label: '"I should report any new shortness of breath or swelling in my legs."', isCorrect: true, feedback: "These can signal worsening heart failure — appropriate to report." },
    ],
    rationale: {
      body: "Beta-blocker teaching emphasizes pulse monitoring (hold for HR < 60), orthostatic precautions, never stopping abruptly, and reporting signs of HF or hypoglycemia masking. Antihypertensives manage but do not cure HTN, and clients should never adjust their own dose.",
      sources: [NCSBN_RN_PLAN, { label: "FDA label — metoprolol (DailyMed)" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "pharmacological-and-parenteral-therapies", integratedProcess: "teaching-learning", cjmmStep: "evaluate-outcomes", bodySystem: "cardiac", contentTopic: "beta-blockers", specialty: "med-surg" },
  },

  {
    id: "mr-falls-001",
    itemType: "multiple_response",
    scoringRule: "polytomous_plus_minus",
    stem:
      "A nurse is implementing fall precautions for a high-risk older adult on a medical unit. Which interventions are appropriate? Select all that apply.",
    options: [
      { id: "a", label: "Keep the bed in the lowest position with brakes locked.", isCorrect: true, feedback: "Standard fall precaution." },
      { id: "b", label: "Place the call light within easy reach and instruct the client to use it.", isCorrect: true, feedback: "Reduces unsupervised attempts to get up." },
      { id: "c", label: "Apply four-side rails up at all times to keep the client in bed.", isCorrect: false, feedback: "Four side rails are considered a restraint and increase entrapment and injury risk if the client climbs over." },
      { id: "d", label: "Provide non-slip footwear during ambulation.", isCorrect: true, feedback: "Reduces slip falls." },
      { id: "e", label: "Use a bed alarm for the client with a history of unassisted ambulation.", isCorrect: true, feedback: "Bed alarms alert staff to attempts to rise." },
      { id: "f", label: "Restrict family from bringing reading glasses or hearing aids during the hospital stay.", isCorrect: false, feedback: "Sensory aids should be available — they reduce fall risk." },
    ],
    rationale: {
      body: "Fall-prevention bundles include low bed with brakes, accessible call light, non-slip footwear, bed/chair alarms for high-risk clients, and ensuring sensory aids (glasses, hearing aids) are in use. Four side rails up is a restraint and is contraindicated; clients tend to climb over and fall from a greater height.",
      sources: [NCSBN_RN_PLAN, { label: "AHRQ — Preventing Falls in Hospitals Toolkit" }],
    },
    tags: { examTarget: "RN", clientNeed: "safe-and-effective-care-environment", subCategory: "safety-and-infection-control", integratedProcess: "nursing-process", cjmmStep: "generate-solutions", bodySystem: "multisystem", contentTopic: "falls", specialty: "med-surg" },
  },
];

export const seedFillInTheBlankItems: FillInTheBlankQuestion[] = [
  {
    id: "fitb-calc-001",
    itemType: "fill_in_the_blank",
    scoringRule: "dichotomous",
    stem:
      "A provider orders 1,000 mL of 0.9% normal saline to infuse over 8 hours. The IV pump is calibrated in mL/hr. At what rate should the nurse set the pump? Round to the nearest whole number.",
    acceptedMin: 125,
    acceptedMax: 125,
    units: "mL/hr",
    decimals: 0,
    rationale: {
      body: "Volume ÷ time = rate.\n1,000 mL ÷ 8 hr = 125 mL/hr.",
      sources: [NCSBN_RN_PLAN, { label: "Lippincott Drug Calculations for Nurses" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "pharmacological-and-parenteral-therapies", integratedProcess: "nursing-process", cjmmStep: "take-actions", bodySystem: "multisystem", contentTopic: "iv-calc", specialty: "med-surg" },
  },
  {
    id: "fitb-calc-002",
    itemType: "fill_in_the_blank",
    scoringRule: "dichotomous",
    stem:
      "An order reads heparin 25,000 units in 250 mL D5W to infuse at 18 units/kg/hr for a client weighing 70 kg. At what rate (mL/hr) should the nurse set the pump? Round to the nearest tenth.",
    acceptedMin: 12.5,
    acceptedMax: 12.7,
    units: "mL/hr",
    decimals: 1,
    rationale: {
      body:
        "Step 1 — units per hour: 18 units/kg/hr × 70 kg = 1,260 units/hr.\nStep 2 — concentration: 25,000 units ÷ 250 mL = 100 units/mL.\nStep 3 — mL/hr: 1,260 units/hr ÷ 100 units/mL = 12.6 mL/hr.",
      sources: [NCSBN_RN_PLAN, { label: "FDA label — heparin (DailyMed)" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "pharmacological-and-parenteral-therapies", integratedProcess: "nursing-process", cjmmStep: "take-actions", bodySystem: "hematologic", contentTopic: "heparin-calc", specialty: "med-surg" },
  },
  {
    id: "fitb-calc-003",
    itemType: "fill_in_the_blank",
    scoringRule: "dichotomous",
    stem:
      "A pediatric client weighs 18 kg and is prescribed amoxicillin 50 mg/kg/day in three divided doses. How many milligrams should the nurse give per single dose?",
    acceptedMin: 300,
    acceptedMax: 300,
    units: "mg",
    decimals: 0,
    rationale: {
      body:
        "Step 1 — total daily dose: 50 mg/kg × 18 kg = 900 mg/day.\nStep 2 — per dose: 900 mg ÷ 3 doses = 300 mg per dose.",
      sources: [NCSBN_RN_PLAN, { label: "Lippincott Pediatric Drug Reference" }],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "pharmacological-and-parenteral-therapies", integratedProcess: "nursing-process", cjmmStep: "take-actions", bodySystem: "multisystem", contentTopic: "peds-dose-calc", specialty: "peds" },
  },
];

export const seedBowTieItems: BowTieQuestion[] = [
  {
    id: "bt-sepsis-001",
    itemType: "bow_tie",
    scoringRule: "polytomous_rationale",
    stem:
      "A nurse assesses a 68-year-old client admitted with a 2-day history of cough and fever. Vital signs: T 38.9°C, HR 118, BP 88/52, RR 26, SpO2 92% on room air. Lactate 3.2 mmol/L. WBC 16,500/mm³. The client appears confused.",
    actions: {
      selectCount: 2,
      options: [
        { id: "a1", label: "Obtain blood cultures before starting antibiotics.", isCorrect: true, feedback: "Hour-1 sepsis bundle." },
        { id: "a2", label: "Begin a 30 mL/kg crystalloid IV bolus.", isCorrect: true, feedback: "Initial fluid resuscitation per Surviving Sepsis Campaign." },
        { id: "a3", label: "Administer a PO antipyretic and recheck in 2 hours.", isCorrect: false, feedback: "Delays critical resuscitation." },
        { id: "a4", label: "Schedule a CT scan in the morning.", isCorrect: false, feedback: "Imaging is not the priority while the client is shocked." },
        { id: "a5", label: "Hold all IV fluids until urine output is documented.", isCorrect: false, feedback: "Withholding fluids worsens shock." },
      ],
    },
    condition: {
      options: [
        { id: "c1", label: "Septic shock.", isCorrect: true, feedback: "MAP < 65 with lactate > 2 in suspected infection." },
        { id: "c2", label: "Cardiogenic shock.", isCorrect: false, feedback: "No primary cardiac event described." },
        { id: "c3", label: "Hypovolemic shock from GI bleed.", isCorrect: false, feedback: "No GI loss described." },
        { id: "c4", label: "Anaphylactic shock.", isCorrect: false, feedback: "No allergen exposure or skin findings described." },
      ],
    },
    monitor: {
      selectCount: 2,
      options: [
        { id: "m1", label: "Mean arterial pressure.", isCorrect: true, feedback: "Goal MAP ≥ 65 mm Hg." },
        { id: "m2", label: "Serial lactate levels.", isCorrect: true, feedback: "Trends reflect tissue perfusion." },
        { id: "m3", label: "Blood glucose every 4 hours only.", isCorrect: false, feedback: "Tighter monitoring is needed in critical illness." },
        { id: "m4", label: "Bowel sounds every 8 hours.", isCorrect: false, feedback: "Lower priority in acute resuscitation." },
        { id: "m5", label: "Hair growth on extremities.", isCorrect: false, feedback: "Not a sepsis-relevant parameter." },
      ],
    },
    rationale: {
      body:
        "The presentation — fever, tachycardia, hypotension, tachypnea, altered mental status, leukocytosis, lactate > 2 — meets criteria for septic shock with end-organ dysfunction. The Surviving Sepsis Campaign hour-1 bundle requires obtaining cultures BEFORE giving antibiotics, starting broad-spectrum antibiotics, and administering 30 mL/kg of crystalloid for hypotension or lactate ≥ 4. Ongoing monitoring focuses on MAP (goal ≥ 65) and serial lactates as markers of tissue perfusion.",
      sources: [
        NCSBN_RN_PLAN,
        { label: "Surviving Sepsis Campaign — Hour-1 Bundle", url: "https://www.sccm.org/SurvivingSepsisCampaign/Guidelines/Adult-Patients" },
      ],
    },
    tags: { examTarget: "RN", clientNeed: "physiological-integrity", subCategory: "physiological-adaptation", integratedProcess: "clinical-judgment", cjmmStep: "take-actions", bodySystem: "multisystem", contentTopic: "sepsis", specialty: "med-surg" },
  },
];

/**
 * The combined session feed — every seed item. The /study filter UI lets the
 * learner narrow this down by body system, specialty, or item type.
 */
export const seedSession: Question[] = [
  ...seedMultipleChoiceItems,
  ...seedMultipleResponseItems,
  ...seedFillInTheBlankItems,
  ...seedBowTieItems,
];
