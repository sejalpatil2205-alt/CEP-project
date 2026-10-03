import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  auth, 
  signInWithGoogle, 
  signInGuest, 
  logout, 
  getUserBookmarks, 
  toggleUserBookmark,
  syncUserProfile 
} from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  bookmarks: string[];
  isBookmarked: (serviceId: string) => boolean;
  toggleBookmark: (serviceId: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginGuest: () => Promise<void>;
  logoutUser: () => Promise<void>;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await syncUserProfile(currentUser);
          const userBookmarks = await getUserBookmarks(currentUser.uid);
          setBookmarks(userBookmarks);
        } catch (e) {
          console.error('Error fetching user data on auth state change:', e);
        }
      } else {
        // Load local bookmarks for unauthenticated users as fallback
        const localSaved = localStorage.getItem('esh_bookmarks');
        if (localSaved) {
          try {
            setBookmarks(JSON.parse(localSaved));
          } catch {
            setBookmarks([]);
          }
        } else {
          setBookmarks(['fastag-recharge', 'pan-card-new']);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleBookmark = async (serviceId: string) => {
    if (user) {
      try {
        const updated = await toggleUserBookmark(user.uid, serviceId, bookmarks);
        setBookmarks(updated);
      } catch (err) {
        console.error('Failed to toggle bookmark in Firestore:', err);
      }
    } else {
      // Local fallback if not logged in
      let updated: string[];
      if (bookmarks.includes(serviceId)) {
        updated = bookmarks.filter((id) => id !== serviceId);
      } else {
        updated = [...bookmarks, serviceId];
      }
      setBookmarks(updated);
      localStorage.setItem('esh_bookmarks', JSON.stringify(updated));
    }
  };

  const isBookmarked = (serviceId: string) => {
    return bookmarks.includes(serviceId);
  };

  const handleLoginWithGoogle = async () => {
    try {
      setAuthError(null);
      await signInWithGoogle();
      setAuthModalOpen(false);
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setAuthError(err?.message || 'Google Sign-In was cancelled or encountered an error.');
    }
  };

  const handleLoginGuest = async () => {
    try {
      setAuthError(null);
      await signInGuest();
      setAuthModalOpen(false);
    } catch (err: any) {
      console.error('Guest Sign-In failed:', err);
      setAuthError(err?.message || 'Guest Sign-In encountered an error.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setBookmarks([]);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        bookmarks,
        isBookmarked,
        toggleBookmark: handleToggleBookmark,
        loginWithGoogle: handleLoginWithGoogle,
        loginGuest: handleLoginGuest,
        logoutUser: handleLogout,
        authModalOpen,
        setAuthModalOpen,
        authError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
