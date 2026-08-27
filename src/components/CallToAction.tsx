import { ActionLink } from "@/components/ui/action-button";
import { Reveal } from "@/components/ui/reveal";

export function CallToAction() {
  return (
    <section className="bg-background pb-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="rounded-[2rem] bg-primary px-7 py-14 text-center text-primary-foreground shadow-lift sm:px-14">
          <h2 className="text-3xl font-semibold sm:text-4xl">Sé parte del cambio</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/85">
            El cuidado de nuestro entorno es una responsabilidad de todos. Conoce nuestras iniciativas
            y ayúdanos a construir un futuro más sostenible.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ActionLink href="#proyectos" variant="outline">
              Conoce nuestros proyectos
            </ActionLink>
            <ActionLink href="#contacto" variant="ghostLight">
              Contáctanos
            </ActionLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
