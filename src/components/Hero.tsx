import heroImage from "@/assets/hero-forest.jpg";
import { ActionLink } from "@/components/ui/action-button";
import { org } from "@/content/site";

export function Hero() {
  return (
    <section id="inicio" className="relative isolate flex min-h-[92vh] items-center overflow-hidden">
      <img
        src={heroImage}
        alt="Bosque de niebla con montañas verdes al amanecer"
        width={1920}
        height={1088}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/92 via-primary/72 to-primary/25"
      />

      <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-32 lg:px-8">
        <div className="reveal reveal-in max-w-2xl">
          <p className="mb-5 inline-flex rounded-full border border-primary-foreground/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/90">
            Organización ambiental y social
          </p>
          <h1 className="text-4xl font-semibold leading-[1.05] text-primary-foreground sm:text-6xl lg:text-7xl">
            {org.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg font-medium text-primary-foreground/95 sm:text-xl">
            {org.tagline}
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/80">
            {org.intro}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ActionLink href="#proyectos" variant="outline">
              Conoce nuestros proyectos
            </ActionLink>
            <ActionLink href="#contacto" variant="ghostLight">
              Contáctanos
            </ActionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
