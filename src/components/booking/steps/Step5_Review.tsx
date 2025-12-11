"use client";

import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { useBookingSummary } from "@/hooks/useBookingSummary";
import useServicesQuery from "@/hooks/useServicesQuery";
import { useTransportCost } from "@/hooks/useTransportCost";
import type { BookingData } from "@/lib/bookingSchema";
import { calculateNightShiftCost } from "@/utils/nightShift";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, CreditCard, FileText, ShieldCheck, Sparkles, MapPin, Calendar as CalendarIcon, Phone, Mail, Clock } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { format } from "date-fns";

export default function Step5_Review() {
  const { control, watch } = useFormContext<BookingData>();
  const [copied, setCopied] = useState(false);
  const deposit = 150;
  const plinNumber = "+51999209880";

  const { data: services = [] } = useServicesQuery();
  const selected = watch("selectedServices") || [];
  const transportEnabled = (watch("locationType") || "STUDIO") === "HOME";
  const district = watch("district") || "";
  const { transportCost, getTransportCost } = useTransportCost();

  useEffect(() => {
    if (transportEnabled && district) getTransportCost(district);
  }, [transportEnabled, district, getTransportCost]);

  const timeSlot = watch("timeSlot") || "";
  const nightShiftCost = timeSlot ? calculateNightShiftCost(timeSlot) : 0;

  const { subtotal, transport, nightShift, total, duration } = useBookingSummary(
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
    <div className="w-full space-y-5 px-2">
      {/* Encabezado */}
      <motion.div className="text-center space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-accent)] rounded-full flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        </div>
        <Typography as="h2" variant="h2" className="text-[color:var(--color-heading)] font-serif !text-base sm:!text-lg">Confirmación</Typography>
        <Typography as="p" variant="p" className="text-[color:var(--color-body)] text-xs sm:text-sm leading-tight">Revisa tu solicitud y sigue la guía de pago.</Typography>
      </motion.div>

      {/* Resumen principal */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.5 }} className="p-3 sm:p-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <div className="grid grid-cols-2 gap-3 text-xs mb-3">
          <div className="flex items-center gap-2 text-[color:var(--color-muted)]"><CalendarIcon className="w-3 h-3" /><span>Fecha</span></div>
          <div className="text-[color:var(--color-heading)]">{watch("date") ? format(watch("date") as Date, "dd/MM/yyyy") : "—"}</div>
          <div className="flex items-center gap-2 text-[color:var(--color-muted)]"><Clock className="w-3 h-3" /><span>Horario</span></div>
          <div className="text-[color:var(--color-heading)]">{timeSlot || "—"}</div>
          <div className="flex items-center gap-2 text-[color:var(--color-muted)]"><MapPin className="w-3 h-3" /><span>Ubicación</span></div>
          <div className="text-[color:var(--color-heading)]">{transportEnabled ? `A domicilio${district ? ` - ${district}` : ""}` : "En estudio"}</div>
          <div className="flex items-center gap-2 text-[color:var(--color-muted)]"><Sparkles className="w-3 h-3" /><span>Duración</span></div>
          <div className="text-[color:var(--color-heading)]">{duration} min</div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs mb-3">
          <div className="flex items-center gap-2 text-[color:var(--color-muted)]"><Phone className="w-3 h-3" /><span>Teléfono</span></div>
          <div className="text-[color:var(--color-heading)] truncate">{watch("phone") || "—"}</div>
          <div className="flex items-center gap-2 text-[color:var(--color-muted)]"><Mail className="w-3 h-3" /><span>Email</span></div>
          <div className="text-[color:var(--color-heading)] truncate">{watch("email") || "—"}</div>
        </div>

        <div className="border-t border-[color:var(--color-border)]/20 pt-3 mt-2">
          <div className="flex justify-between items-center text-xs mb-1.5"><span className="text-[color:var(--color-body)]">Servicios</span><span className="text-[color:var(--color-heading)] font-medium">S/ {subtotal || 0}</span></div>
          <div className="flex justify-between items-center text-xs mb-1.5"><span className="text-[color:var(--color-body)]">Transporte</span><span className="text-[color:var(--color-heading)] font-medium">S/ {transport || 0}</span></div>
          {nightShift > 0 && (<div className="flex justify-between items-center text-xs mb-1.5"><span className="text-[color:var(--color-body)]">Horario nocturno</span><span className="text-[color:var(--color-heading)] font-medium">S/ {nightShift}</span></div>)}
          <div className="flex justify-between items-center text-sm mt-2"><span className="font-semibold text-[color:var(--color-heading)]">Total</span><span className="font-bold text-[color:var(--color-primary)]">S/ {total || 0}</span></div>
          <div className="flex justify-between items-center text-xs mt-1"><span className="text-[color:var(--color-body)]">Depósito</span><span className="text-[color:var(--color-heading)] font-medium">S/ {deposit}</span></div>
          <div className="flex justify-between items-center text-xs"><span className="text-[color:var(--color-body)]">Restante</span><span className="text-[color:var(--color-heading)] font-medium">S/ {remaining}</span></div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pago */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.5 }} className="p-3 sm:p-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-[color:var(--color-primary)]/20 flex items-center justify-center"><CreditCard className="w-3 h-3 text-[color:var(--color-primary)]" /></div>
            <Typography as="h4" variant="h4" className="text-[color:var(--color-heading)] font-medium text-sm">Proceso de pago</Typography>
          </div>
          <div className="space-y-3">
            <div className="bg-[color:var(--color-surface-secondary)] border border-[color:var(--color-border)] rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Typography as="span" variant="small" className="text-[color:var(--color-body)] text-xs">PLIN:</Typography><code className="text-sm font-mono text-[color:var(--color-heading)]">{plinNumber}</code></div>
                <Button variant="ghost" size="sm" onClick={handleCopyPlin} className="px-3 py-2 text-xs rounded-lg min-w-[80px]">{copied ? (<><Check className="w-3 h-3 text-green-500" /><span className="text-green-500">Copiado</span></>) : (<><Copy className="w-3 h-3" /><span>Copiar</span></>)}</Button>
              </div>
            </div>
            <ol className="space-y-2 text-xs text-[color:var(--color-body)] list-decimal list-inside">
              <li>Envía la captura del adelanto al WhatsApp (989164990)</li>
              <li>Espera la confirmación de tu reserva</li>
              <li>El restante se cancela el día de la cita</li>
            </ol>
          </div>
        </motion.div>

        {/* Notas y términos */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="space-y-4">
          <div className="p-3 sm:p-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
            <div className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4 text-[color:var(--color-primary)]" /><Typography as="label" variant="small" className="font-medium text-[color:var(--color-heading)] text-sm">Notas (Opcional)</Typography></div>
            <Controller name="additionalNotes" control={control} render={({ field }) => (
              <textarea {...field} rows={3} placeholder="Cuéntame sobre tu evento..." className="w-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg px-3 py-2.5 placeholder:text-[color:var(--color-body)]/50 text-[color:var(--color-text-primary)] outline-none transition-all duration-200 focus:border-[color:var(--color-primary)] text-sm resize-none" />
            )} />
          </div>

          <Controller name="agreedToTerms" control={control} render={({ field }) => (
            <label className="flex items-start gap-3 p-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
              <div className="flex-shrink-0 mt-0.5"><input type="checkbox" checked={Boolean(field.value)} onChange={(e) => field.onChange(e.target.checked)} className="w-5 h-5 border border-[color:var(--color-border)] rounded bg-[color:var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]" style={{ accentColor: 'var(--color-primary)' }} /></div>
              <div className="flex-1 min-w-0">
                <Typography as="span" variant="small" className="text-[color:var(--color-body)] text-xs">Acepto los términos <a href="/terminos-condiciones" target="_blank" rel="noopener noreferrer" className="text-[color:var(--color-primary)] underline hover:opacity-80">términos</a></Typography>
                <AnimatePresence>
                  {!field.value && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="mt-1">
                      <Typography as="span" variant="caption" className="!text-red-500 text-xs">Requerido</Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </label>
          )} />
        </motion.div>
      </div>

      {/* Información importante */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="p-3 bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)]">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[color:var(--color-primary)]/20 flex items-center justify-center mt-0.5"><Sparkles className="w-2.5 h-2.5 text-[color:var(--color-primary)]" /></div>
          <div className="flex-1">
            <Typography as="h4" variant="h4" className="text-[color:var(--color-heading)] mb-1 text-xs font-medium">Importante</Typography>
            <Typography as="p" variant="p" className="text-[color:var(--color-body)] text-xs leading-relaxed">El depósito confirma tu reserva.</Typography>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
