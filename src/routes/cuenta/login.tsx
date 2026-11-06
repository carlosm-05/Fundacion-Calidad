import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerAuthShell } from "@/components/CustomerAuthShell";
import { customerSessionFn, loginCustomerFn } from "@/lib/customer-auth-server";
import { startServicePurchaseFn } from "@/lib/purchase-server";

export const Route = createFileRoute("/cuenta/login")({
  validateSearch: (search) => z.object({ serviceId: z.string().uuid().optional() }).parse(search),
  beforeLoad: async () => {
    const session = await customerSessionFn();
    if (session.user) throw redirect({ to: "/cuenta/compras" });
  },
  component: CustomerLoginPage,
});

function CustomerLoginPage() {
  const { serviceId } = Route.useSearch();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const values = new FormData(event.currentTarget);
    try {
      const result = await loginCustomerFn({
        data: {
          email: String(values.get("email") ?? ""),
          password: String(values.get("password") ?? ""),
        },
      });
      if (!result.ok) {
        setError(
          result.error === "config"
            ? "El inicio de sesión no está configurado. Revisa las variables de Supabase."
            : "No se pudo iniciar sesión. Revisa el correo y la contraseña de tu cuenta de cliente.",
        );
        return;
      }
      if (serviceId) {
        const purchase = await startServicePurchaseFn({ data: { serviceId } });
        if (purchase.ok) {
          window.location.assign(purchase.checkoutUrl);
          return;
        }
        setError(
          purchase.error === "config"
            ? "El pago todavía no está configurado."
            : "No se pudo iniciar la compra. Inténtalo desde el catálogo.",
        );
        return;
      }
      await navigate({ to: "/cuenta/compras" });
    } catch {
      setError("No se pudo completar la solicitud. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <CustomerAuthShell title="Iniciar sesión" description="Accede a tu cuenta de cliente.">
      {error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>No se pudo iniciar sesión</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <form onSubmit={submit} className="space-y-4">
        <label className="block space-y-1.5 text-sm font-medium">
          Correo electrónico
          <Input name="email" type="email" required autoComplete="email" maxLength={320} />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          Contraseña
          <Input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            maxLength={200}
          />
        </label>
        <div className="text-right text-sm">
          <Link to="/cuenta/recuperar" className="font-medium text-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Ingresando…" : "Ingresar"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link
          to="/cuenta/registro"
          search={serviceId ? { serviceId } : {}}
          className="font-medium text-primary hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </CustomerAuthShell>
  );
}
