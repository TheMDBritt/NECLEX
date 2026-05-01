export type MnemonicKind = "acronym" | "sentence" | "image" | "song";

export interface Mnemonic {
  id: string;
  title: string;
  kind: MnemonicKind;
  /** Display label (free text). */
  topic: string;
  /** Topic slug for filtering (kebab-case). */
  topicSlug: string;
  body: string;
  /** Lines, where each line corresponds to one letter (acronyms) or one beat (songs). */
  lines: { key: string; meaning: string }[];
  /** Why this matters clinically. */
  clinical: string;
  source?: string;
}

export const mnemonics: Mnemonic[] = [
  {
    id: "rome",
    title: "ROME",
    kind: "acronym",
    topic: "ABG interpretation",
    topicSlug: "abg",
    body: "Acid-base direction at a glance.",
    lines: [
      { key: "R", meaning: "Respiratory" },
      { key: "O", meaning: "Opposite — pH and PaCO2 move opposite directions" },
      { key: "M", meaning: "Metabolic" },
      { key: "E", meaning: "Equal — pH and HCO3- move the same direction" },
    ],
    clinical:
      "Quick way to tell whether an ABG abnormality is respiratory or metabolic. If pH and PaCO2 move opposite, it's respiratory; if pH and HCO3- move together, it's metabolic.",
  },
  {
    id: "mona",
    title: "MONA",
    kind: "acronym",
    topic: "Acute MI initial care",
    topicSlug: "acs",
    body: "First moves for suspected MI in the ED (sequence varies by protocol).",
    lines: [
      { key: "M", meaning: "Morphine (severe pain unresponsive to nitrates)" },
      { key: "O", meaning: "Oxygen (only if SpO2 < 90% per current guidelines)" },
      { key: "N", meaning: "Nitroglycerin SL — three doses, 5 minutes apart" },
      { key: "A", meaning: "Aspirin 162–325 mg, chewed" },
    ],
    clinical:
      "Modern AHA guidance gives oxygen only if hypoxemic and uses morphine cautiously, but MONA is still the most common NCLEX framework.",
  },
  {
    id: "cushings-triad",
    title: "Cushing's triad",
    kind: "sentence",
    topic: "Increased intracranial pressure",
    topicSlug: "icp",
    body: "Late, life-threatening sign of rising ICP.",
    lines: [
      { key: "1", meaning: "Bradycardia" },
      { key: "2", meaning: "Widening pulse pressure (rising systolic, stable diastolic)" },
      { key: "3", meaning: "Irregular respirations (Cheyne-Stokes / apneustic)" },
    ],
    clinical:
      "All three together mean the body is compensating for a pressure crisis in the cranium — call the provider, prepare for ICP-lowering measures.",
  },
  {
    id: "5ps-compartment",
    title: "5 Ps of compartment syndrome",
    kind: "acronym",
    topic: "Limb assessment after fracture",
    topicSlug: "compartment-syndrome",
    body: "Findings that demand immediate action.",
    lines: [
      { key: "P", meaning: "Pain — out of proportion, worsens with passive stretch" },
      { key: "P", meaning: "Pallor" },
      { key: "P", meaning: "Pulselessness (late)" },
      { key: "P", meaning: "Paresthesia" },
      { key: "P", meaning: "Paralysis (late)" },
    ],
    clinical:
      "If even pain-out-of-proportion appears, escalate. Waiting for pulselessness means tissue damage is already underway.",
  },
  {
    id: "4ts-pph",
    title: "4 Ts of postpartum hemorrhage",
    kind: "acronym",
    topic: "Postpartum hemorrhage",
    topicSlug: "postpartum-hemorrhage",
    body: "Categories of postpartum bleeding to assess in order.",
    lines: [
      { key: "T", meaning: "Tone — uterine atony (most common cause)" },
      { key: "T", meaning: "Trauma — laceration, hematoma, uterine rupture" },
      { key: "T", meaning: "Tissue — retained placental fragments" },
      { key: "T", meaning: "Thrombin — coagulopathy" },
    ],
    clinical:
      "First action for PPH from atony is fundal massage and oxytocin — the boggy uterus is the giveaway.",
  },
  {
    id: "sludgem",
    title: "SLUDGEM",
    kind: "acronym",
    topic: "Cholinergic toxicity",
    topicSlug: "toxicology",
    body: "Signs of muscarinic excess (organophosphate exposure, neostigmine overdose).",
    lines: [
      { key: "S", meaning: "Salivation" },
      { key: "L", meaning: "Lacrimation" },
      { key: "U", meaning: "Urination" },
      { key: "D", meaning: "Defecation / diarrhea" },
      { key: "G", meaning: "GI cramping" },
      { key: "E", meaning: "Emesis" },
      { key: "M", meaning: "Miosis (pinpoint pupils)" },
    ],
    clinical: "Antidote is atropine. Pralidoxime is added for organophosphate poisoning.",
  },
  {
    id: "tract",
    title: "TRACT",
    kind: "acronym",
    topic: "Lithium toxicity risk factors",
    topicSlug: "lithium",
    body: "Why lithium toxicity sneaks up on stable patients.",
    lines: [
      { key: "T", meaning: "Thiazide diuretics" },
      { key: "R", meaning: "Reduced sodium intake" },
      { key: "A", meaning: "ACE inhibitors / NSAIDs" },
      { key: "C", meaning: "Caffeine and dehydration" },
      { key: "T", meaning: "Toxicity threshold > 1.5 mEq/L" },
    ],
    clinical:
      "Teach a steady-sodium, steady-fluid diet. New BP medication or a stomach bug can push level into toxicity.",
  },
  {
    id: "hf-sides",
    title: "Left vs right heart failure",
    kind: "sentence",
    topic: "Heart failure",
    topicSlug: "heart-failure",
    body: "Where the back-pressure shows up.",
    lines: [
      { key: "L", meaning: "Left → Lungs (pulmonary congestion: crackles, dyspnea, pink frothy sputum, S3)" },
      { key: "R", meaning: "Right → Rest of body (JVD, peripheral edema, hepatomegaly, ascites)" },
    ],
    clinical: "Most chronic HF eventually becomes biventricular, but the side starting tells the story.",
  },
  {
    id: "five-rights",
    title: "Five rights of medication",
    kind: "acronym",
    topic: "Medication safety",
    topicSlug: "medication-safety",
    body: "Verified at every administration.",
    lines: [
      { key: "1", meaning: "Right patient (two identifiers)" },
      { key: "2", meaning: "Right drug" },
      { key: "3", meaning: "Right dose" },
      { key: "4", meaning: "Right route" },
      { key: "5", meaning: "Right time" },
    ],
    clinical: "Often expanded to nine: + right reason, right documentation, right response, right to refuse.",
  },
  {
    id: "trousseau-chvostek",
    title: "Trousseau and Chvostek",
    kind: "sentence",
    topic: "Hypocalcemia",
    topicSlug: "electrolytes",
    body: "Two physical findings that confirm low calcium.",
    lines: [
      { key: "Trousseau", meaning: "BP cuff inflated 20 mm Hg above systolic for ~3 min → carpal spasm" },
      { key: "Chvostek", meaning: "Tap on facial nerve in front of ear → ipsilateral facial twitch" },
    ],
    clinical:
      "Common after thyroidectomy or in vitamin D deficiency; treat with IV calcium gluconate for severe symptoms.",
  },
  {
    id: "adpie",
    title: "ADPIE",
    kind: "acronym",
    topic: "Nursing process",
    topicSlug: "nursing-process",
    body: "The frame every NCLEX item is built around.",
    lines: [
      { key: "A", meaning: "Assessment" },
      { key: "D", meaning: "Diagnosis (analysis)" },
      { key: "P", meaning: "Planning" },
      { key: "I", meaning: "Implementation" },
      { key: "E", meaning: "Evaluation" },
    ],
    clinical:
      "When in doubt on a 'first action' question, the answer almost always involves assessment first.",
  },
  {
    id: "sbar",
    title: "SBAR",
    kind: "acronym",
    topic: "Hand-off communication",
    topicSlug: "communication",
    body: "Standardized framework for clinical hand-offs.",
    lines: [
      { key: "S", meaning: "Situation — who, where, what is happening right now" },
      { key: "B", meaning: "Background — relevant history, code status, allergies" },
      { key: "A", meaning: "Assessment — vital signs, current findings, your read on it" },
      { key: "R", meaning: "Recommendation / Request — what you need from the listener" },
    ],
    clinical: "Used for shift report, calling a provider, or transferring care.",
  },
  {
    id: "fast",
    title: "FAST",
    kind: "acronym",
    topic: "Stroke recognition",
    topicSlug: "stroke",
    body: "Quick screen for acute stroke.",
    lines: [
      { key: "F", meaning: "Face — ask the person to smile; one side droops?" },
      { key: "A", meaning: "Arms — ask them to raise both arms; one drifts down?" },
      { key: "S", meaning: "Speech — ask them to repeat a phrase; slurred or odd?" },
      { key: "T", meaning: "Time — note onset and call 911 immediately" },
    ],
    clinical:
      "Time of onset determines tPA eligibility (typically within 3–4.5 hours). Document last-known-well, not just symptom recognition.",
  },
  {
    id: "addisons-cushings",
    title: "Addison vs Cushing",
    kind: "sentence",
    topic: "Adrenal disorders",
    topicSlug: "adrenal",
    body: "Opposites of the cortisol axis.",
    lines: [
      { key: "Addison", meaning: "Adrenal insufficiency — low cortisol, low Na, high K, hypotension, hyperpigmentation, weight loss" },
      { key: "Cushing", meaning: "Adrenal excess — high cortisol, high Na, low K, hypertension, moon face, weight gain, striae" },
    ],
    clinical:
      "Addisonian crisis = life-threatening shock; treat with IV hydrocortisone, fluids, glucose. Sudden steroid withdrawal can trigger it.",
  },
  {
    id: "tpa-contraindications",
    title: "Stroke tPA — quick rule-outs",
    kind: "sentence",
    topic: "Stroke",
    topicSlug: "stroke",
    body: "Before tPA, screen for these absolute contraindications.",
    lines: [
      { key: "1", meaning: "Active bleeding or recent major surgery / trauma (< 14 days)" },
      { key: "2", meaning: "Hemorrhagic stroke now or any history of intracranial bleed" },
      { key: "3", meaning: "BP > 185/110 (treat first if possible)" },
      { key: "4", meaning: "Onset > 4.5 hours ago, or unknown last-known-well past window" },
    ],
    clinical: "Treat hypertension first; if BP cannot be brought below threshold, tPA is held.",
  },
];
