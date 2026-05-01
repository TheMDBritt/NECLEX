/**
 * Drug library — high-yield NCLEX drugs with mechanism, indications,
 * adverse effects, and nursing-specific considerations.
 *
 * Every entry verified against current FDA labeling (DailyMed) and the
 * Lippincott Drug Guide for Nurses. Pregnancy / lactation safety per
 * current FDA labeling. Dosing examples are NCLEX-typical, not a
 * prescribing reference.
 */

export type DrugClass =
  | "anticoagulant"
  | "antiplatelet"
  | "ace-inhibitor"
  | "beta-blocker"
  | "loop-diuretic"
  | "thiazide-diuretic"
  | "potassium-sparing-diuretic"
  | "cardiac-glycoside"
  | "nitrate"
  | "statin"
  | "insulin"
  | "oral-hypoglycemic"
  | "thyroid-hormone"
  | "bronchodilator"
  | "corticosteroid"
  | "opioid"
  | "opioid-antagonist"
  | "non-opioid-analgesic"
  | "antibiotic"
  | "antipsychotic"
  | "ssri"
  | "mood-stabilizer"
  | "ppi"
  | "antiemetic"
  | "electrolyte-replacement";

export interface Drug {
  id: string;
  generic: string;
  brand?: string[];
  className: DrugClass;
  classLabel: string;
  mechanism: string;
  indications: string[];
  adverse: string[];
  nursing: string[];
  /** Antidote or reversal agent if relevant. */
  antidote?: string;
  /** Black box warnings worth knowing for the exam. */
  blackBox?: string;
  /** Pregnancy / lactation note per current FDA labeling. */
  pregnancy?: string;
  highAlert?: boolean;
}

const CLASS_LABEL: Record<DrugClass, string> = {
  anticoagulant: "Anticoagulant",
  antiplatelet: "Antiplatelet",
  "ace-inhibitor": "ACE inhibitor",
  "beta-blocker": "Beta blocker",
  "loop-diuretic": "Loop diuretic",
  "thiazide-diuretic": "Thiazide diuretic",
  "potassium-sparing-diuretic": "Potassium-sparing diuretic",
  "cardiac-glycoside": "Cardiac glycoside",
  nitrate: "Nitrate",
  statin: "Statin (HMG-CoA reductase inhibitor)",
  insulin: "Insulin",
  "oral-hypoglycemic": "Oral hypoglycemic (biguanide)",
  "thyroid-hormone": "Thyroid hormone",
  bronchodilator: "Bronchodilator",
  corticosteroid: "Corticosteroid",
  opioid: "Opioid analgesic",
  "opioid-antagonist": "Opioid antagonist",
  "non-opioid-analgesic": "Non-opioid analgesic",
  antibiotic: "Antibiotic",
  antipsychotic: "Antipsychotic",
  ssri: "SSRI",
  "mood-stabilizer": "Mood stabilizer",
  ppi: "Proton pump inhibitor",
  antiemetic: "Antiemetic",
  "electrolyte-replacement": "Electrolyte replacement",
};

export function classLabel(c: DrugClass): string {
  return CLASS_LABEL[c];
}

