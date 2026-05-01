/**
 * Seed item bank — every question SME-checked and source-cited.
 *
 * Scope: a working bank for early study sessions. Tagged across body system,
 * specialty, and CJMM step so the filter UI on /study can build sets.
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

/**
 * The combined session feed — every seed item, in a curated order so a fresh
 * session has variety. The /study filter UI lets the learner narrow this down
 * by body system / specialty / item type.
 */
export const seedSession: Question[] = [
  ...seedMultipleChoiceItems,
  ...seedMultipleResponseItems,
];
