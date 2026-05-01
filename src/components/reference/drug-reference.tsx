"use client";

import { useMemo, useState } from "react";
import { classLabel, type Drug, type DrugClass } from "@/lib/content/drugs";
import { cn } from "@/lib/utils";

interface DrugReferenceProps {
  drugs: Drug[];
}

export function DrugReference({ drugs }: DrugReferenceProps) {
  const [query, setQuery] = useState("");
  const [classes, setClasses] = useState<DrugClass[]>([]);

  const allClasses = useMemo(
    () =>
      Array.from(new Set(drugs.map((d) => d.className))).sort((a, b) =>
        classLabel(a).localeCompare(classLabel(b)),
      ),
    [drugs],
  );

  const matched = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return drugs.filter((d) => {
      if (classes.length > 0 && !classes.includes(d.className)) return false;
      if (!needle) return true;
      const haystack = [d.generic, ...(d.brand ?? []), d.classLabel, d.mechanism, ...d.indications]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [drugs, query, classes]);

  function toggleClass(c: DrugClass) {
    setClasses((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <label className="block">
          <span className="sr-only">Search drugs</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, brand, or class"
            className="w-full rounded-full border border-ink/15 bg-paper px-5 py-3 font-body text-[15px] text-ink placeholder:text-ink-faint focus:border-ink/40 focus:outline-none"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {allClasses.map((c) => {
            const active = classes.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleClass(c)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 font-body text-[13px] tracking-[0.005em] transition-colors duration-200",
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 bg-paper text-ink-soft hover:border-ink/40 hover:text-ink",
                )}
              >
                {classLabel(c)}
              </button>
            );
          })}
          {classes.length > 0 && (
            <button
              onClick={() => setClasses([])}
              className="ml-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-faint hover:text-ink"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {matched.length === 0 ? (
        <p className="rounded-xl border border-ink/10 bg-paper-deep/40 px-5 py-6 font-body text-[14.5px] text-ink-soft">
          No drugs match that search.
        </p>
      ) : (
        <ul className="space-y-3">
          {matched.map((drug) => (
            <DrugRow key={drug.id} drug={drug} />
          ))}
        </ul>
      )}
    </div>
  );
}

function DrugRow({ drug }: { drug: Drug }) {
  return (
    <li>
      <details className="group rounded-xl border border-ink/10 bg-paper transition-colors duration-200 open:bg-paper-deep/30">
        <summary className="flex cursor-pointer flex-wrap items-baseline justify-between gap-4 px-5 py-4 sm:px-6">
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-[1.125rem] tracking-[-0.01em] text-ink">
              {drug.generic}
            </span>
            {drug.brand && drug.brand.length > 0 ? (
              <span className="font-body text-[13.5px] italic text-ink-faint">
                {drug.brand.join(" · ")}
              </span>
            ) : null}
            {drug.highAlert ? (
              <span className="rounded-full bg-clay-100 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-clay-800">
                High alert
              </span>
            ) : null}
          </span>
          <span className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              {drug.classLabel}
            </span>
            <span
              aria-hidden
              className="text-ink-faint transition-transform duration-200 group-open:rotate-90"
            >
              →
            </span>
          </span>
        </summary>

        <div className="space-y-6 border-t border-ink/10 px-5 py-6 sm:px-6">
          <Field label="How it works" body={drug.mechanism} />
          <ListField label="Used for" items={drug.indications} />
          <ListField label="Adverse effects" items={drug.adverse} />
          <ListField label="Nursing care" items={drug.nursing} />
          {drug.antidote ? <Field label="Antidote / reversal" body={drug.antidote} /> : null}
          {drug.blackBox ? <Field label="Black box warning" body={drug.blackBox} tone="warn" /> : null}
          {drug.pregnancy ? <Field label="Pregnancy / lactation" body={drug.pregnancy} /> : null}
        </div>
      </details>
    </li>
  );
}

function Field({
  label,
  body,
  tone,
}: {
  label: string;
  body: string;
  tone?: "warn";
}) {
  return (
    <div>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">{label}</p>
      <p
        className={cn(
          "mt-2 font-body text-[14.5px] leading-[1.6]",
          tone === "warn" ? "text-clay-800" : "text-ink",
        )}
      >
        {body}
      </p>
    </div>
  );
}

function ListField({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">{label}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item, i) => (
          <li
            key={`${label}-${i}`}
            className="flex items-start gap-3 font-body text-[14.5px] leading-[1.55] text-ink"
          >
            <span aria-hidden className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
