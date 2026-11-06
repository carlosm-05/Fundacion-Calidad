import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CustomerAuthShell } from "@/components/CustomerAuthShell";
import { completeCustomerSessionFn } from "@/lib/customer-auth-server";
import { startServicePurchaseFn } from "@/lib/purchase-server";

export const Route = createFileRoute("/cuenta/confirmar")({
  validateSearch: (search) => z.object({ serviceId: z.string().uuid().optional() }).parse(search),
  component: ConfirmCustomerPage,
});

function ConfirmCustomerPage() {
  const { serviceId } = Route.useSearch();
  const navigate = useNavigate();
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const params = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");
    window.history.replaceState(null, "", window.location.pathname + window.location.search);

    if (!accessToken || !refreshToken || !["signup", "recovery"].includes(type ?? "")) {
      setError("El enlace expiró o no es válido. Solicita uno nuevo e inténtalo otra vez.");
      return;
    }

    void completeCustomerSessionFn({
      data: { access_token: accessToken, refresh_token: refreshToken },
    })
      .then((result) => {
        if (!result.ok) {
          setError("No se pudo validar el enlace. Solicita uno nuevo e inténtalo otra vez.");
          return;
        }
        if (type === "recovery") {
          void navigate({ to: "/cuenta/restablecer" });
        } else if (serviceId) {
          void startServicePurchaseFn({ data: { serviceId } })
            .then((purchase) => {
              if (purchase.ok) {
                window.location.assign(purchase.checkoutUrl);
                return;
              }
              setError(
                purchase.error === "config"
                  ? "Tu cuenta quedó confirmada, pero el pago todavía no está configurado."
                  : "Tu cuenta quedó confirmada. Inicia sesión para continuar la compra.",
              );
            })
            .catch(() => {
              setError("Tu cuenta quedó confirmada, pero no se pudo iniciar la compra.");
            });
        } else {
          void navigate({ to: "/productos-servicios" });
        }
      })
      .catch(() => {
        setError("No se pudo validar el enlace. Solicita uno nuevo e inténtalo otra vez.");
      });
  }, [navigate, serviceId]);

  return (
    <CustomerAuthShell
      title="Verificando enlace"
      description="Estamos validando tu correo de forma segura."
    >
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>No se pudo validar</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button
            type="button"
            variant="link"
            className="mt-2 px-0"
            onClick={() => void navigate({ to: "/cuenta/recuperar" })}
          >
            Solicitar otro enlace
          </Button>
        </Alert>
      ) : (
        <p className="text-sm text-muted-foreground">Validando la sesión…</p>
      )}
    </CustomerAuthShell>
  );
}
