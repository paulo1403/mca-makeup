'use client';

import { useState } from 'react';
import { useAvailability, TimeSlot, SpecialDate } from '@/hooks/useAvailability';
import LoadingSpinner from '@/components/LoadingSpinner';
import AddTimeSlotModal from '@/components/availability/AddTimeSlotModal';
import EditTimeSlotModal from '@/components/availability/EditTimeSlotModal';
import AddSpecialDateModal from '@/components/availability/AddSpecialDateModal';
import EditSpecialDateModal from '@/components/availability/EditSpecialDateModal';
import TimeSlotList from '@/components/availability/TimeSlotList';
import SpecialDateList from '@/components/availability/SpecialDateList';
import { Calendar, Clock, Plus } from 'lucide-react';

export default function AvailabilityPage() {
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [showAddSpecialDate, setShowAddSpecialDate] = useState(false);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [editingSpecialDate, setEditingSpecialDate] = useState<SpecialDate | null>(null);

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

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-8 px-2 sm:px-0'>
      {/* Header con instrucciones - Optimizado para móvil */}
      <div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 sm:p-6 border border-purple-200'>
        <div className='flex items-center space-x-3 mb-2'>
          <Calendar className='h-6 w-6 text-purple-600' />
          <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>
            Gestión de Disponibilidad
          </h1>
        </div>
        <p className='text-sm sm:text-base text-gray-700 mb-3 sm:mb-4'>
          Administra tu horario semanal y fechas especiales para que los clientes puedan agendar citas contigo.
        </p>
        
        <div className='bg-white rounded-lg p-3 sm:p-4 border border-purple-100'>
          <h3 className='font-semibold text-purple-800 mb-3 text-sm sm:text-base'>Estados de disponibilidad:</h3>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm'>
            <div className='flex items-center space-x-2 p-2 bg-green-50 rounded-md'>
              <div className='w-3 h-3 bg-green-400 rounded-full'></div>
              <div>
                <strong className='text-green-700'>Activo:</strong>
                <span className='text-gray-600 block'>Los clientes pueden reservar</span>
              </div>
            </div>
            <div className='flex items-center space-x-2 p-2 bg-orange-50 rounded-md'>
              <div className='w-3 h-3 bg-orange-400 rounded-full'></div>
              <div>
                <strong className='text-orange-700'>Pausado:</strong>
                <span className='text-gray-600 block'>Temporalmente no disponible</span>
              </div>
            </div>
            <div className='flex items-center space-x-2 p-2 bg-gray-50 rounded-md'>
              <div className='w-3 h-3 bg-gray-400 rounded-full'></div>
              <div>
                <strong className='text-gray-700'>Sin horario:</strong>
                <span className='text-gray-600 block'>Día libre</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mensajes de confirmación */}
      {message && (
        <div className={`p-3 sm:p-4 rounded-lg border text-sm sm:text-base ${
          message.includes('Error') 
            ? 'bg-red-50 text-red-700 border-red-200' 
            : 'bg-green-50 text-green-700 border-green-200'
        }`}>
          {message}
        </div>
      )}

      {/* Horario Regular Semanal */}
      <div className='bg-white rounded-lg shadow-sm border'>
        <div className='px-3 sm:px-6 py-3 sm:py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50'>
          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0'>
            <div>
              <div className='flex items-center space-x-2 mb-1'>
                <Clock className='h-5 w-5 text-blue-600' />
                <h2 className='text-lg font-semibold text-gray-900'>
                  Horario Semanal Regular
                </h2>
              </div>
              <p className='text-xs sm:text-sm text-gray-600'>
                Define tus días y horas de trabajo habituales. Puedes pausar/activar horarios según necesites.
              </p>
            </div>
            <button
              onClick={() => setShowAddSlot(true)}
              className='bg-[#D4AF37] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#B8941F] transition-colors font-medium text-sm sm:text-base w-full sm:w-auto shadow-md hover:shadow-lg flex items-center space-x-2 justify-center'
            >
              <Plus className='h-4 w-4' />
              <span>Agregar Horario</span>
            </button>
          </div>
        </div>

        <div className='p-3 sm:p-6'>
          <TimeSlotList 
            timeSlots={timeSlots}
            onToggle={(id: string) => {
              const slot = timeSlots.find(s => s.id === id);
              if (slot) {
                updateTimeSlot({ id, isActive: !slot.isActive });
              }
            }}
            onEdit={(slot: TimeSlot) => setEditingSlot(slot.id)}
            onDelete={deleteTimeSlot}
          />
          
          {timeSlots.length === 0 && (
            <div className='text-center'>
              <button
                onClick={() => setShowAddSlot(true)}
                className='bg-[#D4AF37] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-[#B8941F] transition-colors font-medium text-sm sm:text-base'
              >
                Configurar Primer Horario
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fechas Especiales */}
      <div className='bg-white rounded-lg shadow-sm border'>
        <div className='px-3 sm:px-6 py-3 sm:py-4 border-b bg-gradient-to-r from-pink-50 to-rose-50'>
          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0'>
            <div>
              <div className='flex items-center space-x-2 mb-1'>
                <Calendar className='h-5 w-5 text-pink-600' />
                <h2 className='text-lg font-semibold text-gray-900'>
                  Fechas Especiales
                </h2>
              </div>
              <p className='text-xs sm:text-sm text-gray-600'>
                Días libres, vacaciones, horarios extendidos para eventos sociales, etc.
              </p>
            </div>
            <button
              onClick={() => setShowAddSpecialDate(true)}
              className='bg-[#B06579] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#9A5A6B] transition-colors font-medium text-sm sm:text-base w-full sm:w-auto shadow-md hover:shadow-lg flex items-center space-x-2 justify-center'
            >
              <Plus className='h-4 w-4' />
              <span>Agregar Fecha Especial</span>
            </button>
          </div>
        </div>

        <div className='p-3 sm:p-6'>
          <SpecialDateList 
            specialDates={specialDates}
            onEdit={(specialDate: SpecialDate) => setEditingSpecialDate(specialDate)}
            onDelete={deleteSpecialDate}
          />
          
          {specialDates.length === 0 && (
            <div className='text-center'>
              <button
                onClick={() => setShowAddSpecialDate(true)}
                className='bg-[#B06579] text-white px-4 py-2 rounded-lg hover:bg-[#9A5A6B] transition-colors font-medium text-sm sm:text-base'
              >
                Agregar Primera Fecha Especial
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <AddTimeSlotModal 
        isOpen={showAddSlot}
        onClose={() => setShowAddSlot(false)}
        onSubmit={createTimeSlot}
        isLoading={isCreatingTimeSlot}
      />

      <EditTimeSlotModal 
        isOpen={!!editingSlot}
        onClose={() => setEditingSlot(null)}
        onSubmit={(id, data) => {
          editTimeSlot({ id, data });
          setEditingSlot(null);
        }}
        isLoading={isEditingTimeSlot}
        slot={editingSlot ? timeSlots.find(slot => slot.id === editingSlot) || null : null}
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
    </div>
  );
}
