"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Camera, Palette } from "lucide-react";

export default function AboutSection() {
  const achievements = [
    {
      icon: Award,
      title: "Alumna Destacada",
      description:
        "Graduada de MUS by Christian Matta con reconocimiento especial",
    },
    {
      icon: Camera,
      title: "Desde 2017",
      description:
        "Experiencia en salón, producciones y servicio independiente",
    },
    {
      icon: Palette,
      title: "Capacitación Continua",
      description:
        "Masterclasses con maquilladores internacionales reconocidos",
    },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="sobre-mi" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-playfair text-heading mb-4">
            Sobre Mí
          </h2>
          <h3 className="text-2xl font-playfair text-accent-primary">
            Marcela Cordero
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Side - Primero en desktop */}
          <motion.div
            className="space-y-6 order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Story simple y elegante */}
            <div className="space-y-6">
              <p className="text-main text-lg leading-relaxed">
                Conocí el mundo del maquillaje en el 2016 y empecé a hacer mis
                primeros trabajos en el 2017. He tenido la oportunidad de
                trabajar en salón, para producciones y como maquilladora
                independiente.
              </p>

              <p className="text-main text-lg leading-relaxed">
                Estudié la carrera de Maquillaje profesional en MUS by Christian
                Matta para seguir puliendo mi técnica y de la cual me gradué
                como alumna destacada. Además, me capacito de manera continua
                asistiendo a Masterclasses de diferentes maquilladores
                internacionales.
              </p>
            </div>

            {/* CTA Button bien posicionado */}
            <motion.div
              className="pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                className="bg-accent-primary text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-accent-primary/90 hover:shadow-lg w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  window.open(
                    "https://wa.me/51989164990?text=Hola%2C%20me%20interesa%20agendar%20una%20cita%20de%20maquillaje",
                    "_blank"
                  )
                }
              >
                Reservar Cita
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Image Side - Segundo en desktop */}
          <motion.div
            className="relative order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative h-80 sm:h-96 lg:h-[500px] xl:h-[550px] rounded-2xl overflow-hidden mx-auto max-w-sm lg:max-w-md xl:max-w-lg shadow-xl">
              <div
                className="absolute inset-0 bg-cover bg-no-repeat"
                style={{
                  backgroundImage: `url('https://marcelacorderomakeup.my.canva.site/_assets/media/6d0773b57fb0bc5f1db1ada4d9461476.jpg')`,
                  backgroundPosition: '50% 40%', // Centra la cara de Marcela
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              
              {/* Quote overlay para desktop */}
              <div className="hidden lg:block absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-sm italic text-gray-700 text-center">
                  &ldquo;La belleza comienza cuando decides ser tú misma&rdquo;
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Logros minimalistas */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-playfair text-heading">
              Experiencia y Certificaciones
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-light-background rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-accent-primary mb-4 flex justify-center">
                  <achievement.icon className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-playfair text-heading mb-3">
                  {achievement.title}
                </h4>
                <p className="text-main text-sm leading-relaxed">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
