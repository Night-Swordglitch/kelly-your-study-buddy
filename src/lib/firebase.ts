import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);

// Firebase needs a moment on page load to restore a persisted session.
// This waits for the first auth-state event and resolves with the
// current user (or null if not logged in). Used by the route guard
// so we never render a protected page before we actually know.
let authReadyPromise: Promise<void> | null = null;

function waitForAuthReady(): Promise<void> {
  if (authReadyPromise) {
    return authReadyPromise;
  }

  authReadyPromise = new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      () => {
        unsubscribe();
        resolve();
      },
    );
  });

  return authReadyPromise;
}

export async function getCurrentUser(): Promise<User | null> {
  /*
   * Wait only for Firebase's initial session restoration.
   * After that, always read firebaseAuth.currentUser directly.
   *
   * This is important because the auth state can change after
   * the initial page load (login, logout, Google linking, etc.).
   */
  await waitForAuthReady();

  return firebaseAuth.currentUser;
}
export default app;