import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CustomerAuthShell } from "@/components/CustomerAuthShell";
import { customerSessionFn, registerCustomerFn } from "@/lib/customer-auth-server";
import { startServicePurchaseFn } from "@/lib/purchase-server";

export const Route = createFileRoute("/cuenta/registro")({
  validateSearch: (search) => z.object({ serviceId: z.string().uuid().optional() }).parse(search),
  beforeLoad: async () => {
    const session = await customerSessionFn();
    if (session.user) throw redirect({ to: "/cuenta/compras" });
  },
  component: RegisterPage,
});

function RegisterPage() {
  const { serviceId } = Route.useSearch();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const values = new FormData(event.currentTarget);
    const password = String(values.get("password") ?? "");
    if (password !== String(values.get("confirmPassword") ?? "")) {
      setError("Las contraseñas no coinciden.");
      setBusy(false);
      return;
    }

    try {
      const result = await registerCustomerFn({
        data: {
          firstName: String(values.get("firstName") ?? ""),
          lastName: String(values.get("lastName") ?? ""),
          email: String(values.get("email") ?? ""),
          password,
          serviceId,
        },
      });
      if (!result.ok) {
        setError(
          result.error === "config"
            ? "El registro no está configurado. Revisa las variables de Supabase y APP_URL."
            : result.error === "forbidden"
              ? "El correo del administrador no puede registrarse como cliente."
              : "No se pudo crear la cuenta. Revisa los datos o intenta iniciar sesión.",
        );
        return;
      }
      if (result.requiresEmailConfirmation) {
        setNotice("Revisa tu correo y confirma la cuenta antes de iniciar sesión.");
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
            ? "Tu cuenta quedó creada, pero el pago todavía no está configurado."
            : "Tu cuenta quedó creada. Inicia sesión para continuar la compra.",
        );
        return;
      }
      await navigate({ to: "/productos-servicios" });
    } catch {
      setError("No se pudo completar el registro. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <CustomerAuthShell
      title="Crear cuenta de cliente"
      description="Regístrate para comprar servicios y consultar tus compras."
    >
      {error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>No se pudo crear la cuenta</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <form onSubmit={submit} className="space-y-4">
        <label className="block space-y-1.5 text-sm font-medium">
          Nombre
          <Input name="firstName" required autoComplete="given-name" maxLength={100} />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          Apellidos
          <Input name="lastName" required autoComplete="family-name" maxLength={100} />
        </label>
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
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          Confirmar contraseña
          <Input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Creando cuenta…" : "Crear cuenta"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link
          to="/cuenta/login"
          search={serviceId ? { serviceId } : {}}
          className="font-medium text-primary hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
      <Dialog open={Boolean(notice)} onOpenChange={(open) => !open && setNotice(null)}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader className="items-center">
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MailCheck className="h-7 w-7" aria-hidden="true" />
            </div>
            <DialogTitle>Revisa tu correo</DialogTitle>
            <DialogDescription>{notice}</DialogDescription>
          </DialogHeader>
          <Button type="button" className="w-full" onClick={() => setNotice(null)}>
            Entendido
          </Button>
        </DialogContent>
      </Dialog>
    </CustomerAuthShell>
  );
}
