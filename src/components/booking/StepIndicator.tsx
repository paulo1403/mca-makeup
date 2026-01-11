import { Check } from "lucide-react";
import React from "react";
import "@/styles/components/step-indicator.css";

interface Props {
  currentStep: number;
  totalSteps: number;
  visibleSteps?: number[]; // Lista de pasos que deben mostrarse
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  visibleSteps,
}: Props) {
  const steps =
    visibleSteps || Array.from({ length: totalSteps }, (_, i) => i + 1);

  const allStepNames = [
    "Información Personal",
    "Servicios",
    "Ubicación",
    "Fecha y Hora",
    "Confirmación",
  ];

  const stepNames = steps.map((s) => allStepNames[s - 1]);
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <div className="step-indicator">
      {/* Versión mobile: stepper sin números */}
      <div className="step-indicator-mobile">
        {steps.map((s) => {
          const isActive = s === currentStep;
          const isCompleted = s < currentStep;
          return (
            <div key={s} className="flex flex-col items-center">
              <div
                className={`step-circle ${
                  isActive
                    ? "step-circle--active"
                    : isCompleted
                    ? "step-circle--completed"
                    : "step-circle--inactive"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Versión desktop: línea de progreso con etiquetas */}
      <div className="step-indicator-desktop">
        <div className="step-progress-container">
          {/* Línea de progreso base */}
          <div className="step-progress-base" />

          {/* Línea de progreso activa */}
          <div
            className="step-progress-active"
            style={{
              width: `${
                (Math.max(currentStepIndex, 0) /
                  Math.max(steps.length - 1, 1)) *
                100
              }%`,
            }}
          />

          {/* Puntos de paso */}
          <div className="step-points">
            {steps.map((s) => {
              const isActive = s === currentStep;
              const isCompleted = s < currentStep;
              return (
                <div key={s} className="step-point">
                  <div
                    className={`step-point-circle ${
                      isActive
                        ? "step-point-circle--active"
                        : isCompleted
                        ? "step-point-circle--completed"
                        : "step-point-circle--inactive"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : null}
                  </div>

                  <span
                    className={`step-label ${
                      isActive
                        ? "step-label--active"
                        : isCompleted
                        ? "step-label--completed"
                        : "step-label--inactive"
                    }`}
                  >
                    {stepNames[s - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
