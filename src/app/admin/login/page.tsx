'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin');
    }
  }, [status, router]);

  // Don't show login form if already authenticated or loading
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting to sign in with:', email);

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      console.log('SignIn result:', result);

      if (result?.error) {
        console.error('SignIn error:', result.error);
        setError('Credenciales inválidas');
        setIsLoading(false);
      } else if (result?.ok) {
        console.log('SignIn successful, redirecting...');
        // Redirigir inmediatamente si el login fue exitoso
        router.push('/admin');
      } else {
        console.log('Unexpected result:', result);
        setError('Error inesperado al iniciar sesión');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Error al iniciar sesión');
      setIsLoading(false);
    }
  };

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

        {/* Form */}
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-4'>
            {/* Email Field */}
            <div>
              <label htmlFor='email' className='sr-only'>
                Email
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors'
                  placeholder='Email'
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor='password' className='sr-only'>
                Contraseña
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors'
                  placeholder='Contraseña'
                />
                <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='text-gray-400 hover:text-gray-300 focus:outline-none'
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className='bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg'>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-[#1C1C1C] bg-[#D4AF37] hover:bg-[#B8941F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-montserrat'
            >
              {isLoading ? (
                <div className='flex items-center'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-[#1C1C1C] mr-2'></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>

        {/* Debug Info - Remove in production */}
        <div className='text-center text-xs text-gray-500 space-y-1'>
          <p>Debug: Status: {status}</p>
          <p>Credenciales de prueba:</p>
          <p>admin@marcelacordero.com / admin123</p>
        </div>

        {/* Footer */}
        <div className='text-center'>
          <p className='text-xs text-gray-500'>
            © 2025 Marcela Cordero Makeup Artist. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
