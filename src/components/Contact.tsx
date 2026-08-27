import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, Share2 } from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { contact } from "@/content/site";

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-secondary focus:outline-none";

export function Contact() {
  const [sent, setSent] = useState(false);

  // El formulario está preparado para conectarse luego a un servicio de envío.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section id="contacto" className="bg-muted py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Contacto"
            title="Escríbenos"
            description="¿Quieres conocer más sobre nuestras iniciativas o sumarte a ellas? Déjanos tu mensaje y nos pondremos en contacto."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal className="rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-9">
            <form onSubmit={handleSubmit} noValidate={false} className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-primary">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Su nombre completo"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="correo" className="mb-2 block text-sm font-medium text-primary">
                    Correo electrónico
                  </label>
                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="nombre@correo.com"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="telefono" className="mb-2 block text-sm font-medium text-primary">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Número de contacto"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="mb-2 block text-sm font-medium text-primary">
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  required
                  placeholder="Cuéntenos en qué podemos ayudarle"
                  className={`${fieldClass} resize-y`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <ActionButton type="submit">Enviar mensaje</ActionButton>
                <p aria-live="polite" className="text-sm text-muted-foreground">
                  {sent
                    ? "Gracias por escribirnos. El envío se activará al conectar el servicio de correo."
                    : ""}
                </p>
              </div>
            </form>
          </Reveal>

          <Reveal delay={120} className="rounded-3xl bg-primary p-7 text-primary-foreground shadow-lift sm:p-9">
            <h3 className="text-xl font-semibold">Datos de contacto</h3>
            <p className="mt-2 text-sm text-primary-foreground/70">
              Información de ejemplo, pendiente de reemplazar por los datos oficiales.
            </p>

            <ul className="mt-7 space-y-5 text-sm">
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <span>
                  <span className="block font-semibold">Correo oficial</span>
                  <span className="text-primary-foreground/80">{contact.email}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <span>
                  <span className="block font-semibold">Teléfono</span>
                  <span className="text-primary-foreground/80">{contact.phone}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <span>
                  <span className="block font-semibold">Dirección</span>
                  <span className="text-primary-foreground/80">{contact.address}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <Share2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <span>
                  <span className="block font-semibold">Redes sociales</span>
                  <span className="mt-2 flex flex-wrap gap-2">
                    {contact.social.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        className="rounded-full border border-primary-foreground/30 px-3 py-1 text-xs transition-colors hover:bg-primary-foreground/15"
                      >
                        {s.label}
                      </a>
                    ))}
                  </span>
                </span>
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
