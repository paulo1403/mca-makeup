"use client";

import { Check, Copy, CreditCard, FileText, Lock, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import CountryFields from "@/components/booking/CountryFields";
import InputField from "@/components/booking/InputField";
import { useBookingSummary } from "@/hooks/useBookingSummary";
import useServicesQuery from "@/hooks/useServicesQuery";
import { useTransportCost } from "@/hooks/useTransportCost";
import type { BookingData } from "@/lib/bookingSchema";
import { calculateNightShiftCost } from "@/utils/nightShift";

export default function Section4_PersonalSummary() {
  const { control } = useFormContext<BookingData>();
  const [copied, setCopied] = useState(false);
  const deposit = 150;
  const plinNumber = "+51999209880";

  const selected = useWatch({ name: "selectedServices" }) || [];
  const locationType = useWatch({ name: "locationType" }) || "STUDIO";
  const district = useWatch({ name: "district" }) || "";
  const timeSlot = useWatch({ name: "timeSlot" }) || "";
  const { transportCost, getTransportCost } = useTransportCost();

  const { data: services = [] } = useServicesQuery();
  const transportEnabled = locationType === "HOME";
  const nightShiftCost = timeSlot ? calculateNightShiftCost(timeSlot) : 0;

  useEffect(() => {
    if (transportEnabled && district) {
      getTransportCost(district);
    }
  }, [transportEnabled, district, getTransportCost]);

  const { subtotal, transport, nightShift, total } = useBookingSummary(
    selected,
    services,
    transportEnabled,
    transportCost?.cost,
    nightShiftCost,
  );
  const remaining = Math.max(0, (total || 0) - deposit);

  const handleCopyPlin = async () => {
    try {
      await navigator.clipboard.writeText(plinNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <InputField
              placeholder="Ej: Marcela Cordero"
              icon={<User className="w-5 h-5" />}
              field={field}
              label="Nombre completo"
              error={fieldState.error?.message ?? null}
              required
            />
          )}
        />

        <CountryFields />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <InputField
              type="email"
              placeholder="tu@email.com"
              icon={<Mail className="w-5 h-5" />}
              field={field}
              label="Correo electrónico"
              error={fieldState.error?.message ?? null}
              required
            />
          )}
        />
      </div>

      <div className="p-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/40">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-[color:var(--color-primary)]" />
          <span className="text-sm font-medium text-[color:var(--color-heading)]">
            Resumen y Pago
          </span>
        </div>

        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-[color:var(--color-body)]">Servicios</span>
            <span className="text-[color:var(--color-heading)] font-medium">
              S/ {subtotal || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[color:var(--color-body)]">Transporte</span>
            <span className="text-[color:var(--color-heading)] font-medium">
              S/ {transport || 0}
            </span>
          </div>
          {nightShift > 0 && (
            <div className="flex justify-between">
              <span className="text-[color:var(--color-body)]">Horario nocturno</span>
              <span className="text-[color:var(--color-heading)] font-medium">S/ {nightShift}</span>
            </div>
          )}

          <div className="border-t border-[color:var(--color-border)] pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-[color:var(--color-heading)] font-medium">Total</span>
              <span className="font-bold text-[color:var(--color-primary)]">S/ {total || 0}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[color:var(--color-body)]">Depósito</span>
              <span className="font-medium text-[color:var(--color-primary)]">S/ {deposit}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[color:var(--color-body)]">Restante</span>
              <span className="text-[color:var(--color-heading)] font-medium">S/ {remaining}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[color:var(--color-body)]">PLIN:</span>
            <code className="text-sm font-mono text-[color:var(--color-heading)]">
              {plinNumber}
            </code>
          </div>
          <button
            type="button"
            onClick={handleCopyPlin}
            className="px-3 py-1.5 rounded-lg text-xs text-[color:var(--color-body)] hover:bg-[color:var(--color-surface)] transition-colors"
          >
            {copied ? (
              <span className="text-green-500 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Copiado
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Copy className="w-3.5 h-3.5" /> Copiar
              </span>
            )}
          </button>
        </div>
        <ol className="space-y-1 text-xs text-[color:var(--color-body)] list-decimal list-inside">
          <li>Enviar captura del adelanto al WhatsApp indicado</li>
          <li>Esperar confirmación de tu reserva</li>
          <li>El restante se paga el día de la cita</li>
        </ol>
      </div>

      <Controller
        name="additionalNotes"
        control={control}
        render={({ field }) => (
          <div>
            <label className="text-sm font-medium text-[color:var(--color-heading)] flex items-center gap-1.5 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
              Notas (Opcional)
            </label>
            <textarea
              {...field}
              placeholder="Cuéntame sobre tu evento..."
              rows={2}
              className="w-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl px-3 py-2 text-sm placeholder:text-[color:var(--color-body)]/50 text-[color:var(--color-text-primary)] outline-none focus:border-[color:var(--color-primary)] resize-none"
            />
          </div>
        )}
      />

      <Controller
        name="agreedToTerms"
        control={control}
        render={({ field }) => (
          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/40 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(field.value)}
              onChange={(e) => field.onChange(e.target.checked)}
              className="w-4 h-4 text-[color:var(--color-primary)] border-[color:var(--color-border)] rounded focus:ring-[color:var(--color-primary)] mt-0.5"
            />
            <span className="text-sm text-[color:var(--color-body)]">
              Acepto los{" "}
              <a
                href="/terminos-condiciones"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--color-primary)] underline hover:opacity-80"
              >
                términos y condiciones
              </a>
            </span>
          </label>
        )}
      />

      <div className="flex items-center gap-2 justify-center pt-1">
        <Lock className="w-3.5 h-3.5 text-[color:var(--color-muted)]" />
        <span className="text-xs text-[color:var(--color-muted)]">Tu información está segura</span>
      </div>
    </div>
  );
}
