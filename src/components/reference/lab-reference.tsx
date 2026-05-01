"use client";

import { useMemo, useState } from "react";
import { labelForSystem, labSystems, type LabSystem, type LabValue } from "@/lib/content/lab-values";
import { cn } from "@/lib/utils";

interface LabReferenceProps {
  labs: LabValue[];
}

export function LabReference({ labs }: LabReferenceProps) {
  const [query, setQuery] = useState("");
  const [systems, setSystems] = useState<LabSystem[]>([]);

  const matched = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return labs.filter((lab) => {
      if (systems.length > 0 && !systems.includes(lab.system)) return false;
      if (!needle) return true;
      const haystack = [lab.name, lab.abbreviation ?? "", lab.meaning, lab.abnormal]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [labs, query, systems]);

  function toggleSystem(s: LabSystem) {
    setSystems((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  const usedSystems = labSystems.filter((s) => labs.some((l) => l.system === s));

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <label className="block">
          <span className="sr-only">Search lab values</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search labs"
            className="w-full rounded-full border border-ink/15 bg-paper px-5 py-3 font-body text-[15px] text-ink placeholder:text-ink-faint focus:border-ink/40 focus:outline-none"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {usedSystems.map((s) => {
            const active = systems.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleSystem(s)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 font-body text-[13px] tracking-[0.005em] transition-colors duration-200",
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 bg-paper text-ink-soft hover:border-ink/40 hover:text-ink",
                )}
              >
                {labelForSystem(s)}
              </button>
            );
          })}
          {systems.length > 0 && (
            <button
              onClick={() => setSystems([])}
              className="ml-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-faint hover:text-ink"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {matched.length === 0 ? (
        <p className="rounded-xl border border-ink/10 bg-paper-deep/40 px-5 py-6 font-body text-[14.5px] text-ink-soft">
          No labs match that search.
        </p>
      ) : (
        <ul className="space-y-3">
          {matched.map((lab) => (
            <LabRow key={lab.id} lab={lab} />
          ))}
        </ul>
      )}
    </div>
  );
}

function LabRow({ lab }: { lab: LabValue }) {
  return (
    <li>
      <details className="group rounded-xl border border-ink/10 bg-paper transition-colors duration-200 open:bg-paper-deep/30">
        <summary className="flex cursor-pointer flex-wrap items-baseline justify-between gap-4 px-5 py-4 sm:px-6">
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-[1.125rem] tracking-[-0.01em] text-ink">
              {lab.name}
            </span>
            {lab.abbreviation ? (
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                {lab.abbreviation}
              </span>
            ) : null}
          </span>
          <span className="flex flex-wrap items-baseline gap-2">
            <span className="font-mono text-[13.5px] text-ink">{lab.range}</span>
            {lab.units ? (
              <span className="font-mono text-[11px] text-ink-faint">{lab.units}</span>
            ) : null}
            <span
              aria-hidden
              className="ml-2 text-ink-faint transition-transform duration-200 group-open:rotate-90"
            >
              →
            </span>
          </span>
        </summary>

        <div className="border-t border-ink/10 px-5 py-5 sm:px-6 sm:py-6">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            <Field label="What it tells you" value={lab.meaning} />
            <Field label="Common reasons it's off" value={lab.abnormal} />
            {lab.critical ? <Field label="Critical / panic" value={lab.critical} /> : null}
            {lab.nursingPearl ? <Field label="Nursing pearl" value={lab.nursingPearl} /> : null}
          </dl>
        </div>
      </details>
    </li>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
        {label}
      </dt>
      <dd className="mt-2 font-body text-[14.5px] leading-[1.6] text-ink">{value}</dd>
    </div>
  );
}
