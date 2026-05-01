/**
 * Lab values reference — verified adult ranges with conventional units.
 *
 * Sources used to compile this set (every entry SME-verifiable):
 *  - American Association for Clinical Chemistry (AACC) standardized ranges
 *  - Lippincott Manual of Nursing Practice
 *  - Tietz Textbook of Clinical Chemistry
 *
 * Reference ranges vary slightly by laboratory; these are the ranges most
 * commonly tested on the NCLEX. Critical/panic values trigger immediate
 * provider notification per typical hospital policy.
 */

export type LabSystem =
  | "hematology"
  | "electrolytes"
  | "renal"
  | "hepatic"
  | "cardiac"
  | "endocrine"
  | "metabolic"
  | "blood-gas"
  | "coagulation";

export interface LabValue {
  id: string;
  name: string;
  abbreviation?: string;
  system: LabSystem;
  range: string;
  units: string;
  /** Values requiring immediate intervention or provider notification. */
  critical?: string;
  /** What this lab actually tells the nurse, in one or two sentences. */
  meaning: string;
  /** Common reasons for abnormal values, briefly. */
  abnormal: string;
  /** NCLEX-relevant nursing pearls — kept tight. */
  nursingPearl?: string;
}

const SYSTEM_LABEL: Record<LabSystem, string> = {
  hematology: "Hematology",
  electrolytes: "Electrolytes",
  renal: "Renal",
  hepatic: "Hepatic",
  cardiac: "Cardiac",
  endocrine: "Endocrine",
  metabolic: "Metabolic",
  "blood-gas": "Arterial blood gas",
  coagulation: "Coagulation",
};

export function labelForSystem(system: LabSystem): string {
  return SYSTEM_LABEL[system];
}

export const labSystems: LabSystem[] = [
  "hematology",
  "electrolytes",
  "renal",
  "hepatic",
  "cardiac",
  "endocrine",
  "metabolic",
  "blood-gas",
  "coagulation",
];

