import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.");
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

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useEffect(() => {
    setupKellyAuthBridge();
  }, []);

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