'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DatePicker from 'react-datepicker';
import { es } from 'date-fns/locale';
import Modal, { ModalHeader, ModalBody } from '@/components/ui/Modal';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';

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
    const year = data.date.getFullYear();
    const month = String(data.date.getMonth() + 1).padStart(2, '0');
    const day = String(data.date.getDate()).padStart(2, '0');
    const localDateString = `${year}-${month}-${day}`;
    
    const formattedData = {
      date: localDateString,
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
    <Modal open={isOpen} onClose={handleClose} size='sm' ariaLabelledBy='add-specialdate-title'>
      <ModalHeader title={<Typography as='span' id='add-specialdate-title' variant='h3'>Agregar Fecha Especial</Typography>} onClose={handleClose} />
      <ModalBody>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
          <div>
            <Typography as='label' variant='small' className='block text-sm font-semibold text-[color:var(--color-heading)] mb-2'>
              Fecha
            </Typography>
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
                  className='w-full p-3 border rounded-lg border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] text-[color:var(--color-body)] focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]'
                  calendarClassName="premium-datepicker"
                />
              )}
            />
            {errors.date && (
              <Typography variant='caption' className='text-red-500 mt-1'>{errors.date.message}</Typography>
            )}
            <Typography variant='caption' className='text-[color:var(--color-muted)] mt-1'>
              Formato: DD/MM/AAAA (día/mes/año)
            </Typography>
          </div>
          
          <div>
            <Typography as='label' variant='small' className='block text-sm font-semibold text-[color:var(--color-heading)] mb-3'>
              Tipo de fecha especial
            </Typography>
            <Controller
              name="isAvailable"
              control={control}
              render={({ field }) => (
                <div className='space-y-3'>
                  <label className='flex items-start cursor-pointer p-3 rounded-lg border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-elevated)] transition-colors'>
                    <input
                      type='radio'
                      checked={field.value === false}
                      onChange={() => field.onChange(false)}
                      className='mt-1 mr-3 text-[color:var(--color-primary)] focus:ring-[color:var(--color-primary)] focus:ring-2'
                    />
                    <div>
                      <Typography variant='small' className='font-medium text-[color:var(--color-heading)]'>No disponible</Typography>
                      <Typography variant='caption' className='text-[color:var(--color-muted)] mt-1'>Día libre, vacaciones, feriado, etc.</Typography>
                    </div>
                  </label>
                  <label className='flex items-start cursor-pointer p-3 rounded-lg border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-elevated)] transition-colors'>
                    <input
                      type='radio'
                      checked={field.value === true}
                      onChange={() => field.onChange(true)}
                      className='mt-1 mr-3 text-[color:var(--color-primary)] focus:ring-[color:var(--color-primary)] focus:ring-2'
                    />
                    <div>
                      <Typography variant='small' className='font-medium text-[color:var(--color-heading)]'>Disponible con horario especial</Typography>
                      <Typography variant='caption' className='text-[color:var(--color-muted)] mt-1'>Horario diferente al habitual (ej: San Valentín)</Typography>
                    </div>
                  </label>
                </div>
              )}
            />
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
                  className='w-full p-3 sm:p-2 border rounded-lg border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] focus:ring-2 text-base sm:text-md text-[color:var(--color-body)]'
                  style={{ colorScheme: 'dark' }}
                />
                {errors.startTime && (
                  <Typography variant='caption' className='text-red-500 mt-1'>{errors.startTime.message}</Typography>
                )}
              </div>
              <div>
                <label className='block text-sm sm:text-base font-bold text-black mb-2 sm:mb-3'>
                  Hora de fin
                </label>
                <input
                  type='time'
                  {...register('endTime')}
                  className='w-full p-3 sm:p-2 border rounded-lg border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] focus:ring-2 text-base sm:text-md text-[color:var(--color-body)]'
                  style={{ colorScheme: 'dark' }}
                />
                {errors.endTime && (
                  <Typography variant='caption' className='text-red-500 mt-1'>{errors.endTime.message}</Typography>
                )}
              </div>
            </div>
          )}

          <div>
            <Typography
              as='label'
              htmlFor='add-specialdate-note'
              variant='small'
              className='block text-sm font-semibold text-[color:var(--color-heading)] mb-2'
            >
              Nota (opcional)
            </Typography>
            <input
              id='add-specialdate-note'
              type='text'
              {...register('note')}
              placeholder='Ej: Día de San Valentín, Vacaciones de verano...'
              className='w-full p-3 border rounded-lg border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)] text-base text-[color:var(--color-body)]'
            />
          </div>

          <div className='bg-[color:var(--color-accent)]/6 border border-[color:var(--color-accent)]/20 rounded-lg p-3'>
            <Typography variant='small' className='text-[color:var(--color-on-surface)]'>
              <span className='font-semibold'>Ejemplos:</span><br/>
              • Día libre: Selecciona &quot;No disponible&quot; para vacaciones<br/>
              • Horario extendido: Selecciona &quot;Disponible&quot; para días especiales como San Valentín
            </Typography>
          </div>
          
          <div className='flex flex-col sm:flex-row justify-end gap-3 sm:space-x-3 mt-6'>
            <Button
              type='button'
              onClick={handleClose}
              variant='ghost'
              size='md'
              className='w-full sm:w-auto min-w-[120px]'
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              variant='primary'
              size='md'
              className='w-full sm:w-auto min-w-[160px]'
            >
              {isLoading ? 'Guardando...' : 'Agregar Fecha'}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
