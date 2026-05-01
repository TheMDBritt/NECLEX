"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/primitives/button";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { cn } from "@/lib/utils";
import type { FillInTheBlankQuestion } from "@/lib/types/question";

interface FillInTheBlankProps {
  question: FillInTheBlankQuestion;
  onSubmit?: (result: { value: number; isCorrect: boolean; timeSpentMs: number }) => void;
}

/**
 * Numeric Fill-in-the-Blank — dosage calculation style.
 * Accepts any value in the inclusive [acceptedMin, acceptedMax] range.
 * Dichotomous scoring (1 / 0).
 */
export function FillInTheBlank({ question, onSubmit }: FillInTheBlankProps) {
  const [raw, setRaw] = useState("");
  const [submittedAt, setSubmittedAt] = useState<number | null>(null);
  const startedAt = useMemo(() => Date.now(), []);

  const isSubmitted = submittedAt !== null;
  const numeric = parseFloat(raw);
  const isParseable = !Number.isNaN(numeric) && raw.trim().length > 0;
  const isCorrect =
    isParseable && numeric >= question.acceptedMin && numeric <= question.acceptedMax;

  const decimals = question.decimals ?? 1;
  const expected =
    question.acceptedMin === question.acceptedMax
      ? question.acceptedMin.toFixed(decimals)
      : `${question.acceptedMin.toFixed(decimals)}–${question.acceptedMax.toFixed(decimals)}`;

  function handleSubmit() {
    if (!isParseable || isSubmitted) return;
    const now = Date.now();
    setSubmittedAt(now);
    onSubmit?.({ value: numeric, isCorrect, timeSpentMs: now - startedAt });
  }

  return (
    <article className="rounded-2xl border border-ink/10 bg-paper/80 p-6 sm:p-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Eyebrow withRule={false}>
          {question.tags.examTarget} · Fill in the blank
          {question.tags.cjmmStep ? ` · ${formatStep(question.tags.cjmmStep)}` : ""}
        </Eyebrow>
        {!isSubmitted ? (
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            Numeric answer
          </p>
        ) : null}
      </header>

      <p className="mt-6 max-w-[60ch] font-display text-[1.375rem] font-light leading-[1.4] tracking-[-0.01em] text-ink sm:text-[1.5rem]">
        {question.stem}
      </p>

      <div className="mt-8 flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            Your answer
          </span>
          <input
            type="number"
            inputMode="decimal"
            step="any"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            disabled={isSubmitted}
            className={cn(
              "w-44 rounded-xl border border-ink/15 bg-paper px-4 py-3 font-display text-[1.375rem] tracking-[-0.01em] text-ink focus:border-ink/40 focus:outline-none disabled:opacity-70",
              isSubmitted && isCorrect && "border-sage-400 bg-sage-50",
              isSubmitted && !isCorrect && "border-clay-400 bg-clay-50",
            )}
          />
        </label>
        <span className="pb-3 font-display text-[1.125rem] italic text-ink-faint">
          {question.units}
        </span>
      </div>

      {!isSubmitted ? (
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={!isParseable}
            arrow
            aria-disabled={!isParseable}
          >
            Submit answer
          </Button>
        </div>
      ) : (
        <section
          aria-live="polite"
          className={cn(
            "mt-10 rounded-xl border p-6 sm:p-8",
            isCorrect ? "border-sage-400 bg-sage-50" : "border-clay-400 bg-clay-50",
          )}
        >
          <header className="flex items-center justify-between gap-4">
            <p
              className={cn(
                "font-display text-[1.25rem] font-light leading-[1.3]",
                isCorrect ? "text-sage-800" : "text-clay-800",
              )}
            >
              {isCorrect ? "Correct." : "Incorrect."}
            </p>
            <span
              className={cn(
                "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-paper",
                isCorrect ? "bg-sage-600" : "bg-clay-600",
              )}
            >
              {isCorrect ? "1 / 1" : "0 / 1"}
            </span>
          </header>

          {!isCorrect ? (
            <p className="mt-4 font-body text-[15px] leading-[1.6] text-ink">
              You entered <strong className="font-semibold">{raw}</strong>. Accepted answer:{" "}
              <strong className="font-semibold text-sage-800">
                {expected} {question.units}
              </strong>
              .
            </p>
          ) : (
            <p className="mt-4 font-body text-[15px] leading-[1.6] text-ink">
              Accepted range: {expected} {question.units}.
            </p>
          )}

          <div className="mt-6 border-t border-ink/10 pt-6">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
              Working through it
            </p>
            <p className="mt-3 max-w-[64ch] font-body text-[15px] leading-[1.65] text-ink whitespace-pre-line">
              {question.rationale.body}
            </p>
          </div>

          {question.rationale.sources.length > 0 ? (
            <div className="mt-6 border-t border-ink/10 pt-6">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
                Sourced from
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {question.rationale.sources.map((s, i) => (
                  <li
                    key={`${s.label}-${i}`}
                    className="font-body text-[13.5px] tracking-[0.005em] text-ink-soft"
                  >
                    {s.url ? (
                      <a className="link-draw" href={s.url} target="_blank" rel="noreferrer">
                        {s.label}
                      </a>
                    ) : (
                      s.label
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      )}
    </article>
  );
}

function formatStep(slug: string): string {
  return slug
    .split("-")
    .map((s) => s[0]!.toUpperCase() + s.slice(1))
    .join(" ");
}
