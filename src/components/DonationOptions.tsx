import { useState, type FormEvent } from "react";
import { CheckCircle2, Copy, ExternalLink, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { donation } from "@/content/site";
import { sendDonationReportFn } from "@/lib/contact-server";

type DonationMethodId = "daviplata" | "paypal";
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
  const [methodId, setMethodId] = useState<DonationMethodId>("daviplata");
  const [amount, setAmount] = useState("10000");
  const [status, setStatus] = useState<ReportStatus>("idle");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [hasReportedIntent, setHasReportedIntent] = useState(false);

  const selectedMethod = methodId === "daviplata" ? donation.methods[0] : donation.methods[1];

  const isReady =
    selectedMethod.id === "daviplata"
      ? Boolean(selectedMethod.receiver)
      : Boolean(selectedMethod.link);
  const numericAmount = Number(amount);
  const minimumAmount = selectedMethod.currency === "COP" ? 1000 : 1;
  const maximumAmount = selectedMethod.currency === "COP" ? 100_000_000 : 100_000;
  const amountStep = selectedMethod.currency === "COP" ? 1 : 0.01;

  function updateAmount(nextAmount: string) {
    setAmount(nextAmount);
    setHasReportedIntent(false);
    if (status !== "sending") setStatus("idle");
  }

  function chooseMethod(nextMethodId: DonationMethodId) {
    const nextMethod = donation.methods.find((method) => method.id === nextMethodId);
    if (!nextMethod) return;
    setMethodId(nextMethodId);
    updateAmount(String(nextMethod.presets[0]));
    setHasReportedIntent(false);
    setStatus("idle");
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

  async function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending" || !isReady) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("sending");
    try {
      const result = await sendDonationReportFn({
        data: {
          nombre: String(formData.get("nombre") ?? ""),
          correo: String(formData.get("correo") ?? ""),
          telefono: String(formData.get("telefono") ?? ""),
          metodo: selectedMethod.id,
          moneda: selectedMethod.currency,
          monto: numericAmount,
          website: String(formData.get("website") ?? ""),
        },
      });
      if (result.ok) {
        setStatus("success");
        setHasReportedIntent(true);
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
                    method.id === "daviplata"
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
            <p className="mt-4 text-sm font-medium text-muted-foreground">{method.subtitle}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {method.description}
            </p>
            {method.id === methodId ? (
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
                  {method.id === "daviplata"
                    ? method.receiver
                      ? "La cuenta receptora se mostrará después de avisar a la Fundación."
                      : "El número de DaviPlata se habilitará cuando el propietario lo confirme."
                    : method.link
                      ? "El enlace para continuar a PayPal se mostrará después de avisar a la Fundación. Si el monto no aparece precargado, ingrésalo en PayPal. Pueden aplicarse comisiones."
                      : "El enlace oficial de PayPal se habilitará cuando el propietario lo comparta."}
                </p>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <h3 className="font-display text-xl font-semibold text-foreground">
          Datos para continuar con tu donación
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Al pulsar “Dirigirse a donar”, enviaremos a la Fundación un aviso con tus datos, el monto
          elegido y el método. Es un aviso de intención, no una confirmación de pago; la recepción
          se verifica manualmente.
        </p>

        {status === "success" ? (
          <Alert className="mt-5">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Aviso enviado a la Fundación</AlertTitle>
            <AlertDescription>
              Ya notificamos que deseas donar {formatAmount(numericAmount, selectedMethod.currency)}{" "}
              por {selectedMethod.name}. Continúa abajo para realizar la transferencia; este aviso
              no confirma que el dinero haya sido enviado o recibido.
            </AlertDescription>
          </Alert>
        ) : null}
        {status === "config" || status === "error" ? (
          <Alert variant="destructive" className="mt-5">
            <AlertTitle>No se pudo enviar el reporte</AlertTitle>
            <AlertDescription>
              {status === "config"
                ? "El correo de notificación aún no está configurado."
                : "Inténtalo de nuevo más tarde o contáctanos directamente."}
            </AlertDescription>
          </Alert>
        ) : null}

        <form
          onSubmit={submitReport}
          onChange={() => {
            if (hasReportedIntent) {
              setHasReportedIntent(false);
              setStatus("idle");
            }
          }}
          className="mt-5 grid gap-4 sm:grid-cols-2"
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
                hasReportedIntent
              }
            >
              {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {status === "sending" ? "Avisando a la Fundación…" : "Dirigirse a donar"}
            </Button>
            {!isReady ? (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Esta opción estará disponible cuando la Fundación configure los datos de recepción.
              </p>
            ) : null}
          </div>
        </form>
        {hasReportedIntent && selectedMethod.id === "daviplata" ? (
          <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4">
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
        {hasReportedIntent && selectedMethod.id === "paypal" ? (
          <a
            href={selectedMethod.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
          >
            Continuar a PayPal · {formatAmount(numericAmount, selectedMethod.currency)}
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
        <p className="mt-3 text-xs text-muted-foreground">
          Usaremos tus datos para enviar este aviso a la Fundación. No ingreses claves ni datos
          bancarios.
        </p>
      </div>
    </div>
  );
}
