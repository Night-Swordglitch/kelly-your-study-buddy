import { createFileRoute } from "@tanstack/react-router";
import { KellyIframe } from "@/components/kelly/kelly-iframe";

export const Route = createFileRoute("/_authenticated/profile")({
  component: KellyIframe,
});
