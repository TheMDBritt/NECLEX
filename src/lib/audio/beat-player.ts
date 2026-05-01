/**
 * In-browser song engine using only the Web Audio API.
 *
 * Each song is built from three layers, all synthesized live (no MP3s):
 *   1. Drums   — kick / snare / hi-hat per a sixteen-step pattern
 *   2. Bass    — a sub-bass note on selected steps
 *   3. Melody  — a lead line (square + sawtooth + lowpass + envelope) that
 *                carries the actual hook tune
 *
 * Plus, callers can subscribe to bar-boundary callbacks so they can fire TTS
 * utterances of the lyrics on the right beats — that's how "singing in time"
 * works in this stack: the synth carries the melody, the TTS carries the
 * words, both scheduled to the same clock.
 */

export type BeatStyle =
  | "trap-85"
  | "boom-bap-92"
  | "drill-140"
  | "neo-soul-70"
  | "neo-soul-80"
  | "gospel-piano";

export interface MelodyNote {
  step: number; // 0-based step index within the bar (0..steps-1)
  freq: number; // Hz; 0 = rest
  duration: number; // in steps
}

export interface BeatPattern {
  bpm: number;
  steps: number;
  kick: number[];
  snare: number[];
  hat: number[];
  bass?: number[];
  /** Chord-pad voices per step (used only for gospel-piano). */
  pad?: (number[] | null)[];
  /** Lead melody — plays on every loop of the bar. */
  melody?: MelodyNote[];
}

function p(s: string): number[] {
  return s.replace(/\s+/g, "").split("").map((c) => (c === "x" || c === "X" ? 1 : 0));
}

// Note frequencies (Hz)
const C2 = 65.41;
const E2 = 82.41;
const F2 = 87.31;
const G2 = 98.0;
const A2 = 110.0;
const C3 = 130.81;
const D3 = 146.83;
const E3 = 164.81;
const F3 = 174.61;
const G3 = 196.0;
const A3 = 220.0;
const Bb3 = 233.08;
const C4 = 261.63;
const D4 = 293.66;
const Eb4 = 311.13;
const E4 = 329.63;
const F4 = 349.23;
const G4 = 392.0;
const A4 = 440.0;
const C5 = 523.25;

