import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const SESSION_COOKIE = "fc_customer_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

type SessionTokens = {
  access_token: string;
  refresh_token: string;
};

type CustomerSession = {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
};

type CustomerAuthResult =
  | { ok: true; requiresEmailConfirmation: boolean }
  | { ok: false; error: "config" | "credentials" | "forbidden" | "database" };

function env(name: string): string | undefined {
  const runtime = globalThis as {
    process?: { env?: Record<string, string | undefined> };
    __RUNTIME_ENV__?: Record<string, unknown>;
  };
  const value = runtime.process?.env?.[name]?.trim();
  if (value) return value;
  const binding = runtime.__RUNTIME_ENV__?.[name];
  return typeof binding === "string" && binding.trim() ? binding.trim() : undefined;
}

function getConfig() {
  const url = env("SUPABASE_URL");
  const anonKey = env("SUPABASE_ANON_KEY");
  const adminEmail = env("ADMIN_EMAIL")?.toLowerCase();
  if (!url || !anonKey || !adminEmail) return null;
  return { url, anonKey, adminEmail };
}

function createSupabaseClient(url: string, anonKey: string) {
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function getAppUrl() {
  const configuredUrl = env("APP_URL");
  if (!configuredUrl) {
    return env("NODE_ENV") === "production" ? null : "http://localhost:8080";
  }

  try {
    const url = new URL(configuredUrl);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      (env("NODE_ENV") === "production" && url.protocol !== "https:")
    ) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

const writeSessionCookie = createServerOnlyFn((tokens: SessionTokens) => {
  setCookie(SESSION_COOKIE, JSON.stringify(tokens), {
    httpOnly: true,
    secure: env("NODE_ENV") === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
});

const clearSessionCookie = createServerOnlyFn(() => {
  deleteCookie(SESSION_COOKIE, { path: "/" });
});

const readSessionTokens = createServerOnlyFn((): SessionTokens | null => {
  const raw = getCookie(SESSION_COOKIE);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    const result = z
      .object({ access_token: z.string().min(1), refresh_token: z.string().min(1) })
      .safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
});

async function getCustomerProfile(
  url: string,
  anonKey: string,
  accessToken: string,
  userId: string,
) {
  const client = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  const { data, error } = await client
    .from("profiles")
    .select("id,email,first_name,last_name,role")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.error("[cuenta] No se pudo cargar el perfil:", error);
    return null;
  }
  if (!data || data.role !== "customer") return null;
  return {
    id: data.id as string,
    email: data.email as string,
    firstName: data.first_name as string,
    lastName: data.last_name as string,
  };
}

async function establishSession(tokens: SessionTokens) {
  const config = getConfig();
  if (!config) return { error: "config" as const };

  const client = createSupabaseClient(config.url, config.anonKey);
  const { data: sessionData, error: sessionError } = await client.auth.setSession(tokens);
  if (sessionError || !sessionData.session) return { error: "credentials" as const };

  const { data: userData, error: userError } = await client.auth.getUser();
  const user = userData.user;
  if (userError || !user?.email || user.email.toLowerCase() === config.adminEmail) {
    return { error: "forbidden" as const };
  }

  const profile = await getCustomerProfile(
    config.url,
    config.anonKey,
    sessionData.session.access_token,
    user.id,
  );
  if (!profile) return { error: "forbidden" as const };

  writeSessionCookie({
    access_token: sessionData.session.access_token,
    refresh_token: sessionData.session.refresh_token,
  });
  return { profile };
}

const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(320),
  password: z.string().min(8).max(200),
  serviceId: z.string().uuid().optional(),
});

export const registerCustomerFn = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof registerSchema>) => registerSchema.parse(input))
  .handler(async ({ data }): Promise<CustomerAuthResult> => {
    const config = getConfig();
    if (!config) return { ok: false, error: "config" };
    if (data.email === config.adminEmail) return { ok: false, error: "forbidden" };
    const appUrl = getAppUrl();
    if (!appUrl) return { ok: false, error: "config" };

    const confirmationUrl = new URL("/cuenta/confirmar", appUrl);
    if (data.serviceId) confirmationUrl.searchParams.set("serviceId", data.serviceId);
    const client = createSupabaseClient(config.url, config.anonKey);
    const { data: result, error } = await client.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: confirmationUrl.toString(),
        data: { first_name: data.firstName, last_name: data.lastName },
      },
    });

    if (error) {
      console.error("[cuenta] No se pudo registrar el cliente:", error.message);
      return { ok: false, error: "credentials" };
    }

    if (result.session && result.user) {
      const session = await establishSession({
        access_token: result.session.access_token,
        refresh_token: result.session.refresh_token,
      });
      if ("error" in session) return { ok: false, error: session.error };
    }

    return { ok: true, requiresEmailConfirmation: !result.session };
  });

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  password: z.string().min(1).max(200),
});

