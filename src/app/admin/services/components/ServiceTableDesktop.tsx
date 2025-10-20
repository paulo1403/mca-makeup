"use client";

import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import type { Service } from "../types";
import Button from "@/components/ui/Button";

interface ServiceTableDesktopProps {
  services: Service[];
  serviceCategories: Record<string, string>;
  toggleActive: (service: Service) => void;
  handleView: (service: Service) => void;
  handleEdit: (service: Service) => void;
  handleDelete: (id: string) => void;
  openNewModal: () => void;
}

export default function ServiceTableDesktop({
  services,
  serviceCategories,
  toggleActive,
  handleView,
  handleEdit,
  handleDelete,
  openNewModal,
}: ServiceTableDesktopProps) {
  return (
    <div className="hidden lg:block bg-[color:var(--color-surface)] rounded-lg shadow overflow-hidden">
      {services.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[color:var(--color-primary)] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            {/* Sparkles icon omitted to reduce imports */}
            <span className="text-3xl">✨</span>
          </div>
          <h3 className="text-lg font-semibold text-[color:var(--color-heading)] mb-2">No tienes servicios aún</h3>
          <p className="text-[color:var(--color-body)] mb-6">Crea tu primer servicio para empezar a recibir reservas de tus clientes.</p>
          <Button
            onClick={openNewModal}
            variant="primary"
            size="md"
            className="inline-flex items-center space-x-2 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Crear Primer Servicio</span>
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[color:var(--color-border)]">
            <thead className="bg-[color:var(--color-surface-elevated)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider w-1/3 min-w-[200px]">Servicio</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider hidden sm:table-cell w-24">Categoría</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider w-20">Precio</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider hidden md:table-cell w-20">Duración</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider w-20">Estado</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider w-32">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-[color:var(--color-surface)] divide-y divide-[color:var(--color-border)]">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-[color:var(--color-surface-elevated)]">
                  <td className="px-4 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-[color:var(--color-heading)] truncate">{service.name}</div>
                      <div className="text-xs text-[color:var(--color-body)] sm:hidden">
                        {serviceCategories[service.category as keyof typeof serviceCategories]}
                      </div>
                      <div className="text-xs text-[color:var(--color-body)] md:hidden">{service.duration} min</div>
                      {service.description && (
                        <div className="text-xs text-[color:var(--color-muted)] truncate mt-1">{service.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm text-[color:var(--color-heading)] hidden sm:table-cell">
                    <span className="text-xs bg-[color:var(--color-selected)] text-[color:var(--color-primary)] border border-[color:var(--color-border)] px-2 py-1 rounded-full">
                      {serviceCategories[service.category as keyof typeof serviceCategories]}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-[color:var(--color-heading)]">
                    <span className="font-medium">S/ {service.price}</span>
                  </td>
                  <td className="px-3 py-4 text-sm text-[color:var(--color-heading)] hidden md:table-cell">{service.duration} min</td>
                  <td className="px-3 py-4">
                    <button
                      onClick={() => toggleActive(service)}
                      className={`px-2 py-1 text-xs font-semibold rounded-full transition-colors focus-ring ${
                        service.isActive
                          ? "bg-[color:var(--status-confirmed-bg)] text-[color:var(--status-confirmed-text)] border border-[color:var(--status-confirmed-border)]"
                          : "bg-[color:var(--status-cancelled-bg)] text-[color:var(--status-cancelled-text)] border border-[color:var(--status-cancelled-border)]"
                      }`}
                    >
                      {service.isActive ? "✓" : "✗"}
                    </button>
                  </td>
                  <td className="px-3 py-4 text-sm font-medium">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleView(service)}
                        className="text-[color:var(--color-primary)] hover:text-[color:var(--color-primary-hover)] p-1 rounded hover:bg-[color:var(--color-accent-soft)] transition-colors focus-ring"
                        title="Ver detalles completos"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-[color:var(--color-primary)] hover:text-[color:var(--color-primary-hover)] p-1 rounded hover:bg-[color:var(--color-accent-soft)] transition-colors focus-ring"
                        title="Editar servicio"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-[color:var(--status-cancelled-text)] hover:opacity-90 p-1 rounded hover:bg-[color:var(--status-cancelled-bg)] transition-colors focus-ring"
                        title="Eliminar servicio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}