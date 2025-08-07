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
  Building,
  Home,
} from "lucide-react";
import { useState } from "react";
import React from "react";

const DAYS_OF_WEEK = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
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
  const [activeTab, setActiveTab] = useState<"STUDIO" | "HOME">("STUDIO");

  const handleDelete = (id: string) => {
    if (confirm("¿Estás segura de que quieres eliminar este horario?")) {
      onDeleteAction(id);
    }
  };

  // Agrupar por tipo de ubicación
  const studioSlots = timeSlots.filter(
    (slot) => slot.locationType === "STUDIO",
  );
  const homeSlots = timeSlots.filter((slot) => slot.locationType === "HOME");

  const currentSlots = activeTab === "STUDIO" ? studioSlots : homeSlots;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  const SlotCard = ({ slot }: { slot: TimeSlot }) => (
    <div
      className={`p-3 sm:p-4 rounded-lg border transition-all ${
        slot.isActive
          ? "bg-white border-green-200 shadow-sm"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      {/* Horario */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-900 text-sm sm:text-base">
            {slot.startTime} - {slot.endTime}
          </span>
        </div>
        <div
          className={`w-3 h-3 rounded-full ${
            slot.isActive ? "bg-green-400" : "bg-gray-300"
          }`}
        />
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2">
        <button
          onClick={() => onToggleAction(slot.id)}
          disabled={isLoading}
          className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-md text-xs font-medium transition-all disabled:opacity-50 ${
            slot.isActive
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
              : "bg-[#D4AF37] bg-opacity-10 text-black hover:bg-[#D4AF37] hover:bg-opacity-20 border border-[#D4AF37] border-opacity-30"
          }`}
        >
          {slot.isActive ? (
            <Pause className="h-3 w-3" />
          ) : (
            <Play className="h-3 w-3" />
          )}
          <span className="hidden xs:inline">
            {slot.isActive ? "Pausar" : "Activar"}
          </span>
        </button>

        {onEditAction && (
          <button
            onClick={() => onEditAction(slot)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors disabled:opacity-50 text-xs font-medium"
          >
            <Edit2 className="h-3 w-3" />
            <span className="hidden xs:inline">Editar</span>
          </button>
        )}

        <button
          onClick={() => handleDelete(slot.id)}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-md transition-colors disabled:opacity-50 text-xs font-medium"
        >
          <Trash2 className="h-3 w-3" />
          <span className="hidden xs:inline">Eliminar</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tabs para seleccionar tipo de ubicación */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("STUDIO")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "STUDIO"
                ? "border-[#D4AF37] text-[#D4AF37]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>Horarios en Estudio</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  studioSlots.length > 0
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {studioSlots.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("HOME")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "HOME"
                ? "border-[#D4AF37] text-[#D4AF37]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Horarios a Domicilio</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  homeSlots.length > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {homeSlots.length}
              </span>
            </div>
          </button>
        </nav>
      </div>

      {/* Contenido del tab activo */}
      <div className="space-y-4">
        {/* Información del tipo de servicio */}
        <div
          className={`p-4 rounded-lg border-2 ${
            activeTab === "STUDIO"
              ? "bg-blue-50 border-blue-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          <div className="flex items-center space-x-2 mb-2">
            {activeTab === "STUDIO" ? (
              <Building className="h-5 w-5 text-blue-600" />
            ) : (
              <Home className="h-5 w-5 text-green-600" />
            )}
            <h3 className="font-semibold text-gray-900">
              {activeTab === "STUDIO"
                ? "Servicios en Estudio"
                : "Servicios a Domicilio"}
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            {activeTab === "STUDIO"
              ? "Horarios para clientes que vienen al estudio en Pueblo Libre"
              : "Horarios para servicios a domicilio (incluye tiempo de traslado)"}
          </p>
        </div>

        {/* Grid de días */}
        {currentSlots.length === 0 ? (
          <div className="text-center py-12">
            {activeTab === "STUDIO" ? (
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            ) : (
              <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            )}
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay horarios configurados para{" "}
              {activeTab === "STUDIO" ? "estudio" : "domicilio"}
            </h3>
            <p className="text-gray-600 mb-4">
              Agrega horarios para que los clientes puedan reservar{" "}
              {activeTab === "STUDIO"
                ? "citas en el estudio"
                : "servicios a domicilio"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {DAYS_OF_WEEK.map((dayName, dayIndex) => {
              const daySlots = currentSlots.filter(
                (slot) => slot.dayOfWeek === dayIndex,
              );
              const hasActiveSlots = daySlots.some((slot) => slot.isActive);

              return (
                <div
                  key={dayIndex}
                  className={`rounded-lg border-2 transition-all duration-200 ${
                    daySlots.length > 0
                      ? hasActiveSlots
                        ? activeTab === "STUDIO"
                          ? "bg-blue-50 border-blue-200 shadow-sm"
                          : "bg-green-50 border-green-200 shadow-sm"
                        : "bg-orange-50 border-orange-200 shadow-sm"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {/* Header del día */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {dayName}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {daySlots.length} horario
                            {daySlots.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      {hasActiveSlots ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : daySlots.length > 0 ? (
                        <Pause className="h-5 w-5 text-orange-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>

                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hasActiveSlots
                            ? "bg-green-100 text-green-800"
                            : daySlots.length > 0
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {hasActiveSlots
                          ? "Disponible"
                          : daySlots.length > 0
                            ? "Pausado"
                            : "Sin horario"}
                      </span>
                    </div>
                  </div>

                  {/* Contenido del día */}
                  <div className="p-3">
                    {daySlots.length > 0 ? (
                      <div className="space-y-3">
                        {daySlots.map((slot) => (
                          <SlotCard key={slot.id} slot={slot} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <XCircle className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-600 mb-2">
                          Sin horarios
                        </p>
                        <button className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                          <Plus className="h-3 w-3" />
                          <span>Agregar</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
