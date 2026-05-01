"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/primitives/button";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { cn } from "@/lib/utils";
import { shuffleWithSeed } from "@/lib/shuffle";
import { scorePolytomousPlusMinus } from "@/lib/scoring/polytomous";
import type { MultipleResponseQuestion } from "@/lib/types/question";

interface MultipleResponseProps {
  question: MultipleResponseQuestion;
  shuffleSeed: string;
  onSubmit?: (result: {
    selectedIds: string[];
    awardedPoints: number;
    maxPoints: number;
    isFullyCorrect: boolean;
    timeSpentMs: number;
  }) => void;
}

/**
 * Multiple Response (SATA) renderer.
 *
 * - Polytomous +/- scoring (NCSBN NGN), floor 0 per item
 * - MANDATORY: option order shuffled per attempt
 * - "Select all that apply" — at least one selection required to submit
 * - Anxiety-aware UX: per-option correctness badge on review
 */
export function MultipleResponse({ question, shuffleSeed, onSubmit }: MultipleResponseProps) {
  const shuffledOptions = useMemo(
    () => shuffleWithSeed(question.options, `${question.id}:${shuffleSeed}`),
    [question.id, question.options, shuffleSeed],
  );

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submittedAt, setSubmittedAt] = useState<number | null>(null);
  const startedAt = useMemo(() => Date.now(), []);

  const isSubmitted = submittedAt !== null;
  const result = useMemo(
    () => scorePolytomousPlusMinus(question.options, Array.from(selected)),
    [question.options, selected],
  );

  function toggle(id: string) {
    if (isSubmitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit() {
    if (selected.size === 0 || isSubmitted) return;
    const now = Date.now();
    setSubmittedAt(now);
    onSubmit?.({
      selectedIds: Array.from(selected),
      awardedPoints: result.awardedPoints,
      maxPoints: result.maxPoints,
      isFullyCorrect: result.isFullyCorrect,
      timeSpentMs: now - startedAt,
    });
  }

  return (
    <article className="rounded-2xl border border-ink/10 bg-paper/80 p-6 sm:p-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Eyebrow withRule={false}>
          {question.tags.examTarget} · Select all that apply
          {question.tags.cjmmStep ? ` · ${formatStep(question.tags.cjmmStep)}` : ""}
        </Eyebrow>
        {!isSubmitted ? (
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            One or more answers · partial credit
          </p>
        ) : null}
      </header>

      <p className="mt-6 max-w-[60ch] font-display text-[1.375rem] font-light leading-[1.4] tracking-[-0.01em] text-ink sm:text-[1.5rem]">
        {question.stem}
      </p>

      <fieldset className="mt-8" disabled={isSubmitted}>
        <legend className="sr-only">Select every answer that applies</legend>
        <ul className="space-y-3">
          {shuffledOptions.map((option, idx) => {
            const isChecked = selected.has(option.id);
            const showCorrect = isSubmitted && option.isCorrect;
            const showWrongChosen = isSubmitted && isChecked && !option.isCorrect;
            const showMissedCorrect = isSubmitted && option.isCorrect && !isChecked;

            const stateClasses = cn(
              "flex w-full items-start gap-4 rounded-xl border px-5 py-4 text-left transition-colors duration-300",
              !isSubmitted && !isChecked && "border-ink/12 bg-paper hover:border-ink/30",
              !isSubmitted && isChecked && "border-ink/40 bg-paper-deep/40",
              showCorrect && "border-sage-400 bg-sage-50",
              showWrongChosen && "border-clay-400 bg-clay-50",
              showMissedCorrect && "border-sage-400 bg-paper",
            );
            return (
              <li key={option.id}>
                <label className={stateClasses}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(option.id)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-[11px] tracking-wider",
                      !isSubmitted && !isChecked && "border-ink/25 text-ink-faint",
                      !isSubmitted && isChecked && "border-ink bg-ink text-paper",
                      showCorrect && isChecked && "border-sage-600 bg-sage-600 text-paper",
                      showWrongChosen && "border-clay-600 bg-clay-600 text-paper",
                      showMissedCorrect && "border-sage-600 text-sage-800",
                    )}
                  >
                    {isChecked ? "✓" : String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-body text-[15.5px] leading-[1.55] text-ink">
                    {option.label}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {!isSubmitted ? (
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={selected.size === 0}
            arrow
            aria-disabled={selected.size === 0}
          >
            Submit answer
          </Button>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            {selected.size === 0
              ? "Choose at least one"
              : `${selected.size} selected · keep going or submit`}
          </p>
        </div>
      ) : (
        <SataResultPanel
          result={result}
          selectedIds={selected}
          options={question.options}
          rationale={question.rationale}
        />
      )}
    </article>
  );
}

function SataResultPanel({
  result,
  selectedIds,
  options,
  rationale,
}: {
  result: ReturnType<typeof scorePolytomousPlusMinus>;
  selectedIds: Set<string>;
  options: MultipleResponseQuestion["options"];
  rationale: MultipleResponseQuestion["rationale"];
}) {
  const tone = result.isFullyCorrect
    ? "sage"
    : result.awardedPoints > 0
      ? "lavender"
      : "clay";

  const headline = result.isFullyCorrect
    ? "Every piece in place."
    : result.awardedPoints > 0
      ? "Most of it — let's tighten the rest."
      : "Let's look at this together.";

  const tag =
    result.isFullyCorrect
      ? "Full credit"
      : result.awardedPoints > 0
        ? "Partial credit"
        : "No credit";

  return (
    <section
      aria-live="polite"
      className={cn(
        "mt-10 rounded-xl border p-6 sm:p-8",
        tone === "sage" && "border-sage-400 bg-sage-50",
        tone === "lavender" && "border-lavender-400 bg-lavender-50",
        tone === "clay" && "border-clay-400 bg-clay-50",
      )}
    >
      <header className="flex items-center justify-between gap-4">
        <p
          className={cn(
            "font-display text-[1.375rem] font-light italic leading-[1.3]",
            tone === "sage" && "text-sage-800",
            tone === "lavender" && "text-lavender-800",
            tone === "clay" && "text-clay-800",
          )}
        >
          {headline}
        </p>
        <span
          className={cn(
            "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-paper",
            tone === "sage" && "bg-sage-600",
            tone === "lavender" && "bg-lavender-600",
            tone === "clay" && "bg-clay-600",
          )}
        >
          {result.awardedPoints} / {result.maxPoints} · {tag}
        </span>
      </header>

      <div className="mt-6 border-t border-ink/10 pt-6">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
          Why this answer
        </p>
        <p className="mt-3 max-w-[64ch] font-body text-[15.5px] leading-[1.65] text-ink">
          {rationale.body}
        </p>
      </div>

      <div className="mt-6 border-t border-ink/10 pt-6">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
          Per-option breakdown
        </p>
        <ul className="mt-3 space-y-3">
          {options.map((option) => {
            const wasChosen = selectedIds.has(option.id);
            const correctChosen = option.isCorrect && wasChosen;
            const correctMissed = option.isCorrect && !wasChosen;
            const wrongChosen = !option.isCorrect && wasChosen;
            const verdict = correctChosen
              ? { mark: "✓", tone: "text-sage-800", note: "Correctly selected." }
              : correctMissed
                ? { mark: "✓", tone: "text-sage-800", note: "Missed — this should have been chosen." }
                : wrongChosen
                  ? { mark: "·", tone: "text-clay-800", note: "Selected, but not correct." }
                  : { mark: "·", tone: "text-ink-faint", note: "Correctly left out." };
            return (
              <li
                key={option.id}
                className="font-body text-[14.5px] leading-[1.6] text-ink-soft"
              >
                <span className={cn("mr-2 font-mono text-[11px] tracking-wider", verdict.tone)}>
                  {verdict.mark}
                </span>
                <strong className="font-semibold text-ink">{option.label}</strong>
                <> — {verdict.note}</>
                {option.feedback ? <> {option.feedback}</> : null}
              </li>
            );
          })}
        </ul>
      </div>

      {rationale.sources.length > 0 ? (
        <div className="mt-6 border-t border-ink/10 pt-6">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            Sourced from
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {rationale.sources.map((s, i) => (
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
  );
}

function formatStep(slug: string): string {
  return slug
    .split("-")
    .map((s) => s[0]!.toUpperCase() + s.slice(1))
    .join(" ");
}
