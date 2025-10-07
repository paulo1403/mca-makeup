"use client"
import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useGroupedServicesQuery } from '@/hooks/useServicesQuery'
import ServiceCategoryGroup from '../../booking/ServiceCategoryGroup'
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
  const validationError = validateSelection(selectedServicesMap || {}, allServices)

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
    if (validationError) {
      // Dismiss previous toast if exists
      if (currentToastId.current) {
        toast.dismiss(currentToastId.current)
      }
      
      // Show new toast
      currentToastId.current = toast.error(
        `${validationError}\n\n💡 Puedes seguir seleccionando servicios, pero esta combinación no podrá ser enviada.`,
        {
          duration: Infinity, // No auto-hide
          id: 'validation-error', // Unique ID to prevent duplicates
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
  }, [validationError])

  if (isLoading) return <div>Loading services...</div>

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-muted" />
        </div>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar servicios por nombre o descripción..."
          className="w-full bg-card border border-transparent focus:border-accent-primary/30 rounded-lg pl-12 pr-4 py-3 placeholder:text-muted text-heading outline-none shadow-sm transition-all duration-200 focus:shadow-md"
        />
      </div>

      {Object.entries(filteredGrouped).length === 0 ? (
        <div className="text-center text-muted">{`No se encontraron servicios para "${query}"`}</div>
      ) : (
        Object.entries(filteredGrouped).map(([category, services]) => (
          <ServiceCategoryGroup key={category} category={category} services={services} fieldName="selectedServices" />
        ))
      )}
    </div>
  )
}
