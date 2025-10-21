"use client";

import React from "react";
import { ShieldCheck, PartyPopper, Sparkles, Calendar, MapPin, CreditCard } from "lucide-react";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import Modal, { ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";

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
  serviceNames?: string[];
};

// Diccionario de traducciones
const translations = {
  title: "¡Reserva enviada!",
  message: "Tu solicitud fue enviada correctamente",
  followUp: "Envía la captura del adelanto por WhatsApp para confirmar tu reserva",
  thanks: "¡Gracias por confiar en mi trabajo!",
  quickSummary: "Resumen rápido",
  services: "Servicio agendado",
  transport: "Transporte",
  nightShift: "Nocturno",
  total: "Total",
  closeButton: "Cerrar",
  viewTerms: "Ver términos",
  appointmentConfirmed: "Cita confirmada",
  nextSteps: "Próximos pasos",
  step1: "Enviar la captura del adelanto al WhatsApp (989164990)",
  step2: "Espera la confirmación de tu reserva",
  step3: "El restante lo cancelas el día de la cita",
};

const useTranslations = () => {
  return {
    t: (key: string, fallback?: string) => {
      const value = translations[key as keyof typeof translations];
      return value || fallback || key;
    },
  };
};

export default function SuccessModal({ open, onClose, clientName, pricing, serviceNames }: SuccessModalProps) {
  const { t } = useTranslations();

  return (
    <Modal open={open} onClose={onClose} size="md" ariaLabelledBy="success-modal-title">
      <ModalHeader
        title={
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-accent)] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <Typography as="h3" variant="h3" className="text-[color:var(--color-heading)] font-serif text-xl">
                {t("title")}
              </Typography>
              <div className="flex items-center gap-2 mt-1">
                <PartyPopper className="w-4 h-4 text-[color:var(--color-accent)]" />
                <Typography as="p" variant="p" className="text-[color:var(--color-accent)] text-sm">
                  {t("thanks")}
                </Typography>
              </div>
            </div>
          </div>
        }
        onClose={onClose}
      />

      <ModalBody>
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <Typography as="p" variant="p" className="text-[color:var(--color-body)]">
              {t("message")}
              {clientName && (
                <span className="font-medium text-[color:var(--color-heading)]"> {clientName}</span>
              )}
            </Typography>
            <Typography as="p" variant="p" className="text-[color:var(--color-body)] text-sm">
              {t("followUp")}
            </Typography>
          </div>

          {pricing && typeof pricing.totalPrice === "number" && (
            <div className="p-4 rounded-xl bg-[color:var(--color-primary)]/5 border border-[color:var(--color-primary)]/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[color:var(--color-primary)]" />
                <Typography as="h4" variant="h4" className="text-[color:var(--color-heading)] font-medium text-sm">
                  {t("quickSummary")}
                </Typography>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[color:var(--color-body)]/50" />
                    <Typography as="span" variant="small" className="text-[color:var(--color-body)] text-xs">
                      {t("services")}
                    </Typography>
                  </div>
                  <div className="text-left md:text-right">
                    <Typography
                      as="span"
                      variant="small"
                      className="text-[color:var(--color-heading)] font-medium text-xs break-words whitespace-pre-wrap"
                      title={(serviceNames || []).join(", ")}
                    >
                      {(serviceNames && serviceNames.length > 0)
                        ? serviceNames.join(", ")
                        : `S/ ${Number(pricing.servicePrice || 0).toFixed(2)}`}
                    </Typography>
                  </div>
                </div>

                {pricing.transportCost ? (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[color:var(--color-body)]/50" />
                      <Typography as="span" variant="small" className="text-[color:var(--color-body)] text-xs">
                        {t("transport")}
                      </Typography>
                    </div>
                    <Typography as="span" variant="small" className="text-[color:var(--color-heading)] font-medium text-xs">
                      S/ {Number(pricing.transportCost || 0).toFixed(2)}
                    </Typography>
                  </div>
                ) : null}

                {pricing.nightShiftCost ? (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[color:var(--color-body)]/50" />
                      <Typography as="span" variant="small" className="text-[color:var(--color-body)] text-xs">
                        {t("nightShift")}
                      </Typography>
                    </div>
                    <Typography as="span" variant="small" className="text-[color:var(--color-heading)] font-medium text-xs">
                      S/ {Number(pricing.nightShiftCost || 0).toFixed(2)}
                    </Typography>
                  </div>
                ) : null}

                <div className="border-t border-[color:var(--color-border)]/20 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <Typography as="span" variant="small" className="text-[color:var(--color-heading)] font-medium">
                      {t("total")}
                    </Typography>
                    <Typography as="span" variant="h3" className="text-[color:var(--color-primary)] font-bold text-lg">
                      S/ {Number(pricing.totalPrice || 0).toFixed(2)}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[color:var(--color-primary)]/20 flex items-center justify-center">
                <Calendar className="w-3 h-3 text-[color:var(--color-primary)]" />
              </div>
              <Typography as="h4" variant="h4" className="text-[color:var(--color-heading)] font-medium text-sm">
                {t("nextSteps")}
              </Typography>
            </div>

            <div className="space-y-2 ml-8">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[color:var(--color-primary)] font-bold text-xs">1</span>
                </div>
                <Typography as="p" variant="p" className="text-[color:var(--color-body)] text-xs">{t("step1")}</Typography>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[color:var(--color-primary)] font-bold text-xs">2</span>
                </div>
                <Typography as="p" variant="p" className="text-[color:var(--color-body)] text-xs">{t("step2")}</Typography>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[color:var(--color-primary)] font-bold text-xs">3</span>
                </div>
                <Typography as="p" variant="p" className="text-[color:var(--color-body)] text-xs">{t("step3")}</Typography>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button variant="ghost" size="md" onClick={onClose} className="flex-1">{t("closeButton")}</Button>
          <Button variant="primary" size="md" onClick={() => window.open("/terminos-condiciones", "_blank")} className="flex-1">{t("viewTerms")}</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
