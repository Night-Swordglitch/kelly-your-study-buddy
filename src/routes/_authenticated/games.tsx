import { createFileRoute } from "@tanstack/react-router";
import { GamesPage } from "@/components/kelly/games-page";

export const Route = createFileRoute("/_authenticated/games")({
  component: GamesPage,
});
