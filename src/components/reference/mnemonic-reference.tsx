"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Mnemonic, MnemonicKind } from "@/lib/content/mnemonics";
import { BeatPlayer } from "@/lib/audio/beat-player";
import {
  clearCustomBeatUrl,
  getCustomBeatUrl,
  setCustomBeatUrl,
} from "@/lib/audio/custom-beats";
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

      <SongPlayer mnemonic={m} />

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
 * Song player. Plays a finished song:
 *
 *   1. Backing track — a real MP3 URL she's pasted in OR the in-browser
 *      synth beat tied to the song's beatStyle.
 *   2. Vocals — TTS reading the lyrics in time with the bar (one line per
 *      bar, BPM-tuned rate, slight pitch variation per line for flow).
 *
 * To upgrade a song to a real produced track once: tap "Make this real",
 * copy the Suno style prompt + lyrics, paste into suno.com, generate,
 * download the MP3, paste the URL into "Add real beat". From then on
 * the song plays the real track.
 */
function SongPlayer({ mnemonic }: { mnemonic: Mnemonic }) {
  const [supported, setSupported] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [customUrl, setCustomUrlState] = useState<string>("");
  const [editingUrl, setEditingUrl] = useState(false);
  const [draftUrl, setDraftUrl] = useState("");
  const [showSuno, setShowSuno] = useState(false);
  const [copied, setCopied] = useState(false);

  const beatPlayerRef = useRef<BeatPlayer | null>(null);
  const beatAudioRef = useRef<HTMLAudioElement | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const lyricLinesRef = useRef<string[]>([]);
  const lyricIndexRef = useRef<number>(0);
  const lyricRateRef = useRef<number>(1.0);
  const fakeBarTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const audioOk = BeatPlayer.isSupported();
    const ttsOk = "speechSynthesis" in window;
    setSupported(audioOk || ttsOk);

    const saved = getCustomBeatUrl(mnemonic.id);
    if (saved) {
      setCustomUrlState(saved);
      setDraftUrl(saved);
    }

    return () => {
      stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mnemonic.id]);

  function stopAll() {
    if (beatPlayerRef.current) {
      beatPlayerRef.current.stop();
      beatPlayerRef.current = null;
    }
    if (beatAudioRef.current) {
      beatAudioRef.current.pause();
      beatAudioRef.current.currentTime = 0;
      beatAudioRef.current = null;
    }
    if (fakeBarTimerRef.current !== null) {
      window.clearTimeout(fakeBarTimerRef.current);
      fakeBarTimerRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    utterRef.current = null;
    setPlaying(false);
  }

  function buildLyricLines(): string[] {
    const all: string[] = [];
    if (!mnemonic.lyrics?.length) return all;
    for (const stanza of mnemonic.lyrics) {
      for (const raw of stanza.split(/\r?\n/)) {
        const line = raw.trim();
        if (!line) continue;
        if (line.startsWith("[") && line.endsWith("]")) continue;
        all.push(line);
      }
    }
    return all;
  }

  function rateForBpm(bpm: number): number {
    if (bpm <= 75) return 0.9;
    if (bpm <= 90) return 1.0;
    if (bpm <= 100) return 1.1;
    if (bpm <= 130) return 1.25;
    return 1.4;
  }

  function pitchForLineIndex(i: number): number {
    const cycle = [0.95, 1.0, 1.05, 1.0];
    return cycle[i % cycle.length] ?? 1.0;
  }

  function speakNextLine() {
    if (!("speechSynthesis" in window)) return;
    const idx = lyricIndexRef.current;
    const lines = lyricLinesRef.current;
    if (idx >= lines.length) {
      // Tail bar after last line, then stop.
      lyricIndexRef.current = lines.length + 1;
      return;
    }
    const line = lines[idx]!;
    lyricIndexRef.current = idx + 1;

    const synth = window.speechSynthesis;
    if (synth.speaking) synth.cancel();

    const utter = new SpeechSynthesisUtterance(line);
    utter.rate = lyricRateRef.current;
    utter.pitch = pitchForLineIndex(idx);
    utter.volume = 1.0;
    utter.lang = "en-US";
    const voices = synth.getVoices();
    const enVoice =
      voices.find((v) => v.lang.startsWith("en") && v.localService) ??
      voices.find((v) => v.lang.startsWith("en"));
    if (enVoice) utter.voice = enVoice;
    utterRef.current = utter;
    synth.speak(utter);
  }

  async function startBeat(onBar: () => void): Promise<void> {
    if (customUrl) {
      try {
        const audio = new Audio(customUrl);
        audio.loop = true;
        audio.volume = 0.65;
        audio.crossOrigin = "anonymous";
        beatAudioRef.current = audio;
        await audio.play();
        // Custom MP3 — fake a bar pulse at 90 BPM so lyrics still land in time.
        const fakeBpm = 90;
        const barMs = (60 / fakeBpm) * 4 * 1000;
        const tick = () => {
          if (!beatAudioRef.current) return;
          onBar();
          fakeBarTimerRef.current = window.setTimeout(tick, barMs);
        };
        fakeBarTimerRef.current = window.setTimeout(tick, 200);
        return;
      } catch {
        // fall through to synth
      }
    }
    if (mnemonic.beatStyle && BeatPlayer.isSupported()) {
      const player = new BeatPlayer();
      beatPlayerRef.current = player;
      await player.start(mnemonic.beatStyle, { masterGain: 0.55, onBar });
    }
  }

  async function play() {
    if (!supported || playing) return;
    setPlaying(true);

    lyricLinesRef.current = buildLyricLines();
    lyricIndexRef.current = 0;
    const bpm = mnemonic.beatStyle ? BeatPlayer.bpmFor(mnemonic.beatStyle) : 90;
    lyricRateRef.current = rateForBpm(bpm);

    const onBar = () => {
      const i = lyricIndexRef.current;
      const total = lyricLinesRef.current.length;
      if (i > total) {
        stopAll();
        return;
      }
      speakNextLine();
    };

    await startBeat(onBar);
  }

  function saveDraft() {
    const trimmed = draftUrl.trim();
    if (trimmed) setCustomBeatUrl(mnemonic.id, trimmed);
    else clearCustomBeatUrl(mnemonic.id);
    setCustomUrlState(trimmed);
    setEditingUrl(false);
  }

  function clearUrl() {
    clearCustomBeatUrl(mnemonic.id);
    setCustomUrlState("");
    setDraftUrl("");
    setEditingUrl(false);
  }

  function buildSunoLyrics(): string {
    const parts: string[] = [];
    if (mnemonic.lyrics?.length) {
      for (const stanza of mnemonic.lyrics) parts.push(stanza.trim());
    }
    return parts.join("\n\n");
  }

  async function copySunoBundle() {
    const blob = [
      `Style: ${mnemonic.sunoStyle ?? mnemonic.tune ?? ""}`,
      "",
      "Lyrics:",
      buildSunoLyrics(),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(blob);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — surface a fallback if needed */
    }
  }

  if (!supported) {
    return (
      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
        Audio not available in this browser
      </p>
    );
  }

  return (
    <div className="mt-5 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => (playing ? stopAll() : play())}
          type="button"
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-200",
            playing
              ? "border-lavender-600 bg-lavender-600 text-paper"
              : "border-ink/20 bg-paper text-ink hover:border-ink/40",
          )}
          aria-pressed={playing}
        >
          <span aria-hidden>{playing ? "■" : "▶"}</span>
          {playing ? "Stop" : "Play song"}
        </button>

        <button
          onClick={() => setShowSuno((v) => !v)}
          type="button"
          className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-faint hover:text-ink"
        >
          {showSuno ? "Hide produce panel" : "Make this a real track"}
        </button>

        <button
          onClick={() => setEditingUrl((v) => !v)}
          type="button"
          className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-faint hover:text-ink"
        >
          {customUrl ? "Change MP3" : "Paste real MP3 URL"}
        </button>
      </div>

      {customUrl && !editingUrl ? (
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-sage-800">
          ▸ Backing track: your real MP3
        </p>
      ) : null}

      {showSuno ? (
        <div className="space-y-3 rounded-lg border border-lavender-200 bg-paper p-4">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            Make a real produced version (one-time setup)
          </p>
          <ol className="space-y-1 font-body text-[13.5px] leading-[1.55] text-ink">
            <li>1. Tap Copy below — it copies the Suno style prompt + lyrics.</li>
            <li>2. Open suno.com (free tier) and paste into Custom Mode → Style + Lyrics.</li>
            <li>3. Generate. Download the MP3 you like.</li>
            <li>
              4. Host it anywhere with a public URL (Pixabay upload, Drive share, etc.)
              and paste the URL into Paste real MP3 URL above. Done — Play song now plays
              the real track every time.
            </li>
          </ol>
          <pre className="whitespace-pre-wrap rounded border border-ink/10 bg-paper-deep/30 p-3 font-mono text-[12px] leading-[1.55] text-ink">
{`Style: ${mnemonic.sunoStyle ?? mnemonic.tune ?? ""}

Lyrics:
${buildSunoLyrics()}`}
          </pre>
          <button
            type="button"
            onClick={copySunoBundle}
            className="rounded-full bg-ink px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.22em] text-paper transition-colors duration-200 hover:bg-indigo-deep"
          >
            {copied ? "Copied" : "Copy Suno style + lyrics"}
          </button>
        </div>
      ) : null}

      {editingUrl ? (
        <div className="space-y-2 rounded-lg border border-ink/10 bg-paper p-4">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            Paste any direct MP3 URL — the track loops under the lyrics. Saved on this device.
          </p>
          <input
            type="url"
            value={draftUrl}
            onChange={(e) => setDraftUrl(e.target.value)}
            placeholder="https://example.com/dka-bars.mp3"
            className="w-full rounded-lg border border-ink/15 bg-paper px-3 py-2 font-body text-[14px] text-ink placeholder:text-ink-faint focus:border-ink/40 focus:outline-none"
          />
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={saveDraft}
              className="rounded-full bg-ink px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.22em] text-paper transition-colors duration-200 hover:bg-indigo-deep"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setDraftUrl(customUrl);
                setEditingUrl(false);
              }}
              className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint hover:text-ink"
            >
              Cancel
            </button>
            {customUrl ? (
              <button
                type="button"
                onClick={clearUrl}
                className="ml-auto font-mono text-[10.5px] uppercase tracking-[0.22em] text-clay-600 hover:text-clay-800"
              >
                Use synth beat
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

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
