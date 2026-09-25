import {
  createContext,
  useContext,
  useEffect,
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

export type KellyTheme = "original" | "aurora" | "monochrome";

export type KellyThemeContext = {
  theme: KellyTheme;
  setTheme: (theme: KellyTheme) => void;
};

export const KELLY_THEME_STORAGE_KEY = "kelly-theme";

const KellyThemeContext =
  createContext<KellyThemeContext | null>(null);

export function useKellyTheme() {
  const context = useContext(KellyThemeContext);

  if (!context) {
    throw new Error("useKellyTheme must be used inside AppShell");
  }

  return context;
}

// Shared across KellySidebar (the one true toggle button lives inside
// it) and AppShell (the dark scrim behind the expanded overlay, which
// must live outside <aside> so it can sit above the page content).
export type KellySidebarUIContext = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
};

const KellySidebarUIContext =
  createContext<KellySidebarUIContext | null>(null);

export function useKellySidebarUI() {
  const context = useContext(KellySidebarUIContext);

  if (!context) {
    throw new Error(
      "useKellySidebarUI must be used inside AppShell",
    );
  }

  return context;
}

const TABLET_BREAKPOINT = 1024;

function getInitialCollapsed() {
  if (typeof window === "undefined") {
    return false;
  }

  // Tablet + mobile default to the collapsed/closed state; desktop
  // opens expanded, matching the original behavior.
  return window.innerWidth < TABLET_BREAKPOINT;
}

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
  const [collapsed, setCollapsed] = useState(getInitialCollapsed);

  const [theme, setTheme] = useState<KellyTheme>(() => {
    if (typeof window === "undefined") {
      return "original";
    }

    const stored = window.localStorage.getItem(
      KELLY_THEME_STORAGE_KEY,
    );

    return stored === "aurora" || stored === "monochrome" ? stored : "original";
  });

  useEffect(() => {
    document.documentElement.dataset.kellyTheme = theme;
    window.localStorage.setItem(
      KELLY_THEME_STORAGE_KEY,
      theme,
    );
  }, [theme]);

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

  const sidebarUIContext: KellySidebarUIContext = {
    collapsed,
    setCollapsed,
  };

  const themeContext: KellyThemeContext = {
    theme,
    setTheme,
  };

  return (
    <KellyXPContext.Provider value={xpContext}>
      <KellyThemeContext.Provider value={themeContext}>
      <KellySidebarUIContext.Provider value={sidebarUIContext}>
        <div
          className={`kelly-app-shell kelly-mood-${mood}`}
          data-kelly-mood={mood}
        >
          {/* Dark scrim behind the expanded overlay below 1024px.
              Tapping it collapses the sidebar back to the icon
              rail. Only visible (CSS) when expanded + <1024px. */}
          <div
            className={`kelly-sidebar-backdrop${
              !collapsed ? " open" : ""
            }`}
            onClick={() => setCollapsed(true)}
            aria-hidden="true"
          />

          <KellySidebar />

          <main className="kelly-app-main">
            {children}
          </main>
        </div>
      </KellySidebarUIContext.Provider>
    </KellyThemeContext.Provider>
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




