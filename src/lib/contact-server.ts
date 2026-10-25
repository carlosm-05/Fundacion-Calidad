import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * ENVÍO DE CORREOS — Formulario "Contáctanos" (Brevo API)
 * -------------------------------------------------------
 * Esta función SOLO se ejecuta en el servidor: la API key nunca llega
 * al navegador. Requiere en el entorno:
 *
 *   BREVO_API_KEY       clave de API de Brevo (Settings > SMTP & API)
 *   BREVO_SENDER_EMAIL  remitente verificado en Brevo (Settings > Senders)
 *
 * En local van en el archivo `.env` (ignorado por git); en producción
 * se configuran como variables de entorno (Vercel > Settings > Env Vars).
 */

const BREVO_SMTP_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

/** PROVISIONAL: correo de la Fundación (mismo valor que en content/site.ts). */
const CORREO_FUNDACION = "fundacioncalidad.org2026@gmail.com";

const contactSchema = z.object({
  nombre: z.string().trim().min(1).max(200),
  correo: z.string().trim().email().max(320),
  telefono: z.string().trim().max(50),
  mensaje: z.string().trim().min(1).max(5000),
});

export type ContactResult = { ok: true } | { ok: false; error: "config" | "invalid" | "send" };

function env(name: string): string | undefined {
  const runtime = globalThis as {
    process?: { env?: Record<string, string | undefined> };
    __RUNTIME_ENV__?: Record<string, unknown>;
  };

  const fromProcess = runtime.process?.env?.[name]?.trim();
  if (fromProcess) return fromProcess;

  const binding = runtime.__RUNTIME_ENV__?.[name];
  if (typeof binding === "string") {
    const value = binding.trim();
    if (value) return value;
  }

  return undefined;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildContent(data: z.infer<typeof contactSchema>) {
  const subject = `Nuevo mensaje de contacto — ${data.nombre}`;
  const rows: [string, string][] = [
    ["Nombre", data.nombre],
    ["Correo electrónico", data.correo],
    ["Teléfono", data.telefono || "No proporcionado"],
    ["Mensaje", data.mensaje],
  ];
  const textContent = [
    `Asunto: ${subject}`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
  ].join("\n");
  const htmlContent = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1f2937;line-height:1.6">
      <h2 style="margin-bottom:16px">Nuevo mensaje desde el sitio web</h2>
      <table style="border-collapse:collapse;width:100%;max-width:560px">
        ${rows
          .map(
            ([label, value]) => `
        <tr>
          <th style="text-align:left;padding:8px 12px;background:#f3f4f6;border:1px solid #e5e7eb;width:34%">
            ${escapeHtml(label)}
          </th>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;white-space:pre-wrap">${escapeHtml(value)}</td>
        </tr>`,
          )
          .join("")}
      </table>
      <p style="margin-top:16px;font-size:12px;color:#6b7280">
        Enviado desde el formulario de contacto de la Fundación Calidad.
      </p>
    </div>`.trim();
  return { subject, textContent, htmlContent };
}

export const sendContactMessage = createServerFn({ method: "POST" })
  .validator((input: z.infer<typeof contactSchema>) => contactSchema.parse(input))
  .handler(async ({ data }): Promise<ContactResult> => {
    const apiKey = env("BREVO_API_KEY");
    const senderEmail = env("BREVO_SENDER_EMAIL") ?? CORREO_FUNDACION;

    if (!apiKey) {
      console.error("[contacto] Falta BREVO_API_KEY en el entorno del servidor.");
      return { ok: false, error: "config" };
    }

    const { subject, textContent, htmlContent } = buildContent(data);

    let response: Response;
    try {
      response = await fetch(BREVO_SMTP_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          sender: { name: "Sitio Web Fundación Calidad", email: senderEmail },
          to: [{ email: CORREO_FUNDACION, name: "Fundación Calidad" }],
          replyTo: { email: data.correo, name: data.nombre },
          subject,
          textContent,
          htmlContent,
        }),
      });
    } catch (error) {
      console.error("[contacto] Error de red al llamar la API de Brevo:", error);
      return { ok: false, error: "send" };
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(`[contacto] Brevo respondió ${response.status}: ${detail}`);
      if (response.status === 401) return { ok: false, error: "config" };
      return { ok: false, error: "send" };
    }

    return { ok: true };
  });
