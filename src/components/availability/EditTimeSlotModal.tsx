"use client";

import Button from "@/components/ui/Button";
import Modal, { ModalHeader, ModalBody } from "@/components/ui/Modal";
import Typography from "@/components/ui/Typography";
import type { TimeSlot } from "@/hooks/useAvailability";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Home } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const editTimeSlotSchema = z
  .object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string().min(1, "La hora de inicio es requerida"),
    endTime: z.string().min(1, "La hora de fin es requerida"),
    locationType: z.enum(["STUDIO", "HOME"]),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "La hora de inicio debe ser anterior a la hora de fin",
    path: ["endTime"],
  });

type EditTimeSlotForm = z.infer<typeof editTimeSlotSchema>;

interface EditTimeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: EditTimeSlotForm) => void;
  slot: TimeSlot | null;
  isLoading?: boolean;
}

export default function EditTimeSlotModal({
  isOpen,
  onClose,
  onSubmit,
  slot,
  isLoading = false,
}: EditTimeSlotModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<EditTimeSlotForm>({
    resolver: zodResolver(editTimeSlotSchema),
  });

  const selectedLocationType = watch("locationType");

  useEffect(() => {
    if (slot && isOpen) {
      setValue("dayOfWeek", slot.dayOfWeek);
      setValue("startTime", slot.startTime);
      setValue("endTime", slot.endTime);
      setValue("locationType", slot.locationType);
    }
  }, [slot, isOpen, setValue]);

  const handleFormSubmit = (data: EditTimeSlotForm) => {
    if (slot) {
      onSubmit(slot.id, data);
      reset();
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !slot) return null;

  return (
    <Modal
      open={isOpen && !!slot}
      onClose={handleClose}
      size="sm"
      ariaLabelledBy="edit-timeslot-title"
    >
      <ModalHeader title="Editar Horario" onClose={handleClose} />
      <ModalBody>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Typography
                as="label"
                variant="small"
                className="block text-sm font-medium text-[color:var(--color-muted)] mb-2"
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
                    className={`h-4 w-4 ${
                      selectedLocationType === "STUDIO"
                        ? "text-[color:var(--color-primary)]"
                        : "text-[color:var(--color-muted)]"
                    }`}
                  />
                  <Typography variant="small" className="font-medium">
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
                    className={`h-4 w-4 ${
                      selectedLocationType === "HOME"
                        ? "text-[color:var(--color-primary)]"
                        : "text-[color:var(--color-muted)]"
                    }`}
                  />
                  <Typography variant="small" className="font-medium">
                    A Domicilio
                  </Typography>
                </label>
              </div>
              {errors.locationType && (
                <p className="text-red-500 text-sm mt-1">{errors.locationType.message}</p>
              )}
            </div>

            <div>
              <Typography
                as="label"
                variant="small"
                className="block text-sm font-medium text-[color:var(--color-muted)] mb-1"
              >
                Día de la semana
              </Typography>
              <select
                {...register("dayOfWeek", { valueAsNumber: true })}
                className="w-full px-3 py-2 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] text-[color:var(--color-body)] focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]"
              >
                {DAYS_OF_WEEK.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
              {errors.dayOfWeek && (
                <p className="text-red-500 text-sm mt-1">{errors.dayOfWeek.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[color:var(--color-heading)] mb-2">
                Hora de inicio
              </label>
              <input
                type="time"
                {...register("startTime")}
                className="w-full p-3 border rounded-lg border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] text-[color:var(--color-body)] focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]"
                style={{ colorScheme: "dark" }}
              />
              {errors.startTime && (
                <p className="text-red-600 text-sm mt-1">{errors.startTime.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[color:var(--color-heading)] mb-2">
                Hora de fin
              </label>
              <input
                type="time"
                {...register("endTime")}
                className="w-full p-3 border rounded-lg border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] text-[color:var(--color-body)] focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]"
                style={{ colorScheme: "dark" }}
              />
              {errors.endTime && (
                <p className="text-red-600 text-sm mt-1">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className="bg-[color:var(--color-primary)]/10 border border-[color:var(--color-primary)]/30 rounded-lg p-3">
            <Typography variant="small" className="text-[color:var(--color-primary)]">
              <strong>Editando:</strong> {DAYS_OF_WEEK[slot.dayOfWeek]} de {slot.startTime} a{" "}
              {slot.endTime}
            </Typography>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="ghost"
              size="md"
              className="min-w-[120px]"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              size="md"
              className="min-w-[160px]"
            >
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
