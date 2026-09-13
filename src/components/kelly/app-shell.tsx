import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Brain,
  CalendarDays,
  Home,
  LogOut,
  Settings,
  Flame,
} from "lucide-react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { KellyAvatar, type KellyMood } from "./kelly-avatar";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const items = [
  {
    to: "/dashboard" as const,
    label: "Home",
    icon: Home,
  },
  {
    to: "/work" as const,
    label: "My work",
    icon: BookOpen,
  },
  {
    to: "/memory" as const,
    label: "Memory",
    icon: Brain,
  },
  {
    to: "/settings" as const,
    label: "Settings",
    icon: Settings,
  },
];

export function AppShell({
  children,
  mood = "idle",
}: {
  children: ReactNode;
  mood?: KellyMood;
}) {
  const path = useRouterState({
    select: (state) => state.location.pathname,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({
      to: "/auth",
      replace: true,
    });
  }

  return (
    <div className="kelly-app min-h-screen text-foreground">
      {/* Desktop header */}
      <header className="kelly-header">
        <div className="kelly-header-inner">
          <Link
            to="/dashboard"
            className="kelly-brand"
            aria-label="Kelly home"
          >
            <KellyAvatar size="sm" />

            <div className="kelly-brand-copy">
              <span className="kelly-brand-name">Kelly</span>
              <span className="kelly-brand-subtitle">
                your study buddy
              </span>
            </div>
          </Link>

          <nav className="kelly-nav" aria-label="Main navigation">
            {items.map(({ to, label, icon: Icon }) => {
              const active =
                path === to ||
                (to !== "/dashboard" && path.startsWith(to));

              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "kelly-nav-item",
                    active && "kelly-nav-item-active"
                  )}
                >
                  <Icon className="size-[17px]" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="kelly-header-right">
            <div className="kelly-streak-pill">
              <Flame className="size-4" />
              <span>4</span>
              <span className="hidden sm:inline">day streak</span>
            </div>

            <button
              onClick={signOut}
              className="kelly-signout"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="size-[17px]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="kelly-main">
        {children}
      </main>

      {/* Mobile navigation */}
      <nav className="kelly-mobile-nav" aria-label="Mobile navigation">
        {items.map(({ to, label, icon: Icon }) => {
          const active =
            path === to ||
            (to !== "/dashboard" && path.startsWith(to));

          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              className={cn(
                "kelly-mobile-nav-item",
                active && "kelly-mobile-nav-item-active"
              )}
            >
              <Icon className="size-[20px]" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Kelly floating companion */}
      <Link
        to="/work"
        className="kelly-floating-companion"
        aria-label="Talk to Kelly"
      >
        <KellyAvatar mood={mood} size="md" />

        <span className="kelly-floating-label">
          Talk to Kelly
        </span>
      </Link>
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <section className="kelly-page-intro">
      <div className="kelly-page-intro-copy">
        <p className="kelly-eyebrow">{eyebrow}</p>

        <h1>{title}</h1>

        <p className="kelly-page-description">
          {description}
        </p>
      </div>

      {action && (
        <div className="kelly-page-action">
          {action}
        </div>
      )}
    </section>
  );
}
