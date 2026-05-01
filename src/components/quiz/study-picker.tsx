"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/primitives/button";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { StudySession } from "@/components/quiz/study-session";
import { clearSession } from "@/lib/store/session";
import {
  bodySystemLabel,
  emptyFilter,
  filterItems,
  itemTypeLabel,
  specialtyLabel,
  uniqueBodySystems,
  uniqueItemTypes,
  uniqueSpecialties,
  type StudyFilter,
} from "@/lib/content/filters";
import type { ItemType, Question } from "@/lib/types/question";
import { cn } from "@/lib/utils";

interface StudyPickerProps {
  bank: Question[];
}

export function StudyPicker({ bank }: StudyPickerProps) {
  const [filter, setFilter] = useState<StudyFilter>(emptyFilter);
  const [size, setSize] = useState<5 | 10 | 25 | 0>(10); // 0 = all
  const [started, setStarted] = useState(false);

  const allSpecialties = useMemo(() => uniqueSpecialties(bank), [bank]);
  const allBodySystems = useMemo(() => uniqueBodySystems(bank), [bank]);
  const allItemTypes = useMemo(() => uniqueItemTypes(bank), [bank]);

  const matched = useMemo(() => filterItems(bank, filter), [bank, filter]);
  const effectiveSize = size === 0 ? matched.length : Math.min(size, matched.length);

  const session = useMemo(() => {
    return matched.slice(0, effectiveSize);
  }, [matched, effectiveSize]);

  if (started) {
    return (
      <div>
        <button
          onClick={() => setStarted(false)}
          className="mb-6 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint hover:text-ink"
        >
          <span aria-hidden>←</span> Change set
        </button>
        <StudySession items={session} />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <Eyebrow>Build a set</Eyebrow>
        <h1 className="font-display text-[clamp(2rem,4.4vw,3.25rem)] font-light leading-[1.08] tracking-[-0.025em] text-ink">
          Pick what you want to study.
        </h1>
        <p className="max-w-[58ch] font-body text-[1rem] leading-[1.6] text-ink-soft">
          Filter the bank, choose how many, then start. Leave a filter empty to include everything.
        </p>
      </header>

      <FilterGroup
        label="Question type"
        all={allItemTypes.map((t) => ({ value: t, label: itemTypeLabel(t) }))}
        selected={filter.itemTypes}
        onChange={(itemTypes) => setFilter((f) => ({ ...f, itemTypes: itemTypes as ItemType[] }))}
      />

      <FilterGroup
        label="Specialty"
        all={allSpecialties.map((s) => ({ value: s, label: specialtyLabel(s) }))}
        selected={filter.specialties}
        onChange={(specialties) => setFilter((f) => ({ ...f, specialties }))}
      />

      <FilterGroup
        label="Body system"
        all={allBodySystems.map((s) => ({ value: s, label: bodySystemLabel(s) }))}
        selected={filter.bodySystems}
        onChange={(bodySystems) => setFilter((f) => ({ ...f, bodySystems }))}
      />

      <section className="space-y-4">
        <Eyebrow withRule={false}>Set size</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {[5, 10, 25, 0].map((n) => (
            <button
              key={n}
              onClick={() => setSize(n as 5 | 10 | 25 | 0)}
              className={cn(
                "rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-200",
                size === n
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/15 bg-paper text-ink-soft hover:border-ink/40",
              )}
            >
              {n === 0 ? "All" : n}
            </button>
          ))}
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
          {matched.length} match{matched.length === 1 ? "" : "es"} · {effectiveSize} in this set
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {(filter.itemTypes.length > 0 ||
            filter.specialties.length > 0 ||
            filter.bodySystems.length > 0) && (
            <button
              onClick={() => setFilter(emptyFilter)}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint hover:text-ink"
            >
              Reset filters
            </button>
          )}
          <Button
            onClick={() => {
              // Clear any stale persisted session so the new set always starts fresh.
              clearSession();
              setStarted(true);
            }}
            disabled={effectiveSize === 0}
            arrow
            aria-disabled={effectiveSize === 0}
          >
            Start set
          </Button>
        </div>
      </footer>
    </div>
  );
}

interface FilterGroupProps {
  label: string;
  all: { value: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
}

function FilterGroup({ label, all, selected, onChange }: FilterGroupProps) {
  if (all.length === 0) return null;
  return (
    <section className="space-y-4">
      <Eyebrow withRule={false}>{label}</Eyebrow>
      <div className="flex flex-wrap gap-2">
        {all.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() =>
                onChange(
                  isSelected ? selected.filter((s) => s !== opt.value) : [...selected, opt.value],
                )
              }
              aria-pressed={isSelected}
              className={cn(
                "rounded-full border px-4 py-1.5 font-body text-[13.5px] tracking-[0.005em] transition-colors duration-200",
                isSelected
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/15 bg-paper text-ink-soft hover:border-ink/40 hover:text-ink",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
