import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerAuthShell } from "@/components/CustomerAuthShell";
import { requestCustomerPasswordResetFn } from "@/lib/customer-auth-server";

export const Route = createFileRoute("/cuenta/recuperar")({
  component: RecoverPasswordPage,
});

function RecoverPasswordPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const values = new FormData(event.currentTarget);
    try {
      const result = await requestCustomerPasswordResetFn({
        data: { email: String(values.get("email") ?? "") },
      });
      if (!result.ok) {
        setError(
          result.error === "config"
            ? "El servicio no está configurado. Revisa las variables de Supabase y APP_URL."
            : "No se pudo enviar el correo. Inténtalo de nuevo más tarde.",
        );
        return;
      }
      setSent(true);
    } catch {
      setError("No se pudo enviar el correo. Inténtalo de nuevo más tarde.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <CustomerAuthShell
      title="Recuperar contraseña"
      description="Te enviaremos un enlace para restablecer la contraseña de tu cuenta."
    >
      {error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>No se pudo enviar el enlace</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {sent ? (
        <Alert>
          <AlertTitle>Revisa tu correo</AlertTitle>
          <AlertDescription>
            Si existe una cuenta con ese correo, recibirás instrucciones para recuperar el acceso.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-1.5 text-sm font-medium">
            Correo electrónico
            <Input name="email" type="email" required autoComplete="email" maxLength={320} />
          </label>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Enviando…" : "Enviar enlace"}
          </Button>
        </form>
      )}
      <p className="mt-5 text-center text-sm text-muted-foreground">
        <Link to="/cuenta/login" className="font-medium text-primary hover:underline">
          Volver al inicio de sesión
        </Link>
      </p>
    </CustomerAuthShell>
  );
}
