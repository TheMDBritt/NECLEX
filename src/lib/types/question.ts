/**
 * Domain types for NCLEX questions. These mirror the database schema in
 * supabase/migrations/20260501000000_standards_taxonomy.sql and will grow
 * as more item types come online.
 */

export type ExamTarget = "RN" | "PN";

export type ItemType =
  | "multiple_choice"
  | "multiple_response"
  | "fill_in_the_blank"
  | "ordered_response"
  | "hot_spot"
  | "audio"
  | "graphic"
  | "chart_exhibit"
  | "extended_multi_response"
  | "extended_drag_drop"
  | "cloze_dropdown"
  | "enhanced_hotspot_highlight"
  | "matrix_multiple_choice"
  | "matrix_multiple_response"
  | "bow_tie"
  | "trend";

export type ScoringRule =
  | "dichotomous"
  | "polytomous_plus_minus"
  | "polytomous_rationale";

export type CjmmStepSlug =
  | "recognize-cues"
  | "analyze-cues"
  | "prioritize-hypotheses"
  | "generate-solutions"
  | "take-actions"
  | "evaluate-outcomes";

export interface QuestionTags {
  examTarget: ExamTarget;
  clientNeed: string;
  subCategory?: string;
  integratedProcess?: string;
  cjmmStep?: CjmmStepSlug;
  bodySystem?: string;
  contentTopic?: string;
  specialty?: string;
}

export interface Option {
  id: string;
  label: string;
  isCorrect: boolean;
  /** Optional per-option rationale shown in the distractor breakdown. */
  feedback?: string;
}

export interface Source {
  label: string;
  url?: string;
}

export interface Rationale {
  /** The full explanation shown on review. Markdown-allowed. */
  body: string;
  /** Each cited source must trace to NCSBN, FDA, AHA, CDC, etc. */
  sources: Source[];
}

export interface MultipleChoiceQuestion {
  id: string;
  itemType: "multiple_choice";
  scoringRule: "dichotomous";
  stem: string;
  options: Option[];
  rationale: Rationale;
  tags: QuestionTags;
}

/**
 * Multiple Response (SATA) — every option independently selectable.
 *
 * Scored polytomous +/-: +1 for each correct option chosen (or correctly
 * not chosen), -1 for each incorrect choice (or correct option missed).
 * Floor 0 per item (cannot go negative).
 */
export interface MultipleResponseQuestion {
  id: string;
  itemType: "multiple_response";
  scoringRule: "polytomous_plus_minus";
  stem: string;
  options: Option[];
  rationale: Rationale;
  tags: QuestionTags;
}

/**
 * Fill-in-the-Blank — typically a dosage-calc item. Numeric answer with
 * an accepted range to allow for legitimate rounding differences.
 */
export interface FillInTheBlankQuestion {
  id: string;
  itemType: "fill_in_the_blank";
  scoringRule: "dichotomous";
  stem: string;
  /** Inclusive numeric range that counts as correct (e.g. 41.6–41.7 mL/hr). */
  acceptedMin: number;
  acceptedMax: number;
  /** What the learner is being asked to enter. */
  units: string;
  /** Decimal places to preserve in display feedback. */
  decimals?: number;
  rationale: Rationale;
  tags: QuestionTags;
}

/**
 * Bow-Tie — the marquee NGN item type. A single client scenario produces
 * three linked sections:
 *   - Actions to Take      (multi-select, exactly N correct)
 *   - Condition Most Likely (single-select)
 *   - Parameters to Monitor (multi-select, exactly N correct)
 *
 * Scoring is rationale-linked (NCSBN polytomous): the candidate earns full
 * credit for a section ONLY if all picks within that section are correct.
 * The item awards a max of 3 points (one per section).
 */
export interface BowTieQuestion {
  id: string;
  itemType: "bow_tie";
  scoringRule: "polytomous_rationale";
  stem: string;
  actions: {
    /** How many actions must be selected; exam-typical is 2. */
    selectCount: number;
    options: Option[];
  };
  condition: {
    options: Option[];
  };
  monitor: {
    selectCount: number;
    options: Option[];
  };
  rationale: Rationale;
  tags: QuestionTags;
}

export type Question =
  | MultipleChoiceQuestion
  | MultipleResponseQuestion
  | FillInTheBlankQuestion
  | BowTieQuestion;
