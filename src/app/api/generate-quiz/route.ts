import { NextResponse } from "next/server";
import { generateQuizFromNotes } from "@/lib/quiz/generate-from-notes";
import type { ItemType } from "@/lib/types/question";

export const runtime = "nodejs";
export const maxDuration = 300;

const VALID_TYPES: ItemType[] = [
  "multiple_choice",
  "multiple_response",
  "fill_in_the_blank",
  "bow_tie",
];

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { notes, itemTypes, count } = (body ?? {}) as {
    notes?: unknown;
    itemTypes?: unknown;
    count?: unknown;
  };

  if (typeof notes !== "string" || notes.trim().length === 0) {
    return NextResponse.json(
      { error: "Paste or upload some notes first." },
      { status: 400 },
    );
  }

  const requestedTypes = Array.isArray(itemTypes)
    ? itemTypes.filter((t): t is ItemType =>
        VALID_TYPES.includes(t as ItemType),
      )
    : [];
  if (requestedTypes.length === 0) {
    return NextResponse.json(
      { error: "Pick at least one question type." },
      { status: 400 },
    );
  }

  const requestedCount = typeof count === "number" ? count : Number(count);
  if (!Number.isFinite(requestedCount) || requestedCount < 1) {
    return NextResponse.json(
      { error: "Pick how many questions you want (1–100)." },
      { status: 400 },
    );
  }

  try {
    const questions = await generateQuizFromNotes({
      notes,
      itemTypes: requestedTypes,
      count: Math.min(100, Math.floor(requestedCount)),
    });
    return NextResponse.json({ questions });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong generating the quiz.";
    console.error("[generate-quiz] route failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
