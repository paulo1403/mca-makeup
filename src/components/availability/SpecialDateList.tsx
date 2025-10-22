"use client";

import type { SpecialDate } from "@/hooks/useAvailability";
import { Calendar, CheckCircle, Clock, Edit2, Trash2, XCircle } from "lucide-react";

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
    onDeleteAction(id);
  };

  if (specialDates.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="mx-auto h-12 w-12 text-[color:var(--color-muted)] mb-4" />
        <p className="text-[color:var(--color-body)] mb-4">
          No tienes fechas especiales configuradas. Puedes agregar días libres o horarios
          especiales.
        </p>
      </div>
    );
  }

  const sortedDates = specialDates.sort((a, b) => {
    // Crear fechas locales para ordenamiento correcto
    const [yearA, monthA, dayA] = a.date.split("-");
    const [yearB, monthB, dayB] = b.date.split("-");
    const dateA = new Date(
      Number.parseInt(yearA),
      Number.parseInt(monthA) - 1,
      Number.parseInt(dayA),
    );
    const dateB = new Date(
      Number.parseInt(yearB),
      Number.parseInt(monthB) - 1,
      Number.parseInt(dayB),
    );
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-3">
      {sortedDates.map((specialDate) => (
        <div
          key={specialDate.id}
          className={`p-4 rounded-lg border transition-all`}
          style={
            specialDate.isAvailable
              ? {
                  backgroundColor: "var(--status-confirmed-bg)",
                  borderColor: "var(--status-confirmed-border)",
                }
              : {
                  backgroundColor: "var(--status-cancelled-bg)",
                  borderColor: "var(--status-cancelled-border)",
                }
          }
        >
          <div className="flex flex-col space-y-3">
            <div className="flex-1">
              {/* Fecha y estado */}
              <div className="flex items-center space-x-3 mb-2">
                {specialDate.isAvailable ? (
                  <CheckCircle
                    className="h-5 w-5"
                    style={{ color: "var(--status-confirmed-text)" }}
                  />
                ) : (
                  <XCircle className="h-5 w-5" style={{ color: "var(--status-cancelled-text)" }} />
                )}
                <div>
                  <div className="font-medium text-[color:var(--color-heading)]">
                    {(() => {
                      // Crear la fecha manualmente para evitar problemas de zona horaria
                      const [year, month, day] = specialDate.date.split("-");
                      const localDate = new Date(
                        Number.parseInt(year),
                        Number.parseInt(month) - 1,
                        Number.parseInt(day),
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
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 border`}
                    style={
                      specialDate.isAvailable
                        ? {
                            backgroundColor: "var(--status-confirmed-bg)",
                            color: "var(--status-confirmed-text)",
                            borderColor: "var(--status-confirmed-border)",
                          }
                        : {
                            backgroundColor: "var(--status-cancelled-bg)",
                            color: "var(--status-cancelled-text)",
                            borderColor: "var(--status-cancelled-border)",
                          }
                    }
                  >
                    {specialDate.isAvailable ? "Disponible" : "No Disponible"}
                  </span>
                </div>
              </div>

              {/* Horario especial */}
              {specialDate.startTime && specialDate.endTime && (
                <div className="flex items-center space-x-2 mb-2 text-sm text-[color:var(--color-body)]">
                  <Clock className="h-4 w-4" />
                  <span>
                    <strong>Horario especial:</strong> {specialDate.startTime} - {""}
                    {specialDate.endTime}
                  </span>
                </div>
              )}

              {/* Nota */}
              {specialDate.note && (
                <div className="text-sm text-[color:var(--color-body)]">
                  <strong>Nota:</strong> {specialDate.note}
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className={`flex gap-2 ${onEditAction ? "space-x-0" : "space-x-0"}`}>
              {/* Botón Editar */}
              {onEditAction && (
                <button
                  onClick={() => onEditAction(specialDate)}
                  disabled={isLoading}
                  className="flex items-center justify-center px-3 py-2 bg-[color:var(--color-accent)]/10 text-[color:var(--color-primary)] hover:bg-[color:var(--color-accent)]/15 border border-[color:var(--color-accent)]/20 rounded-lg transition-colors disabled:opacity-50 text-xs sm:text-sm font-medium"
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
                className="flex items-center justify-center px-3 py-2 rounded-lg transition-colors disabled:opacity-50 text-xs sm:text-sm font-medium border"
                title="Eliminar fecha especial"
                style={{
                  backgroundColor: "var(--status-cancelled-bg)",
                  color: "var(--status-cancelled-text)",
                  borderColor: "var(--status-cancelled-border)",
                }}
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
