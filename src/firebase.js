import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  waitForPendingWrites,
  doc, getDoc, setDoc, onSnapshot
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDR-73wZQcSGD24BQX96cchCtMgBq7dZDc",
  authDomain: "avalaylalearn.firebaseapp.com",
  projectId: "avalaylalearn",
  storageBucket: "avalaylalearn.firebasestorage.app",
  messagingSenderId: "151322580479",
  appId: "1:151322580479:web:3517736255201dbc26c3ca"
};

const app = initializeApp(firebaseConfig);

// Durable Firestore client:
//   - persistentLocalCache stores reads in IndexedDB so the app keeps
//     working through network blips and feels instant.
//   - It also queues writes locally. If a kid closes the tab or the iPad
//     goes to sleep mid-save, the write is replayed when the app reopens
//     — no more "I did this work already, why is it gone?"
//   - persistentMultipleTabManager makes this safe when two iPads/tabs
//     hit the cache concurrently.
// If the browser refuses persistence (very old Safari, private window
// with cookies disabled, etc.), initializeFirestore falls back to memory
// cache for that session.
let _db;
try {
  _db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch (e) {
  // initializeFirestore throws if called twice (e.g. HMR), or if the
  // browser refuses IndexedDB. Fall back to the in-memory/default client
  // so the app still works (just without offline cache for this session).
  console.warn('persistent cache unavailable, falling back', e && e.message);
  _db = getFirestore(app);
}
export const db = _db;

// --- Resilient write helper ---
// Firestore's persistent cache already retries internally, but we add a
// thin retry loop on top of setDoc itself so caller errors (transient
// 503s, brief offline-but-no-cache) don't bubble up to the kid as a
// silent failure. Each write is attempted up to 3 times with exponential
// backoff (200ms, 800ms, 3.2s), then logged if all attempts fail.
async function setDocWithRetry(ref, data, options) {
  const delays = [200, 800, 3200];
  let lastErr;
  for (let i = 0; i <= delays.length; i++) {
    try {
      if (options) await setDoc(ref, data, options);
      else await setDoc(ref, data);
      return;
    } catch (e) {
      lastErr = e;
      if (i < delays.length) {
        await new Promise(r => setTimeout(r, delays[i]));
      }
    }
  }
  console.error('setDoc failed after retries', ref.path, lastErr);
  throw lastErr;
}

// Best-effort flush on background/close. The persistent cache already
// keeps writes durable through tab close, but flushing here makes the
// pending-writes indicator settle and shortens the gap between "kid
// finishes activity" and "data is in Firestore".
if (typeof window !== 'undefined') {
  const flush = () => {
    try { waitForPendingWrites(_db).catch(() => {}); } catch (_) {}
  };
  window.addEventListener('pagehide', flush);
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
}

export async function loadProgress(name) {
  try {
    const ref = doc(db, 'progress', name);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : {};
  } catch (e) { console.error('loadProgress', e); return {}; }
}
export async function saveProgress(name, partial) {
  try {
    const ref = doc(db, 'progress', name);
    await setDocWithRetry(ref, partial, { merge: true });
  } catch (e) { console.error('saveProgress', e); }
}
export function subscribeProgress(name, callback) {
  const ref = doc(db, 'progress', name);
  return onSnapshot(ref, (snap) => callback(snap.exists() ? snap.data() : {}), (err) => console.error(err));
}

// Scrub legacy corrupted keys from a user's progress doc.
// Keeps only keys that match /^day\d+$/ plus 'inProgress'. Also coerces any
// non-numeric activity scores inside valid day entries to numbers (0).
// Also fixes day entries that might contain nested objects for activities.
// Returns a summary of what was removed.
export async function cleanProgress(name) {
  try {
    const ref = doc(db, 'progress', name);
    const snap = await getDoc(ref);
    if (!snap.exists()) return { removedKeys: [], fixedValues: 0 };
    const data = snap.data() || {};
    const clean = {};
    const removedKeys = [];
    let fixedValues = 0;
    const ACTIVITY_KEYS = ['spelling','vocab','writing','math','reading','puzzles','history','geography','science'];

    for (const key in data) {
      if (key === 'inProgress') {
        clean.inProgress = data.inProgress;
        continue;
      }
      if (/^day\d+$/.test(key)) {
        const day = data[key];
        if (!day || typeof day !== 'object') { removedKeys.push(key); continue; }
        const cleanDay = {};
        for (const k in day) {
          if (ACTIVITY_KEYS.includes(k)) {
            const v = day[k];
            if (typeof v === 'number' && !isNaN(v)) cleanDay[k] = v;
            else if (typeof v === 'string' && !isNaN(parseFloat(v))) { cleanDay[k] = parseFloat(v); fixedValues++; }
            else { fixedValues++; /* skip: object or bad data */ }
          } else {
            // meta fields like "spelling_meta", "ts" — keep if not an error
            cleanDay[k] = day[k];
          }
        }
        clean[key] = cleanDay;
      } else {
        removedKeys.push(key);
      }
    }
    // Overwrite document (not merge — we want to remove the bad keys)
    await setDocWithRetry(ref, clean);
    return { removedKeys, fixedValues };
  } catch (e) {
    console.error('cleanProgress', e);
    return { error: e.message || 'unknown error' };
  }
}

// Shared story cache — both sisters see the same story per day
export async function getCachedStory(day) {
  try {
    const ref = doc(db, 'stories', `day${day}`);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (e) { console.error(e); return null; }
}
export async function cacheStory(day, story) {
  try {
    const ref = doc(db, 'stories', `day${day}`);
    await setDocWithRetry(ref, story);
  } catch (e) { console.error(e); }
}

// v3: Shared lesson cache — both sisters see the same subject lesson per day
export async function getCachedLesson(subject, day) {
  try {
    const ref = doc(db, 'lessons', `${subject}-day${day}`);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (e) { console.error(e); return null; }
}
export async function cacheLesson(subject, day, lesson) {
  try {
    const ref = doc(db, 'lessons', `${subject}-day${day}`);
    await setDocWithRetry(ref, lesson);
  } catch (e) { console.error(e); }
}

// v3.2: In-progress state (save & resume).
// Stored under progress/<user> as { inProgress: { spelling: {...}, math: {...} } }
// Kept inside the same progress doc so we don't need a new collection.
export async function saveInProgress(name, activity, state) {
  try {
    const ref = doc(db, 'progress', name);
    // Use dot-path so we only touch the one activity's sub-object
    const patch = { inProgress: { [activity]: { ...state, savedAt: Date.now() } } };
    await setDocWithRetry(ref, patch, { merge: true });
  } catch (e) { console.error('saveInProgress', e); }
}

export async function loadInProgress(name, activity) {
  try {
    const ref = doc(db, 'progress', name);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    const inProg = data && data.inProgress && data.inProgress[activity];
    return inProg || null;
  } catch (e) { console.error('loadInProgress', e); return null; }
}

export async function clearInProgress(name, activity) {
  try {
    const ref = doc(db, 'progress', name);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const data = snap.data() || {};
    const inProg = { ...(data.inProgress || {}) };
    delete inProg[activity];
    await setDocWithRetry(ref, { inProgress: inProg }, { merge: true });
  } catch (e) { console.error('clearInProgress', e); }
}

// Load all in-progress activities for a user (for Home screen indicators)
export async function loadAllInProgress(name) {
  try {
    const ref = doc(db, 'progress', name);
    const snap = await getDoc(ref);
    if (!snap.exists()) return {};
    const data = snap.data() || {};
    return data.inProgress || {};
  } catch (e) { console.error('loadAllInProgress', e); return {}; }
}
