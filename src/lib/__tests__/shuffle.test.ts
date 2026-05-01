import { describe, expect, it } from "vitest";
import { seedFromString, shuffleWithSeed } from "../shuffle";
import { seedMultipleChoiceItems, seedMultipleResponseItems } from "../content/seed-items";

describe("shuffleWithSeed", () => {
  const items = ["a", "b", "c", "d", "e"];

  it("never mutates the input array", () => {
    const original = items.slice();
    shuffleWithSeed(items, 12345);
    expect(items).toEqual(original);
  });

  it("returns the same permutation for the same seed", () => {
    expect(shuffleWithSeed(items, 12345)).toEqual(shuffleWithSeed(items, 12345));
    expect(shuffleWithSeed(items, "attempt-1")).toEqual(shuffleWithSeed(items, "attempt-1"));
  });

  it("produces different orderings for different seeds (most of the time)", () => {
    const a = shuffleWithSeed(items, 1).join("");
    const b = shuffleWithSeed(items, 2).join("");
    const c = shuffleWithSeed(items, 3).join("");
    expect(new Set([a, b, c]).size).toBeGreaterThan(1);
  });

  it("preserves length and contents (no drops, no dupes)", () => {
    const out = shuffleWithSeed(items, "x");
    expect(out).toHaveLength(items.length);
    expect(out.slice().sort()).toEqual(items.slice().sort());
  });

  it("distributes positions roughly uniformly across many seeds", () => {
    // Each item should land in each position with rough uniformity.
    const counts: Record<string, number[]> = Object.fromEntries(items.map((it) => [it, [0, 0, 0, 0, 0]]));
    const trials = 5000;
    for (let s = 0; s < trials; s++) {
      const out = shuffleWithSeed(items, s);
      out.forEach((it, i) => {
        counts[it]![i]++;
      });
    }
    // Expected ~1000 per cell (5000 / 5). Allow ±20% tolerance.
    for (const item of items) {
      for (const c of counts[item]!) {
        expect(c).toBeGreaterThan(800);
        expect(c).toBeLessThan(1200);
      }
    }
  });
});

/**
 * The "no letter alignment" guarantee — for any single-best-answer item,
 * the correct answer must NOT always land at the same letter (A/B/C/D)
 * across sessions. We simulate sessions per item and assert each position
 * is reached often enough.
 *
 * SATA items are excluded because they have multiple correct options,
 * so "first correct position" is naturally non-uniform — that does not
 * indicate a shuffle defect.
 */
describe("answer-position fairness across sessions (single-best-answer items)", () => {
  it.each(seedMultipleChoiceItems)(
    "$id — correct answer position varies across sessions",
    (item) => {
      const positionCounts = new Array(item.options.length).fill(0);
      const trials = 400;

      for (let i = 0; i < trials; i++) {
        const seed = `session-${i}:${item.id}`;
        const shuffled = shuffleWithSeed(item.options, seed);
        const correctIdx = shuffled.findIndex((o) => o.isCorrect);
        positionCounts[correctIdx] = (positionCounts[correctIdx] ?? 0) + 1;
      }

      const expected = trials / item.options.length;
      const tolerance = expected * 0.4; // ±40% of expected — guards against pinning
      for (const count of positionCounts) {
        expect(count).toBeGreaterThan(expected - tolerance);
        expect(count).toBeLessThan(expected + tolerance);
      }
    },
  );

  it("each correct option in a SATA item visits every position over many sessions", () => {
    // For SATA, every correct option independently should land in every
    // position at least once in 400 trials.
    const item = seedMultipleResponseItems[0]!;
    const reachedByOptionId = new Map<string, Set<number>>();
    for (const opt of item.options) {
      if (opt.isCorrect) reachedByOptionId.set(opt.id, new Set());
    }
    for (let i = 0; i < 400; i++) {
      const shuffled = shuffleWithSeed(item.options, `session-${i}:${item.id}`);
      shuffled.forEach((opt, pos) => {
        if (opt.isCorrect) reachedByOptionId.get(opt.id)!.add(pos);
      });
    }
    for (const [, positions] of reachedByOptionId) {
      expect(positions.size).toBe(item.options.length);
    }
  });

  it("the same session-id reproduces the same shuffle (replayable on review)", () => {
    const item = seedMultipleChoiceItems[0]!;
    const seed = "session-2026-05-01-abc:q-001";
    const a = shuffleWithSeed(item.options, seed).map((o) => o.id);
    const b = shuffleWithSeed(item.options, seed).map((o) => o.id);
    expect(a).toEqual(b);
  });

  it("different session-ids produce different orderings", () => {
    const item = seedMultipleChoiceItems[0]!;
    const a = shuffleWithSeed(item.options, "session-A:q").map((o) => o.id);
    const b = shuffleWithSeed(item.options, "session-B:q").map((o) => o.id);
    const c = shuffleWithSeed(item.options, "session-C:q").map((o) => o.id);
    const allEqual = a.join() === b.join() && b.join() === c.join();
    expect(allEqual).toBe(false);
  });
});

describe("seedFromString", () => {
  it("is deterministic", () => {
    expect(seedFromString("foo")).toBe(seedFromString("foo"));
  });

  it("is sensitive to small changes", () => {
    expect(seedFromString("foo")).not.toBe(seedFromString("foO"));
    expect(seedFromString("attempt-1")).not.toBe(seedFromString("attempt-2"));
  });

  it("returns a 32-bit unsigned integer", () => {
    const s = seedFromString("a-fairly-long-attempt-id-just-to-make-sure");
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(0xffffffff);
    expect(Number.isInteger(s)).toBe(true);
  });
});
