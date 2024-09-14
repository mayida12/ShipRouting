import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export async function createOrGetSession() {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('sessionId', sessionId);
    await setDoc(doc(db, 'sessions', sessionId), { createdAt: new Date() });
  }
  return sessionId;
}

export async function saveSessionData(sessionId: string, data: any) {
  await setDoc(doc(db, 'sessions', sessionId), data, { merge: true });
}

export async function getSessionData(sessionId: string) {
  const docRef = doc(db, 'sessions', sessionId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}