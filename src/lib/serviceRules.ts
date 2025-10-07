export const CATEGORY_LABELS: Record<string, string> = {
  BRIDAL: 'Novias',
  SOCIAL: 'Social/Eventos',
  MATURE_SKIN: 'Piel Madura',
  HAIRSTYLE: 'Peinados',
  OTHER: 'Otros',
}

export const CATEGORY_COLORS: Record<string, string> = {
  BRIDAL: 'bg-pink-50 border-pink-200 text-pink-700',
  SOCIAL: 'bg-purple-50 border-purple-200 text-purple-700',
  MATURE_SKIN: 'bg-amber-50 border-amber-200 text-amber-700',
  HAIRSTYLE: 'bg-blue-50 border-blue-200 text-blue-700',
  OTHER: 'bg-gray-50 border-gray-200 text-gray-700',
}

// selectedMap: Record<serviceId, quantity>
export function validateSelection(selectedMap: Record<string, number>, services: unknown[]): string {
  const serviceIds = Object.keys(selectedMap).filter(id => (selectedMap[id] || 0) > 0)
  if (serviceIds.length === 0) return ''

  const arr = services as Array<Record<string, unknown>>
  const selectedServiceObjects = arr.filter(svc => serviceIds.includes(String(svc.id)))
  const categories = selectedServiceObjects.map(svc => String(svc.category))
  const uniqueCategories = Array.from(new Set(categories))

  if (uniqueCategories.length === 1 && uniqueCategories[0] === 'HAIRSTYLE') {
    return 'No se puede reservar solo peinado. Debe incluir un servicio de maquillaje.'
  }

  const hasNovia = categories.includes('BRIDAL')
  const hasSocial = categories.includes('SOCIAL') || categories.includes('MATURE_SKIN')

  if (hasNovia && hasSocial) {
    return 'No se pueden combinar servicios de novia con servicios sociales o de piel madura.'
  }

  if (uniqueCategories.length > 2) {
    return 'Solo se pueden combinar máximo 2 tipos de servicios.'
  }

  if (uniqueCategories.length === 2) {
    const hasHairstyle = categories.includes('HAIRSTYLE')
    const hasMakeup = categories.includes('SOCIAL') || categories.includes('MATURE_SKIN') || categories.includes('BRIDAL')

    if (!(hasHairstyle && hasMakeup)) {
      return 'Solo se puede combinar maquillaje con peinado.'
    }
  }

  return ''
}

const serviceRules = { CATEGORY_LABELS, CATEGORY_COLORS, validateSelection }

export default serviceRules
