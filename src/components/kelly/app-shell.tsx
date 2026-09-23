import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Menu } from "lucide-react";
import { KellySidebar } from "@/components/kelly/sidebar";

type KellyMood = "idle" | "happy" | "concerned";

export type KellyXPContext = {
  xp: number;
  addXP: (amount: number) => void;
};

const KellyXPContext = createContext<KellyXPContext | null>(null);

// Shared across KellySidebar (the <aside> itself) and AppShell (the
// floating mobile trigger + scrim, which must live outside the <aside>
// so they're still reachable/visible while the sidebar is off-canvas).
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

  return (
    <KellyXPContext.Provider value={xpContext}>
      <KellySidebarUIContext.Provider value={sidebarUIContext}>
        <div
          className={`kelly-app-shell kelly-mood-${mood}`}
          data-kelly-mood={mood}
        >
          {/* Floating trigger: only visible <1024px via CSS. Lives
              outside <aside> so it's reachable even while the
              sidebar is off-canvas on mobile. */}
          <button
            type="button"
            className="kelly-mobile-menu-button"
            onClick={() => setCollapsed(false)}
            aria-label="Open menu"
          >
            <Menu
              className="kelly-sidebar-icon"
              size={18}
              strokeWidth={2}
            />
          </button>

          {/* Dark scrim behind the mobile drawer; tapping it closes
              the sidebar. Only rendered/visible when open + mobile. */}
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