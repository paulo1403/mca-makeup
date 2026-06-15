"use client";

import { Home, MapPin } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import InputField from "@/components/booking/InputField";
import DistrictSelector from "@/components/DistrictSelector";
import type { BookingData } from "@/lib/bookingSchema";

export default function Section1_Location() {
  const { control, setValue } = useFormContext<BookingData>();
  const methods = useFormContext<BookingData>();
  const locationType = useWatch({ name: "locationType", control });
  const district = useWatch({ name: "district", control });

  return (
    <div className="space-y-4">
      <div className="flex rounded-xl border border-[color:var(--color-border)] overflow-hidden">
        <button
          type="button"
          onClick={() => setValue("locationType", "STUDIO", { shouldValidate: true })}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
            locationType === "STUDIO"
              ? "bg-[color:var(--color-primary)] text-white"
              : "bg-[color:var(--color-surface)]/60 text-[color:var(--color-body)] hover:bg-[color:var(--color-surface)]"
          }`}
        >
          <MapPin className="w-4 h-4" />
          Room Studio
        </button>
        <button
          type="button"
          onClick={() => setValue("locationType", "HOME", { shouldValidate: true })}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
            locationType === "HOME"
              ? "bg-[color:var(--color-primary)] text-white"
              : "bg-[color:var(--color-surface)]/60 text-[color:var(--color-body)] hover:bg-[color:var(--color-surface)]"
          }`}
        >
          <Home className="w-4 h-4" />A Domicilio
        </button>
      </div>

      {locationType === "STUDIO" && (
        <p className="text-xs text-[color:var(--color-body)]">
          Ubicado en Pueblo Libre, Av bolivar
        </p>
      )}

      {locationType === "HOME" && (
        <div className="space-y-4">
          <Controller
            name="district"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <label className="text-sm font-medium text-[color:var(--color-heading)] block mb-1.5">
                  Distrito
                </label>
                <DistrictSelector
                  value={(field.value as string) || ""}
                  onChange={(v: string) => {
                    field.onChange(v);
                    if (v) methods.clearErrors("district");
                  }}
                />
                {fieldState.error && (
                  <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                placeholder="Av., Jr., Calle + número"
                icon={<MapPin className="w-4 h-4" />}
                field={field}
                label="Dirección"
                error={fieldState.error?.message ?? null}
                required
              />
            )}
          />

          {!district && (
            <p className="text-xs text-[color:var(--color-body)]">
              Selecciona tu distrito para calcular el costo de transporte.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
