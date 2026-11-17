import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getAdminSessionForServer } from "@/lib/auth-server";
import { customerSessionFn } from "@/lib/customer-auth-server";

type Purchase = {
  id: string;
  service_name: string;
  amount_cents: number;
  currency: string;
  status: string;
  payment_status: string;
  payment_reference: string;
  payment_transaction_id: string | null;
  created_at: string;
};

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

function getSupabaseAdminClient() {
  const url = env("SUPABASE_URL");
  const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function getWompiConfig() {
  const publicKey = env("WOMPI_PUBLIC_KEY");
  const integritySecret = env("WOMPI_INTEGRITY_SECRET");
  const eventsSecret = env("WOMPI_EVENTS_SECRET");
  const environment = env("WOMPI_ENVIRONMENT") ?? "test";
  if (
    !publicKey ||
    !integritySecret ||
    !eventsSecret ||
    !["test", "production"].includes(environment) ||
    (environment === "test" && !publicKey.startsWith("pub_test_")) ||
    (environment === "production" && !publicKey.startsWith("pub_prod_"))
  ) {
    return null;
  }
  return { publicKey, integritySecret, eventsSecret, environment };
}

function getPayPalConfig() {
  const clientId = env("PAYPAL_CLIENT_ID");
  const clientSecret = env("PAYPAL_CLIENT_SECRET");
  const webhookId = env("PAYPAL_WEBHOOK_ID");
  const environment = env("PAYPAL_ENVIRONMENT");
  if (
    !clientId ||
    !clientSecret ||
    !webhookId ||
    (environment !== "sandbox" && environment !== "live")
  ) {
    return null;
  }
  return {
    clientId,
    clientSecret,
    webhookId,
    apiBaseUrl:
      environment === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com",
  };
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function equalChecksums(actual: string, expected: string) {
  const normalizedActual = actual.trim().toLowerCase();
  const normalizedExpected = expected.trim().toLowerCase();
  if (
    !/^[\da-f]{64}$/.test(normalizedActual) ||
    normalizedActual.length !== normalizedExpected.length
  ) {
    return false;
  }
  let mismatch = 0;
  for (let index = 0; index < normalizedActual.length; index += 1) {
    mismatch |= normalizedActual.charCodeAt(index) ^ normalizedExpected.charCodeAt(index);
  }
  return mismatch === 0;
}

export type StartPurchaseResult =
  | { ok: true; checkoutUrl: string }
  | {
      ok: false;
      error: "unauthorized" | "config" | "service" | "price" | "database";
    };

const startPurchaseSchema = z.object({ serviceId: z.string().uuid() });

export const startServicePurchaseFn = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof startPurchaseSchema>) => startPurchaseSchema.parse(input))
  .handler(async ({ data }): Promise<StartPurchaseResult> => {
    const session = await customerSessionFn();
    if (!session.user) return { ok: false, error: "unauthorized" };

    const supabase = getSupabaseAdminClient();
    const wompi = getWompiConfig();
    if (!supabase || !wompi) return { ok: false, error: "config" };

    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("id,name,is_active,price_amount_cents")
      .eq("id", data.serviceId)
      .eq("is_active", true)
      .maybeSingle();

    if (serviceError) {
      console.error("[compras] No se pudo cargar el servicio:", serviceError);
      return { ok: false, error: "database" };
    }
    if (!service) return { ok: false, error: "service" };
    const amountCents = Number(service.price_amount_cents);
    if (!Number.isSafeInteger(amountCents) || amountCents < 1) {
      return { ok: false, error: "price" };
    }

    const paymentReference = `fc_${crypto.randomUUID().replaceAll("-", "")}`;
    const { data: purchase, error: purchaseError } = await supabase
      .from("purchases")
      .insert({
        customer_id: session.user.id,
        service_id: service.id,
        service_name: service.name,
        amount_cents: amountCents,
        currency: "COP",
        payment_reference: paymentReference,
      })
      .select("id")
      .single();

    if (purchaseError || !purchase) {
      console.error("[compras] No se pudo registrar la compra:", purchaseError);
      return { ok: false, error: "database" };
    }

    const signature = await sha256(`${paymentReference}${amountCents}COP${wompi.integritySecret}`);
    const appUrl = (env("APP_URL") ?? "http://localhost:8080").replace(/\/+$/, "");
    const checkout = new URL("https://checkout.wompi.co/p/");
    checkout.searchParams.set("public-key", wompi.publicKey);
    checkout.searchParams.set("currency", "COP");
    checkout.searchParams.set("amount-in-cents", String(amountCents));
    checkout.searchParams.set("reference", paymentReference);
    checkout.searchParams.set("signature:integrity", signature);
    checkout.searchParams.set("redirect-url", `${appUrl}/pago/resultado?purchase=${purchase.id}`);
    checkout.searchParams.set("customer-data:email", session.user.email);
    checkout.searchParams.set(
      "customer-data:full-name",
      `${session.user.firstName} ${session.user.lastName}`.trim(),
    );

    return { ok: true, checkoutUrl: checkout.toString() };
  });

const startDonationSchema = z.object({
  nombre: z.string().trim().min(1).max(200),
  correo: z.string().trim().email().max(320),
  telefono: z
    .string()
    .trim()
    .min(7)
    .max(50)
    .refine((value) => (value.match(/\d/g)?.length ?? 0) >= 7),
  monto: z.number().int().min(1000).max(100_000_000),
  website: z.string().max(0).optional(),
});

