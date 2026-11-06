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
