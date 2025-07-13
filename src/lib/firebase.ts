
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// =================================================================
// IMPORTANT: YOUR FIREBASE CONFIGURATION IS HANDLED BY
// ENVIRONMENT VARIABLES FOR SECURITY.
// =================================================================
// 1. In Firebase Studio, go to the "Secrets" tab (key icon) on the left.
// 2. Add a new secret for each of the following variables.
//    - NEXT_PUBLIC_FIREBASE_API_KEY
//    - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
//    - NEXT_PUBLIC_FIREBASE_PROJECT_ID
//    - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
//    - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
//    - NEXT_PUBLIC_FIREBASE_APP_ID
//    - NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (Optional: for Analytics)
// 3. Paste the corresponding value from your Firebase project's config.
// =================================================================
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional: only needed for Google Analytics
};

// Conditionally initialize Firebase
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

// Check if all *required* environment variables are set.
// Note: measurementId is optional and not checked here.
const areRequiredConfigValuesPresent = 
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId;

if (areRequiredConfigValuesPresent) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Set all to null to ensure graceful failure
    app = null;
    auth = null;
    db = null;
    storage = null;
  }
} else {
  console.warn("Firebase configuration is missing or incomplete. Firebase services will be disabled. Please check your environment variables/secrets in the Secrets tab.");
}

export { app, auth, db, storage };