export type StartDonationResult =
  { ok: true; checkoutUrl: string } | { ok: false; error: "config" | "database" };

export const startDonationCheckoutFn = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof startDonationSchema>) => startDonationSchema.parse(input))
  .handler(async ({ data }): Promise<StartDonationResult> => {
    if (data.website) return { ok: false, error: "database" };

    const supabase = getSupabaseAdminClient();
    const wompi = getWompiConfig();
    if (!supabase || !wompi) return { ok: false, error: "config" };

    const amountCents = data.monto * 100;
    const paymentReference = `don_${crypto.randomUUID().replaceAll("-", "")}`;
    const { data: donation, error } = await supabase
      .from("donations")
      .insert({
        donor_name: data.nombre,
        donor_email: data.correo,
        donor_phone: data.telefono,
        amount_cents: amountCents,
        currency: "COP",
        payment_method: "wompi",
        payment_reference: paymentReference,
      })
      .select("id")
      .single();

    if (error || !donation) {
      console.error("[donaciones] No se pudo registrar la donación:", error);
      return { ok: false, error: "database" };
    }

    const signature = await sha256(`${paymentReference}${amountCents}COP${wompi.integritySecret}`);
    const appUrl = (env("APP_URL") ?? "http://localhost:8080").replace(/\/+$/, "");
    const checkout = new URL("https://checkout.wompi.co/p/");
    checkout.searchParams.set("public-key", wompi.publicKey);
    checkout.searchParams.set("currency", "COP");
    checkout.searchParams.set("amount-in-cents", String(amountCents));
    checkout.searchParams.set("reference", paymentReference);
    checkout.searchParams.set("signature:integrity", signature);
    checkout.searchParams.set("redirect-url", `${appUrl}/pago/resultado?donation=${donation.id}`);
    checkout.searchParams.set("customer-data:email", data.correo);
    checkout.searchParams.set("customer-data:full-name", data.nombre);

    return { ok: true, checkoutUrl: checkout.toString() };
  });

const startPayPalDonationSchema = z.object({
  nombre: z.string().trim().min(1).max(200),
  correo: z.string().trim().email().max(320),
  telefono: z
    .string()
    .trim()
    .min(7)
    .max(50)
    .refine((value) => (value.match(/\d/g)?.length ?? 0) >= 7),
  monto: z
    .number()
    .finite()
    .min(1)
    .max(100_000)
    .refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 0.000001),
  website: z.string().max(0).optional(),
});

const payPalOrderCreationSchema = z.object({
  id: z.string().min(1),
  links: z.array(z.object({ rel: z.string(), href: z.string().url() })),
});

function getPayPalAppUrl() {
  const configuredUrl = env("APP_URL");
  if (!configuredUrl) {
    return env("NODE_ENV") === "production"
      ? "https://www.fundacioncalidad.org"
      : "http://localhost:8080";
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

function getPayPalApprovalUrl(links: Array<{ rel: string; href: string }>, apiBaseUrl: string) {
  const approvalLink = links.find((link) => link.rel === "approve" || link.rel === "payer-action");
  if (!approvalLink) return null;

  try {
    const url = new URL(approvalLink.href);
    const expectedHost = apiBaseUrl.includes("sandbox")
      ? "www.sandbox.paypal.com"
      : "www.paypal.com";
    if (url.protocol !== "https:" || url.hostname !== expectedHost) return null;
    return url.toString();
  } catch {
    return null;
  }
}

async function markPayPalDonationCheckoutFailed(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  donationId: string,
) {
  const { error } = await supabase
    .from("donations")
    .update({ status: "failed", payment_status: "error" })
    .eq("id", donationId)
    .eq("status", "pending");
  if (error) {
    console.error("[paypal] No se pudo marcar como fallido el inicio del checkout:", error);
  }
}

export type StartPayPalDonationResult =
  { ok: true; checkoutUrl: string } | { ok: false; error: "config" | "database" | "paypal" };

export const startPayPalDonationCheckoutFn = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof startPayPalDonationSchema>) =>
    startPayPalDonationSchema.parse(input),
  )
  .handler(async ({ data }): Promise<StartPayPalDonationResult> => {
    if (data.website) return { ok: false, error: "database" };

    const supabase = getSupabaseAdminClient();
    const payPal = getPayPalConfig();
    const appUrl = getPayPalAppUrl();
    if (!supabase || !payPal || !appUrl) return { ok: false, error: "config" };

    const amountCents = Math.round(data.monto * 100);
    const paymentReference = `paypal_checkout_${crypto.randomUUID().replaceAll("-", "")}`;
    const { data: donation, error: insertError } = await supabase
      .from("donations")
      .insert({
        donor_name: data.nombre,
        donor_email: data.correo,
        donor_phone: data.telefono,
        amount_cents: amountCents,
        currency: "USD",
        payment_method: "paypal",
        payment_reference: paymentReference,
      })
      .select("id")
      .single();

    if (insertError || !donation) {
      console.error("[paypal] No se pudo registrar la donación:", insertError);
      return { ok: false, error: "database" };
    }

    const accessToken = await getPayPalAccessToken(payPal);
    if (!accessToken) {
      await markPayPalDonationCheckoutFailed(supabase, donation.id);
      return { ok: false, error: "paypal" };
    }

    let response: Response;
    try {
      response = await fetch(`${payPal.apiBaseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${accessToken}`,
          accept: "application/json",
          "content-type": "application/json",
          "paypal-request-id": crypto.randomUUID(),
          prefer: "return=representation",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              custom_id: paymentReference,
              invoice_id: paymentReference,
              amount: {
                currency_code: "USD",
                value: (amountCents / 100).toFixed(2),
              },
              description: "Donación Fundación Calidad",
            },
          ],
          application_context: {
            brand_name: "Fundación Calidad",
            user_action: "PAY_NOW",
            shipping_preference: "NO_SHIPPING",
            return_url: `${appUrl}/pago/resultado?donation=${donation.id}`,
            cancel_url: `${appUrl}/pago/resultado?donation=${donation.id}&paypal_cancelled=1`,
          },
        }),
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      console.error("[paypal] No se pudo crear la orden de checkout.");
      await markPayPalDonationCheckoutFailed(supabase, donation.id);
      return { ok: false, error: "paypal" };
    }

    if (!response.ok) {
      console.error("[paypal] Falló la creación de la orden:", response.status);
      await markPayPalDonationCheckoutFailed(supabase, donation.id);
      return { ok: false, error: "paypal" };
    }

    let orderPayload: unknown;
    try {
      orderPayload = await response.json();
    } catch {
      console.error("[paypal] La respuesta de creación de orden no contenía JSON válido.");
      await markPayPalDonationCheckoutFailed(supabase, donation.id);
      return { ok: false, error: "paypal" };
    }

    const order = payPalOrderCreationSchema.safeParse(orderPayload);
    const checkoutUrl = order.success
      ? getPayPalApprovalUrl(order.data.links, payPal.apiBaseUrl)
      : null;
    if (!checkoutUrl) {
      console.error("[paypal] La respuesta de creación no incluyó un enlace de aprobación válido.");
      await markPayPalDonationCheckoutFailed(supabase, donation.id);
      return { ok: false, error: "paypal" };
    }

    return { ok: true, checkoutUrl };
  });

