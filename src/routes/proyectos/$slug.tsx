import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, Leaf, Target, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { projects } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";

export const Route = createFileRoute("/proyectos/$slug")({
  head: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    const title = project
      ? `${project.title} | Fundación Calidad`
      : "Proyecto no encontrado | Fundación Calidad";
    const description = project?.detail.summary ?? "Proyecto de Fundación Calidad.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProjectDetail,
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex min-h-[60vh] items-center justify-center px-5">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold text-foreground">
              Proyecto no encontrado
            </h1>
            <p className="mt-4 text-muted-foreground">
              El proyecto que buscas no existe o ha sido movido.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { detail } = project;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
          <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-10 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <Link
                to="/"
                className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a proyectos
              </Link>
              <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
                {detail.heroTitle}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-primary-foreground/85">{detail.summary}</p>
            </div>
          </div>
        </section>

        {/* Contenido */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Columna principal */}
              <div className="lg:col-span-2 space-y-10">
                <Reveal>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      Sobre el proyecto
                    </h2>
                    <p className="mt-4 leading-relaxed text-muted-foreground">
                      {detail.fullDescription}
                    </p>
                  </div>
                </Reveal>

                <Reveal>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">Actividades</h2>
                    <ul className="mt-4 space-y-3">
                      {detail.activities.map((activity, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground">
                          <Zap className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>

              {/* Columna lateral */}
              <div className="space-y-8">
                <Reveal>
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15">
                        <Target className="h-5 w-5 text-secondary" />
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        Objetivos
                      </h3>
                    </div>
                    <ul className="mt-4 space-y-3">
                      {detail.objectives.map((obj, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal>
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf/40">
                        <Leaf className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        Impacto
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {detail.impact}
                    </p>
                  </div>
                </Reveal>

                <Reveal>
                  <a
                    href="#contacto"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
                  >
                    ¿Quieres participar?
                  </a>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
