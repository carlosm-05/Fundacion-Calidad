import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerAuthShell } from "@/components/CustomerAuthShell";
import { customerSessionFn, updateCustomerPasswordFn } from "@/lib/customer-auth-server";

export const Route = createFileRoute("/cuenta/restablecer")({
  beforeLoad: async () => {
    const session = await customerSessionFn();
    if (!session.user) throw redirect({ to: "/cuenta/login" });
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const values = new FormData(event.currentTarget);
    const password = String(values.get("password") ?? "");
    if (password !== String(values.get("confirmPassword") ?? "")) {
      setError("Las contraseñas no coinciden.");
      setBusy(false);
      return;
    }

    try {
      const result = await updateCustomerPasswordFn({ data: { password } });
      if (!result.ok) {
        setError(
          result.error === "session"
            ? "El enlace expiró. Solicita uno nuevo."
            : "No se pudo actualizar la contraseña. Inténtalo otra vez.",
        );
        return;
      }
      await navigate({ to: "/cuenta/compras" });
    } catch {
      setError("No se pudo actualizar la contraseña. Inténtalo otra vez.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <CustomerAuthShell
      title="Crear nueva contraseña"
      description="Elige una contraseña de al menos 8 caracteres."
    >
      {error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>No se pudo cambiar la contraseña</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          {error.includes("enlace expiró") ? (
            <Link to="/cuenta/recuperar" className="mt-2 inline-block text-sm underline">
              Solicitar otro enlace
            </Link>
          ) : null}
        </Alert>
      ) : null}
      <form onSubmit={submit} className="space-y-4">
        <label className="block space-y-1.5 text-sm font-medium">
          Nueva contraseña
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
          {busy ? "Actualizando…" : "Guardar contraseña"}
        </Button>
      </form>
    </CustomerAuthShell>
  );
}