const donorRegistrationBaseSchema = z.object({
  nombre: z.string().trim().min(1).max(200),
  correo: z.string().trim().email().max(320),
  telefono: z
    .string()
    .trim()
    .min(7)
    .max(50)
    .refine((value) => (value.match(/\d/g)?.length ?? 0) >= 7),
  website: z.string().max(0).optional(),
});

const registerDonationSchema = donorRegistrationBaseSchema.extend({
  metodo: z.literal("daviplata"),
  monto: z.number().int().min(1000).max(100_000_000),
});

export type RegisterDonationResult =
  | { ok: true; donationId: string; paymentReference: string }
  | { ok: false; error: "config" | "database" };

export const registerOfflineDonationFn = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof registerDonationSchema>) => registerDonationSchema.parse(input))
  .handler(async ({ data }): Promise<RegisterDonationResult> => {
    if (data.website) return { ok: false, error: "database" };

    const supabase = getSupabaseAdminClient();
    if (!supabase) return { ok: false, error: "config" };

    const paymentReference = `davi_${crypto.randomUUID().replaceAll("-", "")}`;
    const amountCents = data.monto * 100;
    const { data: donation, error } = await supabase
      .from("donations")
      .insert({
        donor_name: data.nombre,
        donor_email: data.correo,
        donor_phone: data.telefono,
        amount_cents: amountCents,
        currency: "COP",
        payment_method: data.metodo,
        payment_reference: paymentReference,
      })
      .select("id,payment_reference")
      .single();

    if (error || !donation) {
      console.error("[donaciones] No se pudo registrar la intención:", error);
      return { ok: false, error: "database" };
    }

    return {
      ok: true,
      donationId: donation.id,
      paymentReference: donation.payment_reference,
    };
  });

const reviewDonationSchema = z.object({
  donationId: z.string().uuid(),
  action: z.enum(["approve", "reject"]),
});

export type AdminDonationReviewResult =
  | {
      ok: true;
      status: "paid" | "failed";
      payment_status: "approved" | "declined";
    }
  | {
      ok: false;
      error:
        "unauthorized" | "config" | "database" | "not_found" | "not_pending" | "unsupported_method";
    };

export const reviewOfflineDonationFn = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof reviewDonationSchema>) => reviewDonationSchema.parse(input))
  .handler(async ({ data }): Promise<AdminDonationReviewResult> => {
    const session = await getAdminSessionForServer();
    if (!session.user) return { ok: false, error: "unauthorized" };

    const supabase = getSupabaseAdminClient();
    if (!supabase) return { ok: false, error: "config" };

    const { data: donation, error: loadError } = await supabase
      .from("donations")
      .select("id,status,payment_method,payment_reference")
      .eq("id", data.donationId)
      .maybeSingle();
    if (loadError) {
      console.error("[donaciones] No se pudo cargar la donación para revisión:", loadError);
      return { ok: false, error: "database" };
    }
    if (!donation) return { ok: false, error: "not_found" };
    if (donation.payment_method !== "daviplata" && donation.payment_method !== "paypal") {
      return { ok: false, error: "unsupported_method" };
    }
    if (
      donation.payment_method === "paypal" &&
      donation.payment_reference.startsWith("paypal_checkout_")
    ) {
      return { ok: false, error: "unsupported_method" };
    }
    if (donation.status !== "pending") return { ok: false, error: "not_pending" };

    const status = data.action === "approve" ? "paid" : "failed";
    const paymentStatus = data.action === "approve" ? "approved" : "declined";
    const { data: updatedDonation, error: updateError } = await supabase
      .from("donations")
      .update({ status, payment_status: paymentStatus })
      .eq("id", donation.id)
      .eq("status", "pending")
      .in("payment_method", ["daviplata", "paypal"])
      .select("id")
      .maybeSingle();

    if (updateError) {
      console.error("[donaciones] No se pudo actualizar el estado de la donación:", updateError);
      return { ok: false, error: "database" };
    }
    if (!updatedDonation) return { ok: false, error: "not_pending" };
    return { ok: true, status, payment_status: paymentStatus };
  });

