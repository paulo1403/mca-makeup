"use client";

import { TimeSlot } from "@/hooks/useAvailability";
import {
  Clock,
  Edit2,
  Trash2,
  Play,
  Pause,
  Plus,
  CheckCircle,
  XCircle,
  Moon,
  Sun,
} from "lucide-react";

const DAYS_OF_WEEK = [
  {
    name: "Domingo",
    short: "Dom",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
  },
  {
    name: "Lunes",
    short: "Lun",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    name: "Martes",
    short: "Mar",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    name: "Miércoles",
    short: "Mié",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    name: "Jueves",
    short: "Jue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    name: "Viernes",
    short: "Vie",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    name: "Sábado",
    short: "Sáb",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
];

interface TimeSlotListProps {
  timeSlots: TimeSlot[];
  onToggleAction: (id: string) => void;
  onDeleteAction: (id: string) => void;
  onEditAction?: (slot: TimeSlot) => void;
  isLoading?: boolean;
}

export default function TimeSlotList({
  timeSlots,
  onToggleAction,
  onDeleteAction,
  onEditAction,
  isLoading = false,
}: TimeSlotListProps) {
  const handleDelete = (id: string) => {
    if (confirm("¿Estás segura de que quieres eliminar este horario?")) {
      onDeleteAction(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tienes horarios configurados
        </h3>
        <p className="text-gray-600 mb-4">
          Configura tus días y horas de trabajo para que los clientes puedan
          reservar citas
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {DAYS_OF_WEEK.map((dayInfo, index) => {
        const daySlots = timeSlots.filter((slot) => slot.dayOfWeek === index);
        const hasSlots = daySlots.length > 0;
        const hasActiveSlots = daySlots.some((slot) => slot.isActive);

        return (
          <div
            key={index}
            className={`rounded-lg border-2 transition-all duration-200 ${
              hasSlots
                ? hasActiveSlots
                  ? `${dayInfo.bgColor} ${dayInfo.borderColor} shadow-sm`
                  : "bg-orange-50 border-orange-200 shadow-sm"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            {/* Header del día */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {index === 0 || index === 6 ? (
                    <Moon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Sun className="h-5 w-5 text-blue-500" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {dayInfo.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {daySlots.length} horario
                      {daySlots.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Indicador de estado */}
                {hasActiveSlots ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : hasSlots ? (
                  <Pause className="h-5 w-5 text-orange-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400" />
                )}
              </div>

              {/* Estado textual */}
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    hasActiveSlots
                      ? "bg-green-100 text-green-800"
                      : hasSlots
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {hasActiveSlots
                    ? "Disponible"
                    : hasSlots
                      ? "Pausado"
                      : "Sin horario"}
                </span>
              </div>
            </div>

            {/* Contenido del día */}
            <div className="p-3 sm:p-4">
              {daySlots.length > 0 ? (
                <div className="space-y-3">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`p-3 sm:p-4 rounded-lg border transition-all ${
                        slot.isActive
                          ? "bg-white border-green-200 shadow-sm"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      {/* Horario */}
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>

                        {/* Indicador de estado del slot */}
                        <div
                          className={`w-3 h-3 rounded-full ${
                            slot.isActive ? "bg-green-400" : "bg-gray-300"
                          }`}
                        />
                      </div>

                      {/* Botones de acción - Alineados horizontalmente */}
                      <div
                        className={`flex gap-2 ${onEditAction ? "space-x-0" : "space-x-0"}`}
                      >
                        {/* Botón Play/Pause */}
                        <button
                          onClick={() => onToggleAction(slot.id)}
                          disabled={isLoading}
                          className={`flex-1 flex items-center justify-center space-x-1 px-4 py-3 rounded-lg text-xs sm:text-sm font-medium transition-all disabled:opacity-50 ${
                            slot.isActive
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                              : "bg-[#D4AF37] bg-opacity-10 text-black hover:bg-[#D4AF37] hover:bg-opacity-20 border border-[#D4AF37] border-opacity-30"
                          }`}
                        >
                          {slot.isActive ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                          <span className="hidden xs:inline">
                            {slot.isActive ? "Pausar" : "Activar"}
                          </span>
                        </button>

                        {/* Botón Editar */}
                        {onEditAction && (
                          <button
                            onClick={() => onEditAction(slot)}
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center space-x-1 px-4 py-3 bg-blue-50 text-black hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors disabled:opacity-50 text-xs sm:text-sm font-medium"
                            title="Editar horario"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="hidden xs:inline">Editar</span>
                          </button>
                        )}

                        {/* Botón Eliminar */}
                        <button
                          onClick={() => handleDelete(slot.id)}
                          disabled={isLoading}
                          className="flex-1 flex items-center justify-center space-x-1 px-4 py-3 bg-[#B06579] bg-opacity-10 text-black hover:bg-[#B06579] hover:bg-opacity-20 border border-[#B06579] border-opacity-30 rounded-lg transition-colors disabled:opacity-50 text-xs sm:text-sm font-medium"
                          title="Eliminar horario"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden xs:inline">Eliminar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <XCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-3">Día libre</p>
                  <button
                    onClick={() => {
                      /* TODO: Agregar horario para este día específico */
                    }}
                    className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Agregar horario</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
