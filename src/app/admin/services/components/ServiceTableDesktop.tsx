"use client";

import { Eye, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Service } from "../types";

const surfaceCardClass =
  "border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface)] text-[color:var(--color-body)] shadow-none";

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
    <div className="hidden lg:block">
      <Card className={surfaceCardClass}>
        {services.length === 0 ? (
          <CardContent className="py-16 text-center">
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
              className="inline-flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Crear Primer Servicio
            </Button>
          </CardContent>
        ) : (
          <>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-[color:var(--color-heading)]">
                  Lista de servicios
                </CardTitle>
                <span className="text-xs text-[color:var(--color-muted)]">
                  {services.length} {services.length === 1 ? "servicio" : "servicios"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-[color:var(--color-border)]/60 hover:bg-transparent">
                    <TableHead className="pl-6 text-xs font-medium uppercase tracking-wider text-[color:var(--color-muted)]">
                      Servicio
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-muted)]">
                      Categoría
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-muted)]">
                      Precio
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-muted)]">
                      Duración
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-muted)]">
                      Estado
                    </TableHead>
                    <TableHead className="pr-6 text-xs font-medium uppercase tracking-wider text-[color:var(--color-muted)]">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow
                      key={service.id}
                      className="border-[color:var(--color-border)]/60 hover:bg-[color:var(--color-surface-elevated)]"
                    >
                      <TableCell className="pl-6">
                        <div className="max-w-xs">
                          <p className="truncate text-sm font-medium text-[color:var(--color-heading)]">
                            {service.name}
                          </p>
                          {service.description && (
                            <p className="mt-0.5 truncate text-xs text-[color:var(--color-muted)]">
                              {service.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] text-xs text-[color:var(--color-body)]"
                        >
                          {serviceCategories[service.category as keyof typeof serviceCategories]}
                        </Badge>
                      </TableCell>
                      <TableCell className="tabular-nums text-sm font-medium text-[color:var(--color-heading)]">
                        S/ {service.price}
                      </TableCell>
                      <TableCell className="text-sm text-[color:var(--color-heading)]">
                        {service.duration} min
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => toggleActive(service)}
                          className="focus-ring rounded"
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
                            {service.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </button>
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => handleView(service)}
                            className="rounded-md p-1.5 text-[color:var(--color-muted)] transition-colors hover:bg-[color:var(--color-primary)]/10 hover:text-[color:var(--color-primary)] focus-ring"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(service)}
                            className="rounded-md p-1.5 text-[color:var(--color-muted)] transition-colors hover:bg-[color:var(--color-primary)]/10 hover:text-[color:var(--color-primary)] focus-ring"
                            title="Editar servicio"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="rounded-md p-1.5 text-[color:var(--color-muted)] transition-colors hover:bg-[color:var(--status-cancelled-bg)] hover:text-[color:var(--status-cancelled-text)] focus-ring"
                            title="Eliminar servicio"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
