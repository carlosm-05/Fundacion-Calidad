import aboutImage from "@/assets/about-nosotros.jpeg";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function About() {
  return (
    <section id="nosotros" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <SectionHeading
              align="left"
              eyebrow="Nosotros"
              title="¿Quiénes somos?"
              description="La Fundación Calidad es una organización comprometida con la preservación del entorno ecológico y con el desarrollo de acciones que contribuyan a un futuro más sostenible."
              className="max-w-none"
            />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Articulamos esfuerzos con comunidades, organizaciones y aliados para proteger los
              ecosistemas, fortalecer la cultura ambiental y generar iniciativas sociales con
              impacto real en el territorio.
            </p>
          </Reveal>

          <Reveal delay={120} className="order-1 lg:order-2">
            <div className="relative">
              <img
                src={aboutImage}
                alt="Fotografía de la Fundación Calidad"
                width={1200}
                height={900}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-6 -left-6 hidden h-28 w-28 rounded-3xl bg-leaf/70 sm:block"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
