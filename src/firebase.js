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
  } catch (e) {
    console.error('loadProgress error', e);
    return {};
  }
}

export async function saveProgress(name, progressObject) {
  try {
    const ref = doc(db, 'progress', name);
    await setDoc(ref, progressObject, { merge: true });
  } catch (e) {
    console.error('saveProgress error', e);
  }
}

export function subscribeProgress(name, callback) {
  const ref = doc(db, 'progress', name);
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? snap.data() : {});
  }, (err) => {
    console.error('subscribe error', err);
  });
}
