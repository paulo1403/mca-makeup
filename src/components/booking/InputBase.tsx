"use client"
import React from 'react'
import { useController, Control } from 'react-hook-form'
import type { BookingData } from '@/lib/bookingSchema'

type TextFieldName = 'name' | 'phone' | 'email' | 'district' | 'address' | 'addressReference' | 'message' | 'additionalNotes'

interface Props {
  name: TextFieldName
  label: string
  control: Control<BookingData>
  type?: string
}

export default function InputBase({ name, label, control, type = 'text' }: Props) {
  const { field, fieldState } = useController<BookingData>({ name, control })
  return (
    <div>
      <label className="block text-sm font-medium text-heading mb-2">{label}</label>
      <input
        value={typeof field.value === 'string' ? field.value : String(field.value ?? '')}
        onChange={(e) => field.onChange(e.target.value)}
        onBlur={field.onBlur}
        name={field.name}
        ref={field.ref}
        type={type}
        className={`w-full px-4 py-3 bg-card border border-gray-200 rounded-lg text-heading placeholder-gray-400 focus:outline-none focus:ring-2 ring-accent-primary transition-all ${fieldState.error ? 'border-red-400' : ''}`}
      />
      {fieldState.error && (
        <p className="mt-2 text-sm text-red-600">{fieldState.error.message}</p>
      )}
    </div>
  )
}
