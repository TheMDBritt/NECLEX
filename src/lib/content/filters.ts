import type { ItemType, Question } from "@/lib/types/question";

export interface StudyFilter {
  itemTypes: ItemType[]; // empty = any
  specialties: string[]; // empty = any
  bodySystems: string[]; // empty = any
  topics: string[]; // empty = any
  /**
   * NCSBN content area: either a Client Need top-level slug
   * (e.g. "psychosocial-integrity") OR a Physiological Integrity / Safe-
   * and-effective-care sub-category slug (e.g. "pharmacological-and-
   * parenteral-therapies"). The filter matches a question if either its
   * clientNeed OR its subCategory is in the list.
   */
  ncsbnAreas: string[];
}

export const emptyFilter: StudyFilter = {
  itemTypes: [],
  specialties: [],
  bodySystems: [],
  topics: [],
  ncsbnAreas: [],
};

const SPECIALTY_LABEL: Record<string, string> = {
  "med-surg": "Med-surg",
  peds: "Pediatrics",
  ob: "Maternity",
  "mental-health": "Mental health",
  leadership: "Leadership",
};

const BODY_SYSTEM_LABEL: Record<string, string> = {
  cardiac: "Cardiac",
  respiratory: "Respiratory",
  neuro: "Neuro",
  gi: "GI",
  renal: "Renal / GU",
  endocrine: "Endocrine",
  hematologic: "Hematologic",
  immune: "Immune",
  integumentary: "Integumentary",
  msk: "MSK",
  repro: "Reproductive",
  "mental-health": "Mental health",
  multisystem: "Multisystem",
};

const CLIENT_NEED_LABEL: Record<string, string> = {
  "safe-and-effective-care-environment": "Safe & effective care",
  "health-promotion-and-maintenance": "Health promotion",
  "psychosocial-integrity": "Psychosocial",
  "physiological-integrity": "Physiological integrity",
};

const SUB_CATEGORY_LABEL: Record<string, string> = {
  "management-of-care": "Mgmt of care",
  "safety-and-infection-control": "Safety & infection",
  "basic-care-and-comfort": "Basic care & comfort",
  "pharmacological-and-parenteral-therapies": "Pharm & parenteral",
  "reduction-of-risk-potential": "Reduction of risk",
  "physiological-adaptation": "Phys adaptation",
};

const ITEM_TYPE_LABEL: Record<ItemType, string> = {
  multiple_choice: "Single best answer",
  multiple_response: "Select all that apply",
  fill_in_the_blank: "Fill in the blank",
  ordered_response: "Ordered response",
  hot_spot: "Hot spot",
  audio: "Audio",
  graphic: "Graphic",
  chart_exhibit: "Chart / exhibit",
  extended_multi_response: "Extended multi-response",
  extended_drag_drop: "Drag and drop",
  cloze_dropdown: "Drop-down (cloze)",
  enhanced_hotspot_highlight: "Highlight",
  matrix_multiple_choice: "Matrix (single)",
  matrix_multiple_response: "Matrix (multi)",
  bow_tie: "Bow-tie",
  trend: "Trend",
};

export function specialtyLabel(slug: string): string {
  return SPECIALTY_LABEL[slug] ?? slug;
}

export function bodySystemLabel(slug: string): string {
  // Fall back to a Title-Cased version of the slug instead of the raw slug,
  // so any unknown body system shows up cleanly in the UI.
  return BODY_SYSTEM_LABEL[slug] ?? toTitleCase(slug);
}

export function clientNeedLabel(slug: string): string {
  return CLIENT_NEED_LABEL[slug] ?? toTitleCase(slug);
}

export function ncsbnCategoryLabel(slug: string): string {
  // For the picker's NCSBN row, prefer the sub-category label (which maps
  // to the canonical NCLEX content area), and fall back to the top-level
  // Client Need for the two categories that have no sub-categories
  // (Health Promotion, Psychosocial Integrity).
  return SUB_CATEGORY_LABEL[slug] ?? CLIENT_NEED_LABEL[slug] ?? toTitleCase(slug);
}

function toTitleCase(slug: string): string {
  if (!slug) return slug;
  return slug
    .split(/[-_\s]+/)
    .map((part) => (part.length === 0 ? part : part[0]!.toUpperCase() + part.slice(1)))
    .join(" ");
}

export function itemTypeLabel(t: ItemType): string {
  return ITEM_TYPE_LABEL[t];
}

export function uniqueSpecialties(items: readonly Question[]): string[] {
  return Array.from(
    new Set(items.map((q) => q.tags.specialty).filter((s): s is string => Boolean(s))),
  ).sort();
}

export function uniqueBodySystems(items: readonly Question[]): string[] {
  return Array.from(
    new Set(items.map((q) => q.tags.bodySystem).filter((s): s is string => Boolean(s))),
  ).sort();
}

export function uniqueItemTypes(items: readonly Question[]): ItemType[] {
  return Array.from(new Set(items.map((q) => q.itemType))).sort();
}

/**
 * Distinct NCSBN content areas across the bank. Returns subcategory slugs
 * when present (Mgmt of care, Pharm, etc.), and the top-level Client Need
 * slug for items without a subcategory (Health Promo, Psychosocial).
 */
export function uniqueNcsbnAreas(items: readonly Question[]): string[] {
  const set = new Set<string>();
  for (const q of items) {
    if (q.tags.subCategory) set.add(q.tags.subCategory);
    else set.add(q.tags.clientNeed);
  }
  return Array.from(set).sort();
}

export function uniqueTopics(items: readonly Question[]): string[] {
  return Array.from(
    new Set(items.map((q) => q.tags.contentTopic).filter((t): t is string => Boolean(t))),
  ).sort();
}

export function topicLabel(slug: string): string {
  // Friendly-ize a kebab-case slug: "heart-failure" -> "Heart failure"
  if (!slug) return slug;
  const sentence = slug.replace(/-/g, " ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

export function filterItems(items: readonly Question[], filter: StudyFilter): Question[] {
  return items.filter((q) => {
    if (filter.itemTypes.length > 0 && !filter.itemTypes.includes(q.itemType)) return false;
    if (
      filter.specialties.length > 0 &&
      (!q.tags.specialty || !filter.specialties.includes(q.tags.specialty))
    )
      return false;
    if (
      filter.bodySystems.length > 0 &&
      (!q.tags.bodySystem || !filter.bodySystems.includes(q.tags.bodySystem))
    )
      return false;
    if (
      filter.topics.length > 0 &&
      (!q.tags.contentTopic || !filter.topics.includes(q.tags.contentTopic))
    )
      return false;
    if (filter.ncsbnAreas.length > 0) {
      const matches =
        (q.tags.subCategory && filter.ncsbnAreas.includes(q.tags.subCategory)) ||
        filter.ncsbnAreas.includes(q.tags.clientNeed);
      if (!matches) return false;
    }
    return true;
  });
}
