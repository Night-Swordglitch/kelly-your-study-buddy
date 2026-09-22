import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { KellySidebar } from "@/components/kelly/sidebar";

type KellyMood = "idle" | "happy" | "concerned";

export type KellyXPContext = {
  xp: number;
  addXP: (amount: number) => void;
};

const KellyXPContext = createContext<KellyXPContext | null>(null);

export const KELLY_XP_STORAGE_KEY = "kelly-total-xp";
export const KELLY_INITIAL_XP = 1180;

export function useKellyXP() {
  const context = useContext(KellyXPContext);

  if (!context) {
    throw new Error("useKellyXP must be used inside AppShell");
  }

  return context;
}

type AppShellProps = {
  children: ReactNode;
  mood?: KellyMood;
};

export function AppShell({
  children,
  mood = "idle",
}: AppShellProps) {
  const [xp, setXP] = useState(() => {
    if (typeof window === "undefined") {
      return KELLY_INITIAL_XP;
    }

    const stored = window.localStorage.getItem(
      KELLY_XP_STORAGE_KEY,
    );

    const parsed = stored === null ? NaN : Number(stored);

    return Number.isFinite(parsed)
      ? parsed
      : KELLY_INITIAL_XP;
  });

  const addXP = (amount: number) => {
    setXP((current) => {
      const next = current + amount;

      window.localStorage.setItem(
        KELLY_XP_STORAGE_KEY,
        String(next),
      );

      return next;
    });
  };

  const xpContext: KellyXPContext = {
    xp,
    addXP,
  };

  return (
    <KellyXPContext.Provider value={xpContext}>
      <div
        className={`kelly-app-shell kelly-mood-${mood}`}
        data-kelly-mood={mood}
      >
        <KellySidebar />

        <main className="kelly-app-main">
          {children}
        </main>
      </div>
    </KellyXPContext.Provider>
  );
}

export function PageIntro({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="kelly-page-intro">
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
    </div>
  );
}