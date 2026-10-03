import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  signInAnonymously,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocFromServer,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from 'firebase/firestore';
import config from '../../firebase-applet-config.json';
import { 
  UserVehicleRecord, 
  UserApplicationTracker, 
  UserChecklistState,
  ContactSubmission,
  WomenBusCardApplication 
} from '../types';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with custom databaseId if configured
const databaseId = config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
  ? config.firestoreDatabaseId
  : undefined;

export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);

// Test Firestore Connection
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// Standardized Error Handler
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
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
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// Authentication Helpers
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Sync user profile to Firestore
    if (result.user) {
      await syncUserProfile(result.user);
    }
    return result.user;
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signInGuest = async () => {
  try {
    const result = await signInAnonymously(auth);
    if (result.user) {
      await syncUserProfile(result.user, 'Citizen Guest');
    }
    return result.user;
  } catch (error: any) {
    console.error('Error signing in as guest:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Sync User Profile in Firestore
export const syncUserProfile = async (user: User, customName?: string) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    
    const profileData = {
      uid: user.uid,
      email: user.email || (user.isAnonymous ? 'guest@citizen.demo' : null),
      displayName: user.displayName || customName || (user.isAnonymous ? 'Citizen (Guest)' : 'Citizen User'),
      photoURL: user.photoURL || null,
      isAnonymous: user.isAnonymous,
      lastLoginAt: new Date().toISOString(),
      updatedAt: serverTimestamp()
    };

    if (!snap.exists()) {
      await setDoc(userRef, {
        ...profileData,
        createdAt: new Date().toISOString(),
        bookmarks: ['fastag-recharge', 'pan-card-new', 'driving-license'],
        savedVehiclesCount: 1
      });

      // Seed initial sample vehicle in Firestore for the new user
      const defaultVehicleRef = doc(collection(db, 'users', user.uid, 'vehicles'), 'default-veh-1');
      await setDoc(defaultVehicleRef, {
        id: 'default-veh-1',
        vehicleNumber: 'MH 12 AB 1234',
        vehicleType: 'Car',
        nickname: 'My Daily Swift',
        ownerName: user.displayName || 'Citizen Profile',
        model: 'Maruti Suzuki Swift ZXi',
        registrationDate: '15-Mar-2021',
        rcValidity: '14-Mar-2036 (Active)',
        insuranceValidity: '10-Nov-2026',
        insuranceProvider: 'ICICI Lombard Motor Comprehensive',
        pucValidity: '22-Dec-2026 (Valid)',
        fastagTagId: '3416-8912-4521-9981',
        fastagBalance: 450.00,
        fastagBank: 'State Bank of India FASTag',
        notes: 'Highway toll & annual service due in Dec',
        updatedAt: new Date().toISOString()
      });
    } else {
      await updateDoc(userRef, profileData);
    }
  } catch (err) {
    console.error('Error syncing user profile:', err);
  }
};

// ----------------- FIRESTORE DATA HOOKS & HELPERS -----------------

// 1. User Bookmarks / Starred Services
export const getUserBookmarks = async (userId: string): Promise<string[]> => {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists() && snap.data().bookmarks) {
      return snap.data().bookmarks;
    }
    return [];
  } catch (err) {
    console.error('Error fetching user bookmarks:', err);
    return [];
  }
};

export const toggleUserBookmark = async (userId: string, serviceId: string, currentBookmarks: string[]) => {
  try {
    const userRef = doc(db, 'users', userId);
    let newBookmarks: string[];
    if (currentBookmarks.includes(serviceId)) {
      newBookmarks = currentBookmarks.filter((id) => id !== serviceId);
    } else {
      newBookmarks = [...currentBookmarks, serviceId];
    }
    await setDoc(userRef, { bookmarks: newBookmarks }, { merge: true });
    return newBookmarks;
  } catch (err) {
    console.error('Error updating bookmarks in Firestore:', err);
    throw err;
  }
};

// 2. User Checklist Progress
export const getServiceChecklist = async (userId: string, serviceId: string): Promise<string[]> => {
  try {
    const docRef = doc(db, 'users', userId, 'checklists', serviceId);
    const snap = await getDoc(docRef);
    if (snap.exists() && snap.data().checkedDocs) {
      return snap.data().checkedDocs;
    }
    return [];
  } catch (err) {
    console.error('Error fetching checklist progress:', err);
    return [];
  }
};

export const saveServiceChecklist = async (userId: string, serviceId: string, checkedDocs: string[]) => {
  try {
    const docRef = doc(db, 'users', userId, 'checklists', serviceId);
    await setDoc(docRef, {
      serviceId,
      checkedDocs,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error saving checklist in Firestore:', err);
  }
};

// 3. User Vehicles (CRUD with Realtime Snapshot)
export const subscribeUserVehicles = (userId: string, onUpdate: (vehicles: UserVehicleRecord[]) => void) => {
  const colRef = collection(db, 'users', userId, 'vehicles');
  return onSnapshot(colRef, (snapshot) => {
    const list: UserVehicleRecord[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ ...docSnap.data(), id: docSnap.id } as UserVehicleRecord);
    });
    onUpdate(list);
  }, (err) => {
    console.error('Error subscribing to vehicles:', err);
  });
};

export const saveUserVehicle = async (userId: string, vehicle: UserVehicleRecord) => {
  try {
    const docId = vehicle.id || `veh-${Date.now()}`;
    const docRef = doc(db, 'users', userId, 'vehicles', docId);
    const payload = {
      ...vehicle,
      id: docId,
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, payload);
    return docId;
  } catch (err) {
    console.error('Error saving vehicle in Firestore:', err);
    throw err;
  }
};

