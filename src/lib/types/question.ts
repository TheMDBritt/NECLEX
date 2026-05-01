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
