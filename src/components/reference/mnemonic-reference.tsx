"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Mnemonic, MnemonicKind } from "@/lib/content/mnemonics";
import { BeatPlayer } from "@/lib/audio/beat-player";
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

  function toggleTopic(t: string) {
    setTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }
  function toggleKind(k: MnemonicKind) {
    setKinds((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
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
          {allKinds.map((k) => {
            const active = kinds.includes(k);
            return (
              <button
                key={k}
                onClick={() => toggleKind(k)}
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
              {m.kind === "song" ? <SongCard m={m} /> : <MnemonicCard m={m} />}
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

      <ReadAloudButton mnemonic={m} />
    </article>
  );
}

function SongCard({ m }: { m: Mnemonic }) {
  const stanzas = m.lyrics ?? [];
  return (
    <article className="flex h-full flex-col rounded-2xl border border-lavender-200 bg-lavender-50 p-6">
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-[1.5rem] font-light leading-[1.18] tracking-[-0.015em] text-ink">
          {m.title}
        </h3>
        <span className="rounded-full bg-lavender-200 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-lavender-800">
          Song
        </span>
      </header>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">{m.topic}</p>

      {m.tune ? (
        <p className="mt-3 font-display text-[1rem] italic leading-[1.4] text-lavender-800">
          {m.tune}
        </p>
      ) : null}

      <p className="mt-3 font-body text-[14px] leading-[1.55] text-ink-soft">{m.body}</p>

      <PlaySongButton mnemonic={m} />

      <div className="mt-5 space-y-4">
        {stanzas.map((stanza, i) => (
          <pre
            key={i}
            className="whitespace-pre-wrap rounded-lg border border-lavender-200/60 bg-paper p-4 font-body text-[14.5px] leading-[1.55] text-ink"
          >
            {stanza}
          </pre>
        ))}
      </div>

      <p className="mt-5 font-body text-[13.5px] italic leading-[1.6] text-ink-soft">{m.clinical}</p>
    </article>
  );
}

/**
 * Plays an actual synthesized beat (Web Audio API) under the lyrics. The
 * lyrics are read by the browser's text-to-speech voice on top of the beat.
 * No audio files are loaded — drums and bass are generated live.
 */
function PlaySongButton({ mnemonic }: { mnemonic: Mnemonic }) {
  const [supported, setSupported] = useState(false);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<BeatPlayer | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const audioOk = BeatPlayer.isSupported();
    const ttsOk = "speechSynthesis" in window;
    setSupported(audioOk || ttsOk);
    return () => {
      // Stop everything if the card unmounts
      if (playerRef.current) playerRef.current.stop();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function buildLyricsText(): string {
    const parts: string[] = [mnemonic.title];
    if (mnemonic.lyrics?.length) parts.push(...mnemonic.lyrics);
    return parts.join(". ");
  }

  async function play() {
    if (!supported || playing) return;
    setPlaying(true);

    // Start beat
    if (mnemonic.beatStyle && BeatPlayer.isSupported()) {
      const player = new BeatPlayer();
      playerRef.current = player;
      await player.start(mnemonic.beatStyle, 0.55);
    }

    // Start TTS layered on top
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utter = new SpeechSynthesisUtterance(buildLyricsText());
      utter.rate = 1.0;
      utter.pitch = 1.0;
      utter.volume = 1.0;
      utter.lang = "en-US";
      const voices = synth.getVoices();
      const enVoice =
        voices.find((v) => v.lang.startsWith("en") && v.localService) ??
        voices.find((v) => v.lang.startsWith("en"));
      if (enVoice) utter.voice = enVoice;
      utter.onend = () => stop();
      utter.onerror = () => stop();
      utterRef.current = utter;
      synth.speak(utter);
    }
  }

  function stop() {
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    utterRef.current = null;
    setPlaying(false);
  }

  if (!supported) {
    return (
      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
        Audio not available in this browser
      </p>
    );
  }

  return (
    <button
      onClick={() => (playing ? stop() : play())}
      type="button"
      className={cn(
        "mt-5 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-200",
        playing
          ? "border-lavender-600 bg-lavender-600 text-paper"
          : "border-ink/20 bg-paper text-ink hover:border-ink/40",
      )}
      aria-pressed={playing}
    >
      <span aria-hidden>{playing ? "■" : "▶"}</span>
      {playing ? "Stop" : "Play song"}
    </button>
  );
}

/**
 * Read-aloud button for non-song mnemonics — flat TTS read of the lines.
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
    const fragments: string[] = [mnemonic.title, mnemonic.body];
    if (mnemonic.lines?.length) {
      fragments.push(...mnemonic.lines.map((l) => `${l.key}. ${l.meaning}`));
    }
    fragments.push(mnemonic.clinical);
    const utterance = new SpeechSynthesisUtterance(fragments.join(". "));
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = "en-US";
    const voices = synth.getVoices();
    const enVoice =
      voices.find((v) => v.lang.startsWith("en") && v.localService) ??
      voices.find((v) => v.lang.startsWith("en"));
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
