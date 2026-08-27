import { ArrowRight } from "lucide-react";
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
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <div className="overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  width={1000}
                  height={700}
                  loading="lazy"
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold text-primary">{project.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                <a
                  href="#contacto"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:text-primary"
                >
                  Conocer más
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                  <span className="sr-only">sobre {project.title}</span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