export type CustomerPurchase = Purchase;

export const getCustomerPurchasesFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ ok: true; purchases: CustomerPurchase[] } | { ok: false }> => {
    const session = await customerSessionFn();
    if (!session.user) return { ok: false };
    const supabase = getSupabaseAdminClient();
    if (!supabase) return { ok: false };

    const { data, error } = await supabase
      .from("purchases")
      .select(
        "id,service_name,amount_cents,currency,status,payment_status,payment_reference,payment_transaction_id,created_at",
      )
      .eq("customer_id", session.user.id)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[compras] No se pudo cargar el historial del cliente:", error);
      return { ok: false };
    }
    return { ok: true, purchases: data };
  },
);

const customerPurchaseSchema = z.object({ purchaseId: z.string().uuid() });

export const getCustomerPurchaseFn = createServerFn({ method: "GET" })
  .validator((input: z.infer<typeof customerPurchaseSchema>) => customerPurchaseSchema.parse(input))
  .handler(async ({ data }) => {
    const session = await customerSessionFn();
    if (!session.user) return { ok: false as const, error: "unauthorized" as const };
    const supabase = getSupabaseAdminClient();
    if (!supabase) return { ok: false as const, error: "config" as const };

    const { data: purchase, error } = await supabase
      .from("purchases")
      .select(
        "id,service_name,amount_cents,currency,status,payment_status,payment_reference,payment_transaction_id,created_at",
      )
      .eq("id", data.purchaseId)
      .eq("customer_id", session.user.id)
      .maybeSingle();
    if (error) {
      console.error("[compras] No se pudo cargar el resultado de pago:", error);
      return { ok: false as const, error: "database" as const };
    }
    if (!purchase) return { ok: false as const, error: "not_found" as const };
    return { ok: true as const, purchase: purchase as CustomerPurchase };
  });

export type DonationPaymentStatus = {
  id: string;
  amount_cents: number | null;
  currency: string;
  status: string;
  payment_status: string;
  payment_method: "wompi" | "daviplata" | "paypal";
  payment_reference: string;
  created_at: string;
};

const donationPaymentSchema = z.object({ donationId: z.string().uuid() });

export const getDonationPaymentStatusFn = createServerFn({ method: "GET" })
  .validator((input: z.infer<typeof donationPaymentSchema>) => donationPaymentSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdminClient();
    if (!supabase) return { ok: false as const, error: "config" as const };

    const { data: donation, error } = await supabase
      .from("donations")
      .select(
        "id,amount_cents,currency,status,payment_status,payment_method,payment_reference,created_at",
      )
      .eq("id", data.donationId)
      .maybeSingle();
    if (error) {
      console.error("[donaciones] No se pudo consultar el estado del pago:", error);
      return { ok: false as const, error: "database" as const };
    }
    if (!donation) return { ok: false as const, error: "not_found" as const };
    return { ok: true as const, donation: donation as DonationPaymentStatus };
  });

export type AdminPurchase = Purchase & {
  customer: { email: string; first_name: string; last_name: string } | null;
};

export const getAdminPurchasesFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<
    | { ok: true; purchases: AdminPurchase[] }
    | { ok: false; error: "unauthorized" | "config" | "database" }
  > => {
    const session = await getAdminSessionForServer();
    if (!session.user) return { ok: false, error: "unauthorized" };
    const supabase = getSupabaseAdminClient();
    if (!supabase) return { ok: false, error: "config" };

    const { data: purchases, error } = await supabase
      .from("purchases")
      .select(
        "id,customer_id,service_name,amount_cents,currency,status,payment_status,payment_reference,payment_transaction_id,created_at",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      console.error("[compras] No se pudieron cargar las compras para el administrador:", error);
      return { ok: false, error: "database" };
    }

    const customerIds = [...new Set(purchases.map((purchase) => purchase.customer_id))];
    const { data: customers, error: customerError } = customerIds.length
      ? await supabase
          .from("profiles")
          .select("id,email,first_name,last_name")
          .in("id", customerIds)
      : { data: [], error: null };
    if (customerError) {
      console.error("[compras] No se pudieron cargar los datos de clientes:", customerError);
      return { ok: false, error: "database" };
    }

    const byId = new Map(customers.map((customer) => [customer.id, customer]));
    return {
      ok: true,
      purchases: purchases.map(({ customer_id, ...purchase }) => ({
        ...purchase,
        customer: byId.get(customer_id) ?? null,
      })),
    };
  },
);

export type AdminDonation = Omit<DonationPaymentStatus, "amount_cents"> & {
  amount_cents: number | null;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  payment_method: "wompi" | "daviplata" | "paypal";
  payment_transaction_id: string | null;
};

export const getAdminDonationsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<
    | { ok: true; donations: AdminDonation[] }
    | { ok: false; error: "unauthorized" | "config" | "database" }
  > => {
    const session = await getAdminSessionForServer();
    if (!session.user) return { ok: false, error: "unauthorized" };
    const supabase = getSupabaseAdminClient();
    if (!supabase) return { ok: false, error: "config" };

    const { data, error } = await supabase
      .from("donations")
      .select(
        "id,donor_name,donor_email,donor_phone,amount_cents,currency,status,payment_status,payment_method,payment_reference,payment_transaction_id,created_at",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      console.error("[donaciones] No se pudieron cargar las donaciones:", error);
      return { ok: false, error: "database" };
    }
    return { ok: true, donations: data };
  },
);

