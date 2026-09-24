import { createFileRoute } from "@tanstack/react-router";
import { NotesPage } from "@/components/kelly/notes-page";

export const Route = createFileRoute("/_authenticated/notes")({
  component: NotesPage,
});

