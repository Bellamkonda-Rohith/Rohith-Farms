
"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

async function getOrCreateUserProfile(user: User) {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        // User profile doesn't exist, so create it.
        try {
            await setDoc(userRef, {
                uid: user.uid,
                phoneNumber: user.phoneNumber,
                createdAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Error creating user profile in Firestore:", error);
        }
    }
}


export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await getOrCreateUserProfile(user);
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
