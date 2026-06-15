"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Calendar, MapPin, Send, Sparkles, User } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { FieldPath } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SuccessModal from "@/components/booking/SuccessModal";
import Button from "@/components/ui/Button";
import { useServicesList } from "@/hooks/useServices";
import BookingSchema, { type BookingData } from "@/lib/bookingSchema";
import AccordionSection from "./AccordionSection";
import Section1_Location from "./sections/Section1_Location";
import Section2_Services from "./sections/Section2_Services";
import Section3_DateTime from "./sections/Section3_DateTime";
import Section4_PersonalSummary from "./sections/Section4_PersonalSummary";

type Pricing = {
  servicePrice?: number;
  transportCost?: number;
  nightShiftCost?: number;
  totalPrice?: number;
};

const SECTION_FIELDS: Record<number, FieldPath<BookingData>[]> = {
  1: ["locationType", "district", "address"],
  2: ["selectedServices"],
  3: ["date", "timeSlot"],
  4: ["name", "country", "documentNumber", "phone", "email", "agreedToTerms"],
};

export default function BookingFlowAccordion() {
  const methods = useForm<BookingData>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      name: "",
      country: "PE",
      phone: "",
      email: "",
      documentNumber: "",
      selectedServices: [],
      locationType: "HOME",
      date: undefined as unknown as Date,
      timeSlot: "",
      message: "",
      additionalNotes: "",
      agreedToTerms: false,
    },
  });

  const [activeSection, setActiveSection] = useState(1);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const [successPricing, setSuccessPricing] = useState<Pricing | undefined>(undefined);
  const [successClientName, setSuccessClientName] = useState<string | undefined>(undefined);
  const [successServiceNames, setSuccessServiceNames] = useState<string[]>([]);
  const { data: allServices = [] } = useServicesList();
  const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const locationType = methods.watch("locationType");
  const selectedServices = methods.watch("selectedServices");
  const dateValue = methods.watch("date");
  const timeSlot = methods.watch("timeSlot");
  const district = methods.watch("district");

  const canSubmit = methods.watch("agreedToTerms") === true;

  useEffect(() => {
    const el = sectionRefs.current[activeSection];
    if (el) {
      setTimeout(() => {
        const top = el.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top, behavior: "smooth" });
      }, 350);
    }
  }, [activeSection]);

  const validateSection = useCallback(
    async (section: number): Promise<boolean> => {
      if (section === 1) {
        const locType = methods.getValues("locationType");
        const fields: FieldPath<BookingData>[] = ["locationType"];
        if (locType === "HOME") {
          fields.push("district", "address");
        }
        const valid = await methods.trigger(fields);
        if (valid && locType === "HOME") {
          const district = methods.getValues("district");
          const address = methods.getValues("address");
          if (!district?.trim()) {
            methods.setError("district", { message: "Selecciona un distrito." });
            return false;
          }
          if (!address?.trim()) {
            methods.setError("address", { message: "Ingresa tu dirección." });
            return false;
          }
        }
        return valid;
      }
      const fields = SECTION_FIELDS[section] || [];
      return methods.trigger(fields);
    },
    [methods],
  );

  const handleContinue = useCallback(async () => {
    const valid = await validateSection(activeSection);
    if (!valid) return;

    setCompletedSections((prev) => new Set([...prev, activeSection]));

    const next = activeSection + 1;
    if (next <= 4) {
      setActiveSection(next);
    }
  }, [activeSection, validateSection]);

  const handleToggle = useCallback(
    (section: number) => {
      if (completedSections.has(section) || activeSection === section) {
        setActiveSection(section);
      }
    },
    [completedSections, activeSection],
  );

  const getSummary = useCallback(
    (section: number): string | null => {
      switch (section) {
        case 1:
          return locationType === "STUDIO"
            ? "Room Studio — Pueblo Libre"
            : district
              ? `A domicilio — ${district}`
              : "A domicilio";
        case 2: {
          const arr = selectedServices || [];
          if (!arr.length) return null;
          const names = arr
            .map((s: { id: string }) => {
              const svc = allServices.find((x: { id: string; name: string }) => x.id === s.id);
              return svc?.name;
            })
            .filter(Boolean);
          return names.join(", ");
        }
        case 3:
          if (dateValue && timeSlot) {
            const d = dateValue instanceof Date ? dateValue : new Date(dateValue);
            return `${d.toLocaleDateString("es-PE", { day: "numeric", month: "short" })} · ${timeSlot}`;
          }
          return null;
        case 4:
          return null;
        default:
          return null;
      }
    },
    [locationType, district, selectedServices, allServices, dateValue, timeSlot],
  );

  const isSectionDisabled = useCallback(
    (section: number): boolean => {
      if (section === 1) return false;
      for (let i = 1; i < section; i++) {
        if (!completedSections.has(i)) return true;
      }
      return false;
    },
    [completedSections],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qpDate = params.get("date");
    const qpTime = params.get("timeSlot");
    const qpLocation = params.get("locationType");
    const qpServices = params.get("services");

    const prefilled: number[] = [];

    if (qpLocation === "HOME" || qpLocation === "STUDIO") {
      methods.setValue("locationType", qpLocation as "HOME" | "STUDIO", {
        shouldDirty: false,
        shouldValidate: false,
      });
      prefilled.push(1);
    }

    if (qpServices) {
      const currentServices = methods.getValues("selectedServices") || [];
      if (!currentServices.length) {
        const items = qpServices
          .split(",")
          .map((pair) => pair.split(":"))
          .filter((parts) => parts.length === 2 && parts[0] && Number(parts[1]) > 0)
          .map(([id, qty]) => ({ id, quantity: Number(qty) }));
        if (items.length) {
          methods.setValue("selectedServices", items as any, {
            shouldDirty: true,
            shouldValidate: true,
          });
          prefilled.push(2);
        }
      }
    }

    if (qpDate && qpTime) {
      const parsed = new Date(`${qpDate}T00:00:00`);
      if (!Number.isNaN(parsed.getTime())) {
        methods.setValue("date", parsed, { shouldDirty: true, shouldValidate: true });
      }
      methods.setValue("timeSlot", qpTime, { shouldDirty: true, shouldValidate: true });
      prefilled.push(3);
    }

    if (prefilled.length > 0) {
      setCompletedSections(new Set([...new Set(prefilled)]));
      const nextSection = prefilled.includes(3) ? 4 : prefilled.includes(2) ? 3 : prefilled[0] + 1;
      setActiveSection(Math.min(nextSection, 4));

      setTimeout(() => {
        const el = document.querySelector("#booking-accordion");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
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

      const prefilled: number[] = [];

      if (detail.locationType === "HOME" || detail.locationType === "STUDIO") {
        methods.setValue("locationType", detail.locationType, {
          shouldDirty: true,
          shouldValidate: true,
        });
        prefilled.push(1);
      }

      if (detail.services) {
        const items = detail.services
          .split(",")
          .map((pair) => pair.split(":"))
          .filter((parts) => parts.length === 2 && parts[0] && Number(parts[1]) > 0)
          .map(([id, qty]) => ({ id, quantity: Number(qty) }));
        if (items.length) {
          methods.setValue("selectedServices", items as any, {
            shouldDirty: true,
            shouldValidate: true,
          });
          prefilled.push(2);
        }
      }

      if (detail.date) {
        const parsed = new Date(`${detail.date}T00:00:00`);
        if (!Number.isNaN(parsed.getTime())) {
          methods.setValue("date", parsed, { shouldDirty: true, shouldValidate: true });
        }
      }
      if (detail.timeSlot) {
        methods.setValue("timeSlot", detail.timeSlot, { shouldDirty: true, shouldValidate: true });
      }
      if (detail.date && detail.timeSlot) prefilled.push(3);

      if (prefilled.length > 0) {
        setCompletedSections(new Set([...new Set(prefilled)]));
        const nextSection = prefilled.includes(3)
          ? 4
          : prefilled.includes(2)
            ? 3
            : prefilled[0] + 1;
        setActiveSection(Math.min(nextSection, 4));

        setTimeout(() => {
          const el = document.querySelector("#booking-accordion");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    };
    window.addEventListener("availability:prefill", handler as EventListener);
    return () => window.removeEventListener("availability:prefill", handler as EventListener);
  }, [methods]);

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
        phoneType: payload.country,
        clientDocument: payload.documentNumber,
        documentType: payload.country,
        services: servicesRecord,
        servicePrice: 0,
        appointmentDate: payload.date ? new Date(payload.date).toISOString() : "",
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
      const clientName = methods.getValues("name") || "";
      const selected = methods.getValues("selectedServices") || [];
      const names = selected
        .filter((s: { id: string; quantity: number }) => s.quantity > 0)
        .map((s: { id: string }) => {
          const svc = allServices.find((x: { id: string; name: string }) => x.id === s.id);
          return svc?.name;
        })
        .filter(Boolean) as string[];

      setSuccessServiceNames(names);
      setSuccessClientName(clientName);
      setSuccessPricing(data?.pricing);

      methods.reset({
        name: "",
        country: "PE" as const,
        phone: "",
        email: "",
        documentNumber: "",
        selectedServices: [],
        locationType: "HOME" as const,
        date: undefined as unknown as Date,
        timeSlot: "",
        message: "",
        additionalNotes: "",
        agreedToTerms: false,
      });
      setActiveSection(1);
      setCompletedSections(new Set());
      setShowSuccess(true);
      toast.success("¡Solicitud enviada con éxito!");

      try {
        const url = new URL(window.location.href);
        ["date", "timeSlot", "locationType", "services"].forEach((k) => url.searchParams.delete(k));
        window.history.replaceState({}, "", url.toString());
        window.dispatchEvent(new CustomEvent("availability:reset"));
      } catch {}
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "No se pudo enviar. Intenta nuevamente.";
      toast.error(message);
    },
  });

  const sections = [
    { index: 1, title: "Ubicación", icon: <MapPin className="w-4 h-4" /> },
    { index: 2, title: "Servicios", icon: <Sparkles className="w-4 h-4" /> },
    { index: 3, title: "Fecha y Hora", icon: <Calendar className="w-4 h-4" /> },
    { index: 4, title: "Tus Datos y Confirmar", icon: <User className="w-4 h-4" /> },
  ];

  const sectionComponents: Record<number, React.ReactNode> = {
    1: <Section1_Location />,
    2: <Section2_Services />,
    3: <Section3_DateTime />,
    4: <Section4_PersonalSummary />,
  };

  return (
    <div id="booking-accordion" style={{ scrollMarginTop: "88px" }}>
      <FormProvider {...methods}>
        <div className="space-y-3">
          {sections.map(({ index, title, icon }) => (
            <div
              key={index}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
            >
              <AccordionSection
                key={index}
                title={title}
                icon={icon}
                summary={getSummary(index)}
                isOpen={activeSection === index}
                isCompleted={completedSections.has(index)}
                isDisabled={isSectionDisabled(index)}
                onToggle={() => handleToggle(index)}
              >
                {sectionComponents[index]}
                {activeSection === index && (
                  <div className="mt-5 sticky bottom-0 py-3 bg-[color:var(--color-surface)] border-t border-[color:var(--color-border)]/30 -mx-4 px-4 sm:static sm:bg-transparent sm:border-0 sm:mx-0 sm:px-0 sm:py-0 flex items-center justify-center">
                    {activeSection < 4 ? (
                      <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        onClick={handleContinue}
                        className="w-full"
                      >
                        Continuar
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        disabled={!canSubmit || sendBooking.isPending}
                        onClick={methods.handleSubmit((data) => sendBooking.mutate(data))}
                        aria-busy={sendBooking.isPending}
                        className="w-full min-h-[52px]"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Send className="w-5 h-5" />
                          {sendBooking.isPending ? "Enviando..." : "Confirmar y Enviar"}
                        </span>
                      </Button>
                    )}
                  </div>
                )}
              </AccordionSection>
            </div>
          ))}
        </div>

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
