"use client";

import { motion, useInView } from "framer-motion";
import { Calendar, Clock, Instagram, Mail, MapPin, MessageSquare, Phone, Star } from "lucide-react";
import { useRef } from "react";
import BookingFlow from "./BookingFlow";
import AvailabilityCheckSection from "./availability/AvailabilityCheckSection";
import Button from "./ui/Button";
import Typography from "./ui/Typography";
import TransportCostCalculator from "./TransportCostCalculator";
import "@/styles/components/contact.css";
import "@/styles/components/transport-calculator.css";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const contactInfo = [
    {
      label: "Teléfono",
      value: "+51 989 164 990",
      href: "tel:+51989164990",
      icon: Phone,
    },
    {
      label: "Email",
      value: "marcelacordero.bookings@gmail.com",
      href: "mailto:marcelacordero.bookings@gmail.com",
      icon: Mail,
    },
    {
      label: "Ubicación",
      value: "Av. Bolívar 1073, Pueblo Libre, Lima",
      href: "https://maps.google.com/?q=Av.+Bolívar+1073,+Pueblo+Libre,+Lima",
      icon: MapPin,
    },
    {
      label: "Horarios",
      value: "Lun - Dom: 9:00 AM - 8:00 PM",
      href: undefined,
      icon: Clock,
    },
  ];

  const quickActions = [
    {
      label: "WhatsApp",
      href: "https://wa.me/51989164990?text=Hola%20Marcela,%20me%20interesa%20agendar%20una%20cita",
      variant: "primary" as const,
      icon: MessageSquare,
    },
  ];

  return (
    <section
      id="contacto"
      className="contact-section py-10 sm:py-20 relative overflow-hidden"
      style={{ scrollMarginTop: "120px" }}
      ref={sectionRef}
    >
      {/* Elementos decorativos */}
      <div className="contact-decoration contact-decoration--1 hidden sm:block" />
      <div className="contact-decoration contact-decoration--2 hidden sm:block" />

      <div className="contact-container px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="contact-header mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="contact-badge hidden sm:inline-flex">
            <Calendar className="w-4 h-4" />
            <span>Reserva tu Cita</span>
          </div>

          <Typography
            as="h2"
            variant="h2"
            className="contact-title text-3xl sm:text-4xl lg:text-5xl font-bold"
          >
            Contacta y Reserva tu Cita
          </Typography>

          <Typography
            as="p"
            variant="p"
            className="contact-description hidden sm:block text-base sm:text-lg"
          >
            Completa el proceso en cinco pasos: selecciona tus servicios, ingresa tus datos, indica
            la ubicación, elige fecha y horario, y confirma. Te contactaré para coordinar cualquier
            detalle adicional.
          </Typography>

          <Typography
            as="p"
            variant="p"
            className="contact-subtitle hidden sm:block text-sm sm:text-base"
          >
            Puedes avanzar y retroceder entre pasos sin perder tu selección. Si prefieres
            asistencia, escríbeme y te guío en el proceso.
          </Typography>
        </motion.div>

        {/* Layout principal */}
        <div className="contact-layout gap-6 sm:gap-10">
          {/* Información de contacto */}
          <motion.div
            className="contact-info hidden lg:block"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Información de contacto */}
            <div className="contact-info-card hidden lg:block">
              <Typography as="h3" variant="h3" className="contact-info-title text-xl">
                <Star className="contact-info-icon" />
                Información de Contacto
              </Typography>

              <ul className="contact-info-list">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <li key={index} className="contact-info-item">
                      <IconComponent className="contact-info-icon" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[color:var(--contact-accent)]">
                          {info.label}
                        </span>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="contact-info-link"
                            target={info.href.startsWith("http") ? "_blank" : undefined}
                            rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          >
                            {info.value}
                          </a>
                        ) : (
                          <span>{info.value}</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Redes sociales */}
              <div className="contact-social">
                <a
                  href="https://www.instagram.com/marcelacorderobeauty/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-link"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/51989164990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-link"
                  aria-label="WhatsApp"
                >
                  <MessageSquare className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="contact-info-card">
              <Typography as="h3" variant="h3" className="contact-info-title text-xl">
                <MessageSquare className="contact-info-icon" />
                Contacto Directo
              </Typography>

              <div className="contact-quick-actions">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Button
                      key={index}
                      variant={action.variant}
                      size="md"
                      as="a"
                      href={action.href}
                      className="flex-1 justify-center gap-2"
                      target={action.href.startsWith("http") ? "_blank" : undefined}
                      rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      <IconComponent className="w-4 h-4" />
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Calculadora de Transporte */}
            <TransportCostCalculator />
          </motion.div>

          {/* Formulario de reserva */}
          <motion.div
            className="contact-form-wrapper"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AvailabilityCheckSection />
            <BookingFlow />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
