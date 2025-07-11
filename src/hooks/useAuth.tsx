
'use client';

import React, { useState, useEffect, useContext, createContext } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signOutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let unsubscribeFromProfile: Unsubscribe | undefined;

    const unsubscribeFromAuth = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      
      // If a user profile listener is active, unsubscribe from it
      if (unsubscribeFromProfile) {
        unsubscribeFromProfile();
        unsubscribeFromProfile = undefined;
      }
      
      if (user) {
        setUser(user);
        const userRef = doc(db, 'users', user.uid);
        
        // Set up a real-time listener for the user's profile
        unsubscribeFromProfile = onSnapshot(userRef, async (userSnap) => {
          if (userSnap.exists()) {
            setUserProfile(userSnap.data() as UserProfile);
          } else {
            // If the profile doesn't exist, create it. This usually happens on first login.
            try {
              const newUserProfile: UserProfile = {
                uid: user.uid,
                phoneNumber: user.phoneNumber || '',
                isAdmin: false, // Default to not admin
                createdAt: serverTimestamp() as any,
              };
              await setDoc(userRef, newUserProfile);
              // The snapshot listener will automatically pick up the newly created profile.
            } catch (error) {
              console.error("Firebase error creating user profile:", error);
              setUser(null);
              setUserProfile(null);
            }
          }
          setLoading(false);
        }, (error) => {
          console.error("Error with profile listener:", error);
          setUser(null);
          setUserProfile(null);
          setLoading(false);
        });

      } else {
        // No user is logged in
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });

    // Cleanup function: unsubscribe from both auth and profile listeners when the component unmounts
    return () => {
      unsubscribeFromAuth();
      if (unsubscribeFromProfile) {
        unsubscribeFromProfile();
      }
    };
  }, []);

  const signOutUser = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isAdmin = userProfile?.isAdmin || false;

  const value = { user, userProfile, loading, isAdmin, signOutUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
