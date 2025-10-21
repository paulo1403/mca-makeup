"use client";
import React, { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  ShieldCheck,
  CreditCard,
  Copy,
  Check,
  FileText,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { BookingData } from "@/lib/bookingSchema";
import useServicesQuery from "@/hooks/useServicesQuery";
import { useBookingSummary } from "@/hooks/useBookingSummary";
import { useTransportCost } from "@/hooks/useTransportCost";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import { calculateNightShiftCost } from "@/utils/nightShift";

const translations = {
  title: "Confirmación y Pago",
  subtitle: "Revisa tu solicitud y sigue la guía de pago",
  costSummary: "Resumen de costos",
  services: "Servicios",
  transport: "Transporte",
  totalCost: "Total",
  depositRequired: "Depósito",
  nightShift: "Horario nocturno",
  confirmationProcess: "Proceso de Pago",
  copyPlin: "Copiar",
  copied: "Copiado",
  additionalNotes: "Notas (Opcional)",
  notesPlaceholder: "Cuéntame sobre tu evento...",
  acceptTerms: "Acepto los términos",
  requiredToSend: "Requerido",
  step1: "Envía tu solicitud",
  step2: "Te contactaré para confirmar",
  step3: "Deposita S/ 150 por PLIN",
  step4: "Paga el resto el día de la cita",
  importantInfo: "Importante",
  depositInfo: "El depósito confirma tu reserva",
};

const useTranslations = () => {
  return {
    t: (key: string, fallback?: string) => {
      const value = translations[key as keyof typeof translations];
      return value || fallback || key;
    },
  };
};

export default function Step5_Confirmation() {
  const { control, watch } = useFormContext<BookingData>();
  const [copied, setCopied] = useState(false);
  const deposit = 150;
  const plinNumber = "+51999209880";
  const { t } = useTranslations();

  // Pricing breakdown
  const { data: services = [] } = useServicesQuery();
  const selected = watch("selectedServices") || [];
  const transportEnabled = (watch("locationType") || "STUDIO") === "HOME";
  const district = watch("district") || "";
  const { transportCost, getTransportCost } = useTransportCost();

  useEffect(() => {
    if (transportEnabled && district) {
      getTransportCost(district);
    }
  }, [transportEnabled, district, getTransportCost]);

  const timeSlot = watch("timeSlot") || "";
  const nightShiftCost = timeSlot ? calculateNightShiftCost(timeSlot) : 0;

  const { subtotal, transport, nightShift, total } = useBookingSummary(
    selected,
    services,
    transportEnabled,
    transportCost?.cost,
    nightShiftCost
  );

  const handleCopyPlin = async () => {
    try {
      await navigator.clipboard.writeText(plinNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error al copiar:", error);
    }
  };

  return (
    <div className="w-full space-y-5 px-2">
      {/* Encabezado compacto */}
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-accent)] rounded-full flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="space-y-1">
          <Typography
            as="h2"
            variant="h2"
            className="text-[color:var(--color-heading)] font-serif !text-base sm:!text-lg"
          >
            {t("title")}
          </Typography>
          <Typography
            as="p"
            variant="p"
            className="text-[color:var(--color-body)] text-xs sm:text-sm leading-tight"
          >
            {t("subtitle")}
          </Typography>
        </div>
      </motion.div>

      {/* Desglose de Precios - Compacto */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="p-3 sm:p-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
      >
        <Typography
          as="h4"
          variant="h4"
          className="text-[color:var(--color-heading)] font-medium mb-3 text-sm"
        >
          {t("costSummary")}
        </Typography>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Typography
              as="span"
              variant="small"
              className="text-[color:var(--color-body)] text-xs"
            >
              {t("services")}
            </Typography>
            <Typography
              as="span"
              variant="small"
              className="text-[color:var(--color-heading)] font-medium text-xs"
            >
              S/ {subtotal || 0}
            </Typography>
          </div>

          <div className="flex justify-between items-center">
            <Typography
              as="span"
              variant="small"
              className="text-[color:var(--color-body)] text-xs"
            >
              {t("transport")}
            </Typography>
            <Typography
              as="span"
              variant="small"
              className="text-[color:var(--color-heading)] font-medium text-xs"
            >
              S/ {transport || 0}
            </Typography>
          </div>

          {nightShift > 0 && (
            <div className="flex justify-between items-center">
              <Typography
                as="span"
                variant="small"
                className="text-[color:var(--color-body)] text-xs"
              >
                {t("nightShift")}
              </Typography>
              <Typography
                as="span"
                variant="small"
                className="text-[color:var(--color-heading)] font-medium text-xs"
              >
                S/ {nightShift}
              </Typography>
            </div>
          )}

          <div className="border-t border-[color:var(--color-border)]/20 pt-2 mt-2">
            <div className="flex justify-between items-end gap-2">
              <div>
                <Typography
                  as="span"
                  variant="small"
                  className="text-[color:var(--color-body)] text-xs"
                >
                  {t("totalCost")}
                </Typography>
                <Typography
                  as="span"
                  variant="h3"
                  className="!text-lg sm:!text-xl font-bold text-[color:var(--color-primary)]"
                >
                  S/ {total || 0}
                </Typography>
              </div>

              <div className="text-right">
                <Typography
                  as="span"
                  variant="small"
                  className="text-[color:var(--color-body)] text-xs"
                >
                  {t("depositRequired")}
                </Typography>
                <Typography
                  as="span"
                  variant="h3"
                  className="!text-base sm:!text-lg font-bold text-[color:var(--color-accent)]"
                >
                  S/ {deposit}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Proceso de Pago - Optimizado */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="p-3 sm:p-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-[color:var(--color-primary)]/20 flex items-center justify-center">
            <CreditCard className="w-3 h-3 text-[color:var(--color-primary)]" />
          </div>
          <Typography
            as="h4"
            variant="h4"
            className="text-[color:var(--color-heading)] font-medium text-sm"
          >
            {t("confirmationProcess")}
          </Typography>
        </div>

        <div className="space-y-3">
          {/* PLIN Number */}
          <div className="bg-[color:var(--color-surface-secondary)] border border-[color:var(--color-border)] rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Typography
                  as="span"
                  variant="small"
                  className="text-[color:var(--color-body)] text-xs"
                >
                  PLIN:
                </Typography>
                <code className="text-sm font-mono text-[color:var(--color-heading)]">
                  {plinNumber}
                </code>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyPlin}
                className="px-3 py-2 text-xs rounded-lg min-w-[80px]"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-green-500">{t("copied")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{t("copyPlin")}</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Pasos */}
          <div className="space-y-2">
            <ol className="space-y-2 text-xs text-[color:var(--color-body)] list-decimal list-inside">
              <li>{t("step1")}</li>
              <li>{t("step2")}</li>
              <li>{t("step3")}</li>
              <li>{t("step4")}</li>
            </ol>
          </div>
        </div>
      </motion.div>

      {/* Campo de notas - Compacto */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Controller
          name="additionalNotes"
          control={control}
          render={({ field }) => (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-[color:var(--color-primary)]" />
                <Typography
                  as="label"
                  variant="small"
                  className="font-medium text-[color:var(--color-heading)] text-sm"
                >
                  {t("additionalNotes")}
                </Typography>
              </div>
              <textarea
                {...field}
                placeholder={t("notesPlaceholder")}
                rows={3}
                className="w-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg px-3 py-2.5 placeholder:text-[color:var(--color-body)]/50 text-[color:var(--color-text-primary)] outline-none transition-all duration-200 focus:border-[color:var(--color-primary)] text-sm resize-none"
              />
            </div>
          )}
        />
      </motion.div>

      {/* Aceptación de términos - Optimizado */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Controller
          name="agreedToTerms"
          control={control}
          render={({ field }) => (
            <label className="flex items-start gap-3 p-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
              <div className="flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={Boolean(field.value)}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="w-5 h-5 text-[color:var(--color-primary)] border-[color:var(--color-border)] rounded focus:ring-[color:var(--color-primary)]"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Typography
                  as="span"
                  variant="small"
                  className="text-[color:var(--color-body)] text-xs"
                >
                  {t("acceptTerms")}{" "}
                  <a
                    href="/terminos-condiciones"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[color:var(--color-primary)] underline hover:opacity-80"
                  >
                    términos
                  </a>
                </Typography>
                <AnimatePresence>
                  {!field.value && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="mt-1"
                    >
                      <Typography
                        as="span"
                        variant="caption"
                        className="!text-red-500 text-xs"
                      >
                        {t("requiredToSend")}
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </label>
          )}
        />
      </motion.div>

      {/* Información importante - Compacta */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="p-3 bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)]"
      >
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[color:var(--color-primary)]/20 flex items-center justify-center mt-0.5">
            <Sparkles className="w-2.5 h-2.5 text-[color:var(--color-primary)]" />
          </div>
          <div className="flex-1">
            <Typography
              as="h4"
              variant="h4"
              className="text-[color:var(--color-heading)] mb-1 text-xs font-medium"
            >
              {t("importantInfo")}
            </Typography>
            <Typography
              as="p"
              variant="p"
              className="text-[color:var(--color-body)] text-xs leading-relaxed"
            >
              {t("depositInfo")}
            </Typography>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
