'use client';

import { useState, useEffect, useCallback } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface TimeSlot {
  id: string;
  dayOfWeek: number; // 0 = Domingo, 1 = Lunes, etc.
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SpecialDate {
  id: string;
  date: string;
  isAvailable: boolean;
  startTime?: string;
  endTime?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

const DAYS_OF_WEEK = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

export default function AvailabilityPage() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [showAddSpecialDate, setShowAddSpecialDate] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
  });

  const [newSpecialDate, setNewSpecialDate] = useState({
    date: '',
    isAvailable: false,
    startTime: '09:00',
    endTime: '17:00',
    note: '',
  });

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchAvailability = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/availability');
      if (response.ok) {
        const data = await response.json();
        setTimeSlots(data.timeSlots || []);
        setSpecialDates(data.specialDates || []);
      } else {
        console.error('Error al cargar disponibilidad');
        showMessage('❌ Error al cargar la disponibilidad');
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      showMessage('❌ Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const addTimeSlot = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'timeSlot',
          dayOfWeek: newSlot.dayOfWeek,
          startTime: newSlot.startTime,
          endTime: newSlot.endTime,
        }),
      });

      if (response.ok) {
        const newTimeSlot = await response.json();
        setTimeSlots((prev) => [...prev, newTimeSlot]);
        setShowAddSlot(false);
        setNewSlot({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' });
        showMessage('Horario agregado exitosamente');
      } else {
        const errorData = await response.json();
        showMessage(errorData.message || 'Error al agregar el horario');
      }
    } catch (error) {
      console.error('Error adding time slot:', error);
      showMessage('❌ Error al conectar con el servidor');
    } finally {
      setSaving(false);
    }
  };

  const toggleTimeSlot = async (id: string) => {
    try {
      const slot = timeSlots.find(s => s.id === id);
      if (!slot) return;

      const response = await fetch(`/api/admin/availability/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !slot.isActive,
        }),
      });

      if (response.ok) {
        setTimeSlots((prev) =>
          prev.map((slot) =>
            slot.id === id ? { ...slot, isActive: !slot.isActive } : slot
          )
        );
        showMessage(
          `Horario ${!slot.isActive ? 'activado' : 'desactivado'} exitosamente`
        );
      } else {
        showMessage('❌ Error al actualizar el horario');
      }
    } catch (error) {
      console.error('Error toggling time slot:', error);
      showMessage('❌ Error al conectar con el servidor');
    }
  };

  const deleteTimeSlot = async (id: string) => {
    if (!confirm('¿Estás segura de que quieres eliminar este horario?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/availability/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTimeSlots((prev) => prev.filter((slot) => slot.id !== id));
        showMessage('Horario eliminado exitosamente');
      } else {
        showMessage('❌ Error al eliminar el horario');
      }
    } catch (error) {
      console.error('Error deleting time slot:', error);
      showMessage('❌ Error al conectar con el servidor');
    }
  };

  const addSpecialDate = async () => {
    if (!newSpecialDate.date) {
      showMessage('❌ Por favor selecciona una fecha');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'specialDate',
          date: newSpecialDate.date,
          isAvailable: newSpecialDate.isAvailable,
          customHours: newSpecialDate.isAvailable
            ? {
                startTime: newSpecialDate.startTime,
                endTime: newSpecialDate.endTime,
              }
            : undefined,
          note: newSpecialDate.note || undefined,
        }),
      });

      if (response.ok) {
        const newSpecialDateData = await response.json();
        setSpecialDates((prev) => [...prev, newSpecialDateData]);
        setShowAddSpecialDate(false);
        setNewSpecialDate({
          date: '',
          isAvailable: false,
          startTime: '09:00',
          endTime: '17:00',
          note: '',
        });
        showMessage('Fecha especial agregada exitosamente');
      } else {
        const errorData = await response.json();
        showMessage(errorData.message || 'Error al agregar la fecha especial');
      }
    } catch (error) {
      console.error('Error adding special date:', error);
      showMessage('❌ Error al conectar con el servidor');
    } finally {
      setSaving(false);
    }
  };

  const deleteSpecialDate = async (id: string) => {
    if (!confirm('¿Estás segura de que quieres eliminar esta fecha especial?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/availability/special/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSpecialDates((prev) => prev.filter((date) => date.id !== id));
        showMessage('Fecha especial eliminada exitosamente');
      } else {
        showMessage('❌ Error al eliminar la fecha especial');
      }
    } catch (error) {
      console.error('Error deleting special date:', error);
      showMessage('❌ Error al conectar con el servidor');
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header con instrucciones */}
      <div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          ⏰ Gestión de Disponibilidad
        </h1>
        <p className='text-gray-700 mb-4'>
          Administra tu horario semanal y fechas especiales para que los clientes puedan agendar citas contigo.
        </p>
        
        <div className='bg-white rounded-lg p-4 border border-purple-100'>
          <h3 className='font-semibold text-purple-800 mb-2'>💡 Cómo funciona:</h3>
          <ul className='text-sm text-gray-600 space-y-1'>
            <li>• <strong>Horario Regular:</strong> Define tus días y horas de trabajo habituales</li>
            <li>• <strong>Fechas Especiales:</strong> Agrega días libres, horarios extendidos o días especiales</li>
            <li>• <strong>Disponibilidad:</strong> Solo las citas dentro de estos horarios estarán disponibles para reserva</li>
          </ul>
        </div>
      </div>

      {/* Mensajes de confirmación */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.includes('Error') 
            ? 'bg-red-50 text-red-700 border-red-200' 
            : 'bg-green-50 text-green-700 border-green-200'
        }`}>
          {message}
        </div>
      )}

      {/* Horario Regular Semanal */}
      <div className='bg-white rounded-lg shadow-sm border'>
        <div className='px-6 py-4 border-b flex justify-between items-center'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>
              📅 Horario Semanal Regular
            </h2>
            <p className='text-sm text-gray-600 mt-1'>
              Define tus horarios de trabajo para cada día de la semana
            </p>
          </div>
          <button
            onClick={() => setShowAddSlot(true)}
            className='bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#B8941F] transition-colors font-medium'
          >
            + Agregar Horario
          </button>
        </div>

        <div className='p-6'>
          {timeSlots.length === 0 ? (
            <div className='text-center py-12'>
              <div className='text-6xl mb-4'>🕐</div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No tienes horarios configurados
              </h3>
              <p className='text-gray-600 mb-4'>
                Agrega tus horarios de trabajo para que los clientes puedan hacer citas
              </p>
              <button
                onClick={() => setShowAddSlot(true)}
                className='bg-[#D4AF37] text-white px-6 py-3 rounded-lg hover:bg-[#B8941F] transition-colors font-medium'
              >
                Configurar Primer Horario
              </button>
            </div>
          ) : (
            <div className='grid gap-4'>
              {DAYS_OF_WEEK.map((day, index) => {
                const daySlots = timeSlots.filter(
                  (slot) => slot.dayOfWeek === index
                );
                return (
                  <div
                    key={index}
                    className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    <div className='flex-1'>
                      <h3 className='font-medium text-gray-900 text-lg'>{day}</h3>
                      <div className='mt-2 space-y-2'>
                        {daySlots.length > 0 ? (
                          daySlots.map((slot) => (
                            <div
                              key={slot.id}
                              className={`flex items-center justify-between p-3 rounded-lg border ${
                                slot.isActive 
                                  ? 'bg-green-50 border-green-200' 
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className='flex items-center space-x-3'>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  slot.isActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {slot.isActive ? '✅ Activo' : '⏸️ Inactivo'}
                                </span>
                                <span className='font-medium text-gray-900'>
                                  {slot.startTime} - {slot.endTime}
                                </span>
                              </div>
                              <div className='flex items-center space-x-2'>
                                <button
                                  onClick={() => toggleTimeSlot(slot.id)}
                                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                    slot.isActive
                                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  }`}
                                >
                                  {slot.isActive ? 'Desactivar' : 'Activar'}
                                </button>
                                <button
                                  onClick={() => deleteTimeSlot(slot.id)}
                                  className='px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors'
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className='text-gray-500 italic'>Sin horarios configurados</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Fechas Especiales */}
      <div className='bg-white rounded-lg shadow-sm border'>
        <div className='px-6 py-4 border-b flex justify-between items-center'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>
              🗓️ Fechas Especiales
            </h2>
            <p className='text-sm text-gray-600 mt-1'>
              Días libres, horarios extendidos, o disponibilidad especial
            </p>
          </div>
          <button
            onClick={() => setShowAddSpecialDate(true)}
            className='bg-[#B06579] text-white px-4 py-2 rounded-lg hover:bg-[#9A5A6B] transition-colors font-medium'
          >
            + Agregar Fecha Especial
          </button>
        </div>

        <div className='p-6'>
          {specialDates.length === 0 ? (
            <div className='text-center py-8'>
              <div className='text-4xl mb-3'>📅</div>
              <p className='text-gray-600 mb-4'>
                No tienes fechas especiales configuradas. Puedes agregar días libres o horarios especiales.
              </p>
              <button
                onClick={() => setShowAddSpecialDate(true)}
                className='bg-[#B06579] text-white px-4 py-2 rounded-lg hover:bg-[#9A5A6B] transition-colors font-medium'
              >
                Agregar Primera Fecha Especial
              </button>
            </div>
          ) : (
            <div className='space-y-3'>
              {specialDates
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((specialDate) => (
                  <div
                    key={specialDate.id}
                    className={`p-4 rounded-lg border ${
                      specialDate.isAvailable
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-4'>
                        <span className='font-medium text-gray-900'>
                          {new Date(specialDate.date).toLocaleDateString('es-PE', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          specialDate.isAvailable
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {specialDate.isAvailable ? '✅ Disponible' : '❌ No Disponible'}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteSpecialDate(specialDate.id)}
                        className='px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors'
                      >
                        Eliminar
                      </button>
                    </div>
                    
                    {specialDate.startTime && specialDate.endTime && (
                      <div className='mt-2 text-sm text-gray-600'>
                        <strong>Horario especial:</strong> {specialDate.startTime} - {specialDate.endTime}
                      </div>
                    )}
                    
                    {specialDate.note && (
                      <div className='mt-2 text-sm text-gray-600'>
                        <strong>Nota:</strong> {specialDate.note}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Agregar Horario */}
      {showAddSlot && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              ➕ Agregar Horario de Trabajo
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                  📅 Día de la semana
                </label>
                <select
                  value={newSlot.dayOfWeek}
                  onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: parseInt(e.target.value) })}
                  className='w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-lg font-medium bg-white'
                >
                  {DAYS_OF_WEEK.map((day, index) => (
                    <option key={index} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-base font-bold text-black'>
                    🕘 Hora de inicio
                  </label>
                  <input
                    type='time'
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    className='w-full p-2 border-1 rounded-lg border-gray-400 text-black bg-white'
                    style={{ colorScheme: 'light' }}
                  />
                </div>
                <div>
                  <label className='block text-base font-bold text-black'>
                    🕐 Hora de fin
                  </label>
                  <input
                    type='time'
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    className='w-full p-2 border-1 rounded-lg border-gray-400 text-black bg-white'
                    style={{ colorScheme: 'light' }}
                  />
                </div>
              </div>

              <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
                <p className='text-sm text-yellow-800'>
                  <strong>💡 Ejemplo:</strong> Si trabajas los lunes de 9:00 AM a 5:00 PM, 
                  selecciona &quot;Lunes&quot;, hora de inicio &quot;09:00&quot; y hora de fin &quot;17:00&quot;.
                </p>
              </div>
            </div>
            
            <div className='flex justify-end space-x-3 mt-6'>
              <button
                onClick={() => setShowAddSlot(false)}
                className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                onClick={addTimeSlot}
                disabled={saving}
                className='px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors disabled:opacity-50'
              >
                {saving ? 'Guardando...' : 'Agregar Horario'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Agregar Fecha Especial */}
      {showAddSpecialDate && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              🗓️ Agregar Fecha Especial
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                  📅 Fecha
                </label>
                <input
                  type='date'
                  value={newSpecialDate.date}
                  onChange={(e) => setNewSpecialDate({ ...newSpecialDate, date: e.target.value })}
                  className='w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B06579] focus:border-[#B06579] text-lg font-medium'
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                  📝 Tipo de fecha especial
                </label>
                <div className='space-y-2'>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      name='availability'
                      checked={!newSpecialDate.isAvailable}
                      onChange={() => setNewSpecialDate({ ...newSpecialDate, isAvailable: false })}
                      className='mr-2 text-[#B06579] focus:ring-[#B06579]'
                    />
                    <span className='text-sm'>❌ No disponible (día libre, vacaciones, etc.)</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      name='availability'
                      checked={newSpecialDate.isAvailable}
                      onChange={() => setNewSpecialDate({ ...newSpecialDate, isAvailable: true })}
                      className='mr-2 text-[#B06579] focus:ring-[#B06579]'
                    />
                    <span className='text-sm'>✅ Disponible con horario especial</span>
                  </label>
                </div>
              </div>

              {newSpecialDate.isAvailable && (
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-base font-bold text-black mb-3'>
                      🕘 Hora de inicio
                    </label>
                    <input
                      type='time'
                      value={newSpecialDate.startTime}
                      onChange={(e) => setNewSpecialDate({ ...newSpecialDate, startTime: e.target.value })}
                      className='w-full p-2 border-2 border-gray-200 rounded-lg focus:ring-2 text-md text-black bg-white'
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                  <div>
                    <label className='block text-base font-bold text-black mb-3'>
                      🕐 Hora de fin
                    </label>
                    <input
                      type='time'
                      value={newSpecialDate.endTime}
                      onChange={(e) => setNewSpecialDate({ ...newSpecialDate, endTime: e.target.value })}
                      className='w-full p-2 border-2 border-gray-200 rounded-lg focus:ring-2 text-md text-black bg-white'
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className='block text-sm font-semibold text-gray-900 mb-2'>
                  📝 Nota (opcional)
                </label>
                <input
                  type='text'
                  value={newSpecialDate.note}
                  onChange={(e) => setNewSpecialDate({ ...newSpecialDate, note: e.target.value })}
                  placeholder='Ej: Día de San Valentín, Vacaciones de verano...'
                  className='w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B06579] focus:border-[#B06579] text-base'
                />
              </div>

              <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
                <p className='text-sm text-blue-800'>
                  <strong>💡 Ejemplos:</strong><br/>
                  • Día libre: Selecciona &quot;No disponible&quot; para vacaciones<br/>
                  • Horario extendido: Selecciona &quot;Disponible&quot; para días especiales como San Valentín
                </p>
              </div>
            </div>
            
            <div className='flex justify-end space-x-3 mt-6'>
              <button
                onClick={() => setShowAddSpecialDate(false)}
                className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                onClick={addSpecialDate}
                disabled={saving || !newSpecialDate.date}
                className='px-4 py-2 bg-[#B06579] text-white rounded-lg hover:bg-[#9A5A6B] transition-colors disabled:opacity-50'
              >
                {saving ? 'Guardando...' : 'Agregar Fecha'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
