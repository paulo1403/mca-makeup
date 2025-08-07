"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Sparkles, Clock, AlertTriangle } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: number;
  description?: string;
  duration: number;
  category: string;
}

interface ServiceSelectorProps {
  value: string[];
  onChangeAction: (services: string[]) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  onLoadingChangeAction?: (loading: boolean) => void;
}

const CATEGORY_LABELS = {
  BRIDAL: "Novias",
  SOCIAL: "Social/Eventos",
  MATURE_SKIN: "Piel Madura",
  HAIRSTYLE: "Peinados",
  OTHER: "Otros",
};

const CATEGORY_COLORS = {
  BRIDAL: "bg-pink-50 border-pink-200 text-pink-700",
  SOCIAL: "bg-purple-50 border-purple-200 text-purple-700",
  MATURE_SKIN: "bg-amber-50 border-amber-200 text-amber-700",
  HAIRSTYLE: "bg-blue-50 border-blue-200 text-blue-700",
  OTHER: "bg-gray-50 border-gray-200 text-gray-700",
};

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
  const [validationError, setValidationError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar servicios
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
          // Fallback services
          const fallbackServices = [
            {
              id: "1",
              name: "Maquillaje de Novia - Paquete Básico",
              price: 480,
              duration: 180,
              category: "BRIDAL",
              description: "Maquillaje completo para el día más especial",
            },
            {
              id: "2",
              name: "Maquillaje de Novia - Paquete Clásico",
              price: 980,
              duration: 240,
              category: "BRIDAL",
              description: "Incluye prueba previa y retoque",
            },
            {
              id: "3",
              name: "Maquillaje Social - Estilo Natural",
              price: 200,
              duration: 120,
              category: "SOCIAL",
              description: "Look natural para eventos del día",
            },
            {
              id: "4",
              name: "Maquillaje Social - Estilo Glam",
              price: 210,
              duration: 120,
              category: "SOCIAL",
              description: "Look sofisticado para eventos de noche",
            },
            {
              id: "5",
              name: "Maquillaje para Piel Madura",
              price: 230,
              duration: 150,
              category: "MATURE_SKIN",
              description: "Técnicas especializadas para piel madura",
            },
            {
              id: "6",
              name: "Peinados Elegantes",
              price: 65,
              duration: 90,
              category: "HAIRSTYLE",
              description: "Peinados para complementar tu look",
            },
          ];
          setServices(fallbackServices);
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

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Validación de combinaciones permitidas
  const validateServiceCombination = (selectedServices: string[]): string => {
    if (selectedServices.length === 0) return "";

    const selectedServiceObjects = services.filter((service) =>
      selectedServices.includes(`${service.name} (S/ ${service.price})`),
    );

    const categories = selectedServiceObjects.map(
      (service) => service.category,
    );
    const uniqueCategories = [...new Set(categories)];

    // No permitir solo peinado
    if (uniqueCategories.length === 1 && uniqueCategories[0] === "HAIRSTYLE") {
      return "No se puede reservar solo peinado. Debe incluir un servicio de maquillaje.";
    }

    // No permitir combinar novia con social/piel madura
    const hasNovia = categories.includes("BRIDAL");
    const hasSocial =
      categories.includes("SOCIAL") || categories.includes("MATURE_SKIN");

    if (hasNovia && hasSocial) {
      return "No se pueden combinar servicios de novia con servicios sociales o de piel madura.";
    }

    // Si hay más de una categoría, verificar que sean combinaciones válidas
    if (uniqueCategories.length > 2) {
      return "Solo se pueden combinar máximo 2 tipos de servicios.";
    }

    if (uniqueCategories.length === 2) {
      // Solo permitir maquillaje + peinado
      const hasHairstyle = categories.includes("HAIRSTYLE");
      const hasMakeup =
        categories.includes("SOCIAL") ||
        categories.includes("MATURE_SKIN") ||
        categories.includes("BRIDAL");

      if (!(hasHairstyle && hasMakeup)) {
        return "Solo se puede combinar maquillaje con peinado.";
      }
    }

    return "";
  };

  // Filtrar servicios por búsqueda
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

  // Agrupar por categoría
  const servicesByCategory = filteredServices.reduce(
    (acc, service) => {
      const category = service.category as keyof typeof CATEGORY_LABELS;
      if (!acc[category]) acc[category] = [];
      acc[category].push(service);
      return acc;
    },
    {} as Record<keyof typeof CATEGORY_LABELS, Service[]>,
  );

  const selectedServices = services.filter((service) =>
    value.includes(`${service.name} (S/ ${service.price})`),
  );

  const handleToggleService = (service: Service) => {
    const serviceKey = `${service.name} (S/ ${service.price})`;
    const isSelected = value.includes(serviceKey);

    let newSelection: string[];
    if (isSelected) {
      newSelection = value.filter((s) => s !== serviceKey);
    } else {
      newSelection = [...value, serviceKey];
    }

    // Validar nueva selección
    const error = validateServiceCombination(newSelection);
    setValidationError(error);

    // Si no hay error o si estamos deseleccionando, aplicar cambio
    if (!error || isSelected) {
      onChangeAction(newSelection);
      if (isSelected) setValidationError("");
    }
  };

  const handleInputClick = () => {
    setIsOpen(true);
    setSearchTerm("");
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
      (total, service) => total + service.duration,
      0,
    );
  };

  const getTotalPrice = () => {
    return selectedServices.reduce(
      (total, service) => total + service.price,
      0,
    );
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Campo de entrada */}
      <div
        className={`
          min-h-[2.75rem] w-full px-3 py-2 border border-gray-300 rounded-lg
          bg-white cursor-pointer transition-all duration-200
          hover:border-primary-accent focus-within:border-primary-accent focus-within:ring-2 focus-within:ring-primary-accent/20
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${validationError ? "border-red-300 focus-within:border-red-500 focus-within:ring-red-500/20" : ""}
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
              className="w-full border-none outline-none bg-transparent text-sm placeholder-gray-500 service-selector-input"
              required={required && selectedServices.length === 0}
            />

            {/* Servicios seleccionados */}
            {selectedServices.length > 0 && !searchTerm && (
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedServices.map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary-accent/10 text-primary-accent text-xs rounded-md"
                  >
                    {service.name}
                    <span className="font-semibold">S/ {service.price}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Loading spinner o chevron */}
          <div className="flex items-center gap-2">
            {selectedServices.length > 0 && (
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {selectedServices.length} seleccionado
                {selectedServices.length > 1 ? "s" : ""}
              </span>
            )}
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-accent"></div>
            ) : (
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </div>
        </div>
      </div>

      {/* Error de validación */}
      {validationError && (
        <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-red-700">{validationError}</span>
        </div>
      )}

      {/* Resumen de servicios seleccionados */}
      {selectedServices.length > 0 && !isOpen && !loading && (
        <div className="mt-3 p-3 bg-gradient-to-r from-primary-accent/5 to-secondary-accent/5 rounded-lg border border-primary-accent/20">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-900 text-sm">
              Servicios seleccionados:
            </span>
            <div className="text-right">
              <div className="text-lg font-bold text-primary-accent">
                S/ {getTotalPrice()}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(getTotalDuration())}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {selectedServices.map((service, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-700">{service.name}</span>
                <span className="font-medium">S/ {service.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-accent mx-auto mb-2"></div>
              <span className="text-sm text-gray-500">
                Cargando servicios...
              </span>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              {searchTerm
                ? "No se encontraron servicios"
                : "No hay servicios disponibles"}
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {Object.entries(servicesByCategory).map(
                ([category, categoryServices]) => (
                  <div
                    key={category}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    {/* Header de categoría */}
                    <div
                      className={`px-3 py-2 text-xs font-medium border-l-4 ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}`}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3" />
                        {
                          CATEGORY_LABELS[
                            category as keyof typeof CATEGORY_LABELS
                          ]
                        }
                      </div>
                    </div>

                    {/* Servicios de la categoría */}
                    {categoryServices.map((service) => {
                      const serviceKey = `${service.name} (S/ ${service.price})`;
                      const isSelected = value.includes(serviceKey);

                      return (
                        <label
                          key={service.id}
                          className={`
                          flex items-start gap-3 p-3 cursor-pointer transition-colors duration-150
                          hover:bg-gray-50 border-l-4 border-transparent
                          ${isSelected ? "bg-primary-accent/5 border-l-primary-accent" : ""}
                        `}
                        >
                          {/* Checkbox */}
                          <div className="flex items-center mt-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleService(service)}
                              className="rounded border-gray-300 text-primary-accent focus:ring-primary-accent focus:ring-2"
                            />
                          </div>

                          {/* Información del servicio */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 text-sm leading-tight">
                                  {service.name}
                                </h4>
                                {service.description && (
                                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    {service.description}
                                  </p>
                                )}
                              </div>
                              <div className="text-right flex-shrink-0">
                                <span className="font-bold text-primary-accent">
                                  S/ {service.price}
                                </span>
                              </div>
                            </div>

                            {/* Duración y categoría */}
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatDuration(service.duration)}</span>
                              </div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
