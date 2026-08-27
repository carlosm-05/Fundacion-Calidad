import { Droplets, GraduationCap, Recycle, Sprout, TreePine, Users2 } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const areas = [
  {
    icon: TreePine,
    title: "Conservación de ecosistemas",
    text: "Protección de áreas naturales y de la biodiversidad presente en el territorio.",
  },
  {
    icon: GraduationCap,
    title: "Educación ambiental",
    text: "Formación y sensibilización para fortalecer la cultura del cuidado del entorno.",
  },
  {
    icon: Droplets,
    title: "Protección de recursos naturales",
    text: "Cuidado del agua, el suelo y demás recursos esenciales para la vida.",
  },
  {
    icon: Recycle,
    title: "Reciclaje y aprovechamiento de residuos",
    text: "Separación en la fuente y prácticas de economía circular en las comunidades.",
  },
  {
    icon: Sprout,
    title: "Recuperación de espacios",
    text: "Restauración de zonas verdes y espacios degradados para el disfrute colectivo.",
  },
  {
    icon: Users2,
    title: "Participación ciudadana",
    text: "Vinculación activa de las personas en las decisiones y acciones ambientales.",
  },
];

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
              key={area.title}
              delay={i * 70}
              className="rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-secondary/45 hover:shadow-lift"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <area.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-primary">{area.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{area.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