const wompiEventSchema = z.object({
  event: z.string(),
  environment: z.enum(["test", "prod"]),
  timestamp: z.number().int(),
  data: z.object({ transaction: z.record(z.string(), z.unknown()) }),
  signature: z.object({
    properties: z.array(z.string()).min(1).max(20),
    checksum: z.string().min(64).max(64),
  }),
});

function getEventProperty(eventData: Record<string, unknown>, property: string) {
  const parts = property.split(".");
  if (parts[0] !== "transaction" || parts.length < 2) return undefined;
  let value: unknown = eventData;
  for (const part of parts) {
    if (typeof value !== "object" || value === null || !Object.hasOwn(value, part)) {
      return undefined;
    }
    value = (value as Record<string, unknown>)[part];
  }
  return value;
}

async function processWompiDonationEvent(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  reference: string,
  transactionId: string,
  amount: number,
  status: string,
) {
  const { data: donation, error } = await supabase
    .from("donations")
    .select("id,amount_cents,currency,status,payment_transaction_id")
    .eq("payment_reference", reference)
    .maybeSingle();
  if (error) {
    console.error("[donaciones] No se pudo verificar la referencia de Wompi:", error);
    return { ok: false as const, status: 500 };
  }
  if (!donation) {
    console.warn("[donaciones] Evento Wompi recibido para una referencia no registrada.");
    return { ok: true as const };
  }
  if (Number(donation.amount_cents) !== amount || donation.currency !== "COP") {
    console.error("[donaciones] El monto o la moneda del evento no coincide con la donación.");
    return { ok: false as const, status: 400 };
  }
  if (donation.payment_transaction_id === transactionId || donation.status === "paid") {
    return { ok: true as const };
  }
  if (donation.payment_transaction_id) {
    console.error("[donaciones] La donación ya está asociada a otra transacción de Wompi.");
    return { ok: false as const, status: 409 };
  }

  const statusMap: Record<string, { donation: string; payment: string }> = {
    APPROVED: { donation: "paid", payment: "approved" },
    DECLINED: { donation: "failed", payment: "declined" },
    ERROR: { donation: "failed", payment: "error" },
    VOIDED: { donation: "cancelled", payment: "voided" },
  };
  const mappedStatus = statusMap[status];
  if (!mappedStatus || donation.status !== "pending") return { ok: true as const };

  const { error: updateError } = await supabase
    .from("donations")
    .update({
      status: mappedStatus.donation,
      payment_status: mappedStatus.payment,
      payment_transaction_id: transactionId,
    })
    .eq("id", donation.id)
    .eq("status", "pending");
  if (updateError) {
    console.error("[donaciones] No se pudo actualizar el estado del pago:", updateError);
    return { ok: false as const, status: 500 };
  }
  return { ok: true as const };
}

export async function processWompiEvent(input: unknown) {
  const wompi = getWompiConfig();
  if (!wompi) return { ok: false as const, status: 503 };
  const parsed = wompiEventSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, status: 400 };
  const event = parsed.data;
  const expectedEnvironment = wompi.environment === "production" ? "prod" : "test";
  if (event.environment !== expectedEnvironment) return { ok: false as const, status: 401 };

  const values = event.signature.properties.map((property) =>
    getEventProperty(event.data, property),
  );
  if (values.some((value) => value === undefined || value === null)) {
    return { ok: false as const, status: 400 };
  }
  const checksum = await sha256(
    `${values.map(String).join("")}${event.timestamp}${wompi.eventsSecret}`,
  );
  if (!equalChecksums(event.signature.checksum, checksum)) {
    return { ok: false as const, status: 401 };
  }
  if (event.event !== "transaction.updated") return { ok: true as const };

  const transaction = event.data.transaction;
  const reference = transaction["reference"];
  const transactionId = transaction["id"];
  const amount = Number(transaction["amount_in_cents"]);
  const currency = transaction["currency"];
  const status = transaction["status"];
  if (
    typeof reference !== "string" ||
    typeof transactionId !== "string" ||
    !Number.isSafeInteger(amount) ||
    currency !== "COP" ||
    typeof status !== "string"
  ) {
    return { ok: false as const, status: 400 };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) return { ok: false as const, status: 503 };
  if (reference.startsWith("don_")) {
    return processWompiDonationEvent(supabase, reference, transactionId, amount, status);
  }

  const { data: purchase, error: lookupError } = await supabase
    .from("purchases")
    .select("id,amount_cents,currency,status,payment_transaction_id")
    .eq("payment_reference", reference)
    .maybeSingle();
  if (lookupError) {
    console.error("[compras] No se pudo verificar la referencia de Wompi:", lookupError);
    return { ok: false as const, status: 500 };
  }
  if (!purchase) {
    console.warn("[compras] Evento Wompi recibido para una referencia no registrada.");
    return { ok: true as const };
  }
  if (Number(purchase.amount_cents) !== amount || purchase.currency !== currency) {
    console.error("[compras] El monto o la moneda del evento Wompi no coincide con la compra.");
    return { ok: false as const, status: 400 };
  }
  if (purchase.payment_transaction_id === transactionId || purchase.status === "paid") {
    return { ok: true as const };
  }
  if (purchase.payment_transaction_id) {
    console.error("[compras] La compra ya está asociada a otra transacción de Wompi.");
    return { ok: false as const, status: 409 };
  }

  const statusMap: Record<string, { purchase: string; payment: string }> = {
    APPROVED: { purchase: "paid", payment: "approved" },
    DECLINED: { purchase: "failed", payment: "declined" },
    ERROR: { purchase: "failed", payment: "error" },
    VOIDED: { purchase: "cancelled", payment: "voided" },
  };
  const mappedStatus = statusMap[status];
  if (!mappedStatus || purchase.status !== "pending") return { ok: true as const };

  const { error: updateError } = await supabase
    .from("purchases")
    .update({
      status: mappedStatus.purchase,
      payment_status: mappedStatus.payment,
      payment_transaction_id: transactionId,
    })
    .eq("id", purchase.id)
    .eq("status", "pending");
  if (updateError) {
    console.error("[compras] No se pudo actualizar el estado del pago:", updateError);
    return { ok: false as const, status: 500 };
  }
  return { ok: true as const };
}

