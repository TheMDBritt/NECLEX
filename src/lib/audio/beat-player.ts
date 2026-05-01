/**
 * Pure-JS drum + bass synth using the Web Audio API.
 *
 * This generates real audible sound on the device — kick, snare, hi-hat, and a
 * sub-bass note — programmatically. No audio files. The output is genuine
 * synth-style drums (not a recorded beat), which is what's possible in pure
 * browser code.
 *
 * Usage:
 *   const player = new BeatPlayer();
 *   await player.start("trap-85");
 *   ...
 *   player.stop();
 */

export type BeatStyle =
  | "trap-85"
  | "boom-bap-92"
  | "drill-140"
  | "neo-soul-70"
  | "neo-soul-80"
  | "gospel-piano";

export interface BeatPattern {
  /** Beats per minute. */
  bpm: number;
  /** Total steps per bar (typically 16 = sixteenth notes). */
  steps: number;
  /** 1 if hit, 0 if rest. Length must equal steps. */
  kick: number[];
  snare: number[];
  hat: number[];
  /** Optional sub-bass note in Hz, or 0 for rest. Played at each step it's nonzero. */
  bass?: number[];
  /** Optional chord pad notes (Hz array per step; empty = no pad). */
  pad?: (number[] | null)[];
}

// ---------------------------------------------------------------------------
// Pattern library — kept simple and recognizable per genre.
// ---------------------------------------------------------------------------

// Helper: build a 16-step pattern from a string of "x" (hit) and "." (rest).
function p(s: string): number[] {
  return s.replace(/\s+/g, "").split("").map((c) => (c === "x" || c === "X" ? 1 : 0));
}

// Sub-bass note frequencies (Hz). C2=65.41, F2=87.31, G2=98, A2=110.
const C2 = 65.41;
const F2 = 87.31;
const G2 = 98.0;
const A2 = 110.0;

