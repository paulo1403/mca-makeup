'use client'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import useServicesQuery from '../../hooks/useServicesQuery'
import { useBookingSummary } from '../../hooks/useBookingSummary'

export default function BookingSummary() {
  const { watch } = useFormContext()
  const { data: services = [] } = useServicesQuery()
  const selected = watch('selectedServices') || []
  const transportEnabled = (watch('locationType') || 'STUDIO') === 'HOME'
  const { subtotal, duration, transport, total } = useBookingSummary(selected, services, transportEnabled)

  return (
    <div className="bg-card p-4 rounded-md space-y-2">
      <div className="flex justify-between"><span>Servicios</span><span>S/ {subtotal}</span></div>
      <div className="flex justify-between"><span>Duración</span><span>{duration} min</span></div>
      <div className="flex justify-between"><span>Transporte</span><span>S/ {transport}</span></div>
      <div className="flex justify-between font-serif text-lg text-accent-primary"><span>Total</span><span>S/ {total}</span></div>
    </div>
  )
}
