"use client";
import React from "react";
import {
  ShieldCheck,
  PartyPopper,
  Sparkles,
  X,
  Calendar,
  MapPin,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Typography from "../ui/Typography";
import Button from "../ui/Button";

type SuccessModalProps = {
  open: boolean;
  onClose: () => void;
  clientName?: string;
  pricing?: {
    servicePrice?: number;
    transportCost?: number;
    nightShiftCost?: number;
    totalPrice?: number;
  };
};

// Diccionario de traducciones
const translations = {
  title: "¡Reserva enviada!",
  message: "Tu solicitud fue enviada correctamente",
  followUp:
    "Te contactaré dentro de 24 horas para confirmar y coordinar el depósito",
  thanks: "¡Gracias por confiar en mi trabajo!",
  quickSummary: "Resumen rápido",
  services: "Servicios",
  transport: "Transporte",
  nightShift: "Nocturno",
  total: "Total",
  closeButton: "Cerrar",
  viewTerms: "Ver términos",
  appointmentConfirmed: "Cita confirmada",
  nextSteps: "Próximos pasos",
  step1: "Recibirás un mensaje de confirmación",
  step2: "Realiza el depósito de S/ 150",
  step3: "El resto se paga el día de la cita",
};

const useTranslations = () => {
  return {
    t: (key: string, fallback?: string) => {
      const value = translations[key as keyof typeof translations];
      return value || fallback || key;
    },
  };
};

export default function SuccessModal({
  open,
  onClose,
  clientName,
  pricing,
}: SuccessModalProps) {
  const { t } = useTranslations();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header con gradiente */}
            <div className="relative p-6 bg-gradient-to-r from-[color:var(--color-primary)]/10 to-[color:var(--color-accent)]/10">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[color:var(--color-surface)]/80 border border-[color:var(--color-border)]/50 flex items-center justify-center hover:bg-[color:var(--color-surface)] transition-colors"
              >
                <X className="w-4 h-4 text-[color:var(--color-heading)]" />
              </button>

              <div className="flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-accent)] flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                  }}
                >
                  <ShieldCheck className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <Typography
                    as="h3"
                    variant="h3"
                    className="text-[color:var(--color-heading)] font-serif text-xl"
                  >
                    {t("title")}
                  </Typography>
                  <div className="flex items-center gap-2 mt-1">
                    <PartyPopper className="w-4 h-4 text-[color:var(--color-accent)]" />
                    <Typography
                      as="p"
                      variant="p"
                      className="text-[color:var(--color-accent)] text-sm"
                    >
                      {t("thanks")}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6">
              {/* Mensaje principal */}
              <div className="text-center space-y-2">
                <Typography
                  as="p"
                  variant="p"
                  className="text-[color:var(--color-body)]"
                >
                  {t("message")}
                  {clientName && (
                    <span className="font-medium text-[color:var(--color-heading)]">
                      {" "}
                      {clientName}
                    </span>
                  )}
                </Typography>
                <Typography
                  as="p"
                  variant="p"
                  className="text-[color:var(--color-body)] text-sm"
                >
                  {t("followUp")}
                </Typography>
              </div>

              {/* Resumen de precios */}
              {pricing && typeof pricing.totalPrice === "number" && (
                <motion.div
                  className="p-4 rounded-xl bg-[color:var(--color-primary)]/5 border border-[color:var(--color-primary)]/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[color:var(--color-primary)]" />
                    <Typography
                      as="h4"
                      variant="h4"
                      className="text-[color:var(--color-heading)] font-medium text-sm"
                    >
                      {t("quickSummary")}
                    </Typography>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[color:var(--color-body)]/50" />
                        <Typography
                          as="span"
                          variant="small"
                          className="text-[color:var(--color-body)] text-xs"
                        >
                          {t("services")}
                        </Typography>
                      </div>
                      <Typography
                        as="span"
                        variant="small"
                        className="text-[color:var(--color-heading)] font-medium text-xs"
                      >
                        S/ {Number(pricing.servicePrice || 0).toFixed(2)}
                      </Typography>
                    </div>

                    {pricing.transportCost ? (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[color:var(--color-body)]/50" />
                          <Typography
                            as="span"
                            variant="small"
                            className="text-[color:var(--color-body)] text-xs"
                          >
                            {t("transport")}
                          </Typography>
                        </div>
                        <Typography
                          as="span"
                          variant="small"
                          className="text-[color:var(--color-heading)] font-medium text-xs"
                        >
                          S/ {Number(pricing.transportCost || 0).toFixed(2)}
                        </Typography>
                      </div>
                    ) : null}

                    {pricing.nightShiftCost ? (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[color:var(--color-body)]/50" />
                          <Typography
                            as="span"
                            variant="small"
                            className="text-[color:var(--color-body)] text-xs"
                          >
                            {t("nightShift")}
                          </Typography>
                        </div>
                        <Typography
                          as="span"
                          variant="small"
                          className="text-[color:var(--color-heading)] font-medium text-xs"
                        >
                          S/ {Number(pricing.nightShiftCost || 0).toFixed(2)}
                        </Typography>
                      </div>
                    ) : null}

                    <div className="border-t border-[color:var(--color-border)]/20 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <Typography
                          as="span"
                          variant="small"
                          className="text-[color:var(--color-heading)] font-medium"
                        >
                          {t("total")}
                        </Typography>
                        <Typography
                          as="span"
                          variant="h3"
                          className="text-[color:var(--color-primary)] font-bold text-lg"
                        >
                          S/ {Number(pricing.totalPrice || 0).toFixed(2)}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Próximos pasos */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[color:var(--color-primary)]/20 flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-[color:var(--color-primary)]" />
                  </div>
                  <Typography
                    as="h4"
                    variant="h4"
                    className="text-[color:var(--color-heading)] font-medium text-sm"
                  >
                    {t("nextSteps")}
                  </Typography>
                </div>

                <div className="space-y-2 ml-8">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[color:var(--color-primary)] font-bold text-xs">
                        1
                      </span>
                    </div>
                    <Typography
                      as="p"
                      variant="p"
                      className="text-[color:var(--color-body)] text-xs"
                    >
                      {t("step1")}
                    </Typography>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[color:var(--color-primary)] font-bold text-xs">
                        2
                      </span>
                    </div>
                    <Typography
                      as="p"
                      variant="p"
                      className="text-[color:var(--color-body)] text-xs"
                    >
                      {t("step2")}
                    </Typography>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[color:var(--color-primary)] font-bold text-xs">
                        3
                      </span>
                    </div>
                    <Typography
                      as="p"
                      variant="p"
                      className="text-[color:var(--color-body)] text-xs"
                    >
                      {t("step3")}
                    </Typography>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[color:var(--color-border)]/20">
              <Button
                variant="ghost"
                size="lg"
                onClick={onClose}
                className="flex-1"
              >
                {t("closeButton")}
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.open("/terminos-condiciones", "_blank")}
                className="flex-1"
              >
                {t("viewTerms")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
