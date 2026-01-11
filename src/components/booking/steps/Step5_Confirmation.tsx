"use client";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { useBookingSummary } from "@/hooks/useBookingSummary";
import useServicesQuery from "@/hooks/useServicesQuery";
import { useTransportCost } from "@/hooks/useTransportCost";
import type { BookingData } from "@/lib/bookingSchema";
import { calculateNightShiftCost } from "@/utils/nightShift";
import { Check, Copy, CreditCard, FileText } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

export default function Step5_Confirmation() {
  const { control, watch } = useFormContext<BookingData>();
  const [copied, setCopied] = useState(false);
  const deposit = 150;
  const plinNumber = "+51999209880";

  // Pricing breakdown
  const { data: services = [] } = useServicesQuery();
  const selected = watch("selectedServices") || [];
  const transportEnabled = (watch("locationType") || "STUDIO") === "HOME";
  const district = watch("district") || "";
  const { transportCost, getTransportCost } = useTransportCost();

  useEffect(() => {
    if (transportEnabled && district) {
      getTransportCost(district);
    }
  }, [transportEnabled, district, getTransportCost]);

  const timeSlot = watch("timeSlot") || "";
  const nightShiftCost = timeSlot ? calculateNightShiftCost(timeSlot) : 0;

  const { subtotal, transport, nightShift, total } = useBookingSummary(
    selected,
    services,
    transportEnabled,
    transportCost?.cost,
    nightShiftCost
  );
  const remaining = Math.max(0, (total || 0) - 150);

  const handleCopyPlin = async () => {
    try {
      await navigator.clipboard.writeText(plinNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error al copiar:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="text-center">
        <Typography
          as="h3"
          variant="h3"
          className="font-bold text-[color:var(--color-heading)] mb-2"
        >
          Confirmación y Pago
        </Typography>
        <Typography
          as="p"
          variant="small"
          className="text-[color:var(--color-body)]"
        >
          Revisa tu solicitud
        </Typography>
      </div>

      {/* Desglose de Precios */}
      <div className="p-4 rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        <Typography
          as="h4"
          variant="h4"
          className="text-[color:var(--color-heading)] font-medium mb-3"
        >
          Resumen de costos
        </Typography>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Typography
              as="span"
              variant="small"
              className="text-[color:var(--color-body)]"
            >
              Servicios
            </Typography>
            <Typography
              as="span"
              variant="small"
              className="text-[color:var(--color-heading)] font-medium"
            >
              S/ {subtotal || 0}
            </Typography>
          </div>

          <div className="flex justify-between items-center">
            <Typography
              as="span"
              variant="small"
              className="text-[color:var(--color-body)]"
            >
              Transporte
            </Typography>
            <Typography
              as="span"
              variant="small"
              className="text-[color:var(--color-heading)] font-medium"
            >
              S/ {transport || 0}
            </Typography>
          </div>

          {nightShift > 0 && (
            <div className="flex justify-between items-center">
              <Typography
                as="span"
                variant="small"
                className="text-[color:var(--color-body)]"
              >
                Horario nocturno
              </Typography>
              <Typography
                as="span"
                variant="small"
                className="text-[color:var(--color-heading)] font-medium"
              >
                S/ {nightShift}
              </Typography>
            </div>
          )}

          <div className="border-t border-[color:var(--color-border)] pt-3 mt-3">
            <div className="flex justify-between items-center mb-2">
              <Typography
                as="span"
                variant="p"
                className="text-[color:var(--color-heading)] font-medium"
              >
                Total
              </Typography>
              <Typography
                as="span"
                variant="h3"
                className="font-bold text-[color:var(--color-primary)]"
              >
                S/ {total || 0}
              </Typography>
            </div>
            <div className="flex justify-between items-center">
              <Typography
                as="span"
                variant="small"
                className="text-[color:var(--color-body)]"
              >
                Depósito requerido
              </Typography>
              <Typography
                as="span"
                variant="p"
                className="font-bold text-[color:var(--color-primary)]"
              >
                S/ {deposit}
              </Typography>
            </div>
            <div className="flex justify-between items-center mt-2">
              <Typography
                as="span"
                variant="small"
                className="text-[color:var(--color-body)]"
              >
                Restante a pagar
              </Typography>
              <Typography
                as="span"
                variant="small"
                className="text-[color:var(--color-heading)] font-medium"
              >
                S/ {remaining}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Proceso de Pago */}
      <div className="p-4 rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-5 h-5 text-[color:var(--color-primary)]" />
          <Typography
            as="h4"
            variant="h4"
            className="text-[color:var(--color-heading)] font-medium"
          >
            Proceso de Pago
          </Typography>
        </div>

        <div className="space-y-3">
          {/* PLIN Number */}
          <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-[12px] p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Typography
                  as="span"
                  variant="small"
                  className="text-[color:var(--color-body)]"
                >
                  PLIN:
                </Typography>
                <code className="text-sm font-mono text-[color:var(--color-heading)]">
                  {plinNumber}
                </code>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyPlin}
                className="px-3 py-2 rounded-[12px]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Pasos */}
          <div>
            <ol className="space-y-2 text-sm text-[color:var(--color-body)] list-decimal list-inside">
              <li>Enviar la captura del adelanto al WhatsApp (989164990)</li>
              <li>Espera la confirmación de tu reserva</li>
              <li>El restante lo cancelas el día de la cita</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Campo de notas */}
      <Controller
        name="additionalNotes"
        control={control}
        render={({ field }) => (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[color:var(--color-primary)]" />
              <Typography
                as="label"
                variant="small"
                className="font-medium text-[color:var(--color-heading)]"
              >
                Notas (Opcional)
              </Typography>
            </div>
            <textarea
              {...field}
              placeholder="Cuéntame sobre tu evento..."
              rows={3}
              className="w-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-[12px] px-3 py-2.5 placeholder:text-[color:var(--color-body)]/50 text-[color:var(--color-text-primary)] outline-none focus:border-[color:var(--color-primary)] resize-none"
            />
          </div>
        )}
      />

      {/* Aceptación de términos */}
      <Controller
        name="agreedToTerms"
        control={control}
        render={({ field }) => (
          <label className="flex items-start gap-3 p-3 rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
            <input
              type="checkbox"
              checked={Boolean(field.value)}
              onChange={(e) => field.onChange(e.target.checked)}
              className="w-5 h-5 text-[color:var(--color-primary)] border-[color:var(--color-border)] rounded focus:ring-[color:var(--color-primary)] mt-0.5"
            />
            <div className="flex-1">
              <Typography
                as="span"
                variant="small"
                className="text-[color:var(--color-body)]"
              >
                Acepto los{" "}
                <a
                  href="/terminos-condiciones"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--color-primary)] underline hover:opacity-80"
                >
                  términos y condiciones
                </a>
              </Typography>
              {!field.value && (
                <Typography
                  as="span"
                  variant="caption"
                  className="!text-red-500 block mt-1"
                >
                  Requerido para enviar
                </Typography>
              )}
            </div>
          </label>
        )}
      />
    </div>
  );
}
