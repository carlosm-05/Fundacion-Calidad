import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

/**
 * AUTENTICACIÓN — Panel de administración
 *
 * Usa Supabase Auth (email + contraseña) del lado del servidor.
 * La sesión se guarda en una cookie httpOnly (`fc_session`) para que el
 * token nunca llegue al navegador. Solo se permite el acceso al email
 * definido en `ADMIN_EMAIL`.
 *
 * Variables de entorno (SOLO servidor, sin prefijo VITE_):
 *   SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL
 *
 * En local se leen desde `.env`; en producción desde las Env Vars del host.
 */

const SESSION_COOKIE = "fc_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const SESSION_SHORT_MAX_AGE = 60 * 60 * 12;

type SupabaseConfig = {
  url: string;
  anonKey: string;
  adminEmail: string;
};

type SessionTokens = {
  access_token: string;
  refresh_token: string;
};

type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  path: string;
  maxAge: number;
};

export type LoginResult =
  { ok: true } | { ok: false; error: "config" | "credentials" | "forbidden" | "unavailable" };

export type SessionResult = { user: { email: string } } | { user: null; error?: "config" };

export type LogoutResult = { ok: true };

function env(name: string): string | undefined {
  const runtime = globalThis as {
    process?: { env?: Record<string, string | undefined> };
    __RUNTIME_ENV__?: Record<string, unknown>;
  };

  const fromProcess = runtime.process?.env?.[name]?.trim();
  if (fromProcess) return fromProcess;

  const binding = runtime.__RUNTIME_ENV__?.[name];
  if (typeof binding === "string" && binding.trim().length > 0) {
    return binding.trim();
  }

  return undefined;
}

function getSupabaseConfig(): SupabaseConfig | null {
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

function sessionCookieOptions(maxAge: number): CookieOptions {
  return {
    httpOnly: true,
    secure: env("NODE_ENV") === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

const writeSessionCookie = createServerOnlyFn((tokens: SessionTokens, maxAge: number) => {
  setCookie(SESSION_COOKIE, JSON.stringify(tokens), sessionCookieOptions(maxAge));
});

const clearSessionCookie = createServerOnlyFn(() => {
  deleteCookie(SESSION_COOKIE, { path: "/" });
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  password: z.string().min(1).max(200),
  remember: z.boolean().optional().default(false),
});

export const loginFn = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof loginSchema>) => loginSchema.parse(input))
  .handler(async ({ data }): Promise<LoginResult> => {
    const config = getSupabaseConfig();
    if (!config) {
      console.error(
        "[auth] Faltan SUPABASE_URL, SUPABASE_ANON_KEY o ADMIN_EMAIL en el entorno del servidor.",
      );
      return { ok: false, error: "config" };
    }

    const supabase = createSupabaseClient(config.url, config.anonKey);
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      const invalidCredentials =
        error.code === "invalid_credentials" || error.message === "Invalid login credentials";

      if (!invalidCredentials) {
        console.error("[auth] Supabase Auth login failed.", {
          name: error.name,
          status: error.status,
          code: error.code,
          message: error.message,
        });
      }

      return { ok: false, error: invalidCredentials ? "credentials" : "unavailable" };
    }

    if (!signInData.session) {
      console.error("[auth] Supabase Auth returned no session and no error.");
      return { ok: false, error: "unavailable" };
    }

    const email = signInData.user?.email?.toLowerCase();
    if (!email || email !== config.adminEmail) {
      await supabase.auth.signOut();
      return { ok: false, error: "forbidden" };
    }

    const maxAge = data.remember ? SESSION_MAX_AGE : SESSION_SHORT_MAX_AGE;
    writeSessionCookie(
      {
        access_token: signInData.session.access_token,
        refresh_token: signInData.session.refresh_token,
      },
      maxAge,
    );

    return { ok: true };
  });

export const getAdminSessionForServer = createServerOnlyFn(async (): Promise<SessionResult> => {
  const raw = getCookie(SESSION_COOKIE);
  if (!raw) return { user: null };

  const config = getSupabaseConfig();
  if (!config) {
    console.error(
      "[auth] Faltan SUPABASE_URL, SUPABASE_ANON_KEY o ADMIN_EMAIL en el entorno del servidor.",
    );
    return { user: null, error: "config" };
  }

  let tokens: SessionTokens | null = null;
  try {
    const parsed = JSON.parse(raw) as Partial<SessionTokens> | null;
    if (
      parsed &&
      typeof parsed.access_token === "string" &&
      typeof parsed.refresh_token === "string"
    ) {
      tokens = {
        access_token: parsed.access_token,
        refresh_token: parsed.refresh_token,
      };
    }
  } catch {
    tokens = null;
  }

  if (!tokens) {
    clearSessionCookie();
    return { user: null };
  }

  const supabase = createSupabaseClient(config.url, config.anonKey);
  const { data: userData, error: userError } = await supabase.auth.getUser(tokens.access_token);

  let email = userData.user?.email?.toLowerCase();

  if (userError || !email) {
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
      refresh_token: tokens.refresh_token,
    });

    if (refreshError || !refreshData.session) {
      clearSessionCookie();
      return { user: null };
    }

    email = refreshData.user?.email?.toLowerCase();
    if (!email || email !== config.adminEmail) {
      clearSessionCookie();
      return { user: null };
    }

    writeSessionCookie(
      {
        access_token: refreshData.session.access_token,
        refresh_token: refreshData.session.refresh_token,
      },
      SESSION_MAX_AGE,
    );
    return { user: { email } };
  }

  if (!email || email !== config.adminEmail) {
    clearSessionCookie();
    return { user: null };
  }

  return { user: { email } };
});

export const sessionFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<SessionResult> => getAdminSessionForServer(),
);

export const logoutFn = createServerFn({ method: "POST" }).handler(
  async (): Promise<LogoutResult> => {
    clearSessionCookie();
    return { ok: true };
  },
);
