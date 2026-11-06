import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { getAdminSessionForServer } from "@/lib/auth-server";

const BUCKET = "catalog-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 8;
const allowedTypes = new Map([
  ["image/jpeg", { extension: "jpg", signature: [0xff, 0xd8, 0xff] }],
  ["image/png", { extension: "png", signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }],
  ["image/webp", { extension: "webp", signature: [0x52, 0x49, 0x46, 0x46] }],
]);

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

export const Route = createFileRoute("/api/catalog-images")({
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
        const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY");
        if (!url || !serviceRoleKey) {
          console.error("[catalogo] Falta configuración del almacenamiento de imágenes.");
          return jsonResponse({ ok: false, error: "config" }, 500);
        }

        let form: FormData;
        try {
          form = await request.formData();
        } catch (error) {
          console.error("[catalogo] No se pudo leer el archivo recibido:", error);
          return jsonResponse({ ok: false, error: "invalid" }, 400);
        }

        const file = form.get("file");
        const kind = form.get("kind");
        const galleryCount = Number(form.get("galleryCount"));
        if (
          !(file instanceof File) ||
          (kind !== "product" && kind !== "service") ||
          !Number.isInteger(galleryCount) ||
          galleryCount < 1 ||
          galleryCount > MAX_IMAGES
        ) {
          return jsonResponse({ ok: false, error: "invalid" }, 400);
        }
        if (file.size < 1 || file.size > MAX_FILE_SIZE) {
          return jsonResponse({ ok: false, error: "size" }, 400);
        }

        const imageType = allowedTypes.get(file.type);
        if (!imageType) return jsonResponse({ ok: false, error: "type" }, 400);

        const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
        const hasHeader = imageType.signature.every((byte, index) => bytes[index] === byte);
        const isWebp =
          file.type !== "image/webp" || String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
        if (!hasHeader || !isWebp) return jsonResponse({ ok: false, error: "type" }, 400);

        const supabase = createClient(url, serviceRoleKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
        });
        const path = `${kind}s/${crypto.randomUUID()}.${imageType.extension}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: "31536000",
          contentType: file.type,
          upsert: false,
        });

        if (error) {
          console.error("[catalogo] No se pudo subir la imagen:", error);
          return jsonResponse({ ok: false, error: "upload" }, 500);
        }

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        return jsonResponse({ ok: true, url: data.publicUrl }, 201);
      },
    },
  },
});
