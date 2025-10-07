import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export type ServiceData = {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: string;
};

export type ServiceGroup = {
  title: string;
  price: string;
  features: string[];
  portfolioUrl: string;
};

async function fetchServices(): Promise<ServiceGroup[]> {
  try {
    const res = await fetch('/api/services');
    if (!res.ok) throw new Error('Failed to fetch services');
    const data = await res.json();
    const servicesByCategory = data.servicesByCategory || {};

    const formatted: ServiceGroup[] = [];

    if (servicesByCategory.BRIDAL?.length > 0) {
      const bridal = servicesByCategory.BRIDAL as ServiceData[];
      const minPrice = Math.min(...bridal.map((s) => s.price));
      formatted.push({
        title: 'Maquillaje de Novia',
        price: `Desde S/ ${minPrice}`,
        features: [
          'Prueba previa incluida',
          'Maquillaje de larga duración',
          'Peinado profesional',
        ],
        portfolioUrl: 'https://marcelacorderomakeup.my.canva.site/#page-0',
      });
    }

    if (servicesByCategory.SOCIAL?.length > 0) {
      const social = servicesByCategory.SOCIAL as ServiceData[];
      const minPrice = Math.min(...social.map((s) => s.price));
      formatted.push({
        title: 'Eventos Sociales',
        price: `Desde S/ ${minPrice}`,
        features: [
          'Maquillaje natural o glamoroso',
          'Duración 1h30 - 2h',
          'Pestañas incluidas',
        ],
        portfolioUrl: 'https://marcelacorderomakeup.my.canva.site/2/#page-0',
      });
    }

    if (servicesByCategory.MATURE_SKIN?.length > 0) {
      const mature = servicesByCategory.MATURE_SKIN as ServiceData[];
      const minPrice = Math.min(...mature.map((s) => s.price));
      formatted.push({
        title: 'Piel Madura',
        price: `Desde S/ ${minPrice}`,
        features: [
          'Técnicas especializadas',
          'Acabado natural luminoso',
          'Cuidado personalizado',
        ],
        portfolioUrl: 'https://marcelacorderomakeup.my.canva.site/2/#page-0',
      });
    }

    // Always ensure Piel Madura exists as a fallback
    if (!formatted.find((s) => s.title === 'Piel Madura')) {
      formatted.push({
        title: 'Piel Madura',
        price: 'Desde S/ 230',
        features: [
          'Técnicas especializadas',
          'Acabado natural luminoso',
          'Cuidado personalizado',
        ],
        portfolioUrl: 'https://marcelacorderomakeup.my.canva.site/2/#page-0',
      });
    }

    // If nothing was provided, fallback to defaults
    if (formatted.length === 0) {
      return [
        {
          title: 'Maquillaje de Novia',
          price: 'Desde S/ 480',
          features: [
            'Prueba previa incluida',
            'Maquillaje de larga duración',
            'Peinado profesional',
          ],
          portfolioUrl: 'https://marcelacorderomakeup.my.canva.site/#page-0',
        },
        {
          title: 'Eventos Sociales',
          price: 'Desde S/ 200',
          features: [
            'Maquillaje natural o glamoroso',
            'Duración 1h30 - 2h',
            'Pestañas incluidas',
          ],
          portfolioUrl: 'https://marcelacorderomakeup.my.canva.site/2/#page-0',
        },
        {
          title: 'Piel Madura',
          price: 'Desde S/ 230',
          features: [
            'Técnicas especializadas',
            'Acabado natural luminoso',
            'Cuidado personalizado',
          ],
          portfolioUrl: 'https://marcelacorderomakeup.my.canva.site/2/#page-0',
        },
      ];
    }

    return formatted;
  } catch {
    // fallback set
    return [
      {
        title: 'Maquillaje de Novia',
        price: 'Desde S/ 480',
        features: [
          'Prueba previa incluida',
          'Maquillaje de larga duración',
          'Peinado profesional',
        ],
        portfolioUrl: 'https://marcelacorderomakeup.my.canva.site/#page-0',
      },
      {
        title: 'Eventos Sociales',
        price: 'Desde S/ 200',
        features: [
          'Maquillaje natural o glamoroso',
          'Duración 1h30 - 2h',
          'Pestañas incluidas',
        ],
        portfolioUrl: 'https://marcelacorderomakeup.my.canva.site/2/#page-0',
      },
      {
        title: 'Piel Madura',
        price: 'Desde S/ 230',
        features: [
          'Técnicas especializadas',
          'Acabado natural luminoso',
          'Cuidado personalizado',
        ],
        portfolioUrl: 'https://marcelacorderomakeup.my.canva.site/2/#page-0',
      },
    ];
  }
}

export function useServices(options?: UseQueryOptions<ServiceGroup[], Error>) {
  return useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    ...(options ?? {}),
  } as UseQueryOptions<ServiceGroup[], Error>);
}

export default useServices;
