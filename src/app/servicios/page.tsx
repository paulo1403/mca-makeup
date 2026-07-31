"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, Play } from "lucide-react";
import ServiceLightbox from "@/components/services-showcase/ServiceLightbox";

const CATEGORY_LABELS: Record<string, string> = {
  BRIDAL: "Novia",
  SOCIAL: "Social / Eventos",
  MATURE_SKIN: "Piel Madura",
  HAIRSTYLE: "Peinados",
  OTHER: "Otros",
};

interface ServiceImage {
  id: string;
  url: string;
  alt?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}
interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: string;
  cost?: number | null;
  videoUrl?: string | null;
  images: ServiceImage[];
}

const fetchServices = async () => {
  const res = await fetch("/api/services");
  if (!res.ok) throw new Error("Error al cargar servicios");
  const data = await res.json();
  return data.services as Service[];
};

function primaryImage(s: Service) {
  if (!s.images?.length) return null;
  return s.images.find((i) => i.isPrimary)?.url || s.images[0].url;
}

export default function ServiciosPage() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });
  const [active, setActive] = useState("TODOS");
  const [selected, setSelected] = useState<Service | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const categories = useMemo(() => {
    const present = Array.from(new Set(services.map((s) => s.category)));
    return ["TODOS", ...present];
  }, [services]);

  const filtered = useMemo(
    () => (active === "TODOS" ? services : services.filter((s) => s.category === active)),
    [services, active],
  );

  return (
    <main className="min-h-screen bg-[color:var(--color-background)]">
      {/* Hero */}
      <header className="relative overflow-hidden px-5 py-20 text-center sm:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, var(--color-primary) 0, transparent 40%), radial-gradient(circle at 80% 80%, var(--color-primary) 0, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[color:var(--color-primary)]">
            Marcela Cordero · Makeup Artist
          </p>
          <h1 className="font-[family:var(--font-playfair)] text-4xl font-semibold leading-tight text-[color:var(--color-heading)] sm:text-5xl">
            Catálogo de Servicios
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[color:var(--color-body)]">
            Cada look cuenta una historia. Explora mis servicios, mira la galería de cada uno y
            reserva tu cita con un toque elegante y profesional.
          </p>
        </div>
      </header>

      {/* Filtro de categorías */}
      <div className="sticky top-0 z-20 border-y border-[color:var(--color-border)] bg-[color:var(--color-background)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-2 px-4 py-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                active === cat
                  ? "bg-[color:var(--color-primary)] text-white"
                  : "bg-[color:var(--color-surface)] text-[color:var(--color-body)] hover:bg-[color:var(--color-surface-elevated)]"
              }`}
            >
              {cat === "TODOS" ? "Todos" : CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-[color:var(--color-surface-elevated)]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-[color:var(--color-muted)]">
            <p className="text-lg">Aún no hay servicios publicados en esta categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s, i) => {
              const img = primaryImage(s);
              const isVideo =
                !!s.videoUrl && hovered === s.id && !/youtube\.com|youtu\.be|vimeo/.test(s.videoUrl);
              return (
                <article
                  key={s.id}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-[color:var(--color-surface)] shadow-sm transition hover:shadow-xl"
                >
                  <button
                    onClick={() => setSelected(s)}
                    onMouseEnter={() => setHovered(s.id)}
                    onMouseLeave={() => setHovered(null)}
                    className="relative block aspect-[4/5] w-full overflow-hidden bg-[color:var(--color-surface-elevated)]"
                  >
                    {img && !isVideo && (
                      <img
                        src={img}
                        alt={s.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}
                    {isVideo && (
                      <video
                        src={s.videoUrl!}
                        autoPlay
                        muted
                        loop
                        className="h-full w-full object-cover"
                      />
                    )}
                    {!img && !isVideo && (
                      <div className="flex h-full items-center justify-center text-[color:var(--color-muted)]">
                        Sin imagen
                      </div>
                    )}
                    {s.videoUrl && (
                      <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
                        <Play className="h-3 w-3" /> Video
                      </span>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-[color:var(--color-primary)]/90 px-3 py-1 text-xs font-medium text-white">
                      {CATEGORY_LABELS[s.category] || s.category}
                    </span>
                  </button>

                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="font-[family:var(--font-playfair)] text-lg font-semibold text-[color:var(--color-heading)]">
                      {s.name}
                    </h2>
                    {s.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-[color:var(--color-body)]">
                        {s.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-3 text-sm text-[color:var(--color-muted)]">
                      <span className="font-semibold text-[color:var(--color-primary)]">S/ {s.price}</span>
                      {s.duration > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {s.duration} min
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setSelected(s)}
                      className="mt-4 w-full rounded-full border border-[color:var(--color-border)] py-2.5 text-sm font-medium text-[color:var(--color-heading)] transition hover:bg-[color:var(--color-primary)] hover:text-white"
                    >
                      Ver galería
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <ServiceLightbox service={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
