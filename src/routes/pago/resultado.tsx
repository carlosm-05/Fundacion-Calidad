import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CustomerAuthShell } from "@/components/CustomerAuthShell";
import { customerSessionFn } from "@/lib/customer-auth-server";
import { getCustomerPurchaseFn, getDonationPaymentStatusFn } from "@/lib/purchase-server";

export const Route = createFileRoute("/pago/resultado")({
  validateSearch: (search) =>
    z
      .object({
        purchase: z.string().uuid().optional(),
        donation: z.string().uuid().optional(),
      })
      .parse(search),
  loader: async ({ location }) => {
    const params = new URLSearchParams(location.searchStr);
    const donationId = params.get("donation");
    if (donationId) {
      return {
        type: "donation" as const,
        result: await getDonationPaymentStatusFn({ data: { donationId } }),
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
    return (
      <CustomerAuthShell
        title={paid ? "Donación confirmada" : "Estado de tu donación"}
        description="La confirmación definitiva del pago se recibe de forma segura desde Wompi."
      >
        <div className="space-y-4">
          <Alert>
            <AlertTitle>
              {paid
                ? "Donación confirmada"
                : failed
                  ? "El pago no fue aprobado"
                  : "Pago pendiente de confirmación"}
            </AlertTitle>
            <AlertDescription>
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: donation.currency,
                maximumFractionDigits: 0,
              }).format(donation.amount_cents / 100)}
              . Actualiza esta página en un momento para consultar el estado más reciente.
            </AlertDescription>
          </Alert>
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
