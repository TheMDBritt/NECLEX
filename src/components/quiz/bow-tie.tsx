"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/primitives/button";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { cn } from "@/lib/utils";
import { shuffleWithSeed } from "@/lib/shuffle";
import { scoreRationaleSection } from "@/lib/scoring/rationale";
import type { BowTieQuestion } from "@/lib/types/question";

interface BowTieProps {
  question: BowTieQuestion;
  shuffleSeed: string;
  onSubmit?: (result: {
    actions: string[];
    condition: string[];
    monitor: string[];
    awardedPoints: number;
    maxPoints: number;
    isFullyCorrect: boolean;
    timeSpentMs: number;
  }) => void;
}

/**
 * Bow-Tie renderer. Three sections all linked to one client scenario:
 *
 *   Actions to Take ──┐               ┌── Parameters to Monitor
 *                     ├── Condition ──┤
 *   Actions to Take ──┘               └── Parameters to Monitor
 *
 * Each section is scored rationale-linked (all-or-nothing). The item is worth
 * 3 points total. Option order shuffles per attempt.
 */
export function BowTie({ question, shuffleSeed, onSubmit }: BowTieProps) {
  const actionOptions = useMemo(
    () => shuffleWithSeed(question.actions.options, `${shuffleSeed}:actions`),
    [question.actions.options, shuffleSeed],
  );
  const conditionOptions = useMemo(
    () => shuffleWithSeed(question.condition.options, `${shuffleSeed}:condition`),
    [question.condition.options, shuffleSeed],
  );
  const monitorOptions = useMemo(
    () => shuffleWithSeed(question.monitor.options, `${shuffleSeed}:monitor`),
    [question.monitor.options, shuffleSeed],
  );

  const [actions, setActions] = useState<Set<string>>(new Set());
  const [condition, setCondition] = useState<string | null>(null);
  const [monitor, setMonitor] = useState<Set<string>>(new Set());
  const [submittedAt, setSubmittedAt] = useState<number | null>(null);
  const startedAt = useMemo(() => Date.now(), []);

  const isSubmitted = submittedAt !== null;

  const actionResult = useMemo(
    () => scoreRationaleSection(question.actions.options, Array.from(actions)),
    [actions, question.actions.options],
  );
  const conditionResult = useMemo(
    () => scoreRationaleSection(question.condition.options, condition ? [condition] : []),
    [condition, question.condition.options],
  );
  const monitorResult = useMemo(
    () => scoreRationaleSection(question.monitor.options, Array.from(monitor)),
    [monitor, question.monitor.options],
  );

  const totalAwarded = actionResult.awarded + conditionResult.awarded + monitorResult.awarded;
  const totalMax = 3;
  const isFullyCorrect = totalAwarded === totalMax;

  function toggleAction(id: string) {
    if (isSubmitted) return;
    setActions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < question.actions.selectCount) next.add(id);
      return next;
    });
  }

  function toggleMonitor(id: string) {
    if (isSubmitted) return;
    setMonitor((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < question.monitor.selectCount) next.add(id);
      return next;
    });
  }

  const canSubmit =
    actions.size === question.actions.selectCount &&
    condition !== null &&
    monitor.size === question.monitor.selectCount;

  function handleSubmit() {
    if (!canSubmit || isSubmitted) return;
    const now = Date.now();
    setSubmittedAt(now);
    onSubmit?.({
      actions: Array.from(actions),
      condition: condition ? [condition] : [],
      monitor: Array.from(monitor),
      awardedPoints: totalAwarded,
      maxPoints: totalMax,
      isFullyCorrect,
      timeSpentMs: now - startedAt,
    });
  }

  return (
    <article className="rounded-2xl border border-ink/10 bg-paper/80 p-6 sm:p-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Eyebrow withRule={false}>
          {question.tags.examTarget} · Bow-tie
          {question.tags.cjmmStep ? ` · ${formatStep(question.tags.cjmmStep)}` : ""}
        </Eyebrow>
        {!isSubmitted ? (
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            3 sections · linked scoring
          </p>
        ) : null}
      </header>

      <p className="mt-6 max-w-[64ch] font-display text-[1.25rem] font-light leading-[1.45] tracking-[-0.005em] text-ink sm:text-[1.375rem]">
        {question.stem}
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <Section
          title="Actions to take"
          subtitle={`Select ${question.actions.selectCount}`}
          options={actionOptions}
          selected={actions}
          onToggle={toggleAction}
          isSubmitted={isSubmitted}
          rationaleCorrect={actionResult.isFullyCorrect}
          getOptionState={(opt, picked) =>
            optionState({ opt, picked, isSubmitted })
          }
        />
        <Section
          title="Condition most likely"
          subtitle="Select one"
          options={conditionOptions}
          selected={new Set(condition ? [condition] : [])}
          onToggle={(id) => !isSubmitted && setCondition((prev) => (prev === id ? null : id))}
          isSubmitted={isSubmitted}
          rationaleCorrect={conditionResult.isFullyCorrect}
          getOptionState={(opt, picked) =>
            optionState({ opt, picked, isSubmitted })
          }
        />
        <Section
          title="Parameters to monitor"
          subtitle={`Select ${question.monitor.selectCount}`}
          options={monitorOptions}
          selected={monitor}
          onToggle={toggleMonitor}
          isSubmitted={isSubmitted}
          rationaleCorrect={monitorResult.isFullyCorrect}
          getOptionState={(opt, picked) =>
            optionState({ opt, picked, isSubmitted })
          }
        />
      </div>

      {!isSubmitted ? (
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button onClick={handleSubmit} disabled={!canSubmit} arrow aria-disabled={!canSubmit}>
            Submit answer
          </Button>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            Each section worth one point
          </p>
        </div>
      ) : (
        <BowTieResultPanel
          totalAwarded={totalAwarded}
          totalMax={totalMax}
          isFullyCorrect={isFullyCorrect}
          rationale={question.rationale}
        />
      )}
    </article>
  );
}

