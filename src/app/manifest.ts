import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Marcela Cordero Makeup',
    short_name: 'MCA Makeup',
    description: 'Reservas y gestión de citas - Marcela Cordero Makeup',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1C1C1C',
    icons: [
      { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
