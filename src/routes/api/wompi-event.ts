import { createFileRoute } from "@tanstack/react-router";
import { processWompiEvent } from "@/lib/purchase-server";

export const Route = createFileRoute("/api/wompi-event")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const contentLength = Number(request.headers.get("content-length") ?? 0);
        if (contentLength > 65_536) return new Response(null, { status: 413 });

        let payload: unknown;
        try {
          const body = await request.text();
          if (body.length > 65_536) return new Response(null, { status: 413 });
          payload = JSON.parse(body);
        } catch (error) {
          console.error("[wompi] No se pudo leer el evento recibido:", error);
          return new Response(null, { status: 400 });
        }

        const result = await processWompiEvent(payload);
        return new Response(null, { status: result.ok ? 200 : result.status });
      },
    },
  },
});
