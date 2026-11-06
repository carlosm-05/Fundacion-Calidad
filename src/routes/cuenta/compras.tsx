import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CustomerAuthShell } from "@/components/CustomerAuthShell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { customerSessionFn, logoutCustomerFn } from "@/lib/customer-auth-server";
import { getCustomerPurchasesFn, type CustomerPurchase } from "@/lib/purchase-server";

export const Route = createFileRoute("/cuenta/compras")({
  beforeLoad: async () => {
    const session = await customerSessionFn();
    if (!session.user) throw redirect({ to: "/cuenta/login" });
    return { customer: session.user };
  },
  component: CustomerPurchasesPage,
});

function price(amountCents: number, currency: string) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
}

function CustomerPurchasesPage() {
  const { customer } = Route.useRouteContext();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<CustomerPurchase[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getCustomerPurchasesFn()
      .then((result) => {
        if (!active) return;
        if (!result.ok) {
          setError("No se pudo cargar tu historial. Vuelve a iniciar sesión e inténtalo otra vez.");
        } else {
          setPurchases(result.purchases);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError("No se pudo cargar tu historial. Vuelve a iniciar sesión e inténtalo otra vez.");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function logout() {
    await logoutCustomerFn();
    await navigate({ to: "/cuenta/login" });
  }

  return (
    <CustomerAuthShell
      title={`Hola, ${customer.firstName}`}
      description={`Cuenta de cliente: ${customer.email}`}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-foreground">Mis compras</h2>
        <Button type="button" variant="outline" size="sm" onClick={() => void logout()}>
          Cerrar sesión
        </Button>
      </div>
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>No se pudo cargar el historial</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : loading ? (
        <p className="text-sm text-muted-foreground">Cargando compras…</p>
      ) : purchases.length ? (
        <div className="space-y-3">
          {purchases.map((purchase) => (
            <Card key={purchase.id} className="border-border/70">
              <CardContent className="py-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{purchase.service_name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(purchase.created_at).toLocaleString("es-CO")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {price(purchase.amount_cents, purchase.currency)}
                    </p>
                    <p className="mt-1 text-xs capitalize text-muted-foreground">
                      {purchase.status} · pago {purchase.payment_status}
                    </p>
                  </div>
                </div>
                {purchase.payment_transaction_id ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Referencia de transacción: {purchase.payment_transaction_id}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3 text-center">
          <p className="text-sm text-muted-foreground">Todavía no tienes compras.</p>
          <Link
            to="/productos-servicios"
            className="inline-flex text-sm font-medium text-primary hover:underline"
          >
            Explorar servicios
          </Link>
        </div>
      )}
    </CustomerAuthShell>
  );
}
