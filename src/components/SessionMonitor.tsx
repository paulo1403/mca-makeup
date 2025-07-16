'use client';

import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { useEffect, useState } from 'react';

export default function SessionMonitor() {
  const {
    timeLeft,
    showWarning,
    formatTime,
    extendSession,
    dismissWarning,
    logout,
    isLoggedIn,
  } = useSessionTimeout();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoggedIn) return null;

  return (
    <>
      {/* Indicador de tiempo restante en la esquina superior derecha */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`px-3 py-2 rounded-lg text-sm font-medium shadow-lg ${
          timeLeft <= 300 
            ? 'bg-red-100 text-red-800 border border-red-200' 
            : 'bg-green-100 text-green-800 border border-green-200'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="text-xs">⏰</span>
            <span>Sesión: {formatTime}</span>
          </div>
        </div>
      </div>

      {/* Modal de advertencia de expiración */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Tu sesión está por expirar
              </h3>
              <p className="text-gray-600 mb-6">
                Tu sesión expirará en <strong className="text-red-600">{formatTime}</strong>.
                ¿Quieres continuar trabajando?
              </p>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={extendSession}
                  className="w-full bg-[#D4AF37] text-white px-4 py-3 rounded-lg hover:bg-[#B8941F] transition-colors font-medium"
                >
                  ✅ Sí, continuar trabajando
                </button>
                
                <button
                  onClick={logout}
                  className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  🚪 Cerrar sesión ahora
                </button>
                
                <button
                  onClick={dismissWarning}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Recordar más tarde
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