const PATTERNS: Record<BeatStyle, BeatPattern> = {
  // DKA Bars — slow trap, A minor groove
  "trap-85": {
    bpm: 85,
    steps: 16,
    kick: p("x . . . . . . . . . x . . . . ."),
    snare: p(". . . . x . . . . . . . x . . ."),
    hat: p("x x x x x x x x x x . x x x x x"),
    bass: [A2, 0, 0, 0, 0, 0, 0, 0, 0, 0, F2, 0, 0, 0, 0, 0],
    melody: [
      // Minor-key hook descending then resolving
      { step: 0, freq: A4, duration: 2 },
      { step: 2, freq: G4, duration: 1 },
      { step: 3, freq: E4, duration: 1 },
      { step: 4, freq: A4, duration: 2 },
      { step: 6, freq: C5, duration: 2 },
      { step: 8, freq: G4, duration: 2 },
      { step: 10, freq: F4, duration: 1 },
      { step: 11, freq: E4, duration: 1 },
      { step: 12, freq: D4, duration: 2 },
      { step: 14, freq: E4, duration: 2 },
    ],
  },
  // ROME Flow — boom-bap, C minor blues line
  "boom-bap-92": {
    bpm: 92,
    steps: 16,
    kick: p("x . . . . . x . . . . . . . . ."),
    snare: p(". . . . x . . . . . . . x . . ."),
    hat: p("x . x . x . x . x . x . x . x ."),
    bass: [C2, 0, 0, 0, 0, 0, F2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    melody: [
      // Walking blues riff
      { step: 0, freq: C4, duration: 1 },
      { step: 1, freq: Eb4, duration: 1 },
      { step: 2, freq: G4, duration: 1 },
      { step: 3, freq: Eb4, duration: 1 },
      { step: 4, freq: F4, duration: 2 },
      { step: 6, freq: G4, duration: 2 },
      { step: 8, freq: C4, duration: 1 },
      { step: 9, freq: Bb3, duration: 1 },
      { step: 10, freq: G3, duration: 2 },
      { step: 12, freq: F3, duration: 2 },
      { step: 14, freq: Eb4, duration: 2 },
    ],
  },
  // Hour One — drill, F minor sliding lead
  "drill-140": {
    bpm: 140,
    steps: 16,
    kick: p("x . . x . . x . . . x . . . x ."),
    snare: p(". . . . x . . . . . . . x . . ."),
    hat: p("x x x x x x x x x . x x x x . x"),
    bass: [F2, 0, 0, 0, 0, 0, 0, 0, C2, 0, 0, 0, 0, 0, 0, 0],
    melody: [
      // Sharp drill stabs
      { step: 0, freq: F4, duration: 1 },
      { step: 2, freq: G4, duration: 1 },
      { step: 4, freq: C5, duration: 2 },
      { step: 7, freq: A4, duration: 1 },
      { step: 8, freq: F4, duration: 1 },
      { step: 10, freq: G4, duration: 1 },
      { step: 12, freq: F4, duration: 2 },
      { step: 14, freq: Eb4, duration: 1 },
      { step: 15, freq: D4, duration: 1 },
    ],
  },
  // Cushing's vs Addison — neo-soul slow, F major lush
  "neo-soul-70": {
    bpm: 70,
    steps: 16,
    kick: p("x . . . . . . . . . x . . . . ."),
    snare: p(". . . . x . . . . . . . x . . ."),
    hat: p("x . x . x . x . x . x . x . x ."),
    bass: [A2, 0, 0, 0, 0, 0, 0, 0, F2, 0, 0, 0, 0, 0, 0, 0],
    melody: [
      // Soft soulful figure
      { step: 0, freq: F4, duration: 2 },
      { step: 2, freq: A4, duration: 2 },
      { step: 4, freq: C5, duration: 2 },
      { step: 6, freq: A4, duration: 2 },
      { step: 8, freq: G4, duration: 2 },
      { step: 10, freq: F4, duration: 2 },
      { step: 12, freq: E4, duration: 2 },
      { step: 14, freq: F4, duration: 2 },
    ],
  },
  // Heart Failure Sides — neo-soul mid, G minor
  "neo-soul-80": {
    bpm: 80,
    steps: 16,
    kick: p("x . . . . . . x . . . . . . . ."),
    snare: p(". . . . x . . . . . . . x . . ."),
    hat: p("x . x . x . x . x . x . x . x ."),
    bass: [G2, 0, 0, 0, 0, 0, 0, 0, C2, 0, 0, 0, 0, 0, 0, 0],
    melody: [
      // Soulful arc
      { step: 0, freq: G4, duration: 2 },
      { step: 2, freq: Bb3, duration: 1 },
      { step: 3, freq: D4, duration: 1 },
      { step: 4, freq: G4, duration: 2 },
      { step: 6, freq: A4, duration: 2 },
      { step: 8, freq: G4, duration: 2 },
      { step: 10, freq: F4, duration: 2 },
      { step: 12, freq: D4, duration: 2 },
      { step: 14, freq: G4, duration: 2 },
    ],
  },
  // Five Rights — gospel piano, C-F-G-C progression
  "gospel-piano": {
    bpm: 80,
    steps: 16,
    kick: p("x . . . . . . . x . . . . . . ."),
    snare: p("................"),
    hat: p("................"),
    pad: [
      [C3, E3, G3], null, null, null,
      [F3, A3, C4], null, null, null,
      [G3, D4, G3 * 2], null, null, null,
      [C3, E3, G3], null, null, null,
    ],
    melody: [
      // Worship-style top line
      { step: 0, freq: E4, duration: 2 },
      { step: 2, freq: G4, duration: 2 },
      { step: 4, freq: A4, duration: 2 },
      { step: 6, freq: C5, duration: 2 },
      { step: 8, freq: D4, duration: 2 },
      { step: 10, freq: G4, duration: 2 },
      { step: 12, freq: E4, duration: 4 },
    ],
  },
};

// ---------------------------------------------------------------------------
// Drum / bass / pad / melody voices
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
  gain.gain.setValueAtTime(0.55, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
  noise.connect(filter).connect(gain).connect(dest);
  noise.start(time);
  noise.stop(time + 0.2);

  const tone = ctx.createOscillator();
  const toneGain = ctx.createGain();
  tone.type = "triangle";
  tone.frequency.value = 200;
  toneGain.gain.setValueAtTime(0.16, time);
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
  gain.gain.setValueAtTime(0.16, time);
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
  gain.gain.linearRampToValueAtTime(0.4, time + 0.01);
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
    gain.gain.linearRampToValueAtTime(0.1, time + 0.05);
    gain.gain.linearRampToValueAtTime(0.07, time + dur * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(gain).connect(dest);
    osc.start(time);
    osc.stop(time + dur + 0.1);
  }
}

/** Lead synth voice — square + saw + lowpass + envelope. Plays the melody. */
function playMelodyNote(
  ctx: AudioContext,
  time: number,
  freq: number,
  dur: number,
  dest: AudioNode,
) {
  if (!freq) return;
  const sawOsc = ctx.createOscillator();
  sawOsc.type = "sawtooth";
  sawOsc.frequency.value = freq;
  const sqOsc = ctx.createOscillator();
  sqOsc.type = "square";
  sqOsc.frequency.value = freq * 0.5;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2400, time);
  filter.frequency.exponentialRampToValueAtTime(900, time + dur);
  filter.Q.value = 2;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0, time);
  gain.gain.linearRampToValueAtTime(0.22, time + 0.02);
  gain.gain.linearRampToValueAtTime(0.18, time + dur * 0.7);
  gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

  sawOsc.connect(filter);
  sqOsc.connect(filter);
  filter.connect(gain).connect(dest);
  sawOsc.start(time);
  sqOsc.start(time);
  sawOsc.stop(time + dur + 0.05);
  sqOsc.stop(time + dur + 0.05);
}

