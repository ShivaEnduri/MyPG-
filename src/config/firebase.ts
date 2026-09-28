


import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,setPersistence, browserLocalPersistence
} from "firebase/auth";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey) {
  console.error("Firebase config is missing! Check your .env file.");
}

// ✅ Guard: reuse existing app instead of re-initializing
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const firebaseAuth = getAuth(app);

// ── Providers ──────────────────────────────────────────────────────────────

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");

export const firebaseProviders = {
  google:    googleProvider,
  github:    new GithubAuthProvider(),
  twitter:   new TwitterAuthProvider(),
  facebook:  new FacebookAuthProvider(),
  microsoft: new OAuthProvider("microsoft.com"),
};

setPersistence(firebaseAuth, browserLocalPersistence); 
console.log("Firebase initialized successfully");


console.log("🔥 Firebase project:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log("🔑 API Key prefix:", import.meta.env.VITE_FIREBASE_API_KEY?.substring(0, 10));