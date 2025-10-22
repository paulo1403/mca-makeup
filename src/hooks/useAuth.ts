"use client";

import type { LoginFormData, RateLimitStatus } from "@/lib/auth-utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

// Servicios API
const authService = {
  // Verificar rate limits
  checkRateLimit: async (email?: string): Promise<RateLimitStatus> => {
    const url = email
      ? `/api/admin/login-verify?email=${encodeURIComponent(email)}`
      : "/api/admin/login-verify";

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error al verificar rate limits");
    }
    return response.json();
  },

  // Verificar credenciales con rate limiting
  verifyCredentials: async (credentials: LoginFormData) => {
    const response = await fetch("/api/admin/login-verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.error || "Error de autenticación",
        attemptsLeft: data.attemptsLeft,
        blockedUntil: data.blockedUntil,
        timeLeft: data.timeLeft,
      };
    }

    return data;
  },

  // Login con NextAuth
  loginWithNextAuth: async (credentials: LoginFormData) => {
    const result = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error("Error en el proceso de autenticación");
    }

    if (!result?.ok) {
      throw new Error("Error inesperado al iniciar sesión");
    }

    return result;
  },
};

// Hook para verificar rate limits
export const useRateLimitCheck = (email?: string) => {
  return useQuery({
    queryKey: ["rateLimit", email],
    queryFn: () => authService.checkRateLimit(email),
    enabled: !!email && email.includes("@"),
    staleTime: 30 * 1000, // 30 segundos
    refetchInterval: 60 * 1000, // Refetch cada minuto
  });
};

// Hook para el proceso completo de login
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      // Paso 1: Verificar credenciales y rate limits
      await authService.verifyCredentials(credentials);

      // Paso 2: Si pasa la verificación, hacer login con NextAuth
      const result = await authService.loginWithNextAuth(credentials);

      return result;
    },
    meta: {
      errorMessage: "Error al iniciar sesión",
    },
  });
};

// Hook para verificar solo credenciales (sin login)
export const useVerifyCredentials = () => {
  return useMutation({
    mutationFn: authService.verifyCredentials,
  });
};
