"use client";
import DistrictSelector from "@/components/DistrictSelector";
import InputField from "@/components/booking/InputField";
import Typography from "@/components/ui/Typography";
import { useTransportCost } from "@/hooks/useTransportCost";
import type { BookingData } from "@/lib/bookingSchema";
import { AnimatePresence, motion } from "framer-motion";
import { Check, FileText, Home, MapPin, Sparkles } from "lucide-react";
import React, { useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

// Diccionario de traducciones
const translations = {
  title: "¿Dónde te atiendo?",
  subtitle: "Elige una opción y completa tus datos",
  studio: "Room Studio",
  studioDescription: "Sin costo adicional",
  home: "A Domicilio",
  homeDescription: "Costo por distrito",
  homeServiceDetails: "Datos para el servicio",
  district: "Distrito",
  address: "Dirección",
  addressPlaceholder: "Av., Jr., Calle + número",
  reference: "Referencia",
  referencePlaceholder: "Ej: frente al parque...",
  calculatingCost: "Calculando...",
  transportCost: "Transporte a",
  infoTitle: "Importante",
  infoMessage: "Llega 15 min antes para preparar el espacio",
};

const useTranslations = () => {
  return {
    t: (key: string, fallback?: string) => {
      const value = translations[key as keyof typeof translations];
      return value || fallback || key;
    },
  };
};

export default function Step3_Location() {
  const { control, setValue } = useFormContext<BookingData>();
  const locationType = useWatch({ name: "locationType", control });
  const district = useWatch({ name: "district", control });
  const { transportCost, loading, error, getTransportCost } = useTransportCost();
  const { t } = useTranslations();

  useEffect(() => {
    if (district) {
      getTransportCost(String(district));
    }
  }, [district, getTransportCost]);

  return (
    <div className="w-full max-w-md mx-auto space-y-4 overflow-hidden">
      {/* Encabezado compacto */}
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-accent)] rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin className="w-6 h-6 text-white flex-shrink-0" />
          </div>
        </div>

        <div className="space-y-1">
          <Typography
            as="h2"
            variant="h2"
            className="text-[color:var(--color-heading)] font-serif text-lg truncate"
          >
            {t("title")}
          </Typography>
          <Typography
            as="p"
            variant="p"
            className="text-[color:var(--color-body)] text-sm line-clamp-2"
          >
            {t("subtitle")}
          </Typography>
        </div>
      </motion.div>

      {/* Opciones de ubicación - Rediseñadas desde cero */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex flex-col gap-2">
          {/* Opción Studio */}
          <button
            type="button"
            onClick={() => setValue("locationType", "STUDIO")}
            className={`w-full p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
              locationType === "STUDIO"
                ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5"
                : "border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                locationType === "STUDIO"
                  ? "bg-[color:var(--color-primary)]"
                  : "bg-[color:var(--color-surface-secondary)]"
              }`}
            >
              <MapPin
                className={`w-5 h-5 flex-shrink-0 ${
                  locationType === "STUDIO" ? "text-white" : "text-[color:var(--color-primary)]"
                }`}
              />
            </div>

            <div className="flex-1 text-left">
              <Typography
                as="h4"
                variant="h4"
                className={`font-medium text-sm ${
                  locationType === "STUDIO"
                    ? "text-[color:var(--color-primary)]"
                    : "text-[color:var(--color-heading)]"
                }`}
              >
                {t("studio")}
              </Typography>
              <Typography as="p" variant="p" className="text-xs text-[color:var(--color-body)]">
                {t("studioDescription")}
              </Typography>
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                locationType === "STUDIO"
                  ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)]"
                  : "border-[color:var(--color-border)]"
              }`}
            >
              {locationType === "STUDIO" && <Check className="w-3 h-3 text-white" />}
            </div>
          </button>

          {/* Opción Domicilio */}
          <button
            type="button"
            onClick={() => setValue("locationType", "HOME")}
            className={`w-full p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
              locationType === "HOME"
                ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5"
                : "border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                locationType === "HOME"
                  ? "bg-[color:var(--color-primary)]"
                  : "bg-[color:var(--color-surface-secondary)]"
              }`}
            >
              <Home
                className={`w-5 h-5 flex-shrink-0 ${
                  locationType === "HOME" ? "text-white" : "text-[color:var(--color-accent)]"
                }`}
              />
            </div>

            <div className="flex-1 text-left">
              <Typography
                as="h4"
                variant="h4"
                className={`font-medium text-sm ${
                  locationType === "HOME"
                    ? "text-[color:var(--color-primary)]"
                    : "text-[color:var(--color-heading)]"
                }`}
              >
                {t("home")}
              </Typography>
              <Typography as="p" variant="p" className="text-xs text-[color:var(--color-body)]">
                {t("homeDescription")}
              </Typography>
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                locationType === "HOME"
                  ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)]"
                  : "border-[color:var(--color-border)]"
              }`}
            >
              {locationType === "HOME" && <Check className="w-3 h-3 text-white" />}
            </div>
          </button>
        </div>
      </motion.div>

      {/* Bloque dinámico para Servicio a Domicilio */}
      <AnimatePresence>
        {locationType === "HOME" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full overflow-hidden"
          >
            <div className="w-full space-y-3 p-3 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] overflow-hidden">
              {/* Header del formulario */}
              <div className="flex items-center gap-2 pb-2 border-b border-[color:var(--color-border)]/20">
                <div className="w-7 h-7 rounded-full bg-[color:var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                  <Home className="w-3.5 h-3.5 text-[color:var(--color-primary)] flex-shrink-0" />
                </div>
                <Typography
                  as="h4"
                  variant="h4"
                  className="text-[color:var(--color-heading)] font-medium text-sm truncate"
                >
                  {t("homeServiceDetails")}
                </Typography>
              </div>

              {/* Selector de distrito */}
              <div className="w-full">
                <Typography
                  as="label"
                  variant="small"
                  className="block font-medium text-[color:var(--color-heading)] mb-2 text-sm"
                >
                  {t("district")}
                </Typography>
                <Controller
                  name="district"
                  control={control}
                  render={({ field }) => (
                    <div className="w-full">
                      <DistrictSelector
                        value={(field.value as string) || ""}
                        onChange={(v: string) => {
                          console.log("District changed to:", v);
                          field.onChange(v);
                        }}
                      />

                      {/* Indicador de costo de transporte - simplificado */}
                      <div className="mt-2 w-full" aria-live="polite">
                        {loading && (
                          <div className="flex items-center gap-2 text-xs text-[color:var(--color-body)]">
                            <div className="w-3 h-3 border-2 border-[color:var(--color-primary)]/30 border-t-[color:var(--color-primary)] rounded-full animate-spin flex-shrink-0" />
                            <span className="truncate">{t("calculatingCost")}</span>
                          </div>
                        )}
                        {!loading && error && (
                          <Typography
                            as="p"
                            variant="small"
                            className="text-red-500 text-xs truncate"
                          >
                            {error}
                          </Typography>
                        )}
                        {!loading && !error && transportCost && (
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[color:var(--color-surface)] border border-[color:var(--color-border)] w-full overflow-hidden">
                            <span className="text-xs text-[color:var(--color-body)] truncate">
                              {t("transportCost")}
                            </span>
                            <span className="text-xs font-medium text-[color:var(--color-heading)] truncate">
                              {transportCost.district}
                            </span>
                            <span className="text-xs font-semibold text-[color:var(--color-accent)] flex-shrink-0">
                              S/ {transportCost.cost.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                />
              </div>

              {/* Campo de dirección */}
              <div className="w-full">
                <Controller
                  name="address"
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputField
                      placeholder={t("addressPlaceholder")}
                      icon={<MapPin className="w-4 h-4" />}
                      field={field}
                      label={t("address")}
                      error={fieldState.error?.message ?? null}
                      required
                    />
                  )}
                />
              </div>

              {/* Campo de referencia */}
              <div className="w-full">
                <Controller
                  name="addressReference"
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputField
                      placeholder={t("referencePlaceholder")}
                      icon={<FileText className="w-4 h-4" />}
                      field={field}
                      label={t("reference")}
                      error={fieldState.error?.message ?? null}
                    />
                  )}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Información importante - compacta y contenida */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="w-full p-3 bg-[color:var(--color-surface)] rounded-lg border border-[color:var(--color-border)] overflow-hidden"
      >
        <div className="flex items-start gap-2 w-full">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[color:var(--color-primary)]/20 flex items-center justify-center mt-0.5">
            <Sparkles className="w-2.5 h-2.5 text-[color:var(--color-primary)] flex-shrink-0" />
          </div>
          <div className="flex-1 min-w-0">
            <Typography
              as="h4"
              variant="h4"
              className="text-[color:var(--color-heading)] mb-1 text-xs font-medium truncate"
            >
              {t("infoTitle")}
            </Typography>
            <Typography
              as="p"
              variant="p"
              className="text-[color:var(--color-body)] text-xs leading-relaxed line-clamp-2"
            >
              {t("infoMessage")}
            </Typography>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
