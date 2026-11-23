"use client";

import { CheckCircle2, HeartOff, PackageCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "@/components/ui/Modal";

const STORAGE_KEY = "mca-admin-changelog-2026-11-23";

const CHANGES = [
  {
    icon: PackageCheck,
    title: "Dependencias al día",
    description: "Actualizamos las librerías del sitio para mantenerlo estable y seguro.",
  },
  {
    icon: Sparkles,
    title: "Footer más limpio",
    description: "Quitamos la firma personal del pie de página.",
  },
  {
    icon: HeartOff,
    title: "Finanzas sin mensajes personales",
    description: "Eliminamos el corazón y los mensajes ocultos del encabezado de Finanzas.",
  },
  {
    icon: CheckCircle2,
    title: "Mantenimiento interno",
    description: "Ordenamos el código y dejamos las revisiones de calidad sin observaciones.",
  },
];

export default function ChangelogModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) !== "seen") {
        setOpen(true);
      }
    } catch {
      // Si el navegador bloquea el almacenamiento, no mostramos el aviso para no repetirlo en cada visita.
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "seen");
    } catch {
      // Sin almacenamiento disponible, el aviso se cerrará solo para esta visita.
    }
  };

  return (
    <Modal open={open} onClose={handleClose} size="md" ariaLabelledBy="admin-changelog-title">
      <ModalHeader
        title={
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="block">
              <span
                id="admin-changelog-title"
                className="block font-montserrat text-lg font-semibold text-[color:var(--color-heading)]"
              >
                Novedades de esta actualización
              </span>
              <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
                23 de noviembre de 2026
              </span>
            </span>
          </div>
        }
        onClose={handleClose}
      />

      <ModalBody>
        <ul className="divide-y divide-[color:var(--color-border)]/60">
          {CHANGES.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-3 py-2.5 first:pt-0 last:pb-0 sm:py-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-surface-elevated)] text-[color:var(--color-primary)]">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[color:var(--color-heading)]">{title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-[color:var(--color-body)]">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </ModalBody>

      <ModalFooter>
        <div className="flex items-center justify-between gap-3">
          <p className="hidden text-xs text-[color:var(--color-muted)] sm:block">
            Este aviso aparece solo esta vez.
          </p>
          <Button type="button" size="sm" onClick={handleClose} className="w-full sm:w-auto">
            Entendido
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