const payPalWebhookSchema = z.object({
  event_type: z.string().min(1),
  resource: z.record(z.string(), z.unknown()),
});

const payPalAccessTokenSchema = z.object({
  access_token: z.string().min(1),
});

const payPalWebhookVerificationSchema = z.object({
  verification_status: z.enum(["SUCCESS", "FAILURE"]),
});

async function getPayPalAccessToken(config: NonNullable<ReturnType<typeof getPayPalConfig>>) {
  let response: Response;
  try {
    response = await fetch(`${config.apiBaseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        authorization: `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`,
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    console.error("[paypal] No se pudo conectar para obtener el token OAuth.");
    return null;
  }

  if (!response.ok) {
    console.error("[paypal] Falló la autenticación OAuth:", response.status);
    return null;
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    console.error("[paypal] La respuesta OAuth no contenía JSON válido.");
    return null;
  }
  const parsed = payPalAccessTokenSchema.safeParse(payload);
  if (!parsed.success) {
    console.error("[paypal] La respuesta OAuth no incluyó un token.");
    return null;
  }
  return parsed.data.access_token;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const payPalOrderDetailsSchema = z.object({
  id: z.string().min(1),
  status: z.string().min(1),
  purchase_units: z
    .array(
      z.object({
        custom_id: z.string().optional(),
        invoice_id: z.string().optional(),
        amount: z.object({ currency_code: z.string(), value: z.string() }),
        payments: z
          .object({
            captures: z
              .array(
                z.object({
                  id: z.string().min(1),
                  status: z.string().min(1),
                  amount: z.object({ currency_code: z.string(), value: z.string() }),
                }),
              )
              .optional(),
          })
          .optional(),
      }),
    )
    .min(1),
});

const capturePayPalDonationSchema = z.object({
  donationId: z.string().uuid(),
  orderId: z.string().regex(/^[A-Za-z0-9-]{1,64}$/),
});

export type CapturePayPalDonationResult =
  | { ok: true; status: "paid" | "pending" }
  | {
      ok: false;
      error: "config" | "database" | "paypal" | "not_found" | "mismatch" | "not_pending";
    };

function parseUsdAmountCents(value: string, currency: string) {
  const amount = Number(value);
  if (
    currency !== "USD" ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !Number.isSafeInteger(Math.round(amount * 100)) ||
    Math.abs(amount * 100 - Math.round(amount * 100)) >= 0.000001
  ) {
    return null;
  }
  return Math.round(amount * 100);
}

export const capturePayPalDonationFn = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof capturePayPalDonationSchema>) =>
    capturePayPalDonationSchema.parse(input),
  )
  .handler(async ({ data }): Promise<CapturePayPalDonationResult> => {
    const supabase = getSupabaseAdminClient();
    const payPal = getPayPalConfig();
    if (!supabase || !payPal) return { ok: false, error: "config" };

    const accessToken = await getPayPalAccessToken(payPal);
    if (!accessToken) return { ok: false, error: "paypal" };

    let orderResponse: Response;
    try {
      orderResponse = await fetch(
        `${payPal.apiBaseUrl}/v2/checkout/orders/${encodeURIComponent(data.orderId)}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
            accept: "application/json",
          },
          signal: AbortSignal.timeout(10_000),
        },
      );
    } catch {
      console.error("[paypal] No se pudo consultar la orden de checkout.");
      return { ok: false, error: "paypal" };
    }

    if (!orderResponse.ok) {
      console.error("[paypal] Falló la consulta de la orden:", orderResponse.status);
      return { ok: false, error: "paypal" };
    }

    let orderPayload: unknown;
    try {
      orderPayload = await orderResponse.json();
    } catch {
      console.error("[paypal] La respuesta de consulta de orden no contenía JSON válido.");
      return { ok: false, error: "paypal" };
    }

    const parsedOrder = payPalOrderDetailsSchema.safeParse(orderPayload);
    if (!parsedOrder.success || parsedOrder.data.id !== data.orderId) {
      return { ok: false, error: "mismatch" };
    }

    let order = parsedOrder.data;
    if (order.purchase_units.length !== 1) return { ok: false, error: "mismatch" };
    let purchaseUnit = order.purchase_units[0];
    if (!purchaseUnit) return { ok: false, error: "mismatch" };

    const customId = purchaseUnit.custom_id;
    const invoiceId = purchaseUnit.invoice_id;
    if (!customId && !invoiceId) return { ok: false, error: "mismatch" };
    if (customId && invoiceId && customId !== invoiceId) return { ok: false, error: "mismatch" };
    const paymentReference = customId || invoiceId;
    if (!paymentReference) return { ok: false, error: "mismatch" };

    const orderAmountCents = parseUsdAmountCents(
      purchaseUnit.amount.value,
      purchaseUnit.amount.currency_code,
    );
    if (orderAmountCents === null) return { ok: false, error: "mismatch" };

    const { data: donation, error: loadError } = await supabase
      .from("donations")
      .select("id,status,payment_method,currency,amount_cents,payment_transaction_id")
      .eq("payment_reference", paymentReference)
      .maybeSingle();
    if (loadError) {
      console.error("[paypal] No se pudo cargar la donación de la orden:", loadError);
      return { ok: false, error: "database" };
    }
    if (!donation) return { ok: false, error: "not_found" };
    if (
      donation.id !== data.donationId ||
      donation.payment_method !== "paypal" ||
      donation.currency !== "USD" ||
      Number(donation.amount_cents) !== orderAmountCents
    ) {
      return { ok: false, error: "mismatch" };
    }
    if (donation.status !== "pending" && order.status !== "COMPLETED") {
      return { ok: false, error: "not_pending" };
    }

    if (order.status === "APPROVED") {
      let captureResponse: Response;
      try {
        captureResponse = await fetch(
          `${payPal.apiBaseUrl}/v2/checkout/orders/${encodeURIComponent(data.orderId)}/capture`,
          {
            method: "POST",
            headers: {
              authorization: `Bearer ${accessToken}`,
              accept: "application/json",
              "content-type": "application/json",
              "paypal-request-id": (await sha256(`capture:${data.orderId}`)).slice(0, 32),
            },
            body: JSON.stringify({}),
            signal: AbortSignal.timeout(10_000),
          },
        );
      } catch {
        console.error("[paypal] No se pudo capturar la orden aprobada.");
        return { ok: false, error: "paypal" };
      }

      if (!captureResponse.ok) {
        console.error("[paypal] Falló la captura de la orden:", captureResponse.status);
        return { ok: false, error: "paypal" };
      }

      let capturePayload: unknown;
      try {
        capturePayload = await captureResponse.json();
      } catch {
        console.error("[paypal] La respuesta de captura no contenía JSON válido.");
        return { ok: false, error: "paypal" };
      }
      const parsedCapture = payPalOrderDetailsSchema.safeParse(capturePayload);
      if (!parsedCapture.success || parsedCapture.data.id !== data.orderId) {
        return { ok: false, error: "mismatch" };
      }
      order = parsedCapture.data;
      if (order.purchase_units.length !== 1) return { ok: false, error: "mismatch" };
      purchaseUnit = order.purchase_units[0];
      if (!purchaseUnit) return { ok: false, error: "mismatch" };
    }

    if (order.status !== "COMPLETED") return { ok: true, status: "pending" };

    const finalCustomId = purchaseUnit.custom_id;
    const finalInvoiceId = purchaseUnit.invoice_id;
    if (
      (finalCustomId && finalCustomId !== paymentReference) ||
      (finalInvoiceId && finalInvoiceId !== paymentReference) ||
      (finalCustomId && finalInvoiceId && finalCustomId !== finalInvoiceId)
    ) {
      return { ok: false, error: "mismatch" };
    }

    const captures = purchaseUnit.payments?.captures ?? [];
    if (captures.length !== 1) return { ok: false, error: "mismatch" };
    const capture = captures[0];
    if (!capture || capture.status !== "COMPLETED") return { ok: true, status: "pending" };
    const capturedAmountCents = parseUsdAmountCents(
      capture.amount.value,
      capture.amount.currency_code,
    );
    if (
      capturedAmountCents === null ||
      capturedAmountCents !== orderAmountCents ||
      capturedAmountCents !== Number(donation.amount_cents)
    ) {
      return { ok: false, error: "mismatch" };
    }

    if (donation.status === "paid" && donation.payment_transaction_id === capture.id) {
      return { ok: true, status: "paid" };
    }
    if (donation.status !== "pending" || donation.payment_transaction_id) {
      return { ok: false, error: "not_pending" };
    }

    const { data: updatedDonation, error: updateError } = await supabase
      .from("donations")
      .update({
        amount_cents: capturedAmountCents,
        status: "paid",
        payment_status: "approved",
        payment_transaction_id: capture.id,
      })
      .eq("id", donation.id)
      .eq("status", "pending")
      .eq("payment_method", "paypal")
      .eq("currency", "USD")
      .eq("amount_cents", capturedAmountCents)
      .is("payment_transaction_id", null)
      .select("id")
      .maybeSingle();
    if (updateError) {
      console.error("[paypal] No se pudo confirmar la donación capturada:", updateError);
      return { ok: false, error: "database" };
    }
    if (updatedDonation) return { ok: true, status: "paid" };

    const { data: currentDonation, error: currentError } = await supabase
      .from("donations")
      .select("status,payment_transaction_id")
      .eq("id", donation.id)
      .maybeSingle();
    if (currentError) {
      console.error("[paypal] No se pudo comprobar el estado de la donación:", currentError);
      return { ok: false, error: "database" };
    }
    if (
      currentDonation?.status === "paid" &&
      currentDonation.payment_transaction_id === capture.id
    ) {
      return { ok: true, status: "paid" };
    }
    return { ok: false, error: "not_pending" };
  });

