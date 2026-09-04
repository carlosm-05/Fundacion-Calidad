import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Copy, ExternalLink, HandHeart, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/ui/reveal";
import { contact, donation } from "@/content/site";

export const Route = createFileRoute("/donacion")({
  head: () => ({
    meta: [
      { title: "Donaciones | Fundación Calidad" },
      { name: "description", content: donation.banner },
      { property: "og:title", content: "Donaciones | Fundación Calidad" },
      { property: "og:description", content: donation.banner },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DonationPage,
});

function DonationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-primary py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
            <div className="mt-8 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/90">
                <HandHeart className="h-4 w-4" />
                Apóyanos
              </span>
              <h1 className="mt-5 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
                Donaciones
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-primary-foreground/85">
                {donation.banner}
              </p>
            </div>
          </div>
        </section>

        {/* Métodos de pago */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal>
              <h2 className="text-center font-display text-3xl font-bold text-foreground">
                Elige cómo quieres donar
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
                Selecciona el método de pago de tu preferencia. Puedes copiar los datos y realizar
                la transferencia desde tu banco o billetera digital.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {donation.methods.map((method, i) => (
                <Reveal
                  key={method.id}
                  delay={i * 80}
                  className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-secondary/45 hover:shadow-lift"
                >
                  <div className="flex items-center justify-between">
                    <MethodBadge name={method.name} />
                    {method.kind === "link" && (
                      <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary">
                        Enlace directo
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-sm text-muted-foreground">{method.subtitle}</p>

                  <div className="mt-4 flex-1">
                    <ReferenceRow method={method} />
                  </div>

                  <div className="mt-6 border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground/80">
                      {method.kind === "link"
                        ? "Haz clic para abrir la pasarela de pago."
                        : "Copia el dato y realiza tu transferencia desde tu aplicación."}
                    </p>
                    <div className="mt-3 grid gap-2">
                      <a
                        href={method.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
                      >
                        {method.kind === "link" ? "Donar en línea" : "Ir a la app"}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      {method.kind === "account" && <CopyButton method={method} />}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Confianza */}
            <Reveal className="mt-14">
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/15 bg-primary/5 p-8 text-center sm:flex-row sm:text-left">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Donaciones seguras y transparentes
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Todos los aportes se destinan al desarrollo de los proyectos ambientales y
                    sociales de la Fundación. Si deseas un certificado de donación, contáctanos al{" "}
                    <span className="font-medium text-primary">{contact.email}</span>.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function MethodBadge({ name }: { name: string }) {
  const styles: Record<string, string> = {
    Bancolombia: "bg-[#f8e14b] text-[#003d86]",
    Nequi: "bg-[#bcd7f5] text-[#123a63]",
    DaviPlata: "bg-[#c8b6a6] text-[#5d3b1e]",
    PayPal: "bg-[#003087] text-white",
  };
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-sm font-bold ${styles[name] ?? "bg-muted text-foreground"}`}
    >
      {name}
    </span>
  );
}

function ReferenceRow({ method }: { method: (typeof donation.methods)[number] }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/40 p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
        {method.kind === "account" ? "Nº de cuenta" : "Correo"}
      </p>
      <p className="mt-1 break-all font-mono text-sm font-semibold text-foreground">
        {method.reference}
      </p>
      {method.placeholder && (
        <p className="mt-1 text-[11px] text-muted-foreground/70">{method.placeholder}</p>
      )}
    </div>
  );
}

function CopyButton({ method }: { method: (typeof donation.methods)[number] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(method.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-secondary" />
          Copiado
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copiar dato
        </>
      )}
    </button>
  );
}
