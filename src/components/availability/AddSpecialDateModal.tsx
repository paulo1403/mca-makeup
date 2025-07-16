'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

const specialDateSchema = z.object({
  date: z.date({
    required_error: 'Fecha es requerida',
  }),
  isAvailable: z.boolean(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  note: z.string().optional(),
}).refine((data) => {
  if (data.isAvailable && (!data.startTime || !data.endTime)) {
    return false;
  }
  if (data.isAvailable && data.startTime && data.endTime) {
    return data.startTime < data.endTime;
  }
  return true;
}, {
  message: 'Para fechas disponibles, las horas son requeridas y la hora de fin debe ser posterior',
  path: ['endTime'],
});

type SpecialDateFormData = z.infer<typeof specialDateSchema>;

interface AddSpecialDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    date: string;
    isAvailable: boolean;
    customHours?: { startTime: string; endTime: string };
    note?: string;
  }) => void;
  isLoading: boolean;
}

export default function AddSpecialDateModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading 
}: AddSpecialDateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors }
  } = useForm<SpecialDateFormData>({
    resolver: zodResolver(specialDateSchema),
    defaultValues: {
      date: undefined,
      isAvailable: false,
      startTime: '09:00',
      endTime: '17:00',
      note: '',
    }
  });

  const isAvailable = watch('isAvailable');

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: SpecialDateFormData) => {
    const formattedData = {
      date: format(data.date, 'yyyy-MM-dd'),
      isAvailable: data.isAvailable,
      customHours: data.isAvailable && data.startTime && data.endTime
        ? { startTime: data.startTime, endTime: data.endTime }
        : undefined,
      note: data.note || undefined,
    };
    
    onSubmit(formattedData);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Agregar Fecha Especial
        </h3>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-900 mb-2'>
              Fecha
            </label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  dateFormat="dd/MM/yyyy"
                  locale={es}
                  minDate={new Date()}
                  placeholderText="Seleccionar fecha..."
                  className='w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B06579] focus:border-[#B06579] text-lg font-medium'
                  calendarClassName="react-datepicker-custom"
                />
              )}
            />
            {errors.date && (
              <p className='text-red-500 text-sm mt-1'>{errors.date.message}</p>
            )}
            <p className='text-xs text-gray-500 mt-1'>
              Formato: DD/MM/AAAA (día/mes/año)
            </p>
          </div>
          
          <div>
            <label className='block text-sm font-semibold text-gray-900 mb-3'>
              Tipo de fecha especial
            </label>
            <div className='space-y-3'>
              <label className='flex items-start cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors'>
                <input
                  type='radio'
                  {...register('isAvailable')}
                  value="false"
                  className='mt-1 mr-3 text-[#B06579] focus:ring-[#B06579] focus:ring-2'
                />
                <div>
                  <span className='text-sm font-medium text-gray-900'>No disponible</span>
                  <p className='text-xs text-gray-600 mt-1'>Día libre, vacaciones, feriado, etc.</p>
                </div>
              </label>
              <label className='flex items-start cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors'>
                <input
                  type='radio'
                  {...register('isAvailable')}
                  value="true"
                  className='mt-1 mr-3 text-[#B06579] focus:ring-[#B06579] focus:ring-2'
                />
                <div>
                  <span className='text-sm font-medium text-gray-900'>Disponible con horario especial</span>
                  <p className='text-xs text-gray-600 mt-1'>Horario diferente al habitual (ej: San Valentín)</p>
                </div>
              </label>
            </div>
          </div>

          {isAvailable && (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm sm:text-base font-bold text-black mb-2 sm:mb-3'>
                  Hora de inicio
                </label>
                <input
                  type='time'
                  {...register('startTime')}
                  className='w-full p-3 sm:p-2 border-2 border-gray-200 rounded-lg focus:ring-2 text-base sm:text-md text-black bg-white'
                  style={{ colorScheme: 'light' }}
                />
                {errors.startTime && (
                  <p className='text-red-500 text-sm mt-1'>{errors.startTime.message}</p>
                )}
              </div>
              <div>
                <label className='block text-sm sm:text-base font-bold text-black mb-2 sm:mb-3'>
                  Hora de fin
                </label>
                <input
                  type='time'
                  {...register('endTime')}
                  className='w-full p-3 sm:p-2 border-2 border-gray-200 rounded-lg focus:ring-2 text-base sm:text-md text-black bg-white'
                  style={{ colorScheme: 'light' }}
                />
                {errors.endTime && (
                  <p className='text-red-500 text-sm mt-1'>{errors.endTime.message}</p>
                )}
              </div>
            </div>
          )}

          <div>
            <label className='block text-sm font-semibold text-gray-900 mb-2'>
              Nota (opcional)
            </label>
            <input
              type='text'
              {...register('note')}
              placeholder='Ej: Día de San Valentín, Vacaciones de verano...'
              className='w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B06579] focus:border-[#B06579] text-base'
            />
          </div>

          <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
            <p className='text-sm text-blue-800'>
              <strong>Ejemplos:</strong><br/>
              • Día libre: Selecciona &quot;No disponible&quot; para vacaciones<br/>
              • Horario extendido: Selecciona &quot;Disponible&quot; para días especiales como San Valentín
            </p>
          </div>
          
          <div className='flex flex-col sm:flex-row justify-end gap-3 sm:space-x-3 mt-6'>
            <button
              type='button'
              onClick={handleClose}
              className='w-full sm:w-auto px-4 py-3 sm:py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium'
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full sm:w-auto px-4 py-3 sm:py-2 bg-[#B06579] text-white rounded-lg hover:bg-[#9A5A6B] transition-colors disabled:opacity-50 font-medium'
            >
              {isLoading ? 'Guardando...' : 'Agregar Fecha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
