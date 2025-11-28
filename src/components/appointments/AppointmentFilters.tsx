import React from "react";
import { useForm } from "react-hook-form";

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
  onFilterChange,
}: FiltersProps) {
  const { register, watch, setValue } = useForm<FilterForm>({
    defaultValues: {
      search: searchTerm,
      status: filter,
    },
  });

  const watchedSearch = watch("search");
  const watchedStatus = watch("status");

  // Sincronizar el formulario con las props cuando cambian externamente
  React.useEffect(() => {
    if (searchTerm !== watchedSearch) {
      setValue("search", searchTerm);
    }
  }, [searchTerm, setValue, watchedSearch]);

  React.useEffect(() => {
    if (filter !== watchedStatus) {
      setValue("status", filter);
    }
  }, [filter, setValue, watchedStatus]);

  // Debounce search input
  React.useEffect(() => {
    if (watchedSearch !== searchTerm) {
      const timer = setTimeout(() => {
        onSearchChange(watchedSearch);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [watchedSearch, onSearchChange, searchTerm]);

  React.useEffect(() => {
    if (watchedStatus !== filter) {
      onFilterChange(watchedStatus);
    }
  }, [watchedStatus, onFilterChange, filter]);

  return (
    <div data-filters className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-[color:var(--color-muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          {...register("search")}
          type="text"
          placeholder="Buscar citas..."
          className="w-full pl-10 pr-12 py-3 text-sm rounded-2xl bg-[color:var(--color-surface-elevated)]/70 text-[color:var(--color-on-surface)] border border-[color:var(--color-border)]/50 placeholder-[color:var(--color-muted)] focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)] transition-all"
        />
        {watchedSearch && (
          <button
            onClick={() => {
              setValue("search", "");
              onSearchChange("");
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="h-4 w-4 text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Tabs - Mobile First */}
      <div className="flex flex-wrap gap-2 pb-2">
        {[
          { value: "all", label: "Todas" },
          { value: "PENDING", label: "Pendientes" },
          { value: "CONFIRMED", label: "Confirmadas" },
          { value: "COMPLETED", label: "Completadas" },
          { value: "CANCELLED", label: "Canceladas" },
        ].map((option) => {
          const isActive = filter === option.value;
          const key = option.value.toLowerCase();
          const style = isActive
            ? option.value === "all"
              ? {
                  backgroundColor: "var(--color-surface-elevated)",
                  color: "var(--color-on-surface)",
                  borderColor: "var(--color-border)",
                }
              : {
                  backgroundColor: `var(--status-${key}-bg)`,
                  color: `var(--status-${key}-text)`,
                  borderColor: `var(--status-${key}-border)`,
                }
            : {
                backgroundColor: "var(--color-surface-elevated)",
                color: "var(--color-muted)",
                borderColor: "var(--color-border)",
              };

          const dotStyle =
            option.value === "all"
              ? { backgroundColor: "var(--color-muted)" }
              : { backgroundColor: `var(--status-${key}-text)` };

          return (
            <button
              key={option.value}
              onClick={() => {
                setValue("status", option.value);
                onFilterChange(option.value);
              }}
              className={`inline-flex items-center px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${isActive ? "shadow-sm ring-1 ring-[color:var(--color-border)]/60" : "hover:opacity-90"}`}
              style={style}
            >
              <span className="w-2 h-2 rounded-full mr-2" style={dotStyle} />
              <span className="whitespace-nowrap">{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Filter Indicator */}
      {(filter !== "all" || watchedSearch) && (
        <div className="flex items-center justify-between rounded-xl px-3 py-2 border bg-[color:var(--color-surface-elevated)]/70 border-[color:var(--color-border)]/50">
          <div className="flex items-center space-x-2 text-[color:var(--color-on-surface)]">
            <svg
              className="w-4 h-4 text-[color:var(--color-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
              />
            </svg>
            <span className="text-sm font-medium">
              Filtros activos
              {watchedSearch && <span className="ml-1">• &quot;{watchedSearch}&quot;</span>}
              {filter !== "all" && <span className="ml-1">• {filter}</span>}
            </span>
          </div>
          <button
            onClick={() => {
              setValue("search", "");
              setValue("status", "all");
              onSearchChange("");
              onFilterChange("all");
            }}
            className="text-[color:var(--color-primary)] hover:opacity-90 text-sm font-medium"
          >
            Limpiar
          </button>
        </div>
      )}
    </div>
  );
}
