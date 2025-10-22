"use client";

import Button from "@/components/ui/Button";
import Modal, { ModalHeader, ModalBody } from "@/components/ui/Modal";
import Typography from "@/components/ui/Typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Home } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const timeSlotSchema = z
  .object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string().min(1, "Hora de inicio es requerida"),
    endTime: z.string().min(1, "Hora de fin es requerida"),
    locationType: z.enum(["STUDIO", "HOME"]),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "La hora de fin debe ser posterior a la de inicio",
    path: ["endTime"],
  });

type TimeSlotFormData = z.infer<typeof timeSlotSchema>;

const DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

interface AddTimeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    locationType: "STUDIO" | "HOME";
  }) => void;
  isLoading: boolean;
  preselectedDay?: number | null;
  preselectedLocation?: "STUDIO" | "HOME" | null;
}

export default function AddTimeSlotModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  preselectedDay = null,
  preselectedLocation = null,
}: AddTimeSlotModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TimeSlotFormData>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: {
      dayOfWeek: preselectedDay ?? 1,
      startTime: "09:00",
      endTime: "17:00",
      locationType: preselectedLocation ?? "STUDIO",
    },
  });

  const selectedLocationType = watch("locationType");

  // Update form values when preselected values change
  useEffect(() => {
    if (isOpen && preselectedDay !== null) {
      setValue("dayOfWeek", preselectedDay);
    }
    if (isOpen && preselectedLocation !== null) {
      setValue("locationType", preselectedLocation);
    }
  }, [isOpen, preselectedDay, preselectedLocation, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = (data: TimeSlotFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={handleClose} size="sm" ariaLabelledBy="add-timeslot-title">
      <ModalHeader
        title={
          <Typography as="span" id="add-timeslot-title" variant="h3">
            Agregar Horario de Trabajo
          </Typography>
        }
        onClose={handleClose}
      />
      <ModalBody>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <Typography
              as="label"
              variant="small"
              className="block text-sm font-medium text-[color:var(--color-heading)] mb-2"
            >
              Tipo de Servicio
            </Typography>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedLocationType === "STUDIO"
                    ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]"
                    : "border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-elevated)] text-[color:var(--color-body)]"
                }`}
              >
                <input
                  type="radio"
                  value="STUDIO"
                  {...register("locationType")}
                  className="text-[color:var(--color-primary)] focus:ring-[color:var(--color-primary)]"
                />
                <Building
                  className={`h-4 w-4 ${selectedLocationType === "STUDIO" ? "text-[color:var(--color-primary)]" : "text-[color:var(--color-muted)]"}`}
                />
                <Typography as="span" variant="small" className="font-medium">
                  En Estudio
                </Typography>
              </label>

              <label
                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedLocationType === "HOME"
                    ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]"
                    : "border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-elevated)] text-[color:var(--color-body)]"
                }`}
              >
                <input
                  type="radio"
                  value="HOME"
                  {...register("locationType")}
                  className="text-[color:var(--color-primary)] focus:ring-[color:var(--color-primary)]"
                />
                <Home
                  className={`h-4 w-4 ${selectedLocationType === "HOME" ? "text-[color:var(--color-primary)]" : "text-[color:var(--color-muted)]"}`}
                />
                <Typography as="span" variant="small" className="font-medium">
                  A Domicilio
                </Typography>
              </label>
            </div>
            {errors.locationType && (
              <Typography variant="caption" className="text-red-500 mt-1">
                {errors.locationType.message}
              </Typography>
            )}
          </div>

          <div>
            <Typography
              as="label"
              variant="small"
              className="block text-sm font-medium text-[color:var(--color-heading)] mb-1"
            >
              Día de la semana
            </Typography>
            <select
              {...register("dayOfWeek", { valueAsNumber: true })}
              className="w-full px-3 py-2 border rounded-lg border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-body)] focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]"
            >
              {DAYS_OF_WEEK.map((day, index) => (
                <option key={index} value={index}>
                  {day}
                </option>
              ))}
            </select>
            {errors.dayOfWeek && (
              <Typography variant="caption" className="text-red-500 mt-1">
                {errors.dayOfWeek.message}
              </Typography>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Typography
                as="label"
                variant="small"
                className="block text-sm sm:text-base font-semibold text-[color:var(--color-heading)] mb-2 sm:mb-3"
              >
                Hora de inicio
              </Typography>
              <input
                type="time"
                {...register("startTime")}
                className="w-full p-3 sm:p-2 border rounded-lg border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] text-[color:var(--color-body)] focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]"
                style={{ colorScheme: "dark" }}
              />
              {errors.startTime && (
                <Typography variant="caption" className="text-red-500 mt-1">
                  {errors.startTime.message}
                </Typography>
              )}
            </div>
            <div>
              <Typography
                as="label"
                variant="small"
                className="block text-sm sm:text-base font-semibold text-[color:var(--color-heading)] mb-2 sm:mb-3"
              >
                Hora de fin
              </Typography>
              <input
                type="time"
                {...register("endTime")}
                className="w-full p-3 sm:p-2 border rounded-lg border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] text-[color:var(--color-body)] focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]"
                style={{ colorScheme: "dark" }}
              />
              {errors.endTime && (
                <Typography variant="caption" className="text-red-500 mt-1">
                  {errors.endTime.message}
                </Typography>
              )}
            </div>
          </div>

          <div className="bg-[color:var(--color-accent)]/6 border border-[color:var(--color-accent)]/20 rounded-lg p-3">
            <Typography variant="small" className="text-[color:var(--color-on-surface)]">
              <span className="font-semibold">Ejemplo:</span> Si trabajas los lunes de 9:00 AM a
              5:00 PM, selecciona &quot;Lunes&quot;, hora de inicio &quot;09:00&quot; y hora de fin
              &quot;17:00&quot;.
            </Typography>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-3 mt-6">
            <Button
              as="button"
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              variant="ghost"
              size="md"
            >
              Cancelar
            </Button>
            <Button as="button" type="submit" disabled={isLoading} variant="primary" size="md">
              {isLoading ? "Guardando..." : "Agregar Horario"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
