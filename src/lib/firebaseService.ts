import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { SurpiseConfig } from '../types';
import { getInitialConfig } from '../data';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Fetch user surprise config or create it if not exists
export async function getSurpriseConfig(userId: string): Promise<SurpiseConfig> {
  const path = `surprises/${userId}`;
  try {
    const docRef = doc(db, 'surprises', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as SurpiseConfig;
    } else {
      const initialConfig = getInitialConfig(userId);
      await setDoc(docRef, initialConfig);
      return initialConfig;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Save surprise config permanently to Firestore
export async function saveSurpriseConfig(userId: string, config: SurpiseConfig): Promise<void> {
  const path = `surprises/${userId}`;
  try {
    const docRef = doc(db, 'surprises', userId);
    await setDoc(docRef, { ...config, userId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

