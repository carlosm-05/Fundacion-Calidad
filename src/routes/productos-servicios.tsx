import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Cog, Handshake } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductGallery } from "@/components/ProductGallery";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getPublishedCatalogFn } from "@/lib/catalog-server";
import { startServicePurchaseFn } from "@/lib/purchase-server";

export const Route = createFileRoute("/productos-servicios")({
  loader: () => getPublishedCatalogFn(),
  head: () => ({
    meta: [
      { title: "Productos y servicios | Fundación Calidad" },
      {
        name: "description",
        content:
          "Conoce los productos metalmecánicos y servicios que ofrece la Fundación Calidad y solicita tu cotización.",
      },
      { property: "og:title", content: "Productos y servicios | Fundación Calidad" },
      {
        property: "og:description",
        content:
          "Productos metalmecánicos y servicios de la Fundación Calidad: asadores, remolque con trituradora Tritupag, cortadora de césped y más.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductosServiciosPage,
});

function PriceTag({
  price,
  label = "Precio informativo",
}: {
  price?: string | null;
  label?: string;
}) {
  return (
    <span className="inline-flex items-center rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary">
      {price ? `${label}: ${price}` : "Consultar precio"}
    </span>
  );
}

function purchasePrice(amountCents: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
}

function ServicePurchaseAction({
  serviceId,
  priceAmountCents,
}: {
  serviceId: string;
  priceAmountCents: number | null;
}) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buyService() {
    setBusy(true);
    setError(null);
    try {
      const result = await startServicePurchaseFn({ data: { serviceId } });
      if (result.ok) {
        window.location.assign(result.checkoutUrl);
        return;
      }
      if (result.error === "unauthorized") {
        await navigate({ to: "/cuenta/login", search: { serviceId } });
        return;
      }
      setError(
        result.error === "config"
          ? "El pago todavía no está configurado."
          : result.error === "price"
            ? "Este servicio no tiene un precio de compra válido."
            : "No se pudo iniciar la compra. Inténtalo de nuevo.",
      );
    } catch {
      setError("No se pudo iniciar la compra. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  if (!priceAmountCents || priceAmountCents < 1) return null;

  return (
    <div className="w-full">
      <Button type="button" className="w-full" onClick={() => void buyService()} disabled={busy}>
        {busy ? "Preparando pago…" : "Comprar servicio"}
      </Button>
      {error ? (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}

function ProductosServiciosPage() {
  const catalog = Route.useLoaderData();

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
                <Handshake className="h-4 w-4" />
                Productos y servicios
              </span>
              <h1 className="mt-5 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
                Productos y servicios
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-primary-foreground/85">
                Explora lo que la Fundación Calidad tiene para ti: piezas metalmecánicas de calidad
                y servicios pensados para la comunidad. Consulta la información y contáctanos para
                conocer disponibilidad y cotizaciones.
              </p>
            </div>
          </div>
        </section>

        {!catalog.ok ? (
          <section className="mx-auto max-w-7xl px-5 pt-8 lg:px-8" role="status">
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
              El catálogo no está disponible en este momento. Inténtalo de nuevo más tarde.
            </div>
          </section>
        ) : null}

        {/* Productos metalmecánicos */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                <Cog className="h-4 w-4" />
                Metalmecánicos
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold text-foreground">
                Productos metalmecánicos
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Elaboración de herramientas y equipos metálicos con calidad, resistencia y
                propósito. Cada pieza se fabrica pensando en durabilidad y buen desempeño.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-8 lg:grid-cols-2">
              {catalog.ok && catalog.products.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Por el momento no hay productos publicados.
                </p>
              ) : null}
              {catalog.ok
                ? catalog.products.map((product, i) => (
                    <Reveal
                      key={product.id}
                      delay={(i % 2) * 90}
                      className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                    >
                      <div className="border-b border-border p-6 sm:p-7">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/15">
                            <Cog className="h-5 w-5 text-secondary" />
                          </div>
                          <div>
                            <h3 className="font-display text-xl font-bold text-foreground">
                              {product.name}
                            </h3>
                            {product.model ? (
                              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                                {product.model}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex-1 p-6 pt-5 sm:p-7 sm:pt-5">
                        <ProductGallery
                          images={product.gallery.map((src) => ({
                            src,
                            alt: product.name,
                          }))}
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border p-6 sm:p-7">
                        <PriceTag price={product.price} />
                      </div>
                    </Reveal>
                  ))
                : null}
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                <Handshake className="h-4 w-4" />
                Servicios
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold text-foreground">
                Nuestros servicios
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Servicios disponibles para la comunidad y las empresas. Selecciona el que necesitas
                y solicita tu cotización.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {catalog.ok && catalog.services.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Por el momento no hay servicios publicados.
                </p>
              ) : null}
              {catalog.ok
                ? catalog.services.map((service, i) => (
                    <Reveal
                      key={service.id}
                      delay={(i % 3) * 90}
                      className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                    >
                      {service.gallery.length ? (
                        <div className="p-4 pb-0">
                          <ProductGallery
                            images={service.gallery.map((src) => ({
                              src,
                              alt: service.name,
                            }))}
                          />
                        </div>
                      ) : null}
                      <div className="flex flex-1 flex-col p-6 sm:p-7">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/15">
                          <Handshake className="h-5 w-5 text-secondary" />
                        </div>
                        <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                          {service.name}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {service.description}
                        </p>
                        <div className="mt-6">
                          <PriceTag
                            price={
                              service.price_amount_cents
                                ? purchasePrice(service.price_amount_cents)
                                : service.price
                            }
                            label={
                              service.price_amount_cents ? "Precio de compra" : "Precio informativo"
                            }
                          />
                        </div>
                        <div className="mt-3">
                          <ServicePurchaseAction
                            serviceId={service.id}
                            priceAmountCents={service.price_amount_cents}
                          />
                        </div>
                      </div>
                    </Reveal>
                  ))
                : null}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal>
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/15 bg-primary/5 p-8 text-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Handshake className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    ¿Deseas un producto o servicio a medida?
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Escríbenos y con gusto te contamos más sobre nuestros productos, servicios y
                    opciones de fabricación personalizada.
                  </p>
                </div>
                <Link
                  to="/"
                  hash="contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
                >
                  Contáctanos
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
