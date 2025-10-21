"use client";

import { Plus, Sparkles, Tag, DollarSign, Clock, Eye, Pencil, Trash2 } from "lucide-react";
import type { Service } from "../types";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";

interface ServiceListMobileProps {
  services: Service[];
  serviceCategories: Record<string, string>;
  toggleActive: (service: Service) => void;
  handleEdit: (service: Service) => void;
  handleView: (service: Service) => void;
  handleDelete: (id: string) => void;
  openNewModal: () => void;
}

export default function ServiceListMobile({
  services,
  serviceCategories,
  toggleActive,
  handleEdit,
  handleView,
  handleDelete,
  openNewModal,
}: ServiceListMobileProps) {
  return (
    <div className="block lg:hidden">
      {services.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-[var(--color-primary)] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <Typography as="h3" variant="h4" className="text-[var(--color-heading)] mb-2 font-semibold">
            No tienes servicios aún
          </Typography>
          <Typography as="p" variant="small" className="text-[var(--color-body)] mb-6">
            Crea tu primer servicio para empezar a recibir reservas de tus clientes.
          </Typography>
          <Button
            onClick={openNewModal}
            variant="primary"
            size="md"
            className="flex items-center space-x-2 mx-auto shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Crear Primer Servicio</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm p-4 transition-all hover:shadow-md"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 mr-2 min-w-0">
                  <Typography
                    as="h3"
                    variant="h4"
                    className="text-[var(--color-heading)] font-semibold text-base leading-tight truncate"
                  >
                    {service.name}
                  </Typography>
                  {service.description && (
                    <Typography as="p" variant="small" className="text-[var(--color-body)] mt-1">
                      {service.description}
                    </Typography>
                  )}
                </div>
                <Button
                  onClick={() => toggleActive(service)}
                  variant="ghost"
                  size="xs"
                  aria-pressed={service.isActive}
                  aria-label="Cambiar estado del servicio"
                  className={`rounded-full px-3 py-1 text-xs focus-ring transition-colors ${
                    service.isActive
                      ? "bg-[var(--status-confirmed-bg)] text-[var(--status-confirmed-text)] border border-[var(--status-confirmed-border)] hover:opacity-90"
                      : "bg-[var(--status-cancelled-bg)] text-[var(--status-cancelled-text)] border border-[var(--status-cancelled-border)] hover:opacity-90"
                  }`}
                >
                  {service.isActive ? "Activo" : "Inactivo"}
                </Button>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-[var(--color-muted)]" />
                  <div>
                    <p className="text-[var(--color-muted)] text-xs">Categoría</p>
                    <p className="font-medium text-[var(--color-heading)]">
                      {serviceCategories[service.category as keyof typeof serviceCategories]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-[var(--color-muted)]" />
                  <div>
                    <p className="text-[var(--color-muted)] text-xs">Precio</p>
                    <p className="font-medium text-[var(--color-heading)]">S/ {service.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[var(--color-muted)]" />
                  <div>
                    <p className="text-[var(--color-muted)] text-xs">Duración</p>
                    <p className="font-medium text-[var(--color-heading)]">{service.duration} min</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-[var(--color-border)] pt-3">
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(service)}
                    variant="ghost"
                    size="sm"
                    className="flex-1 focus-ring"
                  >
                    <Pencil className="inline-block w-4 h-4 mr-1" /> Editar
                  </Button>
                  <Button
                    onClick={() => handleView(service)}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                  >
                    <Eye className="inline-block w-4 h-4 mr-1" /> Ver
                  </Button>
                  <Button
                    onClick={() => handleDelete(service.id)}
                    variant="danger"
                    size="sm"
                    className="flex-1"
                  >
                    <Trash2 className="inline-block w-4 h-4 mr-1" /> Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}