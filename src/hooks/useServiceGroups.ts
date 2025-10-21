import { useQuery } from '@tanstack/react-query'

export type ServiceGroup = {
  title: string
  price: string
  features: string[]
  portfolioUrl: string
}

async function fetchServiceGroups(): Promise<ServiceGroup[]> {
  try {
    const res = await fetch('/api/services')
    if (!res.ok) throw new Error('Failed to fetch services')
    const data = await res.json()
    const servicesByCategory = data.servicesByCategory || {}

    const formatted: ServiceGroup[] = []

    if (servicesByCategory.BRIDAL?.length > 0) {
      const bridal = servicesByCategory.BRIDAL
      const minPrice = Math.min(...bridal.map((s: { price: number }) => s.price))
      formatted.push({
        title: 'Maquillaje de Novia',
        price: `Desde S/ ${minPrice}`,
        features: ['Prueba previa incluida', 'Maquillaje de larga duración', 'Peinado profesional'],
        portfolioUrl: 'https://marcelacorderomakeup.my.canva.site/#page-0',
      })
    }

    if (servicesByCategory.SOCIAL?.length > 0) {
      const social = servicesByCategory.SOCIAL
      const minPrice = Math.min(...social.map((s: { price: number }) => s.price))
      formatted.push({
        title: 'Eventos Sociales',
        price: `Desde S/ ${minPrice}`,
        features: ['Maquillaje natural o glamoroso', 'Duración 1h30 - 2h', 'Pestañas incluidas'],
        portfolioUrl: 'https://marcelacorderomakeup.my.canva.site/2/#page-0',
      })
    }

    if (servicesByCategory.MATURE_SKIN?.length > 0) {
      const mature = servicesByCategory.MATURE_SKIN
      const minPrice = Math.min(...mature.map((s: { price: number }) => s.price))
      formatted.push({
        title: 'Piel Madura',
        price: `Desde S/ ${minPrice}`,
        features: ['Técnicas especializadas', 'Acabado natural luminoso', 'Cuidado personalizado'],
        portfolioUrl: 'https://marcelacorderomakeup.my.canva.site/2/#page-0',
      })
    }

    if (formatted.length === 0) {
      return [
        { title: 'Maquillaje de Novia', price: 'Desde S/ 380', features: ['Prueba previa incluida', 'Maquillaje de larga duración', 'Peinado profesional'], portfolioUrl: 'https://marcelacorderomakeup.my.canva.site/#page-0' },
        { title: 'Eventos Sociales', price: 'Desde S/ 190', features: ['Maquillaje natural o glamoroso', 'Duración 1h30 - 2h', 'Pestañas incluidas'], portfolioUrl: 'https://marcelacorderomakeup.my.canva.site/2/#page-0' },
      ]
    }

    return formatted
  } catch {
    return [
      { title: 'Maquillaje de Novia', price: 'Desde S/ 380', features: ['Prueba previa incluida', 'Maquillaje de larga duración', 'Peinado profesional'], portfolioUrl: 'https://marcelacorderomakeup.my.canva.site/#page-0' },
      { title: 'Eventos Sociales', price: 'Desde S/ 190', features: ['Maquillaje natural o glamoroso', 'Duración 1h30 - 2h', 'Pestañas incluidas'], portfolioUrl: 'https://marcelacorderomakeup.my.canva.site/2/#page-0' }
    ]
  }
}

export default function useServiceGroups() {
  return useQuery({ queryKey: ['serviceGroups'], queryFn: fetchServiceGroups, staleTime: 1000 * 60 * 5 })
}
