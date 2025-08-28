'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Smartphone, CheckCircle, X } from 'lucide-react';

interface PushNotificationManagerProps {
  userId: string;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

export default function PushNotificationManagerCompact({ userId }: PushNotificationManagerProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    // Detectar iOS y soporte de notificaciones
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscriptionStatus();
    }
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

  const showToast = (type: 'success' | 'info' | 'warning', title: string, message: string) => {
    const id = Date.now().toString();
    setToast({ id, type, title, message });
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const dismissToast = () => {
    setToast(null);
  };

  const toggleNotifications = async () => {
    if (!isSupported) return;

    setIsLoading(true);
    try {
      if (isSubscribed) {
        // Desuscribirse
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          await fetch('/api/push/subscription', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          });
        }
        setIsSubscribed(false);
        showToast('info', 'Notificaciones desactivadas', 'Ya no recibirás notificaciones push en este dispositivo.');
      } else {
        // Suscribirse
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          showToast('warning', 'Permiso denegado', 'Necesitas permitir las notificaciones para recibir alertas.');
          return;
        }

        const registration = await navigator.serviceWorker.ready;

        // Obtener la clave VAPID desde el servidor
        const vapidResponse = await fetch('/api/push/vapid-public-key');
        if (!vapidResponse.ok) {
          throw new Error('No se pudo obtener la clave VAPID');
        }
        const { publicKey } = await vapidResponse.json();

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });

        await fetch('/api/push/subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            subscription: {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
                auth: arrayBufferToBase64(subscription.getKey('auth')!),
              },
            },
          }),
        });
        setIsSubscribed(true);
        showToast('success', '¡Notificaciones activadas!', 'Ahora recibirás notificaciones push cuando tengas nuevos clientes o citas.');
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      showToast('warning', 'Error', 'No se pudieron cambiar las notificaciones. Revisa tu conexión a internet.');
    } finally {
      setIsLoading(false);
    }
  };

  // Si no está soportado, mostrar ícono de smartphone para iOS
  if (!isSupported) {
    return (
      <button
        className="p-2 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
        title={isIOS ? "iOS - usa EmailJS" : "Navegador no soportado"}
      >
        <Smartphone className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleNotifications}
        disabled={isLoading}
        className={`p-2 rounded-md transition-colors ${
          isSubscribed
            ? 'text-green-600 hover:text-green-700'
            : 'text-gray-400 hover:text-gray-600'
        }`}
        title={
          isSubscribed
            ? "Notificaciones activas - Click para desactivar"
            : "Notificaciones desactivadas - Click para activar"
        }
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-current"></div>
        ) : isSubscribed ? (
          <Bell className="h-4 w-4" />
        ) : (
          <BellOff className="h-4 w-4" />
        )}
      </button>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className={`max-w-sm md:max-w-sm w-full bg-white shadow-lg rounded-lg border-l-4 ${
            toast.type === 'success' ? 'border-l-green-500' :
            toast.type === 'warning' ? 'border-l-yellow-500' : 'border-l-blue-500'
          }`}>
            <div className="p-3 md:p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {toast.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : toast.type === 'warning' ? (
                    <Bell className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Bell className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div className="ml-3 w-0 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 break-words">
                    {toast.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 break-words">
                    {toast.message}
                  </p>
                </div>
                <div className="ml-2 md:ml-4 flex-shrink-0 flex">
                  <button
                    onClick={dismissToast}
                    className="inline-flex text-gray-400 hover:text-gray-500 p-1"
                  >
                    <X className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Funciones auxiliares
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

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
