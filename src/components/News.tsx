import { ArrowRight, CalendarDays } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { news } from "@/content/site";

export function News() {
  return (
    <section id="noticias" className="bg-muted py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Actualidad"
            title="Noticias y actividades"
            description="Publicaciones de demostración sobre jornadas ambientales, educación ecológica y trabajo comunitario. Sustituya el contenido por las actividades reales de la Fundación."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {news.map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 100}
              as="article"
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <img
                src={item.image}
                alt={item.title}
                width={900}
                height={600}
                loading="lazy"
                className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="flex flex-1 flex-col p-6">
                <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  {item.date}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-primary">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.excerpt}
                </p>
                <a
                  href="#contacto"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:text-primary"
                >
                  Leer más
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                  <span className="sr-only">sobre {item.title}</span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
