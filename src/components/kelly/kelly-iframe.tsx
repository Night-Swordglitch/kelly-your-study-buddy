import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithCredential,
  EmailAuthProvider,
  type AuthCredential,
  type User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

for (const [key, value] of Object.entries(firebaseConfig)) {
  if (!value) {
    throw new Error(`Missing Firebase config value: ${key}`);
  }
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Holds a Google credential temporarily when Firebase reports that the
// email already has a password account — we need it to finish linking
// once the user proves ownership by entering their password.
let pendingGoogleCredential: AuthCredential | null = null;
let pendingGoogleEmail: string | null = null;

function firebaseErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Incorrect email or password.";
    case "auth/user-not-found":
      return "No account found with that email.";
    case "auth/email-already-in-use":
      return "An account with that email already exists.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was closed before finishing.";
    default:
      return (error as { message?: string })?.message ?? "Something went wrong.";
  }
}

declare global {
  interface Window {
    KellyAuth?: {
      login: (
        email: string,
        password: string,
      ) => Promise<{ error: string | null }>;
      signup: (
        name: string,
        email: string,
        password: string,
      ) => Promise<{ error: string | null; session: boolean }>;
      loginWithGoogle: () => Promise<{
        error: string | null;
        email?: string;
        isNewUser: boolean;
        needsPassword: boolean;
      }>;
      completeAccountLinking: (
        password: string,
      ) => Promise<{ error: string | null }>;
      linkPassword: (password: string) => Promise<{ error: string | null }>;
      logout: () => Promise<void>;
      getSession: () => Promise<{ session: unknown }>;
    };
  }
}

const VALID_PAGES = [
  "home",
  "notes",
  "subjects",
  "study",
  "quizzes",
  "flashcards",
  "groups",
  "calendar",
  "progress",
  "profile",
  "login",
  "signup",
] as const;

type KellyPage = (typeof VALID_PAGES)[number];

function pathToPage(pathname: string): KellyPage {
  const page = pathname.replace(/^\/+/, "");

  if (page === "" || page === "home") {
    return "home";
  }

  if ((VALID_PAGES as readonly string[]).includes(page)) {
    return page as KellyPage;
  }

  return "home";
}

function hasPasswordProvider(user: User): boolean {
  return user.providerData.some((p) => p.providerId === "password");
}

function setupKellyAuthBridge() {
  window.KellyAuth = {
    async login(email, password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return { error: null };
      } catch (error) {
        return { error: firebaseErrorMessage(error) };
      }
    },

    async signup(name, email, password) {
      try {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        if (name) {
          await updateProfile(credential.user, { displayName: name });
        }

        return { error: null, session: true };
      } catch (error) {
        return { error: firebaseErrorMessage(error), session: false };
      }
    },

    async loginWithGoogle() {
      const provider = new GoogleAuthProvider();

      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Firebase marks the very first sign-in for a brand-new user with
        // matching creation/last-sign-in timestamps.
        const isNewUser =
          user.metadata.creationTime === user.metadata.lastSignInTime;

        return {
          error: null,
          isNewUser,
          needsPassword: !hasPasswordProvider(user),
        };
      } catch (error) {
        const code = (error as { code?: string })?.code;

        if (code === "auth/account-exists-with-different-credential") {
          // Firebase blocked the Google sign-in because this email already
          // has a password account. Stash the Google credential so we can
          // link it once the user confirms their password.
          pendingGoogleCredential = GoogleAuthProvider.credentialFromError(
            error as Parameters<typeof GoogleAuthProvider.credentialFromError>[0],
          );
          pendingGoogleEmail =
            (error as { customData?: { email?: string } })?.customData
              ?.email ?? null;

          return {
            error: "ACCOUNT_EXISTS_NEEDS_PASSWORD",
            ...(pendingGoogleEmail ? { email: pendingGoogleEmail } : {}),
            isNewUser: false,
            needsPassword: false,
          };;
        }

        return {
          error: firebaseErrorMessage(error),
          isNewUser: false,
          needsPassword: false,
        };
      }
    },

    async completeAccountLinking(password) {
      if (!pendingGoogleCredential || !pendingGoogleEmail) {
        return { error: "No pending Google sign-in to link." };
      }

      try {
        const result = await signInWithEmailAndPassword(
          auth,
          pendingGoogleEmail,
          password,
        );

        await linkWithCredential(result.user, pendingGoogleCredential);

        pendingGoogleCredential = null;
        pendingGoogleEmail = null;

        return { error: null };
      } catch (error) {
        return { error: firebaseErrorMessage(error) };
      }
    },

    async linkPassword(password) {
      const user = auth.currentUser;

      if (!user || !user.email) {
        return { error: "No signed-in user to add a password to." };
      }

      try {
        const credential = EmailAuthProvider.credential(user.email, password);
        await linkWithCredential(user, credential);
        return { error: null };
      } catch (error) {
        return { error: firebaseErrorMessage(error) };
      }
    },

    async logout() {
      await signOut(auth);
    },

    async getSession() {
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve({ session: user ? { user } : null });
        });
      });
    },
  };
}

export function KellyIframe() {
  const location = useLocation();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isLandingRoute = location.pathname === "/";
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/signup";
  const page = isAuthRoute
    ? (location.pathname.replace("/", "") as "login" | "signup")
    : pathToPage(location.pathname);

  useEffect(() => {
    setupKellyAuthBridge();
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) {
      return;
    }

    const sendPage = () => {
      let messageType: string;

      if (isLandingRoute) {
        messageType = "kelly:force-landing";
      } else if (isAuthRoute) {
        messageType = "kelly:force-auth";
      } else {
        messageType = "kelly:set-page";
      }

      iframe.contentWindow?.postMessage(
        {
          type: messageType,
          page,
        },
        window.location.origin,
      );
    };

    iframe.addEventListener("load", sendPage);
    sendPage();

    return () => {
      iframe.removeEventListener("load", sendPage);
    };
  }, [page, isLandingRoute, isAuthRoute]);

  useEffect(() => {
    const handleKellyNavigation = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      const data = event.data;

      if (data?.type !== "kelly:request-navigation") {
        return;
      }

      const requestedPage = data.page;

      if (
        typeof requestedPage !== "string" ||
        (requestedPage !== "landing" &&
          !(VALID_PAGES as readonly string[]).includes(requestedPage))
      ) {
        return;
      }

      const targetPath =
        requestedPage === "home"
          ? "/home"
          : requestedPage === "landing"
            ? "/"
            : `/${requestedPage}`;

      if (location.pathname !== targetPath) {
        navigate({
          to: targetPath,
        });
      }
    };

    window.addEventListener("message", handleKellyNavigation);

    return () => {
      window.removeEventListener("message", handleKellyNavigation);
    };
  }, [location.pathname, navigate]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "#0a0a0f",
      }}
    >
      <iframe
        ref={iframeRef}
        src="/KELLY/KELLY.html"
        title="Kelly"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          margin: 0,
          padding: 0,
          border: "none",
          display: "block",
        }}
      />
    </div>
  );
}