export async function processPayPalEvent(headers: Headers, payload: unknown) {
  const config = getPayPalConfig();
  if (!config) return { ok: false as const, status: 503 };

  const parsed = payPalWebhookSchema.safeParse(payload);
  if (!parsed.success) return { ok: false as const, status: 400 };

  const authAlgo = headers.get("paypal-auth-algo");
  const certUrl = headers.get("paypal-cert-url");
  const transmissionId = headers.get("paypal-transmission-id");
  const transmissionSignature = headers.get("paypal-transmission-sig");
  const transmissionTime = headers.get("paypal-transmission-time");
  if (!authAlgo || !certUrl || !transmissionId || !transmissionSignature || !transmissionTime) {
    return { ok: false as const, status: 400 };
  }

  const accessToken = await getPayPalAccessToken(config);
  if (!accessToken) return { ok: false as const, status: 503 };

  let verificationResponse: Response;
  try {
    verificationResponse = await fetch(
      `${config.apiBaseUrl}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${accessToken}`,
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          auth_algo: authAlgo,
          cert_url: certUrl,
          transmission_id: transmissionId,
          transmission_sig: transmissionSignature,
          transmission_time: transmissionTime,
          webhook_id: config.webhookId,
          webhook_event: payload,
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    console.error("[paypal] No se pudo verificar la firma del webhook.");
    return { ok: false as const, status: 503 };
  }

  if (!verificationResponse.ok) {
    console.error("[paypal] Falló la verificación del webhook:", verificationResponse.status);
    return { ok: false as const, status: 503 };
  }

  let verificationPayload: unknown;
  try {
    verificationPayload = await verificationResponse.json();
  } catch {
    console.error("[paypal] La respuesta de verificación no contenía JSON válido.");
    return { ok: false as const, status: 503 };
  }
  const verification = payPalWebhookVerificationSchema.safeParse(verificationPayload);
  if (!verification.success) return { ok: false as const, status: 503 };
  if (verification.data.verification_status !== "SUCCESS") {
    console.warn("[paypal] Se rechazó un webhook con firma no válida.");
    return { ok: false as const, status: 401 };
  }

  const event = parsed.data;
  if (event.event_type !== "PAYMENT.CAPTURE.COMPLETED") return { ok: true as const };

  const resource = event.resource;
  if (resource["status"] !== "COMPLETED") return { ok: true as const };
  const captureId = resource["id"];
  const customId = resource["custom_id"];
  const invoiceId = resource["invoice_id"];
  if (
    typeof captureId !== "string" ||
    (customId !== undefined && typeof customId !== "string") ||
    (invoiceId !== undefined && typeof invoiceId !== "string")
  ) {
    return { ok: true as const };
  }
  if (customId && invoiceId && customId !== invoiceId) {
    console.warn("[paypal] El webhook no se pudo asociar a una referencia única.");
    return { ok: true as const };
  }
  const paymentReference = customId || invoiceId;
  if (!paymentReference) {
    console.warn("[paypal] Captura verificada sin referencia interna; requiere revisión manual.");
    return { ok: true as const };
  }

  const amountData = isRecord(resource["amount"]) ? resource["amount"] : null;
  const amountValue = amountData?.["value"];
  const currencyCode = amountData?.["currency_code"];
  const amount = typeof amountValue === "string" ? Number(amountValue) : Number.NaN;
  const amountCents = Math.round(amount * 100);
  if (
    currencyCode !== "USD" ||
    !Number.isSafeInteger(amountCents) ||
    amountCents < 100 ||
    amountCents > 10_000_000_000 ||
    Math.abs(amount * 100 - amountCents) > 0.000001
  ) {
    console.warn("[paypal] Captura verificada con importe o moneda no admitidos.");
    return { ok: true as const };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) return { ok: false as const, status: 503 };

  const { data: donation, error: loadError } = await supabase
    .from("donations")
    .select("id,status,payment_method,currency,amount_cents,payment_transaction_id")
    .eq("payment_reference", paymentReference)
    .maybeSingle();
  if (loadError) {
    console.error("[paypal] No se pudo cargar la donación vinculada al pago:", loadError);
    return { ok: false as const, status: 500 };
  }
  if (!donation || donation.payment_method !== "paypal" || donation.currency !== "USD") {
    console.warn("[paypal] Captura verificada sin una donación PayPal coincidente.");
    return { ok: true as const };
  }
  if (donation.payment_transaction_id === captureId && donation.status === "paid") {
    return { ok: true as const };
  }
  if (donation.status !== "pending" || donation.payment_transaction_id) {
    console.warn("[paypal] La donación vinculada ya no está pendiente.");
    return { ok: true as const };
  }
  if (donation.amount_cents === null || Number(donation.amount_cents) !== amountCents) {
    console.warn("[paypal] El importe del pago no coincide con el registro.");
    return { ok: true as const };
  }

  const { data: updatedDonation, error: updateError } = await supabase
    .from("donations")
    .update({
      amount_cents: amountCents,
      status: "paid",
      payment_status: "approved",
      payment_transaction_id: captureId,
    })
    .eq("id", donation.id)
    .eq("status", "pending")
    .eq("payment_method", "paypal")
    .eq("currency", "USD")
    .is("payment_transaction_id", null)
    .select("id")
    .maybeSingle();
  if (updateError) {
    console.error("[paypal] No se pudo aprobar la donación verificada:", updateError);
    return { ok: false as const, status: 500 };
  }
  if (!updatedDonation) return { ok: true as const };
  return { ok: true as const };
}
