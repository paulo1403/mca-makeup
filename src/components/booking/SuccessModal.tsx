"use client";

import Modal, { ModalBody, ModalFooter } from "@/components/ui/Modal";
import { Calendar, Check, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../ui/Button";
import Typography from "../ui/Typography";

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

// Confetti particle component
const Confetti = () => {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      left: number;
      delay: number;
      duration: number;
      color: string;
    }>
  >([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const colors = ["#D4A574", "#A8947F", "#8B7355", "#B5A391", "#C9B8A5"];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  const content = (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[9999]">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 opacity-0 animate-confetti"
          style={{
            left: `${particle.left}%`,
            top: "-10px",
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
          }}
        />
      ))}
    </div>
  );

  if (typeof document !== "undefined" && mounted) {
    return createPortal(content, document.body);
  }

  return null;
};

export default function SuccessModal({
  open,
  onClose,
  clientName,
  pricing,
  serviceNames,
}: SuccessModalProps) {
  return (
    <>
      {open && <Confetti />}
      <Modal
        open={open}
        onClose={onClose}
        size="md"
        ariaLabelledBy="success-modal-title"
      >
        {/* Header personalizado para centrado perfecto */}
        <div className="relative p-6 border-b border-[color:var(--color-border)]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[color:var(--color-primary)] flex items-center justify-center mx-auto mb-3">
              <Check className="w-8 h-8 text-white" />
            </div>
            <Typography
              as="h3"
              variant="h3"
              className="text-[color:var(--color-heading)] font-bold uppercase"
            >
              ¡Reserva enviada!
            </Typography>
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 sm:right-6 sm:top-6 text-[color:var(--color-muted)] hover:text-[color:var(--color-body)] transition-colors p-2 rounded-lg hover:bg-[color:var(--color-surface)]/40"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <ModalBody>
          <div className="space-y-4 text-center">
            <Typography
              as="p"
              variant="p"
              className="text-[color:var(--color-body)]"
            >
              ¡Gracias por confiar en mi trabajo!
            </Typography>

            {pricing && typeof pricing.totalPrice === "number" && (
              <div className="p-4 rounded-[12px] bg-[color:var(--color-surface)]/40">
                <div className="space-y-2">
                  {serviceNames && serviceNames.length > 0 && (
                    <div>
                      <Typography
                        as="span"
                        variant="small"
                        className="text-[color:var(--color-body)]"
                      >
                        {serviceNames.join(", ")}
                      </Typography>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-[color:var(--color-border)]">
                    <Typography
                      as="span"
                      variant="p"
                      className="text-[color:var(--color-heading)] font-medium"
                    >
                      Total
                    </Typography>
                    <Typography
                      as="span"
                      variant="h3"
                      className="text-[color:var(--color-primary)] font-bold"
                    >
                      S/ {Number(pricing.totalPrice || 0).toFixed(2)}
                    </Typography>
                  </div>
                </div>
              </div>
            )}

            <div className="text-left space-y-2 bg-[color:var(--color-surface)]/40 p-4 rounded-[12px]">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-[color:var(--color-primary)]" />
                <Typography
                  as="h4"
                  variant="h4"
                  className="text-[color:var(--color-heading)] font-medium"
                >
                  Próximos pasos
                </Typography>
              </div>

              <ol className="space-y-2 text-sm text-[color:var(--color-body)] list-decimal list-inside">
                <li>Enviar la captura del adelanto al WhatsApp (989164990)</li>
                <li>Espera la confirmación de tu reserva</li>
                <li>El restante lo cancelas el día de la cita</li>
              </ol>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="primary"
            size="md"
            onClick={onClose}
            className="w-full"
          >
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
