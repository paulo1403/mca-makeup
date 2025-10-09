"use client"
import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useGroupedServicesQuery } from '@/hooks/useServicesQuery'
import ServiceCategoryGroup from '../../booking/ServiceCategoryGroup'
import ValidationToast from '../ValidationToast'
import type { BookingData } from '@/lib/bookingSchema'
import { validateSelection } from '@/lib/serviceRules'
import toast from 'react-hot-toast'
import { Search } from 'lucide-react'

export default function Step2_ServiceSelection() {
  const { watch } = useFormContext<BookingData>()
  const { data: grouped = {}, isLoading } = useGroupedServicesQuery()
  const currentToastId = useRef<string | null>(null)
  const [query, setQuery] = useState('')
  
  const selectedArr = (watch('selectedServices') || []) as Array<{ id: string; quantity: number }>
  const selectedServicesMap = selectedArr.reduce<Record<string, number>>((acc, item) => {
    acc[item.id] = item.quantity
    return acc
  }, {})
  
  // grouped is a map category -> Service[]; collect all services into an array for validation
  const allServices = Object.values(grouped).flat()

  // Filter services by search query (name or description)
  const normalized = (s: string) => s.trim().toLowerCase()
  const filteredGrouped = useMemo(() => {
    if (!query.trim()) return grouped
    const q = normalized(query)
    const out: Record<string, typeof grouped[string]> = {}
    Object.entries(grouped).forEach(([cat, services]) => {
      const matched = services.filter(s => {
        const name = normalized(s.name)
        const desc = normalized(s.description ?? '')
        return name.includes(q) || desc.includes(q)
      })
      if (matched.length > 0) out[cat] = matched
    })
    return out
  }, [grouped, query])

  // Mostrar toast cuando hay error de validación
  useEffect(() => {
    const validationResult = validateSelection(selectedServicesMap || {}, allServices)
    
    if (validationResult) {
      // Dismiss previous toast if exists
      if (currentToastId.current) {
        toast.dismiss(currentToastId.current)
      }
      
      // Show new custom toast
      currentToastId.current = toast.custom(
        (t) => (
          <ValidationToast
            message={validationResult.message}
            suggestion={validationResult.suggestion}
            onDismiss={() => toast.dismiss(t.id)}
          />
        ),
        {
          duration: Infinity, // No auto-hide
          id: 'validation-error', // Unique ID to prevent duplicates
          position: 'top-right',
        }
      )
    } else {
      // Hide toast when validation passes
      if (currentToastId.current) {
        toast.dismiss(currentToastId.current)
        currentToastId.current = null
      }
      toast.dismiss('validation-error') // Dismiss by ID as fallback
    }
  }, [selectedServicesMap, allServices])

  if (isLoading) return <div>Loading services...</div>

  return (
    <div className="space-y-8">
      {/* Encabezado de sección */}
      <div className="space-y-2">
        <h2 className="font-serif text-xl sm:text-2xl text-accent-primary">Selecciona el servicio:</h2>
        <p className="text-sm text-muted">Elige uno o más servicios y ajusta cantidades si es necesario.</p>
      </div>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-search-icon" />
        </div>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar servicios por nombre o descripción..."
          className="w-full bg-search border border-search focus:border-search-focus rounded-2xl pl-12 pr-4 py-4 placeholder:text-input-placeholder text-input outline-none shadow-search transition-all duration-200 focus:shadow-search-focus text-base"
        />
      </div>

      {/* Results */}
      {Object.entries(filteredGrouped).length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-muted text-lg font-medium">
            No se encontraron servicios para &quot;{query}&quot;
          </p>
          <p className="text-muted/70 text-sm mt-1">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(filteredGrouped).map(([category, services]) => (
            <ServiceCategoryGroup 
              key={category} 
              category={category} 
              services={services} 
              fieldName="selectedServices" 
            />
          ))}
        </div>
      )}
    </div>
  )
}
