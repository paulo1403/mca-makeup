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
  console.log(theme)

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
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold shadow-md ${isActive
                    ? 'bg-gradient-to-br from-accent-primary to-accent-secondary on-accent-contrast ring-4 ring-accent-primary/20 shadow-lg'
                    : isCompleted
                      ? 'bg-accent-secondary text-white'
                      : 'bg-subtle text-[color:var(--color-body)]'
                  }`}
              >
                {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : s}
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
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-subtle -translate-y-1/2 rounded-full"></div>

          {/* Línea de progreso activa */}
          <div
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-accent-primary to-accent-secondary -translate-y-1/2 rounded-full shadow-[0_0_12px_rgba(0,0,0,0.06)]"
            style={{ width: `${(Math.max(currentStep - 1, 0) / (totalSteps - 1)) * 100}%` }}
          />

          {/* Puntos de paso */}
          <div className="relative flex justify-between">
            {steps.map((s) => {
              const isActive = s === currentStep
              const isCompleted = s < currentStep
              return (
                <div key={s} className="flex flex-col items-center pt-6 pb-2">
                  <div className="absolute -top-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium shadow-lg ${isActive
                          ? 'bg-gradient-to-br from-accent-primary to-accent-secondary on-accent-contrast ring-4 ring-accent-primary/20 shadow-lg'
                          : isCompleted
                            ? 'bg-accent-secondary text-white'
                            : 'bg-subtle text-[color:var(--color-body)]'
                        }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : s}
                    </div>
                  </div>

                  <span
                    className={`mt-5 text-xs font-medium ${isActive
                        ? 'text-accent-primary font-semibold'
                        : isCompleted
                          ? 'text-accent-secondary'
                          : 'text-[color:var(--color-muted)]'
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
