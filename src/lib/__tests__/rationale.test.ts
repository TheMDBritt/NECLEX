import { describe, expect, it } from "vitest";
import { scoreRationaleSection } from "../scoring/rationale";
import type { Option } from "../types/question";

const opt = (id: string, isCorrect: boolean): Option => ({ id, label: id, isCorrect });

describe("scoreRationaleSection (NGN linked all-or-nothing)", () => {
  const opts: Option[] = [opt("a", true), opt("b", false), opt("c", true), opt("d", false)];

  it("awards 1 when selection exactly matches correct set", () => {
    expect(scoreRationaleSection(opts, ["a", "c"])).toMatchObject({ awarded: 1, isFullyCorrect: true });
  });

  it("awards 0 when one correct option is missed", () => {
    expect(scoreRationaleSection(opts, ["a"])).toMatchObject({ awarded: 0, isFullyCorrect: false });
  });

  it("awards 0 when an extra distractor is selected", () => {
    expect(scoreRationaleSection(opts, ["a", "c", "b"])).toMatchObject({ awarded: 0 });
  });

  it("awards 0 when nothing is selected", () => {
    expect(scoreRationaleSection(opts, [])).toMatchObject({ awarded: 0 });
  });

  it("ignores selection order", () => {
    expect(scoreRationaleSection(opts, ["c", "a"])).toMatchObject({ awarded: 1, isFullyCorrect: true });
  });

  it("works for single-correct sections (e.g. bow-tie condition)", () => {
    const single: Option[] = [opt("x", true), opt("y", false), opt("z", false)];
    expect(scoreRationaleSection(single, ["x"])).toMatchObject({ awarded: 1, isFullyCorrect: true });
    expect(scoreRationaleSection(single, ["y"])).toMatchObject({ awarded: 0 });
  });
});
