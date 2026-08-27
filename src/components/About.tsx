import { HandHeart, Leaf, Users } from "lucide-react";
import aboutImage from "@/assets/about-community.jpg";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const values = [
  {
    icon: HandHeart,
    title: "Compromiso",
    text: "Trabajamos de forma constante y transparente por el cuidado del entorno que compartimos.",
  },
  {
    icon: Leaf,
    title: "Sostenibilidad",
    text: "Promovemos prácticas que permitan usar los recursos naturales sin comprometer el futuro.",
  },
  {
    icon: Users,
    title: "Responsabilidad social",
    text: "Acompañamos a las comunidades para que sean protagonistas de las iniciativas ambientales.",
  },
];

export function About() {
  return (
    <section id="nosotros" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <SectionHeading
              align="left"
              eyebrow="Nosotros"
              title="¿Quiénes somos?"
              description="La Fundación Calidad es una organización comprometida con la preservación del entorno ecológico y con el desarrollo de acciones que contribuyan a un futuro más sostenible."
              className="max-w-none"
            />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Articulamos esfuerzos con comunidades, organizaciones y aliados para proteger los
              ecosistemas, fortalecer la cultura ambiental y generar iniciativas sociales con impacto
              real en el territorio. (Texto institucional provisional, editable).
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {values.map((value, i) => (
                <Reveal
                  key={value.title}
                  delay={i * 90}
                  className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-secondary/45 hover:shadow-lift"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <value.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-primary">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.text}</p>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} className="order-1 lg:order-2">
            <div className="relative">
              <img
                src={aboutImage}
                alt="Voluntarios sembrando árboles nativos junto a la comunidad"
                width={1200}
                height={900}
                loading="lazy"
                className="w-full rounded-3xl object-cover shadow-lift"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-6 -left-6 hidden h-28 w-28 rounded-3xl bg-leaf/70 sm:block"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
