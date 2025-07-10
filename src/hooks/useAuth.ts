
"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

async function getOrCreateUserProfile(user: User) {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                phoneNumber: user.phoneNumber,
                createdAt: serverTimestamp(),
            });
        }
    } catch (error) {
        // This catch is important. If the rules deny the read/write,
        // we log it but don't crash the app. The security rules are the source of truth.
        console.error("Error creating or getting user profile:", error);
    }
}


export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthLoading(true);
      if (user) {
        setUser(user);
        // Create profile, but don't wait for it to check admin status
        getOrCreateUserProfile(user); 
        
        const adminRef = doc(db, 'admins', user.uid);
        const adminSnap = await getDoc(adminRef).catch(err => {
            console.error("Admin check failed, likely due to rules:", err);
            return null;
        });
        
        setIsAdmin(adminSnap?.exists() ?? false);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isAdmin, isAuthLoading };
}
