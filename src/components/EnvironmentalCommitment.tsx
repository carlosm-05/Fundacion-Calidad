import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const areas = [1, 2, 3, 4, 5, 6];

export function EnvironmentalCommitment() {
  return (
    <section id="compromiso" className="bg-muted py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Compromiso"
            title="Nuestro compromiso con el medio ambiente"
            description="Estas son las áreas de trabajo que orientan nuestras acciones ambientales y sociales."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, i) => (
            <Reveal
              key={area}
              delay={i * 70}
              className="flex aspect-[4/5] flex-col rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-secondary/45 hover:shadow-lift"
            >
              {" "}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
