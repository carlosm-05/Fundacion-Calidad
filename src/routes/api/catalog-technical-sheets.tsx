import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getAdminSessionForServer } from "@/lib/auth-server";

const BUCKET = "catalog-technical-sheets";
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const uploadRequestSchema = z.object({
  fileSize: z.number().int().positive(),
  contentType: z.string(),
});

function env(name: string): string | undefined {
  const runtime = globalThis as {
    process?: { env?: Record<string, string | undefined> };
    __RUNTIME_ENV__?: Record<string, unknown>;
  };
  const fromProcess = runtime.process?.env?.[name]?.trim();
  if (fromProcess) return fromProcess;

  const binding = runtime.__RUNTIME_ENV__?.[name];
  return typeof binding === "string" && binding.trim() ? binding.trim() : undefined;
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export const Route = createFileRoute("/api/catalog-technical-sheets")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const origin = request.headers.get("origin");
        if (origin && origin !== new URL(request.url).origin) {
          return jsonResponse({ ok: false, error: "forbidden" }, 403);
        }

        const session = await getAdminSessionForServer();
        if (!session.user) return jsonResponse({ ok: false, error: "unauthorized" }, 401);

        const url = env("SUPABASE_URL");
        const anonKey = env("SUPABASE_ANON_KEY");
        const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY");
        if (!url || !anonKey || !serviceRoleKey) {
          console.error("[catalogo] Falta configuración para subir fichas técnicas.");
          return jsonResponse({ ok: false, error: "config" }, 500);
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch (error) {
          console.error("[catalogo] No se pudo leer la solicitud de ficha técnica:", error);
          return jsonResponse({ ok: false, error: "invalid" }, 400);
        }

        const parsed = uploadRequestSchema.safeParse(body);
        if (!parsed.success) return jsonResponse({ ok: false, error: "invalid" }, 400);
        if (parsed.data.fileSize > MAX_FILE_SIZE) {
          return jsonResponse({ ok: false, error: "size" }, 400);
        }
        if (parsed.data.contentType !== "application/pdf") {
          return jsonResponse({ ok: false, error: "type" }, 400);
        }

        const supabase = createClient(url, serviceRoleKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
        });
        const path = `products/${crypto.randomUUID()}.pdf`;
        const { data: signedUpload, error } = await supabase.storage
          .from(BUCKET)
          .createSignedUploadUrl(path);

        if (error) {
          console.error("[catalogo] No se pudo crear el enlace de carga de la ficha:", error);
          return jsonResponse({ ok: false, error: "upload" }, 500);
        }

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        return jsonResponse(
          {
            ok: true,
            url: data.publicUrl,
            path: signedUpload.path,
            token: signedUpload.token,
            supabaseUrl: url,
            anonKey,
          },
          201,
        );
      },
    },
  },
});
