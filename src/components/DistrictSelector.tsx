"use client";
import Typography from "@/components/ui/Typography";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, MapPin, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface District {
  name: string;
  cost: number;
  notes?: string;
}

interface DistrictSelectorProps {
  value: string;
  onChange: (district: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

// Diccionario de traducciones
const translations = {
  placeholder: "Busca tu distrito...",
  loading: "Cargando distritos...",
  noResults: "No se encontraron resultados para",
  noDistricts: "No hay distritos disponibles",
  transport: "transporte",
  clearSelection: "Limpiar selección",
  errorLoading: "Error al cargar distritos",
  selectDistrict: "Seleccionar distrito",
};

const useTranslations = () => {
  return {
    t: (key: string, fallback?: string) => {
      const value = translations[key as keyof typeof translations];
      return value || fallback || key;
    },
  };
};

async function fetchDistricts(): Promise<District[]> {
  try {
    const response = await fetch("/api/transport-cost", { method: "POST" });
    if (!response.ok) {
      throw new Error("Error al cargar distritos");
    }
    const data = await response.json();
    return data.districts || [];
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error("Error al cargar distritos");
  }
}

export default function DistrictSelector({
  value,
  onChange,
  disabled = false,
  placeholder,
  className = "",
}: DistrictSelectorProps) {
  const {
    data: districts = [],
    isLoading,
    isError,
    error,
  } = useQuery<District[], Error>({
    queryKey: ["districts"],
    queryFn: fetchDistricts,
    staleTime: 1000 * 60 * 10,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslations();
  const defaultPlaceholder = placeholder || t("placeholder");

  const filtered = districts.filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const selectedDistrict = districts.find((d) => d.name === value);

  // Abrir dropdown
  const openDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [disabled]);

  // Cerrar dropdown
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchTerm("");
  }, []);

  // Toggle dropdown
  const toggleDropdown = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (disabled) return;

      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    },
    [disabled, isOpen, openDropdown, closeDropdown],
  );

  // Seleccionar distrito
  const handleSelect = useCallback(
    (district: District) => {
      onChange(district.name);
      closeDropdown();
    },
    [onChange, closeDropdown],
  );

  // Limpiar selección
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange("");
      setSearchTerm("");
      closeDropdown();
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [onChange, closeDropdown],
  );

  // Manejo de teclado
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        openDropdown();
        return;
      }

      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
            handleSelect(filtered[highlightedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          closeDropdown();
          break;
        case "Tab":
          closeDropdown();
          break;
      }
    },
    [isOpen, filtered, highlightedIndex, openDropdown, closeDropdown, handleSelect],
  );

  // Click outside para cerrar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  // Actualizar highlighted index
  useEffect(() => {
    if (isOpen && filtered.length > 0) {
      const currentIndex = filtered.findIndex((d) => d.name === value);
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, value, filtered]);

  // Manejo del input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);

    // Si no está abierto y el usuario empieza a escribir, abrirlo
    if (!isOpen && newValue.length > 0) {
      openDropdown();
    }
  };

  const handleInputFocus = () => {
    if (!disabled && !isOpen) {
      openDropdown();
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* Contenedor principal */}
      <div
        ref={dropdownRef}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="district-listbox"
        className={`w-full flex items-center gap-3 px-4 py-3 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg transition-all duration-200 
        ${
          isOpen
            ? "ring-2 ring-[color:var(--color-primary)]/40"
            : "focus-within:border-[color:var(--color-primary)]"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}`}
        onClick={toggleDropdown}
      >
        <MapPin
          className={`h-5 w-5 flex-shrink-0 ${
            selectedDistrict
              ? "text-[color:var(--color-primary)]"
              : "text-[color:var(--color-body)]/50"
          }`}
        />

        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : selectedDistrict?.name || ""}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={defaultPlaceholder}
          disabled={disabled}
          className="w-full bg-transparent text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-body)]/50 focus:outline-none text-sm"
          autoComplete="off"
        />

        {value && !disabled ? (
          <button
            type="button"
            onClick={handleClear}
            className="ml-2 p-1 hover:bg-[color:var(--color-surface-secondary)] rounded-full transition-colors"
            aria-label={t("clearSelection")}
          >
            <X className="h-4 w-4 text-[color:var(--color-primary)]" />
          </button>
        ) : (
          <ChevronDown
            className={`h-4 w-4 text-[color:var(--color-body)]/50 transition-transform flex-shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </div>

      {/* Mensajes de estado */}
      {isError && (
        <Typography as="p" variant="small" className="mt-2 text-red-500">
          {error?.message || t("errorLoading")}
        </Typography>
      )}

      {/* Lista de opciones */}
      {isOpen && (
        <div
          id="district-listbox"
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="px-4 py-6 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-[color:var(--color-primary)]/30 border-t-[color:var(--color-primary)] rounded-full animate-spin mr-2"></div>
              <Typography as="span" variant="small" className="text-[color:var(--color-body)]">
                {t("loading")}
              </Typography>
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <Search className="h-5 w-5 mx-auto mb-3 text-[color:var(--color-body)]/50" />
              <Typography as="p" variant="small" className="text-[color:var(--color-body)]">
                {searchTerm ? (
                  <>
                    {t("noResults")}
                    <span className="font-semibold">{searchTerm}</span>
                  </>
                ) : (
                  t("noDistricts")
                )}
              </Typography>
            </div>
          ) : (
            filtered.map((district, idx) => {
              const isSelected = district.name === value;
              const isHighlighted = idx === highlightedIndex;
              return (
                <button
                  key={district.name}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onClick={() => handleSelect(district)}
                  className={`w-full px-4 py-3 text-left border-b border-[color:var(--color-border)]/20 last:border-b-0 transition-colors 
                    ${
                      isSelected
                        ? "bg-[color:var(--color-primary)]/10"
                        : isHighlighted
                          ? "bg-[color:var(--color-surface-secondary)]"
                          : "bg-[color:var(--color-surface)]"
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-4 h-4 flex items-center justify-center rounded-full flex-shrink-0 ${
                          isSelected
                            ? "bg-[color:var(--color-primary)]"
                            : "bg-[color:var(--color-surface-secondary)]"
                        }`}
                      >
                        <MapPin
                          className={`h-2.5 w-2.5 ${
                            isSelected ? "text-white" : "text-[color:var(--color-primary)]"
                          }`}
                        />
                      </div>
                      <Typography
                        as="span"
                        variant="small"
                        className={`font-medium truncate ${
                          isSelected
                            ? "text-[color:var(--color-primary)]"
                            : "text-[color:var(--color-heading)]"
                        }`}
                      >
                        {district.name}
                      </Typography>
                    </div>
                    <div className="ml-2 text-right flex-shrink-0">
                      <Typography
                        as="span"
                        variant="small"
                        className={`font-semibold ${
                          isSelected
                            ? "text-[color:var(--color-primary)]"
                            : "text-[color:var(--color-accent)]"
                        }`}
                      >
                        S/ {district.cost.toFixed(2)}
                      </Typography>
                      <Typography
                        as="p"
                        variant="caption"
                        className={
                          isSelected
                            ? "text-[color:var(--color-primary)]/80"
                            : "text-[color:var(--color-body)]/70"
                        }
                      >
                        {t("transport")}
                      </Typography>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