export const loginCustomerFn = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof loginSchema>) => loginSchema.parse(input))
  .handler(async ({ data }): Promise<CustomerAuthResult> => {
    const config = getConfig();
    if (!config) return { ok: false, error: "config" };
    if (data.email === config.adminEmail) return { ok: false, error: "forbidden" };

    const client = createSupabaseClient(config.url, config.anonKey);
    const { data: result, error } = await client.auth.signInWithPassword(data);
    if (error || !result.session) return { ok: false, error: "credentials" };

    const session = await establishSession({
      access_token: result.session.access_token,
      refresh_token: result.session.refresh_token,
    });
    if ("error" in session) return { ok: false, error: session.error };
    return { ok: true, requiresEmailConfirmation: false };
  });

export const customerSessionFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<CustomerSession> => {
    const tokens = readSessionTokens();
    if (!tokens) {
      clearSessionCookie();
      return { user: null };
    }
    const session = await establishSession(tokens);
    return "error" in session ? { user: null } : { user: session.profile };
  },
);

export const completeCustomerSessionFn = createServerFn({ method: "POST" })
  .validator((input: SessionTokens) =>
    z.object({ access_token: z.string().min(1), refresh_token: z.string().min(1) }).parse(input),
  )
  .handler(async ({ data }) => {
    const session = await establishSession(data);
    return "error" in session
      ? { ok: false as const, error: session.error }
      : { ok: true as const };
  });

export const logoutCustomerFn = createServerFn({ method: "POST" }).handler(async () => {
  clearSessionCookie();
  return { ok: true as const };
});

const resetRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
});

export const requestCustomerPasswordResetFn = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof resetRequestSchema>) => resetRequestSchema.parse(input))
  .handler(async ({ data }) => {
    const config = getConfig();
    if (!config) return { ok: false as const, error: "config" as const };
    const appUrl = getAppUrl();
    if (!appUrl) return { ok: false as const, error: "config" as const };
    const client = createSupabaseClient(config.url, config.anonKey);
    const { error } = await client.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${appUrl}/cuenta/confirmar`,
    });
    if (error) {
      console.error("[cuenta] No se pudo solicitar la recuperación:", error.message);
      return { ok: false as const, error: "send" as const };
    }
    return { ok: true as const };
  });

const newPasswordSchema = z.object({ password: z.string().min(8).max(200) });

export const updateCustomerPasswordFn = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof newPasswordSchema>) => newPasswordSchema.parse(input))
  .handler(async ({ data }) => {
    const tokens = readSessionTokens();
    const config = getConfig();
    if (!config) return { ok: false as const, error: "config" as const };
    if (!tokens) return { ok: false as const, error: "session" as const };

    const client = createSupabaseClient(config.url, config.anonKey);
    const { data: sessionData, error: sessionError } = await client.auth.setSession(tokens);
    if (sessionError || !sessionData.session) {
      clearSessionCookie();
      return { ok: false as const, error: "session" as const };
    }
    const { error } = await client.auth.updateUser({ password: data.password });
    if (error) {
      console.error("[cuenta] No se pudo cambiar la contraseña:", error.message);
      return { ok: false as const, error: "update" as const };
    }

    writeSessionCookie({
      access_token: sessionData.session.access_token,
      refresh_token: sessionData.session.refresh_token,
    });
    return { ok: true as const };
  });
