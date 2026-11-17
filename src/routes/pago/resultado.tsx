import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CustomerAuthShell } from "@/components/CustomerAuthShell";
import { customerSessionFn } from "@/lib/customer-auth-server";
import {
  capturePayPalDonationFn,
  getCustomerPurchaseFn,
  getDonationPaymentStatusFn,
} from "@/lib/purchase-server";

export const Route = createFileRoute("/pago/resultado")({
  validateSearch: (search) =>
    z
      .object({
        purchase: z.string().uuid().optional(),
        donation: z.string().uuid().optional(),
        token: z
          .string()
          .regex(/^[A-Za-z0-9-]{1,64}$/)
          .optional(),
        paypal_cancelled: z.enum(["1"]).optional(),
      })
      .parse(search),
  loader: async ({ location }) => {
    const params = new URLSearchParams(location.searchStr);
    const donationId = params.get("donation");
    if (donationId) {
      const paypalCancelled = params.get("paypal_cancelled") === "1";
      const paypalOrderId = params.get("token");
      const paypalCapture =
        paypalOrderId && !paypalCancelled
          ? await capturePayPalDonationFn({
              data: { donationId, orderId: paypalOrderId },
            })
          : null;
      return {
        type: "donation" as const,
        result: await getDonationPaymentStatusFn({ data: { donationId } }),
        paypalCapture,
        paypalCancelled,
      };
    }

    const purchaseId = params.get("purchase");
    if (!purchaseId) return { type: "missing" as const };
    const session = await customerSessionFn();
    if (!session.user) throw redirect({ to: "/cuenta/login" });
    return {
      type: "purchase" as const,
      result: await getCustomerPurchaseFn({ data: { purchaseId } }),
    };
  },
  component: PaymentResultPage,
});

function PaymentResultPage() {
  const result = Route.useLoaderData();
  if (result.type === "donation") {
    if (!result.result.ok) {
      return (
        <CustomerAuthShell
          title="No se encontró la donación"
          description="No pudimos consultar el estado de esta donación."
        >
          <Alert variant="destructive">
            <AlertTitle>Donación no disponible</AlertTitle>
            <AlertDescription>
              La donación no existe o no se pudo consultar. Si acabas de pagar, vuelve a intentarlo
              en un momento.
            </AlertDescription>
          </Alert>
          <Button asChild className="mt-5 w-full">
            <Link to="/donacion">Volver a donaciones</Link>
          </Button>
        </CustomerAuthShell>
      );
    }

    const donation = result.result.donation;
    const paid = donation.payment_status === "approved";
    const failed = ["declined", "error", "voided"].includes(donation.payment_status);
    const paypalCancelled = result.paypalCancelled && !paid;
    const amount =
      donation.amount_cents === null
        ? null
        : new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: donation.currency,
            maximumFractionDigits: donation.currency === "COP" ? 0 : 2,
          }).format(donation.amount_cents / 100);
    return (
      <CustomerAuthShell
        title={
          paid
            ? "Donación confirmada"
            : paypalCancelled
              ? "Checkout cancelado"
              : "Estado de tu donación"
        }
        description={
          donation.payment_method === "paypal"
            ? "PayPal confirma el pago de forma segura antes de actualizar la donación."
            : "La confirmación definitiva del pago se recibe de forma segura desde Wompi."
        }
      >
        <div className="space-y-4">
          <Alert>
            <AlertTitle>
              {paid
                ? "Donación confirmada"
                : paypalCancelled
                  ? "No se confirmó ningún pago"
                  : failed
                    ? "El pago no fue aprobado"
                    : "Pago pendiente de confirmación"}
            </AlertTitle>
            <AlertDescription>
              {paypalCancelled
                ? "El checkout de PayPal se canceló. Esta donación no se marcó como pagada."
                : amount
                  ? `${amount}. Actualiza esta página en un momento para consultar el estado más reciente.`
                  : "El estado se actualizará cuando la pasarela confirme el pago."}
            </AlertDescription>
          </Alert>
          {result.paypalCapture && !result.paypalCapture.ok ? (
            <p role="status" className="text-sm text-muted-foreground">
              No fue posible confirmar la captura ahora. Si completaste el pago, espera un momento y
              vuelve a consultar esta página.
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">Referencia: {donation.payment_reference}</p>
        </div>
        <Button asChild className="mt-5 w-full">
          <Link to="/donacion">Volver a donaciones</Link>
        </Button>
      </CustomerAuthShell>
    );
  }

  if (result.type === "missing" || !result.result.ok) {
    return (
      <CustomerAuthShell
        title="No se encontró la compra"
        description="No pudimos consultar esta compra en tu cuenta."
      >
        <Alert variant="destructive">
          <AlertTitle>Compra no disponible</AlertTitle>
          <AlertDescription>La compra no existe o no pertenece a tu cuenta.</AlertDescription>
        </Alert>
        <Button asChild className="mt-5 w-full">
          <Link to="/cuenta/compras">Ver mis compras</Link>
        </Button>
      </CustomerAuthShell>
    );
  }

  const purchase = result.result.purchase;
  const paid = purchase.payment_status === "approved";
  return (
    <CustomerAuthShell
      title={paid ? "Pago confirmado" : "Estado de tu compra"}
      description="La confirmación definitiva del pago se recibe de forma segura desde la pasarela."
    >
      <div className="space-y-4">
        <Alert>
          <AlertTitle>
            {paid
              ? "Pago confirmado"
              : purchase.payment_status === "declined" ||
                  purchase.payment_status === "error" ||
                  purchase.payment_status === "voided"
                ? "El pago no fue aprobado"
                : "Pago pendiente de confirmación"}
          </AlertTitle>
          <AlertDescription>
            {purchase.service_name} ·{" "}
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: purchase.currency,
              maximumFractionDigits: 0,
            }).format(purchase.amount_cents / 100)}
            . Actualiza esta página en un momento para consultar el estado más reciente.
          </AlertDescription>
        </Alert>
        <p className="text-xs text-muted-foreground">Referencia: {purchase.payment_reference}</p>
      </div>
      <Button asChild className="mt-5 w-full">
        <Link to="/cuenta/compras">Ver mis compras</Link>
      </Button>
    </CustomerAuthShell>
  );
}