export const drugs: Drug[] = [
  // ---- Cardiovascular ----
  {
    id: "warfarin",
    generic: "warfarin",
    brand: ["Coumadin", "Jantoven"],
    className: "anticoagulant",
    classLabel: CLASS_LABEL["anticoagulant"],
    mechanism: "Inhibits vitamin K-dependent clotting factors (II, VII, IX, X) and proteins C and S.",
    indications: ["Atrial fibrillation", "DVT/PE prevention and treatment", "Mechanical heart valves"],
    adverse: ["Bleeding (most serious)", "Skin necrosis", "Purple toe syndrome"],
    nursing: [
      "Monitor INR (target usually 2–3, or 2.5–3.5 for mechanical valves)",
      "Teach consistent vitamin K intake (greens) — not avoidance",
      "Avoid NSAIDs and aspirin unless prescribed",
      "Bleeding precautions: soft toothbrush, electric razor",
    ],
    antidote: "Vitamin K (phytonadione); 4-factor PCC for severe bleed",
    blackBox: "Major or fatal bleeding",
    pregnancy: "Contraindicated — teratogenic (warfarin embryopathy)",
    highAlert: true,
  },
  {
    id: "heparin",
    generic: "heparin",
    className: "anticoagulant",
    classLabel: CLASS_LABEL["anticoagulant"],
    mechanism: "Binds antithrombin III, inactivating thrombin and factor Xa.",
    indications: ["DVT/PE treatment", "ACS", "Bridging anticoagulation"],
    adverse: ["Bleeding", "Heparin-induced thrombocytopenia (HIT)", "Osteoporosis with long-term use"],
    nursing: [
      "Monitor aPTT (therapeutic 1.5–2.5× control) for IV heparin",
      "Monitor platelets — HIT typically 5–14 days into therapy",
      "Subcutaneous: do not aspirate, do not massage; rotate sites in abdomen",
    ],
    antidote: "Protamine sulfate",
    pregnancy: "Generally safe (does not cross placenta)",
    highAlert: true,
  },
  {
    id: "aspirin",
    generic: "aspirin",
    brand: ["Bayer", "Ecotrin"],
    className: "antiplatelet",
    classLabel: CLASS_LABEL["antiplatelet"],
    mechanism: "Irreversibly inhibits cyclooxygenase, blocking thromboxane A2 and platelet aggregation.",
    indications: ["MI prevention", "Ischemic stroke prevention", "Mild pain / fever"],
    adverse: ["GI bleeding", "Tinnitus (early sign of toxicity)", "Reye syndrome in children"],
    nursing: [
      "Take with food",
      "Avoid in children with viral illness (Reye risk)",
      "Hold for procedures per protocol",
    ],
  },
  {
    id: "lisinopril",
    generic: "lisinopril",
    brand: ["Zestril", "Prinivil"],
    className: "ace-inhibitor",
    classLabel: CLASS_LABEL["ace-inhibitor"],
    mechanism: "Blocks angiotensin-converting enzyme → ↓ angiotensin II → vasodilation, ↓ aldosterone.",
    indications: ["Hypertension", "Heart failure", "Post-MI", "Diabetic nephropathy"],
    adverse: ["Dry persistent cough", "Hyperkalemia", "Angioedema", "First-dose hypotension"],
    nursing: [
      "Monitor BP, K+, and renal function",
      "Hold for SBP < 90 or angioedema; angioedema is an absolute contraindication for re-challenge",
    ],
    pregnancy: "Contraindicated (fetal renal injury)",
  },
  {
    id: "metoprolol",
    generic: "metoprolol",
    brand: ["Lopressor", "Toprol XL"],
    className: "beta-blocker",
    classLabel: CLASS_LABEL["beta-blocker"],
    mechanism: "Selective beta-1 antagonist → ↓ HR, ↓ contractility, ↓ AV conduction.",
    indications: ["Hypertension", "Angina", "Heart failure (titrated)", "Post-MI"],
    adverse: ["Bradycardia", "Hypotension", "Fatigue", "Mask hypoglycemia in diabetics"],
    nursing: [
      "Hold and notify if HR < 50 or SBP < 90",
      "Do not stop abruptly — taper to avoid rebound HTN/MI",
      "Caution in asthma (less than non-selective, but still possible)",
    ],
  },
  {
    id: "furosemide",
    generic: "furosemide",
    brand: ["Lasix"],
    className: "loop-diuretic",
    classLabel: CLASS_LABEL["loop-diuretic"],
    mechanism: "Inhibits Na/K/2Cl cotransporter in the loop of Henle.",
    indications: ["Heart failure", "Pulmonary edema", "Edema"],
    adverse: ["Hypokalemia", "Hyponatremia", "Ototoxicity (rapid IV)", "Dehydration", "Hyperuricemia"],
    nursing: [
      "Monitor K+, Na+, BUN/Cr, daily weight",
      "Push IV slowly (no faster than 20 mg/min)",
      "Sulfa allergy — cross-reactivity",
    ],
  },
  {
    id: "spironolactone",
    generic: "spironolactone",
    brand: ["Aldactone"],
    className: "potassium-sparing-diuretic",
    classLabel: CLASS_LABEL["potassium-sparing-diuretic"],
    mechanism: "Aldosterone antagonist — diuresis without potassium wasting.",
    indications: ["Heart failure", "Cirrhosis ascites", "Resistant hypertension", "Hyperaldosteronism"],
    adverse: ["Hyperkalemia", "Gynecomastia", "Menstrual irregularities"],
    nursing: ["Monitor K+", "Avoid salt substitutes (often KCl)", "Do not combine with ACEi/ARB without K monitoring"],
  },
  {
    id: "digoxin",
    generic: "digoxin",
    brand: ["Lanoxin"],
    className: "cardiac-glycoside",
    classLabel: CLASS_LABEL["cardiac-glycoside"],
    mechanism: "Inhibits Na/K-ATPase → ↑ intracellular Ca → ↑ contractility; ↑ vagal tone → ↓ HR.",
    indications: ["Heart failure", "Atrial fibrillation rate control"],
    adverse: ["Toxicity: nausea, vomiting, visual halos (yellow-green), bradycardia, dysrhythmias"],
    nursing: [
      "Hold and notify if apical HR < 60",
      "Therapeutic level 0.5–2.0 ng/mL; toxicity > 2.0",
      "Hypokalemia potentiates toxicity",
    ],
    antidote: "Digoxin immune Fab (DigiFab)",
    highAlert: true,
  },
  {
    id: "nitroglycerin",
    generic: "nitroglycerin",
    brand: ["Nitrostat"],
    className: "nitrate",
    classLabel: CLASS_LABEL["nitrate"],
    mechanism: "Releases NO → vasodilation, ↓ preload (and afterload at higher doses).",
    indications: ["Acute angina", "ACS", "Hypertensive emergency (IV)"],
    adverse: ["Headache", "Hypotension", "Reflex tachycardia"],
    nursing: [
      "SL: one tablet/spray q5 min, max 3 doses; call 911 if pain persists after first dose",
      "Avoid with PDE-5 inhibitors (sildenafil) — severe hypotension",
      "Sit or lie when taking",
    ],
  },
  {
    id: "atorvastatin",
    generic: "atorvastatin",
    brand: ["Lipitor"],
    className: "statin",
    classLabel: CLASS_LABEL["statin"],
    mechanism: "Inhibits HMG-CoA reductase → ↓ cholesterol synthesis.",
    indications: ["Hyperlipidemia", "Atherosclerotic CV disease prevention"],
    adverse: ["Myalgia / rhabdomyolysis (rare)", "Hepatotoxicity"],
    nursing: [
      "Monitor LFTs and report unexplained muscle pain",
      "Take in evening when possible",
      "Avoid grapefruit juice (CYP3A4)",
    ],
    pregnancy: "Contraindicated",
  },

  // ---- Endocrine ----
  {
    id: "insulin-regular",
    generic: "insulin regular",
    brand: ["Humulin R", "Novolin R"],
    className: "insulin",
    classLabel: CLASS_LABEL["insulin"],
    mechanism: "Short-acting insulin; lowers blood glucose by enabling cellular uptake.",
    indications: ["Type 1 and 2 diabetes", "DKA / HHS (IV)", "Sliding scale coverage"],
    adverse: ["Hypoglycemia", "Hypokalemia", "Lipodystrophy"],
    nursing: [
      "Onset 30 min, peak 2–4 h, duration 5–8 h (subq)",
      "Only insulin that can be given IV",
      "Clear before cloudy when mixing with NPH (regular drawn first)",
    ],
    highAlert: true,
  },
  {
    id: "insulin-nph",
    generic: "insulin NPH",
    brand: ["Humulin N", "Novolin N"],
    className: "insulin",
    classLabel: CLASS_LABEL["insulin"],
    mechanism: "Intermediate-acting insulin (isophane suspension).",
    indications: ["Type 1 and 2 diabetes — basal coverage"],
    adverse: ["Hypoglycemia", "Lipodystrophy"],
    nursing: ["Onset 1–2 h, peak 4–12 h, duration 14–24 h", "Cloudy — must be gently rolled before drawing"],
    highAlert: true,
  },
  {
    id: "metformin",
    generic: "metformin",
    brand: ["Glucophage"],
    className: "oral-hypoglycemic",
    classLabel: CLASS_LABEL["oral-hypoglycemic"],
    mechanism: "Decreases hepatic gluconeogenesis and improves insulin sensitivity.",
    indications: ["Type 2 diabetes (first-line)"],
    adverse: ["GI upset (most common)", "Lactic acidosis (rare but serious)", "B12 deficiency"],
    nursing: [
      "Hold 48 h around iodinated contrast or surgery; resume after renal function confirmed",
      "Take with meals to reduce GI symptoms",
      "Does not cause hypoglycemia by itself",
    ],
    blackBox: "Lactic acidosis — risk increases with renal impairment, sepsis, hypoxia",
  },
  {
    id: "levothyroxine",
    generic: "levothyroxine",
    brand: ["Synthroid", "Levoxyl"],
    className: "thyroid-hormone",
    classLabel: CLASS_LABEL["thyroid-hormone"],
    mechanism: "Synthetic T4; converted to T3 in tissues.",
    indications: ["Hypothyroidism"],
    adverse: ["Signs of hyperthyroidism if dose too high (palpitations, heat intolerance)", "Bone loss"],
    nursing: [
      "Take in the morning on empty stomach, 30–60 min before food",
      "Avoid taking with calcium, iron, or PPIs (decreased absorption)",
      "Lifelong therapy",
    ],
  },

  // ---- Respiratory ----
  {
    id: "albuterol",
    generic: "albuterol",
    brand: ["ProAir HFA", "Ventolin HFA"],
    className: "bronchodilator",
    classLabel: CLASS_LABEL["bronchodilator"],
    mechanism: "Selective beta-2 agonist — bronchodilation.",
    indications: ["Acute asthma / bronchospasm", "COPD exacerbation"],
    adverse: ["Tachycardia", "Tremor", "Anxiety", "Hypokalemia at high doses"],
    nursing: [
      "Rescue inhaler — give before inhaled corticosteroid",
      "Frequent or escalating use signals poor asthma control",
    ],
  },
  {
    id: "fluticasone",
    generic: "fluticasone (inhaled)",
    brand: ["Flovent HFA"],
    className: "corticosteroid",
    classLabel: CLASS_LABEL["corticosteroid"],
    mechanism: "Inhaled corticosteroid — anti-inflammatory in airways.",
    indications: ["Long-term asthma control"],
    adverse: ["Oral candidiasis", "Hoarseness", "Slowed growth in children (small effect)"],
    nursing: [
      "Rinse and spit after each use to prevent thrush",
      "Use spacer to improve delivery",
      "Daily maintenance — not for acute symptoms",
    ],
  },

  // ---- Pain / CNS ----
  {
    id: "morphine",
    generic: "morphine",
    className: "opioid",
    classLabel: CLASS_LABEL["opioid"],
    mechanism: "Mu-opioid receptor agonist — analgesia, sedation, respiratory depression.",
    indications: ["Severe pain", "MI / pulmonary edema (in some protocols)"],
    adverse: ["Respiratory depression", "Sedation", "Constipation", "Hypotension", "Pruritus"],
    nursing: [
      "Hold for RR < 12 / impaired LOC",
      "Have naloxone available",
      "Start a bowel regimen with chronic opioid use",
    ],
    antidote: "Naloxone",
    blackBox: "Respiratory depression, addiction potential",
    highAlert: true,
  },
  {
    id: "naloxone",
    generic: "naloxone",
    brand: ["Narcan"],
    className: "opioid-antagonist",
    classLabel: CLASS_LABEL["opioid-antagonist"],
    mechanism: "Pure opioid receptor antagonist — reverses opioid effects.",
    indications: ["Opioid overdose / respiratory depression"],
    adverse: ["Acute opioid withdrawal in dependent patients", "Tachycardia", "Hypertension"],
    nursing: [
      "May need to repeat — half-life shorter than many opioids",
      "Monitor RR, LOC, BP after administration",
    ],
  },
  {
    id: "acetaminophen",
    generic: "acetaminophen",
    brand: ["Tylenol"],
    className: "non-opioid-analgesic",
    classLabel: CLASS_LABEL["non-opioid-analgesic"],
    mechanism: "Central COX inhibition; analgesic and antipyretic.",
    indications: ["Mild-moderate pain", "Fever"],
    adverse: ["Hepatotoxicity in overdose"],
    nursing: [
      "Max 4 g/day in healthy adults; lower in liver disease",
      "Check combination products for hidden acetaminophen",
    ],
    antidote: "N-acetylcysteine (NAC)",
  },

  // ---- Anti-infective ----
  {
    id: "vancomycin",
    generic: "vancomycin",
    className: "antibiotic",
    classLabel: CLASS_LABEL["antibiotic"],
    mechanism: "Inhibits bacterial cell wall synthesis (gram-positive coverage including MRSA).",
    indications: ["MRSA", "Severe gram-positive infections", "Oral form for C. difficile"],
    adverse: ["Nephrotoxicity", "Ototoxicity", "Vancomycin-infusion reaction (formerly red man syndrome)"],
    nursing: [
      "Infuse over at least 60 minutes; slow further if reaction occurs",
      "Monitor trough levels and renal function",
    ],
  },

  // ---- Mental health ----
  {
    id: "lithium",
    generic: "lithium",
    brand: ["Lithobid"],
    className: "mood-stabilizer",
    classLabel: CLASS_LABEL["mood-stabilizer"],
    mechanism: "Mechanism not fully understood; modulates neurotransmitters.",
    indications: ["Bipolar disorder — mania and maintenance"],
    adverse: ["Toxicity: tremor, ataxia, confusion, seizures, dysrhythmia", "Nephrogenic diabetes insipidus", "Hypothyroidism"],
    nursing: [
      "Therapeutic 0.6–1.2 mEq/L; toxicity > 1.5",
      "Maintain consistent sodium and fluid intake — low Na+ ↑ lithium",
      "Monitor TSH and renal function",
    ],
    pregnancy: "Avoid in first trimester (Ebstein anomaly)",
    highAlert: true,
  },
  {
    id: "haloperidol",
    generic: "haloperidol",
    brand: ["Haldol"],
    className: "antipsychotic",
    classLabel: CLASS_LABEL["antipsychotic"],
    mechanism: "D2 receptor antagonist — typical / first-generation antipsychotic.",
    indications: ["Acute psychosis", "Severe agitation", "Tourette syndrome"],
    adverse: ["Extrapyramidal symptoms (EPS)", "Tardive dyskinesia", "Neuroleptic malignant syndrome (NMS)"],
    nursing: [
      "Monitor for EPS (acute dystonia, akathisia, parkinsonism)",
      "NMS: high fever, rigidity, AMS — STOP drug, supportive care",
    ],
  },
  {
    id: "sertraline",
    generic: "sertraline",
    brand: ["Zoloft"],
    className: "ssri",
    classLabel: CLASS_LABEL["ssri"],
    mechanism: "Selective serotonin reuptake inhibitor.",
    indications: ["Depression", "Generalized anxiety disorder", "PTSD", "OCD"],
    adverse: ["GI upset", "Sexual dysfunction", "Insomnia", "Increased suicidality in young adults"],
    nursing: [
      "Full effect takes 4–6 weeks",
      "Risk of serotonin syndrome with other serotonergic agents",
      "Do not stop abruptly — taper",
    ],
    blackBox: "Increased suicidal ideation in children, adolescents, young adults",
  },

  // ---- GI ----
  {
    id: "omeprazole",
    generic: "omeprazole",
    brand: ["Prilosec"],
    className: "ppi",
    classLabel: CLASS_LABEL["ppi"],
    mechanism: "Irreversibly inhibits the H+/K+ ATPase pump in gastric parietal cells.",
    indications: ["GERD", "Peptic ulcer", "H. pylori (with antibiotics)"],
    adverse: ["Long-term: B12 deficiency, hypomagnesemia, osteoporosis, C. difficile risk"],
    nursing: ["Take 30–60 min before first meal", "Long-term use should be reassessed periodically"],
  },
  {
    id: "ondansetron",
    generic: "ondansetron",
    brand: ["Zofran"],
    className: "antiemetic",
    classLabel: CLASS_LABEL["antiemetic"],
    mechanism: "5-HT3 receptor antagonist — blocks serotonin-mediated nausea.",
    indications: ["Chemo-induced nausea", "Post-op nausea", "Hyperemesis"],
    adverse: ["QT prolongation", "Headache", "Constipation"],
    nursing: ["ECG monitoring with prolonged QT or other QT-prolonging drugs"],
  },

  // ---- More mental health / sedation ----
  {
    id: "lorazepam",
    generic: "lorazepam",
    brand: ["Ativan"],
    className: "antipsychotic",
    classLabel: "Benzodiazepine (anxiolytic / sedative)",
    mechanism: "Enhances GABA at GABA-A receptor → CNS depression.",
    indications: ["Anxiety", "Status epilepticus", "Alcohol withdrawal", "Procedural sedation"],
    adverse: ["Sedation", "Respiratory depression at high doses", "Dependence", "Paradoxical agitation in older adults"],
    nursing: [
      "Monitor RR, sedation level (RASS / Pasero scale)",
      "Have flumazenil available for severe respiratory depression",
      "Avoid combining with opioids (additive depression)",
      "Taper to discontinue — abrupt stop causes withdrawal seizures",
    ],
    antidote: "Flumazenil (use cautiously — can precipitate seizures in chronic users)",
    blackBox: "Concomitant opioid + benzo use can cause respiratory depression and death",
    pregnancy: "Avoid in 1st trimester (cleft lip risk reported); risk-benefit later",
    highAlert: true,
  },
  {
    id: "haloperidol-im",
    generic: "haloperidol (acute IM)",
    brand: ["Haldol"],
    className: "antipsychotic",
    classLabel: "First-gen antipsychotic (acute agitation)",
    mechanism: "D2 receptor antagonist; calms acute agitation/psychosis.",
    indications: ["Acute psychosis", "Severe agitation in delirium when nonpharm fails"],
    adverse: ["Extrapyramidal symptoms (acute dystonia, akathisia, parkinsonism)", "QT prolongation", "Neuroleptic malignant syndrome"],
    nursing: [
      "Have benztropine or diphenhydramine available for acute dystonia",
      "Baseline + serial ECG for QT in IV use",
      "Watch for NMS: high fever, rigidity, AMS — STOP drug",
    ],
    blackBox: "Increased mortality in elderly with dementia-related psychosis",
  },
  {
    id: "diphenhydramine",
    generic: "diphenhydramine",
    brand: ["Benadryl"],
    className: "non-opioid-analgesic",
    classLabel: "First-generation antihistamine (H1 blocker)",
    mechanism: "Blocks H1 receptors; also anticholinergic + sedative effects.",
    indications: ["Allergic reactions / urticaria", "Acute dystonia (with antipsychotics)", "Insomnia (short-term)"],
    adverse: ["Sedation", "Dry mouth", "Urinary retention", "Confusion in elderly (Beers Criteria)", "Paradoxical excitement in children"],
    nursing: [
      "Avoid in older adults (anticholinergic burden, fall risk)",
      "Caution with BPH, narrow-angle glaucoma",
      "Not first-line for anaphylaxis — give epinephrine FIRST",
    ],
  },
  {
    id: "naloxone-narcan",
    generic: "naloxone",
    brand: ["Narcan", "Kloxxado"],
    className: "opioid-antagonist",
    classLabel: "Opioid antagonist (overdose reversal)",
    mechanism: "Competitive mu-opioid receptor antagonist — reverses respiratory depression.",
    indications: ["Opioid overdose", "Suspected opioid-induced respiratory depression"],
    adverse: ["Acute opioid withdrawal in dependent patients (sweating, vomiting, agitation)", "Tachycardia", "Hypertension"],
    nursing: [
      "May need to repeat — naloxone half-life shorter than many opioids (especially methadone, fentanyl)",
      "Continue monitoring after dose; recurrence of respiratory depression possible",
      "Intranasal Narcan is widely available — train families/communities",
    ],
  },
  {
    id: "epinephrine-anaphylaxis",
    generic: "epinephrine (1:1000)",
    brand: ["EpiPen"],
    className: "non-opioid-analgesic",
    classLabel: "Sympathomimetic (alpha + beta agonist)",
    mechanism: "Alpha-1 vasoconstriction (raises BP), beta-1 inotropy/chronotropy, beta-2 bronchodilation, mast-cell stabilization.",
    indications: ["Anaphylaxis", "Acute bronchospasm refractory", "Cardiac arrest (1:10,000 IV)"],
    adverse: ["Tachycardia", "Hypertension", "Anxiety / tremor", "Risk of arrhythmia"],
    nursing: [
      "Anaphylaxis: 0.3–0.5 mg IM in lateral thigh; repeat q5–15 min as needed",
      "Cardiac arrest: 1 mg IV/IO q3–5 min (1:10,000)",
      "Educate clients with severe allergies on EpiPen technique",
    ],
    highAlert: true,
  },

  // ---- Endocrine extras ----
  {
    id: "insulin-lispro",
    generic: "insulin lispro",
    brand: ["Humalog"],
    className: "insulin",
    classLabel: "Rapid-acting insulin",
    mechanism: "Rapid-acting insulin analog — onset ~10–15 min, peak ~1 h, duration 3–5 h.",
    indications: ["Type 1 and 2 diabetes — bolus / mealtime coverage"],
    adverse: ["Hypoglycemia", "Hypokalemia at high doses", "Lipodystrophy"],
    nursing: [
      "Give within 15 min of starting a meal",
      "Hold if NPO and notify provider",
      "Confirm meal arrival before dosing",
    ],
    highAlert: true,
  },
  {
    id: "insulin-glargine",
    generic: "insulin glargine",
    brand: ["Lantus", "Basaglar"],
    className: "insulin",
    classLabel: "Long-acting basal insulin",
    mechanism: "Long-acting insulin analog — onset 1–2 h, no pronounced peak, duration ~24 h.",
    indications: ["Type 1 and 2 diabetes — basal coverage"],
    adverse: ["Hypoglycemia", "Local injection-site reaction"],
    nursing: [
      "Same time each day; do NOT mix with other insulins in the same syringe",
      "Clear solution — discard if cloudy",
    ],
    highAlert: true,
  },
  {
    id: "ondansetron-zofran",
    generic: "ondansetron",
    brand: ["Zofran"],
    className: "antiemetic",
    classLabel: "5-HT3 receptor antagonist",
    mechanism: "Blocks serotonin receptors in the chemoreceptor trigger zone and GI tract.",
    indications: ["Chemotherapy-induced nausea", "Postoperative nausea", "Hyperemesis"],
    adverse: ["QT prolongation (esp. IV)", "Headache", "Constipation"],
    nursing: [
      "Baseline ECG with IV use; avoid in long QT",
      "Caution combining with other QT-prolonging drugs",
      "Not first-line for opioid-induced or motion sickness nausea",
    ],
  },

  // ---- Antibiotics extras ----
  {
    id: "ceftriaxone",
    generic: "ceftriaxone",
    brand: ["Rocephin"],
    className: "antibiotic",
    classLabel: "Third-generation cephalosporin",
    mechanism: "Inhibits bacterial cell-wall synthesis (broad-spectrum, including some gram-negative).",
    indications: ["Meningitis", "Pneumonia (CAP)", "Pyelonephritis", "Gonorrhea (single IM dose)"],
    adverse: ["Diarrhea / C. diff risk", "Hypersensitivity (cross-reactivity with PCN ~1–3%)", "Biliary sludging"],
    nursing: [
      "Do NOT give with calcium-containing solutions (e.g., LR) — risk of precipitation in neonates (fatal pulmonary precipitates)",
      "Verify allergy history before administration",
    ],
  },
  {
    id: "azithromycin",
    generic: "azithromycin",
    brand: ["Zithromax", "Z-Pak"],
    className: "antibiotic",
    classLabel: "Macrolide antibiotic",
    mechanism: "Inhibits bacterial protein synthesis (50S ribosome).",
    indications: ["Atypical pneumonia (Mycoplasma, Legionella)", "Strep pharyngitis (PCN-allergic)", "Chlamydia"],
    adverse: ["GI upset", "QT prolongation", "Hepatotoxicity (rare)"],
    nursing: [
      "Caution in clients with long QT, on QT-prolonging drugs",
      "Take on an empty stomach for best absorption",
    ],
  },

  // ---- Steroids ----
  {
    id: "methylprednisolone",
    generic: "methylprednisolone",
    brand: ["Solu-Medrol"],
    className: "corticosteroid",
    classLabel: "Systemic glucocorticoid (IV)",
    mechanism: "Anti-inflammatory and immunosuppressive via genomic and non-genomic effects.",
    indications: ["Severe asthma exacerbation", "MS flare", "Spinal cord injury (controversial)", "Anaphylaxis (adjunct)"],
    adverse: ["Hyperglycemia", "Mood changes (psychosis at high dose)", "Increased infection risk", "Long-term: osteoporosis, Cushingoid features"],
    nursing: [
      "Monitor blood glucose, BP, mood",
      "Taper to discontinue after prolonged use to prevent adrenal crisis",
      "Stress-dose during acute illness/surgery if chronic steroid user",
    ],
  },
  {
    id: "dexamethasone",
    generic: "dexamethasone",
    brand: ["Decadron"],
    className: "corticosteroid",
    classLabel: "Long-acting glucocorticoid",
    mechanism: "Potent glucocorticoid; minimal mineralocorticoid effect.",
    indications: ["Cerebral edema", "Croup", "Antiemetic adjunct in chemo", "Bacterial meningitis adjunct (with antibiotics)"],
    adverse: ["Hyperglycemia", "Mood changes", "Infection risk", "Adrenal suppression"],
    nursing: [
      "Hyperglycemia common; monitor in diabetics",
      "For croup: single PO/IM dose typically sufficient",
    ],
  },

  // ---- Mental-health extras ----
  {
    id: "fluoxetine",
    generic: "fluoxetine",
    brand: ["Prozac"],
    className: "ssri",
    classLabel: "SSRI",
    mechanism: "Selective serotonin reuptake inhibitor; long half-life (~7 days for active metabolite).",
    indications: ["Depression", "OCD", "Bulimia", "Premenstrual dysphoric disorder"],
    adverse: ["GI upset", "Sexual dysfunction", "Insomnia", "Increased suicidality (young adults — black box)"],
    nursing: [
      "Full effect 4–6 weeks",
      "Long half-life — washout up to 5 weeks before MAOI to prevent serotonin syndrome",
      "Watch for serotonin syndrome with other serotonergic agents",
    ],
    blackBox: "Increased suicidal ideation in children, adolescents, young adults",
  },
  {
    id: "bupropion",
    generic: "bupropion",
    brand: ["Wellbutrin", "Zyban"],
    className: "ssri",
    classLabel: "Atypical antidepressant (NDRI)",
    mechanism: "Norepinephrine and dopamine reuptake inhibitor; minimal serotonin activity.",
    indications: ["Depression", "Smoking cessation (Zyban)", "Seasonal affective disorder"],
    adverse: ["Lowers seizure threshold (contraindicated in seizure disorder, eating disorders, alcohol withdrawal)", "Dry mouth", "Insomnia", "Tachycardia"],
    nursing: [
      "Screen for seizure history before initiation",
      "Avoid in clients with bulimia / anorexia nervosa",
      "No sexual dysfunction — useful when SSRI side effect",
    ],
  },

  // ---- Cardio extras ----
  {
    id: "amlodipine",
    generic: "amlodipine",
    brand: ["Norvasc"],
    className: "beta-blocker",
    classLabel: "Calcium channel blocker (dihydropyridine)",
    mechanism: "Blocks L-type Ca channels → vasodilation → ↓ BP.",
    indications: ["Hypertension", "Stable angina"],
    adverse: ["Peripheral edema (vasodilatory)", "Flushing", "Headache", "Dizziness"],
    nursing: [
      "Edema is common and dose-related; rises slow",
      "No abrupt discontinuation needed",
      "Avoid grapefruit juice (CYP3A4)",
    ],
  },
  {
    id: "clopidogrel",
    generic: "clopidogrel",
    brand: ["Plavix"],
    className: "antiplatelet",
    classLabel: "P2Y12 platelet inhibitor (antiplatelet)",
    mechanism: "Irreversibly inhibits ADP P2Y12 receptor on platelets → reduced aggregation.",
    indications: ["ACS / post-PCI", "Stroke prevention", "PAD"],
    adverse: ["Bleeding", "Rare TTP"],
    nursing: [
      "Often combined with aspirin (DAPT) post-PCI for 6–12 months",
      "Hold 5–7 days before elective surgery (per cardiology)",
    ],
  },

  // ---- Electrolyte ----
  {
    id: "calcium-gluconate",
    generic: "calcium gluconate",
    className: "electrolyte-replacement",
    classLabel: CLASS_LABEL["electrolyte-replacement"],
    mechanism: "Calcium replacement; stabilizes cardiac membranes in hyperkalemia.",
    indications: ["Hypocalcemia", "Hyperkalemia (cardiac membrane stabilization)", "Magnesium-sulfate toxicity"],
    adverse: ["Hypotension if rapid IV", "Tissue necrosis if extravasated"],
    nursing: [
      "Give slowly IV; central line preferred for high doses",
      "Monitor for cardiac dysrhythmias during administration",
      "Antidote for magnesium sulfate toxicity",
    ],
  },
];
