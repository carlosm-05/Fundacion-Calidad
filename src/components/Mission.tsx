import { Compass, Target } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export function Mission() {
  return (
    <section id="mision" className="bg-primary py-24 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal className="rounded-3xl border border-primary-foreground/15 bg-primary-foreground/8 p-8 sm:p-10">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/15">
            <Target className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="mt-6 text-3xl font-semibold sm:text-4xl">Nuestra misión</h2>
          <p className="mt-4 text-base leading-relaxed text-primary-foreground/85">
            Nuestra misión es la preservación de nuestro entorno y mejorar la calidad de vida de las
            personas a través del deporte, la ecología y la convivencia, fomentando proyectos y
            actividades que contribuyan a la conservación del medio ambiente y a la salud personal.
          </p>
        </Reveal>

        <Reveal
          delay={120}
          className="scroll-mt-28 rounded-3xl border border-primary-foreground/15 bg-primary-foreground/8 p-8 sm:p-10"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/15">
            <Compass className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 id="vision" className="mt-6 text-3xl font-semibold sm:text-4xl">
            Nuestra visión
          </h2>
          <p className="mt-4 text-base leading-relaxed text-primary-foreground/85">
            Para el año 2031, a través de la planificación estratégica y la cooperación de la
            comunidad nacional e internacional, queremos haber realizado obras concretas que mejoren
            las condiciones de vida de las personas y ser reconocidos como una organización
            referente en la conservación del medio ambiente, la promoción del deporte y la
            convivencia en el territorio.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
