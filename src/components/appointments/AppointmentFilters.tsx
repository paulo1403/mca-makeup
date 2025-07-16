import React from 'react';
import { useForm } from 'react-hook-form';

interface FiltersProps {
  searchTerm: string;
  filter: string;
  onSearchChange: (search: string) => void;
  onFilterChange: (filter: string) => void;
}

interface FilterForm {
  search: string;
  status: string;
}

export default function AppointmentFilters({ 
  searchTerm, 
  filter, 
  onSearchChange, 
  onFilterChange 
}: FiltersProps) {
  const { register, watch } = useForm<FilterForm>({
    defaultValues: {
      search: searchTerm,
      status: filter,
    }
  });

  const watchedSearch = watch('search');
  const watchedStatus = watch('status');

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(watchedSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [watchedSearch, onSearchChange]);

  React.useEffect(() => {
    onFilterChange(watchedStatus);
  }, [watchedStatus, onFilterChange]);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            {...register('search')}
            type="text"
            placeholder="Buscar por nombre, email o servicio..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
          />
        </div>
        <div className="md:w-48">
          <select
            {...register('status')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="CONFIRMED">Confirmadas</option>
            <option value="COMPLETED">Completadas</option>
            <option value="CANCELLED">Canceladas</option>
          </select>
        </div>
      </div>
    </div>
  );
}
