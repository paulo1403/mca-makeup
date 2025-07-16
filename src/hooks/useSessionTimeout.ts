'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';

export function useSessionTimeout() {
  const { data: session } = useSession();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showWarning, setShowWarning] = useState(false);

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: '/admin/login', redirect: true });
  }, []);

  useEffect(() => {
    if (!session?.timeLeft) return;

    setTimeLeft(session.timeLeft);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = Math.max(0, prev - 1);
        
        // Mostrar advertencia cuando quedan 5 minutos (300 segundos)
        if (newTime <= 300 && newTime > 0) {
          setShowWarning(true);
        }
        
        // Auto logout cuando expira
        if (newTime <= 0) {
          console.log('🚨 Session expired, logging out...');
          logout();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session, logout]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const extendSession = useCallback(async () => {
    // Forzar refresh de la sesión haciendo una petición
    try {
      const response = await fetch('/api/admin/refresh-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTimeLeft(data.timeLeft);
        setShowWarning(false);
        // También refresh de la sesión de NextAuth
        await fetch('/api/auth/session');
        // Opcional: recargar la página para obtener nueva sesión
        // window.location.reload();
      } else {
        // Si la sesión no se puede extender, hacer logout
        await logout();
      }
    } catch (error) {
      console.error('Error extending session:', error);
      await logout();
    }
  }, [logout]);

  const dismissWarning = useCallback(() => {
    setShowWarning(false);
  }, []);

  return {
    timeLeft,
    showWarning,
    formatTime: formatTime(timeLeft),
    extendSession,
    dismissWarning,
    logout,
    isLoggedIn: !!session && timeLeft > 0,
  };
}
