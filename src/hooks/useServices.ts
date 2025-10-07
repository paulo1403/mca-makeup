// ...single import at top

export type ServiceData = {
  id: string
  name: string
  description?: string
  price: number
  duration: number
  category: 'BRIDAL' | 'SOCIAL' | 'MATURE_SKIN' | 'HAIRSTYLE' | 'OTHER'
}

async function fetchServices(): Promise<ServiceData[]> {
  const res = await fetch('/api/services')
  if (!res.ok) throw new Error('Error fetching services')
  const data = await res.json()
  if (Array.isArray(data)) return data as ServiceData[]
  if (Array.isArray(data.services)) return data.services as ServiceData[]
  if (data.servicesByCategory && typeof data.servicesByCategory === 'object') {
    const all: ServiceData[] = []
    Object.values(data.servicesByCategory).forEach((arr: unknown) => {
      if (Array.isArray(arr)) all.push(...(arr as ServiceData[]))
    })
    return all
  }
  return []
}

export function useServices(options?: UseQueryOptions<ServiceData[], Error>) {
  return useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    ...(options ?? {}),
  } as UseQueryOptions<ServiceData[], Error>)
}

export function useGroupedServices() {
  const { data: services = [], isLoading, error } = useServices()
  const grouped = (services || []).slice().sort((a, b) => {
    if (a.category === b.category) return a.price - b.price
    return a.category.localeCompare(b.category)
  }).reduce<Record<string, ServiceData[]>>((acc, svc) => {
    if (!acc[svc.category]) acc[svc.category] = []
    acc[svc.category].push(svc)
    return acc
  }, {})
  return { data: grouped, isLoading, error }
}

export default useServices

// Flat list hook for consumers that need raw service items
export function useServicesList() {
  return useQuery({
    queryKey: ['services', 'list'],
    queryFn: async () => {
      const res = await fetch('/api/services')
      if (!res.ok) throw new Error('Error fetching services')
      const data = await res.json()
      if (Array.isArray(data)) return data
      if (Array.isArray(data.services)) return data.services
      if (data.servicesByCategory && typeof data.servicesByCategory === 'object') {
        const all: ServiceData[] = []
        Object.values(data.servicesByCategory).forEach((arr: unknown) => {
          if (Array.isArray(arr)) all.push(...(arr as ServiceData[]))
        })
        return all
      }
      return []
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}
