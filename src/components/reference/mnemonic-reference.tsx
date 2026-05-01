"use client";

import { useEffect, useMemo, useState } from "react";
import type { Mnemonic, MnemonicKind } from "@/lib/content/mnemonics";
import { cn } from "@/lib/utils";

interface MnemonicReferenceProps {
  items: Mnemonic[];
}

const KIND_LABEL: Record<MnemonicKind, string> = {
  acronym: "Acronym",
  sentence: "Sentence",
  image: "Image",
  song: "Rhyme",
};

function topicLabel(slug: string): string {
  if (!slug) return slug;
  const sentence = slug.replace(/-/g, " ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

export function MnemonicReference({ items }: MnemonicReferenceProps) {
  const [query, setQuery] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [kinds, setKinds] = useState<MnemonicKind[]>([]);

  const allTopics = useMemo(
    () => Array.from(new Set(items.map((m) => m.topicSlug))).sort(),
    [items],
  );
  const allKinds = useMemo(
    () => Array.from(new Set(items.map((m) => m.kind))).sort(),
    [items],
  );

  const matched = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((m) => {
      if (kinds.length > 0 && !kinds.includes(m.kind)) return false;
      if (topics.length > 0 && !topics.includes(m.topicSlug)) return false;
      if (!needle) return true;
      const haystack = [
        m.title,
        m.topic,
        m.body,
        m.clinical,
        ...(m.lines ?? []).map((l) => l.meaning),
        ...(m.lyrics ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [items, query, topics, kinds]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <label className="block">
          <span className="sr-only">Search mnemonics</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, topic, or word"
            className="w-full rounded-full border border-ink/15 bg-paper px-5 py-3 font-body text-[15px] text-ink placeholder:text-ink-faint focus:border-ink/40 focus:outline-none"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {allKinds.map((k) => {
            const active = kinds.includes(k);
            return (
              <button
                key={k}
                onClick={() =>
                  setKinds((prev) =>
                    prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k],
                  )
                }
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 font-body text-[13px] tracking-[0.005em] transition-colors duration-200",
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 bg-paper text-ink-soft hover:border-ink/40 hover:text-ink",
                )}
              >
                {KIND_LABEL[k]}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {allTopics.map((t) => {
            const active = topics.includes(t);
            return (
              <button
                key={t}
                onClick={() =>
                  setTopics((prev) =>
                    prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
                  )
                }
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 font-body text-[13px] tracking-[0.005em] transition-colors duration-200",
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 bg-paper text-ink-soft hover:border-ink/40 hover:text-ink",
                )}
              >
                {topicLabel(t)}
              </button>
            );
          })}
          {(topics.length > 0 || kinds.length > 0) && (
            <button
              onClick={() => {
                setTopics([]);
                setKinds([]);
              }}
              className="ml-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-faint hover:text-ink"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {matched.length === 0 ? (
        <p className="rounded-xl border border-ink/10 bg-paper-deep/40 px-5 py-6 font-body text-[14.5px] text-ink-soft">
          Nothing found. Try a different word or topic.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {matched.map((m) => (
            <li key={m.id}>
              {m.kind === "song" ? <RhymeCard m={m} /> : <MnemonicCard m={m} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MnemonicCard({ m }: { m: Mnemonic }) {
  const lines = m.lines ?? [];
  return (
    <article className="flex h-full flex-col rounded-2xl border border-ink/10 bg-paper p-6">
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-[1.375rem] font-light leading-[1.2] tracking-[-0.015em] text-ink">
          {m.title}
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
          {KIND_LABEL[m.kind]}
        </span>
      </header>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">{m.topic}</p>
      <p className="mt-3 font-body text-[14.5px] leading-[1.55] text-ink-soft">{m.body}</p>

      <ul className="mt-5 space-y-2">
        {lines.map((line, i) => (
          <li key={i} className="flex items-baseline gap-3">
            <span
              className={cn(
                "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[12px] font-medium tracking-wider",
                m.kind === "acronym" ? "bg-lavender-100 text-lavender-800" : "bg-paper-deep text-ink",
              )}
            >
              {line.key.length > 2 ? line.key.slice(0, 2) : line.key}
            </span>
            <span className="font-body text-[14.5px] leading-[1.5] text-ink">{line.meaning}</span>
          </li>
        ))}
      </ul>

      <p className="mt-5 font-body text-[13.5px] italic leading-[1.6] text-ink-soft">{m.clinical}</p>
    </article>
  );
}

/** Rhyme card — the "song" mnemonics presented as catchy read-aloud rhymes, no audio. */
function RhymeCard({ m }: { m: Mnemonic }) {
  const stanzas = m.lyrics ?? [];
  return (
    <article className="flex h-full flex-col rounded-2xl border border-lavender-200 bg-lavender-50 p-6">
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-[1.5rem] font-light leading-[1.18] tracking-[-0.015em] text-ink">
          {m.title}
        </h3>
        <span className="rounded-full bg-lavender-200 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-lavender-800">
          Rhyme
        </span>
      </header>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">{m.topic}</p>
      <p className="mt-3 font-body text-[14px] leading-[1.55] text-ink-soft">{m.body}</p>

      <div className="mt-5 space-y-4">
        {stanzas.map((stanza, i) => (
          <pre
            key={i}
            className="whitespace-pre-wrap rounded-lg border border-lavender-200/60 bg-paper p-4 font-body text-[14.5px] leading-[1.6] text-ink"
          >
            {stanza.replace(/^\[.+\]\n?/gm, "")}
          </pre>
        ))}
      </div>

      <p className="mt-5 font-body text-[13.5px] italic leading-[1.6] text-ink-soft">{m.clinical}</p>
    </article>
  );
}
// Suppress unused warning: useEffect imported for parity if future hooks land here.
void useEffect;
