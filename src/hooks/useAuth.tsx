
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
      
      if (unsubscribeFromProfile) {
        unsubscribeFromProfile();
        unsubscribeFromProfile = undefined;
      }
      
      if (user) {
        setUser(user);
        const userRef = doc(db, 'users', user.uid);
        
        unsubscribeFromProfile = onSnapshot(userRef, async (userSnap) => {
          if (userSnap.exists()) {
            setUserProfile(userSnap.data() as UserProfile);
            setLoading(false);
          } else {
            // User exists in Auth, but not in Firestore. Create the profile.
            try {
              const newUserProfile: UserProfile = {
                uid: user.uid,
                phoneNumber: user.phoneNumber || '',
                isAdmin: false, // Default isAdmin to false
                createdAt: serverTimestamp() as any,
              };
              await setDoc(userRef, newUserProfile);
              // The snapshot listener will automatically pick up the new profile,
              // so we don't need to setLoading(false) here, it will happen
              // in the next snapshot trigger.
            } catch (error) {
              console.error("Firebase error creating user profile:", error);
              // If creation fails, log out the user to prevent an inconsistent state
              setUser(null);
              setUserProfile(null);
              setLoading(false);
            }
          }
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
