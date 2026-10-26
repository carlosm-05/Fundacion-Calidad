import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Cog, Handshake } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductGallery } from "@/components/ProductGallery";
import { Reveal } from "@/components/ui/reveal";
import { metalProducts, services } from "@/content/site";

export const Route = createFileRoute("/productos-servicios")({
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

function PriceTag({ price }: { price?: string | undefined }) {
  return (
    <span className="inline-flex items-center rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary">
      {price ? price : "Solicitar cotización"}
    </span>
  );
}

function AcquireButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
    >
      Adquirir
    </button>
  );
}

function ProductosServiciosPage() {
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
                y servicios pensados para la comunidad. Elige lo que deseas adquirir y te
                contactaremos.
              </p>
            </div>
          </div>
        </section>

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
              {metalProducts.map((product, i) => (
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
                    <ProductGallery images={product.gallery} />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border p-6 sm:p-7">
                    <PriceTag price={product.price} />
                    <AcquireButton />
                  </div>
                </Reveal>
              ))}
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
              {services.map((service, i) => (
                <Reveal
                  key={service.id}
                  delay={(i % 3) * 90}
                  className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
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
                      <PriceTag price={service.price} />
                    </div>
                  </div>
                  <div className="border-t border-border p-6 sm:p-7">
                    <AcquireButton />
                  </div>
                </Reveal>
              ))}
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
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-earth px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary"
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
