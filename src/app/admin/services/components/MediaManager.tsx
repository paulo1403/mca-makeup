"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Film, Star, Trash2, Upload, X } from "lucide-react";
import type { MediaItem } from "../types";

interface MediaManagerProps {
  images: MediaItem[];
  onChange: (images: MediaItem[]) => void;
  videoUrl: string;
  onVideoChange: (url: string) => void;
}

function keyFromUrl(url: string) {
  return url.replace(/^\/media\//, "");
}

export default function MediaManager({
  images,
  onChange,
  videoUrl,
  onVideoChange,
}: MediaManagerProps) {
  const [busy, setBusy] = useState(false);
  const [videoBusy, setVideoBusy] = useState(false);
  const [error, setError] = useState("");

  async function uploadFiles(files: FileList) {
    setError("");
    setBusy(true);
    try {
      const next = [...images];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || "Error al subir");
        }
        const data = await res.json();
        if (data.type?.startsWith("video")) {
          onVideoChange(data.url);
        } else {
          next.push({
            key: data.key,
            url: data.url,
            isPrimary: next.length === 0,
          });
        }
      }
      onChange(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir imágenes");
    } finally {
      setBusy(false);
    }
  }

  async function uploadVideo(file: File) {
    setError("");
    setVideoBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Error al subir video");
      const data = await res.json();
      onVideoChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir video");
    } finally {
      setVideoBusy(false);
    }
  }

  async function removeAt(index: number) {
    const item = images[index];
    if (item?.key) {
      fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: item.key }),
      }).catch(() => {});
    }
    const next = images.filter((_, i) => i !== index);
    if (!next.some((i) => i.isPrimary) && next.length > 0) next[0].isPrimary = true;
    onChange(next);
  }

  function setPrimary(index: number) {
    onChange(images.map((img, i) => ({ ...img, isPrimary: i === index })));
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-xs text-[color:var(--status-cancelled-text)]">{error}</p>
      )}

      {/* Galería de imágenes */}
      <div>
        <label className="block text-xs font-medium text-[color:var(--color-body)] mb-2">
          Galería de imágenes
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div
              key={img.url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)]"
            >
              <img
                src={img.url}
                alt={img.alt || "servicio"}
                className="h-full w-full object-cover"
              />
              {img.isPrimary && (
                <span className="absolute left-1 top-1 rounded bg-[color:var(--color-primary)] px-1 py-0.5 text-[10px] font-semibold text-white">
                  Principal
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  title="Marcar principal"
                  onClick={() => setPrimary(i)}
                  className="rounded p-1 text-white hover:bg-white/20"
                >
                  <Star className={`h-4 w-4 ${img.isPrimary ? "fill-yellow-400 text-yellow-400" : ""}`} />
                </button>
                <button
                  type="button"
                  title="Subir"
                  onClick={() => move(i, -1)}
                  className="rounded p-1 text-white hover:bg-white/20"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Bajar"
                  onClick={() => move(i, 1)}
                  className="rounded p-1 text-white hover:bg-white/20"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Eliminar"
                  onClick={() => removeAt(i)}
                  className="rounded p-1 text-white hover:bg-red-500/40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[color:var(--color-border)] text-[color:var(--color-muted)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]">
            <Upload className="h-5 w-5" />
            <span className="text-[10px]">{busy ? "Subiendo..." : "Agregar"}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={busy}
              onChange={(e) => e.target.files && uploadFiles(e.target.files)}
            />
          </label>
        </div>
      </div>

      {/* Video */}
      <div>
        <label className="block text-xs font-medium text-[color:var(--color-body)] mb-2">
          Video (opcional)
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => onVideoChange(e.target.value)}
            placeholder="URL de YouTube/Vimeo o sube un archivo"
            className="flex-1 px-3 py-2 border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-surface-elevated)] text-sm text-[color:var(--color-heading)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
          />
          <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[color:var(--color-border)] px-3 py-2 text-xs text-[color:var(--color-body)] hover:border-[color:var(--color-primary)]">
            <Film className="h-4 w-4" />
            {videoBusy ? "Subiendo..." : "Subir video"}
            <input
              type="file"
              accept="video/*"
              className="hidden"
              disabled={videoBusy}
              onChange={(e) => e.target.files?.[0] && uploadVideo(e.target.files[0])}
            />
          </label>
          {videoUrl && (
            <button
              type="button"
              title="Quitar video"
              onClick={() => onVideoChange("")}
              className="rounded-lg border border-[color:var(--color-border)] p-2 text-[color:var(--color-muted)] hover:text-[color:var(--status-cancelled-text)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {videoUrl && (
          <p className="mt-1 truncate text-[11px] text-[color:var(--color-muted)]">{videoUrl}</p>
        )}
      </div>
    </div>
  );
}
