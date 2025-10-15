"use client";
import React, { useState } from "react";
import Button from "./ui/Button";
import { useForm, FormProvider } from "react-hook-form";
import type { FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BookingSchema, { BookingData } from "@/lib/bookingSchema";
import StepIndicator from "./booking/StepIndicator";
import Step1 from "./booking/steps/Step1_PersonalInfo";
import Step2 from "./booking/steps/Step2_ServiceSelection";
import Step3 from "./booking/steps/Step3_Location";
import Step4 from "./booking/steps/Step4_DateTime";
import Step5 from "./booking/steps/Step5_Confirmation";
import BookingSummary from "./booking/BookingSummary";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import SuccessModal from "./booking/SuccessModal";
import { Send } from "lucide-react";
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
      methods.reset(defaults);
      setCurrentStep(1);
      setSuccessPricing(data?.pricing);
      setSuccessClientName(methods.getValues("name"));
      setShowSuccess(true);
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo enviar. Intenta nuevamente.";
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
    if (valid) setCurrentStep((s) => Math.min(total, s + 1));
  };

  const handlePrev = () => setCurrentStep((s) => Math.max(1, s - 1));

  return (
    <FormProvider {...methods}>
      <section className="py-12">
        <div className="container mx-auto px-3 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-2">
              <StepIndicator currentStep={currentStep} totalSteps={total} />
              <div className="mt-6 bg-card p-4 sm:p-6 rounded-lg shadow-md">
                {currentStep === 1 && <Step1 />}
                {currentStep === 2 && <Step2 />}
                {currentStep === 3 && <Step3 />}
                {currentStep === 4 && <Step4 />}
                {currentStep === 5 && <Step5 />}

                {currentStep === 5 && (
                  <div className="mt-8 pt-6 border-t border-border">
                    <h4 className="font-playfair text-lg mb-4">
                      Resumen de tu reserva
                    </h4>
                    <BookingSummary />
                  </div>
                )}

                <div
                  className={`mt-6 flex flex-col gap-3 sm:flex-row sm:items-center ${
                    currentStep === total
                      ? "sm:justify-end"
                      : "sm:justify-between"
                  }`}
                >
                  <div className="order-2 sm:order-1 sm:w-auto">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={handlePrev}
                        className="min-h-[48px] w-full sm:w-auto"
                      >
                        Anterior
                      </Button>
                    )}
                  </div>
                  <div className="order-1 sm:order-2 sm:w-auto">
                    {currentStep < total ? (
                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        onClick={handleNext}
                        className="min-h-[48px] w-full sm:w-auto focus:ring-[var(--color-accent-primary)] focus:ring-offset-0"
                      >
                        Siguiente
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="md"
                        disabled={!canSubmit || sendBooking.isPending}
                        onClick={methods.handleSubmit((data) =>
                          sendBooking.mutate(data)
                        )}
                        aria-busy={sendBooking.isPending}
                        className="min-h-[52px] w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed bg-[color:var(--color-accent-primary)] text-white focus:ring-[var(--color-accent-primary)] focus:ring-offset-0 hover:opacity-95 text-lg font-semibold"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Send className="w-5 h-5 text-white dark:text-[color:var(--color-accent-primary)]" />
                          {sendBooking.isPending
                            ? "Enviando…"
                            : "Confirmar y Enviar Solicitud de Cita"}
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
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
      />
    </FormProvider>
  );
}
