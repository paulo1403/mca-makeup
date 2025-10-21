'use client'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import useServicesQuery from '../../hooks/useServicesQuery'
import { useBookingSummary } from '../../hooks/useBookingSummary'
import { format } from 'date-fns'
import type { BookingData } from '@/lib/bookingSchema'
import type { Service } from '@/types'

export default function BookingSummary() {
  const { watch } = useFormContext<BookingData>()
  const { data: services = [] } = useServicesQuery()
  const selected = watch('selectedServices') || []
  const transportEnabled = (watch('locationType') || 'STUDIO') === 'HOME'
  const { subtotal, duration, transport, total } = useBookingSummary(selected, services, transportEnabled)

  const date: Date | undefined = watch('date')
  const timeSlot: string = watch('timeSlot') || ''
  const locationType: 'HOME' | 'STUDIO' = watch('locationType') || 'STUDIO'
  const district: string = watch('district') || ''
  const address: string = watch('address') || ''
  const name: string = watch('name') || ''
  const email: string = watch('email') || ''
  const phone: string = watch('phone') || ''
  const deposit = 150

  const selectedIds = (selected || []).map((it) => it.id)
  const selectedServiceDetails = (services || [])
    .filter((s: Service) => selectedIds.includes(s.id))
    .map((s: Service) => ({
      ...s,
      quantity: (selected || []).find((it) => it.id === s.id)?.quantity || 1,
    }))

  return (
    <div className="bg-card p-6 rounded-lg border border-border space-y-8">
      {/* Cliente */}
      <div className="space-y-3">
        <h5 className="font-serif text-heading">Cliente</h5>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-muted">Nombre</div><div className="text-neutral">{name || '—'}</div>
          <div className="text-muted">Email</div><div className="text-neutral break-words">{email || '—'}</div>
          <div className="text-muted">Teléfono</div><div className="text-neutral">{phone || '—'}</div>
        </div>
      </div>

      {/* Servicios seleccionados */}
      <div className="space-y-3">
        <h5 className="font-serif text-heading">Servicios seleccionados</h5>
        {selectedServiceDetails.length > 0 ? (
          <ul className="space-y-2">
            {selectedServiceDetails.map((s: Service & { quantity: number }) => (
              <li key={s.id} className="grid grid-cols-2 text-sm">
                <span className="text-neutral">{s.name}{s.quantity > 1 ? ` ×${s.quantity}` : ''}</span>
                <span className="text-neutral text-right">S/ {s.price} · {s.duration} min</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No hay servicios seleccionados.</p>
        )}
      </div>

      {/* Detalles de la cita */}
      <div className="space-y-3">
        <h5 className="font-serif text-heading">Detalles de la cita</h5>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-muted">Fecha</div><div className="text-neutral">{date ? format(date, 'dd/MM/yyyy') : '—'}</div>
          <div className="text-muted">Horario</div><div className="text-neutral">{timeSlot || '—'}</div>
          <div className="text-muted">Duración</div><div className="text-neutral">{duration} min</div>
        </div>
      </div>

      {/* Ubicación */}
      <div className="space-y-3">
        <h5 className="font-serif text-heading">Ubicación</h5>
        {locationType === 'HOME' ? (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-muted">Tipo</div><div className="text-neutral">A domicilio</div>
            <div className="text-muted">Distrito</div><div className="text-neutral">{district || '—'}</div>
            <div className="text-muted">Dirección</div><div className="text-neutral">{address || '—'}</div>
            <div className="text-muted">Transporte</div><div className="text-neutral">S/ {transport}</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-muted">Tipo</div><div className="text-neutral">En estudio</div>
            <div className="text-muted">Transporte</div><div className="text-neutral">S/ 0</div>
          </div>
        )}
      </div>

      {/* Totales y depósito */}
      <div className="space-y-2 pt-4 border-t border-border">
        <div className="grid grid-cols-2 text-sm">
          <span className="text-muted">Servicios</span>
          <span className="text-neutral text-right">S/ {subtotal}</span>
        </div>
        <div className="grid grid-cols-2 text-sm">
          <span className="text-muted">Transporte</span>
          <span className="text-neutral text-right">S/ {transport}</span>
        </div>
        <div className="grid grid-cols-2 font-serif text-lg mt-2">
          <span className="text-heading">Total</span>
          <span className="text-accent-primary text-right">S/ {total}</span>
        </div>
        <div className="grid grid-cols-2 text-sm">
          <span className="text-muted">Depósito requerido</span>
          <span className="text-neutral text-right">S/ {deposit}</span>
        </div>
      </div>
    </div>
  )
}
