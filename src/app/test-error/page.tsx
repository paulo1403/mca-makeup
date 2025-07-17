'use client';

import Link from 'next/link';
import { AlertTriangle, Home } from 'lucide-react';

export default function TestErrorPage() {
  // Esta función simula un error para probar nuestro sistema
  const simulateError = () => {
    throw new Error('This is a test error to demonstrate the error reporting system');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Página de Prueba de Errores
          </h1>
          <p className="text-gray-600">
            Esta página te permite probar el sistema de reporte de errores.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Probar el Sistema de Errores
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={simulateError}
              className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Simular Error
            </button>

            <Link
              href="/error-page"
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ir a Página de Reporte
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <Home className="w-5 h-5 mr-2" />
              Volver al Inicio
            </Link>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            Para acceder al panel de admin:{' '}
            <Link href="/admin" className="text-[#D4AF37] hover:underline">
              /admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
