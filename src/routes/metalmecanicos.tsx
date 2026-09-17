import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Cog, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/ui/reveal";
import { metalProducts } from "@/content/site";
import { cn } from "@/lib/utils";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const Route = createFileRoute("/metalmecanicos")({
  head: () => ({
    meta: [
      { title: "Metalmecánicos | Fundación Calidad" },
      {
        name: "description",
        content:
          "Productos metalmecánicos elaborados por la Fundación Calidad: asadores, remolque con trituradora Tritupag y cortadora de césped.",
      },
      { property: "og:title", content: "Metalmecánicos | Fundación Calidad" },
      {
        property: "og:description",
        content:
          "Productos metalmecánicos elaborados por la Fundación Calidad: asadores, remolque con trituradora Tritupag y cortadora de césped.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MetalmecanicosPage,
});

function ProductGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const total = images.length;

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div>
      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
        >
          <CarouselContent>
            {images.map((item) => (
              <CarouselItem key={item.src}>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.alt}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-3 h-10 w-10 rounded-full border-0 bg-white/80 text-foreground shadow-lift backdrop-blur hover:bg-white" />
          <CarouselNext className="right-3 h-10 w-10 rounded-full border-0 bg-white/80 text-foreground shadow-lift backdrop-blur hover:bg-white" />
          <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {current + 1} / {total}
          </div>
        </Carousel>
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        {images.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => api?.scrollTo(index)}
            aria-label={`Ver imagen ${index + 1}: ${item.alt}`}
            className={cn(
              "overflow-hidden rounded-lg border-2 transition-all duration-300",
              index === current
                ? "border-secondary opacity-100 shadow-lift"
                : "border-transparent opacity-60 hover:opacity-100",
            )}
          >
            <img src={item.src} alt={item.alt} className="h-16 w-24 object-cover sm:h-20 sm:w-32" />
          </button>
        ))}
      </div>
    </div>
  );
}

function MetalmecanicosPage() {
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
                <Cog className="h-4 w-4" />
                Metalmecánicos
              </span>
              <h1 className="mt-5 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
                Productos metalmecánicos
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-primary-foreground/85">
                Elaboración de herramientas y equipos metálicos con calidad, resistencia y
                propósito: asadores, remolque con trituradora y cortadora de césped.
              </p>
            </div>
          </div>
        </section>

        {/* Productos */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal>
              <h2 className="text-center font-display text-3xl font-bold text-foreground">
                Nuestros productos
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
                Cada pieza se fabrica pensando en durabilidad y buen desempeño. La información de
                cada producto está en construcción y se completará próximamente.
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
                    <p className="mt-4 flex items-start gap-2 rounded-xl border border-dashed border-secondary/50 bg-secondary/5 px-4 py-3 text-sm leading-relaxed text-foreground/70">
                      <Pencil className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      {product.description}
                    </p>
                  </div>

                  <div className="flex-1 p-6 pt-5 sm:p-7 sm:pt-5">
                    <ProductGallery images={product.gallery} />
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-14">
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/15 bg-primary/5 p-8 text-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Cog className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    ¿Deseas un producto metalmecánico a medida?
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Escríbenos y con gusto te contamos más sobre nuestros productos y opciones de
                    fabricación personalizada.
                  </p>
                </div>
                <a
                  href="/#contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
                >
                  Contáctanos
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
