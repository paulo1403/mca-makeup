"use client";

import { type ErrorReport, useErrorReport } from "@/hooks/useErrorReport";
import { AlertTriangle, ArrowLeft, CheckCircle, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  const getErrorIcon = () => {
    if (statusCode >= 500) {
      return <AlertTriangle className="w-16 h-16 text-red-500" />;
    }
    if (statusCode >= 400) {
      return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
    }
    return <AlertTriangle className="w-16 h-16 text-blue-500" />;
  };

  if (errorReportMutation.isSuccess) {
    return (
      <div className="min-h-screen bg-[color:var(--color-background)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)]/20 p-8">
          {/* Navigation */}
          <div className="mb-6">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-[color:var(--color-body)] hover:text-[color:var(--color-primary)] transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver
            </button>
          </div>

          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-[color:var(--color-heading)] mb-4">
              ¡Reporte Enviado!
            </h1>
            <p className="text-[color:var(--color-body)] mb-6">
              Gracias por reportar este problema. Hemos recibido tu reporte y trabajaremos para
              solucionarlo pronto.
            </p>
            <p className="text-sm text-[color:var(--color-muted)] mb-6">
              ID del reporte:{" "}
              <span className="font-mono bg-[color:var(--color-muted)]/10 px-2 py-1 rounded">
                {errorReportMutation.data?.reportId}
              </span>
            </p>
            <div className="space-y-3">
              {reset && (
                <button
                  onClick={reset}
                  className="w-full bg-[color:var(--color-primary)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[color:var(--color-primary)]/80 transition-colors"
                >
                  Intentar de nuevo
                </button>
              )}
              <Link
                href="/"
                className="w-full bg-[color:var(--color-muted)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[color:var(--color-muted)]/80 transition-colors inline-block"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)]/20 overflow-hidden">
        {/* Header */}
        <div className="bg-[color:var(--color-accent)]/10 border-b border-[color:var(--color-border)]/20 p-6 sm:p-8 text-center">
          <div className="flex justify-center mb-4">{getErrorIcon()}</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[color:var(--color-heading)] mb-2">
            {title}
          </h1>
          <p className="text-[color:var(--color-body)] text-sm sm:text-base">{description}</p>
          {statusCode && (
            <div className="mt-4">
              <span className="inline-block bg-[color:var(--color-accent)]/20 text-[color:var(--color-heading)] text-sm font-medium px-3 py-1 rounded-full">
                Error {statusCode}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Navigation */}
          <div className="mb-6">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-[color:var(--color-body)] hover:text-[color:var(--color-primary)] transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver
            </button>
          </div>
          {!showReportForm ? (
            <div className="space-y-6">
              {/* Que puedes hacer */}
              <div>
                <h3 className="text-lg font-semibold text-[color:var(--color-heading)] mb-3">
                  ¿Qué puedes hacer?
                </h3>
                <ul className="space-y-2 text-[color:var(--color-body)]">
                  <li className="flex items-start space-x-2">
                    <span className="text-[color:var(--color-primary)] mt-1">•</span>
                    <span>Intenta recargar la página</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[color:var(--color-primary)] mt-1">•</span>
                    <span>Verifica tu conexión a internet</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[color:var(--color-primary)] mt-1">•</span>
                    <span>Regresa a la página anterior</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[color:var(--color-primary)] mt-1">•</span>
                    <span>Si el problema persiste, reporta el error</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {reset && (
                  <button
                    onClick={reset}
                    className="flex-1 bg-[color:var(--color-primary)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[color:var(--color-primary)]/80 transition-colors"
                  >
                    Intentar de nuevo
                  </button>
                )}
                <Link
                  href="/"
                  className="flex-1 bg-[color:var(--color-muted)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[color:var(--color-muted)]/80 transition-colors text-center"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-2" />
                  Volver al inicio
                </Link>
              </div>

              {/* Report button */}
              <div className="border-t border-[color:var(--color-border)]/20 pt-6">
                <button
                  onClick={() => setShowReportForm(true)}
                  className="w-full bg-[color:var(--color-accent)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[color:var(--color-accent)]/80 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Reportar este error</span>
                </button>
                <p className="text-xs text-[color:var(--color-muted)] mt-2 text-center">
                  Ayúdanos a mejorar reportando este problema
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitReport} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[color:var(--color-heading)] mb-3">
                  Reportar Error
                </h3>
                <p className="text-[color:var(--color-body)] text-sm mb-6">
                  Tu reporte nos ayuda a identificar y solucionar problemas. Toda la información es
                  opcional.
                </p>
              </div>

              {/* Información personal (opcional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[color:var(--color-heading)] mb-2">
                    Tu nombre (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, userName: e.target.value }))}
                    className="w-full px-3 py-2 border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-heading)] rounded-lg focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent"
                    placeholder="Ej: María García"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[color:var(--color-heading)] mb-2">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={formData.userEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, userEmail: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-heading)] rounded-lg focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {/* Tipo de error */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[color:var(--color-heading)] mb-2">
                    Tipo de problema
                  </label>
                  <select
                    value={formData.errorType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        errorType: e.target.value as ErrorReport["errorType"],
                      }))
                    }
                    className="w-full px-3 py-2 border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-heading)] rounded-lg focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent"
                  >
                    <option value="ui">Problema visual/interfaz</option>
                    <option value="booking">Error al reservar cita</option>
                    <option value="network">Problema de conexión</option>
                    <option value="runtime">Error del sistema</option>
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
                    className="w-full px-3 py-2 border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-heading)] rounded-lg focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent"
                  >
                    <option value="low">Leve - Molesto pero puedo continuar</option>
                    <option value="medium">Moderado - Dificulta el uso</option>
                    <option value="high">Alto - Impide completar tareas</option>
                    <option value="critical">Crítico - No puedo usar el sitio</option>
                  </select>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-[color:var(--color-heading)] mb-2">
                  Describe qué estabas haciendo cuando ocurrió el error *
                </label>
                <textarea
                  value={formData.userDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, userDescription: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-heading)] rounded-lg focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Ej: Estaba tratando de reservar una cita para el viernes y cuando hice clic en 'Confirmar', apareció este error..."
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowReportForm(false)}
                  className="flex-1 bg-[color:var(--color-muted)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[color:var(--color-muted)]/80 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={errorReportMutation.isPending || !formData.userDescription.trim()}
                  className="flex-1 bg-[color:var(--color-accent)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[color:var(--color-accent)]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {errorReportMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Reporte</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