export const labValues: LabValue[] = [
  // ---- Electrolytes ----
  {
    id: "sodium",
    name: "Sodium",
    abbreviation: "Na+",
    system: "electrolytes",
    range: "135–145",
    units: "mEq/L",
    critical: "< 120 or > 160",
    meaning: "Primary extracellular cation; reflects fluid balance and neuro status.",
    abnormal:
      "Hyponatremia → SIADH, heart failure, diuretics, water intoxication. Hypernatremia → dehydration, diabetes insipidus, hypertonic feeds.",
    nursingPearl:
      "Both extremes can cause seizures. Correct slowly to avoid cerebral edema or osmotic demyelination.",
  },
  {
    id: "potassium",
    name: "Potassium",
    abbreviation: "K+",
    system: "electrolytes",
    range: "3.5–5.0",
    units: "mEq/L",
    critical: "< 2.5 or > 6.5",
    meaning: "Primary intracellular cation; tightly tied to cardiac rhythm.",
    abnormal:
      "Hypokalemia → loop/thiazide diuretics, GI losses, alkalosis. Hyperkalemia → renal failure, ACEi/ARBs, K-sparing diuretics, acidosis, rhabdomyolysis.",
    nursingPearl:
      "Never IV push potassium. Monitor ECG: peaked T waves with hyper-K, U waves and flat T with hypo-K.",
  },
  {
    id: "calcium-total",
    name: "Calcium (total)",
    abbreviation: "Ca2+",
    system: "electrolytes",
    range: "8.5–10.5",
    units: "mg/dL",
    critical: "< 7 or > 12",
    meaning: "Bone, neuromuscular, and cardiac function; influenced by albumin and pH.",
    abnormal:
      "Hypocalcemia → hypoparathyroidism, vitamin D deficiency, post-thyroidectomy, alkalosis. Hypercalcemia → malignancy, hyperparathyroidism, prolonged immobility.",
    nursingPearl: "Trousseau and Chvostek signs = hypocalcemia. Always correct for low albumin.",
  },
  {
    id: "magnesium",
    name: "Magnesium",
    abbreviation: "Mg2+",
    system: "electrolytes",
    range: "1.6–2.6",
    units: "mEq/L",
    meaning: "Cofactor for ATP, neuromuscular, cardiac conduction.",
    abnormal:
      "Hypomagnesemia → alcohol use, malabsorption, diuretics. Hypermagnesemia → renal failure, antacids, magnesium sulfate therapy.",
    nursingPearl:
      "Hypomagnesemia often co-exists with hypokalemia and hypocalcemia. Mg sulfate IV → watch DTRs, BP, RR.",
  },
  {
    id: "phosphorus",
    name: "Phosphorus",
    system: "electrolytes",
    range: "2.5–4.5",
    units: "mg/dL",
    meaning: "Inverse relationship with calcium; needed for ATP and bone.",
    abnormal:
      "Hyperphosphatemia → renal failure. Hypophosphatemia → refeeding syndrome, alcohol use disorder.",
  },
  {
    id: "chloride",
    name: "Chloride",
    abbreviation: "Cl-",
    system: "electrolytes",
    range: "98–106",
    units: "mEq/L",
    meaning: "Tracks with sodium; helps interpret acid-base status.",
    abnormal:
      "Hypochloremia → vomiting, NG suction, metabolic alkalosis. Hyperchloremia → dehydration, normal saline overload.",
  },

  // ---- Hematology ----
  {
    id: "wbc",
    name: "White blood cells",
    abbreviation: "WBC",
    system: "hematology",
    range: "5,000–10,000",
    units: "/mm³",
    critical: "< 2,000 or > 30,000",
    meaning: "Immune system activity.",
    abnormal:
      "Leukocytosis → infection, inflammation, leukemia, steroid use. Leukopenia → chemotherapy, sepsis, marrow suppression.",
    nursingPearl:
      "ANC < 500 = severe neutropenia → neutropenic precautions. Don't rely on fever alone in neutropenic clients.",
  },
  {
    id: "hgb",
    name: "Hemoglobin",
    abbreviation: "Hgb",
    system: "hematology",
    range: "Male 13.5–17.5 · Female 12.0–15.5",
    units: "g/dL",
    critical: "< 7",
    meaning: "Oxygen-carrying capacity.",
    abnormal:
      "Low → anemia (iron, B12, chronic disease, blood loss). High → dehydration, polycythemia, COPD, smoking.",
    nursingPearl: "Transfusion threshold typically Hgb < 7 (or < 8 in cardiac disease).",
  },
  {
    id: "hct",
    name: "Hematocrit",
    abbreviation: "Hct",
    system: "hematology",
    range: "Male 41–53 · Female 36–46",
    units: "%",
    meaning: "Percent of blood volume that is red cells. Roughly 3× the Hgb.",
    abnormal: "Same drivers as hemoglobin.",
  },
  {
    id: "platelets",
    name: "Platelets",
    system: "hematology",
    range: "150,000–400,000",
    units: "/mm³",
    critical: "< 50,000 (bleeding risk) · < 20,000 (spontaneous)",
    meaning: "Primary hemostasis.",
    abnormal: "Low → ITP, DIC, heparin-induced thrombocytopenia, leukemia, cirrhosis.",
    nursingPearl:
      "Bleeding precautions when < 50,000. Hold low-molecular-weight heparin and NSAIDs.",
  },

  // ---- Renal ----
  {
    id: "bun",
    name: "Blood urea nitrogen",
    abbreviation: "BUN",
    system: "renal",
    range: "7–20",
    units: "mg/dL",
    meaning: "Reflects kidney function and hydration status.",
    abnormal:
      "Elevated → renal failure, dehydration, GI bleed, high-protein diet. Low → liver failure, malnutrition, pregnancy.",
    nursingPearl: "BUN:Cr ratio > 20:1 suggests dehydration or pre-renal cause.",
  },
  {
    id: "creatinine",
    name: "Creatinine",
    abbreviation: "Cr",
    system: "renal",
    range: "0.6–1.2",
    units: "mg/dL",
    meaning: "Best simple marker of glomerular filtration; muscle waste product.",
    abnormal: "Elevated → AKI, CKD, nephrotoxic medications.",
    nursingPearl: "Hold metformin and IV contrast when creatinine is elevated.",
  },
  {
    id: "gfr",
    name: "Estimated GFR",
    abbreviation: "eGFR",
    system: "renal",
    range: "> 90",
    units: "mL/min/1.73 m²",
    meaning: "Calculated kidney function; stages CKD.",
    abnormal:
      "60–89 mild ↓ · 30–59 moderate ↓ · 15–29 severe ↓ · < 15 kidney failure / dialysis territory.",
  },

  // ---- Hepatic ----
  {
    id: "alt",
    name: "ALT (alanine aminotransferase)",
    abbreviation: "ALT",
    system: "hepatic",
    range: "7–56",
    units: "U/L",
    meaning: "Most specific marker of hepatocellular injury.",
    abnormal: "Elevated → hepatitis, fatty liver, drug-induced (statins, acetaminophen).",
  },
  {
    id: "ast",
    name: "AST (aspartate aminotransferase)",
    abbreviation: "AST",
    system: "hepatic",
    range: "10–40",
    units: "U/L",
    meaning: "Liver and muscle injury marker.",
    abnormal: "AST > ALT classically suggests alcoholic liver disease (2:1 ratio).",
  },
  {
    id: "bilirubin-total",
    name: "Bilirubin (total)",
    system: "hepatic",
    range: "0.3–1.0",
    units: "mg/dL",
    meaning: "Heme breakdown; reflects liver and biliary function.",
    abnormal:
      "Elevated → biliary obstruction, hemolysis, cirrhosis. Newborn > 15 mg/dL → phototherapy.",
  },
  {
    id: "albumin",
    name: "Albumin",
    system: "hepatic",
    range: "3.5–5.0",
    units: "g/dL",
    meaning: "Liver synthetic function and overall nutrition.",
    abnormal: "Low → cirrhosis, malnutrition, nephrotic syndrome, burns.",
  },

  // ---- Cardiac ----
  {
    id: "troponin",
    name: "Troponin I",
    system: "cardiac",
    range: "< 0.04",
    units: "ng/mL",
    critical: "Any elevation in the right context",
    meaning: "Highly specific marker of myocardial injury.",
    abnormal: "Rises 3–6 h after MI, peaks 12–24 h, stays elevated 7–14 days.",
    nursingPearl: "Serial troponins q3–6h. Trend matters as much as the absolute number.",
  },
  {
    id: "bnp",
    name: "BNP (B-type natriuretic peptide)",
    abbreviation: "BNP",
    system: "cardiac",
    range: "< 100",
    units: "pg/mL",
    meaning: "Released when ventricles stretch — a marker of heart failure.",
    abnormal: "> 400 strongly suggests HF; > 900 in NT-proBNP equivalent.",
  },

  // ---- Endocrine ----
  {
    id: "tsh",
    name: "TSH (thyroid stimulating hormone)",
    abbreviation: "TSH",
    system: "endocrine",
    range: "0.4–4.0",
    units: "mIU/L",
    meaning: "Most sensitive screening test for thyroid function.",
    abnormal:
      "High TSH = hypothyroidism. Low TSH = hyperthyroidism (with high T3/T4) or pituitary issue.",
  },
  {
    id: "a1c",
    name: "Hemoglobin A1c",
    abbreviation: "A1c",
    system: "endocrine",
    range: "< 5.7 normal · 5.7–6.4 prediabetes · ≥ 6.5 diabetes",
    units: "%",
    meaning: "Average glucose over ~3 months.",
    abnormal: "ADA target for most adults with diabetes is < 7%.",
  },
  {
    id: "glucose-fasting",
    name: "Fasting glucose",
    system: "endocrine",
    range: "70–100",
    units: "mg/dL",
    critical: "< 50 or > 400",
    meaning: "Snapshot of glycemic control after at least 8h fast.",
    abnormal: "100–125 = prediabetes. ≥ 126 on two occasions = diabetes.",
    nursingPearl: "Hypoglycemia treatment: 15 g fast carbs → recheck in 15 min (rule of 15s).",
  },

  // ---- Metabolic ----
  {
    id: "lactate",
    name: "Lactate",
    system: "metabolic",
    range: "0.5–2.2",
    units: "mmol/L",
    critical: "> 4 in sepsis",
    meaning: "Anaerobic metabolism; rises with poor tissue perfusion.",
    abnormal: "Elevated → sepsis, shock, intestinal ischemia, metformin toxicity.",
    nursingPearl:
      "Sepsis bundle: lactate > 2 mmol/L → repeat after fluid resuscitation. > 4 → severe.",
  },

  // ---- Blood gas (arterial) ----
  {
    id: "abg-ph",
    name: "ABG — pH",
    system: "blood-gas",
    range: "7.35–7.45",
    units: "",
    critical: "< 7.20 or > 7.60",
    meaning: "Overall acid-base status.",
    abnormal: "↓ pH = acidosis; ↑ pH = alkalosis.",
  },
  {
    id: "abg-paco2",
    name: "ABG — PaCO2",
    system: "blood-gas",
    range: "35–45",
    units: "mm Hg",
    meaning: "Respiratory contribution to acid-base balance.",
    abnormal: "↑ PaCO2 → respiratory acidosis. ↓ PaCO2 → respiratory alkalosis.",
    nursingPearl: "ROME — Respiratory Opposite, Metabolic Equal — to interpret ABGs quickly.",
  },
  {
    id: "abg-hco3",
    name: "ABG — HCO3-",
    system: "blood-gas",
    range: "22–26",
    units: "mEq/L",
    meaning: "Metabolic contribution to acid-base balance.",
    abnormal: "↑ HCO3- → metabolic alkalosis. ↓ HCO3- → metabolic acidosis.",
  },
  {
    id: "abg-pao2",
    name: "ABG — PaO2",
    system: "blood-gas",
    range: "80–100",
    units: "mm Hg",
    critical: "< 60",
    meaning: "Partial pressure of dissolved oxygen.",
    abnormal: "PaO2 < 60 = hypoxemia → escalate oxygen therapy.",
  },
  {
    id: "spo2",
    name: "SpO2 (pulse oximetry)",
    abbreviation: "SpO2",
    system: "blood-gas",
    range: "95–100",
    units: "%",
    critical: "< 90",
    meaning: "Non-invasive estimate of oxygen saturation.",
    abnormal: "< 90% generally requires intervention; targets vary in COPD (88–92%).",
  },

  // ---- Coagulation ----
  {
    id: "inr",
    name: "INR (international normalized ratio)",
    abbreviation: "INR",
    system: "coagulation",
    range: "0.8–1.2 (no anticoagulation)",
    units: "",
    critical: "> 5",
    meaning: "Warfarin therapy monitoring; standardized PT.",
    abnormal:
      "Therapeutic 2–3 for most indications · 2.5–3.5 for mechanical valves. > 5 = high bleed risk.",
    nursingPearl:
      "Vitamin K is the antidote for warfarin; for severe bleed give 4-factor PCC.",
  },
  {
    id: "ptt",
    name: "aPTT",
    system: "coagulation",
    range: "30–40",
    units: "seconds",
    meaning: "Heparin therapy monitoring; reflects intrinsic pathway.",
    abnormal: "Therapeutic 1.5–2.5× control. Antidote for heparin is protamine sulfate.",
  },
  {
    id: "d-dimer",
    name: "D-dimer",
    system: "coagulation",
    range: "< 500",
    units: "ng/mL",
    meaning: "Fibrin degradation product; rules out DVT/PE when negative.",
    abnormal: "Elevated in clot, infection, post-op, pregnancy, malignancy. Sensitive, not specific.",
  },
];
