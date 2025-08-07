import React from "react";
import { CalendarEvent } from "@/utils/calendarEvents";
import { getStatusConfig } from "@/utils/calendarStatus";
import { format } from "date-fns";

export const EventComponent: React.FC<{ event: CalendarEvent }> = ({
  event,
}) => {
  const config = getStatusConfig(event.resource.status);
  const serviceType = event.resource.service || "Servicio no especificado";

  return (
    <div
      className={`p-2 text-xs rounded-lg border transition-all duration-200 hover:shadow-md ${config.bg} ${config.border}`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 ${config.dot}`}
        ></div>
        <div className="font-semibold truncate flex-1 text-gray-900">
          {event.resource.clientName}
        </div>
      </div>
      <div className={`truncate text-[10px] md:text-xs mt-1 ${config.text}`}>
        {serviceType}
      </div>
      {event.resource.price > 0 && (
        <div className="text-[10px] md:text-xs font-bold mt-1 text-[#D4AF37]">
          S/ {event.resource.price}
        </div>
      )}
    </div>
  );
};

export const AgendaEventComponent: React.FC<{ event: CalendarEvent }> = ({
  event,
}) => {
  const config = getStatusConfig(event.resource.status);
  const serviceType = event.resource.service || "Servicio no especificado";

  const getStatusLabel = (status: string) => {
    const labels = {
      PENDING: "Pendiente",
      CONFIRMED: "Confirmada",
      COMPLETED: "Completada",
      CANCELLED: "Cancelada",
    };
    return labels[status as keyof typeof labels] || "Desconocido";
  };

  return (
    <div
      className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${config.bg} ${config.border}`}
    >
      {/* Status indicator */}
      <div className="flex-shrink-0">
        <div className={`w-4 h-4 rounded-full ${config.dot} shadow-sm`}></div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          {/* Client info */}
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-semibold text-gray-900 truncate">
              {event.resource.clientName}
            </h4>
            <p className="text-sm text-gray-600 truncate mt-0.5">
              {serviceType}
            </p>
            <div className="flex items-center space-x-3 mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border} border`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`}
                ></div>
                {getStatusLabel(event.resource.status)}
              </span>
            </div>
          </div>

          {/* Time and price */}
          <div className="flex-shrink-0 text-left sm:text-right">
            <div className="flex items-center space-x-2 sm:justify-end">
              <span className="text-lg font-bold text-[#D4AF37]">
                S/ {event.resource.price}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
            </p>
          </div>
        </div>

        {/* Additional info for mobile */}
        <div className="mt-3 sm:hidden">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Toca para ver detalles</span>
            <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
              <div className="w-2 h-2 border-t border-r border-gray-400 transform rotate-45"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
