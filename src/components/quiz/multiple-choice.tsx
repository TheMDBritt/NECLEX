"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/primitives/button";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { cn } from "@/lib/utils";
import { shuffleWithSeed } from "@/lib/shuffle";
import type { MultipleChoiceQuestion } from "@/lib/types/question";

interface MultipleChoiceProps {
  question: MultipleChoiceQuestion;
  /**
   * Stable per-attempt seed. The parent (a session container) generates this
   * once and persists it on the attempt row so review mode replays the exact
   * same option order.
   */
  shuffleSeed: string;
  /** Called when the learner submits their answer. */
  onSubmit?: (result: {
    selectedOptionId: string;
    isCorrect: boolean;
    timeSpentMs: number;
  }) => void;
}

/**
 * Multiple Choice item renderer.
 *
 * - Dichotomous scoring (1 if correct, 0 otherwise)
 * - MANDATORY: option order is shuffled with `shuffleSeed`
 * - Anxiety-aware UX: no alarm-red, gentle copy on incorrect, full rationale
 *   with per-distractor breakdown shown after submit
 */
export function MultipleChoice({ question, shuffleSeed, onSubmit }: MultipleChoiceProps) {
  const shuffledOptions = useMemo(
    () => shuffleWithSeed(question.options, `${question.id}:${shuffleSeed}`),
    [question.id, question.options, shuffleSeed],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState<number | null>(null);
  const startedAt = useMemo(() => Date.now(), []);

  const isSubmitted = submittedAt !== null;
  const selectedOption = shuffledOptions.find((o) => o.id === selectedId) ?? null;
  const isCorrect = selectedOption?.isCorrect ?? false;
  const correctOption = shuffledOptions.find((o) => o.isCorrect)!;

  function handleSubmit() {
    if (!selectedId || isSubmitted) return;
    const now = Date.now();
    setSubmittedAt(now);
    onSubmit?.({
      selectedOptionId: selectedId,
      isCorrect,
      timeSpentMs: now - startedAt,
    });
  }

  return (
    <article className="rounded-2xl border border-ink/10 bg-paper/80 p-6 sm:p-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Eyebrow withRule={false}>
          {question.tags.examTarget} · Multiple Choice
          {question.tags.cjmmStep ? ` · ${formatStep(question.tags.cjmmStep)}` : ""}
        </Eyebrow>
        {!isSubmitted ? (
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            One answer
          </p>
        ) : null}
      </header>

      <p className="mt-6 max-w-[60ch] font-display text-[1.375rem] font-light leading-[1.4] tracking-[-0.01em] text-ink sm:text-[1.5rem]">
        {question.stem}
      </p>

      <fieldset className="mt-8" disabled={isSubmitted}>
        <legend className="sr-only">Choose one answer</legend>
        <ul className="space-y-3">
          {shuffledOptions.map((option, idx) => {
            const isSelected = option.id === selectedId;
            const showCorrect = isSubmitted && option.isCorrect;
            const showIncorrect = isSubmitted && isSelected && !option.isCorrect;
            const stateClasses = cn(
              "flex w-full items-start gap-4 rounded-xl border px-5 py-4 text-left transition-colors duration-300",
              !isSubmitted && !isSelected && "border-ink/12 bg-paper hover:border-ink/30",
              !isSubmitted && isSelected && "border-ink/40 bg-paper-deep/40",
              showCorrect && "border-sage-400 bg-sage-50",
              showIncorrect && "border-clay-400 bg-clay-50",
              isSubmitted && !showCorrect && !showIncorrect && "border-ink/10 bg-paper opacity-70",
            );
            return (
              <li key={option.id}>
                <label className={stateClasses}>
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    value={option.id}
                    checked={isSelected}
                    onChange={() => setSelectedId(option.id)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] tracking-wider",
                      !isSubmitted && !isSelected && "border-ink/25 text-ink-faint",
                      !isSubmitted && isSelected && "border-ink bg-ink text-paper",
                      showCorrect && "border-sage-600 bg-sage-600 text-paper",
                      showIncorrect && "border-clay-600 bg-clay-600 text-paper",
                    )}
                  >
                    {String.fromCharCode(65 + idx)}
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
            disabled={!selectedId}
            arrow
            aria-disabled={!selectedId}
          >
            Submit answer
          </Button>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            You can change your mind before submitting
          </p>
        </div>
      ) : (
        <ResultPanel
          isCorrect={isCorrect}
          correctOption={correctOption}
          selectedOption={selectedOption}
          rationale={question.rationale}
          options={shuffledOptions}
        />
      )}
    </article>
  );
}

interface ResultPanelProps {
  isCorrect: boolean;
  correctOption: MultipleChoiceQuestion["options"][number];
  selectedOption: MultipleChoiceQuestion["options"][number] | null;
  rationale: MultipleChoiceQuestion["rationale"];
  options: MultipleChoiceQuestion["options"];
}

function ResultPanel({
  isCorrect,
  correctOption,
  selectedOption,
  rationale,
  options,
}: ResultPanelProps) {
  return (
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
            "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em]",
            isCorrect ? "bg-sage-600 text-paper" : "bg-clay-600 text-paper",
          )}
        >
          {isCorrect ? "1 / 1" : "0 / 1"}
        </span>
      </header>

      {!isCorrect && selectedOption ? (
        <p className="mt-4 max-w-[60ch] font-body text-[15px] leading-[1.6] text-ink">
          You chose <strong className="font-semibold">{selectedOption.label}</strong>. The correct
          answer is{" "}
          <strong className="font-semibold text-sage-800">{correctOption.label}</strong>.
        </p>
      ) : null}

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
          Distractor breakdown
        </p>
        <ul className="mt-3 space-y-3">
          {options.map((option) => (
            <li key={option.id} className="font-body text-[14.5px] leading-[1.6] text-ink-soft">
              <span
                className={cn(
                  "mr-2 font-mono text-[11px] tracking-wider",
                  option.isCorrect ? "text-sage-800" : "text-ink-faint",
                )}
              >
                {option.isCorrect ? "✓" : "·"}
              </span>
              <strong className="font-semibold text-ink">{option.label}</strong>
              {option.feedback ? <> — {option.feedback}</> : null}
            </li>
          ))}
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
