import type { Option } from "@/lib/types/question";

export interface ScoringResult {
  awardedPoints: number;
  maxPoints: number;
  /** True only when awarded === max (i.e. fully correct). */
  isFullyCorrect: boolean;
}

/**
 * NCSBN Polytomous +/- scoring (NGN multi-select / Extended Multiple Response):
 *
 *   For each option SELECTED by the candidate:
 *     +1 if it is a correct answer
 *     -1 if it is a distractor
 *   Options that the candidate did NOT select contribute 0 points.
 *
 *   The item is floored at 0 — points cannot go negative on a single item.
 *   Max points = number of correct options on the item.
 *
 * Reference: NCSBN Next Generation NCLEX scoring rules — only the candidate's
 * affirmative selections are scored; non-selection neither rewards nor
 * penalizes. This matches the NCSBN candidate FAQ description of
 * "+1 for each correct selection, -1 for each incorrect selection, with
 * a floor of 0."
 */
export function scorePolytomousPlusMinus(
  options: readonly Option[],
  selectedIds: readonly string[],
): ScoringResult {
  const optionById = new Map(options.map((o) => [o.id, o]));
  let raw = 0;
  for (const id of selectedIds) {
    const opt = optionById.get(id);
    if (!opt) continue; // ignore phantom ids
    raw += opt.isCorrect ? 1 : -1;
  }
  const max = options.filter((o) => o.isCorrect).length;
  const awarded = Math.max(0, raw);
  return {
    awardedPoints: awarded,
    maxPoints: max,
    isFullyCorrect: max > 0 && awarded === max,
  };
}
