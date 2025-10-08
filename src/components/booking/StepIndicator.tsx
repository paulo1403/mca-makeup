import React from 'react'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  currentStep: number
  totalSteps: number
}

export default function StepIndicator({ currentStep, totalSteps }: Props) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)
  
  // Nombres de los pasos para mostrar en desktop
  const stepNames = [
    'Información Personal',
    'Servicios',
    'Ubicación',
    'Fecha y Hora',
    'Confirmación'
  ]
  
  return (
    <div className="mb-8">
      {/* Versión mobile: círculos con números */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 md:hidden">
        {steps.map((s) => {
          const isActive = s === currentStep
          const isCompleted = s < currentStep
          return (
            <div key={s} className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-md ${
                  isActive
                    ? 'bg-accent-primary'
                    : isCompleted
                    ? 'bg-accent-secondary'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : s}
              </motion.div>
              {s !== totalSteps && (
                <div className="w-6 h-0.5 bg-gray-200 dark:bg-gray-700 mx-1 hidden" />
              )}
            </div>
          )
        })}
      </div>
      
      {/* Versión desktop: línea de progreso con etiquetas */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Línea de progreso base */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 rounded-full"></div>
          
          {/* Línea de progreso activa */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-accent-primary to-accent-secondary -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${(Math.max(currentStep - 1, 0) / (totalSteps - 1)) * 100}%` }}
          ></div>
          
          {/* Puntos de paso */}
          <div className="relative flex justify-between">
            {steps.map((s) => {
              const isActive = s === currentStep
              const isCompleted = s < currentStep
              return (
                <div key={s} className="flex flex-col items-center pt-6 pb-2">
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: s * 0.1 }}
                    className="absolute -top-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg ${
                        isActive
                          ? 'bg-accent-primary ring-4 ring-accent-primary/20'
                          : isCompleted
                          ? 'bg-accent-secondary'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : s}
                    </motion.div>
                  </motion.div>
                  
                  <motion.span
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: s * 0.1 + 0.2 }}
                    className={`mt-5 text-xs font-medium ${
                      isActive
                        ? 'text-accent-primary'
                        : isCompleted
                        ? 'text-accent-secondary'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {stepNames[s-1]}
                  </motion.span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
