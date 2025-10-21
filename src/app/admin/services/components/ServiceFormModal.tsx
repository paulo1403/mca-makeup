"use client";

import { Dispatch, SetStateAction } from "react";
import { Info, Plus, Pencil, Sparkles, Tag, DollarSign, Clock } from "lucide-react";
import type { Service, ServiceFormData } from "../types";
import Modal, { ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface ServiceFormModalProps {
  show: boolean;
  editingService: Service | null;
  formData: ServiceFormData;
  setFormData: Dispatch<SetStateAction<ServiceFormData>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  serviceCategories: Record<string, string>;
}

export default function ServiceFormModal({
  show,
  editingService,
  formData,
  setFormData,
  onClose,
  onSubmit,
  serviceCategories,
}: ServiceFormModalProps) {
  if (!show) return null;

  return (
    <Modal open={show} onClose={onClose} size="lg" ariaLabelledBy="service-form-title">
      <ModalHeader
        title={<span id="service-form-title">{editingService ? "Editar Servicio" : "Nuevo Servicio"}</span>}
        icon={editingService ? (
          <Pencil className="w-6 h-6 text-[var(--color-primary)]" />
        ) : (
          <Plus className="w-6 h-6 text-[var(--color-primary)]" />
        )}
        onClose={onClose}
      />

      <ModalBody>
        {/* Banda introductoria estética */}
        <div className="mb-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
            <div>
              <p className="text-sm text-[var(--color-body)]">Completa los detalles del servicio para mantener tu catálogo ordenado y coherente con el tema.</p>
              <p className="text-xs text-[var(--color-muted)]">Usa títulos claros, precios consistentes y selecciona la categoría adecuada.</p>
            </div>
          </div>
        </div>

        <form id="service-form" onSubmit={onSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-[var(--color-primary)]" />
              <h3 className="text-sm font-semibold text-[var(--color-heading)]">Información básica</h3>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-body)] mb-2">Nombre del Servicio *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-[var(--color-heading)] text-base bg-[var(--color-surface-elevated)]"
                placeholder="Ej: Maquillaje de Novia - Paquete Básico"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-body)] mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-[var(--color-heading)] text-base resize-none bg-[var(--color-surface-elevated)]"
                placeholder="Describe brevemente el servicio..."
              />
            </div>
          </div>

          {/* Detalles del servicio */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-[var(--color-primary)]" />
              <h3 className="text-sm font-semibold text-[var(--color-heading)]">Precio, duración y categoría</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-medium text-[var(--color-body)] mb-2">Precio (S/) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-[var(--color-heading)] text-base bg-[var(--color-surface-elevated)]"
                  placeholder="150.00"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-body)] mb-2">Duración (min) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-[var(--color-heading)] text-base bg-[var(--color-surface-elevated)]"
                  placeholder={formData.category === "HAIRSTYLE" ? "0" : "90"}
                />
                {formData.duration === "0" && (
                  <p className="text-xs text-[var(--color-muted)] mt-1 flex items-center">
                    <Info className="w-3 h-3 mr-1 text-[var(--color-primary)]" />
                    ⚡ Duración 0: Se realizará simultáneamente con el maquillaje (no suma tiempo total)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-body)] mb-2">Categoría *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-[var(--color-heading)] text-base bg-[var(--color-surface-elevated)]"
                >
                  {Object.entries(serviceCategories).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Estado del servicio */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-[var(--color-primary)]" />
              <h3 className="text-sm font-semibold text-[var(--color-heading)]">Disponibilidad</h3>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-[var(--color-surface-elevated)] rounded-lg">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-[var(--color-primary)] border-[var(--color-border)] rounded focus:ring-[var(--color-primary)] focus:ring-2 bg-[var(--color-surface)]"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-[var(--color-body)]">
                Servicio activo (los clientes pueden reservar)
              </label>
            </div>
          </div>
        </form>
      </ModalBody>

      <ModalFooter>
        <div className="flex flex-row justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            size="md"
            className="min-w-[120px]"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="service-form"
            variant="primary"
            size="md"
            className="min-w-[120px]"
          >
            {editingService ? "Actualizar Servicio" : "Crear Servicio"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}