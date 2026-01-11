"use client";
import { useServicesList } from "@/hooks/useServices";
import BookingSchema, { type BookingData } from "@/lib/bookingSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Calendar, CreditCard, MapPin, Send, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { FieldPath } from "react-hook-form";
import toast from "react-hot-toast";
import BookingSummary from "./booking/BookingSummary";
import StepIndicator from "./booking/StepIndicator";
import SuccessModal from "./booking/SuccessModal";
import Step1 from "./booking/steps/Step1_PersonalInfo";
import Step2 from "./booking/steps/Step2_ServiceSelection";
import Step3 from "./booking/steps/Step3_Location";
import Step4 from "./booking/steps/Step4_DateTime";
import Step5 from "./booking/steps/Step5_Confirmation";
import Button from "./ui/Button";
import Typography from "./ui/Typography";

const translations = {
  title: "Reserva tu Cita",
  subtitle: "Completa el formulario para agendar tu cita",
  nextButton: "Siguiente",
  prevButton: "Anterior",
  submitButton: "Confirmar y Enviar",
  submitting: "Enviando...",
  summaryTitle: "Resumen de tu reserva",
  step1Title: "Información Personal",
  step2Title: "Selecciona Servicios",
  step3Title: "Ubicación",
  step4Title: "Fecha y Hora",
  step5Title: "Confirmación",
  errorSending: "No se pudo enviar. Intenta nuevamente.",
  successMessage: "¡Solicitud enviada con éxito!",
};

const useTranslations = () => {
  return {
    t: (key: string, fallback?: string) => {
      const value = translations[key as keyof typeof translations];
      return value || fallback || key;
    },
  };
};

type Pricing = {
  servicePrice?: number;
  transportCost?: number;
  nightShiftCost?: number;
  totalPrice?: number;
};

