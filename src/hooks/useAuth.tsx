
'use client';

import React, { useState, useEffect, useContext, createContext } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

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
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        const userRef = doc(db, 'users', user.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserProfile(userSnap.data() as UserProfile);
          } else {
            // Create user profile if it doesn't exist
            const newUserProfile: UserProfile = {
              uid: user.uid,
              phoneNumber: user.phoneNumber || '',
              isAdmin: false, // Default to not admin
              createdAt: serverTimestamp() as any,
            };
            await setDoc(userRef, newUserProfile);
            setUserProfile(newUserProfile);
          }
        } catch (error) {
           console.error("Firebase error checking/creating user profile:", error);
           // This could be a permissions issue. For now, we'll log it.
           // You might want to sign the user out or show an error message.
           setUser(null);
           setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOutUser = async () => {
    try {
      await signOut(auth);
      // Redirect to home page after sign out to ensure clean state
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isAdmin = userProfile?.isAdmin || false;

  const value = { user, userProfile, loading, isAdmin, signOutUser };

  // This prevents rendering children until auth state is determined, avoiding hydration errors
  if (loading && !user) {
     return (
       <div className="flex justify-center items-center h-screen w-full">
         <Loader2 className="h-12 w-12 animate-spin text-primary" />
       </div>
     );
  }

  return (
    <AuthContext.Provider value={value}>
       <AdminAuthGuard>
          {children}
       </AdminAuthGuard>
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

const AdminAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === '/admin/login';
  const isAdminPage = pathname.startsWith('/admin');

  useEffect(() => {
    if (loading) return;

    // If on an admin page (but not login) and not an admin, redirect to login
    if (isAdminPage && !isAuthPage && !isAdmin) {
      router.push('/admin/login');
    }
    
    // If on the login page but already logged in as an admin, redirect to dashboard
    if(isAuthPage && user && isAdmin) {
      router.push('/admin');
    }

  }, [user, isAdmin, loading, router, pathname, isAdminPage, isAuthPage]);


  if (loading && isAdminPage && !isAuthPage) {
     return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If trying to access admin pages but not an admin, show nothing until redirect kicks in
  if (isAdminPage && !isAuthPage && !isAdmin) {
    return null;
  }
  
  return <>{children}</>;
};

    