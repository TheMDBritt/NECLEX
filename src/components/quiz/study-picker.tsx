"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/primitives/button";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { StudySession } from "@/components/quiz/study-session";
import { clearSession } from "@/lib/store/session";
import { shuffleWithSeed } from "@/lib/shuffle";
import {
  bodySystemLabel,
  emptyFilter,
  filterItems,
  itemTypeLabel,
  ncsbnCategoryLabel,
  specialtyLabel,
  uniqueBodySystems,
  uniqueItemTypes,
  uniqueNcsbnAreas,
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
  const [size, setSize] = useState<5 | 10 | 25 | 0>(10);
  const [started, setStarted] = useState(false);
  const [orderSeed, setOrderSeed] = useState<string>(() => `seed-${Date.now()}`);

  const allSpecialties = useMemo(() => uniqueSpecialties(bank), [bank]);
  const allBodySystems = useMemo(() => uniqueBodySystems(bank), [bank]);
  const allItemTypes = useMemo(() => uniqueItemTypes(bank), [bank]);
  const allNcsbnAreas = useMemo(() => uniqueNcsbnAreas(bank), [bank]);

  const matched = useMemo(() => filterItems(bank, filter), [bank, filter]);
  const effectiveSize = size === 0 ? matched.length : Math.min(size, matched.length);

  const session = useMemo(
    () => shuffleWithSeed(matched, orderSeed).slice(0, effectiveSize),
    [matched, effectiveSize, orderSeed],
  );

  function start() {
    setOrderSeed(`seed-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    clearSession();
    setStarted(true);
  }

  function quickStart(specialty?: string) {
    setFilter(specialty ? { ...emptyFilter, specialties: [specialty] } : emptyFilter);
    setSize(10);
    requestAnimationFrame(start);
  }

  if (started) {
    return (
      <div>
        <button
          onClick={() => setStarted(false)}
          className="mb-6 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint hover:text-ink"
        >
          <span aria-hidden>←</span> Pick a different set
        </button>
        <StudySession items={session} />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <Eyebrow>Study</Eyebrow>
        <h1 className="font-display text-[clamp(2rem,4.4vw,3.25rem)] font-light leading-[1.08] tracking-[-0.025em] text-ink">
          Pick a set.
        </h1>
        <p className="font-body text-[1rem] leading-[1.6] text-ink-soft">
          Tap a quick start, or build your own below.
        </p>
      </header>

      <section className="space-y-4">
        <Eyebrow withRule={false}>Quick start</Eyebrow>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => quickStart()}
            className="rounded-full bg-ink px-5 py-2.5 font-body text-[14px] tracking-[0.005em] text-paper transition-colors duration-200 hover:bg-indigo-deep"
          >
            10 random
          </button>
          {allSpecialties.map((s) => (
            <button
              key={s}
              onClick={() => quickStart(s)}
              className="rounded-full border border-ink/15 bg-paper px-5 py-2.5 font-body text-[14px] tracking-[0.005em] text-ink-soft transition-colors duration-200 hover:border-ink/40 hover:text-ink"
            >
              10 in {specialtyLabel(s)}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Eyebrow withRule={false}>Or build your own</Eyebrow>

        <FilterRow
          label="NCSBN content area"
          all={allNcsbnAreas.map((s) => ({ value: s, label: ncsbnCategoryLabel(s) }))}
          selected={filter.ncsbnAreas}
          onChange={(ncsbnAreas) => setFilter((f) => ({ ...f, ncsbnAreas }))}
        />

        <FilterRow
          label="Body system"
          all={allBodySystems.map((s) => ({ value: s, label: bodySystemLabel(s) }))}
          selected={filter.bodySystems}
          onChange={(bodySystems) => setFilter((f) => ({ ...f, bodySystems }))}
        />

        <FilterRow
          label="Question type"
          all={allItemTypes.map((t) => ({ value: t, label: itemTypeLabel(t) }))}
          selected={filter.itemTypes}
          onChange={(itemTypes) =>
            setFilter((f) => ({ ...f, itemTypes: itemTypes as ItemType[] }))
          }
        />

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            How many
          </span>
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

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
            {matched.length} match{matched.length === 1 ? "" : "es"} · {effectiveSize} in this set
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {(filter.bodySystems.length > 0 ||
              filter.itemTypes.length > 0 ||
              filter.ncsbnAreas.length > 0) && (
              <button
                onClick={() => setFilter(emptyFilter)}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint hover:text-ink"
              >
                Reset
              </button>
            )}
            <Button
              onClick={start}
              disabled={effectiveSize === 0}
              arrow
              aria-disabled={effectiveSize === 0}
            >
              Start set
            </Button>
          </div>
        </footer>
      </section>
    </div>
  );
}

interface FilterRowProps {
  label: string;
  all: { value: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
}

function FilterRow({ label, all, selected, onChange }: FilterRowProps) {
  if (all.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">{label}</p>
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
                "rounded-full border px-3.5 py-1.5 font-body text-[13px] tracking-[0.005em] transition-colors duration-200",
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
    </div>
  );
}
