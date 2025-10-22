"use client";

import Button from "@/components/ui/Button";
import { type LoginFormData, type RateLimitInfo, formatTime, loginSchema } from "@/lib/auth-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  onEmailChange?: (email: string) => void;
  isLoading: boolean;
  rateLimitInfo: RateLimitInfo | null;
  countdownTime: number;
}

export const LoginForm = ({
  onSubmit,
  onEmailChange,
  isLoading,
  rateLimitInfo,
  countdownTime,
}: LoginFormProps) => {
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
  const emailValue = watch("email");

  // Notificar cambios de email al componente padre
  useEffect(() => {
    if (emailValue && onEmailChange) {
      onEmailChange(emailValue);
    }
  }, [emailValue, onEmailChange]);

  const isBlocked = rateLimitInfo?.isBlocked ?? false;

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-[var(--color-muted)]" />
            </div>
            <input
              {...register("email")}
              id="email"
              type="email"
              autoComplete="email"
              disabled={isBlocked}
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-[var(--color-surface-elevated)] text-[var(--color-heading)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                errors.email
                  ? "border-[var(--status-cancelled-border)]"
                  : "border-[var(--color-border)]"
              } ${isBlocked ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="Email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-[var(--status-cancelled-text)]">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="sr-only">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[var(--color-muted)]" />
            </div>
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              disabled={isBlocked}
              className={`block w-full pl-10 pr-12 py-3 border rounded-xl bg-[var(--color-surface-elevated)] text-[var(--color-heading)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                errors.password
                  ? "border-[var(--status-cancelled-border)]"
                  : "border-[var(--color-border)]"
              } ${isBlocked ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="Contraseña"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isBlocked}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-[var(--color-muted)] hover:text-[var(--color-heading)] transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-[var(--color-muted)] hover:text-[var(--color-heading)] transition-colors" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-[var(--status-cancelled-text)]">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        as="button"
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isLoading || isBlocked}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-cta-text)]"></div>
            <span>Iniciando sesión...</span>
          </div>
        ) : isBlocked ? (
          <span>Bloqueado - {formatTime(countdownTime)}</span>
        ) : (
          "Iniciar Sesión"
        )}
      </Button>
    </form>
  );
};
