'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SectionTransitionProps {
  type?: 'minimal' | 'decorated' | 'glow' | 'animated' | 'multi';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  showParticles?: boolean;
}

export default function SectionTransition({ 
  type = 'minimal', 
  spacing = 'md',
  showParticles = false 
}: SectionTransitionProps) {
  const getClassName = () => {
    const base = `section-divider-${type}`;
    const spacingClass = `divider-spacing-${spacing}`;
    return `${base} ${spacingClass}`;
  };

  return (
    <div className="relative py-4 md:py-6"> {/* Reducido de py-8 md:py-12 */}
      {/* Fondo difuminado más sutil para la transición */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent" />
      
      {/* Efecto de difuminado superior más pequeño */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/20 to-transparent blur-sm" />
      
      {/* Efecto de difuminado inferior más pequeño */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/20 to-transparent blur-sm" />
      {/* Partículas decorativas */}
      {showParticles && (
        <>
          <motion.div
            className="absolute left-1/4 top-1/2 transform -translate-y-1/2"
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-4 h-4 text-primary-accent/40" />
          </motion.div>
          
          <motion.div
            className="absolute right-1/4 top-1/2 transform -translate-y-1/2"
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Sparkles className="w-3 h-3 text-secondary-accent/30" />
          </motion.div>
        </>
      )}
      
      {/* Línea principal del divisor */}
      <motion.div 
        className={getClassName()}
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      
      {/* Efecto de resplandor adicional para ciertos tipos */}
      {(type === 'glow' || type === 'animated') && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-accent/5 to-transparent blur-xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.5 }}
        />
      )}
    </div>
  );
}
