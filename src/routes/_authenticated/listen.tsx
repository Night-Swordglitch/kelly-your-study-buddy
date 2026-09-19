import { createFileRoute } from "@tanstack/react-router";
import { ListenTranscribePage } from "@/components/kelly/listen-transcribe-page";

export const Route = createFileRoute("/_authenticated/listen")({
  component: ListenTranscribePage,
});
