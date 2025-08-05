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
} from "lucide-react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import DistrictSelector from "./DistrictSelector";
import PricingBreakdown from "./PricingBreakdown";
import ServiceSelector from "./ServiceSelector";

registerLocale("es", es);

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: null as Date | null,
    timeRange: "",
    locationType: "HOME" as "STUDIO" | "HOME",
    district: "",
    address: "",
    addressReference: "",
    message: "",
  });

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

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

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

    if (!formData.service) {
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
          serviceType: formData.service,
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
        setSubmitMessage(
          "¡Solicitud enviada con éxito! Te contactaré pronto para confirmar tu cita.",
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
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
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-playfair text-heading mb-4">
            Agenda tu Cita
          </h2>
          <p className="text-main text-lg max-w-2xl mx-auto">
            ¿Lista para verte hermosa? Completa el formulario y me pondré en
            contacto contigo para confirmar tu cita y todos los detalles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Formulario */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-light-background rounded-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-playfair text-heading mb-6">
                Información de la Cita
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Personal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-heading placeholder-gray-400 focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="flex items-center gap-2 text-heading font-medium text-sm"
                    >
                      <Phone className="w-4 h-4 text-accent-primary" />
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-heading placeholder-gray-400 focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300"
                      placeholder="+51 989 164 990 o 989 164 990"
                      maxLength={15}
                    />
                  </div>
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
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-heading placeholder-gray-400 focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300"
                    placeholder="tu@email.com"
                  />
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
                    onChange={(service) =>
                      setFormData((prev) => ({ ...prev, service }))
                    }
                    required
                    placeholder="Busca y selecciona tu servicio..."
                  />
                </div>

                {/* Ubicación - MOVER ARRIBA */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-heading font-medium text-sm">
                    <MapPin className="w-4 h-4 text-accent-primary" />
                    Ubicación del Servicio *
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="locationType"
                        value="HOME"
                        checked={formData.locationType === "HOME"}
                        onChange={handleInputChange}
                        className="text-accent-primary focus:ring-accent-primary"
                      />
                      <Home className="w-5 h-5 text-accent-primary" />
                      <span className="text-heading">A domicilio</span>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="locationType"
                        value="STUDIO"
                        checked={formData.locationType === "STUDIO"}
                        onChange={handleInputChange}
                        className="text-accent-primary focus:ring-accent-primary"
                      />
                      <MapPin className="w-5 h-5 text-accent-primary" />
                      <span className="text-heading">En mi estudio</span>
                    </label>
                  </div>
                </div>

                {/* Fecha y Hora - MOVER ABAJO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-heading placeholder-gray-400 focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300"
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
                      disabled={!formData.date || !formData.service}
                      className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-heading focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300${!formData.date || !formData.service ? " opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <option value="">Selecciona un horario</option>
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
                            // Mostrar duración junto al rango
                            let duration = "";
                            if (formData.service.includes("Novia"))
                              duration = " (2h 30m)";
                            else if (
                              formData.service.includes("Social") ||
                              formData.service.includes("Madura")
                            )
                              duration = " (1h 30m)";
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
                    <p className="text-xs text-gray-500 mt-2">
                      * Solo se muestran horarios válidos según el servicio y
                      ubicación elegidos.
                      <br />* La duración se indica junto al horario.
                    </p>
                  </div>
                </div>

                {formData.locationType === "HOME" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="district"
                        className="text-heading font-medium text-sm flex items-center gap-1"
                      >
                        Distrito
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
                        Dirección
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required={formData.locationType === "HOME"}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-heading placeholder-gray-400 focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300"
                        placeholder="Dirección completa"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="addressReference"
                        className="text-heading font-medium text-sm"
                      >
                        Referencia
                      </label>
                      <input
                        type="text"
                        id="addressReference"
                        name="addressReference"
                        value={formData.addressReference}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-heading placeholder-gray-400 focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300"
                        placeholder="Referencia de ubicación"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-heading font-medium text-sm"
                  >
                    Mensaje Adicional
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-heading placeholder-gray-400 focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300"
                    placeholder="Detalles adicionales sobre tu evento o preferencias..."
                  />
                </div>

                {/* Desglose de precios */}
                {formData.service && (
                  <div className="space-y-2">
                    <PricingBreakdown
                      selectedService={formData.service}
                      locationType={formData.locationType}
                      district={formData.district}
                      onPriceCalculated={handlePriceCalculated}
                    />
                  </div>
                )}

                {submitMessage && (
                  <div
                    className={`p-4 rounded-lg ${
                      submitMessage.includes("éxito")
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-accent text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-primary-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Solicitud
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Información de Contacto */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="space-y-8">
              <div className="bg-light-background rounded-xl p-6 border border-gray-100">
                <h3 className="text-xl font-playfair text-heading mb-4">
                  Información de Contacto
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent-primary" />
                    <span className="text-main">+51 989 164 990</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-accent-primary" />
                    <span className="text-main">
                      contacto@marcelacordero.com
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-accent-primary" />
                    <span className="text-main">Pueblo Libre, Lima</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-accent-primary" />
                    <a
                      href="https://www.instagram.com/marcelacorderobeauty/"
                      className="text-main hover:text-accent-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @marcelacorderobeauty
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-light-background rounded-xl p-6 border border-gray-100">
                <h3 className="text-xl font-playfair text-heading mb-4">
                  Horarios de Atención
                </h3>

                <div className="space-y-3 text-main">
                  <div className="flex justify-between">
                    <span>Lunes - Viernes</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábados</span>
                    <span>9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingos</span>
                    <span>Solo eventos sociales</span>
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
