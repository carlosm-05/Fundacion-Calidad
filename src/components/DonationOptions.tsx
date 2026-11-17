import { useState, type FormEvent } from "react";
import { CheckCircle2, Copy, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { donation } from "@/content/site";
import { registerOfflineDonationFn, startDonationCheckoutFn } from "@/lib/purchase-server";

type DonationMethodId = "wompi" | "daviplata" | "paypal";
type ReportStatus = "idle" | "sending" | "success" | "error" | "config";

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-secondary focus:outline-none";

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "COP" ? 0 : 2,
  }).format(amount);
}

export function DonationOptions() {
  const [methodId, setMethodId] = useState<DonationMethodId>("wompi");
  const [amount, setAmount] = useState("10000");
  const [status, setStatus] = useState<ReportStatus>("idle");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [hasRegisteredDonor, setHasRegisteredDonor] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedMethod =
    donation.methods.find((method) => method.id === methodId) ?? donation.methods[0];

  const isReady =
    selectedMethod.id === "wompi"
      ? true
      : selectedMethod.id === "daviplata"
        ? Boolean(selectedMethod.receiver)
        : Boolean(selectedMethod.link);
  const numericAmount = Number(amount);
  const minimumAmount = selectedMethod.currency === "COP" ? 1000 : 1;
  const maximumAmount = selectedMethod.currency === "COP" ? 100_000_000 : 100_000;
  const amountStep = selectedMethod.currency === "COP" ? 1 : 0.01;

  function updateAmount(nextAmount: string) {
    setAmount(nextAmount);
    setHasRegisteredDonor(false);
    if (status !== "sending") setStatus("idle");
  }

  function chooseMethod(nextMethodId: DonationMethodId) {
    const nextMethod = donation.methods.find((method) => method.id === nextMethodId);
    if (!nextMethod) return;
    setMethodId(nextMethodId);
    updateAmount(String(nextMethod.presets[0]));
    setHasRegisteredDonor(false);
    setStatus("idle");
  }

  function openDonationDialog(nextMethodId: DonationMethodId) {
    const nextMethod = donation.methods.find((method) => method.id === nextMethodId);
    if (!nextMethod) return;
    setMethodId(nextMethodId);
    setAmount(String(nextMethod.presets[0]));
    setHasRegisteredDonor(false);
    setStatus("idle");
    setDialogOpen(true);
  }

  async function copyDaviplataNumber() {
    if (selectedMethod.id !== "daviplata" || !selectedMethod.receiver) return;
    try {
      await navigator.clipboard.writeText(selectedMethod.receiver);
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyError(true);
    }
  }

  async function submitDonorDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending" || !isReady) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("sending");
    try {
      if (selectedMethod.id === "wompi") {
        const result = await startDonationCheckoutFn({
          data: {
            nombre: String(formData.get("nombre") ?? ""),
            correo: String(formData.get("correo") ?? ""),
            telefono: String(formData.get("telefono") ?? ""),
            monto: numericAmount,
            website: String(formData.get("website") ?? ""),
          },
        });
        if (result.ok) {
          window.location.assign(result.checkoutUrl);
          return;
        }
        setStatus(result.error === "config" ? "config" : "error");
        return;
      }

      const donor = {
        nombre: String(formData.get("nombre") ?? ""),
        correo: String(formData.get("correo") ?? ""),
        telefono: String(formData.get("telefono") ?? ""),
        website: String(formData.get("website") ?? ""),
      };

      const result =
        selectedMethod.id === "daviplata"
          ? await registerOfflineDonationFn({
              data: { ...donor, metodo: "daviplata", monto: numericAmount },
            })
          : await registerOfflineDonationFn({
              data: { ...donor, metodo: "paypal" },
            });
      if (result.ok) {
        if (selectedMethod.id === "paypal" && selectedMethod.link) {
          window.location.assign(selectedMethod.link);
          return;
        }
        setStatus("success");
        setHasRegisteredDonor(true);
        return;
      }
      setStatus(result.error === "config" ? "config" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mt-14">
      <div className="grid gap-6 sm:grid-cols-2">
        {donation.methods.map((method) => (
          <div
            key={method.id}
            className={`flex flex-col rounded-3xl border bg-card p-6 shadow-soft transition-all ${
              method.id === methodId ? "border-primary/50 ring-1 ring-primary/20" : "border-border"
            }`}
          >
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="donation-method"
                  value={method.id}
                  checked={method.id === methodId}
                  onChange={() => chooseMethod(method.id)}
                  className="h-4 w-4 accent-primary"
                />
                <span
                  className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                    method.id === "wompi"
                      ? "bg-[#27346a] text-white"
                      : method.id === "daviplata"
                        ? "bg-[#e6007e] text-white"
                        : "bg-[#003087] text-white"
                  }`}
                >
                  {method.name}
                </span>
              </span>
              <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary">
                {method.currency}
              </span>
            </label>
            <p className="mt-3 text-sm font-medium text-muted-foreground">{method.subtitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {method.description}
            </p>
            {method.id === "paypal" ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Antes de continuar, te pediremos nombre, teléfono y correo electrónico.
              </p>
            ) : null}
            {method.id === methodId && method.id !== "paypal" ? (
              <div className="mt-5 border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground">
                  Selecciona o escribe el monto
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {method.presets.map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      size="sm"
                      variant={amount === String(preset) ? "default" : "outline"}
                      onClick={() => updateAmount(String(preset))}
                    >
                      {formatAmount(preset, method.currency)}
                    </Button>
                  ))}
                </div>
                <label className="mt-3 block space-y-1.5 text-sm font-medium">
                  Monto que deseas donar ({method.currency})
                  <input
                    type="number"
                    min={minimumAmount}
                    max={maximumAmount}
                    step={amountStep}
                    required
                    inputMode="decimal"
                    value={amount}
                    onChange={(event) => updateAmount(event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <p className="mt-2 text-xs text-muted-foreground">
                  {method.id === "wompi"
                    ? "Continuarás al checkout de Wompi. El estado se confirmará mediante una notificación segura de la pasarela."
                    : method.id === "daviplata"
                      ? method.receiver
                        ? "La cuenta receptora se mostrará después de guardar tus datos."
                        : "No es posible abrir este método en este momento. Inténtalo más tarde."
                      : null}
                </p>
              </div>
            ) : null}
            <Button
              type="button"
              className="mt-4 w-full"
              onClick={() => openDonationDialog(method.id)}
            >
              {method.id === "wompi"
                ? "Donar con Wompi"
                : method.id === "daviplata"
                  ? "Donar con DaviPlata"
                  : "Registrar datos y donar con PayPal"}
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedMethod.id === "paypal"
                ? "Datos del donante"
                : "Datos para continuar con tu donación"}
            </DialogTitle>
            <DialogDescription>
              {selectedMethod.id === "paypal"
                ? "Completa este formulario antes de continuar. Elegirás el monto directamente en PayPal."
                : `${selectedMethod.name} · ${formatAmount(numericAmount, selectedMethod.currency)}. Ingresa tus datos para continuar.`}
            </DialogDescription>
          </DialogHeader>

          {status === "success" ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Datos guardados</AlertTitle>
              <AlertDescription>
                Completa la transferencia a la cuenta que aparece a continuación.
              </AlertDescription>
            </Alert>
          ) : null}
          {status === "config" || status === "error" ? (
            <Alert variant="destructive">
              <AlertTitle>
                {selectedMethod.id === "wompi"
                  ? "No se pudo iniciar el pago"
                  : "No se pudieron guardar los datos"}
              </AlertTitle>
              <AlertDescription>
                {selectedMethod.id === "wompi"
                  ? status === "config"
                    ? "El checkout de Wompi aún no está configurado. Inténtalo más tarde o usa una transferencia manual."
                    : "No se pudo iniciar el checkout. Inténtalo de nuevo más tarde."
                  : status === "config"
                    ? "El registro de donantes no está configurado en el servidor."
                    : "No se pudo guardar el registro. Inténtalo de nuevo más tarde."}
              </AlertDescription>
            </Alert>
          ) : null}

          <form
            onSubmit={submitDonorDetails}
            onChange={() => {
              if (hasRegisteredDonor) {
                setHasRegisteredDonor(false);
                setStatus("idle");
              }
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <label className="block space-y-1.5 text-sm font-medium">
              Nombre completo
              <input
                name="nombre"
                type="text"
                required
                maxLength={200}
                autoComplete="name"
                className={fieldClass}
              />
            </label>
            <label className="block space-y-1.5 text-sm font-medium">
              Teléfono
              <input
                name="telefono"
                type="tel"
                required
                minLength={7}
                maxLength={50}
                autoComplete="tel"
                className={fieldClass}
              />
            </label>
            <label className="block space-y-1.5 text-sm font-medium sm:col-span-2">
              Correo electrónico
              <input
                name="correo"
                type="email"
                required
                maxLength={320}
                autoComplete="email"
                className={fieldClass}
              />
            </label>
            <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
              <label>
                No llenar
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <div className="sm:col-span-2">
              <Button
                type="submit"
                className="w-full"
                disabled={
                  status === "sending" ||
                  !isReady ||
                  !Number.isFinite(numericAmount) ||
                  hasRegisteredDonor
                }
              >
                {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {status === "sending"
                  ? selectedMethod.id === "wompi"
                    ? "Preparando pago…"
                    : "Guardando datos…"
                  : selectedMethod.id === "wompi"
                    ? "Pagar con Wompi"
                    : selectedMethod.id === "daviplata"
                      ? "Guardar datos y ver cuenta"
                      : "Guardar datos y continuar a PayPal"}
              </Button>
              {!isReady ? (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  No es posible continuar con este método en este momento.
                </p>
              ) : null}
            </div>
          </form>

          {hasRegisteredDonor && selectedMethod.id === "daviplata" ? (
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-sm font-medium text-foreground">
                Transfiere {formatAmount(numericAmount, selectedMethod.currency)} a{" "}
                {selectedMethod.holder || "la cuenta DaviPlata de la Fundación"}:
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="break-all font-semibold text-foreground">
                  {selectedMethod.receiver}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void copyDaviplataNumber()}
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copiado" : "Copiar número"}
                </Button>
              </div>
              {copyError ? (
                <p role="status" className="mt-2 text-xs text-destructive">
                  No se pudo copiar. Selecciona y copia el número manualmente.
                </p>
              ) : null}
            </div>
          ) : null}

          <p className="text-xs text-muted-foreground">
            Usaremos tus datos para el pago o aviso. No ingreses claves ni datos bancarios.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
