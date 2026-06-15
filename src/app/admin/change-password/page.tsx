"use client";

import { Eye, EyeOff, Lock, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";

export default function ChangePassword() {
  const { data: session } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al cambiar la contraseña");
      } else {
        setMessage("Contraseña cambiada exitosamente");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setError("Error al cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName =
    "block w-full px-4 py-3 border border-[color:var(--color-border)] rounded-xl bg-[color:var(--color-surface)] text-[color:var(--color-heading)] placeholder:text-[color:var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/30 focus:border-[color:var(--color-primary)] transition-colors";

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-[color:var(--color-surface)] rounded-2xl border border-[color:var(--color-border)]/30 p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-primary-hover)] flex items-center justify-center shadow-lg shadow-[color:var(--color-primary)]/20">
            <Lock className="h-6 w-6 text-[color:var(--color-cta-text)]" />
          </div>
          <Typography as="h2" variant="h2" className="mt-4 text-[color:var(--color-heading)]">
            Cambiar Contraseña
          </Typography>
          <Typography as="p" variant="small" className="mt-2 text-[color:var(--color-muted)]">
            Usuario: {session?.user?.email}
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-[color:var(--color-body)] mb-2"
            >
              Contraseña Actual
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClassName}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)] transition-colors"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-[color:var(--color-body)] mb-2"
            >
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClassName}
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)] transition-colors"
              >
                {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[color:var(--color-body)] mb-2"
            >
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClassName}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)] transition-colors"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-[color:var(--color-danger)]/10 border border-[color:var(--color-danger)]/30 text-[color:var(--color-danger)] px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="bg-[color:var(--color-success)]/10 border border-[color:var(--color-success)]/30 text-[color:var(--color-success)] px-4 py-3 rounded-lg text-sm">
              {message}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Cambiando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Cambiar Contraseña
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
