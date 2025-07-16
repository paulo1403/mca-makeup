'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface TimeSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
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
}

// Funciones de API
const fetchAvailability = async (): Promise<AvailabilityData> => {
  const response = await fetch('/api/admin/availability');
  if (!response.ok) {
    throw new Error('Error al cargar la disponibilidad');
  }
  return response.json();
};

const createTimeSlot = async (data: {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}): Promise<TimeSlot> => {
  const response = await fetch('/api/admin/availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'timeSlot',
      ...data,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear el horario');
  }
  
  return response.json();
};

const updateTimeSlot = async ({ id, isActive }: { id: string; isActive: boolean }): Promise<TimeSlot> => {
  const response = await fetch(`/api/admin/availability/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive }),
  });
  
  if (!response.ok) {
    throw new Error('Error al actualizar el horario');
  }
  
  return response.json();
};

const editTimeSlot = async (id: string, data: {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}): Promise<TimeSlot> => {
  const response = await fetch(`/api/admin/availability/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al editar el horario');
  }
  
  return response.json();
};

const deleteTimeSlot = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/availability/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Error al eliminar el horario');
  }
};

const createSpecialDate = async (data: {
  date: string;
  isAvailable: boolean;
  customHours?: { startTime: string; endTime: string };
  note?: string;
}): Promise<SpecialDate> => {
  const response = await fetch('/api/admin/availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'specialDate',
      ...data,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear la fecha especial');
  }
  
  return response.json();
};

const deleteSpecialDate = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/availability/special/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Error al eliminar la fecha especial');
  }
};

export const useAvailability = () => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  // Query para obtener disponibilidad
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['availability'],
    queryFn: fetchAvailability,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  // Mutación para crear horario
  const createTimeSlotMutation = useMutation({
    mutationFn: createTimeSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      showMessage('Horario agregado exitosamente');
    },
    onError: (error: Error) => {
      showMessage(`❌ ${error.message}`);
    },
  });

  // Mutación para actualizar horario
  const updateTimeSlotMutation = useMutation({
    mutationFn: updateTimeSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      showMessage('Horario actualizado exitosamente');
    },
    onError: (error: Error) => {
      showMessage(`❌ ${error.message}`);
    },
  });

  // Mutación para editar horario completo
  const editTimeSlotMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { dayOfWeek: number; startTime: string; endTime: string } }) => 
      editTimeSlot(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      showMessage('Horario editado exitosamente');
    },
    onError: (error: Error) => {
      showMessage(`❌ ${error.message}`);
    },
  });

  // Mutación para eliminar horario
  const deleteTimeSlotMutation = useMutation({
    mutationFn: deleteTimeSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      showMessage('Horario eliminado exitosamente');
    },
    onError: (error: Error) => {
      showMessage(`❌ ${error.message}`);
    },
  });

  // Mutación para crear fecha especial
  const createSpecialDateMutation = useMutation({
    mutationFn: createSpecialDate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      showMessage('Fecha especial agregada exitosamente');
    },
    onError: (error: Error) => {
      showMessage(`❌ ${error.message}`);
    },
  });

  // Mutación para eliminar fecha especial
  const deleteSpecialDateMutation = useMutation({
    mutationFn: deleteSpecialDate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      showMessage('Fecha especial eliminada exitosamente');
    },
    onError: (error: Error) => {
      showMessage(`❌ ${error.message}`);
    },
  });

  return {
    // Data
    timeSlots: data?.timeSlots ?? [],
    specialDates: data?.specialDates ?? [],
    
    // Loading states
    isLoading,
    isCreatingTimeSlot: createTimeSlotMutation.isPending,
    isUpdatingTimeSlot: updateTimeSlotMutation.isPending,
    isEditingTimeSlot: editTimeSlotMutation.isPending,
    isDeletingTimeSlot: deleteTimeSlotMutation.isPending,
    isCreatingSpecialDate: createSpecialDateMutation.isPending,
    isDeletingSpecialDate: deleteSpecialDateMutation.isPending,
    
    // Actions
    createTimeSlot: createTimeSlotMutation.mutate,
    updateTimeSlot: updateTimeSlotMutation.mutate,
    editTimeSlot: editTimeSlotMutation.mutate,
    deleteTimeSlot: deleteTimeSlotMutation.mutate,
    createSpecialDate: createSpecialDateMutation.mutate,
    deleteSpecialDate: deleteSpecialDateMutation.mutate,
    
    // UI
    message,
    error,
  };
};
