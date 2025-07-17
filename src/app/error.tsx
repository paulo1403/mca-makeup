'use client';

import { useEffect } from 'react';
import ErrorPage from '@/components/ErrorPage';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log del error en consola para debugging
    console.error('Application error:', error);
  }, [error]);

  return (
    <ErrorPage
      error={error}
      reset={reset}
      statusCode={500}
      title="¡Ups! Algo salió mal"
      description="Hemos encontrado un problema técnico. No te preocupes, estamos trabajando para solucionarlo."
    />
  );
}
