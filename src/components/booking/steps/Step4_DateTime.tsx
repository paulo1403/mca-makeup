"use client"
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { useAvailableRanges } from '@/hooks/useAvailableRanges'
import type { BookingData } from '@/lib/bookingSchema'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
// Usamos nuestro propio estilo premium del datepicker (sin CSS por defecto)

export default function Step4_DateTime() {
  const { control, watch, setValue } = useFormContext<BookingData>()
  const date = watch('date')
  const timeSlot = watch('timeSlot')
  const selectedServices = watch('selectedServices') || []
  const locationType = watch('locationType')

  const serviceSelection = selectedServices.reduce<Record<string, number>>((acc, cur) => {
    acc[cur.id] = cur.quantity
    return acc
  }, {})

  const { data: rangesData, isLoading } = useAvailableRanges(date || null, serviceSelection, (locationType as 'STUDIO' | 'HOME') || 'STUDIO')

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="space-y-2">
        <h2 className="font-serif text-xl sm:text-2xl text-accent-primary">Selecciona la fecha:</h2>
        <p className="text-sm text-muted">Elige un día en el calendario y luego el rango de hora disponible.</p>
      </div>

      {/* Layout responsive: calendario + horarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Calendario inline con header personalizado */}
        <div className="bg-step-card border border-input rounded-xl p-3 sm:p-4 shadow-sm">
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={(d) => field.onChange(d)}
                inline
                locale={es}
                calendarClassName="premium-datepicker"
                renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                  <div className="flex items-center justify-between mb-3">
                    <button
                      type="button"
                      onClick={decreaseMonth}
                      className="inline-flex items-center gap-2 px-2 py-1.5 rounded-lg border border-input bg-input text-main hover:bg-card transition-colors"
                      aria-label="Mes anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-medium text-calendar-label">
                      {format(date, 'MMMM yyyy', { locale: es })}
                    </span>
                    <button
                      type="button"
                      onClick={increaseMonth}
                      className="inline-flex items-center gap-2 px-2 py-1.5 rounded-lg border border-input bg-input text-main hover:bg-card transition-colors"
                      aria-label="Mes siguiente"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              />
            )}
          />
        </div>

        {/* Horarios disponibles */}
        <div className="bg-step-card border border-input rounded-xl p-3 sm:p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-lg text-accent-primary">Selecciona el rango de hora:</h3>
            {date && (
              <div className="text-sm text-muted">{format(date, 'dd/MM/yyyy')}</div>
            )}
          </div>

          {/* Feedback de disponibilidad tras seleccionar fecha */}
          {date && !isLoading && (
            <div role="status" className="mb-3">
              {rangesData?.availableRanges?.length ? (
                <p className="text-sm text-success">Hay horarios disponibles para la fecha seleccionada.</p>
              ) : (
                <p className="text-sm text-danger">El día seleccionado está completo. Por favor, elige otra fecha.</p>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="space-y-2">
              <div className="h-10 bg-input rounded-md animate-pulse" />
              <div className="h-10 bg-input rounded-md animate-pulse" />
              <div className="h-10 bg-input rounded-md animate-pulse" />
            </div>
          ) : (rangesData?.availableRanges?.length ? (
            <div role="listbox" aria-label="Selecciona un horario" className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {rangesData.availableRanges.map((r: string) => {
                const isSelected = timeSlot === r
                return (
                  <button
                    type="button"
                    key={r}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => setValue('timeSlot', r, { shouldDirty: true, shouldValidate: true })}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 shadow-sm w-full
                      ${isSelected 
                        ? 'border-2 border-accent-secondary bg-input text-accent-primary ring-0' 
                        : 'border border-input bg-input text-main hover:border-accent-secondary/40'}
                    `}
                  >
                    <Clock className="w-4 h-4 text-accent-secondary" />
                    <span className="text-sm font-medium">{r}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-sm text-muted">No hay horarios disponibles para esta fecha. Elige otra del calendario.</div>
          ))}

          {/* Resumen de selección */}
          {date && timeSlot && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent-primary/5 border border-transparent">
              <span className="text-sm text-heading">Seleccionaste</span>
              <span className="text-sm font-medium text-heading">{format(date, 'dd MMM', { locale: es })}</span>
              <span className="text-sm font-semibold text-accent-secondary">{timeSlot}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
