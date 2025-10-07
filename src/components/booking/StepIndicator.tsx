import React from 'react'
import { Check } from 'lucide-react'

interface Props {
  currentStep: number
  totalSteps: number
}

export default function StepIndicator({ currentStep, totalSteps }: Props) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)
  return (
    <div className="flex items-center justify-center lg:justify-start gap-4">
      {steps.map((s) => {
        const isActive = s === currentStep
        const isCompleted = s < currentStep
        return (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                isActive
                  ? 'bg-accent-primary'
                  : isCompleted
                  ? 'bg-accent-secondary'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
              }`}
            >
              {isCompleted ? <Check className="w-5 h-5" /> : s}
            </div>
            {s !== totalSteps && <div className="w-6 h-0.5 bg-gray-200 dark:bg-gray-700 mx-3 hidden sm:block" />}
          </div>
        )
      })}
    </div>
  )
}
