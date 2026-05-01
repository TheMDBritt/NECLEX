import { describe, expect, it } from "vitest";
import { seedFromString, shuffleWithSeed } from "../shuffle";

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
