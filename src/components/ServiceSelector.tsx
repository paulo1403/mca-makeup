"use client";

import { AlertTriangle, ChevronDown, Clock, Minus, Plus, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CATEGORY_COLORS, CATEGORY_LABELS, validateSelection } from "@/lib/serviceRules";
import type { Service, ServiceSelection } from "@/types";

interface ServiceSelectorProps {
  value: ServiceSelection;
  onChangeAction: (services: ServiceSelection) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  onLoadingChangeAction?: (loading: boolean) => void;
}

// ...existing code...

export default function ServiceSelector({
  value,
  onChangeAction,
  required = false,
  disabled = false,
  placeholder = "Selecciona servicios...",
  className = "",
  onLoadingChangeAction,
}: ServiceSelectorProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [validationError, setValidationError] = useState<{
    message: string;
    suggestion: string;
  } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        onLoadingChangeAction?.(true);
        const response = await fetch("/api/services");

        if (response.ok) {
          const data = await response.json();
          setServices(data.services || []);
        } else {
          console.error("No se pudieron cargar los servicios");
          setServices([]);
        }
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        setLoading(false);
        onLoadingChangeAction?.(false);
      }
    };

    loadServices();
  }, [onLoadingChangeAction]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateServiceCombination = (
    selectedServices: ServiceSelection,
  ): { message: string; suggestion: string } | null => {
    // selectedServices is a map of serviceId -> quantity
    return validateSelection(selectedServices, services);
  };

  const filteredServices = services.filter((service) => {
    if (!searchTerm) return true;
    return (
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      CATEGORY_LABELS[service.category as keyof typeof CATEGORY_LABELS]
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  const servicesByCategory = filteredServices.reduce(
    (acc, service) => {
      const category = service.category as keyof typeof CATEGORY_LABELS;
      if (!acc[category]) acc[category] = [];
      acc[category].push(service);
      return acc;
    },
    {} as Record<keyof typeof CATEGORY_LABELS, Service[]>,
  );

  const selectedServices = services.filter((service) => value[service.id] && value[service.id] > 0);

  const handleQuantityChange = (service: Service, quantity: number) => {
    const newSelection = { ...value };

    if (quantity <= 0) {
      delete newSelection[service.id];
    } else {
      newSelection[service.id] = quantity;
    }

    onChangeAction(newSelection);

    const error = validateServiceCombination(newSelection);
    setValidationError(error);
  };

  const handleToggleService = (service: Service) => {
    const currentQuantity = value[service.id] || 0;
    handleQuantityChange(service, currentQuantity > 0 ? 0 : 1);
  };

  const handleInputClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
    return `${minutes}min`;
  };

  const getTotalDuration = () => {
    return selectedServices.reduce(
      (total, service) => total + service.duration * (value[service.id] || 0),
      0,
    );
  };

  const getTotalPrice = () => {
    return selectedServices.reduce(
      (total, service) => total + service.price * (value[service.id] || 0),
      0,
    );
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Campo de entrada */}
      <div
        className={`
          min-h-[2.75rem] w-full px-3 py-2 border border-[color:var(--color-border)] rounded-lg
          bg-[color:var(--color-surface)] cursor-pointer transition-all duration-200
          hover:border-[color:var(--color-primary)] focus-within:border-[color:var(--color-primary)] focus-within:ring-2 focus-within:ring-[color:var(--color-primary)]/20
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${
            validationError
              ? "border-[color:var(--color-primary)]/60 focus-within:border-[color:var(--color-primary)] focus-within:ring-[color:var(--color-primary)]/20"
              : ""
          }
        `}
        onClick={handleInputClick}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Input para búsqueda */}
            <input
              ref={inputRef}
              type="text"
              placeholder={selectedServices.length > 0 ? "" : placeholder}
              value={searchTerm}
              onChange={handleSearchChange}
              disabled={disabled}
              className="w-full border-none outline-none bg-transparent text-sm placeholder:text-[color:var(--color-muted)] text-[color:var(--color-heading)] service-selector-input"
              required={required && selectedServices.length === 0}
            />

            {/* Servicios seleccionados */}
            {selectedServices.length > 0 && !searchTerm && (
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedServices.map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] text-xs rounded-md"
                  >
                    {value[service.id] > 1 && (
                      <span className="font-bold">{value[service.id]}x</span>
                    )}
                    {service.name}
                    <span className="font-semibold">
                      S/ {service.price * (value[service.id] || 0)}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Loading spinner o chevron */}
          <div className="flex items-center gap-2">
            {selectedServices.length > 0 && (
              <span className="text-xs text-[color:var(--color-muted)] whitespace-nowrap">
                {selectedServices.length} seleccionado
                {selectedServices.length > 1 ? "s" : ""}
              </span>
            )}
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[color:var(--color-primary)]" />
            ) : (
              <ChevronDown
                className={`h-4 w-4 text-[color:var(--color-muted)] transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </div>
        </div>
      </div>

      {/* Error de validación */}
      {validationError && (
        <div className="mt-2 flex items-start gap-2 p-3 bg-[color:var(--color-accent-soft)] border border-[color:var(--color-border)] rounded-lg">
          <AlertTriangle className="h-4 w-4 text-[color:var(--color-primary)] mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm text-[color:var(--color-heading)] font-medium">
              {validationError.message}
            </span>
            <p className="text-sm text-[color:var(--color-body)] mt-1">
              {validationError.suggestion}
            </p>
            <p className="text-xs text-[color:var(--color-muted)] mt-2">
              Puedes seguir seleccionando servicios, pero esta combinación no podrá ser enviada.
            </p>
          </div>
        </div>
      )}

      {/* Resumen de servicios seleccionados */}
      {selectedServices.length > 0 && !isOpen && !loading && (
        <div className="mt-3 p-3 bg-[color:var(--color-accent-soft)] rounded-lg border border-[color:var(--color-border)]">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-[color:var(--color-heading)] text-sm">
              Servicios seleccionados:
            </span>
            <div className="text-right">
              <div className="text-lg font-bold text-[color:var(--color-primary)]">
                S/ {getTotalPrice()}
              </div>
              <div className="text-xs text-[color:var(--color-muted)] flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(getTotalDuration())}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {selectedServices.map((service, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-[color:var(--color-heading)]">
                  {value[service.id] > 1 && (
                    <span className="font-bold text-[color:var(--color-primary)] mr-1">
                      {value[service.id]}x
                    </span>
                  )}
                  {service.name}
                </span>
                <span className="font-medium text-[color:var(--color-body)]">
                  S/ {service.price * (value[service.id] || 0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[color:var(--color-primary)] mx-auto mb-2" />
              <span className="text-sm text-[color:var(--color-muted)]">Cargando servicios...</span>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="p-4 text-center text-[color:var(--color-muted)] text-sm">
              {searchTerm ? "No se encontraron servicios" : "No hay servicios disponibles"}
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                <div
                  key={category}
                  className="border-b border-[color:var(--color-border)]/50 last:border-b-0"
                >
                  {/* Header de categoría */}
                  <div
                    className={`px-3 py-2 text-xs font-medium border-l-4 ${
                      CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                    </div>
                  </div>

                  {/* Servicios de la categoría */}
                  {categoryServices.map((service) => {
                    const currentQuantity = value[service.id] || 0;
                    const isSelected = currentQuantity > 0;

                    return (
                      <div
                        key={service.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleToggleService(service)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                            e.preventDefault();
                            handleToggleService(service);
                          }
                        }}
                        className={`
                          flex items-start gap-3 p-3 transition-colors duration-150
                          hover:bg-[color:var(--color-accent-soft)] border-l-4 border-transparent
                          ${isSelected ? "bg-[color:var(--color-primary)]/5 border-l-[color:var(--color-primary)]" : ""}
                        `}
                      >
                        {/* Checkbox */}
                        <div className="flex items-center mt-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleService(service)}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded border-[color:var(--color-border)] text-[color:var(--color-primary)] focus:ring-[color:var(--color-primary)] focus:ring-2"
                          />
                        </div>

                        {/* Información del servicio */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-[color:var(--color-heading)] text-sm leading-tight">
                                {service.name}
                              </h4>
                              {service.description && (
                                <p className="text-xs text-[color:var(--color-body)] mt-1 leading-relaxed">
                                  {service.description}
                                </p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="font-bold text-[color:var(--color-primary)]">
                                S/ {service.price}
                              </span>
                            </div>
                          </div>

                          {/* Duración y controls de cantidad */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 text-xs text-[color:var(--color-body)]">
                              <Clock className="h-3 w-3" />
                              <span>{formatDuration(service.duration)}</span>
                            </div>

                            {/* Quantity controls */}
                            {isSelected && (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(service, currentQuantity - 1);
                                  }}
                                  className="w-6 h-6 rounded-full bg-[color:var(--color-border)] hover:bg-[color:var(--color-muted)]/30 flex items-center justify-center transition-colors text-[color:var(--color-heading)]"
                                  disabled={currentQuantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </button>

                                <span className="min-w-[20px] text-center text-sm font-medium text-[color:var(--color-heading)]">
                                  {currentQuantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(service, currentQuantity + 1);
                                  }}
                                  className="w-6 h-6 rounded-full bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-hover)] text-white flex items-center justify-center transition-colors"
                                  disabled={currentQuantity >= 5} // Límite máximo de 5
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
