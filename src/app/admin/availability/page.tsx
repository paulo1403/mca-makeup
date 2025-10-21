"use client";

import { useState } from "react";
import {
  useAvailability,
  TimeSlot,
  SpecialDate,
} from "@/hooks/useAvailability";
import LoadingSpinner from "@/components/LoadingSpinner";
import AddTimeSlotModal from "@/components/availability/AddTimeSlotModal";
import EditTimeSlotModal from "@/components/availability/EditTimeSlotModal";
import AddSpecialDateModal from "@/components/availability/AddSpecialDateModal";
import EditSpecialDateModal from "@/components/availability/EditSpecialDateModal";
import TimeSlotList from "@/components/availability/TimeSlotList";
import SpecialDateList from "@/components/availability/SpecialDateList";
import { Calendar, Clock, Plus, Trash2, AlertTriangle } from "lucide-react";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function AvailabilityPage() {
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [showAddSpecialDate, setShowAddSpecialDate] = useState(false);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [editingSpecialDate, setEditingSpecialDate] =
    useState<SpecialDate | null>(null);
  const [preselectedDay, setPreselectedDay] = useState<number | null>(null);
  const [preselectedLocation, setPreselectedLocation] = useState<
    "STUDIO" | "HOME" | null
  >(null);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);
  const [deletingSpecialId, setDeletingSpecialId] = useState<string | null>(null);

  const {
    timeSlots,
    specialDates,
    isLoading,
    isCreatingTimeSlot,
    isCreatingSpecialDate,
    isEditingTimeSlot,
    isEditingSpecialDate,
    createTimeSlot,
    updateTimeSlot,
    editTimeSlot,
    deleteTimeSlot,
    createSpecialDate,
    editSpecialDate,
    deleteSpecialDate,
    message,
  } = useAvailability();

  const handleAddFromDay = (
    dayOfWeek: number,
    locationType: "STUDIO" | "HOME",
  ) => {
    setPreselectedDay(dayOfWeek);
    setPreselectedLocation(locationType);
    setShowAddSlot(true);
  };

  const handleCloseAddSlot = () => {
    setShowAddSlot(false);
    setPreselectedDay(null);
    setPreselectedLocation(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8 px-2 sm:px-0">
      {/* Header con instrucciones - Optimizado para móvil */}
      <div className="rounded-lg p-3 sm:p-6 border border-[color:var(--color-border)]/30 bg-[color:var(--color-surface)]">
        <div className="flex items-center space-x-3 mb-2">
          <Calendar className="h-6 w-6 text-[color:var(--color-primary)]" />
          <Typography
            as="h1"
            variant="h3"
            className="sm:text-h2 font-bold text-[color:var(--color-heading)] font-playfair"
          >
            Gestión de Disponibilidad
          </Typography>
        </div>
        <Typography
          variant="p"
          className="text-[color:var(--color-muted)] mb-3 sm:mb-4"
        >
          Administra tu horario semanal y fechas especiales para que los
          clientes puedan agendar citas contigo.
        </Typography>
      
        <div className="rounded-lg p-3 sm:p-4 border border-[color:var(--color-border)]/30 bg-[color:var(--color-surface-elevated)]">
          <Typography
            as="h3"
            variant="h4"
            className="font-semibold text-[color:var(--color-heading)] mb-3"
          >
            Estados de disponibilidad:
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
            <div className="flex items-center space-x-2 p-2 rounded-md border border-[color:var(--status-confirmed-border)]/50 bg-[color:var(--status-confirmed-bg)]">
              <div className="w-3 h-3 rounded-full bg-[color:var(--status-confirmed-text)]"></div>
              <div>
                <Typography as="span" variant="small" className="text-[color:var(--status-confirmed-text)] font-semibold">Activo:</Typography>
                <Typography as="span" variant="p" className="text-[color:var(--color-muted)] block">
                  Los clientes pueden reservar
                </Typography>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md border border-[color:var(--status-pending-border)]/50 bg-[color:var(--status-pending-bg)]">
              <div className="w-3 h-3 rounded-full bg-[color:var(--status-pending-text)]"></div>
              <div>
                <Typography as="span" variant="small" className="text-[color:var(--status-pending-text)] font-semibold">Pausado:</Typography>
                <Typography as="span" variant="p" className="text-[color:var(--color-muted)] block">
                  Temporalmente no disponible
                </Typography>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md border border-[color:var(--color-border)]/50 bg-[color:var(--color-surface)]">
              <div className="w-3 h-3 rounded-full bg-[color:var(--color-muted)]"></div>
              <div>
                <Typography as="span" variant="small" className="text-[color:var(--color-heading)] font-semibold">Sin horario:</Typography>
                <Typography as="span" variant="p" className="text-[color:var(--color-muted)] block">Día libre</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mensajes de confirmación */}
      {message && (
        <div
          className={`p-3 sm:p-4 rounded-lg border text-sm sm:text-base ${
            message.includes("Error")
              ? "bg-[color:var(--status-cancelled-bg)] text-[color:var(--status-cancelled-text)] border-[color:var(--status-cancelled-border)]"
              : "bg-[color:var(--status-confirmed-bg)] text-[color:var(--status-confirmed-text)] border-[color:var(--status-confirmed-border)]"
          }`}
        >
          {message}
        </div>
      )}
      
      {/* Horario Regular Semanal */}
      <div className="bg-[color:var(--color-surface)] rounded-lg border border-[color:var(--color-border)]/30">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-[color:var(--color-border)]/30 bg-gradient-to-r from-[color:var(--color-primary)]/10 to-[color:var(--color-accent)]/10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="h-5 w-5 text-[color:var(--color-primary)]" />
                <Typography as="h2" variant="h3" className="text-[color:var(--color-heading)] font-semibold">
                  Horario Semanal Regular
                </Typography>
              </div>
              <Typography variant="p" className="text-[color:var(--color-muted)]">
                Define tus días y horas de trabajo habituales. Puedes
                pausar/activar horarios según necesites.
              </Typography>
            </div>
            <Button
              onClick={() => setShowAddSlot(true)}
              variant="primary"
              size="md"
              className="w-full sm:w-auto flex items-center space-x-2 justify-center shadow-md hover:shadow-lg hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar Horario</span>
            </Button>
          </div>
        </div>
      
        <div className="p-3 sm:p-6">
          <TimeSlotList
            timeSlots={timeSlots}
            onToggleAction={(id: string) => {
              const slot = timeSlots.find((s) => s.id === id);
              if (slot) {
                updateTimeSlot({ id, isActive: !slot.isActive });
              }
            }}
            onEditAction={(slot: TimeSlot) => setEditingSlot(slot.id)}
            onDeleteAction={(id: string) => setDeletingSlotId(id)}
            onAddAction={handleAddFromDay}
          />
      
          {timeSlots.length === 0 && (
            <div className="text-center">
              <Button
                onClick={() => setShowAddSlot(true)}
                variant="primary"
                size="md"
                className="shadow-md hover:shadow-lg hover:opacity-90"
              >
                Configurar Primer Horario
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Fechas Especiales */}
      <div className="bg-[color:var(--color-surface)] rounded-lg border border-[color:var(--color-border)]/30">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-[color:var(--color-border)]/30 bg-gradient-to-r from-[color:var(--color-primary)]/10 to-[color:var(--color-accent)]/10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="h-5 w-5 text-[color:var(--color-accent)]" />
                <Typography as="h2" variant="h3" className="text-[color:var(--color-heading)] font-semibold">
                  Fechas Especiales
                </Typography>
              </div>
              <Typography variant="p" className="text-[color:var(--color-muted)]">
                Días libres, vacaciones, horarios extendidos para eventos
                sociales, etc.
              </Typography>
            </div>
            <Button
              onClick={() => setShowAddSpecialDate(true)}
              variant="primary"
              size="md"
              className="w-full sm:w-auto flex items-center space-x-2 justify-center shadow-md hover:shadow-lg hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar Fecha Especial</span>
            </Button>
          </div>
        </div>
      
        <div className="p-3 sm:p-6">
          <SpecialDateList
            specialDates={specialDates}
            onEditAction={(specialDate: SpecialDate) =>
              setEditingSpecialDate(specialDate)
            }
            onDeleteAction={(id: string) => setDeletingSpecialId(id)}
          />
      
          {specialDates.length === 0 && (
            <div className="text-center">
              <Button
                onClick={() => setShowAddSpecialDate(true)}
                variant="primary"
                size="md"
                className="shadow-md hover:shadow-lg hover:opacity-90"
              >
                Agregar Primera Fecha Especial
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <AddTimeSlotModal
        isOpen={showAddSlot}
        onClose={handleCloseAddSlot}
        onSubmit={createTimeSlot}
        isLoading={isCreatingTimeSlot}
        preselectedDay={preselectedDay}
        preselectedLocation={preselectedLocation}
      />

      <EditTimeSlotModal
        isOpen={!!editingSlot}
        onClose={() => setEditingSlot(null)}
        onSubmit={(id, data) => {
          editTimeSlot({ id, data });
          setEditingSlot(null);
        }}
        isLoading={isEditingTimeSlot}
        slot={
          editingSlot
            ? timeSlots.find((slot) => slot.id === editingSlot) || null
            : null
        }
      />

      <EditSpecialDateModal
        isOpen={!!editingSpecialDate}
        onClose={() => setEditingSpecialDate(null)}
        onSubmit={(id, data) => {
          editSpecialDate({ id, data });
          setEditingSpecialDate(null);
        }}
        isLoading={isEditingSpecialDate}
        specialDate={editingSpecialDate}
      />

      <AddSpecialDateModal
        isOpen={showAddSpecialDate}
        onClose={() => setShowAddSpecialDate(false)}
        onSubmit={createSpecialDate}
        isLoading={isCreatingSpecialDate}
      />

      <ConfirmModal
        open={!!deletingSlotId}
        title="Eliminar horario"
        description="Esta acción eliminará el horario seleccionado. ¿Deseas continuar?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        destructive
        icon={<Trash2 className="w-5 h-5 text-[var(--status-cancelled-text)]" />}
        onConfirm={() => {
          if (deletingSlotId) {
            deleteTimeSlot(deletingSlotId);
            setDeletingSlotId(null);
          }
        }}
        onCancel={() => setDeletingSlotId(null)}
      />

      <ConfirmModal
        open={!!deletingSpecialId}
        title="Eliminar fecha especial"
        description="Esta acción eliminará la fecha especial seleccionada. ¿Deseas continuar?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        destructive
        icon={<AlertTriangle className="w-5 h-5 text-[var(--status-cancelled-text)]" />}
        onConfirm={() => {
          if (deletingSpecialId) {
            deleteSpecialDate(deletingSpecialId);
            setDeletingSpecialId(null);
          }
        }}
        onCancel={() => setDeletingSpecialId(null)}
      />
    </div>
  );
}
