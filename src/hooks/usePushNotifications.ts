'use client';

import { useEffect, useState } from 'react';

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar soporte del navegador
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();
    } else {
      setIsLoading(false);
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado:', registration);

      // Verificar suscripción existente
      const existingSubscription = await registration.pushManager.getSubscription();
      setSubscription(existingSubscription);

      // Escuchar mensajes del service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
          // Manejar clic en notificación
          console.log('Notification clicked:', event.data);
        }
      });

    } catch (error) {
      console.error('Error registrando Service Worker:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToNotifications = async () => {
    if (!isSupported) return false;

    try {
      const registration = await navigator.serviceWorker.ready;

      // Solicitar permiso
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permiso denegado para notificaciones');
      }

      // Crear suscripción
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ),
      });

      // Enviar al servidor
      const response = await fetch('/api/push/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: {
            endpoint: pushSubscription.endpoint,
            keys: {
              p256dh: arrayBufferToBase64(pushSubscription.getKey('p256dh')!),
              auth: arrayBufferToBase64(pushSubscription.getKey('auth')!),
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Error guardando suscripción');
      }

      setSubscription(pushSubscription);
      return true;
    } catch (error) {
      console.error('Error suscribiéndose a notificaciones:', error);
      return false;
    }
  };

  const unsubscribeFromNotifications = async () => {
    if (!subscription) return false;

    try {
      await subscription.unsubscribe();

      // Eliminar del servidor
      await fetch('/api/push/subscription', {
        method: 'DELETE',
      });

      setSubscription(null);
      return true;
    } catch (error) {
      console.error('Error desuscribiéndose de notificaciones:', error);
      return false;
    }
  };

  // Función auxiliar para convertir VAPID key
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

  return {
    isSupported,
    isSubscribed: !!subscription,
    isLoading,
    subscribeToNotifications,
    unsubscribeFromNotifications,
  };
}
