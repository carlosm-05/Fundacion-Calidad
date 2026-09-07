import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { projects } from "@/content/site";

export function Projects() {
  return (
    <section id="proyectos" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Proyectos"
            title="Nuestros proyectos"
            description="Líneas de trabajo con las que impulsamos la conservación del entorno y el desarrollo comunitario. Cada proyecto tiene un impacto real en las comunidades y el territorio."
          />
        </Reveal>

        <Reveal className="mt-14">
          <Carousel opts={{ align: "start" }} className="w-full" aria-label="Carrusel de proyectos">
            <CarouselContent className="-ml-4">
              {projects.map((project) => (
                <CarouselItem
                  key={project.id}
                  className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
                >
                  <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {project.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {project.description}
                      </p>
                      <a
                        href={project.detailPath}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary transition-colors hover:text-primary"
                      >
                        Ver proyecto
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 lg:-left-14" />
            <CarouselNext className="-right-4 lg:-right-14" />
          </Carousel>
        </Reveal>
      </div>
    </section>
  );
}
