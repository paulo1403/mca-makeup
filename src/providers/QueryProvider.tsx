'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutos
            gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
            retry: (failureCount, error: unknown) => {
              // No reintentar en errores de autenticación (401, 403)
              if (error && typeof error === 'object' && 'status' in error) {
                const status = (error as { status: number }).status;
                if (status === 401 || status === 403) {
                  return false;
                }
              }
              // Reintentar máximo 2 veces para otros errores
              return failureCount < 2;
            },
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false, // No reintentar mutaciones por defecto
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