export default function BookingFlow() {
  const methods = useForm<BookingData>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      selectedServices: [],
      locationType: "HOME",
      date: undefined as unknown as Date,
      timeSlot: "",
      message: "",
      additionalNotes: "",
      agreedToTerms: false,
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const total = 5;
  const canSubmit = methods.watch("agreedToTerms") === true;
  const [showSuccess, setShowSuccess] = useState(false);
  const [successPricing, setSuccessPricing] = useState<Pricing | undefined>(
    undefined
  );
  const [successClientName, setSuccessClientName] = useState<
    string | undefined
  >(undefined);
  const [successServiceNames, setSuccessServiceNames] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false); // Oculto inicialmente
  const { t } = useTranslations();
  const { data: allServices = [] } = useServicesList();

  // Watch para detectar campos pre-llenados
  const locationType = methods.watch("locationType");
  const selectedServices = methods.watch("selectedServices");
  const dateValue = methods.watch("date");
  const timeSlot = methods.watch("timeSlot");

  // Determinar qué pasos se deben mostrar
  const shouldShowStep = (step: number): boolean => {
    switch (step) {
      case 1: // Personal info - siempre se muestra
        return true;
      case 2: // Services - se oculta si ya hay servicios seleccionados desde disponibilidad
        return !selectedServices || selectedServices.length === 0;
      case 3: // Location - se oculta si es STUDIO o si ya se seleccionó desde disponibilidad como STUDIO
        return locationType === "HOME";
      case 4: // Date & Time - se oculta si ya hay fecha y hora desde disponibilidad
        return !dateValue || !timeSlot;
      case 5: // Confirmation - siempre se muestra
        return true;
      default:
        return true;
    }
  };

  // Obtener el siguiente paso visible
  const getNextVisibleStep = (fromStep: number): number => {
    for (let i = fromStep + 1; i <= total; i++) {
      if (shouldShowStep(i)) return i;
    }
    return total;
  };

  // Obtener el paso anterior visible
  const getPrevVisibleStep = (fromStep: number): number => {
    for (let i = fromStep - 1; i >= 1; i--) {
      if (shouldShowStep(i)) return i;
    }
    return 1;
  };

  // Calcular lista de pasos visibles
  const visibleSteps = [1, 2, 3, 4, 5].filter(shouldShowStep);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qpDate = params.get("date");
    const qpTime = params.get("timeSlot");
    const qpLocation = params.get("locationType");
    const qpServices = params.get("services");

    const currentDate = methods.getValues("date");
    const currentTime = methods.getValues("timeSlot");

    if (!currentDate && qpDate) {
      const parsed = new Date(`${qpDate}T00:00:00`);
      if (!isNaN(parsed.getTime())) {
        methods.setValue("date", parsed, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }

    if (!currentTime && qpTime) {
      methods.setValue("timeSlot", qpTime, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    if (qpLocation === "HOME" || qpLocation === "STUDIO") {
      methods.setValue("locationType", qpLocation as any, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }

    if (qpServices) {
      const currentServices = methods.getValues("selectedServices") || [];
      if (!currentServices.length) {
        const items = qpServices
          .split(",")
          .map((pair) => pair.split(":"))
          .filter(
            (parts) => parts.length === 2 && parts[0] && Number(parts[1]) > 0
          )
          .map(([id, qty]) => ({ id, quantity: Number(qty) }));
        if (items.length) {
          methods.setValue("selectedServices", items as any, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      }
    }
  }, [methods]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | {
            date?: string;
            timeSlot?: string;
            locationType?: "HOME" | "STUDIO";
            services?: string;
          }
        | undefined;
      if (!detail) return;

      // Mostrar el formulario cuando se usa "Usar en formulario"
      setIsVisible(true);

      if (detail.date) {
        const parsed = new Date(`${detail.date}T00:00:00`);
        if (!isNaN(parsed.getTime())) {
          methods.setValue("date", parsed, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      }
      if (detail.timeSlot) {
        methods.setValue("timeSlot", detail.timeSlot, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
      if (detail.locationType === "HOME" || detail.locationType === "STUDIO") {
        methods.setValue("locationType", detail.locationType as any, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
      if (detail.services) {
        const items = detail.services
          .split(",")
          .map((pair) => pair.split(":"))
          .filter(
            (parts) => parts.length === 2 && parts[0] && Number(parts[1]) > 0
          )
          .map(([id, qty]) => ({ id, quantity: Number(qty) }));
        if (items.length) {
          methods.setValue("selectedServices", items as any, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      }
    };
    window.addEventListener("availability:prefill", handler as EventListener);
    return () =>
      window.removeEventListener(
        "availability:prefill",
        handler as EventListener
      );
  }, [methods]);

  // Iconos para cada paso
  const stepIcons = [User, Calendar, MapPin, CreditCard, Send];

  const sendBooking = useMutation({
    mutationFn: async (payload: BookingData) => {
      const servicesRecord: Record<string, number> = {};
      (payload.selectedServices || []).forEach(({ id, quantity }) => {
        if (id && quantity > 0) servicesRecord[id] = quantity;
      });

      const body = {
        clientName: payload.name,
        clientEmail: payload.email,
        clientPhone: payload.phone,
        services: servicesRecord,
        servicePrice: 0,
        appointmentDate: payload.date
          ? new Date(payload.date).toISOString()
          : "",
        appointmentTimeRange: payload.timeSlot,
        locationType: payload.locationType,
        district: payload.district || undefined,
        address: payload.address || undefined,
        addressReference: payload.addressReference || undefined,
        additionalNotes: payload.additionalNotes || "",
      };

      const res = await fetch("/api/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Error al enviar la solicitud");
      }
      return data;
    },
    onSuccess: (data: { pricing?: Pricing }) => {
      const defaults = {
        name: "",
        phone: "",
        email: "",
        selectedServices: [],
        locationType: "HOME" as const,
        date: undefined as unknown as Date,
        timeSlot: "",
        message: "",
        additionalNotes: "",
        agreedToTerms: false,
      };
      // Compute selected service names
      const selected = methods.getValues("selectedServices") || [];
      const names = selected
        .filter((s: { id: string; quantity: number }) => s.quantity > 0)
        .map((s: { id: string }) => {
          const svc = allServices.find(
            (x: { id: string; name: string }) => x.id === s.id
          );
          return svc?.name;
        })
        .filter(Boolean) as string[];

      setSuccessServiceNames(names);
      methods.reset(defaults);
      setCurrentStep(1);
      setSuccessPricing(data?.pricing);
      setSuccessClientName(methods.getValues("name"));
      setShowSuccess(true);
      toast.success(t("successMessage"));

      try {
        const url = new URL(window.location.href);
        ["date", "timeSlot", "locationType", "services"].forEach((k) =>
          url.searchParams.delete(k)
        );
        window.history.replaceState({}, "", url.toString());
        window.dispatchEvent(new CustomEvent("availability:reset"));
      } catch {}
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : t("errorSending");
      toast.error(message);
    },
  });

  const handleNext = async () => {
    const stepFields: Record<number, FieldPath<BookingData>[]> = {
      1: ["name", "phone", "email"],
      2: ["selectedServices"],
      3: ["locationType", "district", "address"],
      4: ["date", "timeSlot"],
      5: ["agreedToTerms"],
    };
    const fields = stepFields[currentStep] || [];
    const valid = await methods.trigger(fields);
    if (valid) {
      const nextStep = getNextVisibleStep(currentStep);
      setCurrentStep(nextStep);
    }
  };

  const handlePrev = () => {
    const prevStep = getPrevVisibleStep(currentStep);
    setCurrentStep(prevStep);
  };

  // Si no es visible, no renderizar nada
  if (!isVisible) {
    return null;
  }

  return (
    <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm">
      <FormProvider {...methods}>
        <section id="booking-flow" className="py-8 sm:py-12 w-full max-w-full">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl w-full">
            {/* Badge de paso 3 */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--color-primary)]/10 border border-[color:var(--color-primary)]/30">
                <div className="w-6 h-6 rounded-full bg-[color:var(--color-primary)] text-white flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <Typography
                  as="span"
                  variant="small"
                  className="text-[color:var(--color-heading)] font-medium"
                >
                  Paso 3: Completa tu reserva
                </Typography>
              </div>
            </div>
            {/* Encabezado */}
            <div className="text-center mb-8">
              <Typography
                as="h1"
                variant="h1"
                className="text-[color:var(--color-heading)] font-serif text-xl sm:text-3xl mb-2 break-words"
              >
                {t("title")}
              </Typography>
              <Typography
                as="p"
                variant="p"
                className="text-[color:var(--color-body)] max-w-md mx-auto break-words px-2"
              >
                {t("subtitle")}
              </Typography>
            </div>

            {/* Indicador de pasos */}
            <div>
              <StepIndicator
                currentStep={currentStep}
                totalSteps={total}
                visibleSteps={visibleSteps}
              />
            </div>

            {/* Badge de paso 3 */}
            <div className="flex justify-center my-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--color-primary)]/10 border border-[color:var(--color-primary)]/30">
                <div className="w-6 h-6 rounded-full bg-[color:var(--color-primary)] text-white flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <Typography
                  as="span"
                  variant="small"
                  className="text-[color:var(--color-heading)] font-medium"
                >
                  Paso 3: Completa tu reserva
                </Typography>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="mt-6 w-full">
              <div className="bg-[color:var(--color-surface)] w-full">
                {/* Título del paso actual */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[color:var(--color-border)]/20">
                  <div className="w-10 h-10 rounded-lg bg-[color:var(--color-primary)]/20 flex items-center justify-center">
                    {React.createElement(stepIcons[currentStep - 1], {
                      className: "w-5 h-5 text-[color:var(--color-primary)]",
                    })}
                  </div>
                  <div>
                    <Typography
                      as="h2"
                      variant="h2"
                      className="text-[color:var(--color-heading)] font-medium text-lg"
                    >
                      {t(`step${currentStep}Title`)}
                    </Typography>
                    <Typography
                      as="p"
                      variant="p"
                      className="text-[color:var(--color-body)] text-sm"
                    >
                      Paso {visibleSteps.indexOf(currentStep) + 1} de{" "}
                      {visibleSteps.length}
                    </Typography>
                  </div>
                </div>

                {/* Contenido del paso */}
                <div className="w-full">
                  {currentStep === 1 && shouldShowStep(1) && <Step1 />}
                  {currentStep === 2 && shouldShowStep(2) && <Step2 />}
                  {currentStep === 3 && shouldShowStep(3) && <Step3 />}
                  {currentStep === 4 && shouldShowStep(4) && <Step4 />}
                  {currentStep === 5 && shouldShowStep(5) && <Step5 />}
                </div>

                {/* Resumen en el paso 5 */}
                {currentStep === 5 && (
                  <div className="mt-8 pt-6 border-t border-[color:var(--color-border)]/20">
                    <Typography
                      as="h3"
                      variant="h3"
                      className="text-[color:var(--color-heading)] font-medium mb-4"
                    >
                      {t("summaryTitle")}
                    </Typography>
                    <BookingSummary />
                  </div>
                )}

                {/* Botones de navegación */}
                <div className="mt-6 flex flex-col sm:flex-row sm:justify-end items-center gap-3 w-full">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="lg"
                      onClick={handlePrev}
                      className="w-full sm:w-auto"
                    >
                      {t("prevButton")}
                    </Button>
                  )}
                  {currentStep < total ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      onClick={handleNext}
                      className="w-full sm:w-auto"
                    >
                      {t("nextButton")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      disabled={!canSubmit || sendBooking.isPending}
                      onClick={methods.handleSubmit((data) =>
                        sendBooking.mutate(data)
                      )}
                      aria-busy={sendBooking.isPending}
                      className="w-full sm:w-auto min-h-[52px]"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        {sendBooking.isPending
                          ? t("submitting")
                          : t("submitButton")}
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <SuccessModal
          open={showSuccess}
          onClose={() => setShowSuccess(false)}
          clientName={successClientName}
          pricing={successPricing ?? undefined}
          serviceNames={successServiceNames}
        />
      </FormProvider>
    </div>
  );
}
