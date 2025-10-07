"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Clock } from "lucide-react";
import Button from "./ui/Button";
import useServices from '@/hooks/useServices';



export default function ServicesSection() {
  const { data: services = [], isLoading: loading } = useServices();

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <section
      id="servicios"
      className="py-16 sm:py-20 section-bg-services"
      ref={ref}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header - Más minimalista */}
        <motion.div
          className="text-center mb-8 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl section-title text-heading mb-3 sm:mb-4">
            Descubre Nuestros Servicios Premium
          </h2>
          <p className="text-base sm:text-lg text-main max-w-2xl mx-auto leading-relaxed px-2">
            Maquillaje profesional para novias y eventos con atención personalizada
          </p>
        </motion.div>

        {/* Services Grid - Diseño más limpio y responsivo */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {loading
            ? // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="text-center">
                  <div className="service-card animate-pulse">
                    <div className="h-5 sm:h-6 bg-[color:var(--color-surface-2)] rounded mb-3 sm:mb-4 mx-auto w-3/4"></div>
                    <div className="space-y-2 mb-4 sm:mb-6">
                      <div className="h-3 sm:h-4 bg-[color:var(--color-surface-2)] rounded"></div>
                      <div className="h-3 sm:h-4 bg-[color:var(--color-surface-2)] rounded"></div>
                      <div className="h-3 sm:h-4 bg-[color:var(--color-surface-2)] rounded"></div>
                    </div>
                    <div className="h-6 sm:h-8 bg-[color:var(--color-surface-2)] rounded mb-3 sm:mb-4 mx-auto w-1/2"></div>
                    <div className="h-10 bg-[color:var(--color-surface-2)] rounded mx-auto w-3/4"></div>
                  </div>
                </div>
              ))
            : services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="service-card transition-all duration-300 hover:shadow-lg active:scale-[0.98] relative">
                    {/* Indicador visual de que es clickeable en mobile */}
                    <div className="absolute top-3 right-3 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl section-title text-heading mb-3 sm:mb-4">
                      {service.title}
                    </h3>

                    <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                      {service.features.map((feature, idx) => (
                        <p key={idx} className="text-xs sm:text-sm text-main leading-relaxed flex items-start">
                          <span className="feature-bullet mt-1 mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </p>
                      ))}
                    </div>

                    <div className="service-price text-xl sm:text-2xl font-light text-accent-primary mb-4">
                      {service.price}
                    </div>

                    <div className="w-full sm:w-auto">
                      <Button
                        variant="secondary"
                        size="md"
                        className="w-full sm:w-auto"
                        onClick={() => window.open(service.portfolioUrl, "_blank")}
                      >
                        Ver portafolio
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
        </motion.div>

        {/* Contact Information - Optimizado para mobile */}
        <motion.div
          className="mt-12 sm:mt-16 lg:mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="attention-card max-w-2xl mx-auto">
            <h3 className="text-lg sm:text-xl font-playfair mb-3 sm:mb-4 text-heading">
              Atención Personalizada
            </h3>
            <p className="text-sm sm:text-base text-main mb-4 sm:mb-6 leading-relaxed px-2 sm:px-0">
              Servicios profesionales en nuestro estudio en Av. Bolívar 1073,
              Pueblo Libre o en la ubicación de tu preferencia
            </p>
            <div className="flex flex-col xs:flex-row gap-4 sm:gap-6 justify-center items-center text-xs sm:text-sm text-main">
              <div className="flex items-center min-h-[44px]">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent-primary mr-2 flex-shrink-0" />
                <span>Servicio a domicilio</span>
              </div>
              <div className="flex items-center min-h-[44px]">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-accent-primary mr-2 flex-shrink-0" />
                <span>Horarios flexibles</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
