/**
 * Lightweight session state — in-memory React state plus a localStorage
 * mirror so a paused session resumes cleanly. Will move to IndexedDB and a
 * proper attempts table when content authoring goes live.
 */

export interface SessionAttempt {
  questionId: string;
  /** ID(s) of the option(s) selected, in selection order. */
  selected: string[];
  isCorrect: boolean;
  awardedPoints: number;
  maxPoints: number;
  timeSpentMs: number;
  shuffleSeed: string;
  submittedAt: number;
}

export interface SessionState {
  /** Stable session id; used as the shuffle-seed root for replayability. */
  id: string;
  startedAt: number;
  endedAt: number | null;
  index: number;
  attempts: SessionAttempt[];
}

export function makeSessionId(): string {
  // YYYY-MM-DD-<random> — date prefix makes "today's session" greppable
  const today = new Date().toISOString().slice(0, 10);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${today}-${rand}`;
}

const STORAGE_KEY = "neclex:current-session";

export function loadSession(): SessionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionState;
    if (!parsed?.id) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(state: SessionState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* localStorage full or disabled — fall through, session lives in memory */
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
