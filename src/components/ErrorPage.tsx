"use client";

import { AlertTriangle, ArrowLeft, CheckCircle, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { type ErrorReport, useErrorReport } from "@/hooks/useErrorReport";

interface ErrorPageProps {
  error?: Error & { digest?: string };
  reset?: () => void;
  statusCode?: number;
  title?: string;
  description?: string;
}

export default function ErrorPage({
  error,
  reset,
  statusCode = 500,
  title = "¡Ups! Algo salió mal",
  description = "Parece que hemos encontrado un problema técnico. No te preocupes, estamos trabajando para solucionarlo.",
}: ErrorPageProps) {
  const router = useRouter();
  const [showReportForm, setShowReportForm] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userDescription: "",
    errorType: "other" as ErrorReport["errorType"],
    severity: "medium" as ErrorReport["severity"],
  });

  const errorReportMutation = useErrorReport();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push("/");
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await errorReportMutation.mutateAsync({
        ...formData,
        technicalDetails: {
          errorMessage: error?.message || "Error no especificado",
          errorStack: error?.stack || "",
          errorBoundary: true,
        },
      });

      setShowReportForm(false);
    } catch (err) {
      console.error("Error sending report:", err);
    }
  };

  const inputClassName =
    "w-full px-4 py-3 border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-heading)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/30 focus:border-[color:var(--color-primary)] transition-colors placeholder:text-[color:var(--color-muted)]";

  if (errorReportMutation.isSuccess) {
    return (
      <main className="min-h-[calc(100vh-80px)] pt-32 pb-16 px-4 flex items-center justify-center bg-[color:var(--color-background)]">
        <div className="max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-[color:var(--color-primary)] mx-auto mb-6" />
          <Typography as="h1" variant="h1" className="text-[color:var(--color-heading)] mb-4">
            ¡Reporte Enviado!
          </Typography>
          <Typography as="p" variant="p" className="text-[color:var(--color-body)] mb-8">
            Gracias por reportar este problema. Hemos recibido tu reporte y trabajaremos para
            solucionarlo pronto.
          </Typography>
          {errorReportMutation.data?.reportId && (
            <Typography
              as="p"
              variant="small"
              className="text-[color:var(--color-muted)] mb-8 font-mono"
            >
              ID: {errorReportMutation.data.reportId}
            </Typography>
          )}
          <div className="space-y-3">
            {reset && (
              <Button variant="outline" size="lg" className="w-full" onClick={reset}>
                Intentar de nuevo
              </Button>
            )}
            <Button as="a" href="/" variant="primary" size="lg" className="w-full">
              Volver al inicio
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] pt-32 pb-16 px-4 flex items-center justify-center bg-[color:var(--color-background)]">
      <div className="max-w-md w-full text-center">
        <AlertTriangle className="w-16 h-16 text-[color:var(--color-primary)] mx-auto mb-6" />
        <Typography as="h1" variant="h1" className="text-[color:var(--color-heading)] mb-3">
          {title}
        </Typography>
        <Typography as="p" variant="p" className="text-[color:var(--color-body)] mb-6">
          {description}
        </Typography>
        {statusCode && (
          <span className="inline-block text-sm font-medium text-[color:var(--color-muted)] border border-[color:var(--color-border)] px-4 py-1.5 rounded-full mb-8">
            Error {statusCode}
          </span>
        )}

        {!showReportForm ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" size="lg" className="flex-1" onClick={handleGoBack}>
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
              <Button as="a" href="/" variant="primary" size="lg" className="flex-1">
                Volver al inicio
              </Button>
            </div>

            {reset && (
              <Button variant="ghost" size="md" className="w-full" onClick={reset}>
                Intentar de nuevo
              </Button>
            )}

            <div className="pt-6 border-t border-[color:var(--color-border)]/30">
              <Button
                variant="soft"
                size="md"
                className="w-full"
                onClick={() => setShowReportForm(true)}
              >
                <Send className="w-4 h-4" />
                Reportar este error
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitReport} className="text-left space-y-5">
            <div>
              <Typography as="h3" variant="h3" className="text-[color:var(--color-heading)] mb-1">
                Reportar Error
              </Typography>
              <Typography as="p" variant="small" className="text-[color:var(--color-body)]">
                Tu reporte nos ayuda a identificar y solucionar problemas.
              </Typography>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--color-heading)] mb-2">
                  Nombre (opcional)
                </label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, userName: e.target.value }))}
                  className={inputClassName}
                  placeholder="María García"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--color-heading)] mb-2">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData((prev) => ({ ...prev, userEmail: e.target.value }))}
                  className={inputClassName}
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--color-heading)] mb-2">
                  Tipo
                </label>
                <select
                  value={formData.errorType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      errorType: e.target.value as ErrorReport["errorType"],
                    }))
                  }
                  className={inputClassName}
                >
                  <option value="ui">Visual</option>
                  <option value="booking">Reserva</option>
                  <option value="network">Conexión</option>
                  <option value="runtime">Sistema</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--color-heading)] mb-2">
                  Gravedad
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      severity: e.target.value as ErrorReport["severity"],
                    }))
                  }
                  className={inputClassName}
                >
                  <option value="low">Leve</option>
                  <option value="medium">Moderado</option>
                  <option value="high">Alto</option>
                  <option value="critical">Crítico</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--color-heading)] mb-2">
                ¿Qué estabas haciendo? *
              </label>
              <textarea
                value={formData.userDescription}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, userDescription: e.target.value }))
                }
                className={`${inputClassName} resize-none`}
                rows={4}
                placeholder="Cuéntanos qué pasó..."
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setShowReportForm(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={errorReportMutation.isPending || !formData.userDescription.trim()}
              >
                {errorReportMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
