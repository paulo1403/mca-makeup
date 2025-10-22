"use client";

import { ErrorAlert } from "@/components/auth/ErrorAlert";
import { LoginForm } from "@/components/auth/LoginForm";
import { RateLimitAlerts } from "@/components/auth/RateLimitAlerts";
import { useLogin, useRateLimitCheck } from "@/hooks/useAuth";
import { useCountdown } from "@/hooks/useCountdown";
import { type LoginFormData, getMostRestrictiveRateLimit } from "@/lib/auth-utils";
import { Lock } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { status } = useSession();
  const router = useRouter();
  const [showStuckBanner, setShowStuckBanner] = useState(false);
  const showStuckBannerRef = useRef(false);

  // React Query hooks (solo para rate limiting)
  const loginMutation = useLogin();
  const { data: rateLimitStatus, refetch: refetchRateLimit } = useRateLimitCheck(email);

  // Calcular info de rate limiting
  const rateLimitInfo = rateLimitStatus ? getMostRestrictiveRateLimit(rateLimitStatus) : null;

  // Countdown para bloqueo
  const { timeLeft } = useCountdown(rateLimitInfo?.blockedUntil);

  // Redirect si ya está autenticado
  useEffect(() => {
    if (status === "authenticated") {
      const search = new URLSearchParams(window.location.search);
      const callbackUrl = search.get("callbackUrl");
      const target = !callbackUrl || callbackUrl.includes("/admin/login") ? "/admin" : callbackUrl;
      if (target !== window.location.pathname) {
        router.replace(target);
      }
      // If after a short delay we are still on /admin/login, indicate to the user that
      // the session may be stale and offer actions. If the user doesn't interact, we'll
      // force sign out after an additional timeout.
      const showBannerTimer = setTimeout(() => {
        if (window.location.pathname === "/admin/login") {
          setShowStuckBanner(true);
          showStuckBannerRef.current = true;
        }
      }, 900);

      const autoSignoutTimer = setTimeout(async () => {
        if (window.location.pathname === "/admin/login" && showStuckBannerRef.current) {
          const { signOut } = await import("next-auth/react");
          signOut({ callbackUrl: "/admin/login" });
        }
      }, 3000);

      return () => {
        clearTimeout(showBannerTimer);
        clearTimeout(autoSignoutTimer);
      };
    }
  }, [status, router]);

  // no-op: we keep ref updated where we set the state to avoid effect dependencies

  // Handler para submit del formulario - usando solo NextAuth
  const handleSubmit = async (formData: LoginFormData) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Credenciales incorrectas");
      }

      if (result?.ok) {
        // Obtener callbackUrl o usar /admin por defecto
        const search = new URLSearchParams(window.location.search);
        const callbackUrl = search.get("callbackUrl");
        const target =
          !callbackUrl || callbackUrl.includes("/admin/login") ? "/admin" : callbackUrl;
        router.replace(target);
      } else {
        throw new Error("Error inesperado al iniciar sesión");
      }
    } catch (error) {
      console.error("Login error:", error);
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
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4">
        <div className="max-w-xl w-full">
          {!showStuckBanner ? (
            <div className="text-center text-[var(--color-heading)]">Redirigiendo...</div>
          ) : (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
                Problema con la sesión
              </h3>
              <p className="text-sm text-[var(--color-muted)] mb-4">
                Parece que tu sesión está caducada o hay un problema con la cookie. Puedes intentar
                reintentar la redirección o cerrar sesión para volver a iniciar sesión manualmente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const search = new URLSearchParams(window.location.search);
                    const callbackUrl = search.get("callbackUrl");
                    const target =
                      !callbackUrl || callbackUrl.includes("/admin/login") ? "/admin" : callbackUrl;
                    router.replace(target as string);
                    setShowStuckBanner(false);
                  }}
                  className="px-4 py-2 bg-[var(--color-primary)] text-[var(--on-accent-contrast)] rounded"
                >
                  Reintentar redirección
                </button>
                <button
                  onClick={async () => {
                    const { signOut } = await import("next-auth/react");
                    signOut({ callbackUrl: "/admin/login" });
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Cerrar sesión y reingresar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Extraer error message
  const errorMessage =
    loginMutation.error instanceof Error
      ? loginMutation.error.message
      : typeof loginMutation.error === "object" &&
          loginMutation.error &&
          "message" in loginMutation.error
        ? (loginMutation.error as { message: string }).message
        : null;

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg rounded-2xl p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-[var(--color-cta-text)]" />
          </div>
          <h2 className="mt-4 text-h2 text-[var(--color-heading)]">Panel de Administración</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Marcela Cordero Makeup Artist</p>
        </div>

        {/* Rate Limit Alerts */}
        <RateLimitAlerts rateLimitInfo={rateLimitInfo} onExpired={handleBlockExpired} />

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
        <div className="mt-2 text-center">
          <p className="text-xs text-[var(--color-muted)]">
            🔐 Este panel está protegido contra ataques de fuerza bruta.
            <br />
            Máximo 5 intentos cada 15 minutos.
          </p>
        </div>
      </div>
    </div>
  );
}
