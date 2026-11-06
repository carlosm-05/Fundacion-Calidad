import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getAdminSessionForServer } from "@/lib/auth-server";

type CatalogKind = "product" | "service";

export type ProductRecord = {
  id: string;
  name: string;
  model: string | null;
  description: string;
  price: string | null;
  gallery: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ServiceRecord = {
  id: string;
  name: string;
  description: string;
  price: string | null;
  price_amount_cents: number | null;
  gallery: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PublicCatalogResult =
  | { ok: true; products: ProductRecord[]; services: ServiceRecord[] }
  | { ok: false; error: "config" | "load" };

export type AdminCatalogResult =
  | { ok: true; products: ProductRecord[]; services: ServiceRecord[] }
  | { ok: false; error: "unauthorized" | "config" | "load" };

export type CatalogMutationResult =
  { ok: true } | { ok: false; error: "unauthorized" | "config" | "database" };

function env(name: string): string | undefined {
  const runtime = globalThis as {
    process?: { env?: Record<string, string | undefined> };
    __RUNTIME_ENV__?: Record<string, unknown>;
  };

  const fromProcess = runtime.process?.env?.[name]?.trim();
  if (fromProcess) return fromProcess;

  const binding = runtime.__RUNTIME_ENV__?.[name];
  if (typeof binding === "string" && binding.trim()) return binding.trim();

  return undefined;
}

function createPublicClient() {
  const url = env("SUPABASE_URL");
  const anonKey = env("SUPABASE_ANON_KEY");
  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

async function createAdminClient() {
  const session = await getAdminSessionForServer();
  if (!session.user) return { error: "unauthorized" as const };

  const url = env("SUPABASE_URL");
  const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRoleKey) return { error: "config" as const };

  return {
    client: createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }),
  };
}

function getManagedImagePaths(imageUrls: string[]) {
  const baseUrl = env("SUPABASE_URL");
  if (!baseUrl) return [];
  const baseOrigin = new URL(baseUrl).origin;
  const prefix = "/storage/v1/object/public/catalog-images/";

  return imageUrls.flatMap((imageUrl) => {
    try {
      const parsed = new URL(imageUrl);
      if (parsed.origin !== baseOrigin || !parsed.pathname.startsWith(prefix)) return [];
      const path = decodeURIComponent(parsed.pathname.slice(prefix.length));
      return /^(products|services)\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(path) ? [path] : [];
    } catch {
      return [];
    }
  });
}

async function removeCatalogImages(
  client: {
    storage: {
      from: (bucket: string) => {
        remove: (paths: string[]) => Promise<{ error: unknown }>;
      };
    };
  },
  imageUrls: string[],
) {
  const paths = getManagedImagePaths(imageUrls);
  if (!paths.length) return;

  const { error } = await client.storage.from("catalog-images").remove(paths);
  if (error) console.error("[catalogo] No se pudieron eliminar algunas imágenes:", error);
}

export const getPublishedCatalogFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicCatalogResult> => {
    const client = createPublicClient();
    if (!client) return { ok: false, error: "config" };

    const [productsResult, servicesResult] = await Promise.all([
      client
        .from("products")
        .select("id,name,model,description,price,gallery,is_active,created_at,updated_at")
        .eq("is_active", true)
        .order("created_at", { ascending: true }),
      client
        .from("services")
        .select(
          "id,name,description,price,price_amount_cents,gallery,is_active,created_at,updated_at",
        )
        .eq("is_active", true)
        .order("created_at", { ascending: true }),
    ]);

    if (productsResult.error || servicesResult.error) {
      console.error(
        "[catalogo] No se pudieron cargar los catálogos públicos:",
        productsResult.error ?? servicesResult.error,
      );
      return { ok: false, error: "load" };
    }

    return {
      ok: true,
      products: productsResult.data,
      services: servicesResult.data,
    };
  },
);

export const getAdminCatalogFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminCatalogResult> => {
    const admin = await createAdminClient();
    if ("error" in admin) return { ok: false, error: admin.error };

    const [productsResult, servicesResult] = await Promise.all([
      admin.client
        .from("products")
        .select("id,name,model,description,price,gallery,is_active,created_at,updated_at")
        .order("created_at", { ascending: true }),
      admin.client
        .from("services")
        .select(
          "id,name,description,price,price_amount_cents,gallery,is_active,created_at,updated_at",
        )
        .order("created_at", { ascending: true }),
    ]);

    if (productsResult.error || servicesResult.error) {
      console.error(
        "[catalogo] No se pudieron cargar los catálogos de administración:",
        productsResult.error ?? servicesResult.error,
      );
      return { ok: false, error: "load" };
    }

    return {
      ok: true,
      products: productsResult.data,
      services: servicesResult.data,
    };
  },
);

