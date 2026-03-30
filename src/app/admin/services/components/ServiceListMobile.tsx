"use client";

import { CheckCircle2, Clock, Eye, Pencil, Plus, Sparkles, Tag, Trash2, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Service } from "../types";

const surfaceCardClass =
  "border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface)] text-[color:var(--color-body)] shadow-none";

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
        <Card className={surfaceCardClass}>
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--color-primary)]/10">
              <Sparkles className="h-8 w-8 text-[color:var(--color-primary)]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-[color:var(--color-heading)]">
              No tienes servicios aún
            </h3>
            <p className="mb-6 text-sm text-[color:var(--color-body)]">
              Crea tu primer servicio para empezar a recibir reservas de tus clientes.
            </p>
            <Button
              onClick={openNewModal}
              variant="primary"
              size="md"
              className="flex items-center gap-2 mx-auto shadow-md hover:shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Crear Primer Servicio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <Card
              key={service.id}
              className={surfaceCardClass}
            >
              <CardContent className="p-4">
                {/* Header row */}
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[color:var(--color-heading)]">
                      {service.name}
                    </p>
                    {service.description && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-[color:var(--color-muted)]">
                        {service.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleActive(service)}
                    className="shrink-0 focus-ring rounded"
                    aria-pressed={service.isActive}
                    aria-label="Cambiar estado del servicio"
                    title={service.isActive ? "Desactivar servicio" : "Activar servicio"}
                  >
                    <Badge
                      variant="outline"
                      className={
                        service.isActive
                          ? "cursor-pointer border-[color:var(--status-confirmed-border)] bg-[color:var(--status-confirmed-bg)] text-[color:var(--status-confirmed-text)] transition-opacity hover:opacity-75"
                          : "cursor-pointer border-[color:var(--status-cancelled-border)] bg-[color:var(--status-cancelled-bg)] text-[color:var(--status-cancelled-text)] transition-opacity hover:opacity-75"
                      }
                    >
                      {service.isActive ? (
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                      ) : (
                        <XCircle className="mr-1 h-3 w-3" />
                      )}
                      {service.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </button>
                </div>

                {/* Detail chips */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface-elevated)] px-2.5 py-1.5">
                    <Tag className="h-3.5 w-3.5 text-[color:var(--color-muted)]" />
                    <span className="text-xs text-[color:var(--color-body)]">
                      {serviceCategories[service.category as keyof typeof serviceCategories]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface-elevated)] px-2.5 py-1.5">
                    <span className="text-xs font-medium tabular-nums text-[color:var(--color-heading)]">
                      S/ {service.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface-elevated)] px-2.5 py-1.5">
                    <Clock className="h-3.5 w-3.5 text-[color:var(--color-muted)]" />
                    <span className="text-xs text-[color:var(--color-body)]">
                      {service.duration} min
                    </span>
                  </div>
                </div>

                {/* Action row */}
                <div className="flex gap-2 border-t border-[color:var(--color-border)]/60 pt-3">
                  <button
                    onClick={() => handleView(service)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[color:var(--color-border)]/60 px-3 py-2 text-xs font-medium text-[color:var(--color-body)] transition-colors hover:bg-[color:var(--color-surface-elevated)] focus-ring"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Ver
                  </button>
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[color:var(--color-primary)]/40 bg-[color:var(--color-primary)]/8 px-3 py-2 text-xs font-medium text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-primary)]/15 focus-ring"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[color:var(--status-cancelled-border)] bg-[color:var(--status-cancelled-bg)] px-3 py-2 text-xs font-medium text-[color:var(--status-cancelled-text)] transition-colors hover:opacity-80 focus-ring"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
