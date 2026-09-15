import type { ReactNode } from "react";
import { KellySidebar } from "@/components/kelly/sidebar";

type KellyMood = "idle" | "happy" | "concerned";

type AppShellProps = {
  children: ReactNode;
  mood?: KellyMood;
};

export function AppShell({
  children,
  mood = "idle",
}: AppShellProps) {
  return (
    <div
      className={`kelly-app-shell kelly-mood-${mood}`}
      data-kelly-mood={mood}
    >
      <KellySidebar />

      <main className="kelly-app-main">
        {children}
      </main>
    </div>
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
