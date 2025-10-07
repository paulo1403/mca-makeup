import { useMemo } from 'react'
import type { Service } from './useServicesQuery'

type SelectedService = { id: string; quantity: number }

export function useBookingSummary(selectedServices: SelectedService[] | undefined, services: Service[] | undefined, transportEnabled?: boolean) {
  return useMemo(() => {
    const items = (selectedServices || []).map(s => {
      const svc = (services || []).find(x => x.id === s.id)
      return { ...svc, quantity: s.quantity }
    }).filter(Boolean) as Array<Service & { quantity: number }>

    const subtotal = items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0)
    const duration = items.reduce((sum, it) => sum + (it.duration || 0) * (it.quantity || 1), 0)
    const transport = transportEnabled ? Math.round(subtotal * 0.08) : 0

    return { items, subtotal, duration, transport, total: subtotal + transport }
  }, [selectedServices, services, transportEnabled])
}

export default useBookingSummary
