"use client";

import { useMemo, useState } from "react";
import type { Mnemonic, MnemonicKind } from "@/lib/content/mnemonics";
import { cn } from "@/lib/utils";

interface MnemonicReferenceProps {
  items: Mnemonic[];
}

const KIND_LABEL: Record<MnemonicKind, string> = {
  acronym: "Acronym",
  sentence: "Sentence",
  image: "Image",
  song: "Song",
};

export function MnemonicReference({ items }: MnemonicReferenceProps) {
  const [query, setQuery] = useState("");

  const matched = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((m) => {
      const haystack = [m.title, m.topic, m.body, m.clinical, ...m.lines.map((l) => l.meaning)]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [items, query]);

  return (
    <div className="space-y-8">
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

      {matched.length === 0 ? (
        <p className="rounded-xl border border-ink/10 bg-paper-deep/40 px-5 py-6 font-body text-[14.5px] text-ink-soft">
          Nothing found. Try a different word.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {matched.map((m) => (
            <li key={m.id}>
              <article className="flex h-full flex-col rounded-2xl border border-ink/10 bg-paper p-6">
                <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-[1.375rem] font-light leading-[1.2] tracking-[-0.015em] text-ink">
                    {m.title}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                    {KIND_LABEL[m.kind]}
                  </span>
                </header>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
                  {m.topic}
                </p>
                <p className="mt-3 font-body text-[14.5px] leading-[1.55] text-ink-soft">
                  {m.body}
                </p>

                <ul className="mt-5 space-y-2">
                  {m.lines.map((line, i) => (
                    <li key={i} className="flex items-baseline gap-3">
                      <span
                        className={cn(
                          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[12px] font-medium tracking-wider",
                          m.kind === "acronym"
                            ? "bg-lavender-100 text-lavender-800"
                            : "bg-paper-deep text-ink",
                        )}
                      >
                        {line.key.length > 2 ? line.key.slice(0, 2) : line.key}
                      </span>
                      <span className="font-body text-[14.5px] leading-[1.5] text-ink">
                        {line.meaning}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mt-auto pt-5 font-body text-[13.5px] italic leading-[1.6] text-ink-soft">
                  {m.clinical}
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
