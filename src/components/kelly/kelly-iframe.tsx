import { useLocation, useNavigate } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.",
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

function setupKellyAuthBridge() {
  window.KellyAuth = {
    async login(email, password) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return {
        error: error?.message ?? null,
      };
    },

    async signup(name, email, password) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          },
        },
      });

      return {
        error: error?.message ?? null,
        session: Boolean(data.session),
      };
    },

    async logout() {
      await supabase.auth.signOut();
    },

    async getSession() {
      const { data } = await supabase.auth.getSession();

      return {
        session: data.session,
      };
    },
  };
}

export function KellyIframe() {
  const location = useLocation();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isLandingRoute = location.pathname === "/";
  const page = pathToPage(location.pathname);

  useEffect(() => {
    setupKellyAuthBridge();
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) {
      return;
    }

    const sendPage = () => {
      iframe.contentWindow?.postMessage(
        {
          type: isLandingRoute
            ? "kelly:force-landing"
            : "kelly:set-page",
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
  }, [page, isLandingRoute]);

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
        !(VALID_PAGES as readonly string[]).includes(requestedPage)
      ) {
        return;
      }

      const targetPath =
        requestedPage === "home"
          ? "/home"
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


