import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { projects } from "@/content/site";

export function Projects() {
  return (
    <section id="proyectos" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Proyectos"
            title="Nuestros proyectos"
            description="Líneas de trabajo con las que impulsamos la conservación del entorno y el desarrollo comunitario. El contenido es provisional y puede reemplazarse por proyectos reales."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, i) => (
            <Reveal
              key={project.id}
              delay={i * 90}
              as="article"
              className="flex aspect-[4/5] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
            >
              {" "}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
