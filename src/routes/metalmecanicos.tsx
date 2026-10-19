import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/metalmecanicos")({
  beforeLoad: () => {
    throw redirect({ to: "/productos-servicios" });
  },
});
