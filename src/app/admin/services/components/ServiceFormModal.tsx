"use client";

import { Clock, DollarSign, Film, Info, Pencil, Plus, Sparkles, Tag } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import Button from "@/components/ui/Button";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import type { Service, ServiceFormData } from "../types";
import MediaManager from "./MediaManager";

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

  const margin =
    formData.price && formData.cost
      ? (Number(formData.price) - Number(formData.cost)) / Number(formData.price)
      : null;

  return (
    <Modal open={show} onClose={onClose} size="lg" ariaLabelledBy="service-form-title">
      <ModalHeader
        title={
          <span id="service-form-title">
            {editingService ? "Editar Servicio" : "Nuevo Servicio"}
          </span>
        }
        icon={
          editingService ? (
            <Pencil className="w-6 h-6 text-[var(--color-primary)]" />
          ) : (
            <Plus className="w-6 h-6 text-[var(--color-primary)]" />
          )
        }
        onClose={onClose}
      />

      <ModalBody>
        <div className="mb-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
            <div>
              <p className="text-sm text-[var(--color-body)]">
                Completa los detalles del servicio y sube su galería de imágenes y video.
              </p>
              <p className="text-xs text-[var(--color-muted)]">
                Usa títulos claros, precios consistentes y selecciona la categoría adecuada.
              </p>
            </div>
          </div>
        </div>

        <form id="service-form" onSubmit={onSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-[var(--color-primary)]" />
              <h3 className="text-sm font-semibold text-[var(--color-heading)]">
                Información básica
              </h3>
            </div>
            <div>
              <label
                htmlFor="serviceName"
                className="block text-xs font-medium text-[var(--color-body)] mb-2"
              >
                Nombre del Servicio *
              </label>
              <input
                id="serviceName"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-[var(--color-heading)] text-sm bg-[var(--color-surface-elevated)]"
                placeholder="Ej: Maquillaje de Novia - Paquete Básico"
              />
            </div>

            <div>
              <label
                htmlFor="serviceDescription"
                className="block text-xs font-medium text-[var(--color-body)] mb-2"
              >
                Descripción
              </label>
              <textarea
                id="serviceDescription"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-[var(--color-heading)] text-sm resize-none bg-[var(--color-surface-elevated)]"
                placeholder="Describe brevemente el servicio..."
              />
            </div>
          </div>

          {/* Detalles del servicio */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-[var(--color-primary)]" />
              <h3 className="text-sm font-semibold text-[var(--color-heading)]">
                Precio, costo y categoría
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="servicePrice" className="block text-xs font-medium text-[var(--color-body)] mb-2">
                  Precio (S/) *
                </label>
                <input
                  id="servicePrice"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-[var(--color-heading)] text-sm bg-[var(--color-surface-elevated)]"
                  placeholder="150.00"
                />
              </div>

              <div>
                <label htmlFor="serviceCost" className="block text-xs font-medium text-[var(--color-body)] mb-2">
                  Costo (S/)
                </label>
                <input
                  id="serviceCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-[var(--color-heading)] text-sm bg-[var(--color-surface-elevated)]"
                  placeholder="0.00"
                />
                {margin !== null && (
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    Margen:{" "}
                    <span className={margin >= 0 ? "text-emerald-500" : "text-red-500"}>
                      {(margin * 100).toFixed(0)}%
                    </span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="serviceDuration" className="block text-xs font-medium text-[var(--color-body)] mb-2">
                  Duración (min) *
                </label>
                <input
                  id="serviceDuration"
                  type="number"
                  required
                  min="0"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-[var(--color-heading)] text-sm bg-[var(--color-surface-elevated)]"
                  placeholder={formData.category === "HAIRSTYLE" ? "0" : "90"}
                />
                {formData.duration === "0" && (
                  <p className="text-xs text-[var(--color-muted)] mt-1 flex items-center">
                    <Info className="w-3 h-3 mr-1 text-[var(--color-primary)]" />⚡ Duración 0: se
                    realiza simultáneamente con el maquillaje
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="serviceCategory" className="block text-xs font-medium text-[var(--color-body)] mb-2">
                  Categoría *
                </label>
                <select
                  id="serviceCategory"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-[var(--color-heading)] text-sm bg-[var(--color-surface-elevated)]"
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

          {/* Medios */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-4 h-4 text-[var(--color-primary)]" />
              <h3 className="text-sm font-semibold text-[var(--color-heading)]">
                Imágenes y video
              </h3>
            </div>
            <MediaManager
              images={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
              videoUrl={formData.videoUrl}
              onVideoChange={(url) => setFormData({ ...formData, videoUrl: url })}
            />
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
          <Button type="button" onClick={onClose} variant="ghost" size="md" className="min-w-[120px]">
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
