"use client";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { BookingData } from "@/lib/bookingSchema";
import Typography from "@/components/ui/Typography";
import "@/styles/components/step1.css";

function formatPhone(value: string) {
  const v = value.replace(/[^\d+]/g, "");
  if (v.startsWith("+51")) {
    const digits = v.substring(3);
    if (digits.length <= 3) return `+51 ${digits}`;
    if (digits.length <= 6)
      return `+51 ${digits.substring(0, 3)} ${digits.substring(3)}`;
    return `+51 ${digits.substring(0, 3)} ${digits.substring(
      3,
      6
    )} ${digits.substring(6, 9)}`;
  }
  if (v.startsWith("9") && !v.startsWith("+")) {
    if (v.length <= 3) return v;
    if (v.length <= 6) return `${v.substring(0, 3)} ${v.substring(3)}`;
    return `${v.substring(0, 3)} ${v.substring(3, 6)} ${v.substring(6, 9)}`;
  }
  return value;
}

interface InputFieldProps {
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
  field: {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    name: string;
  };
  label: string;
  error?: string | null;
  formatValue?: (value: string) => string;
  helperText?: string;
  required?: boolean;
}

const InputField = ({
  type = "text",
  placeholder,
  icon,
  field,
  label,
  formatValue,
  error,
  helperText,
  required = false,
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!field.value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatValue ? formatValue(e.target.value) : e.target.value;
    field.onChange(value);
    setHasValue(!!value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    field.onBlur();
  };

  const handleBlur = () => {
    setIsFocused(false);
    field.onBlur();
  };

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <Typography
          as="label"
          variant="small"
          className="font-medium text-[color:var(--color-heading)] flex items-center gap-1"
        >
          {label}
          {required && (
            <span className="text-[color:var(--color-accent)]">*</span>
          )}
        </Typography>
        {hasValue && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
          </motion.div>
        )}
      </div>

      <div className="relative">
        <div
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${
            error
              ? "text-red-500"
              : isFocused
              ? "text-[color:var(--color-primary)]"
              : "text-[color:var(--color-body)]"
          }`}
        >
          {icon}
        </div>
        <input
          value={field.value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          name={field.name}
          type={type}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={`${field.name}-helper`}
          style={{
            WebkitBoxShadow: "0 0 0 30px var(--color-surface) inset",
            WebkitTextFillColor: "var(--color-text-primary)",
          }}
          className={`w-full pl-12 pr-4 py-4 rounded-xl bg-[color:var(--color-surface)] text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-body)]/50 transition-all duration-200 focus:outline-none autofill-input ${
            error
              ? "border-2 border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : isFocused
              ? "border-2 border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary)]/20"
              : "border border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]/50"
          }`}
        />

        {/* Indicador de estado animado */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {error ? (
          <motion.div
            id={`${field.name}-helper`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Typography
              as="p"
              variant="caption"
              className="mt-2 text-red-500 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-3 h-3" />
              {error}
            </Typography>
          </motion.div>
        ) : helperText ? (
          <motion.div
            id={`${field.name}-helper`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Typography
              as="p"
              variant="caption"
              className="mt-2 text-[color:var(--color-body)]"
            >
              {helperText}
            </Typography>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Step1_PersonalInfo() {
  const {
    control,
    formState: { isValid, isDirty },
  } = useFormContext<BookingData>();
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);

  return (
    <motion.div
      className="space-y-8 max-w-md mx-auto w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header mejorado con indicador de progreso */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-2">
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-accent)] rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>
        </div>

        <div className="space-y-2">
          <Typography
            as="h3"
            variant="h3"
            className="text-[color:var(--color-heading)] font-serif"
          >
            Información Personal
          </Typography>
          <Typography
            as="p"
            variant="small"
            className="text-[color:var(--color-body)] max-w-md mx-auto"
          >
            Comparte tus datos para que podamos crear la experiencia perfecta
            para ti
          </Typography>
        </div>
      </div>

      {/* Formulario con animaciones mejoradas */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <InputField
              placeholder="Ej: Marcela Cordero"
              icon={<User className="w-5 h-5" />}
              field={field}
              label="Nombre completo"
              error={fieldState.error?.message ?? null}
              helperText="Como aparece en tu documento de identidad"
              required
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <InputField
              type="tel"
              placeholder="+51 989 164 990"
              icon={<Phone className="w-5 h-5" />}
              field={field}
              label="Número de teléfono"
              formatValue={formatPhone}
              error={fieldState.error?.message ?? null}
              helperText="Te contactaremos por este número para confirmar tu cita"
              required
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <InputField
              type="email"
              placeholder="tu@email.com"
              icon={<Mail className="w-5 h-5" />}
              field={field}
              label="Correo electrónico"
              error={fieldState.error?.message ?? null}
              helperText="Enviaremos la confirmación y detalles de tu cita"
              required
            />
          )}
        />
      </motion.div>

      {/* Mensaje de confianza mejorado con toggle */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <button
          type="button"
          onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-[color:var(--color-surface)]/50 rounded-full border border-[color:var(--color-border)]/20 hover:bg-[color:var(--color-surface)] transition-colors"
        >
          <Lock className="w-4 h-4 text-[color:var(--color-primary)]" />
          <Typography
            as="span"
            variant="caption"
            className="text-[color:var(--color-body)] font-medium"
          >
            Tu información está segura con nosotros
          </Typography>
        </button>

        <AnimatePresence>
          {showPrivacyInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-4 bg-[color:var(--color-surface)]/50 rounded-xl border border-[color:var(--color-border)]/20 text-left"
            >
              <Typography
                as="p"
                variant="caption"
                className="text-[color:var(--color-body)]"
              >
                Tus datos personales son tratados con la máxima confidencialidad
                y solo se utilizan para gestionar tu cita. No compartimos tu
                información con terceros sin tu consentimiento explícito.
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Indicador de validación */}
      <AnimatePresence>
        {isValid && isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center gap-2 text-green-500"
          >
            <CheckCircle className="w-5 h-5" />
            <Typography as="span" variant="small" className="font-medium">
              Información verificada correctamente
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
