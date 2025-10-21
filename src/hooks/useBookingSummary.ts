import { useMemo } from 'react'
import type { Service } from './useServicesQuery'

type SelectedService = { id: string; quantity: number }

export function useBookingSummary(
  selectedServices: SelectedService[] | undefined,
  services: Service[] | undefined,
  transportEnabled?: boolean,
  transportOverride?: number,
  nightShiftOverride?: number,
) {
  return useMemo(() => {
    const items = (selectedServices || []).map(s => {
      const svc = (services || []).find(x => x.id === s.id)
      return { ...svc, quantity: s.quantity }
    }).filter(Boolean) as Array<Service & { quantity: number }>

    const subtotal = items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0)
    const duration = items.reduce((sum, it) => sum + (it.duration || 0) * (it.quantity || 1), 0)
    const transport = transportEnabled ? (typeof transportOverride === 'number' ? transportOverride : Math.round(subtotal * 0.08)) : 0
    const nightShift = typeof nightShiftOverride === 'number' ? nightShiftOverride : 0

    return { items, subtotal, duration, transport, nightShift, total: subtotal + transport + nightShift }
  }, [selectedServices, services, transportEnabled, transportOverride, nightShiftOverride])
}

export default useBookingSummary
