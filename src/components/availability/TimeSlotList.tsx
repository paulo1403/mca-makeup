"use client";

import type { TimeSlot } from "@/hooks/useAvailability";
import {
  Building,
  CheckCircle,
  Clock,
  Edit2,
  Home,
  Pause,
  Play,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import React from "react";

const DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

interface TimeSlotListProps {
  timeSlots: TimeSlot[];
  onToggleAction: (id: string) => void;
  onDeleteAction: (id: string) => void;
  onEditAction?: (slot: TimeSlot) => void;
  onAddAction?: (dayOfWeek: number, locationType: "STUDIO" | "HOME") => void;
  isLoading?: boolean;
}

export default function TimeSlotList({
  timeSlots,
  onToggleAction,
  onDeleteAction,
  onEditAction,
  onAddAction,
  isLoading = false,
}: TimeSlotListProps) {
  const [activeTab, setActiveTab] = useState<"STUDIO" | "HOME">("STUDIO");

  const handleDelete = (id: string) => {
    onDeleteAction(id);
  };

  // Agrupar por tipo de ubicación
  const studioSlots = timeSlots.filter((slot) => slot.locationType === "STUDIO");
  const homeSlots = timeSlots.filter((slot) => slot.locationType === "HOME");

  const currentSlots = activeTab === "STUDIO" ? studioSlots : homeSlots;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--color-primary)]" />
      </div>
    );
  }

  const SlotCard = ({ slot }: { slot: TimeSlot }) => (
    <div
      className={`p-3 sm:p-4 rounded-lg border transition-all ${
        slot.isActive
          ? "bg-[color:var(--color-card)] border-[color:var(--color-primary)]/30 shadow-sm"
          : "bg-[color:var(--color-card)] border-[color:var(--color-border)]"
      }`}
    >
      {/* Horario */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-[color:var(--color-muted)]" />
          <span className="font-medium text-[color:var(--color-heading)] text-sm sm:text-base">
            {slot.startTime} - {slot.endTime}
          </span>
        </div>
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: slot.isActive ? "var(--status-confirmed-text)" : "var(--color-muted)",
          }}
        />
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2">
        <button
          onClick={() => onToggleAction(slot.id)}
          disabled={isLoading}
          className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-md text-xs font-medium transition-all disabled:opacity-50 border ${
            slot.isActive
              ? "bg-[color:var(--color-surface-elevated)] text-[color:var(--color-heading)] hover:bg-[color:var(--color-surface)] border-[color:var(--color-border)]"
              : "bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/15 border-[color:var(--color-primary)]/30"
          }`}
        >
          {slot.isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          <span className="hidden xs:inline">{slot.isActive ? "Pausar" : "Activar"}</span>
        </button>

        {onEditAction && (
          <button
            onClick={() => onEditAction(slot)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-[color:var(--color-accent)]/10 text-[color:var(--color-primary)] hover:bg-[color:var(--color-accent)]/15 border border-[color:var(--color-accent)]/20 rounded-md transition-colors disabled:opacity-50 text-xs font-medium"
          >
            <Edit2 className="h-3 w-3" />
            <span className="hidden xs:inline">Editar</span>
          </button>
        )}

        <button
          onClick={() => handleDelete(slot.id)}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-md transition-colors disabled:opacity-50 text-xs font-medium border"
          style={{
            backgroundColor: "var(--status-cancelled-bg)",
            color: "var(--status-cancelled-text)",
            borderColor: "var(--status-cancelled-border)",
          }}
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
      <div className="border-b border-[color:var(--color-border)]">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("STUDIO")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "STUDIO"
                ? "border-[color:var(--color-primary)] text-[color:var(--color-primary)]"
                : "border-transparent text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)] hover:border-[color:var(--color-border)]"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>Horarios en Estudio</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  studioSlots.length > 0
                    ? "bg-[color:var(--color-primary)]/15 text-[color:var(--color-primary)]"
                    : "bg-[color:var(--color-surface-elevated)] text-[color:var(--color-muted)]"
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
                ? "border-[color:var(--color-primary)] text-[color:var(--color-primary)]"
                : "border-transparent text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)] hover:border-[color:var(--color-border)]"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Horarios a Domicilio</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  homeSlots.length > 0
                    ? "bg-[color:var(--color-accent)]/15 text-[color:var(--color-accent)]"
                    : "bg-[color:var(--color-surface-elevated)] text-[color:var(--color-muted)]"
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
          className={`p-4 rounded-lg border ${
            activeTab === "STUDIO"
              ? "bg-[color:var(--color-primary)]/8 border-[color:var(--color-primary)]/20"
              : "bg-[color:var(--color-accent)]/8 border-[color:var(--color-accent)]/20"
          }`}
        >
          <div className="flex items-center space-x-2 mb-2">
            {activeTab === "STUDIO" ? (
              <Building className="h-5 w-5 text-[color:var(--color-primary)]" />
            ) : (
              <Home className="h-5 w-5 text-[color:var(--color-accent)]" />
            )}
            <h3 className="font-semibold text-[color:var(--color-heading)]">
              {activeTab === "STUDIO" ? "Servicios en Estudio" : "Servicios a Domicilio"}
            </h3>
          </div>
          <p className="text-sm text-[color:var(--color-body)]">
            {activeTab === "STUDIO"
              ? "Horarios para clientes que vienen al estudio en Av. Bolívar 1075, Pueblo Libre"
              : "Horarios para servicios a domicilio (incluye tiempo de traslado)"}
          </p>
        </div>

        {/* Grid de días */}
        {currentSlots.length === 0 ? (
          <div className="text-center py-12">
            {activeTab === "STUDIO" ? (
              <Building className="mx-auto h-12 w-12 text-[color:var(--color-muted)] mb-4" />
            ) : (
              <Home className="mx-auto h-12 w-12 text-[color:var(--color-muted)] mb-4" />
            )}
            <h3 className="text-lg font-medium text-[color:var(--color-heading)] mb-2">
              No hay horarios configurados para {activeTab === "STUDIO" ? "estudio" : "domicilio"}
            </h3>
            <p className="text-[color:var(--color-body)] mb-4">
              Agrega horarios para que los clientes puedan reservar{" "}
              {activeTab === "STUDIO" ? "citas en el estudio" : "servicios a domicilio"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {DAYS_OF_WEEK.map((dayName, dayIndex) => {
              const daySlots = currentSlots.filter((slot) => slot.dayOfWeek === dayIndex);
              const hasActiveSlots = daySlots.some((slot) => slot.isActive);

              return (
                <div
                  key={dayIndex}
                  className={`rounded-lg border transition-all duration-200 ${
                    daySlots.length > 0
                      ? hasActiveSlots
                        ? activeTab === "STUDIO"
                          ? "bg-[color:var(--color-primary)]/8 border-[color:var(--color-primary)]/20 shadow-sm"
                          : "bg-[color:var(--color-accent)]/8 border-[color:var(--color-accent)]/20 shadow-sm"
                        : "shadow-sm"
                      : "bg-[color:var(--color-card)] border-[color:var(--color-border)]"
                  }`}
                  style={
                    daySlots.length > 0 && !hasActiveSlots
                      ? {
                          backgroundColor: "var(--status-pending-bg)",
                          borderColor: "var(--status-pending-border)",
                        }
                      : undefined
                  }
                >
                  {/* Header del día */}
                  <div className="p-4 border-b border-[color:var(--color-border)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-[color:var(--color-muted)]" />
                        <div>
                          <h3 className="font-semibold text-[color:var(--color-heading)] text-sm">
                            {dayName}
                          </h3>
                          <p className="text-xs text-[color:var(--color-muted)]">
                            {daySlots.length} horario
                            {daySlots.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      {hasActiveSlots ? (
                        <CheckCircle
                          className="h-5 w-5"
                          style={{ color: "var(--status-confirmed-text)" }}
                        />
                      ) : daySlots.length > 0 ? (
                        <Pause
                          className="h-5 w-5"
                          style={{ color: "var(--status-pending-text)" }}
                        />
                      ) : (
                        <XCircle className="h-5 w-5" style={{ color: "var(--color-muted)" }} />
                      )}
                    </div>

                    <div className="mt-2">
                      <span
                        className={
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                        }
                        style={
                          hasActiveSlots
                            ? {
                                backgroundColor: "var(--status-confirmed-bg)",
                                color: "var(--status-confirmed-text)",
                                borderColor: "var(--status-confirmed-border)",
                              }
                            : daySlots.length > 0
                              ? {
                                  backgroundColor: "var(--status-pending-bg)",
                                  color: "var(--status-pending-text)",
                                  borderColor: "var(--status-pending-border)",
                                }
                              : {
                                  backgroundColor: "var(--color-surface-elevated)",
                                  color: "var(--color-muted)",
                                  borderColor: "var(--color-border)",
                                }
                        }
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
                        <XCircle
                          className="mx-auto h-6 w-6 mb-2"
                          style={{ color: "var(--color-muted)" }}
                        />
                        <p className="text-xs text-[color:var(--color-body)] mb-2">Sin horarios</p>
                        <button
                          onClick={() => onAddAction?.(dayIndex, activeTab)}
                          className="inline-flex items-center space-x-1 text-xs text-[color:var(--color-primary)] hover:text-[color:var(--color-primary-hover)] font-medium"
                        >
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
