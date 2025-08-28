'use client';

import { useState } from 'react';
import { testEmailConfiguration, getEmailConfigStatus } from '@/lib/emailJSService';

export default function EmailJSTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [configStatus, setConfigStatus] = useState<{
    configured: boolean;
    serviceId: boolean;
    templateId: boolean;
    publicKey: boolean;
    adminEmail: boolean;
  } | null>(null);

  const handleTestEmail = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const success = await testEmailConfiguration();
      if (success) {
        setResult('✅ Email enviado exitosamente a Marcela');
      } else {
        setResult('❌ Error enviando email - revisa la configuración');
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckConfig = () => {
    const status = getEmailConfigStatus();
    setConfigStatus(status);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            📧 EmailJS - Sistema de Respaldo
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Envía emails cuando las push notifications fallen
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <button
            onClick={handleTestEmail}
            disabled={isLoading}
            className="px-4 py-2 bg-[#B06579] text-white text-sm rounded-lg hover:bg-[#9d5a6e] disabled:opacity-50"
          >
            {isLoading ? 'Enviando...' : '📧 Probar Email'}
          </button>

          <button
            onClick={handleCheckConfig}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
          >
            🔍 Ver Configuración
          </button>
        </div>

        {result && (
          <div className={`p-3 rounded-lg text-sm ${
            result.includes('✅')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {result}
          </div>
        )}

        {configStatus && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Estado de Configuración:</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <div>✅ Configurado: {configStatus.configured ? 'Sí' : 'No'}</div>
              <div>✅ Service ID: {configStatus.serviceId ? 'Configurado' : 'Faltante'}</div>
              <div>✅ Template ID: {configStatus.templateId ? 'Configurado' : 'Faltante'}</div>
              <div>✅ Public Key: {configStatus.publicKey ? 'Configurado' : 'Faltante'}</div>
              <div>📧 Email Admin: {configStatus.adminEmail ? 'Configurado' : 'Faltante'}</div>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">📋 Configuración Requerida:</h4>
          <div className="text-xs text-yellow-700 space-y-1">
            <p>1. Ve a <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="underline">EmailJS.com</a> y crea una cuenta</p>
            <p>2. Crea un servicio de email (Gmail, Outlook, etc.)</p>
            <p>3. Crea una plantilla de email para citas</p>
            <p>4. Copia las credenciales a tu archivo .env</p>
          </div>
        </div>
      </div>
    </div>
  );
}
