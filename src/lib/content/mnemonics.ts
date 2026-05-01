import type { BeatStyle } from "@/lib/audio/beat-player";

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
  /** Why this matters clinically. */
  clinical: string;

  // ---- Non-song mnemonics (acronym / sentence / image) ----
  /** Per-letter or per-line breakdown for acronyms and sentences. */
  lines?: { key: string; meaning: string }[];

  // ---- Song mnemonics ----
  /** Genre / style label, e.g. "Slow trap", "R&B / neo-soul", "Gospel call & response". */
  tune?: string;
  /** Beat style for in-browser playback. The audio is synthesized live. */
  beatStyle?: BeatStyle;
  /** Each entry is one stanza or section, with line breaks preserved. */
  lyrics?: string[];

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

  // ===== Song-style mnemonics — real lyrics, adult genres ======
  // I cannot ship audio files. Each one names a genre/tempo and suggests a
  // free "type beat" search you can use to layer the lyrics on top.

  {
    id: "song-dka-bars",
    title: "DKA Bars",
    kind: "song",
    topic: "Diabetic ketoacidosis",
    topicSlug: "dka",
    body: "Rap mnemonic for DKA recognition and treatment order.",
    tune: "Rap · slow trap, ~85 BPM",
    beatStyle: "trap-85",
    lyrics: [
`[Hook]
Sugar to the sky, breath go fruity, Kussmaul deep
Fluids in first, insulin slow, watch the K don't sleep`,
`[Verse]
Type-one come in like the world on fire
Acidotic blood and the ketones higher
Anion gap wide open, pH down low
Hour one we drop normal saline, let it flow
Then the regular insulin running on the line
Glucose drop slow, ‘bout a hundred a time
When the sugar hit two-fifty add the dextrose
Switch the bag, keep the drip — that's how the protocol go
Potassium follows insulin into the cell
Replace before you push it or they bottoming out, hell
Bicarb only if the pH crash beneath seven
Otherwise it's fluids, lytes, slow recovery from heaven`,
    ],
    clinical:
      "Order matters in DKA: fluids first to expand volume, insulin drip second to close the anion gap, potassium replacement once K trends down, dextrose added when glucose ≤ 250 to keep the drip running. Bicarb only for severe acidosis (pH < 7.0).",
  },

  {
    id: "song-rome-flow",
    title: "ROME Flow",
    kind: "song",
    topic: "ABG interpretation",
    topicSlug: "abg",
    body: "Rap-cypher for the four ABG patterns.",
    tune: "Rap · boom-bap, ~92 BPM",
    beatStyle: "boom-bap-92",
    lyrics: [
`[Hook]
R-O-M-E, that's the way I read a gas
Respiratory opposite, metabolic equal — that's the path`,
`[Verse 1 — respiratory]
pH up, CO2 down, that's respiratory alkalosis
Hyperventilating panic, that's the diagnosis
pH down, CO2 up, respiratory acidosis
COPD, the airway tight, that's the prognosis`,
`[Verse 2 — metabolic]
pH up, bicarb up, metabolic alkalosis
Vomit, NG suction — give the volume back, the dose is
pH down, bicarb down, metabolic acidosis
DKA, sepsis, kidney shutting up shop`,
    ],
    clinical:
      "ROME = Respiratory Opposite, Metabolic Equal. Step one — is pH up or down? Step two — does CO2 move opposite (respiratory) or HCO3 move with pH (metabolic)? Step three — look for compensation.",
  },

  {
    id: "song-sepsis-hour-one",
    title: "Hour One",
    kind: "song",
    topic: "Sepsis hour-1 bundle",
    topicSlug: "sepsis",
    body: "Drill-style bars for the Surviving Sepsis Campaign hour-1 bundle.",
    tune: "Rap · drill, ~140 BPM",
    beatStyle: "drill-140",
    lyrics: [
`[Hook]
Hour one, hour one — get the bundle done
Lactate, cultures, antibiotics, fluids, every one`,
`[Verse]
Lactate first to see how bad the perfusion gone
Cultures BEFORE antibiotics, never the wrong way 'round
Broad spectrum hit them fast inside the first hour
Thirty mils per kilo crystalloid bring the BP power
MAP under sixty-five start a pressor on the line
Norepi first, vaso second when the first one fall behind
Reassess the lactate, reassess the perfusion
Septic shock kill quick if you sleep on the conclusion`,
    ],
    clinical:
      "Surviving Sepsis Campaign hour-1: measure lactate, blood cultures BEFORE antibiotics, broad-spectrum antibiotics, 30 mL/kg crystalloid for hypotension or lactate ≥ 4, vasopressors during/after fluids if MAP < 65. Norepinephrine is the first-line pressor.",
  },

  {
    id: "song-cushing-addison-rnb",
    title: "Cushing's vs Addison",
    kind: "song",
    topic: "Adrenal disorders",
    topicSlug: "adrenal",
    body: "R&B verse comparing the two adrenal opposites.",
    tune: "R&B · neo-soul, slow groove ~70 BPM",
    beatStyle: "neo-soul-70",
    lyrics: [
`[Verse — Cushing]
Too much cortisol, the body keep the salt and weight
Moon face rising slow, the striae stretch and fade
Sugar running high, the skin so thin it tears
Mood swings, BP up — that's Cushing in the air`,
`[Hook]
Cushing's got it ALL — sodium, sugar, BP, fat
Addison gave it BACK — sodium, sugar, BP flat`,
`[Verse — Addison]
Cortisol gone low, the body lose the salt and tone
Bronze pigmentation deep, electrolytes alone
Hyperkalemia rise, glucose drop down low
Crisis: steroid push, IV fluids let it flow`,
    ],
    clinical:
      "Cushing = excess cortisol → high Na, high glucose, high BP, weight gain, moon face, striae, thin skin. Addison = deficient cortisol → low Na, low glucose, low BP, weight loss, hyperpigmentation, hyperkalemia. Addisonian crisis is a medical emergency — IV hydrocortisone, fluids, glucose.",
  },

  {
    id: "song-five-rights-gospel",
    title: "Five Rights",
    kind: "song",
    topic: "Medication safety",
    topicSlug: "medication-safety",
    body: "Gospel call-and-response for safe medication administration.",
    tune: "Gospel · call & response, hand-clap tempo",
    beatStyle: "gospel-piano",
    lyrics: [
`[Caller] Right patient!
[Choir] Two identifiers, every single time
[Caller] Right drug!
[Choir] Triple-check the label, never break the line
[Caller] Right dose!
[Choir] Math it twice with weight if peds is in the bed
[Caller] Right route!
[Choir] Don't push it IV if it's PO instead
[Caller] Right time!
[Choir] Within thirty minutes, document the read`,
`[Bridge — extension]
Right reason — what the medicine is FOR
Right response — reassess after the dose
Right documentation — chart it, close the loop
Right to refuse — honor the patient, every time`,
    ],
    clinical:
      "The five core rights are patient, drug, dose, route, time. The expanded list adds reason, documentation, response, and right to refuse — together the 'nine rights' some institutions teach.",
  },

  {
    id: "song-hf-sides-rnb",
    title: "Heart Failure Sides",
    kind: "song",
    topic: "Heart failure",
    topicSlug: "heart-failure",
    body: "R&B verse for left- vs right-sided heart failure.",
    tune: "R&B · neo-soul, mid-tempo ~80 BPM",
    beatStyle: "neo-soul-80",
    lyrics: [
`[Verse — Left]
Left side back up, push it to the lungs
Crackle in the bases, sit them up, oxygen come
Pink frothy sputum tell you edema in the air
S-3 gallop knocking soft, a sound you can't compare
Orthopnea climbing, three pillows for the night
Furosemide IV slow, get the volume off the right`,
`[Bridge]
Backwards, backwards — the blood don't flow forward
Backwards, backwards — the body know what's coming`,
`[Verse — Right]
Right side back up, push it to the body
JVD jugulars rising — tell you something's not coppy
Liver tender, ascites, peripheral edema slow
Weight up two pounds in a day, the fluid finding home
Daily weights at dawn, low-sodium dish
Spironolactone working soft — that aldosterone wish`,
    ],
    clinical:
      "Left = Lungs (crackles, dyspnea, orthopnea, pink frothy sputum, S3). Right = Rest of body (JVD, peripheral edema, hepatomegaly, ascites, weight gain). Most chronic HF eventually becomes biventricular but the starting side tells the story.",
  },
];
