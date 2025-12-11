"use client";

import React from "react";
import Typography from "./ui/Typography";
import Button from "./ui/Button";

type PriceSummaryBarProps = {
  total?: number;
  note?: string;
  ctaLabel?: string;
  onPrimaryClick?: () => void;
  visible?: boolean;
};

export default function PriceSummaryBar({
  total = 0,
  note = "El total puede incluir transporte u horario nocturno",
  ctaLabel = "Reservar ahora",
  onPrimaryClick,
  visible = true,
}: PriceSummaryBarProps) {
  if (!visible) return null;
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 sm:px-6"
      role="region"
      aria-label="Resumen de precio"
    >
      <div className="mx-auto max-w-6xl rounded-xl border border-[color:var(--color-border)]/30 bg-[color:var(--color-surface)] shadow-lg">
        <div className="flex items-center gap-3 p-3 sm:p-4" aria-live="polite">
          <div className="flex-1 min-w-0">
            <Typography as="p" variant="p" className="text-[color:var(--color-muted)] text-xs sm:text-sm">
              Total seleccionado
            </Typography>
            <Typography as="p" variant="p" className="text-[color:var(--color-heading)] font-semibold text-base sm:text-lg">
              S/ {Number(total || 0).toFixed(2)}
            </Typography>
            <Typography as="p" variant="p" className="text-[color:var(--color-muted)] text-[11px] sm:text-xs mt-0.5">
              {note}
            </Typography>
          </div>
          {onPrimaryClick && (
            <div className="flex-shrink-0">
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="min-w-[160px]"
                onClick={onPrimaryClick}
              >
                {ctaLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
