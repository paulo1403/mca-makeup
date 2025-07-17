'use client';

import { useState } from 'react';
import { AlertTriangle, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import { useErrorReport, type ErrorReport } from '@/hooks/useErrorReport';
import Link from 'next/link';

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
  description = "Parece que hemos encontrado un problema técnico. No te preocupes, estamos trabajando para solucionarlo."
}: ErrorPageProps) {
  const [showReportForm, setShowReportForm] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userDescription: '',
    errorType: 'other' as ErrorReport['errorType'],
    severity: 'medium' as ErrorReport['severity'],
  });
  
  const errorReportMutation = useErrorReport();

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await errorReportMutation.mutateAsync({
        ...formData,
        technicalDetails: {
          errorMessage: error?.message || 'Error no especificado',
          errorStack: error?.stack || '',
          errorBoundary: true,
        },
      });
      
      setShowReportForm(false);
    } catch (err) {
      console.error('Error sending report:', err);
    }
  };

  const getErrorIcon = () => {
    if (statusCode >= 500) {
      return <AlertTriangle className="w-16 h-16 text-red-500" />;
    } else if (statusCode >= 400) {
      return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
    } else {
      return <AlertTriangle className="w-16 h-16 text-blue-500" />;
    }
  };

  const getErrorColor = () => {
    if (statusCode >= 500) return 'red';
    if (statusCode >= 400) return 'yellow';
    return 'blue';
  };

  const errorColor = getErrorColor();

  if (errorReportMutation.isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Reporte Enviado!
          </h1>
          <p className="text-gray-600 mb-6">
            Gracias por reportar este problema. Hemos recibido tu reporte y trabajaremos para solucionarlo pronto.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            ID del reporte: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{errorReportMutation.data?.reportId}</span>
          </p>
          <div className="space-y-3">
            {reset && (
              <button
                onClick={reset}
                className="w-full bg-[#D4AF37] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#B8941F] transition-colors"
              >
                Intentar de nuevo
              </button>
            )}
            <Link
              href="/"
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors inline-block"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className={`bg-${errorColor}-50 border-b border-${errorColor}-200 p-6 sm:p-8 text-center`}>
          <div className="flex justify-center mb-4">
            {getErrorIcon()}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {description}
          </p>
          {statusCode && (
            <div className="mt-4">
              <span className={`inline-block bg-${errorColor}-100 text-${errorColor}-800 text-sm font-medium px-3 py-1 rounded-full`}>
                Error {statusCode}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {!showReportForm ? (
            <div className="space-y-6">
              {/* Que puedes hacer */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  ¿Qué puedes hacer?
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>Intenta recargar la página</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>Verifica tu conexión a internet</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>Regresa a la página anterior</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>Si el problema persiste, reporta el error</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {reset && (
                  <button
                    onClick={reset}
                    className="flex-1 bg-[#D4AF37] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#B8941F] transition-colors"
                  >
                    Intentar de nuevo
                  </button>
                )}
                <Link
                  href="/"
                  className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors text-center"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-2" />
                  Volver al inicio
                </Link>
              </div>

              {/* Report button */}
              <div className="border-t pt-6">
                <button
                  onClick={() => setShowReportForm(true)}
                  className="w-full bg-[#B06579] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#9A5A6B] transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Reportar este error</span>
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Ayúdanos a mejorar reportando este problema
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitReport} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Reportar Error
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Tu reporte nos ayuda a identificar y solucionar problemas. Toda la información es opcional.
                </p>
              </div>

              {/* Información personal (opcional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu nombre (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    placeholder="Ej: María García"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={formData.userEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, userEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {/* Tipo de error */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de problema
                  </label>
                  <select
                    value={formData.errorType}
                    onChange={(e) => setFormData(prev => ({ ...prev, errorType: e.target.value as ErrorReport['errorType'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  >
                    <option value="ui">Problema visual/interfaz</option>
                    <option value="booking">Error al reservar cita</option>
                    <option value="network">Problema de conexión</option>
                    <option value="runtime">Error del sistema</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gravedad
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as ErrorReport['severity'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe qué estabas haciendo cuando ocurrió el error *
                </label>
                <textarea
                  value={formData.userDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, userDescription: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
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
                  className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={errorReportMutation.isPending || !formData.userDescription.trim()}
                  className="flex-1 bg-[#B06579] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#9A5A6B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {errorReportMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
