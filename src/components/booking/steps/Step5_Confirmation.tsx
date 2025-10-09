"use client"
import React, { useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import type { BookingData } from '@/lib/bookingSchema'
import { ShieldCheck, CreditCard, Copy } from 'lucide-react'
import useServicesQuery from '@/hooks/useServicesQuery'
import { useBookingSummary } from '@/hooks/useBookingSummary'

export default function Step5_Confirmation() {
  const { control, watch } = useFormContext<BookingData>()
  const [copied, setCopied] = useState(false)
  const deposit = 150
  const plinNumber = '+51999209880'

  // Pricing breakdown (servicios, transporte, total)
  const { data: services = [] } = useServicesQuery()
  const selected = watch('selectedServices') || []
  const transportEnabled = (watch('locationType') || 'STUDIO') === 'HOME'
  const { subtotal, transport, total } = useBookingSummary(selected, services, transportEnabled)

  return (
    <div className="space-y-8">
      {/* Header simplificado */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-6 h-6 text-white drop-shadow-sm" />
          </div>
        </div>
        <h3 className="text-xl font-serif text-heading">Paso 5: Confirmación y Pago</h3>
        <p className="text-sm text-muted max-w-md mx-auto">Revisa tu pedido y sigue la guía de pago.</p>
      </div>

      {/* Desglose de Precios (bloque destacado) */}
      <div className="rounded-xl border-2 border-border bg-card p-6 shadow-sm">
        <h4 className="font-serif text-lg text-heading mb-3">Resumen de costos</h4>
        <div className="space-y-2">
          <div className="grid grid-cols-2 text-sm">
            <span className="text-main">Servicios</span>
            <span className="text-main text-right">S/ {subtotal || 0}</span>
          </div>
          <div className="grid grid-cols-2 text-sm">
            <span className="text-main">Transporte</span>
            <span className="text-main text-right">S/ {transport || 0}</span>
          </div>
        </div>
        <div className="mt-3 border-t border-input" />
        <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted">Costo Total</span>
            <span className="text-3xl sm:text-4xl font-bold text-accent-primary">S/ {total || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted">Depósito requerido</span>
            <span className="text-2xl sm:text-3xl font-bold text-accent-secondary">S/ {deposit}</span>
          </div>
        </div>
      </div>

      {/* Tarjeta de Instrucciones de Pago (separada del desglose) */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-3">
          <CreditCard className="w-5 h-5 text-accent-primary" />
          <h4 className="font-serif text-lg text-accent-primary">Proceso de Confirmación</h4>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-neutral">PLIN:</span>
          <code className="text-sm font-mono bg-surface border border-border rounded px-3 py-2">{plinNumber}</code>
          <button
            type="button"
            onClick={async () => { try { await navigator.clipboard.writeText(plinNumber); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { } }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-[color:var(--color-accent-secondary)]/40 bg-card text-accent-secondary hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent-secondary)]"
            aria-label="Copiar número PLIN"
          >
            <Copy className="w-4 h-4 text-accent-secondary" /> Copiar PLIN
          </button>
          {copied && <span className="text-xs text-accent-secondary">Copiado</span>}
        </div>
        <ol className="mt-4 space-y-2 text-sm text-main list-decimal list-inside">
          <li>Envía tu solicitud completando este formulario.</li>
          <li>Te contactaré para confirmar disponibilidad y coordinar el depósito de S/ 150.</li>
          <li>Realiza el depósito vía PLIN usando el número indicado.</li>
          <li>El saldo restante se paga el día de la cita.</li>
        </ol>
      </div>

      {/* Campo de notas (opcional) */}
      <Controller
        name="additionalNotes"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-accent-primary mb-2">Mensaje Adicional (Opcional)</label>
            <textarea
              {...field}
              placeholder="Cuéntame sobre tu evento o preferencias especiales..."
              rows={5}
              className="w-full bg-input border border-input rounded-lg px-3 py-2 placeholder:text-input-placeholder text-main outline-none shadow-sm transition-all duration-200 focus:shadow-md focus:border-input-focus"
            />
          </div>
        )}
      />

      {/* Aceptación de términos */}
      <Controller
        name="agreedToTerms"
        control={control}
        render={({ field }) => (
          <label className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(field.value)}
              onChange={(e) => field.onChange(e.target.checked)}
              className="w-5 h-5 accent-[var(--color-accent-primary)]"
            />
            <span className="text-sm text-neutral">
              Acepto los <a href="/terminos-condiciones" target="_blank" rel="noopener noreferrer" className="text-accent-primary underline hover:opacity-80">términos y condiciones</a>
            </span>
            {!field.value && (
              <span className="ml-auto text-xs text-muted">Requerido para enviar</span>
            )}
          </label>
        )}
      />
    </div>
  )
}
