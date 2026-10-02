import { MapPin, Navigation } from "lucide-react";
import { ActionLink } from "@/components/ui/action-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { location } from "@/content/site";

export function LocationMap() {
  return (
    <section id="ubicacion" className="bg-background py-16">
      <div className="mx-auto max-w-2xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Ubicación"
            title="¿Cómo llegar?"
            titleClassName="text-2xl sm:text-3xl"
            description="Estamos en el piedemonte llanero, a las afueras de Villavicencio. Consulta la ubicación en el mapa o pulsa el botón para trazar la ruta desde donde estés."
            descriptionClassName="text-sm"
            className="max-w-xl"
          />

          <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            <div className="relative aspect-[16/10] w-full sm:aspect-video">
              <iframe
                title="Ubicación de la Fundación Calidad en Google Maps"
                src={location.embedUrl}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
              <a
                href={location.placeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver la Fundación Calidad en Google Maps"
                className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-foreground shadow-lift backdrop-blur transition-colors hover:bg-white"
              >
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                Ver en Google Maps
              </a>
            </div>

            <div className="flex flex-col gap-4 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Fundación Calidad</p>
                <p className="mt-1 flex items-start gap-2 text-xs text-muted-foreground">
                  <MapPin
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary"
                    aria-hidden="true"
                  />
                  <span>{location.address}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ActionLink
                  href={location.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs"
                >
                  <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                  Cómo llegar
                </ActionLink>
                <ActionLink
                  href={location.placeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  className="px-4 py-2 text-xs"
                >
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  Abrir en Google Maps
                </ActionLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
