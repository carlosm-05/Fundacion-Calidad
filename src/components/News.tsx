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
