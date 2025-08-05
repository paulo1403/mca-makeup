"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, Sparkles, Clock, Tag } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: number;
  description?: string;
  duration: number;
  category: string;
}

interface ServiceSelectorProps {
  value: string;
  onChange: (service: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  onLoadingChange?: (loading: boolean) => void;
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
  onChange,
  required = false,
  disabled = false,
  placeholder = "Selecciona un servicio...",
  className = "",
  onLoadingChange,
}: ServiceSelectorProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar servicios
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        onLoadingChange?.(true);
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
        onLoadingChange?.(false);
      }
    };

    loadServices();
  }, []);

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

  const selectedService = services.find(
    (s) => `${s.name} (S/ ${s.price})` === value,
  );

  const handleSelectService = (service: Service) => {
    onChange(`${service.name} (S/ ${service.price})`);
    setIsOpen(false);
    setSearchTerm("");
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

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input principal */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg z-10 border border-gray-200">
            <div className="flex flex-col items-center gap-2 text-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-primary-accent"></div>
              <span className="text-sm text-gray-600 font-medium">
                Cargando servicios...
              </span>
              <span className="text-xs text-gray-500">
                Obteniendo catálogo actualizado
              </span>
            </div>
          </div>
        )}

        <div className="relative">
          {/* Texto truncado en móvil */}
          <div
            className={`w-full px-4 py-3 pr-20 bg-white border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-primary-accent focus-within:border-transparent transition-all duration-300 ${
              disabled || loading
                ? "bg-gray-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={!disabled && !loading ? handleInputClick : undefined}
          >
            {/* Input oculto para funcionalidad */}
            <input
              ref={inputRef}
              type="text"
              value={isOpen ? searchTerm : ""}
              onChange={handleSearchChange}
              required={false}
              disabled={disabled || loading}
              className="sr-only"
              autoComplete="off"
            />

            {/* Select hidden para validación del form */}
            <select
              name="service"
              value={
                selectedService
                  ? `${selectedService.name} (S/ ${selectedService.price})`
                  : ""
              }
              onChange={() => {}} // Controlado por el componente
              required={required}
              disabled={disabled || loading}
              className="sr-only absolute -z-10"
              tabIndex={-1}
            >
              <option value="">Selecciona un servicio</option>
              {services.map((service) => (
                <option
                  key={service.id}
                  value={`${service.name} (S/ ${service.price})`}
                >
                  {service.name} (S/ {service.price})
                </option>
              ))}
            </select>

            {/* Display del servicio seleccionado */}
            <div className="min-h-[1.5rem] flex items-center">
              {selectedService ? (
                <div className="w-full">
                  {/* Móvil: Texto truncado con precio */}
                  <div className="sm:hidden">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-900 truncate font-medium text-sm">
                        {selectedService.name}
                      </span>
                      <span className="text-primary-accent font-bold text-sm flex-shrink-0">
                        S/ {selectedService.price}
                      </span>
                    </div>
                  </div>

                  {/* Desktop: Texto completo */}
                  <div className="hidden sm:block">
                    <span className="text-gray-900 font-medium">
                      {selectedService.name}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-gray-400">{placeholder}</span>
              )}
            </div>
          </div>

          {/* Ícono dropdown */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Información del servicio seleccionado */}
      {selectedService && !isOpen && !loading && (
        <>
          {/* Móvil: Card compacta */}
          <div className="mt-2 sm:hidden bg-gradient-to-r from-primary-accent/5 to-secondary-accent/5 border border-primary-accent/20 rounded-md p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full border flex-shrink-0 ${
                      CATEGORY_COLORS[
                        selectedService.category as keyof typeof CATEGORY_COLORS
                      ]
                    }`}
                  >
                    {
                      CATEGORY_LABELS[
                        selectedService.category as keyof typeof CATEGORY_LABELS
                      ]
                    }
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span>{formatDuration(selectedService.duration)}</span>
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <Tag className="h-3 w-3 flex-shrink-0" />
                    <span className="font-bold text-primary-accent">
                      S/ {selectedService.price}
                    </span>
                  </div>
                </div>
                {selectedService.description && (
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    {selectedService.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Desktop: Card expandida */}
          <div className="mt-2 hidden sm:flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-primary-accent/5 to-secondary-accent/5 border border-primary-accent/20 rounded-md">
            <Sparkles className="h-4 w-4 text-primary-accent flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {selectedService.name}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full border ${
                    CATEGORY_COLORS[
                      selectedService.category as keyof typeof CATEGORY_COLORS
                    ]
                  }`}
                >
                  {
                    CATEGORY_LABELS[
                      selectedService.category as keyof typeof CATEGORY_LABELS
                    ]
                  }
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDuration(selectedService.duration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span className="font-semibold text-primary-accent">
                    S/ {selectedService.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Dropdown de servicios */}
      {isOpen && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {/* Campo de búsqueda móvil */}
          <div className="sticky top-0 bg-white border-b border-gray-100 p-3 sm:hidden">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar servicio..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              autoFocus
            />
          </div>

          {Object.keys(servicesByCategory).length === 0 ? (
            <div className="px-4 py-6 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-500">
                {searchTerm
                  ? `No se encontraron servicios para "${searchTerm}"`
                  : "No hay servicios disponibles"}
              </p>
            </div>
          ) : (
            <>
              {/* Header con contador - solo desktop */}
              <div className="hidden sm:block px-4 py-3 border-b border-gray-100 bg-gray-50 sticky top-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary-accent" />
                    <span className="text-sm font-medium text-gray-900">
                      Servicios Disponibles
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {filteredServices.length}{" "}
                    {filteredServices.length === 1 ? "servicio" : "servicios"}
                  </span>
                </div>
              </div>

              {/* Campo de búsqueda desktop */}
              <div className="hidden sm:block px-4 py-3 border-b border-gray-100 bg-white sticky top-12">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Buscar servicio..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-primary-accent focus:border-transparent"
                  autoFocus
                />
              </div>

              {/* Servicios agrupados por categoría */}
              {Object.entries(servicesByCategory).map(
                ([category, categoryServices]) => (
                  <div key={category}>
                    {/* Header de categoría */}
                    <div className="px-4 py-2 bg-gray-25 border-b border-gray-50">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                          CATEGORY_COLORS[
                            category as keyof typeof CATEGORY_COLORS
                          ]
                        }`}
                      >
                        {
                          CATEGORY_LABELS[
                            category as keyof typeof CATEGORY_LABELS
                          ]
                        }
                      </span>
                    </div>

                    {/* Servicios */}
                    {categoryServices.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => handleSelectService(service)}
                        className={`w-full text-left hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50 last:border-b-0 ${
                          selectedService?.id === service.id
                            ? "bg-primary-accent/5 border-primary-accent/20"
                            : ""
                        }`}
                      >
                        {/* Móvil: Layout compacto */}
                        <div className="sm:hidden px-3 py-3">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1">
                              {service.name}
                            </h4>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {selectedService?.id === service.id && (
                                <Check className="h-4 w-4 text-primary-accent" />
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{formatDuration(service.duration)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3 text-primary-accent" />
                              <span className="font-bold text-primary-accent text-sm">
                                S/ {service.price}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Desktop: Layout expandido */}
                        <div className="hidden sm:block px-4 py-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="font-medium text-gray-900 text-sm leading-tight">
                                  {service.name}
                                </h4>
                                {selectedService?.id === service.id && (
                                  <Check className="h-4 w-4 text-primary-accent flex-shrink-0 mt-0.5" />
                                )}
                              </div>

                              {service.description && (
                                <p
                                  className="text-xs text-gray-600 mb-2"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {service.description}
                                </p>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {formatDuration(service.duration)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Tag className="h-3 w-3 text-primary-accent" />
                                  <span className="font-bold text-primary-accent">
                                    S/ {service.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ),
              )}

              {/* Footer informativo */}
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  Los precios pueden variar según requerimientos específicos
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
