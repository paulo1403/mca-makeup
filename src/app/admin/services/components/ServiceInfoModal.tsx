"use client";

import { CheckCircle2, Clock, Info, Scissors, Sparkles, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/ui/Button";

interface ServiceInfoModalProps {
  show: boolean;
  onClose: () => void;
}

const allowed = [
  { label: "Solo Maquillaje", detail: "Cualquier categoría: Novia, Social, Piel Madura" },
  { label: "Maquillaje + Peinado", detail: "La combinación perfecta para el look completo" },
  { label: "Máximo 2 tipos", detail: "No se combinan más de 2 categorías diferentes" },
];

const notAllowed = [
  { label: "Solo Peinado", detail: "Debe incluir un servicio de maquillaje base" },
  { label: "Novia + Social", detail: "No se pueden mezclar categorías de maquillaje" },
  { label: "3+ categorías", detail: "Demasiadas opciones en una sola cita" },
];

const tips = [
  { icon: Clock, label: "Duración 0", detail: "Se realiza simultáneo al maquillaje, no suma tiempo" },
  { icon: Sparkles, label: "Paquetes por temporada", detail: "Crea combos Glam vs Básico para distintos presupuestos" },
  { icon: Scissors, label: "Upselling natural", detail: "Ofrece el peinado como complemento al confirmar la cita" },
];

export default function ServiceInfoModal({ show, onClose }: ServiceInfoModalProps) {
  return (
    <Dialog open={show} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        showCloseButton
        className="sm:max-w-2xl flex flex-col max-h-[90dvh] bg-[color:var(--color-surface)] text-[color:var(--color-body)] border-[color:var(--color-border)] p-0 gap-0 overflow-hidden"
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[color:var(--color-border)]/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color:var(--color-border)]/60 bg-[color:var(--color-primary)]/10">
              <Info className="h-4 w-4 text-[color:var(--color-primary)]" />
            </div>
            <div>
              <DialogTitle className="text-base text-[color:var(--color-heading)]">
                Combinaciones de Servicios
              </DialogTitle>
              <DialogDescription className="text-xs text-[color:var(--color-muted)] mt-0.5">
                Reglas de negocio para las reservas de tus clientes
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Allowed / Not allowed */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="border border-[color:var(--status-confirmed-border)] bg-[color:var(--status-confirmed-bg)] shadow-none">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--status-confirmed-text)]" />
                  <span className="text-sm font-semibold text-[color:var(--status-confirmed-text)]">
                    Combinaciones permitidas
                  </span>
                </div>
                <ul className="space-y-2">
                  {allowed.map((item) => (
                    <li key={item.label} className="space-y-0.5">
                      <p className="text-xs font-semibold text-[color:var(--status-confirmed-text)]">
                        {item.label}
                      </p>
                      <p className="text-xs text-[color:var(--status-confirmed-text)]/80">
                        {item.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-[color:var(--status-cancelled-border)] bg-[color:var(--status-cancelled-bg)] shadow-none">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-[color:var(--status-cancelled-text)]" />
                  <span className="text-sm font-semibold text-[color:var(--status-cancelled-text)]">
                    No permitido
                  </span>
                </div>
                <ul className="space-y-2">
                  {notAllowed.map((item) => (
                    <li key={item.label} className="space-y-0.5">
                      <p className="text-xs font-semibold text-[color:var(--status-cancelled-text)]">
                        {item.label}
                      </p>
                      <p className="text-xs text-[color:var(--status-cancelled-text)]/80">
                        {item.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Pricing strategy */}
          <Card className="border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface-elevated)] shadow-none">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <Scissors className="h-4 w-4 text-[color:var(--color-primary)]" />
                <span className="text-sm font-semibold text-[color:var(--color-heading)]">
                  Estrategia de peinados
                </span>
              </div>
              <p className="text-xs text-[color:var(--color-body)] mb-4">
                Los peinados funcionan mejor como{" "}
                <span className="font-semibold text-[color:var(--color-heading)]">
                  servicios complementarios
                </span>{" "}
                de maquillaje. Precios accesibles incentivan la combinación y aumentan el ticket promedio.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 mb-4">
                <div className="rounded-lg border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface)] px-3 py-2.5">
                  <p className="text-xs text-[color:var(--color-muted)] mb-0.5">Ejemplo</p>
                  <p className="text-xs font-medium text-[color:var(--color-heading)]">
                    Maquillaje Social S/ 200 + Peinado S/ 80
                  </p>
                </div>
                <div className="rounded-lg border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface)] px-3 py-2.5">
                  <p className="text-xs text-[color:var(--color-muted)] mb-0.5">Beneficio</p>
                  <p className="text-xs font-medium text-[color:var(--color-heading)]">
                    Mayor valor percibido y mejor experiencia
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {tips.map(({ icon: Icon, label, detail }) => (
                  <div key={label} className="flex items-start gap-3 rounded-lg border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface)] px-3 py-2.5">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[color:var(--color-primary)]/10">
                      <Icon className="h-3.5 w-3.5 text-[color:var(--color-primary)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[color:var(--color-heading)]">{label}</p>
                      <p className="text-xs text-[color:var(--color-muted)]">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick reference badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] text-[color:var(--color-body)] text-xs">
              Duración 0 = simultáneo
            </Badge>
            <Badge variant="outline" className="border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] text-[color:var(--color-body)] text-xs">
              &gt; 0 min = secuencial
            </Badge>
            <Badge variant="outline" className="border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] text-[color:var(--color-body)] text-xs">
              Máx. 2 categorías por cita
            </Badge>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4">
          <Button type="button" onClick={onClose} variant="ghost" size="md" className="min-w-[100px]">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


