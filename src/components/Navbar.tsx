import { useEffect, useState } from "react";
import { Heart, Menu, X } from "lucide-react";
import logo from "@/assets/logo-fundacion-circular.png";
import { donation, navLinks, org } from "@/content/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 shadow-soft backdrop-blur"
          : "bg-background/70 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
        <a href="#inicio" className="flex items-center gap-3" aria-label={`${org.name} — inicio`}>
          <img src={logo} alt="" width={40} height={40} className="h-10 w-10" />
          <span className="font-display text-base font-semibold leading-tight text-primary sm:text-lg">
            Fundación <span className="text-secondary">Calidad</span>
          </span>
        </a>

        <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <a
            href={donation.pagePath}
            className="ml-2 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary"
          >
            <Heart className="h-4 w-4" />
            Donar
          </a>
          <a
            href="#contacto"
            className="ml-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
          >
            Contáctanos
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="rounded-full border border-border p-2 text-primary transition-colors hover:bg-accent lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="menu-movil"
        hidden={!open}
        className="border-t border-border bg-background px-5 pb-5 pt-2 lg:hidden"
      >
        <nav aria-label="Navegación móvil" className="flex flex-col">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-foreground/85 transition-colors hover:bg-accent hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <a
            href={donation.pagePath}
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary"
          >
            <Heart className="h-4 w-4" />
            Donar
          </a>
        </nav>
      </div>
    </header>
  );
}
