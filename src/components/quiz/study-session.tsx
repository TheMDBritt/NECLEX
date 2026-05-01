"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/primitives/button";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { MultipleChoice } from "@/components/quiz/multiple-choice";
import { MultipleResponse } from "@/components/quiz/multiple-response";
import {
  clearSession,
  loadSession,
  makeSessionId,
  saveSession,
  type SessionAttempt,
  type SessionState,
} from "@/lib/store/session";
import type { Question } from "@/lib/types/question";
import { cn } from "@/lib/utils";

interface StudySessionProps {
  items: Question[];
}

export function StudySession({ items }: StudySessionProps) {
  const [state, setState] = useState<SessionState | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const existing = loadSession();
    if (existing && existing.endedAt === null && existing.attempts.length < items.length) {
      setState(existing);
    } else {
      const fresh: SessionState = {
        id: makeSessionId(),
        startedAt: Date.now(),
        endedAt: null,
        index: 0,
        attempts: [],
      };
      setState(fresh);
      saveSession(fresh);
    }
    setHydrated(true);
  }, [items.length]);

  useEffect(() => {
    if (state) saveSession(state);
  }, [state]);

  if (!hydrated || !state) return <SessionSkeleton total={items.length} />;

  const total = items.length;
  const isComplete = state.endedAt !== null || state.index >= total;

  if (isComplete) {
    return (
      <SessionSummary
        state={state}
        items={items}
        onRestart={() => {
          clearSession();
          const fresh: SessionState = {
            id: makeSessionId(),
            startedAt: Date.now(),
            endedAt: null,
            index: 0,
            attempts: [],
          };
          setState(fresh);
        }}
      />
    );
  }

  const current = items[state.index]!;
  const seed = `${state.id}:${current.id}`;

  function recordAttempt(attempt: SessionAttempt) {
    setState((prev) => (prev ? { ...prev, attempts: [...prev.attempts, attempt] } : prev));
  }

  function handleNext() {
    setState((prev) => {
      if (!prev) return prev;
      const nextIndex = prev.index + 1;
      const ended = nextIndex >= total ? Date.now() : null;
      return { ...prev, index: nextIndex, endedAt: ended };
    });
  }

  const submittedThisItem =
    state.attempts.length === state.index + 1 &&
    state.attempts[state.index]?.questionId === current.id;

  return (
    <div className="space-y-8">
      <SessionProgressBar
        index={state.index}
        total={total}
        attempts={state.attempts}
      />

      {current.itemType === "multiple_choice" ? (
        <MultipleChoice
          key={current.id}
          question={current}
          shuffleSeed={seed}
          onSubmit={(r) =>
            recordAttempt({
              questionId: current.id,
              selected: [r.selectedOptionId],
              isCorrect: r.isCorrect,
              awardedPoints: r.isCorrect ? 1 : 0,
              maxPoints: 1,
              timeSpentMs: r.timeSpentMs,
              shuffleSeed: seed,
              submittedAt: Date.now(),
            })
          }
        />
      ) : (
        <MultipleResponse
          key={current.id}
          question={current}
          shuffleSeed={seed}
          onSubmit={(r) =>
            recordAttempt({
              questionId: current.id,
              selected: r.selectedIds,
              isCorrect: r.isFullyCorrect,
              awardedPoints: r.awardedPoints,
              maxPoints: r.maxPoints,
              timeSpentMs: r.timeSpentMs,
              shuffleSeed: seed,
              submittedAt: Date.now(),
            })
          }
        />
      )}

      {submittedThisItem ? (
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            {state.index + 1 < total
              ? `Up next · question ${state.index + 2} of ${total}`
              : "All done with this set"}
          </p>
          <Button onClick={handleNext} arrow>
            {state.index + 1 < total ? "Next question" : "Finish session"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function SessionProgressBar({
  index,
  total,
  attempts,
}: {
  index: number;
  total: number;
  attempts: SessionAttempt[];
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Eyebrow>
        Question {Math.min(index + 1, total)} of {total}
      </Eyebrow>
      <ol aria-label="Session progress" className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const attempt = attempts[i];
          const isCurrent = i === index;
          const fullyCorrect =
            attempt && attempt.awardedPoints === attempt.maxPoints && attempt.maxPoints > 0;
          const partial =
            attempt && attempt.awardedPoints > 0 && !fullyCorrect;
          const wrong = attempt && attempt.awardedPoints === 0;
          return (
            <li
              key={i}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "h-1.5 w-6 rounded-full transition-colors duration-300",
                fullyCorrect && "bg-sage-400",
                partial && "bg-lavender-400",
                wrong && "bg-clay-400",
                !attempt && isCurrent && "bg-ink/40",
                !attempt && !isCurrent && "bg-ink/10",
              )}
            />
          );
        })}
      </ol>
    </div>
  );
}

