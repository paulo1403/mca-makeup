"use client";

import { useEffect } from "react";
import ErrorPage from "@/components/ErrorPage";
import NavBar from "@/components/NavBar";
import QueryProvider from "@/providers/QueryProvider";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log del error en consola para debugging
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body className="antialiased overflow-x-hidden max-w-full bg-[color:var(--color-background)]">
        <NavBar />
        <QueryProvider>
          <ErrorPage
            error={error}
            reset={reset}
            statusCode={500}
            title="Error crítico del sistema"
            description="Ha ocurrido un error inesperado en el sistema. Nuestro equipo técnico ha sido notificado automáticamente."
          />
        </QueryProvider>
      </body>
    </html>
  );
}
