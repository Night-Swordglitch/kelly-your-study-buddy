import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { BookOpen, Brain, CalendarClock, Home, LogOut, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { KellyAvatar } from "./kelly-avatar";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard" as const, label: "Dashboard", icon: Home },
  { to: "/work" as const, label: "Guided work", icon: BookOpen },
  { to: "/memory" as const, label: "Memory", icon: Brain },
  { to: "/settings" as const, label: "Settings", icon: Settings },
];

export function AppShell({ children, mood = "idle" }: { children: ReactNode; mood?: "idle" | "thinking" | "happy" | "concerned" }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  async function signOut() { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); await navigate({ to: "/auth", replace: true }); }
  return (
    <div className="app-canvas min-h-screen pb-24 text-foreground">
      <header className="sticky top-0 z-40 px-4 pt-4 md:px-6">
        <nav className="glass-panel mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-3 py-2.5">
          <Link to="/dashboard" className="flex items-center gap-2.5" aria-label="Kelly dashboard">
            <KellyAvatar size="sm" /><div className="leading-tight"><p className="font-display text-lg font-semibold">Kelly</p><p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Study companion</p></div>
          </Link>
          <div className="hidden items-center gap-1 rounded-xl bg-surface-soft p-1 md:flex">
            {items.map(({ to, label, icon: Icon }) => <Link key={to} to={to} className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground", path === to && "bg-surface text-primary shadow-soft")}><Icon className="size-4" />{label}</Link>)}
          </div>
          <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out" title="Sign out"><LogOut /></Button>
        </nav>
      </header>
      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-8 pt-6 md:px-6">{children}</main>
      <nav className="fixed inset-x-3 bottom-3 z-50 flex justify-around rounded-2xl bg-surface/90 p-2 shadow-prism backdrop-blur-xl md:hidden">
        {items.map(({ to, label, icon: Icon }) => <Link key={to} to={to} aria-label={label} className={cn("grid size-11 place-items-center rounded-xl text-muted-foreground", path === to && "bg-primary text-primary-foreground")}><Icon className="size-5" /></Link>)}
      </nav>
      <Link to="/work" className="fixed bottom-20 right-4 z-30 rounded-full bg-surface/90 p-2 shadow-prism backdrop-blur-xl md:bottom-6 md:right-6" aria-label="Open Kelly"><KellyAvatar mood={mood} /></Link>
    </div>
  );
}

export function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <section className="glass-panel prism-line relative overflow-hidden rounded-3xl p-6 md:p-8"><div className="flex flex-wrap items-start justify-between gap-5"><div><p className="eyebrow">{eyebrow}</p><h1 className="mt-2 max-w-3xl font-display text-3xl font-semibold leading-tight md:text-4xl">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">{description}</p></div>{action}</div></section>;
}