function SessionSummary({
  state,
  items,
  onRestart,
}: {
  state: SessionState;
  items: Question[];
  onRestart: () => void;
}) {
  const earned = state.attempts.reduce((sum, a) => sum + a.awardedPoints, 0);
  const possible = state.attempts.reduce((sum, a) => sum + a.maxPoints, 0);
  const accuracy = possible === 0 ? 0 : Math.round((earned / possible) * 100);
  const fullyCorrect = state.attempts.filter(
    (a) => a.awardedPoints === a.maxPoints && a.maxPoints > 0,
  ).length;
  const total = state.attempts.length;
  const minutes = useMemo(() => {
    if (!state.endedAt) return 0;
    return Math.max(1, Math.round((state.endedAt - state.startedAt) / 60000));
  }, [state.startedAt, state.endedAt]);

  return (
    <article className="rounded-2xl border border-ink/10 bg-paper-deep/40 p-7 sm:p-10">
      <Eyebrow>Set complete</Eyebrow>
      <h2 className="mt-4 max-w-[18ch] font-display text-[clamp(1.875rem,4vw,3rem)] font-light leading-[1.1] tracking-[-0.025em] text-ink">
        {accuracy}% — {earned} of {possible} points.
      </h2>
      <p className="mt-5 max-w-[58ch] font-body text-[15.5px] leading-[1.6] text-ink-soft">
        {fullyCorrect} of {total} item{total === 1 ? "" : "s"} fully correct in {minutes} minute
        {minutes === 1 ? "" : "s"}.
      </p>

      <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <SummaryStat label="Accuracy" value={`${accuracy}%`} />
        <SummaryStat label="Fully correct" value={`${fullyCorrect}/${total}`} />
        <SummaryStat label="Time" value={`${minutes} min`} />
      </dl>

      <details className="mt-10 rounded-xl border border-ink/10 bg-paper/70 p-5">
        <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
          Review every item
        </summary>
        <ul className="mt-5 space-y-4">
          {state.attempts.map((attempt, i) => {
            const item = items.find((q) => q.id === attempt.questionId)!;
            const fully = attempt.awardedPoints === attempt.maxPoints && attempt.maxPoints > 0;
            return (
              <li key={`${attempt.questionId}-${i}`} className="flex items-start gap-4">
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px]",
                    fully && "bg-sage-600 text-paper",
                    !fully && attempt.awardedPoints > 0 && "bg-lavender-600 text-paper",
                    attempt.awardedPoints === 0 && "bg-clay-600 text-paper",
                  )}
                >
                  {attempt.awardedPoints}/{attempt.maxPoints}
                </span>
                <p className="font-body text-[14.5px] leading-[1.6] text-ink">{item.stem}</p>
              </li>
            );
          })}
        </ul>
      </details>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Button onClick={onRestart} arrow>
          Start another set
        </Button>
        <Button href="/" variant="ghost" size="sm">
          <span className="link-draw">Home</span>
        </Button>
      </div>
    </article>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-paper p-5">
      <dt className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
        {label}
      </dt>
      <dd className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-light leading-none tracking-[-0.025em] text-ink">
        {value}
      </dd>
    </div>
  );
}

function SessionSkeleton({ total }: { total: number }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
          Loading session…
        </p>
        <ol className="flex items-center gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <li key={i} className="h-1.5 w-6 rounded-full bg-ink/10" />
          ))}
        </ol>
      </div>
      <div className="h-[420px] rounded-2xl border border-ink/10 bg-paper-deep/30" />
    </div>
  );
}

