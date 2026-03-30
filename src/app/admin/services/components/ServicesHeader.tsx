"use client";

import { CheckCircle2, Info, Layers, Package, Plus, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Service } from "../types";

const surfaceCardClass =
  "border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface)] text-[color:var(--color-body)] shadow-none";

interface ServicesHeaderProps {
  services: Service[];
  onOpenInfo: () => void;
  onCreateNew: () => void;
}

export default function ServicesHeader({ services, onOpenInfo, onCreateNew }: ServicesHeaderProps) {
  const activeCount = services.filter((s) => s.isActive).length;
  const inactiveCount = services.length - activeCount;
  const categoryCount = new Set(services.map((s) => s.category)).size;

  const statCards = [
    {
      label: "Total",
      value: services.length,
      detail: "servicios",
      icon: Package,
      accent: "text-[color:var(--color-primary)]",
      accentBg: "bg-[color:var(--color-primary)]/10",
    },
    {
      label: "Activos",
      value: activeCount,
      detail: "visibles",
      icon: CheckCircle2,
      accent: "text-[color:var(--status-confirmed-text)]",
      accentBg: "bg-[color:var(--status-confirmed-bg)]",
    },
    {
      label: "Inactivos",
      value: inactiveCount,
      detail: "ocultos",
      icon: XCircle,
      accent: "text-[color:var(--status-cancelled-text)]",
      accentBg: "bg-[color:var(--status-cancelled-bg)]",
    },
    {
      label: "Categorías",
      value: categoryCount,
      detail: "tipos",
      icon: Layers,
      accent: "text-[color:var(--color-accent)]",
      accentBg: "bg-[color:var(--color-accent)]/12",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Hero card */}
      <Card className="relative overflow-hidden border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface)] text-[color:var(--color-body)] shadow-none">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,color-mix(in_srgb,var(--color-primary)_12%,var(--color-surface)),var(--color-surface))] opacity-95"
          aria-hidden="true"
        />
        <CardContent className="relative px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--color-muted)] uppercase">
                Catálogo
              </p>
              <h1 className="mt-1 font-heading text-2xl text-[color:var(--color-heading)] sm:text-3xl">
                Gestión de Servicios
              </h1>
              <p className="mt-2 text-sm text-[color:var(--color-body)]">
                Administra el catálogo de servicios disponibles para tus clientes.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="justify-center border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] px-3 py-1 text-[color:var(--color-body)]"
              >
                {services.length} servicios
              </Badge>
              <Badge
                variant="outline"
                className="justify-center border-[color:var(--status-confirmed-border)] bg-[color:var(--status-confirmed-bg)] px-3 py-1 text-[color:var(--status-confirmed-text)]"
              >
                {activeCount} activos
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stat metric cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map(({ label, value, detail, icon: Icon, accent, accentBg }) => (
          <Card key={label} className={surfaceCardClass}>
            <CardContent className="px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[color:var(--color-muted)]">{label}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-[color:var(--color-heading)]">
                    {value}
                  </p>
                  <p className="mt-0.5 text-xs text-[color:var(--color-body)]">{detail}</p>
                </div>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color:var(--color-border)]/50 ${accentBg}`}
                >
                  <Icon className={`h-[18px] w-[18px] ${accent}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          onClick={onOpenInfo}
          variant="ghost"
          size="md"
          className="w-full justify-start gap-2 text-[color:var(--color-muted)] hover:text-[color:var(--color-body)] sm:w-auto"
        >
          <Info className="h-4 w-4 shrink-0" />
          ¿Cómo funcionan las combinaciones de servicios?
        </Button>
        <Button
          onClick={onCreateNew}
          variant="primary"
          size="md"
          className="flex w-full items-center justify-center gap-2 shadow-md hover:shadow-lg sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nuevo Servicio
        </Button>
      </div>
    </div>
  );
}
