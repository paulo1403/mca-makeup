'use client';

import { SpecialDate } from '@/hooks/useAvailability';
import { Trash2, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

interface SpecialDateListProps {
  specialDates: SpecialDate[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function SpecialDateList({ 
  specialDates, 
  onDelete, 
  isLoading = false 
}: SpecialDateListProps) {
  const handleDelete = (id: string) => {
    if (confirm('¿Estás segura de que quieres eliminar esta fecha especial?')) {
      onDelete(id);
    }
  };

  if (specialDates.length === 0) {
    return (
      <div className='text-center py-8'>
        <Calendar className='mx-auto h-12 w-12 text-gray-400 mb-4' />
        <p className='text-gray-600 mb-4'>
          No tienes fechas especiales configuradas. Puedes agregar días libres o horarios especiales.
        </p>
      </div>
    );
  }

  const sortedDates = specialDates
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className='space-y-3'>
      {sortedDates.map((specialDate) => (
        <div
          key={specialDate.id}
          className={`p-4 rounded-lg border transition-all ${
            specialDate.isAvailable
              ? 'bg-blue-50 border-blue-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              {/* Fecha y estado */}
              <div className='flex items-center space-x-3 mb-2'>
                {specialDate.isAvailable ? (
                  <CheckCircle className='h-5 w-5 text-blue-500' />
                ) : (
                  <XCircle className='h-5 w-5 text-red-500' />
                )}
                <div>
                  <div className='font-medium text-gray-900'>
                    {new Date(specialDate.date).toLocaleDateString('es-PE', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    specialDate.isAvailable
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {specialDate.isAvailable ? 'Disponible' : 'No Disponible'}
                  </span>
                </div>
              </div>
              
              {/* Horario especial */}
              {specialDate.startTime && specialDate.endTime && (
                <div className='flex items-center space-x-2 mb-2 text-sm text-gray-600'>
                  <Clock className='h-4 w-4' />
                  <span>
                    <strong>Horario especial:</strong> {specialDate.startTime} - {specialDate.endTime}
                  </span>
                </div>
              )}
              
              {/* Nota */}
              {specialDate.note && (
                <div className='text-sm text-gray-600'>
                  <strong>Nota:</strong> {specialDate.note}
                </div>
              )}
            </div>
            
            {/* Botón eliminar */}
            <button
              onClick={() => handleDelete(specialDate.id)}
              disabled={isLoading}
              className='p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50 ml-4'
              title='Eliminar fecha especial'
            >
              <Trash2 className='h-4 w-4' />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
