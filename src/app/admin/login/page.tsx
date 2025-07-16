'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Lock } from 'lucide-react';
import { useLogin, useRateLimitCheck } from '@/hooks/useAuth';
import { useCountdown } from '@/hooks/useCountdown';
import { LoginForm } from '@/components/auth/LoginForm';
import { RateLimitAlerts } from '@/components/auth/RateLimitAlerts';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import { LoginFormData, getMostRestrictiveRateLimit } from '@/lib/auth-utils';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { status } = useSession();

  // React Query hooks (solo para rate limiting)
  const loginMutation = useLogin();
  const { data: rateLimitStatus, refetch: refetchRateLimit } = useRateLimitCheck(email);

  // Calcular info de rate limiting
  const rateLimitInfo = rateLimitStatus 
    ? getMostRestrictiveRateLimit(rateLimitStatus)
    : null;

  // Countdown para bloqueo
  const { timeLeft } = useCountdown(rateLimitInfo?.blockedUntil);

    // Redirect si ya está autenticado
  useEffect(() => {
    if (status === 'authenticated') {
      const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl');
      const redirectUrl = callbackUrl || '/admin';
      window.location.href = redirectUrl;
    }
  }, [status]);

  // Handler para submit del formulario - usando solo NextAuth
  const handleSubmit = async (formData: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      
      if (result?.error) {
        throw new Error('Credenciales incorrectas');
      }
      
      if (result?.ok) {        
        // Obtener callbackUrl o usar /admin por defecto
        const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl');
        const redirectUrl = callbackUrl || '/admin';
        
        // Dar tiempo para que se actualice la sesión antes de redirigir
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 500);
      } else {
        throw new Error('Error inesperado al iniciar sesión');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Mostrar el error al usuario usando React Query para mantener compatibilidad
      loginMutation.mutate(formData);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler cuando expira el bloqueo
  const handleBlockExpired = () => {
    refetchRateLimit();
  };

  // Loading states
  if (status === 'loading') {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#1C1C1C] via-[#2a2a2a] to-[#1C1C1C] flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]'></div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#1C1C1C] via-[#2a2a2a] to-[#1C1C1C] flex items-center justify-center'>
        <div className='text-white'>Redirigiendo...</div>
      </div>
    );
  }

  // Extraer error message
  const errorMessage = loginMutation.error instanceof Error
    ? loginMutation.error.message
    : typeof loginMutation.error === 'object' && loginMutation.error && 'message' in loginMutation.error
    ? (loginMutation.error as { message: string }).message
    : null;

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#1C1C1C] via-[#2a2a2a] to-[#1C1C1C] flex items-center justify-center px-4'>
      <div className='max-w-md w-full space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 bg-[#D4AF37] rounded-full flex items-center justify-center'>
            <Lock className='h-6 w-6 text-[#1C1C1C]' />
          </div>
          <h2 className='mt-6 text-3xl font-bold text-white font-playfair'>
            Panel de Administración
          </h2>
          <p className='mt-2 text-sm text-gray-400'>
            Marcela Cordero Makeup Artist
          </p>
        </div>

        {/* Rate Limit Alerts */}
        <RateLimitAlerts 
          rateLimitInfo={rateLimitInfo}
          onExpired={handleBlockExpired}
        />

        {/* Error Alert */}
        <ErrorAlert error={errorMessage} />

        {/* Login Form */}
        <LoginForm
          onSubmit={handleSubmit}
          onEmailChange={setEmail}
          isLoading={isLoading}
          rateLimitInfo={rateLimitInfo}
          countdownTime={timeLeft}
        />

        {/* Security Notice */}
        <div className='mt-6 text-center'>
          <p className='text-xs text-gray-500'>
            🔐 Este panel está protegido contra ataques de fuerza bruta.<br/>
            Máximo 5 intentos cada 15 minutos.
          </p>
        </div>
      </div>
    </div>
  );
}
