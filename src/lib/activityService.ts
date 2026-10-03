import { db, updateUserCitizenProfile } from './firebase';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { UserActivityItem, EService, ServiceCategory } from '../types';
import { SERVICES_DATA } from '../data/servicesData';

const STORAGE_KEY = 'services_india_recent_activities';
const MAX_SAVED_ACTIVITIES = 15;
const LISTENERS: Array<(activities: UserActivityItem[]) => void> = [];

// Helper to notify in-memory subscribers across tabs/components
const notifyListeners = (activities: UserActivityItem[]) => {
  LISTENERS.forEach((cb) => {
    try {
      cb(activities);
    } catch (err) {
      console.error('Error in activity subscriber:', err);
    }
  });
};

/**
 * Get cached local recent activities
 */
export const getLocalActivities = (): UserActivityItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to read recent activities from storage:', err);
    return [];
  }
};

/**
 * Save to localStorage and notify listeners
 */
const saveLocalActivities = (activities: UserActivityItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities.slice(0, MAX_SAVED_ACTIVITIES)));
    notifyListeners(activities.slice(0, 5));
  } catch (err) {
    console.error('Failed to save activities to storage:', err);
  }
};

/**
 * Automatically records a service access in the user's dashboard history.
 * Deduplicates by serviceId so the most recently accessed service is always at index 0.
 */
export const recordServiceAccess = async (
  service: {
    id: string;
    title?: string;
    category?: ServiceCategory;
    shortDescription?: string;
    department?: string;
    officialUrl?: string;
  },
  userId?: string | null,
  actionType: UserActivityItem['actionType'] = 'view_details'
): Promise<UserActivityItem[]> => {
  try {
    // If details are missing, look them up in SERVICES_DATA
    const fullService = SERVICES_DATA.find((s) => s.id === service.id || s.slug === service.id);
    const serviceId = fullService?.id || service.id;
    const title = fullService?.title || service.title || 'Government Service';
    const category: ServiceCategory = fullService?.category || service.category || 'Government';
    const shortDesc = fullService?.shortDescription || service.shortDescription || '';
    const dept = fullService?.department || service.department || '';
    const official = fullService?.officialUrl || service.officialUrl || '';

    const newActivity: UserActivityItem = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      serviceId,
      serviceTitle: title,
      category,
      shortDescription: shortDesc,
      department: dept,
      officialUrl: official,
      accessedAt: new Date().toISOString(),
      actionType
    };

    // Update local cache first
    const existing = getLocalActivities();
    // Filter out previous occurrences of the exact same service so it re-promotes to the top
    const filtered = existing.filter((item) => item.serviceId !== serviceId);
    const updated = [newActivity, ...filtered].slice(0, MAX_SAVED_ACTIVITIES);

    saveLocalActivities(updated);

    // If citizen is logged in, sync to Firestore
    if (userId) {
      try {
        const userRef = doc(db, 'users', userId);
        await setDoc(
          userRef,
          {
            recentActivity: updated,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      } catch (fbErr) {
        console.warn('Could not sync recent activity to Firestore:', fbErr);
      }
    }

    return updated.slice(0, 5);
  } catch (err) {
    console.error('Error recording service access:', err);
    return getLocalActivities().slice(0, 5);
  }
};

/**
 * Returns the last 5 services a user has accessed
 */
export const getLastFiveActivities = (): UserActivityItem[] => {
  return getLocalActivities().slice(0, 5);
};

/**
 * Subscribe to recent activities (combines local storage & Firestore realtime listener)
 */
export const subscribeRecentActivities = (
  userId: string | null | undefined,
  callback: (activities: UserActivityItem[]) => void
): (() => void) => {
  // Initial fire with local cache
  callback(getLastFiveActivities());

  // Register in local listeners
  LISTENERS.push(callback);

  let unsubscribeFirestore: (() => void) | null = null;

  if (userId) {
    try {
      const userRef = doc(db, 'users', userId);
      unsubscribeFirestore = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.recentActivity)) {
            saveLocalActivities(data.recentActivity);
            callback(data.recentActivity.slice(0, 5));
          }
        }
      }, (err) => {
        console.warn('Firestore recentActivity snapshot warning:', err);
      });
    } catch (e) {
      console.warn('Failed to attach Firestore activity listener:', e);
    }
  }

  return () => {
    const idx = LISTENERS.indexOf(callback);
    if (idx !== -1) LISTENERS.splice(idx, 1);
    if (unsubscribeFirestore) unsubscribeFirestore();
  };
};

/**
 * Clear the citizen's recent activity log
 */
export const clearUserRecentActivity = async (userId?: string | null): Promise<void> => {
  saveLocalActivities([]);
  if (userId) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, { recentActivity: [] }, { merge: true });
    } catch (err) {
      console.error('Failed to clear activity in Firestore:', err);
    }
  }
};

/**
 * Seed initial sample demo activities if the user's dashboard is completely new
 */
export const seedSampleActivities = async (userId?: string | null): Promise<UserActivityItem[]> => {
  const samples = [
    { id: 'fastag-recharge', action: 'recharge' as const },
    { id: 'echallan-payment', action: 'challan_check' as const },
    { id: 'pmmvy-maternity-benefit', action: 'scheme_apply' as const },
    { id: 'driving-license-sarathi', action: 'view_details' as const },
    { id: 'sukanya-samriddhi-yojana', action: 'view_details' as const }
  ];

  for (const s of samples) {
    await recordServiceAccess({ id: s.id }, userId, s.action);
  }

  return getLastFiveActivities();
};