export const deleteUserVehicle = async (userId: string, vehicleId: string) => {
  try {
    const docRef = doc(db, 'users', userId, 'vehicles', vehicleId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting vehicle in Firestore:', err);
    throw err;
  }
};

// FASTag Recharge Simulation in Firestore
export const rechargeVehicleFastag = async (userId: string, vehicleId: string, addedAmount: number, currentBalance: number) => {
  try {
    const docRef = doc(db, 'users', userId, 'vehicles', vehicleId);
    const newBalance = currentBalance + addedAmount;
    await updateDoc(docRef, {
      fastagBalance: newBalance,
      updatedAt: new Date().toISOString()
    });
    return newBalance;
  } catch (err) {
    console.error('Error updating fastag balance:', err);
    throw err;
  }
};

// 4. User Applications Tracker (e.g. Passport Ref, DL Application, PAN Acknowledgement)
export const subscribeUserApplications = (userId: string, onUpdate: (apps: UserApplicationTracker[]) => void) => {
  const colRef = collection(db, 'users', userId, 'applications');
  return onSnapshot(colRef, (snapshot) => {
    const list: UserApplicationTracker[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ ...docSnap.data(), id: docSnap.id } as UserApplicationTracker);
    });
    onUpdate(list);
  }, (err) => {
    console.error('Error subscribing to user applications:', err);
  });
};

export const saveUserApplication = async (userId: string, appData: Partial<UserApplicationTracker>) => {
  try {
    const docId = appData.id || `app-${Date.now()}`;
    const docRef = doc(db, 'users', userId, 'applications', docId);
    const payload: UserApplicationTracker = {
      id: docId,
      serviceId: appData.serviceId || 'general',
      serviceTitle: appData.serviceTitle || 'Government Portal Application',
      applicationNumber: appData.applicationNumber || `ACK-${Math.floor(100000 + Math.random() * 900000)}`,
      portalName: appData.portalName || 'Official Portal',
      appliedDate: appData.appliedDate || new Date().toISOString().split('T')[0],
      status: appData.status || 'Submitted',
      appointmentDate: appData.appointmentDate || '',
      appointmentLocation: appData.appointmentLocation || '',
      notes: appData.notes || '',
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, payload);
    return docId;
  } catch (err) {
    console.error('Error saving application tracker:', err);
    throw err;
  }
};

export const deleteUserApplication = async (userId: string, appId: string) => {
  try {
    const docRef = doc(db, 'users', userId, 'applications', appId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting application:', err);
    throw err;
  }
};

// 5. Submit Inquiry / Feedback to Firestore
export const logInquiryToFirestore = async (submission: Partial<ContactSubmission>) => {
  try {
    const id = submission.id || `ESH-${Date.now()}`;
    const docRef = doc(db, 'inquiries', id);
    const payload = {
      ...submission,
      id,
      createdAt: new Date().toISOString(),
      status: 'Received'
    };
    await setDoc(docRef, payload);
    return id;
  } catch (err) {
    console.error('Error saving feedback in Firestore:', err);
    return null;
  }
};

// 6. User Citizen Profile and Preferences in Firestore
export interface CitizenProfileData {
  uid: string;
  displayName?: string;
  email?: string | null;
  phoneNumber?: string;
  state?: string;
  preferredLanguage?: 'en' | 'mr' | 'hi';
  bookmarks?: string[];
  savedVehiclesCount?: number;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: any;
}

export const updateUserCitizenProfile = async (userId: string, data: Partial<CitizenProfileData>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Error updating citizen profile in Firestore:', err);
    throw err;
  }
};

export const fetchUserCitizenProfile = async (userId: string): Promise<CitizenProfileData | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as CitizenProfileData;
    }
    return null;
  } catch (err) {
    console.error('Error fetching citizen profile:', err);
    return null;
  }
};

// 7. Women Bus Card Firestore Sync & Local Fallback
export const subscribeUserWomenBusCards = (
  userId: string,
  onUpdate: (cards: WomenBusCardApplication[]) => void
) => {
  const colRef = collection(db, 'users', userId, 'womenBusCards');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: WomenBusCardApplication[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as WomenBusCardApplication);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn('Fallback: reading bus cards from local storage due to error:', err);
    }
  );
};

export const saveUserWomenBusCard = async (
  userId: string,
  cardData: WomenBusCardApplication
): Promise<string> => {
  try {
    const cardDocId = cardData.id || `WBC-${Date.now()}`;
    const docRef = doc(db, 'users', userId, 'womenBusCards', cardDocId);
    const payload = {
      ...cardData,
      id: cardDocId,
      userId,
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, payload, { merge: true });
    return cardDocId;
  } catch (err) {
    console.error('Error saving Women Bus Card in Firestore:', err);
    throw err;
  }
};

export const renewWomenBusCard = async (
  userId: string,
  cardId: string,
  additionalYears: number = 2
): Promise<{ validUntil: string; status: 'Approved' }> => {
  try {
    const docRef = doc(db, 'users', userId, 'womenBusCards', cardId);
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + additionalYears);
    const day = String(futureDate.getDate()).padStart(2, '0');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const validUntil = `${day}-${months[futureDate.getMonth()]}-${futureDate.getFullYear()}`;

    await updateDoc(docRef, {
      status: 'Approved',
      validUntil,
      updatedAt: new Date().toISOString()
    });

    return { validUntil, status: 'Approved' };
  } catch (err) {
    console.error('Error renewing Women Bus Card in Firestore:', err);
    throw err;
  }
};

export const deleteUserWomenBusCard = async (userId: string, cardId: string) => {
  try {
    const docRef = doc(db, 'users', userId, 'womenBusCards', cardId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting Women Bus Card in Firestore:', err);
    throw err;
  }
};


