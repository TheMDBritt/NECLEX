/**
 * Per-song voice-recording store, backed by IndexedDB.
 *
 * The user records herself singing/rapping the lyrics over the beat. The
 * recording is saved as an audio Blob keyed by song id. Playback layers her
 * vocal over the beat instead of TTS reading the lyrics.
 *
 * IndexedDB is used because localStorage can't hold binary audio cleanly.
 */

const DB_NAME = "neclex-voice";
const STORE = "recordings";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveVoiceRecording(songId: string, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, songId);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function getVoiceRecording(songId: string): Promise<Blob | null> {
  let db: IDBDatabase;
  try {
    db = await openDB();
  } catch {
    return null;
  }
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(songId);
    req.onsuccess = () => {
      db.close();
      const value = req.result;
      resolve(value instanceof Blob ? value : null);
    };
    req.onerror = () => {
      db.close();
      resolve(null);
    };
  });
}

export async function deleteVoiceRecording(songId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(songId);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export function isVoiceRecordingSupported(): boolean {
  if (typeof window === "undefined") return false;
  return (
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function" &&
    typeof window.MediaRecorder === "function"
  );
}
