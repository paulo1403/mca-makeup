'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { emailJSService } from '@/lib/emailJSService';

interface PushNotificationManagerProps {
  userId: string;
}

export default function PushNotificationManager({ userId }: PushNotificationManagerProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [browserType, setBrowserType] = useState('');
  const [showIOSWarning, setShowIOSWarning] = useState(false);
  const [emailJSConfigured, setEmailJSConfigured] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Detectar tipo de navegador
    const userAgent = navigator.userAgent;
    let browser = 'Desconocido';

    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      browser = 'Chrome';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browser = 'Safari';
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
    } else if (userAgent.includes('Edg')) {
      browser = 'Edge';
    }

    setBrowserType(browser);

    // Verificar si el navegador soporta push notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscriptionStatus();
    }

    // Mostrar warning solo una vez por sesión
    const hasShownWarning = localStorage.getItem('ios-push-warning-shown');
    if (ios && !hasShownWarning) {
      setShowIOSWarning(true);
      localStorage.setItem('ios-push-warning-shown', 'true');
    }

    // Verificar estado de EmailJS
    setEmailJSConfigured(emailJSService.isConfigured());
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const subscribeToNotifications = async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;

      // Solicitar permiso para notificaciones
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Necesitas permitir las notificaciones para recibir alertas de nuevas citas.');
        return;
      }

      // Suscribirse a push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ),
      });

      // Enviar la suscripción al servidor
      const response = await fetch('/api/push/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, // Incluir el userId para asociar la suscripción
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
              auth: arrayBufferToBase64(subscription.getKey('auth')!),
            },
          },
        }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        const message = isIOS
          ? `¡Notificaciones activadas en ${browserType}! Recibirás alertas cuando esta página esté abierta.`
          : '¡Notificaciones activadas! Recibirás alertas de nuevas citas.';
        alert(message);
      } else {
        throw new Error('Error al guardar la suscripción');
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      alert('Error al activar las notificaciones. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeFromNotifications = async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Eliminar la suscripción del servidor
        await fetch('/api/push/subscription', {
          method: 'DELETE',
        });

        setIsSubscribed(false);
        alert('Notificaciones desactivadas.');
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      alert('Error al desactivar las notificaciones.');
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones auxiliares para convertir keys
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function arrayBufferToBase64(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const dismissIOSWarning = () => {
    setShowIOSWarning(false);
  };

  if (!isSupported) {
    return null; // No mostrar nada si no está soportado
  }

  return (
    <div className="relative">
      {/* Warning específico para iOS */}
      {showIOSWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  ⚠️ iOS Detectado ({browserType})
                </h3>
              </div>
              <button
                onClick={dismissIOSWarning}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-3">
                <strong>Limitaciones importantes en iOS ({browserType}):</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-4">
                <li>• Las notificaciones solo funcionan cuando esta página está abierta</li>
                <li>• No hay notificaciones push en background como en Android</li>
                <li>• Las notificaciones desaparecen al cerrar {browserType}</li>
                <li>• Debes mantener la página abierta para recibir alertas</li>
                {browserType === 'Chrome' && (
                  <li>• 💡 <strong>Chrome ofrece mejor UX que Safari en iOS</strong></li>
                )}
                <li>• 📧 <strong>EmailJS respaldo:</strong> {emailJSConfigured ? '✅ Configurado' : '❌ No configurado'}</li>
              </ul>
              <p className="text-sm text-gray-700">
                <strong>Recomendación:</strong> Considera mantener activas las notificaciones por email como respaldo para no perderte ninguna cita.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={dismissIOSWarning}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 font-medium"
              >
                Entendido
              </button>
              <button
                onClick={() => {
                  dismissIOSWarning();
                  window.location.reload();
                }}
                className="flex-1 bg-[#B06579] text-white py-2 px-4 rounded-lg hover:bg-[#9d5a6e] font-medium"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón principal */}
      <div className="flex flex-col items-center space-y-2">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            🔔 Notificaciones Push
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {isIOS
              ? "Recibe alertas cuando esta página esté abierta"
              : "Recibe alertas instantáneas de nuevas citas"
            }
          </p>
          {emailJSConfigured && (
            <p className="text-xs text-green-600 mt-1">
              📧 EmailJS configurado como respaldo
            </p>
          )}
          {!emailJSConfigured && (
            <p className="text-xs text-orange-600 mt-1">
              ⚠️ Configura EmailJS para respaldo por email
            </p>
          )}
        </div>

        <button
        onClick={isSubscribed ? unsubscribeFromNotifications : subscribeToNotifications}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isSubscribed
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={
          isIOS
            ? (isSubscribed
                ? `Desactivar notificaciones (solo cuando ${browserType} esté abierto)`
                : `Activar notificaciones (solo cuando ${browserType} esté abierto)`)
            : (isSubscribed
                ? 'Desactivar notificaciones de nuevas citas'
                : 'Activar notificaciones de nuevas citas')
        }
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isSubscribed ? (
          <Bell className="w-4 h-4" />
        ) : (
          <BellOff className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">
          {isSubscribed ? 'Notificaciones ON' : 'Notificaciones OFF'}
        </span>
        </button>
      </div>

      {/* Indicador de estado para iOS */}
      {isIOS && isSubscribed && (
        <div className="absolute -top-8 left-0 right-0 text-center">
          <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
            💡 Mantén {browserType} abierto
          </span>
        </div>
      )}
    </div>
  );
}
