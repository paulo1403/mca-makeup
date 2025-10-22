"use client";

import ErrorPage from "@/components/ErrorPage";
import QueryProvider from "@/providers/QueryProvider";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <QueryProvider>
      <ErrorPage
        error={error}
        reset={reset}
        statusCode={500}
        title="¡Ups! Algo salió mal"
        description="Hemos encontrado un problema técnico. No te preocupes, estamos trabajando para solucionarlo."
      />
    </QueryProvider>
  );
}
