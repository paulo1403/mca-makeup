"use client";
import InputField from "@/components/booking/InputField";
import Typography from "@/components/ui/Typography";
import type { BookingData } from "@/lib/bookingSchema";
import { Lock, Mail, Phone, User } from "lucide-react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

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

export default function Step1_PersonalInfo() {
  const { control } = useFormContext<BookingData>();

  return (
    <div className="space-y-6 max-w-md mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <Typography
          as="h3"
          variant="h3"
          className="font-bold text-[color:var(--color-heading)] mb-2"
        >
          Información Personal
        </Typography>
        <Typography
          as="p"
          variant="small"
          className="text-[color:var(--color-body)]"
        >
          Comparte tus datos para la cita
        </Typography>
      </div>

      {/* Formulario */}
      <div className="space-y-4">
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
              required
            />
          )}
        />
      </div>

      {/* Mensaje de confianza */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[color:var(--color-surface)]/40 rounded-[12px]">
          <Lock className="w-4 h-4 text-[color:var(--color-primary)]" />
          <Typography
            as="span"
            variant="small"
            className="text-[color:var(--color-body)]"
          >
            Tu información está segura
          </Typography>
        </div>
      </div>
    </div>
  );
}
