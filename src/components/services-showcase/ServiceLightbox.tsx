"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, X } from "lucide-react";

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

function isEmbed(videoUrl?: string | null) {
  if (!videoUrl) return null;
  if (/youtube\.com|youtu\.be/.test(videoUrl)) return "youtube";
  if (/vimeo\.com/.test(videoUrl)) return "vimeo";
  return "file";
}

export default function ServiceLightbox({
  service,
  onClose,
}: {
  service: Service | null;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [service?.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (service ? (i + 1) % service.images.length : i));
      if (e.key === "ArrowLeft")
        setIndex((i) => (service ? (i - 1 + service.images.length) % service.images.length : i));
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [service, onClose]);

  if (!service) return null;
  const embed = isEmbed(service.videoUrl);
  const imgs = service.images;
  const current = imgs[index];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-[color:var(--color-surface)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative aspect-[4/3] w-full bg-[color:var(--color-surface-elevated)]">
          {embed ? (
            embed === "file" ? (
              <video src={service.videoUrl!} controls autoPlay className="h-full w-full object-contain" />
            ) : (
              <iframe
                src={service.videoUrl!}
                className="h-full w-full"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            )
          ) : current ? (
            <img src={current.url} alt={current.alt || service.name} className="h-full w-full object-contain" />
          ) : (
            <div className="flex h-full items-center justify-center text-[color:var(--color-muted)]">
              Sin imagen
            </div>
          )}

          {imgs.length > 1 && !embed && (
            <>
              <button
                onClick={() => setIndex((i) => (i - 1 + imgs.length) % imgs.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIndex((i) => (i + 1) % imgs.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3
                className="font-[family:var(--font-playfair)] text-xl font-semibold text-[color:var(--color-heading)]"
              >
                {service.name}
              </h3>
              <p className="mt-1 flex items-center gap-3 text-sm text-[color:var(--color-muted)]">
                <span className="font-medium text-[color:var(--color-primary)]">S/ {service.price}</span>
                {service.duration > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {service.duration} min
                  </span>
                )}
              </p>
            </div>
            <a
              href="/booking"
              className="shrink-0 rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-medium text-white transition hover:bg-[color:var(--color-primary-hover)]"
            >
              Reservar
            </a>
          </div>

          {service.description && (
            <p className="text-sm text-[color:var(--color-body)]">{service.description}</p>
          )}

          {imgs.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pt-1">
              {imgs.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setIndex(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    i === index
                      ? "border-[color:var(--color-primary)]"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt={img.alt || ""} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
