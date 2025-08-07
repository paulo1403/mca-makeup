"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Building, Home } from "lucide-react";
import { TimeSlot } from "@/hooks/useAvailability";

const DAYS_OF_WEEK = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Editar Horario
          </h3>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Servicio
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedLocationType === "STUDIO"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    value="STUDIO"
                    {...register("locationType")}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <Building
                    className={`h-4 w-4 ${selectedLocationType === "STUDIO" ? "text-blue-600" : "text-gray-500"}`}
                  />
                  <span className="text-sm font-medium">En Estudio</span>
                </label>

                <label
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedLocationType === "HOME"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    value="HOME"
                    {...register("locationType")}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <Home
                    className={`h-4 w-4 ${selectedLocationType === "HOME" ? "text-green-600" : "text-gray-500"}`}
                  />
                  <span className="text-sm font-medium">A Domicilio</span>
                </label>
              </div>
              {errors.locationType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.locationType.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Día de la semana
              </label>
              <select
                {...register("dayOfWeek", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {DAYS_OF_WEEK.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
              {errors.dayOfWeek && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dayOfWeek.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Hora de inicio
              </label>
              <input
                type="time"
                {...register("startTime")}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-black bg-white focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                style={{ colorScheme: "light" }}
              />
              {errors.startTime && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.startTime.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Hora de fin
              </label>
              <input
                type="time"
                {...register("endTime")}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-black bg-white focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                style={{ colorScheme: "light" }}
              />
              {errors.endTime && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Editando:</strong> {DAYS_OF_WEEK[slot.dayOfWeek]} de{" "}
              {slot.startTime} a {slot.endTime}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
