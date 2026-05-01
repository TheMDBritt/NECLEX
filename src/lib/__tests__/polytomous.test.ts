import { describe, expect, it } from "vitest";
import { scorePolytomousPlusMinus } from "../scoring/polytomous";
import type { Option } from "../types/question";

const opt = (id: string, isCorrect: boolean): Option => ({ id, label: id, isCorrect });

describe("scorePolytomousPlusMinus (NCSBN +/- rule, score-on-select-only)", () => {
  // 3 correct, 2 distractors. Max = 3 (number of correct options).
  const options: Option[] = [
    opt("a", true),
    opt("b", true),
    opt("c", false),
    opt("d", false),
    opt("e", true),
  ];

  it("awards full points when every correct option is chosen and no distractors", () => {
    const r = scorePolytomousPlusMinus(options, ["a", "b", "e"]);
    expect(r.awardedPoints).toBe(3);
    expect(r.maxPoints).toBe(3);
    expect(r.isFullyCorrect).toBe(true);
  });

  it("awards zero when nothing is selected (no penalty for inaction)", () => {
    const r = scorePolytomousPlusMinus(options, []);
    expect(r.awardedPoints).toBe(0);
    expect(r.isFullyCorrect).toBe(false);
  });

  it("partial credit: some correct selected, no distractors", () => {
    // a (+1), b (+1), e missed (0) = 2
    const r = scorePolytomousPlusMinus(options, ["a", "b"]);
    expect(r.awardedPoints).toBe(2);
    expect(r.maxPoints).toBe(3);
    expect(r.isFullyCorrect).toBe(false);
  });

  it("subtracts a point for each distractor chosen", () => {
    // a (+1), b (+1), c (-1), e missed (0) = 1
    const r = scorePolytomousPlusMinus(options, ["a", "b", "c"]);
    expect(r.awardedPoints).toBe(1);
  });

  it("floors at zero when distractors outweigh correct selections", () => {
    // c (-1), d (-1) = -2 -> 0
    const r = scorePolytomousPlusMinus(options, ["c", "d"]);
    expect(r.awardedPoints).toBe(0);
  });

  it("does NOT penalize missed-correct (only selections score)", () => {
    // a (+1), no penalty for missing b or e
    const r = scorePolytomousPlusMinus(options, ["a"]);
    expect(r.awardedPoints).toBe(1);
    expect(r.isFullyCorrect).toBe(false);
  });

  it("ignores phantom ids that are not in the option list", () => {
    const r = scorePolytomousPlusMinus(options, ["a", "b", "e", "phantom"]);
    expect(r.awardedPoints).toBe(3);
    expect(r.isFullyCorrect).toBe(true);
  });

  it("handles all-correct option set (max = number of correct = all)", () => {
    const allCorrect: Option[] = [opt("a", true), opt("b", true)];
    expect(scorePolytomousPlusMinus(allCorrect, ["a", "b"])).toMatchObject({
      awardedPoints: 2,
      maxPoints: 2,
      isFullyCorrect: true,
    });
    // Choosing one out of two correct: +1, no penalty for missing the other
    expect(scorePolytomousPlusMinus(allCorrect, ["a"])).toMatchObject({
      awardedPoints: 1,
      maxPoints: 2,
      isFullyCorrect: false,
    });
  });
});
