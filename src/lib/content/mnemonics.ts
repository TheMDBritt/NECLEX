export type MnemonicKind = "acronym" | "sentence" | "image" | "song";

export interface Mnemonic {
  id: string;
  title: string;
  kind: MnemonicKind;
  topic: string;
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
    topic: "Limb assessment after fracture or crush injury",
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
    topic: "Causes of PPH",
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
    topic: "Things that lower lithium levels (raise toxicity risk)",
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
    id: "bee-sting",
    title: "BEES — left vs right HF",
    kind: "sentence",
    topic: "Heart failure side localization",
    body: "Where the back-pressure shows up.",
    lines: [
      { key: "L", meaning: "Left → Lungs (pulmonary congestion: crackles, dyspnea, pink frothy sputum)" },
      { key: "R", meaning: "Right → Rest of body (JVD, peripheral edema, hepatomegaly, ascites)" },
    ],
    clinical: "Most chronic HF eventually becomes biventricular, but the side starting tells the story.",
  },
  {
    id: "speed-shock",
    title: "Five rights of medication",
    kind: "acronym",
    topic: "Medication safety",
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
    body: "Two physical findings that confirm low calcium.",
    lines: [
      {
        key: "Trousseau",
        meaning: "BP cuff inflated 20 mm Hg above systolic for ~3 min → carpal spasm",
      },
      {
        key: "Chvostek",
        meaning: "Tap on facial nerve in front of ear → ipsilateral facial twitch",
      },
    ],
    clinical:
      "Common after thyroidectomy or in vitamin D deficiency; treat with IV calcium gluconate for severe symptoms.",
  },
  {
    id: "adpie",
    title: "ADPIE",
    kind: "acronym",
    topic: "Nursing process",
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
    body: "Standardized framework for clinical hand-offs.",
    lines: [
      { key: "S", meaning: "Situation — who, where, what is happening right now" },
      { key: "B", meaning: "Background — relevant history, code status, allergies" },
      { key: "A", meaning: "Assessment — vital signs, current findings, your read on it" },
      { key: "R", meaning: "Recommendation / Request — what you need from the listener" },
    ],
    clinical: "Used for shift report, calling a provider, or transferring care.",
  },
];
