"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Mnemonic, MnemonicKind } from "@/lib/content/mnemonics";
import { BeatPlayer } from "@/lib/audio/beat-player";
import {
  clearCustomBeatUrl,
  getCustomBeatUrl,
  setCustomBeatUrl,
} from "@/lib/audio/custom-beats";
import {
  deleteVoiceRecording,
  getVoiceRecording,
  isVoiceRecordingSupported,
  saveVoiceRecording,
} from "@/lib/audio/voice-store";
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
 * Full song player.
 *
 * Layers:
 *   1. Backing track — her custom-pasted MP3 URL OR the synth beat
 *   2. Vocal — her own recorded vocal (if she's recorded one) OR a TTS read
 *      of the lyrics on top
 *
 * Records via MediaRecorder + microphone. Recordings persist in IndexedDB
 * so they survive reload and across sessions on the same device.
 */
function SongPlayer({ mnemonic }: { mnemonic: Mnemonic }) {
  const [supported, setSupported] = useState(false);
  const [recordSupported, setRecordSupported] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [customUrl, setCustomUrlState] = useState<string>("");
  const [editingUrl, setEditingUrl] = useState(false);
  const [draftUrl, setDraftUrl] = useState("");
  const [recordError, setRecordError] = useState<string | null>(null);

  const beatPlayerRef = useRef<BeatPlayer | null>(null);
  const beatAudioRef = useRef<HTMLAudioElement | null>(null);
  const vocalAudioRef = useRef<HTMLAudioElement | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  /** Lines of lyrics queued one per bar of the beat. */
  const lyricLinesRef = useRef<string[]>([]);
  const lyricIndexRef = useRef<number>(0);
  const lyricRateRef = useRef<number>(1.0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recorderChunksRef = useRef<BlobPart[]>([]);
  const recorderStreamRef = useRef<MediaStream | null>(null);
  const recordingPlayerRef = useRef<BeatPlayer | null>(null);
  const recordingAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const audioOk = BeatPlayer.isSupported();
    const ttsOk = "speechSynthesis" in window;
    setSupported(audioOk || ttsOk);
    setRecordSupported(isVoiceRecordingSupported());

    const saved = getCustomBeatUrl(mnemonic.id);
    if (saved) {
      setCustomUrlState(saved);
      setDraftUrl(saved);
    }

    getVoiceRecording(mnemonic.id).then((blob) => setHasRecording(!!blob));

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
    if (vocalAudioRef.current) {
      vocalAudioRef.current.pause();
      try {
        URL.revokeObjectURL(vocalAudioRef.current.src);
      } catch {
        /* ignore */
      }
      vocalAudioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    utterRef.current = null;
    setPlaying(false);
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    if (recordingPlayerRef.current) {
      recordingPlayerRef.current.stop();
      recordingPlayerRef.current = null;
    }
    if (recordingAudioRef.current) {
      recordingAudioRef.current.pause();
      recordingAudioRef.current.currentTime = 0;
      recordingAudioRef.current = null;
    }
    if (recorderStreamRef.current) {
      recorderStreamRef.current.getTracks().forEach((t) => t.stop());
      recorderStreamRef.current = null;
    }
    setRecording(false);
  }

  function buildLyricsText(): string {
    const parts: string[] = [mnemonic.title];
    if (mnemonic.lyrics?.length) parts.push(...mnemonic.lyrics);
    return parts.join(". ");
  }

  /**
   * Flatten the lyrics into one line per beat-bar. Section headers like
   * `[Hook]` or `[Verse]` are dropped. Empty lines are dropped.
   */
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

  /**
   * Pick a TTS rate that lets a typical 7–10 syllable line land within one
   * bar of the beat. Slower BPMs get slower rates so the words feel sung-
   * out; faster BPMs (drill) get a tighter rate so the flow keeps up.
   */
  function rateForBpm(bpm: number): number {
    if (bpm <= 75) return 0.9;
    if (bpm <= 90) return 1.0;
    if (bpm <= 100) return 1.1;
    if (bpm <= 130) return 1.25;
    return 1.4;
  }

  function pitchForLineIndex(i: number): number {
    // Vary pitch across the song for vocal interest without being shouty.
    const cycle = [0.95, 1.0, 1.05, 1.0];
    return cycle[i % cycle.length] ?? 1.0;
  }

  function speakLineAtBar() {
    if (!("speechSynthesis" in window)) return;
    const idx = lyricIndexRef.current;
    const lines = lyricLinesRef.current;
    if (idx >= lines.length) return; // out of lyrics; let the beat keep playing
    const line = lines[idx]!;
    lyricIndexRef.current = idx + 1;

    const synth = window.speechSynthesis;
    // Don't queue up forever — if the prior line is still playing, cancel it
    // so the next bar's words land on time even if we ran a touch long.
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

  async function startBeat(onBar?: (bar: number) => void): Promise<void> {
    if (customUrl) {
      try {
        const audio = new Audio(customUrl);
        audio.loop = true;
        audio.volume = 0.65;
        audio.crossOrigin = "anonymous";
        beatAudioRef.current = audio;
        await audio.play();
        // Custom MP3 backing — no bar callback available; fire a manual
        // pulse based on a generic 90 BPM 16-step bar so lyrics still land
        // in time. (Falls through to the standard onBar pattern.)
        if (onBar) {
          const fakeBpm = 90;
          const barMs = (60 / fakeBpm) * 4 * 1000;
          let bar = 0;
          const tick = () => {
            if (!beatAudioRef.current) return;
            onBar(bar++);
            window.setTimeout(tick, barMs);
          };
          window.setTimeout(tick, 200);
        }
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

    // If she's recorded her own vocal, layer the recording over the beat —
    // her real voice replaces TTS entirely.
    const recordedBlob = await getVoiceRecording(mnemonic.id);

    // Otherwise, prepare the lyric-on-bar scheduler so TTS lines land with
    // the music instead of being read flat.
    if (!recordedBlob) {
      lyricLinesRef.current = buildLyricLines();
      lyricIndexRef.current = 0;
      const bpm = mnemonic.beatStyle
        ? BeatPlayer.bpmFor(mnemonic.beatStyle)
        : 90;
      lyricRateRef.current = rateForBpm(bpm);

      // Stop the song once we run out of lines + a little tail for the
      // last utterance to finish.
      const onBar = () => {
        const i = lyricIndexRef.current;
        const total = lyricLinesRef.current.length;
        if (i >= total) {
          // Wait two more bars after the last line, then stop.
          if (i === total) {
            lyricIndexRef.current = total + 1;
          } else if (i === total + 1) {
            stopAll();
          }
          return;
        }
        speakLineAtBar();
      };
      await startBeat(onBar);
      return;
    }

    // Recorded vocal path: just start the beat + her recording in parallel.
    await startBeat();
    const url = URL.createObjectURL(recordedBlob);
    const audio = new Audio(url);
    audio.volume = 1.0;
    audio.onended = () => stopAll();
    audio.onerror = () => stopAll();
    vocalAudioRef.current = audio;
    try {
      await audio.play();
    } catch {
      stopAll();
    }
  }

  function stop() {
    stopAll();
  }

  async function startRecording() {
    if (!recordSupported || recording) return;
    setRecordError(null);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      setRecordError(
        err instanceof Error && err.name === "NotAllowedError"
          ? "Microphone access denied. Allow microphone permissions for this site, then try again."
          : "Could not access microphone.",
      );
      return;
    }
    recorderStreamRef.current = stream;

    // Start the beat playing through the device speakers so she can rap to it.
    // (Browser security prevents us from mixing the beat directly into the
    // recording — the recording is voice only, beat plays separately on
    // playback. That's the privacy-friendly browser default.)
    if (mnemonic.beatStyle && BeatPlayer.isSupported() && !customUrl) {
      const player = new BeatPlayer();
      recordingPlayerRef.current = player;
      await player.start(mnemonic.beatStyle, 0.55);
    } else if (customUrl) {
      try {
        const audio = new Audio(customUrl);
        audio.loop = true;
        audio.volume = 0.65;
        audio.crossOrigin = "anonymous";
        recordingAudioRef.current = audio;
        await audio.play();
      } catch {
        /* still record voice without audible beat */
      }
    }

    const mimeCandidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus",
    ];
    const mimeType = mimeCandidates.find((m) =>
      window.MediaRecorder.isTypeSupported(m),
    );
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    recorderRef.current = recorder;
    recorderChunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recorderChunksRef.current.push(e.data);
    };
    recorder.onstop = async () => {
      const blob = new Blob(recorderChunksRef.current, {
        type: mimeType ?? "audio/webm",
      });
      try {
        await saveVoiceRecording(mnemonic.id, blob);
        setHasRecording(true);
      } catch {
        setRecordError("Couldn't save the recording on this device.");
      }
    };
    recorder.start();
    setRecording(true);
  }

  async function deleteRecording() {
    await deleteVoiceRecording(mnemonic.id);
    setHasRecording(false);
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
          onClick={() => (playing ? stop() : play())}
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

        {recordSupported ? (
          <button
            onClick={() => (recording ? stopRecording() : startRecording())}
            type="button"
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-200",
              recording
                ? "border-clay-600 bg-clay-600 text-paper"
                : "border-ink/20 bg-paper text-ink-soft hover:border-ink/40 hover:text-ink",
            )}
            aria-pressed={recording}
          >
            <span aria-hidden>{recording ? "■" : "●"}</span>
            {recording ? "Stop recording" : hasRecording ? "Re-record vocals" : "Record vocals"}
          </button>
        ) : null}

        {hasRecording && !recording ? (
          <button
            onClick={deleteRecording}
            type="button"
            className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-faint hover:text-ink"
          >
            Delete recording
          </button>
        ) : null}

        <button
          onClick={() => setEditingUrl((v) => !v)}
          type="button"
          className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-faint hover:text-ink"
        >
          {customUrl ? "Change beat" : "Use real beat URL"}
        </button>
      </div>

      {hasRecording ? (
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-sage-800">
          ▸ Vocal recorded — Play song uses your voice over the beat
        </p>
      ) : (
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
          No recording yet — Play uses TTS over the beat. Tap Record vocals to lay your own.
        </p>
      )}

      {recording ? (
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-clay-800">
          ● Recording — rap or sing the lyrics. Tap Stop when done.
        </p>
      ) : null}

      {recordError ? (
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-clay-800">
          {recordError}
        </p>
      ) : null}

      {customUrl && !editingUrl ? (
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
          Backing track: your linked MP3
        </p>
      ) : null}

      {editingUrl ? (
        <div className="space-y-2 rounded-lg border border-ink/10 bg-paper p-4">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            Paste any free MP3 URL — the track loops under the lyrics. Saved on this device only.
          </p>
          <input
            type="url"
            value={draftUrl}
            onChange={(e) => setDraftUrl(e.target.value)}
            placeholder="https://example.com/beat.mp3"
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
