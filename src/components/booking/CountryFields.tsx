"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Phone } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import InputField from "@/components/booking/InputField";
import type { BookingData } from "@/lib/bookingSchema";

function formatDni(value: string) {
  return value.replace(/\D/g, "").slice(0, 8);
}

function formatPhonePE(value: string) {
  const v = value.replace(/[^\d+]/g, "");
  if (v.startsWith("+51")) {
    const digits = v.substring(3);
    if (digits.length <= 3) return `+51 ${digits}`;
    if (digits.length <= 6) return `+51 ${digits.substring(0, 3)} ${digits.substring(3)}`;
    return `+51 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 9)}`;
  }
  if (v.startsWith("9") && !v.startsWith("+")) {
    if (v.length <= 3) return v;
    if (v.length <= 6) return `${v.substring(0, 3)} ${v.substring(3)}`;
    return `${v.substring(0, 3)} ${v.substring(3, 6)} ${v.substring(6, 9)}`;
  }
  return value;
}

export default function CountryFields() {
  const { control, setValue } = useFormContext<BookingData>();
  const country = useWatch({ control, name: "country" });

  return (
    <div className="space-y-4">
      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <span className="text-sm font-medium text-[color:var(--color-heading)]">
              País
            </span>
            <div className="flex gap-2">
              {[
                { value: "PE" as const, label: "Perú" },
                { value: "OTHER" as const, label: "Otro" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    field.onChange(option.value);
                    if (option.value === "OTHER") {
                      setValue("documentNumber", "");
                    }
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    field.value === option.value
                      ? "bg-[color:var(--color-primary)] text-white shadow-md"
                      : "bg-[color:var(--color-surface)] text-[color:var(--color-body)] border border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]/50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      />

      <AnimatePresence>
        {country === "PE" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Controller
              name="documentNumber"
              control={control}
              render={({ field, fieldState }) => (
                <InputField
                  placeholder="12345678"
                  icon={<CreditCard className="w-5 h-5" />}
                  field={field}
                  label="DNI"
                  formatValue={formatDni}
                  error={fieldState.error?.message ?? null}
                  required
                />
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Controller
        name="phone"
        control={control}
        render={({ field, fieldState }) => (
          <InputField
            type="tel"
            placeholder={country === "PE" ? "+51 953 879 106" : "+XX XXX XXX XXXX"}
            icon={<Phone className="w-5 h-5" />}
            field={field}
            label="Número de teléfono"
            formatValue={country === "PE" ? formatPhonePE : undefined}
            error={fieldState.error?.message ?? null}
            required
          />
        )}
      />
    </div>
  );
}
