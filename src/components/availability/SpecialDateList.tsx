"use client";

import { SpecialDate } from "@/hooks/useAvailability";
import {
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Edit2,
} from "lucide-react";

interface SpecialDateListProps {
  specialDates: SpecialDate[];
  onDeleteAction: (id: string) => void;
  onEditAction?: (specialDate: SpecialDate) => void;
  isLoading?: boolean;
}

export default function SpecialDateList({
  specialDates,
  onDeleteAction,
  onEditAction,
  isLoading = false,
}: SpecialDateListProps) {
  const handleDelete = (id: string) => {
    if (confirm("¿Estás segura de que quieres eliminar esta fecha especial?")) {
      onDeleteAction(id);
    }
  };

  if (specialDates.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-4">
          No tienes fechas especiales configuradas. Puedes agregar días libres o
          horarios especiales.
        </p>
      </div>
    );
  }

  const sortedDates = specialDates.sort((a, b) => {
    // Crear fechas locales para ordenamiento correcto
    const [yearA, monthA, dayA] = a.date.split("-");
    const [yearB, monthB, dayB] = b.date.split("-");
    const dateA = new Date(
      parseInt(yearA),
      parseInt(monthA) - 1,
      parseInt(dayA),
    );
    const dateB = new Date(
      parseInt(yearB),
      parseInt(monthB) - 1,
      parseInt(dayB),
    );
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-3">
      {sortedDates.map((specialDate) => (
        <div
          key={specialDate.id}
          className={`p-4 rounded-lg border transition-all ${
            specialDate.isAvailable
              ? "bg-blue-50 border-blue-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex flex-col space-y-3">
            <div className="flex-1">
              {/* Fecha y estado */}
              <div className="flex items-center space-x-3 mb-2">
                {specialDate.isAvailable ? (
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <div className="font-medium text-gray-900">
                    {(() => {
                      // Crear la fecha manualmente para evitar problemas de zona horaria
                      const [year, month, day] = specialDate.date.split("-");
                      const localDate = new Date(
                        parseInt(year),
                        parseInt(month) - 1,
                        parseInt(day),
                      );
                      return localDate.toLocaleDateString("es-PE", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                    })()}
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      specialDate.isAvailable
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {specialDate.isAvailable ? "Disponible" : "No Disponible"}
                  </span>
                </div>
              </div>

              {/* Horario especial */}
              {specialDate.startTime && specialDate.endTime && (
                <div className="flex items-center space-x-2 mb-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    <strong>Horario especial:</strong> {specialDate.startTime} -{" "}
                    {specialDate.endTime}
                  </span>
                </div>
              )}

              {/* Nota */}
              {specialDate.note && (
                <div className="text-sm text-gray-600">
                  <strong>Nota:</strong> {specialDate.note}
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div
              className={`flex gap-2 ${onEditAction ? "space-x-0" : "space-x-0"}`}
            >
              {/* Botón Editar */}
              {onEditAction && (
                <button
                  onClick={() => onEditAction(specialDate)}
                  disabled={isLoading}
                  className="flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors disabled:opacity-50 text-xs sm:text-sm font-medium"
                  title="Editar fecha especial"
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="hidden xs:inline ml-1">Editar</span>
                </button>
              )}

              {/* Botón Eliminar */}
              <button
                onClick={() => handleDelete(specialDate.id)}
                disabled={isLoading}
                className="flex items-center justify-center px-3 py-2 bg-[#B06579] bg-opacity-10 text-[#9A5A6B] hover:bg-[#B06579] hover:bg-opacity-20 border border-[#B06579] border-opacity-30 rounded-lg transition-colors disabled:opacity-50 text-xs sm:text-sm font-medium"
                title="Eliminar fecha especial"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden xs:inline ml-1">Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
