"use client"
import React from 'react'
import { ShieldCheck, PartyPopper, Sparkles } from 'lucide-react'

type SuccessModalProps = {
  open: boolean
  onClose: () => void
  clientName?: string
  pricing?: {
    servicePrice?: number
    transportCost?: number
    nightShiftCost?: number
    totalPrice?: number
  }
}

export default function SuccessModal({ open, onClose, clientName, pricing }: SuccessModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-[92%] max-w-md p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white drop-shadow-sm" />
          </div>
          <h3 className="font-serif text-lg text-heading">¡Reserva enviada!</h3>
        </div>

        <div className="space-y-3 text-sm text-neutral">
          <p>
            {clientName ? <strong className="text-heading">{clientName}</strong> : 'Tu solicitud'} fue enviada correctamente.
            Te contactaré dentro de 24 horas para confirmar y coordinar el depósito.
          </p>
          <div className="flex items-center gap-2 text-accent-primary">
            <PartyPopper className="w-4 h-4" />
            <span>¡Gracias por confiar en mi trabajo!</span>
          </div>

          {pricing && typeof pricing.totalPrice === 'number' && (
            <div className="mt-2 p-3 rounded-xl bg-accent-primary/5 border border-accent-primary">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-accent-primary" />
                <span className="text-heading font-medium">Resumen rápido</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span className="text-muted">Servicios</span>
                <span className="text-neutral text-right">S/ {Number(pricing.servicePrice || 0).toFixed(2)}</span>
                {pricing.transportCost ? (
                  <>
                    <span className="text-muted">Transporte</span>
                    <span className="text-neutral text-right">S/ {Number(pricing.transportCost || 0).toFixed(2)}</span>
                  </>
                ) : null}
                {pricing.nightShiftCost ? (
                  <>
                    <span className="text-muted">Nocturno</span>
                    <span className="text-neutral text-right">S/ {Number(pricing.nightShiftCost || 0).toFixed(2)}</span>
                  </>
                ) : null}
                <span className="text-heading font-semibold">Total</span>
                <span className="text-accent-primary font-semibold text-right">S/ {Number(pricing.totalPrice || 0).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border border-border hover:bg-muted/10">
            Cerrar
          </button>
          <a href="/terminos-condiciones" target="_blank" rel="noreferrer" className="px-4 py-2 rounded bg-accent-primary text-white hover:opacity-90">
            Ver términos
          </a>
        </div>
      </div>
    </div>
  )
}