// ---------------------------------------------------------------------------
// Player
// ---------------------------------------------------------------------------

export interface BeatPlayerOptions {
  masterGain?: number;
  /**
   * Called once at the very start of every bar (every 16 steps). Useful for
   * scheduling lyric utterances against the song clock.
   */
  onBar?: (barIndex: number) => void;
}

export class BeatPlayer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running = false;

  static isSupported(): boolean {
    if (typeof window === "undefined") return false;
    return !!(
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    );
  }

  async start(style: BeatStyle, opts: BeatPlayerOptions | number = {}) {
    if (this.running) return;
    const options: BeatPlayerOptions =
      typeof opts === "number" ? { masterGain: opts } : opts;
    const masterGain = options.masterGain ?? 0.7;
    const onBar = options.onBar;

    const Ctor =
      (window.AudioContext as typeof AudioContext | undefined) ||
      ((window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
    if (!Ctor) return;

    this.ctx = new Ctor();
    if (this.ctx.state === "suspended") await this.ctx.resume();

    this.master = this.ctx.createGain();
    this.master.gain.value = masterGain;
    this.master.connect(this.ctx.destination);

    this.running = true;

    const pattern = PATTERNS[style];
    const stepDuration = 60 / pattern.bpm / 4;
    let nextNoteTime = this.ctx.currentTime + 0.05;
    let stepIndex = 0;
    let barIndex = 0;

    const scheduler = () => {
      if (!this.running || !this.ctx || !this.master) return;
      while (nextNoteTime < this.ctx.currentTime + 0.2) {
        if (stepIndex === 0) {
          // Bar boundary — fire the callback once
          if (onBar) {
            const bi = barIndex;
            const delay = Math.max(0, (nextNoteTime - this.ctx.currentTime) * 1000);
            setTimeout(() => onBar(bi), delay);
          }
          barIndex++;
        }
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
        if (pattern.melody) {
          for (const note of pattern.melody) {
            if (note.step === stepIndex) {
              playMelodyNote(
                this.ctx,
                nextNoteTime,
                note.freq,
                note.duration * stepDuration,
                this.master,
              );
            }
          }
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
    if (this.master && this.ctx) {
      try {
        this.master.gain.cancelScheduledValues(this.ctx.currentTime);
        this.master.gain.setValueAtTime(this.master.gain.value, this.ctx.currentTime);
        this.master.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.05);
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

  /** BPM of the given style, exposed so the lyric scheduler can sync. */
  static bpmFor(style: BeatStyle): number {
    return PATTERNS[style].bpm;
  }
}
