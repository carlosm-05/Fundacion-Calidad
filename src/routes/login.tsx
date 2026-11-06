import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { loginFn, sessionFn } from "@/lib/auth-server";

const title = "Acceso administrador | Fundación Calidad";
const description = "Inicia sesión para administrar el sitio de Fundación Calidad.";

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Introduce tu correo electrónico")
    .email("Introduce un correo electrónico válido")
    .max(320),
  password: z.string().min(1, "Introduce tu contraseña").max(200),
  remember: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const errorMessages = {
  config:
    "El inicio de sesión aún no está configurado. Falta definir SUPABASE_URL, SUPABASE_ANON_KEY y ADMIN_EMAIL en el servidor.",
  credentials: "El correo o la contraseña no son correctos.",
  forbidden: "Esta cuenta no tiene permisos para acceder al panel.",
  unavailable:
    "No se pudo validar el acceso con Supabase. Revisa la terminal del servidor local para ver el error.",
} as const;

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: async () => {
    const session = await sessionFn();
    if (session.user) {
      throw redirect({ to: "/admin" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setFormError(null);
    try {
      const result = await loginFn({ data: values });
      if (result.ok) {
        toast.success("Sesión iniciada correctamente");
        await navigate({ to: "/admin" });
        return;
      }
      setFormError(errorMessages[result.error]);
    } catch {
      setFormError(errorMessages.unavailable);
    }
  }

  const submitting = form.formState.isSubmitting;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex items-center justify-center px-5 pb-20 pt-28 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <LockKeyhole className="h-3.5 w-3.5" />
              Acceso privado
            </span>
            <h1 className="mt-4 font-display text-3xl font-semibold text-primary">
              Panel de administración
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ingresa con tu cuenta de administrador para gestionar el sitio.
            </p>
          </div>

          <Card className="border-border/70 shadow-soft">
            <CardHeader>
              <CardTitle>Iniciar sesión</CardTitle>
              <CardDescription>
                Usa el correo y la contraseña registrados en Supabase.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  {formError ? (
                    <Alert variant="destructive">
                      <AlertTitle>No se pudo iniciar sesión</AlertTitle>
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  ) : null}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            placeholder="admin@fundacioncalidad.org"
                            autoFocus
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2.5 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(checked === true)}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">
                          Recordarme en este equipo
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {submitting ? "Ingresando…" : "Ingresar"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/" className="font-medium text-primary hover:underline">
              Volver al sitio
            </Link>
          </p>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
