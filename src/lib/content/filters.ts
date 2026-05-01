import type { ItemType, Question } from "@/lib/types/question";

export interface StudyFilter {
  itemTypes: ItemType[]; // empty = any
  specialties: string[]; // empty = any
  bodySystems: string[]; // empty = any
}

export const emptyFilter: StudyFilter = {
  itemTypes: [],
  specialties: [],
  bodySystems: [],
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
  repro: "Reproductive",
  "mental-health": "Mental health",
  multisystem: "Multisystem",
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
  return BODY_SYSTEM_LABEL[slug] ?? slug;
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
    return true;
  });
}
