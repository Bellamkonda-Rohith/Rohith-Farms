
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// IMPORTANT: Replace this with your own Firebase project's configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXTzwZ2rrtxsbbsy8LQgusADGUYX_j31w",
  authDomain: "rohith-farms.firebaseapp.com",
  projectId: "rohith-farms",
  storageBucket: "rohith-farms.firebasestorage.app",
  messagingSenderId: "474148243792",
  appId: "1:474148243792:web:e7ca8390bcd672de478455",
  measurementId: "G-1G47ZY9GRJ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
