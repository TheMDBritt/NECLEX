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
  song: "Song",
};

function topicLabel(slug: string): string {
  if (!slug) return slug;
  const sentence = slug.replace(/-/g, " ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

export function MnemonicReference({ items }: MnemonicReferenceProps) {
  const [query, setQuery] = useState("");
  const [topics, setTopics] = useState<string[]>([]);

  const allTopics = useMemo(
    () => Array.from(new Set(items.map((m) => m.topicSlug))).sort(),
    [items],
  );

  const matched = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((m) => {
      if (topics.length > 0 && !topics.includes(m.topicSlug)) return false;
      if (!needle) return true;
      const haystack = [m.title, m.topic, m.body, m.clinical, ...m.lines.map((l) => l.meaning)]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [items, query, topics]);

  function toggleTopic(t: string) {
    setTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

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
          {allTopics.map((t) => {
            const active = topics.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggleTopic(t)}
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
          {topics.length > 0 && (
            <button
              onClick={() => setTopics([])}
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
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {matched.map((m) => (
            <li key={m.id}>
              <MnemonicCard m={m} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MnemonicCard({ m }: { m: Mnemonic }) {
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
        {m.lines.map((line, i) => (
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

      <ReadAloudButton mnemonic={m} />
    </article>
  );
}

/**
 * Real text-to-speech using the browser's Web Speech API. Works in modern
 * browsers (Chrome, Safari, Firefox, mobile). Picks an English voice when
 * available; falls back gracefully if speech synthesis is unsupported.
 */
function ReadAloudButton({ mnemonic }: { mnemonic: Mnemonic }) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true);
    }
  }, []);

  function speak() {
    if (!supported) return;
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const lines = [
      mnemonic.title,
      mnemonic.body,
      ...mnemonic.lines.map((l) => `${l.key}. ${l.meaning}`),
      mnemonic.clinical,
    ];
    const utterance = new SpeechSynthesisUtterance(lines.join(". "));
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = "en-US";
    const voices = synth.getVoices();
    const enVoice = voices.find((v) => v.lang.startsWith("en") && v.localService) ?? voices.find((v) => v.lang.startsWith("en"));
    if (enVoice) utterance.voice = enVoice;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(utterance);
  }

  if (!supported) {
    return (
      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
        Read-aloud not available in this browser
      </p>
    );
  }

  return (
    <button
      onClick={speak}
      type="button"
      className={cn(
        "mt-5 inline-flex items-center gap-2 self-start rounded-full border px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.22em] transition-colors duration-200",
        speaking
          ? "border-lavender-600 bg-lavender-100 text-lavender-800"
          : "border-ink/15 bg-paper text-ink-soft hover:border-ink/40 hover:text-ink",
      )}
      aria-pressed={speaking}
    >
      <span aria-hidden>{speaking ? "■" : "▶"}</span>
      {speaking ? "Stop" : "Read aloud"}
    </button>
  );
}
