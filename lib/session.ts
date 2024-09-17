import { getFunctions, httpsCallable, HttpsCallableResult } from "firebase/functions";
import { app } from './firebase';

export interface SessionData {
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

// Implement temporary memory
let tempSessionData: SessionData = {};

export async function createOrGetSession(): Promise<string> {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    const functions = getFunctions(app);
    const createSession = httpsCallable<any, { session_id: string }>(functions, 'create_session');
    try {
      const result: HttpsCallableResult<{ session_id: string }> = await createSession();
      sessionId = result.data.session_id;
      if (sessionId) {
        localStorage.setItem('sessionId', sessionId);
      } else {
        throw new Error("Failed to create session: No session_id returned");
      }
    } catch (error: any) {
      console.error("Error creating session:", error.message, error.details);
      throw error;
    }
  }
  return sessionId;
}

export async function saveSessionData(sessionId: string, data: Partial<SessionData>): Promise<void> {
  const functions = getFunctions(app);
  const updateSession = httpsCallable<{ session_id: string } & Partial<SessionData>, void>(functions, 'update_session');
  try {
    await updateSession({ session_id: sessionId, ...data });
    // Update temporary memory
    tempSessionData = { ...tempSessionData, ...data };
  } catch (error: any) {
    console.error("Error saving session data:", error.message, error.details);
    throw error;
  }
}

export async function getSessionData(sessionId: string): Promise<SessionData> {
  // First, check temporary memory
  if (Object.keys(tempSessionData).length > 0) {
    return tempSessionData;
  }

  const functions = getFunctions(app);
  const getSession = httpsCallable<{ session_id: string }, SessionData>(functions, 'get_session');
  try {
    const result: HttpsCallableResult<SessionData> = await getSession({ session_id: sessionId });
    // Update temporary memory
    tempSessionData = result.data;
    return result.data;
  } catch (error: any) {
    console.error("Error getting session data:", error.message, error.details);
    throw error;
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  const functions = getFunctions(app);
  const deleteSessionFunc = httpsCallable<{ session_id: string }, void>(functions, 'delete_session');
  try {
    await deleteSessionFunc({ session_id: sessionId });
    localStorage.removeItem('sessionId');
    // Clear temporary memory
    tempSessionData = {};
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
}

export function clearTempSessionData(): void {
  tempSessionData = {};
}