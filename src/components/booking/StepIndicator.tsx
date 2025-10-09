import React from 'react'
import { Check } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

interface Props {
  currentStep: number
  totalSteps: number
}

export default function StepIndicator({ currentStep, totalSteps }: Props) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)
  const { theme } = useTheme()

  const stepNames = [
    'Información Personal',
    'Servicios',
    'Ubicación',
    'Fecha y Hora',
    'Confirmación'
  ]

  return (
    <div className="mb-8">
      {/* Versión mobile: stepper sin números */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 md:hidden">
        {steps.map((s) => {
          const isActive = s === currentStep
          const isCompleted = s < currentStep
          return (
            <div key={s} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md ${
                  isActive
                    ? 'bg-[#FF007F] ring-4 ring-[#FF007F]/30 shadow-lg'
                    : isCompleted
                      ? 'bg-[#FFC72C]'
                      : `border-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : null}
              </div>
              {s !== totalSteps && (
                <div className="w-6 h-0.5 bg-subtle mx-1 hidden" />
              )}
            </div>
          )
        })}
      </div>

      {/* Versión desktop: línea de progreso con etiquetas */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Línea de progreso base */}
          <div className={`absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

          {/* Línea de progreso activa */}
          <div
            className="absolute top-1/2 left-0 h-1 bg-[#FF007F] -translate-y-1/2 rounded-full shadow-[0_0_12px_rgba(0,0,0,0.06)]"
            style={{ width: `${(Math.max(currentStep - 1, 0) / (totalSteps - 1)) * 100}%` }}
          />

          {/* Puntos de paso (sin números) */}
          <div className="relative flex justify-between">
            {steps.map((s) => {
              const isActive = s === currentStep
              const isCompleted = s < currentStep
              return (
                <div key={s} className="flex flex-col items-center pt-6 pb-2">
                  <div className="absolute -top-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg ${
                        isActive
                          ? 'bg-[#FF007F] ring-4 ring-[#FF007F]/30 shadow-lg'
                          : isCompleted
                            ? 'bg-[#FFC72C]'
                            : `border-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 text-white" /> : null}
                    </div>
                  </div>

                  <span
                    className={`mt-5 text-xs font-medium ${
                      isActive
                        ? 'text-[#FF007F] font-semibold'
                        : isCompleted
                          ? 'text-[#FFC72C]'
                          : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {stepNames[s - 1]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
