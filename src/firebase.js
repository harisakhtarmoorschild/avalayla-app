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
