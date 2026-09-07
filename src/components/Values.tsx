import {
  Baby,
  Building2,
  Eye,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Leaf,
  Lightbulb,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const values = [
  {
    icon: Leaf,
    title: "Ecología y sostenibilidad ambiental",
  },
  {
    icon: Handshake,
    title: "Compromiso desde la ética, la participación y la solidaridad",
  },
  {
    icon: Eye,
    title: "Transparencia y buena gestión de recursos y actividades",
  },
  {
    icon: Scale,
    title: "Verdad, justicia y equidad",
  },
  {
    icon: ShieldCheck,
    title: "Responsabilidad, integridad y coherencia",
  },
  {
    icon: Lightbulb,
    title: "Calidad, innovación y creatividad en la acción social",
  },
  {
    icon: Users,
    title: "Promoción y respeto de la diversidad cultural y la equidad de género",
  },
  {
    icon: Baby,
    title: "Defensa de los derechos y la dignidad humana, en especial de la infancia",
  },
  {
    icon: HeartHandshake,
    title: "Cercanía a la gente y orientación a sus proyectos concretos",
  },
  {
    icon: GraduationCap,
    title: "Apuesta por el desarrollo de las capacidades humanas e institucionales",
  },
  {
    icon: Building2,
    title:
      "Compromiso con los colectivos con mayor vulnerabilidad social y cooperación y coordinación con agentes públicos y privados",
  },
];

export function Values() {
  return (
    <section id="valores" className="bg-muted py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Valores"
            title="Nuestros valores"
            description="Los principios que orientan cada una de nuestras acciones y decisiones como organización."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, i) => (
            <Reveal
              key={value.title}
              delay={i * 60}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-secondary/45 hover:shadow-lift"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <value.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-primary">{value.title}</h3>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
