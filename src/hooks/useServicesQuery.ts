import { useQuery } from '@tanstack/react-query'

export type Service = {
  id: string
  name: string
  description?: string
  price: number
  duration: number
  category: 'BRIDAL' | 'SOCIAL' | 'MATURE_SKIN' | 'HAIRSTYLE' | 'OTHER'
}

async function fetchServices() {
  const res = await fetch('/api/services')
  if (!res.ok) throw new Error('Error fetching services')
  const data = await res.json()
  if (Array.isArray(data)) return data as Service[]
  if (Array.isArray(data.services)) return data.services as Service[]
  if (data.servicesByCategory && typeof data.servicesByCategory === 'object') {
    const all: Service[] = []
    Object.values(data.servicesByCategory).forEach((arr: unknown) => {
      if (Array.isArray(arr)) all.push(...(arr as Service[]))
    })
    return all
  }
  return []
}

export function useServicesQuery() {
  return useQuery({ queryKey: ['services'], queryFn: fetchServices, staleTime: 1000 * 60 * 5 })
}

export function useGroupedServicesQuery() {
  const { data: services = [], isLoading, error } = useServicesQuery()
  const grouped = (services || []).slice().sort((a, b) => {
    if (a.category === b.category) return a.price - b.price
    return a.category.localeCompare(b.category)
  }).reduce<Record<string, Service[]>>((acc, svc) => {
    if (!acc[svc.category]) acc[svc.category] = []
    acc[svc.category].push(svc)
    return acc
  }, {})
  return { data: grouped, isLoading, error }
}

export default useServicesQuery
