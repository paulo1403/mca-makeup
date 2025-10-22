"use client";

import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { Info, Plus } from "lucide-react";
import type { Service } from "../types";

interface ServicesHeaderProps {
  services: Service[];
  onOpenInfo: () => void;
  onCreateNew: () => void;
}

export default function ServicesHeader({ services, onOpenInfo, onCreateNew }: ServicesHeaderProps) {
  const activeCount = services.filter((s) => s.isActive).length;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <Typography
          as="h1"
          variant="h3"
          className="sm:text-h2 font-bold text-[var(--color-heading)] font-playfair"
        >
          Gestión de Servicios
        </Typography>
        <div className="flex items-center space-x-4 mt-1">
          <div className="text-sm text-[var(--color-body)]">
            Total:{" "}
            <span className="font-semibold text-[var(--color-primary)]">{services.length}</span>{" "}
            servicios
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[var(--status-confirmed-text)]"></div>
            <span className="text-xs text-[var(--color-muted)]">{activeCount} activos</span>
          </div>
          <Button
            onClick={onOpenInfo}
            variant="ghost"
            size="xs"
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:bg-[var(--color-accent-soft)] px-2 py-1 rounded-md transition-colors focus-ring"
          >
            <Info className="w-3 h-3" />
            <span className="hidden sm:inline">¿Cómo funcionan las combinaciones?</span>
            <span className="sm:hidden">Info</span>
          </Button>
        </div>
      </div>
      <Button
        onClick={onCreateNew}
        variant="primary"
        size="md"
        className="w-full sm:w-auto flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
      >
        <Plus className="w-4 h-4" />
        <span>Nuevo Servicio</span>
      </Button>
    </div>
  );
}
