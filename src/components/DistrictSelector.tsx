"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, MapPin, Search, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface District {
  name: string;
  cost: number;
  notes?: string;
}

interface DistrictSelectorProps {
  value: string;
  onChange: (district: string) => void;
  // No se usa 'required' ni 'disabled' aquí, se asume que se maneja a nivel de RHF.
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

// Colores basados en la paleta premium (Tema Oscuro con Acento Fucsia/Dorado)
const THEME_CLASSES = {
  // Colores para el input y el contenedor de la lista
  bgCard: "bg-gray-800 dark:bg-card-dark light:bg-card-light",
  textMain: "text-gray-50 dark:text-text-main-dark light:text-text-main-light",
  textSecondary: "text-gray-400 dark:text-text-secondary-dark light:text-text-secondary-light",
  borderNormal: "border-gray-700 dark:border-border-subtle-dark light:border-border-subtle-light",
  ringFocus: "ring-accent-primary border-transparent",
  // Colores para la lista
  bgHover: "hover:bg-accent-primary/10",
  bgActive: "active:bg-accent-primary/20",
  bgSelected: "bg-accent-primary text-white", // Fucsia para la selección
  textAccentSecondary: "text-accent-secondary", // Dorado para el precio
};

export default function DistrictSelector({
  value,
  onChange,
  disabled = false,
  placeholder = "Busca y selecciona tu distrito...",
  className = "",
}: DistrictSelectorProps) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);
  
  // Usamos el estado local para mostrar el texto del input
  const [inputText, setInputText] = useState(value);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Cargar distritos al montar el componente (sin cambios)
  useEffect(() => {
    const loadDistricts = async () => {
      // ... (Lógica de carga de distritos) ...
      // SIMULACIÓN: Asumimos que los distritos se cargaron correctamente
      setDistricts([
        { name: "Ate", cost: 70.0, notes: "Costo fijo por transporte." },
        { name: "Barranco", cost: 55.0 },
        { name: "Breña", cost: 30.0 },
        { name: "Callao", cost: 60.0, notes: "Requiere coordinación especial." },
        { name: "San Isidro", cost: 45.0 },
      ]);
      setLoading(false);
    };
    loadDistricts();
  }, []);

  // 2. Sincronizar 'value' (prop) con el 'inputText' (estado local)
  useEffect(() => {
    if (value) {
      const selected = districts.find(d => d.name === value);
      setInputText(selected?.name || value);
    } else {
      // Solo si el dropdown está cerrado, limpiamos el texto
      if (!isOpen) {
        setInputText("");
      }
    }
  }, [value, districts, isOpen]);

  // 3. Filtrar distritos (optimizado con useCallback)
  const filterDistricts = useCallback((term: string) => {
    if (!term) {
      setFilteredDistricts(districts);
    } else {
      const filtered = districts.filter((district) =>
        district.name.toLowerCase().includes(term.toLowerCase()),
      );
      setFilteredDistricts(filtered);
    }
  }, [districts]);

  useEffect(() => {
    filterDistricts(searchTerm);
  }, [searchTerm, filterDistricts]);

  // 4. Cerrar dropdown cuando se hace clic fuera (sin cambios)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        // Si no hay un valor seleccionado, limpiar el input al cerrar
        if (!value) setInputText("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);
  
  // Handlers
  const selectedDistrict = districts.find((d) => d.name === value);

  const handleSelectDistrict = (district: District) => {
    onChange(district.name);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClearSelection = () => {
    onChange("");
    setSearchTerm("");
    setIsOpen(false);
    setInputText("");
    // Enfocar el input después de limpiar para que el usuario pueda escribir
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(prev => {
      if (prev) {
        // Al cerrar, limpiar la búsqueda si no hay un valor seleccionado
        setSearchTerm("");
        if (!value) setInputText("");
        return false;
      }
      // Al abrir, si hay un valor, establecer el término de búsqueda al nombre
      if (value) setSearchTerm(value);
      return true;
    });
  };

  const handleFocus = () => {
    if (disabled) return;
    setIsOpen(true);
    // Si hay un valor, al enfocar, limpiamos la búsqueda local para que pueda empezar a buscar
    if (value) {
      setSearchTerm("");
      setInputText("");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    setInputText(newTerm);
    setIsOpen(true);
    
    // Si el usuario empieza a escribir, forzamos la deselección para evitar ambigüedad.
    if (value && newTerm.toLowerCase() !== value.toLowerCase()) {
        onChange("");
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 1. Input/Selector Principal */}
      <div className="relative">
        <div
          // Permite que el click en el contenedor active el input o abra/cierre
          onClick={() => {
            if (!isOpen) {
              handleToggle();
              // Enfocar el input después de abrir para que el usuario pueda escribir
              setTimeout(() => inputRef.current?.focus(), 50);
            }
          }}
          className={`w-full flex items-center gap-3 px-4 py-4 ${THEME_CLASSES.bgCard} ${THEME_CLASSES.borderNormal} border rounded-xl cursor-pointer transition-all duration-200 
          ${isOpen ? `ring-2 ${THEME_CLASSES.ringFocus}` : "hover:border-accent-primary/50"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {/* Icono de ubicación */}
          <MapPin className={`h-5 w-5 ${selectedDistrict ? 'text-accent-primary' : THEME_CLASSES.textSecondary} flex-shrink-0`} />
          
          {/* Input de Búsqueda (unificado) */}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm || inputText}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            // Esto evita que el teclado salte en móvil si ya hay un valor y el usuario solo toca
            readOnly={!isOpen && !!value} 
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full bg-transparent ${THEME_CLASSES.textMain} placeholder:${THEME_CLASSES.textSecondary} focus:outline-none`}
            autoComplete="off"
          />

          {/* Botón de limpiar o chevron */}
          {value && !disabled ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClearSelection();
              }}
              className="ml-2 p-1 hover:bg-accent-primary/10 rounded-full transition-colors flex-shrink-0"
              disabled={disabled}
              aria-label="Limpiar selección"
            >
              <X className="h-4 w-4 text-accent-primary" />
            </button>
          ) : (
            <ChevronDown
              className={`h-4 w-4 ${THEME_CLASSES.textSecondary} transition-transform flex-shrink-0 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>
      
      {/* 2. Información del distrito seleccionado (solo cuando está cerrado y hay valor) */}
      {selectedDistrict && !isOpen && (
        <div className={`mt-3 flex items-start gap-3 px-4 py-3 bg-accent-primary/10 border border-accent-primary/20 rounded-lg`}>
          <div className="w-5 h-5 flex items-center justify-center bg-accent-primary/20 rounded-full mt-0.5 flex-shrink-0">
            <MapPin className="h-3 w-3 text-accent-primary" />
          </div>
          <div className="flex-1">
            <span className={`text-sm ${THEME_CLASSES.textMain} font-medium`}>
              Costo de transporte: <span className={THEME_CLASSES.textAccentSecondary}>S/ {selectedDistrict.cost.toFixed(2)}</span>
            </span>
            {selectedDistrict.notes && (
              <p className={`text-sm ${THEME_CLASSES.textSecondary} mt-1 leading-relaxed`}>
                {selectedDistrict.notes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 3. Dropdown de opciones */}
      {isOpen && (
        <div 
          className={`absolute z-50 w-full mt-2 ${THEME_CLASSES.bgCard} ${THEME_CLASSES.borderNormal} border rounded-lg shadow-xl max-h-80 overflow-y-auto`}
        >
          {loading ? (
             <div className="px-4 py-6 text-sm text-center text-accent-primary">Cargando distritos...</div>
          ) : filteredDistricts.length === 0 ? (
            <div className="px-4 py-6 text-sm text-center text-heading">
              <Search className="h-5 w-5 mx-auto mb-3 text-accent-primary" />
              {searchTerm ? (
                <>
                  No se encontraron distritos que coincidan con &ldquo;
                  <span className="font-semibold">{searchTerm}</span>&rdquo;
                </>
              ) : (
                <>No hay distritos disponibles.</>
              )}
            </div>
          ) : (
            <>
              {/* Header del dropdown (Contador) */}
              <div className={`px-4 py-3 border-b ${THEME_CLASSES.borderNormal} ${THEME_CLASSES.bgCard} sticky top-0`}>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-accent-primary" />
                  <span className={`text-sm ${THEME_CLASSES.textSecondary} font-medium`}>
                    {filteredDistricts.length} distrito
                    {filteredDistricts.length !== 1 ? "s" : ""} disponible
                    {filteredDistricts.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Lista de distritos */}
              {filteredDistricts.map((district) => {
                const isSelected = district.name === value;
                return (
                  <button
                    key={district.name}
                    type="button"
                    onClick={() => handleSelectDistrict(district)}
                    className={`w-full px-4 py-3 text-left transition-colors border-b ${THEME_CLASSES.borderNormal} last:border-b-0 touch-manipulation 
                      ${isSelected ? THEME_CLASSES.bgSelected : `${THEME_CLASSES.bgCard} ${THEME_CLASSES.bgHover} ${THEME_CLASSES.bgActive}`}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 flex items-center justify-center rounded-full flex-shrink-0 ${
                            isSelected ? "bg-white/20" : "bg-accent-primary/20"
                          }`}>
                            <MapPin className={`h-2.5 w-2.5 ${
                              isSelected ? "text-white" : "text-accent-primary"
                            }`} />
                          </div>
                          <span className={`font-medium text-base ${
                            isSelected ? "text-white" : THEME_CLASSES.textMain
                          }`}>
                            {district.name}
                          </span>
                        </div>
                        {district.notes && (
                          <p className={`text-sm mt-2 ml-7 leading-relaxed ${
                            isSelected ? "text-white/80" : THEME_CLASSES.textSecondary
                          }`}>
                            {district.notes}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 text-right flex-shrink-0">
                        <span className={`text-sm font-semibold ${
                          isSelected ? "text-white" : THEME_CLASSES.textAccentSecondary
                        }`}>
                          S/ {district.cost.toFixed(2)}
                        </span>
                        <p className={`text-xs ${
                          isSelected ? "text-white/80" : THEME_CLASSES.textSecondary
                        }`}>transporte</p>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Footer informativo */}
              <div className={`px-4 py-3 border-t ${THEME_CLASSES.borderNormal} ${THEME_CLASSES.bgCard}`}>
                <p className={`text-sm ${THEME_CLASSES.textSecondary} text-center`}>
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