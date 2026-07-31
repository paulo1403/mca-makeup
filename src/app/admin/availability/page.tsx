"use client";

import { AlertTriangle, Calendar, Clock, Plus, Settings2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AddSpecialDateModal from "@/components/availability/AddSpecialDateModal";
import AddTimeSlotModal from "@/components/availability/AddTimeSlotModal";
import EditSpecialDateModal from "@/components/availability/EditSpecialDateModal";
import EditTimeSlotModal from "@/components/availability/EditTimeSlotModal";
import SpecialDateList from "@/components/availability/SpecialDateList";
import TimeSlotList from "@/components/availability/TimeSlotList";
import LoadingSpinner from "@/components/LoadingSpinner";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { type SpecialDate, type TimeSlot, useAvailability } from "@/hooks/useAvailability";

export default function AvailabilityPage() {
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [showAddSpecialDate, setShowAddSpecialDate] = useState(false);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [editingSpecialDate, setEditingSpecialDate] = useState<SpecialDate | null>(null);
  const [preselectedDay, setPreselectedDay] = useState<number | null>(null);
  const [preselectedLocation, setPreselectedLocation] = useState<"STUDIO" | "HOME" | null>(null);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);
  const [deletingSpecialId, setDeletingSpecialId] = useState<string | null>(null);
  const [studioInterval, setStudioInterval] = useState<number>(30);
  const [homeInterval, setHomeInterval] = useState<number>(30);

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
    studioSlotIntervalMinutes,
    homeSlotIntervalMinutes,
    updateSettings,
    isUpdatingSettings,
    message,
  } = useAvailability();

  useEffect(() => {
    setStudioInterval(studioSlotIntervalMinutes);
    setHomeInterval(homeSlotIntervalMinutes);
  }, [studioSlotIntervalMinutes, homeSlotIntervalMinutes]);

  const handleAddFromDay = (dayOfWeek: number, locationType: "STUDIO" | "HOME") => {
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-(--color-heading)">Disponibilidad</h1>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          Define tu horario semanal, fechas especiales y el intervalo entre citas.
        </p>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-xl border text-sm ${
            message.includes("Error")
              ? "bg-[color:var(--status-cancelled-bg)] text-[color:var(--status-cancelled-text)] border-[color:var(--status-cancelled-border)]"
              : "bg-[color:var(--status-confirmed-bg)] text-[color:var(--status-confirmed-text)] border-[color:var(--status-confirmed-border)]"
          }`}
        >
          {message}
        </div>
      )}

      {/* Horario Semanal + Intervalos */}
      <div className="rounded-xl border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface)]">
        {/* Section header */}
        <div className="flex items-center justify-between border-b border-[color:var(--color-border)]/60 px-5 py-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-[color:var(--color-primary)]" />
            <div>
              <h2 className="text-sm font-semibold text-(--color-heading)">Horario Semanal</h2>
              <p className="text-xs text-[color:var(--color-muted)]">
                Días y horas laborales habituales
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddSlot(true)}
            variant="primary"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        </div>

        <div className="p-5">
          <TimeSlotList
            timeSlots={timeSlots}
            onToggleAction={(id: string) => {
              const slot = timeSlots.find((s) => s.id === id);
              if (slot) updateTimeSlot({ id, isActive: !slot.isActive });
            }}
            onEditAction={(slot: TimeSlot) => setEditingSlot(slot.id)}
            onDeleteAction={(id: string) => setDeletingSlotId(id)}
            onAddAction={handleAddFromDay}
          />

          {timeSlots.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-[color:var(--color-muted)] mb-4">
                Aún no tienes horarios configurados
              </p>
              <Button
                onClick={() => setShowAddSlot(true)}
                variant="primary"
                size="md"
              >
                Configurar Primer Horario
              </Button>
            </div>
          )}
        </div>

        {/* Intervalos */}
        <div className="border-t border-[color:var(--color-border)]/60 px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Settings2 className="h-4 w-4 text-[color:var(--color-primary)]" />
            <h3 className="text-sm font-medium text-(--color-heading)">Intervalo entre citas</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="si" className="text-xs text-[color:var(--color-body)] shrink-0">
                Estudio
              </label>
              <select
                id="si"
                value={studioInterval}
                onChange={(e) => setStudioInterval(Number(e.target.value))}
                className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] px-2 py-1.5 text-sm text-[color:var(--color-heading)]"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="hi" className="text-xs text-[color:var(--color-body)] shrink-0">
                Domicilio
              </label>
              <select
                id="hi"
                value={homeInterval}
                onChange={(e) => setHomeInterval(Number(e.target.value))}
                className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] px-2 py-1.5 text-sm text-[color:var(--color-heading)]"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
            </div>
            <Button
              variant="primary"
              size="sm"
              disabled={
                isUpdatingSettings ||
                (studioInterval === studioSlotIntervalMinutes &&
                  homeInterval === homeSlotIntervalMinutes)
              }
              onClick={() =>
                updateSettings({
                  studioSlotIntervalMinutes: studioInterval,
                  homeSlotIntervalMinutes: homeInterval,
                })
              }
            >
              {isUpdatingSettings ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </div>

      {/* Fechas Especiales */}
      <div className="rounded-xl border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface)]">
        <div className="flex items-center justify-between border-b border-[color:var(--color-border)]/60 px-5 py-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-[color:var(--color-primary)]" />
            <div>
              <h2 className="text-sm font-semibold text-(--color-heading)">Fechas Especiales</h2>
              <p className="text-xs text-[color:var(--color-muted)]">
                Días libres, vacaciones, horarios extendidos
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddSpecialDate(true)}
            variant="primary"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        </div>

        <div className="p-5">
          <SpecialDateList
            specialDates={specialDates}
            onEditAction={(specialDate: SpecialDate) => setEditingSpecialDate(specialDate)}
            onDeleteAction={(id: string) => setDeletingSpecialId(id)}
          />

          {specialDates.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-[color:var(--color-muted)] mb-4">
                No hay fechas especiales configuradas
              </p>
              <Button
                onClick={() => setShowAddSpecialDate(true)}
                variant="primary"
                size="md"
              >
                Agregar Primera Fecha
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
        slot={editingSlot ? timeSlots.find((slot) => slot.id === editingSlot) || null : null}
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
