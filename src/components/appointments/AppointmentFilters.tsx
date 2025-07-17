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
    <div data-filters className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          {...register('search')}
          type="text"
          placeholder="Buscar citas..."
          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all placeholder-gray-400"
        />
        {watchedSearch && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Tabs - Mobile First */}
      <div className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2">
        {[
          { value: 'all', label: 'Todas', icon: '📋', count: null },
          { value: 'PENDING', label: 'Pendientes', icon: '⏳', count: null },
          { value: 'CONFIRMED', label: 'Confirmadas', icon: '✅', count: null },
          { value: 'COMPLETED', label: 'Completadas', icon: '🎉', count: null },
          { value: 'CANCELLED', label: 'Canceladas', icon: '❌', count: null },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`flex-shrink-0 inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === option.value
                ? 'bg-[#D4AF37] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{option.icon}</span>
            <span className="whitespace-nowrap">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Active Filter Indicator */}
      {(filter !== 'all' || watchedSearch) && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
          <div className="flex items-center space-x-2 text-blue-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            <span className="text-sm font-medium">
              Filtros activos
              {watchedSearch && <span className="ml-1">• &quot;{watchedSearch}&quot;</span>}
              {filter !== 'all' && <span className="ml-1">• {filter}</span>}
            </span>
          </div>
          <button
            onClick={() => {
              onSearchChange('');
              onFilterChange('all');
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Limpiar
          </button>
        </div>
      )}
    </div>
  );
}
