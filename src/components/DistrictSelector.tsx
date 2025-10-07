"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, MapPin, Search, X } from "lucide-react";

interface District {
  name: string;
  cost: number;
  notes?: string;
}

interface DistrictSelectorProps {
  value: string;
  onChange: (district: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export default function DistrictSelector({
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = "Selecciona tu distrito...",
  className = "",
}: DistrictSelectorProps) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar distritos al montar el componente
  useEffect(() => {
    const loadDistricts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/transport-cost", {
          method: "POST", // Este endpoint devuelve todos los distritos
        });

        if (response.ok) {
          const data = await response.json();
          setDistricts(data.districts || []);
        } else {
          console.error("Error loading districts");
        }
      } catch (error) {
        console.error("Error loading districts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDistricts();
  }, []);

  // Filtrar distritos basado en el término de búsqueda
  useEffect(() => {
    if (!searchTerm) {
      setFilteredDistricts(districts);
    } else {
      const filtered = districts.filter((district) =>
        district.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredDistricts(filtered);
    }
  }, [searchTerm, districts]);

  // Cerrar dropdown cuando se hace clic fuera
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

  const handleSelectDistrict = (district: District) => {
    onChange(district.name);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClearSelection = () => {
    onChange("");
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const handleInputClick = () => {
    setIsOpen(!isOpen);
    setSearchTerm("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const selectedDistrict = districts.find((d) => d.name === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input principal */}
      <div className="relative">
        {/* Icono izquierdo */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MapPin className="w-5 h-5 text-muted" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : value}
          onChange={handleSearchChange}
          onClick={handleInputClick}
          placeholder={placeholder}
          required={required}
          disabled={disabled || loading}
          className={`w-full bg-card border border-transparent focus:border-accent-primary/30 rounded-lg pl-12 pr-12 py-3 placeholder:text-muted text-heading outline-none shadow-sm transition-all duration-200 focus:shadow-md ${
            disabled ? "bg-muted/10 cursor-not-allowed" : "cursor-pointer"
          }`}
          autoComplete="off"
        />

        {/* Iconos del lado derecho */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-primary"></div>
          ) : value && !isOpen ? (
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-muted hover:text-heading transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <ChevronDown
              className={`h-4 w-4 text-muted transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>

      {/* Información del distrito seleccionado */}
      {selectedDistrict && !isOpen && (
        <div className="mt-3 flex items-start gap-3 px-4 py-3 bg-accent-primary/10 border border-accent-primary/20 rounded-lg">
          <div className="w-5 h-5 flex items-center justify-center bg-accent-primary/20 rounded-full mt-0.5 flex-shrink-0">
            <MapPin className="h-3 w-3 text-accent-primary" />
          </div>
          <div className="flex-1">
            <span className="text-sm text-heading font-medium">
              Costo de transporte: S/ {selectedDistrict.cost.toFixed(2)}
            </span>
            {selectedDistrict.notes && (
              <p className="text-sm text-muted mt-1 leading-relaxed">
                {selectedDistrict.notes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Dropdown de opciones */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {filteredDistricts.length === 0 ? (
            <div className="px-4 py-6 text-sm text-heading text-center">
              {searchTerm ? (
                <>
                  <Search className="h-5 w-5 mx-auto mb-3 text-heading" />
                  No se encontraron distritos que coincidan con &ldquo;
                  {searchTerm}&rdquo;
                </>
              ) : (
                <>
                  <MapPin className="h-5 w-5 mx-auto mb-3 text-heading" />
                  No hay distritos disponibles
                </>
              )}
            </div>
          ) : (
            <>
              {/* Header del dropdown */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-muted/10">
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4 text-muted" />
                  <span className="text-sm text-muted font-medium">
                    {filteredDistricts.length} distrito
                    {filteredDistricts.length !== 1 ? "s" : ""} disponible
                    {filteredDistricts.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Lista de distritos */}
              {filteredDistricts.map((district) => (
                <button
                  key={district.name}
                  type="button"
                  onClick={() => handleSelectDistrict(district)}
                  className={`w-full px-4 py-3 text-left hover:bg-muted/10 active:bg-muted/20 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0 touch-manipulation ${
                    district.name === value ? "bg-accent-primary text-white" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 flex items-center justify-center rounded-full flex-shrink-0 ${
                          district.name === value ? "bg-white/20" : "bg-muted/20"
                        }`}>
                          <MapPin className={`h-2.5 w-2.5 ${
                            district.name === value ? "text-white" : "text-muted"
                          }`} />
                        </div>
                        <span className={`font-medium text-base ${
                          district.name === value ? "text-white" : "text-heading"
                        }`}>
                          {district.name}
                        </span>
                      </div>
                      {district.notes && (
                        <p className={`text-sm mt-2 ml-7 leading-relaxed ${
                          district.name === value ? "text-white/80" : "text-muted"
                        }`}>
                          {district.notes}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <span className={`text-sm font-semibold ${
                        district.name === value ? "text-white" : "text-accent-secondary"
                      }`}>
                        S/ {district.cost.toFixed(2)}
                      </span>
                      <p className={`text-sm ${
                        district.name === value ? "text-white/80" : "text-muted"
                      }`}>transporte</p>
                    </div>
                  </div>
                </button>
              ))}

              {/* Footer informativo */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-muted/10">
                <p className="text-sm text-muted text-center">
                  Los costos de transporte incluyen ida y vuelta
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
