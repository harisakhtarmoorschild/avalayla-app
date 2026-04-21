import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDR-73wZQcSGD24BQX96cchCtMgBq7dZDc",
  authDomain: "avalaylalearn.firebaseapp.com",
  projectId: "avalaylalearn",
  storageBucket: "avalaylalearn.firebasestorage.app",
  messagingSenderId: "151322580479",
  appId: "1:151322580479:web:3517736255201dbc26c3ca"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

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
    await setDoc(ref, partial, { merge: true });
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
    await setDoc(ref, clean);
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
    await setDoc(ref, story);
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
    await setDoc(ref, lesson);
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
    await setDoc(ref, patch, { merge: true });
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
    await setDoc(ref, { inProgress: inProg }, { merge: true });
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
