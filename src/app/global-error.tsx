'use client';

import { useEffect } from 'react';
import ErrorPage from '@/components/ErrorPage';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log del error en consola para debugging
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <ErrorPage
          error={error}
          reset={reset}
          statusCode={500}
          title="Error crítico del sistema"
          description="Ha ocurrido un error inesperado en el sistema. Nuestro equipo técnico ha sido notificado automáticamente."
        />
      </body>
    </html>
  );
}
