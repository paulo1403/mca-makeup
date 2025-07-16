'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useLogin, useRateLimitCheck } from '@/hooks/useAuth';
import { useCountdown } from '@/hooks/useCountdown';
import { LoginForm } from '@/components/auth/LoginForm';
import { RateLimitAlerts } from '@/components/auth/RateLimitAlerts';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import { LoginFormData, getMostRestrictiveRateLimit } from '@/lib/auth-utils';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { status } = useSession();

  // React Query hooks
  const loginMutation = useLogin();
  const { data: rateLimitStatus } = useRateLimitCheck(email);

  // Calcular info de rate limiting
  const rateLimitInfo = rateLimitStatus 
    ? getMostRestrictiveRateLimit(rateLimitStatus)
    : null;

  // Countdown para bloqueo
  const { timeLeft } = useCountdown(rateLimitInfo?.blockedUntil);

  // Redirect si ya está autenticado
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin');
    }
  }, [status, router]);

  // Handler para submit del formulario
  const handleSubmit = async (formData: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(formData);
      router.push('/admin');
    } catch (error) {
      // Los errores se manejan automáticamente por React Query
      console.error('Login error:', error);
    }
  };

  // Handler cuando expira el bloqueo
  const handleBlockExpired = () => {
    // Refetch del rate limit status
    // React Query se encargará automáticamente
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
          isLoading={loginMutation.isPending}
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
