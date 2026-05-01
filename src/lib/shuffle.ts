/**
 * Deterministic, seedable Fisher-Yates shuffle used everywhere a question is
 * rendered. Every attempt persists the seed so the review screen can replay
 * exactly what the learner saw.
 *
 * Hard rule (todo.md, Phase 3.2): option order MUST shuffle on every render
 * unless the question is a hot-spot or highlight (where shuffle is N/A).
 */

/**
 * mulberry32 — small, fast, well-distributed PRNG.
 * Returns a function that yields floats in [0, 1).
 */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function next() {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Hash an arbitrary string (e.g. attempt id) to a 32-bit unsigned integer.
 * Used to derive a stable seed from non-numeric IDs.
 */
export function seedFromString(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Return a new array containing `items` shuffled in a stable, replayable way.
 * The original array is never mutated.
 *
 * @param items  the items to shuffle
 * @param seed   either a 32-bit number or a string (hashed via FNV-1a)
 */
export function shuffleWithSeed<T>(items: readonly T[], seed: number | string): T[] {
  const numericSeed = typeof seed === "string" ? seedFromString(seed) : seed >>> 0;
  const rand = mulberry32(numericSeed);
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
