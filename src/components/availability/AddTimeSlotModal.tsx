'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const timeSlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().min(1, 'Hora de inicio es requerida'),
  endTime: z.string().min(1, 'Hora de fin es requerida'),
}).refine((data) => data.startTime < data.endTime, {
  message: 'La hora de fin debe ser posterior a la de inicio',
  path: ['endTime'],
});

type TimeSlotFormData = z.infer<typeof timeSlotSchema>;

const DAYS_OF_WEEK = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

interface AddTimeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TimeSlotFormData) => void;
  isLoading: boolean;
}

export default function AddTimeSlotModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading 
}: AddTimeSlotModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TimeSlotFormData>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: {
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00',
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: TimeSlotFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Agregar Horario de Trabajo
        </h3>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-900 mb-2'>
              Día de la semana
            </label>
            <select
              {...register('dayOfWeek', { valueAsNumber: true })}
              className='w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-base sm:text-lg font-medium bg-white'
            >
              {DAYS_OF_WEEK.map((day, index) => (
                <option key={index} value={index}>
                  {day}
                </option>
              ))}
            </select>
            {errors.dayOfWeek && (
              <p className='text-red-500 text-sm mt-1'>{errors.dayOfWeek.message}</p>
            )}
          </div>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm sm:text-base font-bold text-black mb-2'>
                Hora de inicio
              </label>
              <input
                type='time'
                {...register('startTime')}
                className='w-full p-3 border-2 border-gray-300 rounded-lg text-black bg-white focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]'
                style={{ colorScheme: 'light' }}
              />
              {errors.startTime && (
                <p className='text-red-500 text-sm mt-1'>{errors.startTime.message}</p>
              )}
            </div>
            <div>
              <label className='block text-sm sm:text-base font-bold text-black mb-2'>
                Hora de fin
              </label>
              <input
                type='time'
                {...register('endTime')}
                className='w-full p-3 border-2 border-gray-300 rounded-lg text-black bg-white focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]'
                style={{ colorScheme: 'light' }}
              />
              {errors.endTime && (
                <p className='text-red-500 text-sm mt-1'>{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
            <p className='text-xs sm:text-sm text-yellow-800'>
              <strong>Ejemplo:</strong> Si trabajas los lunes de 9:00 AM a 5:00 PM, 
              selecciona &quot;Lunes&quot;, hora de inicio &quot;09:00&quot; y hora de fin &quot;17:00&quot;.
            </p>
          </div>
          
          <div className='flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6'>
            <button
              type='button'
              onClick={handleClose}
              className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base'
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors disabled:opacity-50 text-sm sm:text-base'
            >
              {isLoading ? 'Guardando...' : 'Agregar Horario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
