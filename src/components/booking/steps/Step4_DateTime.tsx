"use client"
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { useAvailableRanges } from '@/hooks/useAvailableRanges'
import type { BookingData } from '@/lib/bookingSchema'
import 'react-datepicker/dist/react-datepicker.css'

export default function Step4_DateTime() {
  const { control, watch, setValue } = useFormContext<BookingData>()
  const date = watch('date')
  const selectedServices = watch('selectedServices') || []
  const locationType = watch('locationType')

  const serviceSelection = selectedServices.reduce<Record<string, number>>((acc, cur) => {
    acc[cur.id] = cur.quantity
    return acc
  }, {})

  const { data: rangesData, isLoading } = useAvailableRanges(date || null, serviceSelection, locationType || 'STUDIO')

  return (
    <div className="space-y-4">
      <Controller
        control={control}
        name="date"
        render={({ field }) => (
          <DatePicker selected={field.value} onChange={(d) => field.onChange(d)} dateFormat="dd/MM/yyyy" className="w-full px-4 py-3 bg-card border border-gray-200 rounded-lg" />
        )}
      />

      <div className="grid grid-cols-2 gap-2">
        {isLoading ? (
          <div>Buscando horarios...</div>
        ) : (
          (rangesData?.availableRanges || []).map((r: string) => (
            <button type="button" key={r} onClick={() => setValue('timeSlot', r)} className="p-3 rounded-md bg-card border border-gray-200 text-left">
              {r}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
