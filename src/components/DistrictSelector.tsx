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
    setIsOpen(true);
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
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : value}
          onChange={handleSearchChange}
          onClick={handleInputClick}
          placeholder={placeholder}
          required={required}
          disabled={disabled || loading}
          className={`w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-accent focus:border-transparent transition-all duration-300 ${
            disabled ? "bg-gray-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          autoComplete="off"
        />

        {/* Iconos del lado derecho */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-accent"></div>
          ) : value && !isOpen ? (
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>

      {/* Información del distrito seleccionado */}
      {selectedDistrict && !isOpen && (
        <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md">
          <MapPin className="h-4 w-4 text-blue-500" />
          <div className="flex-1">
            <span className="text-sm text-blue-700 font-medium">
              Costo de transporte: S/ {selectedDistrict.cost.toFixed(2)}
            </span>
            {selectedDistrict.notes && (
              <p className="text-xs text-blue-600 mt-1">
                {selectedDistrict.notes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Dropdown de opciones */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredDistricts.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              {searchTerm ? (
                <>
                  <Search className="h-4 w-4 mx-auto mb-2 text-gray-400" />
                  No se encontraron distritos que coincidan con &ldquo;
                  {searchTerm}&rdquo;
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mx-auto mb-2 text-gray-400" />
                  No hay distritos disponibles
                </>
              )}
            </div>
          ) : (
            <>
              {/* Header del dropdown */}
              <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-600 font-medium">
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
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 ${
                    district.name === value ? "bg-blue-50 border-blue-100" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium text-gray-900">
                          {district.name}
                        </span>
                      </div>
                      {district.notes && (
                        <p className="text-xs text-gray-500 mt-1 ml-6">
                          {district.notes}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <span className="text-sm font-semibold text-primary-accent">
                        S/ {district.cost.toFixed(2)}
                      </span>
                      <p className="text-xs text-gray-500">transporte</p>
                    </div>
                  </div>
                </button>
              ))}

              {/* Footer informativo */}
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
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
