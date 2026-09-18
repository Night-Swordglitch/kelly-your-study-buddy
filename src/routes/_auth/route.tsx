import { createFileRoute, Outlet } from "@tanstack/react-router";
import { KellyIframe } from "@/components/kelly/kelly-iframe";

export const Route = createFileRoute("/_auth")({
  component: () => (
    <>
      <KellyIframe />
      <Outlet />
    </>
  ),
});
