"use client";

import type { Service, ServiceSelection } from "@/types";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/serviceRules";
import { Sparkles, Clock, Check, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface CompactServiceSelectorProps {
  value: ServiceSelection;
  onChangeAction: (services: ServiceSelection) => void;
  className?: string;
}

export default function CompactServiceSelector({ value, onChangeAction, className = "" }: CompactServiceSelectorProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/services");
        if (response.ok) {
          const data = await response.json();
          setServices(data.services || []);
        } else {
          setServices([]);
        }
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => set.add(s.category));
    return Array.from(set);
  }, [services]);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesCategory = activeCategory ? s.category === activeCategory : true;
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch = q
        ? s.name.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, searchTerm]);

  const toggleService = (svc: Service) => {
    const next = { ...value };
    const currentQty = next[svc.id] || 0;
    if (currentQty > 0) {
      delete next[svc.id];
    } else {
      next[svc.id] = 1;
    }
    onChangeAction(next);
  };

  const inc = (svc: Service) => {
    const next = { ...value };
    const q = next[svc.id] || 0;
    next[svc.id] = Math.min(5, q + 1);
    onChangeAction(next);
  };

  const dec = (svc: Service) => {
    const next = { ...value };
    const q = next[svc.id] || 0;
    const nq = Math.max(0, q - 1);
    if (nq === 0) delete next[svc.id];
    else next[svc.id] = nq;
    onChangeAction(next);
  };

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 lg:overflow-visible lg:flex-wrap lg:mx-0" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory((c) => (c === cat ? null : cat))}
              className={`px-2.5 py-1 rounded-full border text-[11px] transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-[color:var(--color-primary)] text-white border-[color:var(--color-primary)]"
                  : "bg-[color:var(--color-surface)] text-[color:var(--color-heading)] border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]/50"
              }`}
              aria-pressed={activeCategory === cat}
            >
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] || cat}
              </span>
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-56 mt-2 sm:mt-0">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar servicio"
            className="w-full px-3 py-2 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-sm text-[color:var(--color-heading)] focus:ring-2 focus:ring-[color:var(--color-primary)]/20 focus:border-[color:var(--color-primary)]"
            aria-label="Buscar servicio"
          />
          <Search className="w-4 h-4 text-[color:var(--color-body)]/60 absolute right-2 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:gap-3 lg:gap-5 items-stretch">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 sm:h-28 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-6">
            <span className="text-sm text-[color:var(--color-body)]">No se encontraron servicios</span>
          </div>
        ) : (
          filtered.map((svc) => {
            const selectedQty = value[svc.id] || 0;
            const selected = selectedQty > 0;
            return (
              <div
                key={svc.id}
                role="button"
                tabIndex={0}
                onClick={() => toggleService(svc)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                    e.preventDefault();
                    toggleService(svc);
                  }
                }}
                className={`text-left p-3 sm:p-4 lg:p-5 rounded-xl transition-all duration-200 border w-full overflow-hidden flex flex-col h-full lg:min-h-[200px] ${
                  selected
                    ? "bg-[color:var(--color-primary)]/10 border-[color:var(--color-primary)]"
                    : "bg-[color:var(--color-surface)] border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3 lg:items-center">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[svc.category as keyof typeof CATEGORY_COLORS] || "bg-gray-300"}`} />
                      <span className="text-[11px] text-[color:var(--color-body)]">
                        {CATEGORY_LABELS[svc.category as keyof typeof CATEGORY_LABELS] || svc.category}
                      </span>
                    </div>
                    <h4 className="mt-1 font-medium text-[color:var(--color-heading)] text-sm lg:text-base leading-snug truncate">
                      {svc.name}
                    </h4>
                    {svc.description && (
                      <p
                        className={`text-xs lg:text-sm mt-1 ${expanded[svc.id] ? "text-[color:var(--color-body)]" : "text-[color:var(--color-body)]/80"} ${expanded[svc.id] ? "line-clamp-none" : "line-clamp-1 sm:line-clamp-2 lg:line-clamp-3"}`}
                      >
                        {svc.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`font-bold block ${selected ? "text-[color:var(--color-primary)]" : "text-[color:var(--color-heading)]"} lg:text-lg`}>S/ {svc.price}</span>
                    <div className="mt-0.5 text-xs lg:text-sm text-[color:var(--color-body)] inline-flex items-center gap-1">
                      <Clock className={`w-3 h-3 ${selected ? "text-[color:var(--color-primary)]" : "text-[color:var(--color-accent)]"}`} />
                      {svc.duration}min
                    </div>
                  </div>
                </div>
                <div className="mt-auto pt-2 sm:pt-3 lg:pt-2 flex items-center justify-between">
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                    selected
                      ? "bg-[color:var(--color-primary)] text-white"
                      : "bg-[color:var(--color-surface-secondary)] text-[color:var(--color-body)] border border-[color:var(--color-border)]"
                  }`}>
                    <Check className="w-3 h-3" />
                    {selected ? (selectedQty > 1 ? `${selectedQty} seleccionados` : "Seleccionado") : "Seleccionar"}
                  </div>
                  <div className="inline-flex items-center gap-2 lg:ml-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpanded(svc.id);
                      }}
                      className="px-2 py-1 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[11px] text-[color:var(--color-body)] hover:border-[color:var(--color-primary)]/50 sm:hidden"
                      aria-expanded={!!expanded[svc.id]}
                    >
                      <span className="inline-flex items-center gap-1">
                        {expanded[svc.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {expanded[svc.id] ? "Ocultar" : "Ver detalles"}
                      </span>
                    </button>
                    {selected && (
                      <div className="inline-flex items-center gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            dec(svc);
                          }}
                          className="w-7 h-7 rounded-full bg-[color:var(--color-surface-secondary)] border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface)] text-[color:var(--color-heading)] flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="min-w-[20px] text-center text-sm font-medium text-[color:var(--color-heading)]">{selectedQty}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            inc(svc);
                          }}
                          className="w-7 h-7 rounded-full bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/80 text-white flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* detalle expandido se muestra arriba directamente en el párrafo */}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