interface SectionProps {
  title: string;
  subtitle: string;
  options: BowTieQuestion["actions"]["options"];
  selected: Set<string>;
  onToggle: (id: string) => void;
  isSubmitted: boolean;
  rationaleCorrect: boolean;
  getOptionState: (
    opt: BowTieQuestion["actions"]["options"][number],
    picked: boolean,
  ) => { className: string; mark: string };
}

function Section({
  title,
  subtitle,
  options,
  selected,
  onToggle,
  isSubmitted,
  rationaleCorrect,
  getOptionState,
}: SectionProps) {
  return (
    <fieldset
      className={cn(
        "rounded-xl border p-5 transition-colors duration-200",
        !isSubmitted && "border-ink/10 bg-paper",
        isSubmitted && rationaleCorrect && "border-sage-400 bg-sage-50",
        isSubmitted && !rationaleCorrect && "border-clay-400 bg-clay-50",
      )}
    >
      <legend className="px-1">
        <span className="block font-display text-[1.0625rem] font-light leading-[1.2] tracking-[-0.01em] text-ink">
          {title}
        </span>
        <span className="block font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
          {subtitle}
        </span>
      </legend>
      <ul className="mt-4 space-y-2">
        {options.map((opt) => {
          const picked = selected.has(opt.id);
          const state = getOptionState(opt, picked);
          return (
            <li key={opt.id}>
              <button
                onClick={() => onToggle(opt.id)}
                type="button"
                disabled={isSubmitted}
                aria-pressed={picked}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-colors duration-200",
                  state.className,
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border font-mono text-[10px]",
                    state.mark === "" ? "border-ink/25 text-ink-faint" : "border-ink bg-ink text-paper",
                  )}
                >
                  {state.mark}
                </span>
                <span className="font-body text-[14px] leading-[1.5] text-ink">{opt.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

function optionState({
  opt,
  picked,
  isSubmitted,
}: {
  opt: BowTieQuestion["actions"]["options"][number];
  picked: boolean;
  isSubmitted: boolean;
}): { className: string; mark: string } {
  if (!isSubmitted) {
    return {
      className: picked ? "border-ink/40 bg-paper-deep/40" : "border-ink/12 bg-paper hover:border-ink/30",
      mark: picked ? "✓" : "",
    };
  }
  // After submit
  if (opt.isCorrect && picked) return { className: "border-sage-500 bg-sage-50", mark: "✓" };
  if (opt.isCorrect && !picked) return { className: "border-sage-500 bg-paper", mark: "·" };
  if (!opt.isCorrect && picked) return { className: "border-clay-500 bg-clay-50", mark: "✗" };
  return { className: "border-ink/10 bg-paper opacity-70", mark: "" };
}

function BowTieResultPanel({
  totalAwarded,
  totalMax,
  isFullyCorrect,
  rationale,
}: {
  totalAwarded: number;
  totalMax: number;
  isFullyCorrect: boolean;
  rationale: BowTieQuestion["rationale"];
}) {
  const tone = isFullyCorrect ? "sage" : totalAwarded > 0 ? "lavender" : "clay";
  const headline = isFullyCorrect
    ? "Correct."
    : totalAwarded > 0
      ? "Partially correct."
      : "Incorrect.";

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
            "font-display text-[1.25rem] font-light leading-[1.3]",
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
          {totalAwarded} / {totalMax}
        </span>
      </header>

      <div className="mt-6 border-t border-ink/10 pt-6">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
          Why this answer
        </p>
        <p className="mt-3 max-w-[64ch] font-body text-[15.5px] leading-[1.65] text-ink whitespace-pre-line">
          {rationale.body}
        </p>
      </div>

      {rationale.sources.length > 0 ? (
        <div className="mt-6 border-t border-ink/10 pt-6">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            Sourced from
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {rationale.sources.map((s, i) => (
              <li key={`${s.label}-${i}`} className="font-body text-[13.5px] tracking-[0.005em] text-ink-soft">
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
