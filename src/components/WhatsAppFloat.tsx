import { MessageCircle } from "lucide-react";
import { contact } from "@/content/site";

export function WhatsAppFloat() {
  return (
    <a
      href={contact.whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={contact.whatsapp.label}
      title={contact.whatsapp.label}
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-secondary p-3.5 text-secondary-foreground shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary sm:bottom-7 sm:right-7 sm:p-4"
    >
      <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-48 group-hover:ml-1 group-hover:opacity-100 lg:inline-block">
        Escríbenos
      </span>
    </a>
  );
}