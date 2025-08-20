"use client";

import { useEffect, useCallback } from "react";
import { useAvailableRanges } from "@/hooks/useAvailableRanges";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  User,
  Send,
  Home,
  Instagram,
  Copy,
  Check,
} from "lucide-react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { ServiceSelection, Service } from "@/types";
import { analytics } from "@/lib/analytics";
import DistrictSelector from "./DistrictSelector";
import PricingBreakdown from "./PricingBreakdown";
import ServiceSelector from "./ServiceSelector";

registerLocale("es", es);

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: {} as ServiceSelection,
    date: null as Date | null,
    timeRange: "",
    locationType: "HOME" as "STUDIO" | "HOME",
    district: "",
    address: "",
    addressReference: "",
    message: "",
  });

  // Estado para servicios disponibles
  const [services, setServices] = useState<Service[]>([]);

  // Cargar servicios al inicio
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch("/api/services");
        if (response.ok) {
          const data = await response.json();
          setServices(data.services || []);
        }
      } catch (error) {
        console.error("Error loading services:", error);
      }
    };
    loadServices();
  }, []);

  // Estado para precios calculados
  const [calculatedPricing, setCalculatedPricing] = useState({
    servicePrice: 0,
    transportCost: 0,
    totalPrice: 0,
  });

  const { data: rangesData, isLoading: isLoadingRanges } = useAvailableRanges(
    formData.date,
    formData.service,
    formData.locationType,
  );

  useEffect(() => {
    if (
      formData.timeRange &&
      rangesData?.availableRanges &&
      !rangesData.availableRanges.includes(formData.timeRange)
    ) {
      setFormData((prev) => ({ ...prev, timeRange: "" }));
    }
  }, [rangesData, formData.timeRange]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Track when contact form comes into view
  useEffect(() => {
    if (isInView) {
      analytics.contactFormViewed();
    }
  }, [isInView]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^\d+]/g, "");

    if (value.startsWith("+51")) {
      const digits = value.substring(3);
      if (digits.length <= 3) {
        value = `+51 ${digits}`;
      } else if (digits.length <= 6) {
        value = `+51 ${digits.substring(0, 3)} ${digits.substring(3)}`;
      } else {
        value = `+51 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 9)}`;
      }
    } else if (value.startsWith("9") && !value.startsWith("+")) {
      if (value.length <= 3) {
        value = value;
      } else if (value.length <= 6) {
        value = `${value.substring(0, 3)} ${value.substring(3)}`;
      } else {
        value = `${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6, 9)}`;
      }
    }

    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  // Función para manejar los precios calculados desde PricingBreakdown
  const handlePriceCalculated = useCallback(
    (totalPrice: number, servicePrice: number, transportCost: number) => {
      setCalculatedPricing({
        servicePrice,
        transportCost,
        totalPrice,
      });
    },
    [],
  );

  // Función para copiar número al portapapeles
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error("No se pudo copiar el texto:", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      date: date,
    }));
    setFormData((prev) => ({
      ...prev,
      date: date,
    }));
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      timeRange: e.target.value,
    }));
  };

  // Función auxiliar para calcular duración total
  const calculateTotalDuration = (): number => {
    let totalMinutes = 0;
    
    Object.entries(formData.service).forEach(([serviceId, quantity]) => {
      if (quantity > 0) {
        const service = services.find(s => s.id === serviceId);
        if (service) {
          totalMinutes += service.duration * quantity;
        }
      }
    });
    
    return totalMinutes;
  };

  // Función auxiliar para formatear duración en texto legible
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    // Track booking started
    const selectedServices = Object.keys(formData.service).filter(
      serviceId => formData.service[serviceId] > 0
    );
    if (selectedServices.length > 0) {
      analytics.bookingStarted(selectedServices.join(', '));
    }

    // Validación personalizada completa
    if (!formData.name) {
      setSubmitMessage("Por favor ingresa tu nombre completo.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.email) {
      setSubmitMessage("Por favor ingresa tu email.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.phone) {
      setSubmitMessage("Por favor ingresa tu teléfono.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.service || Object.keys(formData.service).length === 0 || 
        !Object.values(formData.service).some(quantity => quantity > 0)) {
      setSubmitMessage("Por favor selecciona un servicio antes de continuar.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.date) {
      setSubmitMessage("Por favor selecciona una fecha para tu cita.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.timeRange) {
      setSubmitMessage("Por favor selecciona un horario disponible.");
      setIsSubmitting(false);
      return;
    }

    if (formData.locationType === "HOME") {
      if (!formData.district) {
        setSubmitMessage(
          "Por favor selecciona tu distrito para el servicio a domicilio.",
        );
        setIsSubmitting(false);
        return;
      }
      if (!formData.address) {
        setSubmitMessage(
          "Por favor ingresa tu dirección completa para el servicio a domicilio.",
        );
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/book-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName: formData.name,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          services: formData.service,
          servicePrice: calculatedPricing.servicePrice,
          appointmentDate: formData.date
            ? format(formData.date, "yyyy-MM-dd")
            : "",
          appointmentTimeRange: formData.timeRange,
          locationType: formData.locationType,
          district: formData.district,
          address: formData.address,
          addressReference: formData.addressReference,
          additionalNotes: formData.message,
        }),
      });

      if (response.ok) {
        // Track successful booking
        analytics.bookingCompleted(
          selectedServices.join(', '),
          formData.locationType,
          calculatedPricing.totalPrice
        );

        setSubmitMessage(
          "¡Solicitud enviada con éxito! Te contactaré pronto para confirmar tu cita.",
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: {},
          date: null,
          timeRange: "",
          locationType: "HOME",
          district: "",
          address: "",
          addressReference: "",
          message: "",
        });
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.message ||
          errorData?.error ||
          "Error al enviar la solicitud";
        throw new Error(errorMessage);
      }
    } catch (error: unknown) {
      let errorMessage =
        "Hubo un error al enviar tu solicitud. Por favor intenta nuevamente.";

      if (error instanceof Error && error.message) {
        if (
          error.message.includes("Teléfono") ||
          error.message.includes("teléfono")
        ) {
          errorMessage =
            "Por favor verifica el formato del teléfono. Ej: +51 989 164 990 o 989 164 990";
        } else if (
          error.message.includes("Email") ||
          error.message.includes("email")
        ) {
          errorMessage = "Por favor verifica que el email sea válido.";
        } else if (
          error.message.includes("fecha") ||
          error.message.includes("hora")
        ) {
          errorMessage = "Por favor selecciona una fecha y hora válidas.";
        }
      }

      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        {/* Header minimalista */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair text-heading mb-4 sm:mb-6">
            Agenda tu Cita
          </h2>
          <p className="text-main text-base sm:text-lg max-w-2xl mx-auto mb-6">
            ¿Lista para verte hermosa? Completa el formulario y me pondré en
            contacto contigo para confirmar tu cita y todos los detalles.
          </p>
          
          {/* Proceso simplificado */}
          <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#B06579]/10 rounded-xl p-4 sm:p-6 max-w-2xl mx-auto">
            <p className="text-sm sm:text-base text-heading">
              <strong>Proceso simple:</strong> Completa el formulario → Te contacto en 24h → ¡Tu cita está lista!
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Formulario */}
          <motion.div
            className="lg:col-span-2 order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="lg:bg-light-background lg:rounded-xl lg:p-8 lg:border lg:border-gray-100">
              <h3 className="text-xl sm:text-2xl font-playfair text-heading mb-6 sm:mb-8">
                Información de la Cita
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                {/* PASO 1 & 2: Información Personal y Servicio en desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* PASO 1: Información Personal */}
                  <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-8 h-8 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <h4 className="text-lg sm:text-xl font-medium text-heading">
                        Tu Información Personal
                      </h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="flex items-center gap-2 text-heading font-medium text-sm"
                        >
                          <User className="w-4 h-4 text-accent-primary" />
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 sm:px-4 sm:py-4 bg-white border border-gray-200 rounded-lg text-heading placeholder-gray-400 focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300 text-base touch-manipulation"
                          placeholder="Ingresa tu nombre completo"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="phone"
                          className="flex items-center gap-2 text-heading font-medium text-sm"
                        >
                          <Phone className="w-4 h-4 text-accent-primary" />
                          Teléfono / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          required
                          className="w-full px-4 py-3 sm:px-4 sm:py-4 bg-white border border-gray-200 rounded-lg text-heading placeholder-gray-400 focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300 text-base touch-manipulation"
                          placeholder="+51 989 164 990 o 989 164 990"
                          maxLength={15}
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="flex items-center gap-2 text-heading font-medium text-sm"
                        >
                          <Mail className="w-4 h-4 text-accent-primary" />
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 sm:px-4 sm:py-4 bg-white border border-gray-200 rounded-lg text-heading placeholder-gray-400 focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300 text-base touch-manipulation"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PASO 2: Selección de Servicio */}
                  <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-8 h-8 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <h4 className="text-lg sm:text-xl font-medium text-heading">
                        Selecciona tu Servicio
                      </h4>
                    </div>
                    
                    <div className="space-y-2">
                      <label
                        htmlFor="service"
                        className="text-heading font-medium text-sm flex items-center gap-1"
                      >
                        Tipo de Servicio
                        <span className="text-red-500">*</span>
                      </label>
                      <ServiceSelector
                        value={formData.service}
                        onChangeAction={(services) =>
                          setFormData((prev) => ({ ...prev, service: services }))
                        }
                        required
                        placeholder="Busca y selecciona tu servicio favorito..."
                      />
                    </div>
                  </div>
                </div>

                {/* PASO 3 & 4: Ubicación y Fecha/Horario en desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* PASO 3: Ubicación del Servicio */}
                  <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-8 h-8 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <h4 className="text-lg sm:text-xl font-medium text-heading">
                        ¿Dónde te atiendo?
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="locationType"
                          value="HOME"
                          checked={formData.locationType === "HOME"}
                          onChange={handleInputChange}
                          className="text-accent-primary focus:ring-accent-primary w-5 h-5"
                        />
                        <Home className="w-5 h-5 text-accent-primary" />
                        <div className="flex-1">
                          <span className="text-heading text-base font-medium">
                            Servicio a Domicilio
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Costo adicional según distrito
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="locationType"
                          value="STUDIO"
                          checked={formData.locationType === "STUDIO"}
                          onChange={handleInputChange}
                          className="text-accent-primary focus:ring-accent-primary w-5 h-5"
                        />
                        <MapPin className="w-5 h-5 text-accent-primary" />
                        <div className="flex-1">
                          <span className="text-heading text-base font-medium">
                            Room Studio
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Sin costo adicional
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* PASO 4: Fecha y Horario */}
                  <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-8 h-8 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <h4 className="text-lg sm:text-xl font-medium text-heading">
                        Fecha y Horario
                      </h4>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-heading font-medium text-sm">
                          <Calendar className="w-4 h-4 text-accent-primary" />
                          Fecha Preferida *
                        </label>
                        <DatePicker
                          selected={formData.date}
                          onChange={handleDateChange}
                          locale="es"
                          minDate={new Date()}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Selecciona una fecha"
                          className="w-full px-4 py-3 sm:px-4 sm:py-4 bg-white border border-gray-200 rounded-lg text-heading placeholder-gray-400 focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300 text-base touch-manipulation"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-heading font-medium text-sm">
                          <Clock className="w-4 h-4 text-accent-primary" />
                          Horario Disponible *
                        </label>
                        <select
                          id="timeRange"
                          name="timeRange"
                          value={formData.timeRange}
                          onChange={handleTimeRangeChange}
                          required
                          disabled={!formData.date || !formData.service || Object.keys(formData.service).length === 0}
                          className={`w-full px-4 py-3 sm:px-4 sm:py-4 bg-white border border-gray-200 rounded-lg text-heading focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300 text-base touch-manipulation${!formData.date || !formData.service || Object.keys(formData.service).length === 0 ? " opacity-50 cursor-not-allowed bg-gray-100" : ""}`}
                        >
                          <option value="">
                            {!formData.service || Object.keys(formData.service).length === 0 
                              ? "Primero selecciona un servicio" 
                              : !formData.date 
                              ? "Primero selecciona una fecha"
                              : "Selecciona un horario"}
                          </option>
                          {isLoadingRanges ? (
                            <option disabled>Cargando horarios...</option>
                          ) : rangesData?.availableRanges?.length === 0 &&
                            formData.date &&
                            formData.service ? (
                            <option disabled>
                              No hay horarios disponibles para el servicio y fecha
                              seleccionados.
                            </option>
                          ) : (
                            rangesData?.availableRanges?.map(
                              (range: string, idx: number) => {
                                // Calcular duración real basada en cantidades
                                const totalMinutes = calculateTotalDuration();
                                const duration = totalMinutes > 0 ? ` (${formatDuration(totalMinutes)})` : "";
                                
                                return (
                                  <option key={idx} value={range}>
                                    {range}
                                    {duration}
                                  </option>
                                );
                              },
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {formData.locationType === "HOME" && (
                  <div className="bg-orange-50 rounded-xl p-4 sm:p-6 border border-orange-200">
                    <h4 className="text-lg font-medium text-heading mb-4">
                      Detalles del Servicio a Domicilio
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="district"
                          className="text-heading font-medium text-sm flex items-center gap-1"
                        >
                          Tu Distrito
                          <span className="text-red-500">*</span>
                        </label>
                        <DistrictSelector
                          value={formData.district}
                          onChange={(district) =>
                            setFormData((prev) => ({ ...prev, district }))
                          }
                          required={formData.locationType === "HOME"}
                          placeholder="Busca y selecciona tu distrito..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="address"
                          className="text-heading font-medium text-sm flex items-center gap-1"
                        >
                          Dirección Completa
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required={formData.locationType === "HOME"}
                          className="w-full px-4 py-3 sm:px-4 sm:py-4 bg-white border border-gray-200 rounded-lg text-heading placeholder-gray-400 focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300 text-base touch-manipulation"
                          placeholder="Ej: Av. Javier Prado 1234, San Isidro"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="addressReference"
                          className="text-heading font-medium text-sm"
                        >
                          Referencia (Opcional)
                        </label>
                        <input
                          type="text"
                          id="addressReference"
                          name="addressReference"
                          value={formData.addressReference}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 sm:px-4 sm:py-4 bg-white border border-gray-200 rounded-lg text-heading placeholder-gray-400 focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300 text-base touch-manipulation"
                          placeholder="Ej: Cerca al parque, portón negro, edificio azul"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Detalles Adicionales */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-heading font-medium text-sm"
                  >
                    Mensaje Adicional (Opcional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 sm:px-4 sm:py-4 bg-white border border-gray-200 rounded-lg text-heading placeholder-gray-400 focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300 text-base touch-manipulation resize-none"
                    placeholder="Cuéntame sobre tu evento o preferencias especiales..."
                  />
                </div>

                {/* Desglose de precios */}
                {formData.service && (
                  <div className="space-y-4">
                    <PricingBreakdown
                      selectedServices={formData.service}
                      locationType={formData.locationType}
                      district={formData.district}
                      onPriceCalculated={handlePriceCalculated}
                    />

                    {/* Información de depósito PLIN mejorada */}
                    <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#B06579]/10 rounded-xl p-6 border border-[#D4AF37]/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v1H6V6zm0 3h8v1H6V9zm0 3h4v1H6v-1z"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-heading text-lg">
                            Información de Pago
                          </h4>
                          <p className="text-sm text-gray-600">
                            Depósito requerido para confirmar tu cita
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Monto del depósito */}
                        <div className="bg-white rounded-lg p-4 border border-[#D4AF37]/30">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">Depósito requerido:</span>
                            <span className="text-2xl font-bold text-[#D4AF37]">S/ 150</span>
                          </div>
                        </div>

                        {/* Datos PLIN */}
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm">P</span>
                            </div>
                            <span className="font-medium text-gray-800">Datos para PLIN:</span>
                          </div>
                          
                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">Número de teléfono</span>
                              </div>
                              <span className="font-mono text-base sm:text-lg font-bold text-gray-800 block">
                                +51999209880
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard("+51999209880")}
                              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#D4AF37]/90 transition-colors touch-manipulation shadow-sm flex-shrink-0"
                            >
                              {copied ? (
                                <>
                                  <Check className="h-4 w-4" />
                                  <span className="font-medium text-sm">¡Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4" />
                                  <span className="font-medium text-sm">Copiar</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Proceso de pago */}
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h5 className="font-medium text-gray-800 mb-3">📋 Proceso de pago:</h5>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                              <p className="text-sm text-gray-700">Envía tu solicitud completando este formulario</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                              <p className="text-sm text-gray-700">Te contactaré para coordinar el depósito de S/ 150</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                              <p className="text-sm text-gray-700">El saldo restante se paga el día de la cita</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">✓</div>
                              <p className="text-sm text-gray-700 font-medium">Tu cita queda confirmada y reservada</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {submitMessage && (
                  <div
                    className={`p-4 rounded-lg border ${
                      submitMessage.includes("éxito")
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-accent text-white py-4 sm:py-5 px-6 sm:px-8 rounded-lg font-medium text-lg hover:bg-primary-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 touch-manipulation shadow-lg hover:shadow-xl"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Enviando solicitud...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Solicitud de Cita
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Información de Contacto */}
          <motion.div
            className="lg:col-span-1 order-1 lg:order-2"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="space-y-8">
              <div className="bg-light-background rounded-xl p-4 sm:p-6 border border-gray-100">
                <h3 className="text-lg sm:text-xl font-playfair text-heading mb-3 sm:mb-4">
                  Información de Contacto
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-accent-primary flex-shrink-0" />
                    <span className="text-main text-sm sm:text-base">
                      +51 989 164 990
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-accent-primary flex-shrink-0" />
                    <span className="text-main text-sm sm:text-base break-all">
                      contacto@marcelacordero.com
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent-primary flex-shrink-0" />
                    <span className="text-main text-sm sm:text-base">
                      Av. Bolívar 1073, Pueblo Libre, Lima
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-accent-primary flex-shrink-0" />
                    <a
                      href="https://www.instagram.com/marcelacorderobeauty/"
                      className="text-main hover:text-accent-primary transition-colors text-sm sm:text-base break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @marcelacorderobeauty
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
