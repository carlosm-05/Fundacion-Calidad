import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Cog,
  Handshake,
  ImagePlus,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ProductGallery } from "@/components/ProductGallery";
import { z } from "zod";
import {
  deleteCatalogItemFn,
  getAdminCatalogFn,
  saveCatalogItemFn,
  setCatalogItemActiveFn,
  type ProductRecord,
  type ServiceRecord,
} from "@/lib/catalog-server";
import {
  getAdminDonationsFn,
  getAdminPurchasesFn,
  type AdminDonation,
  type AdminPurchase,
} from "@/lib/purchase-server";
import { logoutFn, sessionFn } from "@/lib/auth-server";

const title = "Panel de administración | Fundación Calidad";
const description = "Panel privado de administración de Fundación Calidad.";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: async () => {
    const session = await sessionFn();
    if (!session.user) {
      throw redirect({ to: "/login" });
    }
    return { user: session.user };
  },
  component: AdminPage,
});

type CatalogKind = "product" | "service";
type CatalogItem = ProductRecord | ServiceRecord;

type GalleryImage = {
  id: string;
  url: string;
  file?: File;
};

type CatalogDraft = {
  name: string;
  model: string;
  description: string;
  price: string;
  purchasePriceCop: string;
  gallery: GalleryImage[];
  isActive: boolean;
};

const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function createEmptyDraft(): CatalogDraft {
  return {
    name: "",
    model: "",
    description: "",
    price: "",
    purchasePriceCop: "",
    gallery: [],
    isActive: true,
  };
}

const catalogErrors = {
  unauthorized: "Tu sesión terminó. Inicia sesión nuevamente para continuar.",
  config: "Falta configurar la clave de servidor de Supabase para administrar el catálogo.",
  load: "No se pudo cargar el catálogo. Inténtalo de nuevo.",
} as const;

const mutationErrors = {
  unauthorized: "Tu sesión terminó. Inicia sesión nuevamente para continuar.",
  config: "Falta configurar la clave de servidor de Supabase para administrar el catálogo.",
  database: "No se pudo guardar el cambio. Revisa los datos e inténtalo de nuevo.",
} as const;

const uploadErrors: Record<string, string> = {
  unauthorized: "Tu sesión terminó. Inicia sesión nuevamente para continuar.",
  config: "El almacenamiento de imágenes no está configurado en el servidor.",
  invalid: "Selecciona un archivo de imagen válido.",
  size: "Cada imagen debe pesar menos de 5 MB.",
  type: "Solo se aceptan archivos JPG, PNG o WebP válidos.",
  upload: "No se pudo subir la imagen. Verifica que la migración de Storage esté aplicada.",
};

function AdminPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [logoutPending, setLogoutPending] = useState(false);
  const [catalog, setCatalog] = useState<{
    products: ProductRecord[];
    services: ServiceRecord[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<AdminPurchase[]>([]);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [donations, setDonations] = useState<AdminDonation[]>([]);
  const [donationError, setDonationError] = useState<string | null>(null);

  const refreshCatalog = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const result = await getAdminCatalogFn();
    if (!result.ok) {
      setLoadError(catalogErrors[result.error]);
      setLoading(false);
      return false;
    }
    setCatalog({ products: result.products, services: result.services });
    setLoading(false);
    return true;
  }, []);

  useEffect(() => {
    void refreshCatalog();
    void Promise.all([getAdminPurchasesFn(), getAdminDonationsFn()])
      .then(([purchaseResult, donationResult]) => {
        if (purchaseResult.ok) setPurchases(purchaseResult.purchases);
        else setPurchaseError("No se pudieron cargar las compras.");
        if (donationResult.ok) setDonations(donationResult.donations);
        else setDonationError("No se pudieron cargar las donaciones.");
      })
      .catch(() => {
        setPurchaseError("No se pudieron cargar las compras.");
        setDonationError("No se pudieron cargar las donaciones.");
      });
  }, [refreshCatalog]);

  async function handleLogout() {
    setLogoutPending(true);
    try {
      await logoutFn();
      await navigate({ to: "/login" });
    } finally {
      setLogoutPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-5 pb-24 pt-28 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
              Administración
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-primary">Hola de nuevo</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Gestiona los catálogos y consulta el estado de compras y donaciones.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} disabled={logoutPending}>
            {logoutPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            {logoutPending ? "Cerrando sesión…" : "Cerrar sesión"}
          </Button>
        </div>

        <Card className="mt-8 border-border/70 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Sesión activa
            </CardTitle>
            <CardDescription>
              La sesión y las operaciones del catálogo se validan en el servidor.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 bg-muted/40 text-sm">
            <span className="text-muted-foreground">Administrador</span>
            <span className="font-medium text-foreground">{user.email}</span>
          </CardContent>
        </Card>

        <section className="mt-10" aria-labelledby="catalog-heading">
          <div className="mb-5">
            <h2
              id="catalog-heading"
              className="font-display text-2xl font-semibold text-foreground"
            >
              Mis catálogos
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Los precios son informativos. Publica u oculta cada elemento sin eliminarlo.
            </p>
          </div>

          {loadError ? (
            <Alert variant="destructive" className="mb-5">
              <AlertTitle>No se pudo abrir el catálogo</AlertTitle>
              <AlertDescription className="flex flex-wrap items-center gap-3">
                <span>{loadError}</span>
                {loadError.startsWith("Tu sesión") ? (
                  <Link to="/login" className="font-semibold underline">
                    Iniciar sesión
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="font-semibold underline"
                    onClick={() => void refreshCatalog()}
                  >
                    Reintentar
                  </button>
                )}
              </AlertDescription>
            </Alert>
          ) : null}

          {loading ? (
            <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando catálogos…
            </div>
          ) : catalog ? (
            <Tabs defaultValue="products">
              <TabsList className="mb-5 h-auto flex-wrap">
                <TabsTrigger value="products">Productos ({catalog.products.length})</TabsTrigger>
                <TabsTrigger value="services">Servicios ({catalog.services.length})</TabsTrigger>
                <TabsTrigger value="purchases">Compras ({purchases.length})</TabsTrigger>
                <TabsTrigger value="donations">Donaciones ({donations.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="products">
                <CatalogPanel
                  kind="product"
                  items={catalog.products}
                  refreshCatalog={refreshCatalog}
                />
              </TabsContent>
              <TabsContent value="services">
                <CatalogPanel
                  kind="service"
                  items={catalog.services}
                  refreshCatalog={refreshCatalog}
                />
              </TabsContent>
              <TabsContent value="purchases">
                <PurchaseList
                  purchases={purchases}
                  error={purchaseError}
                  onRetry={() => {
                    setPurchaseError(null);
                    void getAdminPurchasesFn()
                      .then((result) => {
                        if (!result.ok) {
                          setPurchaseError("No se pudieron cargar las compras.");
                          return;
                        }
                        setPurchases(result.purchases);
                      })
                      .catch(() => setPurchaseError("No se pudieron cargar las compras."));
                  }}
                />
              </TabsContent>
              <TabsContent value="donations">
                <DonationList
                  donations={donations}
                  error={donationError}
                  onRetry={() => {
                    setDonationError(null);
                    void getAdminDonationsFn()
                      .then((result) => {
                        if (!result.ok) {
                          setDonationError("No se pudieron cargar las donaciones.");
                          return;
                        }
                        setDonations(result.donations);
                      })
                      .catch(() => setDonationError("No se pudieron cargar las donaciones."));
                  }}
                />
              </TabsContent>
            </Tabs>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function formatPurchasePrice(amountCents: number, currency: string) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
}

function PurchaseList({
  purchases,
  error,
  onRetry,
}: {
  purchases: AdminPurchase[];
  error: string | null;
  onRetry: () => void;
}) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>No se pudieron cargar las compras</AlertTitle>
        <AlertDescription className="flex items-center gap-3">
          {error}
          <button type="button" className="font-semibold underline" onClick={onRetry}>
            Reintentar
          </button>
        </AlertDescription>
      </Alert>
    );
  }
  if (!purchases.length) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">
          Todavía no hay compras registradas.
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-3">
      {purchases.map((purchase) => (
        <Card key={purchase.id} className="border-border/70">
          <CardContent className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{purchase.service_name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {purchase.customer
                  ? `${purchase.customer.first_name} ${purchase.customer.last_name} · ${purchase.customer.email}`
                  : "Perfil de cliente no disponible"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(purchase.created_at).toLocaleString("es-CO")}
              </p>
              {purchase.payment_transaction_id ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  Transacción: {purchase.payment_transaction_id}
                </p>
              ) : null}
            </div>
            <div className="text-sm sm:text-right">
              <p className="font-semibold text-foreground">
                {formatPurchasePrice(purchase.amount_cents, purchase.currency)}
              </p>
              <p className="mt-1 capitalize text-muted-foreground">
                {purchase.status} · pago {purchase.payment_status}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DonationList({
  donations,
  error,
  onRetry,
}: {
  donations: AdminDonation[];
  error: string | null;
  onRetry: () => void;
}) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>No se pudieron cargar las donaciones</AlertTitle>
        <AlertDescription className="flex items-center gap-3">
          {error}
          <button type="button" className="font-semibold underline" onClick={onRetry}>
            Reintentar
          </button>
        </AlertDescription>
      </Alert>
    );
  }
  if (!donations.length) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">
          Todavía no hay donaciones registradas.
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-3">
      {donations.map((donation) => (
        <Card key={donation.id} className="border-border/70">
          <CardContent className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{donation.donor_name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {donation.donor_email} · {donation.donor_phone}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(donation.created_at).toLocaleString("es-CO")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Referencia: {donation.payment_reference}
                {donation.payment_transaction_id
                  ? ` · Transacción: ${donation.payment_transaction_id}`
                  : ""}
              </p>
            </div>
            <div className="text-sm sm:text-right">
              <p className="font-semibold text-foreground">
                {formatPurchasePrice(donation.amount_cents, donation.currency)}
              </p>
              <p className="mt-1 capitalize text-muted-foreground">
                {donation.status} · pago {donation.payment_status}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CatalogPanel({
  kind,
  items,
  refreshCatalog,
}: {
  kind: CatalogKind;
  items: CatalogItem[];
  refreshCatalog: () => Promise<boolean>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<CatalogDraft>(createEmptyDraft);
  const [saving, setSaving] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(
    null,
  );
  const objectUrls = useRef(new Set<string>());
  const label = kind === "product" ? "producto" : "servicio";

  useEffect(
    () => () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.current.clear();
    },
    [],
  );

  function startEditing(item: CatalogItem) {
    setEditingId(item.id);
    setEditorOpen(true);
    const purchasePriceCents =
      kind === "service" ? (item as ServiceRecord).price_amount_cents : null;
    setDraft({
      name: item.name,
      model: kind === "product" ? ((item as ProductRecord).model ?? "") : "",
      description: item.description,
      price: item.price ?? "",
      purchasePriceCop: purchasePriceCents === null ? "" : String(purchasePriceCents / 100),
      gallery: item.gallery.map((url, index) => ({
        id: `${item.id}-${index}`,
        url,
      })),
      isActive: item.is_active,
    });
    setError(null);
  }

  function startCreating() {
    setEditingId(null);
    setDraft(createEmptyDraft());
    setError(null);
    setEditorOpen(true);
  }

  function addImageFiles(files: File[]) {
    const accepted: File[] = [];
    const problems: string[] = [];
    const available = MAX_IMAGES - draft.gallery.length;

    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        problems.push(`${file.name}: formato no permitido.`);
      } else if (file.size < 1 || file.size > MAX_IMAGE_SIZE) {
        problems.push(`${file.name}: supera los 5 MB.`);
      } else if (accepted.length >= available) {
        problems.push(`Puedes agregar hasta ${MAX_IMAGES} imágenes por ${label}.`);
        break;
      } else {
        accepted.push(file);
      }
    }

    if (accepted.length) {
      setDraft((current) => ({
        ...current,
        gallery: [
          ...current.gallery,
          ...accepted.map((file) => {
            const url = URL.createObjectURL(file);
            objectUrls.current.add(url);
            return { id: crypto.randomUUID(), url, file };
          }),
        ],
      }));
    }
    setError(problems.length ? problems.join(" ") : null);
  }

  function removeImage(image: GalleryImage) {
    if (image.file) {
      URL.revokeObjectURL(image.url);
      objectUrls.current.delete(image.url);
    }
    setDraft((current) => ({
      ...current,
      gallery: current.gallery.filter((entry) => entry.id !== image.id),
    }));
  }

  function resetForm() {
    setEditorOpen(false);
    setEditingId(null);
    draft.gallery.forEach((image) => {
      if (image.file) {
        URL.revokeObjectURL(image.url);
        objectUrls.current.delete(image.url);
      }
    });
    setDraft(createEmptyDraft());
    setError(null);
  }

  async function saveItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const gallery = [...draft.gallery];
      const filesToUpload = gallery.filter((image) => image.file).length;
      let uploaded = 0;
      setUploadProgress(filesToUpload ? { current: 0, total: filesToUpload } : null);

      for (let index = 0; index < gallery.length; index += 1) {
        const image = gallery[index];
        if (!image?.file) continue;

        setUploadProgress({ current: uploaded + 1, total: filesToUpload });
        const formData = new FormData();
        formData.set("file", image.file);
        formData.set("kind", kind);
        formData.set("galleryCount", String(gallery.length));
        const response = await fetch("/api/catalog-images", {
          method: "POST",
          body: formData,
          credentials: "same-origin",
        });
        const responseBody: unknown = await response.json();
        const parsed = z
          .object({
            ok: z.boolean(),
            url: z.string().optional(),
            error: z.string().optional(),
          })
          .safeParse(responseBody);
        if (!response.ok || !parsed.success || !parsed.data.ok) {
          const code = parsed.success ? (parsed.data.error ?? "upload") : "upload";
          throw new Error(uploadErrors[code] ?? uploadErrors["upload"]);
        }
        const imageUrl = parsed.data.url;
        if (!imageUrl) throw new Error(uploadErrors["upload"]);

        URL.revokeObjectURL(image.url);
        objectUrls.current.delete(image.url);
        gallery[index] = { id: image.id, url: imageUrl };
        uploaded += 1;
        setDraft((current) => ({
          ...current,
          gallery: current.gallery.map((entry) =>
            entry.id === image.id ? { id: image.id, url: imageUrl } : entry,
          ),
        }));
      }

      setUploadProgress(null);
      const result = await saveCatalogItemFn({
        data: {
          kind,
          id: editingId ?? undefined,
          name: draft.name,
          model: draft.model,
          description: draft.description,
          price: draft.price,
          priceAmountCop:
            kind === "service" && draft.purchasePriceCop.trim()
              ? Number(draft.purchasePriceCop)
              : null,
          gallery: gallery.map((image) => image.url),
          isActive: draft.isActive,
        },
      });

      if (!result.ok) {
        setError(mutationErrors[result.error]);
        return;
      }

      const refreshed = await refreshCatalog();
      if (refreshed) resetForm();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "No se pudieron cargar las imágenes.",
      );
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  }

  async function toggleActive(item: CatalogItem) {
    setPendingId(item.id);
    setError(null);
    const result = await setCatalogItemActiveFn({
      data: { kind, id: item.id, isActive: !item.is_active },
    });
    if (!result.ok) {
      setError(mutationErrors[result.error]);
      setPendingId(null);
      return;
    }
    await refreshCatalog();
    setPendingId(null);
  }

  async function deleteItem(item: CatalogItem) {
    if (!window.confirm(`¿Eliminar este ${label}? Esta acción no se puede deshacer.`)) {
      return;
    }
    setPendingId(item.id);
    setError(null);
    const result = await deleteCatalogItemFn({
      data: { kind, id: item.id },
    });
    if (!result.ok) {
      setError(mutationErrors[result.error]);
      setPendingId(null);
      return;
    }
    await refreshCatalog();
    if (editingId === item.id) resetForm();
    setPendingId(null);
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button type="button" onClick={startCreating}>
            <Plus className="h-4 w-4" />
            Agregar {label}
          </Button>
        </div>
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">
              Aún no hay {kind === "product" ? "productos" : "servicios"} en este catálogo.
            </CardContent>
          </Card>
        ) : (
          items.map((item) => {
            const isPending = pendingId === item.id;
            return (
              <Card key={item.id} className="border-border/70">
                <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <span
                        className={
                          item.is_active
                            ? "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                            : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                        }
                      >
                        {item.is_active ? "Publicado" : "Inactivo"}
                      </span>
                    </div>
                    {item.gallery[0] ? (
                      <img
                        src={item.gallery[0]}
                        alt={`Imagen de ${item.name}`}
                        className="mt-3 h-24 w-36 rounded-lg border border-border object-cover"
                      />
                    ) : null}
                    {kind === "product" && (item as ProductRecord).model ? (
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-secondary">
                        {(item as ProductRecord).model}
                      </p>
                    ) : null}
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    {item.price ? (
                      <p className="mt-2 text-xs font-medium text-foreground">
                        Precio informativo: {item.price}
                      </p>
                    ) : null}
                    {kind === "service" && (item as ServiceRecord).price_amount_cents !== null ? (
                      <p className="mt-1 text-xs font-medium text-foreground">
                        Precio de compra:{" "}
                        {formatPurchasePrice(
                          (item as ServiceRecord).price_amount_cents ?? 0,
                          "COP",
                        )}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => void toggleActive(item)}
                    >
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {item.is_active ? "Despublicar" : "Publicar"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Editar ${item.name}`}
                      onClick={() => startEditing(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Eliminar ${item.name}`}
                      disabled={isPending}
                      onClick={() => void deleteItem(item)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Dialog
        open={editorOpen}
        onOpenChange={(open) => {
          if (saving) return;
          if (open) setEditorOpen(true);
          else resetForm();
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-left text-xl">
              {editingId ? `Editar ${label}` : `Agregar ${label}`}
            </DialogTitle>
            <DialogDescription className="text-left">
              Edita los datos y revisa cómo se verá el elemento en el catálogo público.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="min-w-0">
              {error ? (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>No se pudo completar la acción</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              <form onSubmit={saveItem} className="space-y-4">
                <label className="block space-y-1.5 text-sm font-medium">
                  Nombre
                  <Input
                    required
                    maxLength={160}
                    value={draft.name}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, name: event.target.value }))
                    }
                  />
                </label>

                {kind === "product" ? (
                  <label className="block space-y-1.5 text-sm font-medium">
                    Modelo (opcional)
                    <Input
                      maxLength={160}
                      value={draft.model}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, model: event.target.value }))
                      }
                    />
                  </label>
                ) : (
                  <label className="block space-y-1.5 text-sm font-medium">
                    Precio de compra en COP (opcional)
                    <Input
                      type="number"
                      min={1}
                      max={999999999}
                      step={1}
                      inputMode="numeric"
                      placeholder="Ej. 120000"
                      value={draft.purchasePriceCop}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          purchasePriceCop: event.target.value,
                        }))
                      }
                    />
                  </label>
                )}

                <GalleryEditor
                  images={draft.gallery}
                  onFilesSelected={addImageFiles}
                  onRemove={removeImage}
                  onMove={(index, direction) => {
                    const nextIndex = index + direction;
                    if (nextIndex < 0 || nextIndex >= draft.gallery.length) return;
                    setDraft((current) => {
                      const gallery = [...current.gallery];
                      const image = gallery[index];
                      const adjacent = gallery[nextIndex];
                      if (!image || !adjacent) return current;
                      gallery[index] = adjacent;
                      gallery[nextIndex] = image;
                      return { ...current, gallery };
                    });
                  }}
                  disabled={saving}
                />

                <label className="block space-y-1.5 text-sm font-medium">
                  Descripción
                  <Textarea
                    required
                    maxLength={4000}
                    rows={4}
                    value={draft.description}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="block space-y-1.5 text-sm font-medium">
                  Precio informativo (opcional)
                  <Input
                    maxLength={120}
                    placeholder="Ej. $120.000 COP"
                    value={draft.price}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, price: event.target.value }))
                    }
                  />
                </label>

                <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium">Publicado</p>
                    <p className="text-xs text-muted-foreground">Visible en el catálogo público</p>
                  </div>
                  <Switch
                    checked={draft.isActive}
                    onCheckedChange={(isActive) =>
                      setDraft((current) => ({ ...current, isActive }))
                    }
                    aria-label={`Publicar ${label}`}
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {saving
                      ? uploadProgress
                        ? `Subiendo ${uploadProgress.current} de ${uploadProgress.total}…`
                        : "Guardando…"
                      : editingId
                        ? "Guardar cambios"
                        : "Agregar"}
                  </Button>
                  {editingId ? (
                    <Button type="button" variant="outline" onClick={resetForm} disabled={saving}>
                      Cancelar
                    </Button>
                  ) : null}
                </div>
              </form>
            </div>
            <CatalogPreview kind={kind} draft={draft} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CatalogPreview({ kind, draft }: { kind: CatalogKind; draft: CatalogDraft }) {
  const isProduct = kind === "product";
  const purchasePrice = Number(draft.purchasePriceCop);
  const hasPurchasePrice = !isProduct && Number.isFinite(purchasePrice) && purchasePrice > 0;
  const previewName = draft.name.trim() || `Nombre del ${isProduct ? "producto" : "servicio"}`;

  return (
    <aside className="min-w-0 lg:sticky lg:top-0 lg:self-start">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Vista previa publicada</p>
          <p className="text-xs text-muted-foreground">
            Se actualiza mientras editas la información.
          </p>
        </div>
        {!draft.isActive ? (
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            Oculto
          </span>
        ) : null}
      </div>
      <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        {isProduct ? (
          <>
            <div className="border-b border-border p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/15">
                  <Cog className="h-5 w-5 text-secondary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-bold text-foreground">{previewName}</h3>
                  {draft.model.trim() ? (
                    <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                      {draft.model}
                    </p>
                  ) : null}
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {draft.description.trim() || "Aquí aparecerá la descripción del producto."}
              </p>
            </div>
            <div className="p-6 pt-5 sm:p-7 sm:pt-5">
              <ProductGallery
                images={draft.gallery.map(({ url }) => ({ src: url, alt: previewName }))}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border p-6 sm:p-7">
              <PreviewPrice price={draft.price} />
            </div>
          </>
        ) : (
          <>
            {draft.gallery.length ? (
              <div className="p-4 pb-0">
                <ProductGallery
                  images={draft.gallery.map(({ url }) => ({ src: url, alt: previewName }))}
                />
              </div>
            ) : null}
            <div className="flex flex-col p-6 sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/15">
                <Handshake className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-foreground">{previewName}</h3>
              <p className="mt-2 min-h-12 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {draft.description.trim() || "Aquí aparecerá la descripción del servicio."}
              </p>
              <div className="mt-6">
                <PreviewPrice
                  price={
                    hasPurchasePrice
                      ? formatPurchasePrice(Math.round(purchasePrice * 100), "COP")
                      : draft.price
                  }
                  label={hasPurchasePrice ? "Precio de compra" : "Precio informativo"}
                />
              </div>
              {hasPurchasePrice ? (
                <Button type="button" className="mt-3 w-full" disabled>
                  Comprar servicio
                </Button>
              ) : null}
            </div>
          </>
        )}
      </article>
      <p className="mt-2 text-xs text-muted-foreground">
        {draft.isActive
          ? "Al guardar, este elemento estará visible en el sitio."
          : "Este elemento no aparecerá en el sitio hasta que lo publiques."}
      </p>
    </aside>
  );
}

function PreviewPrice({ price, label = "Precio informativo" }: { price: string; label?: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary">
      {price.trim() ? `${label}: ${price}` : "Consultar precio"}
    </span>
  );
}

function GalleryEditor({
  images,
  onFilesSelected,
  onRemove,
  onMove,
  disabled,
}: {
  images: GalleryImage[];
  onFilesSelected: (files: File[]) => void;
  onRemove: (image: GalleryImage) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  disabled: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium">Fotos del elemento</p>
        <p className="text-xs text-muted-foreground">
          Hasta {MAX_IMAGES} fotos JPG, PNG o WebP; máximo 5 MB cada una.
        </p>
      </div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          if (
            !(event.relatedTarget instanceof Node) ||
            !event.currentTarget.contains(event.relatedTarget)
          ) {
            setDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          onFilesSelected(Array.from(event.dataTransfer.files));
        }}
        className={`rounded-xl border border-dashed p-4 transition-colors ${
          dragging ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          aria-label="Seleccionar fotos desde este dispositivo"
          disabled={disabled || images.length >= MAX_IMAGES}
          onChange={(event) => {
            onFilesSelected(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Arrastra las fotos aquí o selecciónalas desde tu equipo.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || images.length >= MAX_IMAGES}
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4" />
            Elegir fotos
          </Button>
        </div>
      </div>

      {images.length ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <li key={image.id} className="overflow-hidden rounded-lg border border-border bg-card">
              <img
                src={image.url}
                alt={`Foto ${index + 1}`}
                className="aspect-square w-full object-cover"
              />
              <div className="flex items-center justify-between gap-1 p-1.5">
                <span className="text-xs text-muted-foreground">
                  {index === 0 ? "Portada" : `Foto ${index + 1}`}
                </span>
                <div className="flex">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Mover foto ${index + 1} hacia arriba`}
                    disabled={disabled || index === 0}
                    onClick={() => onMove(index, -1)}
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Mover foto ${index + 1} hacia abajo`}
                    disabled={disabled || index === images.length - 1}
                    onClick={() => onMove(index, 1)}
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Quitar foto ${index + 1}`}
                    disabled={disabled}
                    onClick={() => onRemove(image)}
                  >
                    <X />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">Todavía no agregaste fotos.</p>
      )}
    </div>
  );
}