const imagePathSchema = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .refine(
    (value) => (value.startsWith("/") && !value.startsWith("//")) || /^https?:\/\//i.test(value),
    "Use una URL http(s) o una ruta local del sitio.",
  );

const saveCatalogItemSchema = z.object({
  kind: z.enum(["product", "service"]),
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(160),
  model: z.string().trim().max(160).optional().default(""),
  description: z.string().trim().min(1).max(4000),
  price: z.string().trim().max(120).optional().default(""),
  priceAmountCop: z.number().int().positive().max(999999999).nullable().optional(),
  gallery: z.array(imagePathSchema).max(8).optional().default([]),
  isActive: z.boolean().default(true),
});

export const saveCatalogItemFn = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof saveCatalogItemSchema>) => saveCatalogItemSchema.parse(input))
  .handler(async ({ data }): Promise<CatalogMutationResult> => {
    const admin = await createAdminClient();
    if ("error" in admin) return { ok: false, error: admin.error };

    const commonValues = {
      name: data.name,
      description: data.description,
      price: data.price || null,
      is_active: data.isActive,
    };
    const table = data.kind === "product" ? "products" : "services";
    let previousGallery: string[] = [];
    if (data.id) {
      const { data: existing, error: existingError } = await admin.client
        .from(table)
        .select("gallery")
        .eq("id", data.id)
        .maybeSingle();
      if (existingError || !existing) {
        console.error("[catalogo] No se pudo cargar el elemento para editar:", existingError);
        return { ok: false, error: "database" };
      }
      previousGallery = existing.gallery;
    }

    let saveError: unknown = null;
    let saved = false;
    if (data.kind === "product") {
      const values = { ...commonValues, model: data.model || null, gallery: data.gallery };
      const result = data.id
        ? await admin.client
            .from("products")
            .update(values)
            .eq("id", data.id)
            .select("id")
            .maybeSingle()
        : await admin.client.from("products").insert(values).select("id").maybeSingle();
      saveError = result.error;
      saved = Boolean(result.data);
    } else {
      const values = {
        ...commonValues,
        gallery: data.gallery,
        price_amount_cents:
          data.priceAmountCop === undefined || data.priceAmountCop === null
            ? null
            : data.priceAmountCop * 100,
      };
      const result = data.id
        ? await admin.client
            .from("services")
            .update(values)
            .eq("id", data.id)
            .select("id")
            .maybeSingle()
        : await admin.client.from("services").insert(values).select("id").maybeSingle();
      saveError = result.error;
      saved = Boolean(result.data);
    }

    if (saveError || !saved) {
      console.error("[catalogo] No se pudo guardar el elemento:", saveError);
      return { ok: false, error: "database" };
    }

    await removeCatalogImages(
      admin.client,
      previousGallery.filter((imageUrl) => !data.gallery.includes(imageUrl)),
    );
    return { ok: true };
  });

const catalogItemActionSchema = z.object({
  kind: z.enum(["product", "service"]),
  id: z.string().uuid(),
});

export const setCatalogItemActiveFn = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof catalogItemActionSchema> & { isActive: boolean }) =>
    catalogItemActionSchema.extend({ isActive: z.boolean() }).parse(input),
  )
  .handler(async ({ data }): Promise<CatalogMutationResult> => {
    const admin = await createAdminClient();
    if ("error" in admin) return { ok: false, error: admin.error };

    const table = data.kind === "product" ? "products" : "services";
    const { data: updated, error } = await admin.client
      .from(table)
      .update({ is_active: data.isActive })
      .eq("id", data.id)
      .select("id")
      .maybeSingle();

    if (error || !updated) {
      console.error("[catalogo] No se pudo cambiar la publicación:", error);
      return { ok: false, error: "database" };
    }

    return { ok: true };
  });

export const deleteCatalogItemFn = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof catalogItemActionSchema>) =>
    catalogItemActionSchema.parse(input),
  )
  .handler(async ({ data }): Promise<CatalogMutationResult> => {
    const admin = await createAdminClient();
    if ("error" in admin) return { ok: false, error: admin.error };

    const table = data.kind === "product" ? "products" : "services";
    const { data: item, error: readError } = await admin.client
      .from(table)
      .select("gallery")
      .eq("id", data.id)
      .maybeSingle();

    if (readError) {
      console.error("[catalogo] No se pudieron leer las imágenes del elemento:", readError);
      return { ok: false, error: "database" };
    }

    const { data: deleted, error } = await admin.client
      .from(table)
      .delete()
      .eq("id", data.id)
      .select("id")
      .maybeSingle();

    if (error || !deleted) {
      console.error("[catalogo] No se pudo eliminar el elemento:", error);
      return { ok: false, error: "database" };
    }

    if (item?.gallery.length) await removeCatalogImages(admin.client, item.gallery);
    return { ok: true };
  });
