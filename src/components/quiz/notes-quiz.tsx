"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/primitives/button";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { StudySession } from "@/components/quiz/study-session";
import { clearSession } from "@/lib/store/session";
import type { ItemType, Question } from "@/lib/types/question";
import { cn } from "@/lib/utils";

const TYPE_OPTIONS: { value: ItemType; label: string; hint: string }[] = [
  { value: "multiple_choice", label: "Multiple choice", hint: "One right answer" },
  { value: "multiple_response", label: "Select all that apply", hint: "More than one right" },
  { value: "fill_in_the_blank", label: "Fill in the blank", hint: "Numeric / dosage" },
  { value: "bow_tie", label: "Bow-tie", hint: "Scenario-based NGN" },
];

const COUNT_PRESETS = [5, 10, 25, 50, 100];

type Phase = "compose" | "generating" | "ready" | "error";

export function NotesQuiz() {
  const [notes, setNotes] = useState("");
  const [types, setTypes] = useState<ItemType[]>([
    "multiple_choice",
    "multiple_response",
  ]);
  const [count, setCount] = useState(10);
  const [phase, setPhase] = useState<Phase>("compose");
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function toggleType(t: ItemType) {
    setTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  async function onFile(file: File) {
    if (!/\.(txt|md|markdown)$/i.test(file.name)) {
      setError("Upload a .txt or .md file, or paste your notes directly.");
      setPhase("error");
      return;
    }
    const text = await file.text();
    setNotes(text);
    setFileName(file.name);
    setError(null);
    setPhase("compose");
  }

  async function generate() {
    setError(null);
    setPhase("generating");
    setQuestions(null);
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, itemTypes: types, count }),
      });
      const data: { questions?: Question[]; error?: string } = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status}).`);
      }
      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions came back. Try longer notes or a different type.");
      }
      clearSession();
      setQuestions(data.questions);
      setPhase("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
      setPhase("error");
    }
  }

  function reset() {
    setQuestions(null);
    setPhase("compose");
    setError(null);
  }

  if (phase === "ready" && questions) {
    return (
      <div>
        <button
          onClick={reset}
          className="mb-6 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint hover:text-ink"
        >
          <span aria-hidden>←</span> Generate another set
        </button>
        <p className="mb-6 font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
          {questions.length} question{questions.length === 1 ? "" : "s"} from your notes
        </p>
        <StudySession items={questions} />
      </div>
    );
  }

  const canGenerate = notes.trim().length >= 80 && types.length > 0 && phase !== "generating";

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <Eyebrow>Quiz from notes</Eyebrow>
        <h1 className="font-display text-[clamp(2rem,4.4vw,3.25rem)] font-light leading-[1.08] tracking-[-0.025em] text-ink">
          Paste your notes. Get a quiz.
        </h1>
        <p className="max-w-[58ch] font-body text-[1rem] leading-[1.6] text-ink-soft">
          Drop in lecture notes, a chapter, or a study guide. Pick the question types and
          how many you want. Every question stays inside what you uploaded — no outside facts.
        </p>
      </header>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <Eyebrow withRule={false}>Your notes</Eyebrow>
          <div className="flex items-center gap-3">
            {fileName ? (
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-faint">
                {fileName}
              </span>
            ) : null}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.markdown,text/plain,text/markdown"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full border border-ink/15 bg-paper px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-soft transition-colors duration-200 hover:border-ink/40 hover:text-ink"
            >
              Upload .txt / .md
            </button>
          </div>
        </div>
        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            if (fileName) setFileName(null);
          }}
          placeholder="Paste your notes here… lecture outlines, textbook excerpts, your own summaries — whatever you want quizzed on."
          className="min-h-[260px] w-full resize-y rounded-2xl border border-ink/12 bg-paper p-5 font-body text-[15px] leading-[1.6] text-ink placeholder:text-ink-faint/70 focus:border-ink/40 focus:outline-none"
        />
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-faint">
          {notes.trim().length} characters
          {notes.trim().length > 0 && notes.trim().length < 80
            ? " · add a bit more so questions have something to grip"
            : ""}
        </p>
      </section>

      <section className="space-y-3">
        <Eyebrow withRule={false}>Question types</Eyebrow>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {TYPE_OPTIONS.map((opt) => {
            const selected = types.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleType(opt.value)}
                aria-pressed={selected}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-colors duration-200",
                  selected
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 bg-paper text-ink-soft hover:border-ink/40 hover:text-ink",
                )}
              >
                <span>
                  <span className="block font-body text-[14.5px]">{opt.label}</span>
                  <span
                    className={cn(
                      "block font-mono text-[10.5px] uppercase tracking-[0.18em]",
                      selected ? "text-paper/70" : "text-ink-faint",
                    )}
                  >
                    {opt.hint}
                  </span>
                </span>
                <span aria-hidden className="font-mono text-[14px]">
                  {selected ? "✓" : "+"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <Eyebrow withRule={false}>How many</Eyebrow>
        <div className="flex flex-wrap items-center gap-3">
          {COUNT_PRESETS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCount(n)}
              className={cn(
                "rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-200",
                count === n
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/15 bg-paper text-ink-soft hover:border-ink/40",
              )}
            >
              {n}
            </button>
          ))}
          <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            Custom
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (Number.isFinite(v)) setCount(Math.max(1, Math.min(100, Math.floor(v))));
              }}
              className="w-20 rounded-md border border-ink/15 bg-paper px-2 py-1 text-center font-mono text-[12px] text-ink focus:border-ink/40 focus:outline-none"
            />
          </label>
        </div>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-faint">
          Up to 100. Larger sets take a bit longer to generate.
        </p>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6">
        {error ? (
          <p className="max-w-[42ch] font-body text-[13.5px] leading-[1.5] text-clay-700">
            {error}
          </p>
        ) : (
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
            {phase === "generating"
              ? "Writing your quiz…"
              : `${count} question${count === 1 ? "" : "s"} · ${types.length} type${types.length === 1 ? "" : "s"}`}
          </p>
        )}
        <Button
          onClick={generate}
          disabled={!canGenerate}
          arrow
          aria-disabled={!canGenerate}
        >
          {phase === "generating" ? "Generating…" : "Generate quiz"}
        </Button>
      </footer>
    </div>
  );
}
