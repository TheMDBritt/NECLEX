/**
 * Per-song custom-beat URL store.
 *
 * The sandbox can't ship pre-licensed MP3s with the app (external audio
 * hosts are blocked here). Instead we let the learner paste her own
 * royalty-free MP3 URL per song — Pixabay, Free Music Archive, SoundCloud
 * downloads, anywhere — and the player uses it as the backing track with
 * her TTS lyrics on top.
 *
 * Storage is plain localStorage, keyed by song id, no server.
 */

const STORAGE_KEY = "neclex:custom-beats";

type Map = Record<string, string>;

function readAll(): Map {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Map;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(map: Map): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* localStorage unavailable */
  }
}

export function getCustomBeatUrl(songId: string): string | null {
  const all = readAll();
  return all[songId] ?? null;
}

export function setCustomBeatUrl(songId: string, url: string): void {
  const trimmed = url.trim();
  if (!trimmed) return clearCustomBeatUrl(songId);
  const all = readAll();
  all[songId] = trimmed;
  writeAll(all);
}

export function clearCustomBeatUrl(songId: string): void {
  const all = readAll();
  delete all[songId];
  writeAll(all);
}
