"use client";

import { Eye, Info, Pencil, DollarSign, Clock, Tag, Sparkles } from "lucide-react";
import Modal, { ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import type { Service } from "../types";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";

interface ViewServiceModalProps {
  show: boolean;
  viewingService: Service | null;
  onClose: () => void;
  serviceCategories: Record<string, string>;
  onEdit: (service: Service) => void;
}

export default function ViewServiceModal({
  show,
  viewingService,
  onClose,
  serviceCategories,
  onEdit,
}: ViewServiceModalProps) {
  if (!show || !viewingService) return null;

  const isActiveChip = viewingService.isActive
    ? "bg-[var(--status-confirmed-bg)] text-[var(--status-confirmed-text)] border-[var(--status-confirmed-border)]"
    : "bg-[var(--status-cancelled-bg)] text-[var(--status-cancelled-text)] border-[var(--status-cancelled-border)]";

  return (
    <Modal open={show} onClose={onClose} size="lg" ariaLabelledBy="view-service-title">
      <ModalHeader
        title={<span id="view-service-title">Detalles del Servicio</span>}
        icon={<Eye className="w-5 h-5 text-[var(--color-primary)]" />}
        onClose={onClose}
      />

      <ModalBody>
        {/* Resumen */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <Typography as="h3" variant="h4" className="text-[var(--color-heading)] font-semibold mb-2 tracking-tight">{viewingService.name}</Typography>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${isActiveChip}`}>
                  {viewingService.isActive ? "✓ Activo" : "✗ Inactivo"}
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full border bg-[var(--color-selected)] text-[var(--color-primary)] border-[var(--color-border)]">
                  {serviceCategories[viewingService.category]}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2">
              <DollarSign className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-sm text-[var(--color-heading)]">S/ {viewingService.price}</span>
            </div>
            <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2">
              <Clock className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-sm text-[var(--color-heading)]">{viewingService.duration} min</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2">
              <Tag className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-sm text-[var(--color-heading)]">{serviceCategories[viewingService.category]}</span>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-[var(--color-primary)]" />
            <h4 className="text-sm font-semibold text-[var(--color-heading)]">Descripción</h4>
          </div>
          {viewingService.description ? (
            <p className="text-sm text-[var(--color-body)]">{viewingService.description}</p>
          ) : (
            <p className="text-sm text-[var(--color-muted)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
              Sin descripción. Agrega detalles para una mejor presentación.
            </p>
          )}
        </div>

        {/* Información adicional según categoría */}
        {viewingService.category === "HAIRSTYLE" && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h4 className="font-semibold text-[var(--color-heading)] mb-2 flex items-center">
              <span className="mr-2">💡</span>
              Información Especial: Peinados
            </h4>
            <p className="text-sm text-[var(--color-body)]">
              Este servicio de peinado solo puede ser reservado junto con un servicio de maquillaje. Los clientes verán el peinado como un valor agregado a su servicio principal.
            </p>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <div className="flex justify-between w-full">
          <div className="text-xs text-[var(--color-muted)]"></div>
          <div className="flex space-x-3">
            <Button
              type="button"
              onClick={() => {
                onClose();
                onEdit(viewingService);
              }}
              variant="primary"
              size="md"
              className="min-w-[120px] flex items-center space-x-2"
            >
              <Pencil className="w-4 h-4" />
              <span>Editar</span>
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              size="md"
              className="min-w-[120px]"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}