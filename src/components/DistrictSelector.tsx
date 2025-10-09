"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, MapPin, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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

async function fetchDistricts(): Promise<District[]> {
  const response = await fetch("/api/transport-cost", { method: "POST" });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Error al cargar distritos");
  }
  const data = await response.json();
  return data.districts || [];
}

export default function DistrictSelector({
  value,
  onChange,
  disabled = false,
  placeholder = "Busca tu distrito...",
  className = "",
}: DistrictSelectorProps) {
  const { data: districts = [], isLoading, isError, error } = useQuery<District[], Error>({
    queryKey: ["districts"],
    queryFn: fetchDistricts,
    staleTime: 1000 * 60 * 10,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = districts.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      // Inicializa el resaltado al seleccionado o al primero
      const currentIndex = filtered.findIndex((d) => d.name === value);
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : filtered.length > 0 ? 0 : -1);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, value, searchTerm, districts, filtered]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDistrict = districts.find((d) => d.name === value);

  const handleSelect = (district: District) => {
    onChange(district.name);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onChange("");
    setSearchTerm("");
    setIsOpen(false);
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
      setIsOpen(true);
      return;
    }
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
        handleSelect(filtered[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input de búsqueda / selector */}
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="district-listbox"
        className={`w-full flex items-center gap-3 px-4 py-3 bg-input border border-input rounded-lg transition-all duration-200 
        ${isOpen ? "ring-2 ring-accent-primary" : "focus-within:border-input-focus"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}`}
        onClick={() => {
          if (disabled) return;
          if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 10);
          }
        }}
      >
        <MapPin className={`h-5 w-5 ${selectedDistrict ? "text-accent-primary" : "text-muted"}`} />
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : selectedDistrict?.name || ""}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => !disabled && setIsOpen(true)}
          onKeyDown={onInputKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent text-main placeholder:text-input-placeholder focus:outline-none"
          autoComplete="off"
        />
        {value && !disabled ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="ml-2 p-1 hover:bg-accent-primary/10 rounded-full transition-colors"
            aria-label="Limpiar selección"
          >
            <X className="h-4 w-4 text-accent-primary" />
          </button>
        ) : (
          <ChevronDown className={`h-4 w-4 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
        )}
      </div>

      {/* Mensajes de estado */}
      {isError && (
        <p className="mt-2 text-sm text-red-600">{error?.message || "Error cargando distritos"}</p>
      )}

      {/* Lista de opciones */}
      {isOpen && (
        <div
          id="district-listbox"
          role="listbox"
          className="absolute background-card z-50 w-full mt-2 bg-card border border-input rounded-lg shadow-xl max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="px-4 py-6 text-sm text-center text-accent-primary">Cargando distritos...</div>
          ) : filtered.length === 0 ? (
            <div className="px-4 py-6 text-sm text-center text-main">
              <Search className="h-5 w-5 mx-auto mb-3 text-accent-primary" />
              {searchTerm ? (
                <>No se encontraron resultados para “<span className="font-semibold">{searchTerm}</span>”.</>
              ) : (
                <>No hay distritos disponibles.</>
              )}
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
                  className={`w-full px-4 py-3 text-left border-b border-input last:border-b-0 transition-colors 
                    ${isSelected ? "bg-accent-primary text-white" : isHighlighted ? "bg-accent-primary/10" : "bg-card"}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-4 h-4 flex items-center justify-center rounded-full ${isSelected ? "bg-white/20" : "bg-accent-primary/20"}`}>
                        <MapPin className={`h-2.5 w-2.5 ${isSelected ? "text-white" : "text-accent-primary"}`} />
                      </div>
                      <span className={`font-medium text-base truncate ${isSelected ? "text-white" : "text-main"}`}>{district.name}</span>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <span className={`text-sm font-semibold ${isSelected ? "text-white" : "text-accent-secondary"}`}>S/ {district.cost.toFixed(2)}</span>
                      <p className={`text-xs ${isSelected ? "text-white/80" : "text-muted"}`}>transporte</p>
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