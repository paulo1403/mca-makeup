'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { LoginFormData, loginSchema, RateLimitInfo, formatTime } from '@/lib/auth-utils';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  onEmailChange?: (email: string) => void;
  isLoading: boolean;
  rateLimitInfo: RateLimitInfo | null;
  countdownTime: number;
}

export const LoginForm = ({ onSubmit, onEmailChange, isLoading, rateLimitInfo, countdownTime }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Observar cambios en el email
  const emailValue = watch('email');
  
  // Notificar cambios de email al componente padre
  useEffect(() => {
    if (emailValue && onEmailChange) {
      onEmailChange(emailValue);
    }
  }, [emailValue, onEmailChange]);

  const isBlocked = rateLimitInfo?.isBlocked ?? false;

  return (
    <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
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
              {...register('email')}
              id='email'
              type='email'
              autoComplete='email'
              disabled={isBlocked}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-transparent transition-colors ${
                errors.email 
                  ? 'border-red-500' 
                  : 'border-gray-600'
              } ${
                isBlocked ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              placeholder='Email'
            />
          </div>
          {errors.email && (
            <p className='mt-1 text-sm text-red-400'>{errors.email.message}</p>
          )}
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
              {...register('password')}
              id='password'
              type={showPassword ? 'text' : 'password'}
              autoComplete='current-password'
              disabled={isBlocked}
              className={`block w-full pl-10 pr-12 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-transparent transition-colors ${
                errors.password 
                  ? 'border-red-500' 
                  : 'border-gray-600'
              } ${
                isBlocked ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              placeholder='Contraseña'
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 pr-3 flex items-center'
              onClick={() => setShowPassword(!showPassword)}
              disabled={isBlocked}
            >
              {showPassword ? (
                <EyeOff className='h-5 w-5 text-gray-400 hover:text-white transition-colors' />
              ) : (
                <Eye className='h-5 w-5 text-gray-400 hover:text-white transition-colors' />
              )}
            </button>
          </div>
          {errors.password && (
            <p className='mt-1 text-sm text-red-400'>{errors.password.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type='submit'
        disabled={isLoading || isBlocked}
        className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 ${
          isLoading || isBlocked
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-primary-accent hover:bg-primary-accent/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-accent focus:ring-offset-gray-800'
        }`}
      >
        {isLoading ? (
          <div className='flex items-center space-x-2'>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
            <span>Iniciando sesión...</span>
          </div>
        ) : isBlocked ? (
          <span>Bloqueado - {formatTime(countdownTime)}</span>
        ) : (
          'Iniciar Sesión'
        )}
      </button>
    </form>
  );
};
