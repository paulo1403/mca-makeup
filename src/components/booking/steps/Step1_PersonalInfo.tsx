"use client";
import { Lock, Mail, User } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import CountryFields from "@/components/booking/CountryFields";
import InputField from "@/components/booking/InputField";
import Typography from "@/components/ui/Typography";
import type { BookingData } from "@/lib/bookingSchema";

export default function Step1_PersonalInfo() {
  const { control } = useFormContext<BookingData>();

  return (
    <div className="space-y-6 max-w-md mx-auto w-full">
      <div className="text-center mb-6">
        <Typography
          as="h3"
          variant="h3"
          className="font-bold text-[color:var(--color-heading)] mb-2"
        >
          Información Personal
        </Typography>
        <Typography as="p" variant="small" className="text-[color:var(--color-body)]">
          Comparte tus datos para la cita
        </Typography>
      </div>

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

        <CountryFields />

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

      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[color:var(--color-surface)]/40 rounded-[12px]">
          <Lock className="w-4 h-4 text-[color:var(--color-primary)]" />
          <Typography as="span" variant="small" className="text-[color:var(--color-body)]">
            Tu información está segura
          </Typography>
        </div>
      </div>
    </div>
  );
}
