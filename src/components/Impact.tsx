import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { stats } from "@/content/site";

export function Impact() {
  return (
    <section id="impacto" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Impacto"
            title="Nuestro impacto"
            description="Proyectos ambientales y sociales en marcha en el territorio, junto a las personas y familias que participan de nuestras iniciativas."
          />
        </Reveal>

        <dl className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 80}
              className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <dd className="text-4xl font-semibold text-secondary sm:text-5xl">{stat.value}</dd>
              <dt className="order-2 mt-2 text-sm font-medium text-muted-foreground">
                {stat.label}
              </dt>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
