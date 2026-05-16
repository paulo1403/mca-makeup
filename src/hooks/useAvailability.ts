"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export interface TimeSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  locationType: "STUDIO" | "HOME";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpecialDate {
  id: string;
  date: string;
  isAvailable: boolean;
  startTime?: string;
  endTime?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

interface AvailabilityData {
  timeSlots: TimeSlot[];
  specialDates: SpecialDate[];
  settings?: {
    studioSlotIntervalMinutes?: number;
    homeSlotIntervalMinutes?: number;
  };
}

// Funciones de API
const fetchAvailability = async (): Promise<AvailabilityData> => {
  const response = await fetch("/api/admin/availability");
  if (!response.ok) {
    throw new Error("Error al cargar la disponibilidad");
  }
  return response.json();
};

const createTimeSlot = async (data: {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  locationType: "STUDIO" | "HOME";
}): Promise<TimeSlot> => {
  const response = await fetch("/api/admin/availability", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "timeSlot",
      ...data,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear el horario");
  }

  return response.json();
};

const updateTimeSlot = async ({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}): Promise<TimeSlot> => {
  const response = await fetch(`/api/admin/availability/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el horario");
  }

  return response.json();
};

const editTimeSlot = async (
  id: string,
  data: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    locationType: "STUDIO" | "HOME";
  },
): Promise<TimeSlot> => {
  const response = await fetch(`/api/admin/availability/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al editar el horario");
  }

  return response.json();
};

const deleteTimeSlot = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/availability/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar el horario");
  }
};

const editSpecialDate = async (
  id: string,
  data: {
    date: string;
    isAvailable: boolean;
    customHours?: { startTime: string; endTime: string };
    note?: string;
  },
): Promise<SpecialDate> => {
  const response = await fetch(`/api/admin/availability/special/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al editar la fecha especial");
  }

  return response.json();
};

const createSpecialDate = async (data: {
  date: string;
  isAvailable: boolean;
  customHours?: { startTime: string; endTime: string };
  note?: string;
}): Promise<SpecialDate> => {
  const response = await fetch("/api/admin/availability", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "specialDate",
      ...data,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear la fecha especial");
  }

  return response.json();
};

const deleteSpecialDate = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/availability/special/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar la fecha especial");
  }
};

const updateAvailabilitySettings = async (data: {
  studioSlotIntervalMinutes: number;
  homeSlotIntervalMinutes: number;
}): Promise<{ studioSlotIntervalMinutes: number; homeSlotIntervalMinutes: number }> => {
  const response = await fetch("/api/admin/availability", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "settings",
      ...data,
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || "Error al guardar la configuración");
  }

  return payload.settings;
};

export const useAvailability = () => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  // Query para obtener disponibilidad
  const { data, isLoading, error } = useQuery({
    queryKey: ["availability"],
    queryFn: fetchAvailability,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  // Mutación para crear horario
  const createTimeSlotMutation = useMutation({
    mutationFn: createTimeSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      showMessage("Horario agregado exitosamente");
    },
    onError: (error: Error) => {
      showMessage(`❌ ${error.message}`);
    },
  });

  // Mutación para actualizar horario
  const updateTimeSlotMutation = useMutation({
    mutationFn: updateTimeSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      showMessage("Horario actualizado exitosamente");
    },
    onError: (error: Error) => {
      showMessage(`❌ ${error.message}`);
    },
  });

  // Mutación para editar horario completo
  const editTimeSlotMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        locationType: "STUDIO" | "HOME";
      };
    }) => editTimeSlot(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      showMessage("Horario editado exitosamente");
    },
    onError: (error: Error) => {
      showMessage(`❌ ${error.message}`);
    },
  });

  // Mutación para eliminar horario
  const deleteTimeSlotMutation = useMutation({
    mutationFn: deleteTimeSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      showMessage("Horario eliminado exitosamente");
    },
    onError: (error: Error) => {
      showMessage(`❌ ${error.message}`);
    },
  });

  // Mutación para crear fecha especial
  const createSpecialDateMutation = useMutation({
    mutationFn: createSpecialDate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      showMessage("Fecha especial agregada exitosamente");
    },
    onError: (error: Error) => {
      showMessage(`❌ ${error.message}`);
    },
  });

  // Mutación para eliminar fecha especial
  const deleteSpecialDateMutation = useMutation({
    mutationFn: deleteSpecialDate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      showMessage("Fecha especial eliminada exitosamente");
    },
    onError: (error: Error) => {
      showMessage(`❌ ${error.message}`);
    },
  });

  // Mutación para editar fecha especial
  const editSpecialDateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        date: string;
        isAvailable: boolean;
        customHours?: { startTime: string; endTime: string };
        note?: string;
      };
    }) => editSpecialDate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      showMessage("Fecha especial editada exitosamente");
    },
    onError: (error: Error) => {
      showMessage(`❌ ${error.message}`);
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: updateAvailabilitySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      showMessage("Configuración guardada exitosamente");
    },
    onError: (error: Error) => {
      showMessage(`❌ ${error.message}`);
    },
  });

  return {
    // Data
    timeSlots: data?.timeSlots ?? [],
    specialDates: data?.specialDates ?? [],
    studioSlotIntervalMinutes: data?.settings?.studioSlotIntervalMinutes ?? 30,
    homeSlotIntervalMinutes: data?.settings?.homeSlotIntervalMinutes ?? 30,

    // Loading states
    isLoading,
    isCreatingTimeSlot: createTimeSlotMutation.isPending,
    isUpdatingTimeSlot: updateTimeSlotMutation.isPending,
    isEditingTimeSlot: editTimeSlotMutation.isPending,
    isDeletingTimeSlot: deleteTimeSlotMutation.isPending,
    isCreatingSpecialDate: createSpecialDateMutation.isPending,
    isEditingSpecialDate: editSpecialDateMutation.isPending,
    isDeletingSpecialDate: deleteSpecialDateMutation.isPending,
    isUpdatingSettings: updateSettingsMutation.isPending,

    // Actions
    createTimeSlot: createTimeSlotMutation.mutate,
    updateTimeSlot: updateTimeSlotMutation.mutate,
    editTimeSlot: editTimeSlotMutation.mutate,
    deleteTimeSlot: deleteTimeSlotMutation.mutate,
    createSpecialDate: createSpecialDateMutation.mutate,
    editSpecialDate: editSpecialDateMutation.mutate,
    deleteSpecialDate: deleteSpecialDateMutation.mutate,
    updateSettings: updateSettingsMutation.mutate,

    // UI
    message,
    error,
  };
};
