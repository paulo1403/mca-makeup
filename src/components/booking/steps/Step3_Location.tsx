"use client";
import DistrictSelector from "@/components/DistrictSelector";
import InputField from "@/components/booking/InputField";
import Typography from "@/components/ui/Typography";
import { useTransportCost } from "@/hooks/useTransportCost";
import type { BookingData } from "@/lib/bookingSchema";
import { Check, FileText, Home, MapPin } from "lucide-react";
import React, { useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

export default function Step3_Location() {
  const { control, setValue } = useFormContext<BookingData>();
  const locationType = useWatch({ name: "locationType", control });
  const district = useWatch({ name: "district", control });
  const { transportCost, loading, error, getTransportCost } =
    useTransportCost();

  useEffect(() => {
    if (district) {
      getTransportCost(String(district));
    }
  }, [district, getTransportCost]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <Typography
          as="h3"
          variant="h3"
          className="font-bold text-[color:var(--color-heading)] mb-2"
        >
          ¿Dónde te atiendo?
        </Typography>
        <Typography
          as="p"
          variant="small"
          className="text-[color:var(--color-body)]"
        >
          Elige una opción
        </Typography>
      </div>

      {/* Opciones de ubicación */}
      <div className="flex flex-col gap-3">
        {/* Opción Studio */}
        <button
          type="button"
          onClick={() => setValue("locationType", "STUDIO")}
          className={`p-4 rounded-[12px] border-2 transition-colors flex items-center gap-3 ${
            locationType === "STUDIO"
              ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5"
              : "border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${
              locationType === "STUDIO"
                ? "bg-[color:var(--color-primary)]"
                : "bg-[color:var(--color-surface)]"
            }`}
          >
            <MapPin
              className={`w-5 h-5 ${
                locationType === "STUDIO"
                  ? "text-white"
                  : "text-[color:var(--color-primary)]"
              }`}
            />
          </div>

          <div className="flex-1 text-left">
            <Typography
              as="h4"
              variant="h4"
              className={`font-medium ${
                locationType === "STUDIO"
                  ? "text-[color:var(--color-primary)]"
                  : "text-[color:var(--color-heading)]"
              }`}
            >
              Room Studio
            </Typography>
            <Typography
              as="p"
              variant="small"
              className="text-[color:var(--color-body)]"
            >
              Sin costo adicional
            </Typography>
          </div>

          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              locationType === "STUDIO"
                ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)]"
                : "border-[color:var(--color-border)]"
            }`}
          >
            {locationType === "STUDIO" && (
              <Check className="w-3 h-3 text-white" />
            )}
          </div>
        </button>

        {/* Opción Domicilio */}
        <button
          type="button"
          onClick={() => setValue("locationType", "HOME")}
          className={`p-4 rounded-[12px] border-2 transition-colors flex items-center gap-3 ${
            locationType === "HOME"
              ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5"
              : "border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${
              locationType === "HOME"
                ? "bg-[color:var(--color-primary)]"
                : "bg-[color:var(--color-surface)]"
            }`}
          >
            <Home
              className={`w-5 h-5 ${
                locationType === "HOME"
                  ? "text-white"
                  : "text-[color:var(--color-primary)]"
              }`}
            />
          </div>

          <div className="flex-1 text-left">
            <Typography
              as="h4"
              variant="h4"
              className={`font-medium ${
                locationType === "HOME"
                  ? "text-[color:var(--color-primary)]"
                  : "text-[color:var(--color-heading)]"
              }`}
            >
              A Domicilio
            </Typography>
            <Typography
              as="p"
              variant="small"
              className="text-[color:var(--color-body)]"
            >
              Costo por distrito
            </Typography>
          </div>

          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              locationType === "HOME"
                ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)]"
                : "border-[color:var(--color-border)]"
            }`}
          >
            {locationType === "HOME" && (
              <Check className="w-3 h-3 text-white" />
            )}
          </div>
        </button>
      </div>

      {/* Formulario para servicio a domicilio */}
      {locationType === "HOME" && (
        <div className="space-y-4 p-4 rounded-[12px] bg-[color:var(--color-surface)]/40">
          <Typography
            as="h4"
            variant="h4"
            className="text-[color:var(--color-heading)] font-medium"
          >
            Datos para el servicio
          </Typography>

          {/* Selector de distrito */}
          <div>
            <Typography
              as="label"
              variant="small"
              className="block font-medium text-[color:var(--color-heading)] mb-2"
            >
              Distrito
            </Typography>
            <Controller
              name="district"
              control={control}
              render={({ field }) => (
                <div>
                  <DistrictSelector
                    value={(field.value as string) || ""}
                    onChange={(v: string) => {
                      console.log("District changed to:", v);
                      field.onChange(v);
                    }}
                  />

                  {/* Indicador de costo */}
                  {loading && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-[color:var(--color-body)]">
                      <div className="w-3 h-3 border-2 border-[color:var(--color-primary)]/30 border-t-[color:var(--color-primary)] rounded-full animate-spin" />
                      <span>Calculando...</span>
                    </div>
                  )}
                  {!loading && error && (
                    <Typography
                      as="p"
                      variant="small"
                      className="mt-2 text-red-500"
                    >
                      {error}
                    </Typography>
                  )}
                  {!loading && !error && transportCost && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-[color:var(--color-surface)]">
                      <span className="text-sm text-[color:var(--color-body)]">
                        Transporte a {transportCost.district}:
                      </span>
                      <span className="text-sm font-semibold text-[color:var(--color-primary)]">
                        S/ {transportCost.cost.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            />
          </div>

          {/* Campo de dirección */}
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

          {/* Campo de referencia */}
          <Controller
            name="addressReference"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                placeholder="Ej: frente al parque..."
                icon={<FileText className="w-4 h-4" />}
                field={field}
                label="Referencia"
                error={fieldState.error?.message ?? null}
              />
            )}
          />
        </div>
      )}
    </div>
  );
}
