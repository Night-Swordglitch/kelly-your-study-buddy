import { createFileRoute } from "@tanstack/react-router";
import { NotesPage } from "@/components/kelly/notes-page";
import { AppShell } from "@/components/kelly/app-shell";

export const Route = createFileRoute("/_authenticated/notes")({
  component: () => (
    <AppShell>
      <NotesPage />
    </AppShell>
  ),
});
