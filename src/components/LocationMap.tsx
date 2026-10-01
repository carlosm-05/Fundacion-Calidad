import { MapPin, Navigation } from "lucide-react";
import { ActionLink } from "@/components/ui/action-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { location } from "@/content/site";

export function LocationMap() {
  return (
    <Reveal className="mt-20">
      <SectionHeading
        align="left"
        eyebrow="Ubicación"
        title="¿Cómo llegar?"
        description="Estamos en el piedemonte llanero, a las afueras de Villavicencio. Consulta la ubicación en el mapa o pulsa el botón para trazar la ruta desde donde estés."
        className="max-w-none"
      />

      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <div className="relative aspect-[4/3] w-full sm:aspect-video">
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
            className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-foreground shadow-lift backdrop-blur transition-colors hover:bg-white"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Ver en Google Maps
          </a>
        </div>

        <div className="flex flex-col gap-5 border-t border-border p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Fundación Calidad</p>
            <p className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
              <span>{location.address}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionLink href={location.directionsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="h-4 w-4" aria-hidden="true" />
              Cómo llegar
            </ActionLink>
            <ActionLink
              href={location.placeUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Abrir en Google Maps
            </ActionLink>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
