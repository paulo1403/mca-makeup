"use client"
import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import type { BookingData } from '@/lib/bookingSchema'

export default function Step5_Confirmation() {
  const { control, watch } = useFormContext<BookingData>()
  const values = watch()

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-card">
        <h4 className="font-serif text-xl text-accent-primary">Depósito requerido: S/ 150</h4>
        <p className="text-sm text-gray-600">Se te pedirá el depósito para confirmar la cita.</p>
        <div className="mt-3 space-y-1">
          <div><strong>Cliente:</strong> {values.name}</div>
          <div><strong>Email:</strong> {values.email}</div>
          <div><strong>Teléfono:</strong> {values.phone}</div>
        </div>
      </div>

      <Controller
        name="agreedToTerms"
        control={control}
        render={({ field }) => (
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={Boolean(field.value)} onChange={(e) => field.onChange(e.target.checked)} className="w-4 h-4" />
            <span>Acepto los términos y condiciones</span>
          </label>
        )}
      />
    </div>
  )
}
