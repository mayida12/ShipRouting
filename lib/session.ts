import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from './firebase';

interface SessionData {
  shipType?: string;
  departureDate?: string;
  startPort?: [number, number] | null;
  endPort?: [number, number] | null;
  optimizedRoute?: [number, number][];
  distance?: number;
  numSteps?: number;
  avgStepDistance?: number;
  shipDimensions?: {
    length: number;
    width: number;
    draft: number;
  };
}

export async function createOrGetSession(): Promise<string> {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    const functions = getFunctions(app);
    const createSession = httpsCallable<any, { session_id: string }>(functions, 'create_session');
    const result = await createSession();
    sessionId = result.data.session_id;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

export async function saveSessionData(sessionId: string, data: SessionData): Promise<void> {
  const functions = getFunctions(app);
  const updateSession = httpsCallable(functions, 'update_session');
  await updateSession({ session_id: sessionId, ...data });
}

export async function getSessionData(sessionId: string): Promise<SessionData> {
  const functions = getFunctions(app);
  const getSession = httpsCallable<{ session_id: string }, SessionData>(functions, 'get_session');
  const result = await getSession({ session_id: sessionId });
  return result.data;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const functions = getFunctions(app);
  const deleteSessionFunc = httpsCallable(functions, 'delete_session');
  await deleteSessionFunc({ session_id: sessionId });
  localStorage.removeItem('sessionId');
}