const PATTERNS: Record<BeatStyle, BeatPattern> = {
  // Slow trap: kick on 1 and 11, snare backbeat, hi-hat 16ths with rolls
  "trap-85": {
    bpm: 85,
    steps: 16,
    kick: p("x . . . . . . . . . x . . . . ."),
    snare: p(". . . . x . . . . . . . x . . ."),
    hat: p("x x x x x x x x x x . x x x x x"),
    bass: [C2, 0, 0, 0, 0, 0, 0, 0, 0, 0, F2, 0, 0, 0, 0, 0],
  },
  // Boom bap: classic 90s hip-hop, snare on 2 and 4
  "boom-bap-92": {
    bpm: 92,
    steps: 16,
    kick: p("x . . . . . x . . . . . . . . ."),
    snare: p(". . . . x . . . . . . . x . . ."),
    hat: p("x . x . x . x . x . x . x . x ."),
    bass: [C2, 0, 0, 0, 0, 0, F2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  // Drill: faster, sliding-style bass via two notes per bar, sharp hats
  "drill-140": {
    bpm: 140,
    steps: 16,
    kick: p("x . . x . . x . . . x . . . x ."),
    snare: p(". . . . x . . . . . . . x . . ."),
    hat: p("x x x x x x x x x . x x x x . x"),
    bass: [C2, 0, 0, 0, 0, 0, 0, 0, F2, 0, 0, 0, 0, 0, 0, 0],
  },
  // Neo-soul slow groove: laid-back kick/snare, light hat
  "neo-soul-70": {
    bpm: 70,
    steps: 16,
    kick: p("x . . . . . . . . . x . . . . ."),
    snare: p(". . . . x . . . . . . . x . . ."),
    hat: p("x . x . x . x . x . x . x . x ."),
    bass: [A2, 0, 0, 0, 0, 0, 0, 0, F2, 0, 0, 0, 0, 0, 0, 0],
  },
  "neo-soul-80": {
    bpm: 80,
    steps: 16,
    kick: p("x . . . . . . x . . . . . . . ."),
    snare: p(". . . . x . . . . . . . x . . ."),
    hat: p("x . x . x . x . x . x . x . x ."),
    bass: [G2, 0, 0, 0, 0, 0, 0, 0, C2, 0, 0, 0, 0, 0, 0, 0],
  },
  // Gospel piano: no drums, just chord pad on the downbeats
  "gospel-piano": {
    bpm: 80,
    steps: 16,
    kick: p("x . . . . . . . x . . . . . . ."),
    snare: p("................"),
    hat: p("................"),
    pad: [
      [C2 * 2, C2 * 2 * 1.25, C2 * 2 * 1.5], // C major triad
      null, null, null,
      [F2 * 2, F2 * 2 * 1.26, F2 * 2 * 1.5], // F major
      null, null, null,
      [G2 * 2, G2 * 2 * 1.26, G2 * 2 * 1.5], // G major
      null, null, null,
      [C2 * 2, C2 * 2 * 1.25, C2 * 2 * 1.5], // back to C
      null, null, null,
    ],
  },
};

// ---------------------------------------------------------------------------
// Synth voices — kick, snare, hat, bass, pad chord
// ---------------------------------------------------------------------------

function playKick(ctx: AudioContext, time: number, dest: AudioNode) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);
  gain.gain.setValueAtTime(0.9, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
  osc.connect(gain).connect(dest);
  osc.start(time);
  osc.stop(time + 0.2);
}

function playSnare(ctx: AudioContext, time: number, dest: AudioNode) {
  // Noise burst through a band-pass to mimic a snare body
  const bufSize = ctx.sampleRate * 0.2;
  const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1800;
  filter.Q.value = 0.8;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.6, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

  noise.connect(filter).connect(gain).connect(dest);
  noise.start(time);
  noise.stop(time + 0.2);

  // Add a tonal body for warmth
  const tone = ctx.createOscillator();
  const toneGain = ctx.createGain();
  tone.type = "triangle";
  tone.frequency.value = 200;
  toneGain.gain.setValueAtTime(0.18, time);
  toneGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
  tone.connect(toneGain).connect(dest);
  tone.start(time);
  tone.stop(time + 0.1);
}

function playHat(ctx: AudioContext, time: number, dest: AudioNode) {
  const bufSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 7000;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.18, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

  noise.connect(filter).connect(gain).connect(dest);
  noise.start(time);
  noise.stop(time + 0.05);
}

function playBass(ctx: AudioContext, time: number, freq: number, dur: number, dest: AudioNode) {
  if (!freq) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0, time);
  gain.gain.linearRampToValueAtTime(0.45, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
  osc.connect(gain).connect(dest);
  osc.start(time);
  osc.stop(time + dur + 0.05);
}

function playPad(ctx: AudioContext, time: number, freqs: number[], dur: number, dest: AudioNode) {
  for (const f of freqs) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = f;
    gain.gain.setValueAtTime(0.0, time);
    gain.gain.linearRampToValueAtTime(0.12, time + 0.05);
    gain.gain.linearRampToValueAtTime(0.08, time + dur * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(gain).connect(dest);
    osc.start(time);
    osc.stop(time + dur + 0.1);
  }
}

// ---------------------------------------------------------------------------
// Player — schedules the loop and lets the caller stop it cleanly.
// ---------------------------------------------------------------------------

export class BeatPlayer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running = false;

  /** Whether playback is supported in this environment. */
  static isSupported(): boolean {
    if (typeof window === "undefined") return false;
    return !!(window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
  }

  async start(style: BeatStyle, masterGain = 0.7) {
    if (this.running) return;
    const Ctor =
      (window.AudioContext as typeof AudioContext | undefined) ||
      ((window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
    if (!Ctor) return;

    this.ctx = new Ctor();
    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
    this.master = this.ctx.createGain();
    this.master.gain.value = masterGain;
    this.master.connect(this.ctx.destination);

    this.running = true;

    const pattern = PATTERNS[style];
    const stepDuration = 60 / pattern.bpm / 4; // 16th-note duration in seconds
    let nextNoteTime = this.ctx.currentTime + 0.05;
    let stepIndex = 0;

    const scheduler = () => {
      if (!this.running || !this.ctx || !this.master) return;
      while (nextNoteTime < this.ctx.currentTime + 0.2) {
        if (pattern.kick[stepIndex]) playKick(this.ctx, nextNoteTime, this.master);
        if (pattern.snare[stepIndex]) playSnare(this.ctx, nextNoteTime, this.master);
        if (pattern.hat[stepIndex]) playHat(this.ctx, nextNoteTime, this.master);
        if (pattern.bass) {
          const freq = pattern.bass[stepIndex];
          if (freq) playBass(this.ctx, nextNoteTime, freq, stepDuration * 4, this.master);
        }
        if (pattern.pad) {
          const chord = pattern.pad[stepIndex];
          if (chord && chord.length > 0)
            playPad(this.ctx, nextNoteTime, chord, stepDuration * 4, this.master);
        }
        nextNoteTime += stepDuration;
        stepIndex = (stepIndex + 1) % pattern.steps;
      }
      this.timer = setTimeout(scheduler, 25);
    };

    scheduler();
  }

  stop() {
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.master) {
      try {
        // Quick fade to avoid click
        const ctx = this.ctx!;
        this.master.gain.cancelScheduledValues(ctx.currentTime);
        this.master.gain.setValueAtTime(this.master.gain.value, ctx.currentTime);
        this.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
      } catch {
        /* ignore */
      }
    }
    setTimeout(() => {
      if (this.ctx) {
        this.ctx.close().catch(() => undefined);
        this.ctx = null;
        this.master = null;
      }
    }, 80);
  }
}
