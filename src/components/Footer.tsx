import { Heart } from "lucide-react";
import logo from "@/assets/logo-fundacion.jpg";
import { contact, donation, navLinks, projects } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/20 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt=""
              width={40}
              height={40}
              loading="lazy"
              className="h-10 w-10 rounded-full bg-primary-foreground/95 p-1"
            />
            <span className="font-display text-lg font-semibold">Fundación Calidad</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/75">
            Organización comprometida con la preservación del entorno ecológico y el desarrollo de
            iniciativas sociales y ambientales.
          </p>
        </div>

        <nav aria-label="Enlaces rápidos">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Enlaces rápidos</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/75">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-primary-foreground">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Proyectos">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Proyectos</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/75">
            {projects.map((project) => (
              <li key={project.id}>
                <a
                  href={project.detailPath}
                  className="transition-colors hover:text-primary-foreground"
                >
                  {project.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider">Contacto</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/75">
            <li>{contact.email}</li>
            <li>{contact.phone}</li>
            <li>{contact.address}</li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <a
              href={donation.pagePath}
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary"
            >
              <Heart className="h-3.5 w-3.5" />
              Donar
            </a>
            {contact.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="rounded-full border border-primary-foreground/30 px-3 py-1 text-xs transition-colors hover:bg-primary-foreground/15"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <p className="mx-auto max-w-7xl px-5 py-6 text-center text-xs text-primary-foreground/65 lg:px-8">
          © {year} Fundación Calidad. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
