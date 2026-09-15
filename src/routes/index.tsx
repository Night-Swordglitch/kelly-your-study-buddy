import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/kelly/landing/landing-page";

export const Route = createFileRoute("/")({
  component: LandingPage,
});
