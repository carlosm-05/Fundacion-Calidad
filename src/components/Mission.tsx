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
            Proteger el medio ambiente y contribuir a la conservación de los ecosistemas mediante
            programas de educación ambiental, uso responsable de los recursos naturales e iniciativas
            que generen bienestar en las comunidades donde trabajamos.
          </p>
          <p className="mt-3 text-sm text-primary-foreground/65">
            (Texto de misión provisional, editable).
          </p>
        </Reveal>

        <Reveal
          delay={120}
          className="scroll-mt-28 rounded-3xl border border-primary-foreground/15 bg-primary-foreground/8 p-8 sm:p-10"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/15">
            <Compass className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="mt-6 text-3xl font-semibold sm:text-4xl">Nuestra visión</h2>
          <p className="mt-4 text-base leading-relaxed text-primary-foreground/85">
            Consolidarnos como una organización reconocida por su aporte a la conservación ambiental,
            la sostenibilidad y el desarrollo social, siendo un referente de trabajo colaborativo con
            las comunidades y sus territorios.
          </p>
          <p className="mt-3 text-sm text-primary-foreground/65">
            (Texto de visión provisional, editable).
          </p>
        </Reveal>
      </div>
    </section>
  );
}
