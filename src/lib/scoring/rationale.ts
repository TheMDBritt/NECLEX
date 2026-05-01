import type { Option } from "@/lib/types/question";

export interface RationaleSectionResult {
  awarded: number;
  max: number;
  isFullyCorrect: boolean;
}

/**
 * Rationale (linked all-or-nothing) scoring for an NGN linked unit.
 *
 * - The selection must include EXACTLY the correct option(s) from `options`,
 *   no extras and no misses, to earn the section point.
 * - A correctly selected wrong number of options awards 0.
 * - Each section contributes one point to the item total.
 *
 * Reference: NCSBN NGN scoring — used for cloze pairs, matrix rows linked
 * to a single concept, and bow-tie sections.
 */
export function scoreRationaleSection(
  options: readonly Option[],
  selectedIds: readonly string[],
): RationaleSectionResult {
  const selected = new Set(selectedIds);
  const correctIds = options.filter((o) => o.isCorrect).map((o) => o.id);
  const correctSet = new Set(correctIds);

  const exactMatch =
    selected.size === correctSet.size &&
    [...selected].every((id) => correctSet.has(id));

  return {
    awarded: exactMatch ? 1 : 0,
    max: 1,
    isFullyCorrect: exactMatch,
  };
}
