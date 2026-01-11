"use client";

import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import CompactServiceSelector from "@/components/availability/CompactServiceSelector";
import { useAvailableRanges } from "@/hooks/useAvailableRanges";
import { useServicesList } from "@/hooks/useServices";
import type { ServiceSelection, LocationType } from "@/types";
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import { format } from "date-fns";

export default function AvailabilityCheckSection() {
  const [date, setDate] = useState<Date | null>(null);
  const [locationType, setLocationType] = useState<LocationType>("HOME");
  const [serviceSelection, setServiceSelection] = useState<ServiceSelection>(
    {}
  );
  const [selectedRange, setSelectedRange] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, isLoading } = useAvailableRanges(
    date,
    serviceSelection,
    locationType
  );

  const { data: allServices = [] } = useServicesList();

  const availableRanges: string[] = useMemo(
    () => data?.availableRanges || [],
    [data]
  );
  const hasSelectedService = useMemo(() => {
    return Object.values(serviceSelection).some((q) => q > 0);
  }, [serviceSelection]);

  // Calcular el total de los servicios seleccionados
  const totalPrice = useMemo(() => {
    let total = 0;
    Object.entries(serviceSelection).forEach(([serviceId, quantity]) => {
      if (quantity > 0) {
        const service = allServices.find(
          (s: { id: string; price: number }) => s.id === serviceId
        );
        if (service) {
          total += service.price * quantity;
        }
      }
    });
    return total;
  }, [serviceSelection, allServices]);

  useEffect(() => {
    setSelectedRange("");
  }, [date]);

  useEffect(() => {
    const handler = () => {
      setDate(null);
      setSelectedRange("");
      setServiceSelection({});
      setLocationType("HOME");
    };
    window.addEventListener("availability:reset", handler);
    return () => window.removeEventListener("availability:reset", handler);
  }, []);

  // Escuchar evento de cotización para pre-llenar datos
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | {
            locationType?: "HOME" | "STUDIO";
            services?: string;
            district?: string;
          }
        | undefined;
      if (!detail) return;

      if (detail.locationType) {
        setLocationType(detail.locationType);
      }
      if (detail.services) {
        const items = detail.services
          .split(",")
          .map((pair) => pair.split(":"))
          .filter(
            (parts) => parts.length === 2 && parts[0] && Number(parts[1]) > 0
          )
          .reduce((acc, [id, qty]) => {
            acc[id] = Number(qty);
            return acc;
          }, {} as ServiceSelection);
        setServiceSelection(items);
      }

      // Expandir la sección cuando se continúa desde la cotización
      setIsExpanded(true);
    };
    window.addEventListener("quote:continue", handler as EventListener);
    return () =>
      window.removeEventListener("quote:continue", handler as EventListener);
  }, []);

  const setQueryParamsAndScroll = () => {
    if (!date || !selectedRange) return;
    const url = new URL(window.location.href);
    url.searchParams.set("date", format(date, "yyyy-MM-dd"));
    url.searchParams.set("timeSlot", selectedRange);
    url.searchParams.set("locationType", locationType);
    const servicesPairs: string[] = [];
    Object.keys(serviceSelection).forEach((id) => {
      const qty = serviceSelection[id];
      if (qty > 0) servicesPairs.push(`${id}:${qty}`);
    });
    if (servicesPairs.length) {
      url.searchParams.set("services", servicesPairs.join(","));
    } else {
      url.searchParams.delete("services");
    }
    window.history.replaceState({}, "", url.toString());

    try {
      const payload = {
        date: format(date, "yyyy-MM-dd"),
        timeSlot: selectedRange,
        locationType,
        services: servicesPairs.join(","),
      };
      window.dispatchEvent(
        new CustomEvent("availability:prefill", { detail: payload })
      );
    } catch {}

    // Esperar a que el DOM se actualice antes de hacer scroll
    setTimeout(() => {
      const el = document.querySelector("#booking-flow");
      if (el) {
        (el as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  return (
    <div
      id="availability-section"
      className="mb-8 rounded-[16px] bg-[color:var(--color-surface)]/40 border border-[color:var(--color-border)]/30 w-full max-w-full overflow-hidden transition-all duration-200 hover:border-[color:var(--color-primary)]/30"
    >
      {/* Header colapsable */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-[color:var(--color-surface)]/20 transition-all duration-200 rounded-[16px] group"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[color:var(--color-primary)]/20 transition-colors">
              <Calendar className="w-6 h-6 text-[color:var(--color-primary)]" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[color:var(--color-primary)] text-white flex items-center justify-center text-xs font-bold shadow-md">
              2
            </div>
          </div>
          <div className="text-left flex-1">
            <Typography
              as="h3"
              variant="h3"
              className="font-bold text-[color:var(--color-heading)] break-words mb-1"
            >
              Verificar disponibilidad
            </Typography>
            <Typography
              as="p"
              variant="small"
              className="text-[color:var(--color-body)] opacity-80"
            >
              Selecciona fecha y horario para tu cita
            </Typography>
          </div>
        </div>
        <div className="flex-shrink-0 ml-3">
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-[color:var(--color-primary)] group-hover:scale-110 transition-transform" />
          ) : (
            <ChevronDown className="w-6 h-6 text-[color:var(--color-primary)] group-hover:scale-110 transition-transform" />
          )}
        </div>
      </button>

      {/* Contenido colapsable */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-4">
          {/* Fecha */}
          <div>
            <Typography
              as="h4"
              variant="h4"
              className="font-semibold text-[color:var(--color-heading)] mb-2 text-center"
            >
              Fecha
            </Typography>
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              inline
              locale={es}
              formatWeekDay={(nameOfDay) => {
                const key = nameOfDay.toLowerCase();
                if (key.startsWith("lun")) return "lun";
                if (key.startsWith("mar")) return "mar";
                if (key.startsWith("miér")) return "mié";
                if (key.startsWith("mie")) return "mié";
                if (key.startsWith("jue")) return "jue";
                if (key.startsWith("vie")) return "vie";
                if (key.startsWith("sáb")) return "sáb";
                if (key.startsWith("sab")) return "sáb";
                if (key.startsWith("dom")) return "dom";
                return nameOfDay.slice(0, 3).toLowerCase();
              }}
              calendarClassName="w-full no-daynames"
              renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <button
                      type="button"
                      onClick={decreaseMonth}
                      className="p-2 rounded-lg bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-secondary)] transition-colors"
                      aria-label="Mes anterior"
                    >
                      <ChevronLeft className="w-4 h-4 text-[color:var(--color-heading)]" />
                    </button>
                    <Typography
                      as="span"
                      variant="small"
                      className="font-medium text-[color:var(--color-heading)]"
                    >
                      {format(date, "MMMM yyyy", { locale: es })}
                    </Typography>
                    <button
                      type="button"
                      onClick={increaseMonth}
                      className="p-2 rounded-lg bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-secondary)] transition-colors"
                      aria-label="Mes siguiente"
                    >
                      <ChevronRight className="w-4 h-4 text-[color:var(--color-heading)]" />
                    </button>
                  </div>
                  <div className="custom-weekday-header" aria-hidden>
                    {["lun", "mar", "mié", "jue", "vie", "sáb", "dom"].map(
                      (d) => (
                        <span key={d} className="custom-weekday-cell">
                          {d}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            />
          </div>

          {/* Ubicación */}
          <div>
            <Typography
              as="h4"
              variant="h4"
              className="font-semibold text-[color:var(--color-heading)] mb-2 text-center"
            >
              Ubicación
            </Typography>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={locationType === "HOME" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setLocationType("HOME")}
                className="flex-1 rounded-[12px]"
              >
                <MapPin className="w-4 h-4 mr-1" /> A domicilio
              </Button>
              <Button
                type="button"
                variant={locationType === "STUDIO" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setLocationType("STUDIO")}
                className="flex-1 rounded-[12px]"
              >
                <MapPin className="w-4 h-4 mr-1" /> Estudio
              </Button>
            </div>
          </div>

          {/* Servicio */}
          <div id="availability-service">
            <Typography
              as="h4"
              variant="h4"
              className="font-semibold text-[color:var(--color-heading)] mb-2 text-center"
            >
              Servicio
            </Typography>
            <CompactServiceSelector
              value={serviceSelection}
              onChangeAction={setServiceSelection}
            />
            {!hasSelectedService && (
              <Typography
                as="p"
                variant="small"
                className="text-[color:var(--color-muted)] mt-2 text-center"
              >
                Obligatorio para ver horarios
              </Typography>
            )}
          </div>

          {/* Horarios disponibles */}
          <div className="pt-2">
            <Typography
              as="h4"
              variant="h4"
              className="font-semibold text-[color:var(--color-heading)] mb-3 text-center"
            >
              Horarios disponibles
            </Typography>

            {!hasSelectedService ? (
              <div className="text-center py-4">
                <Typography
                  as="p"
                  variant="small"
                  className="text-[color:var(--color-body)] mb-2"
                >
                  Selecciona un servicio primero
                </Typography>
              </div>
            ) : isLoading ? (
              <div className="space-y-2">
                {["sk-1", "sk-2", "sk-3"].map((key) => (
                  <div
                    key={key}
                    className="h-10 bg-[color:var(--color-surface)]/60 rounded-[12px] animate-pulse"
                  />
                ))}
              </div>
            ) : date && availableRanges.length === 0 ? (
              <div className="text-center py-4">
                <Typography
                  as="p"
                  variant="small"
                  className="text-[color:var(--color-body)]"
                >
                  No hay horarios disponibles
                </Typography>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {availableRanges.map((r) => {
                  const isSelected = selectedRange === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRange(r)}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-[12px] transition-colors ${
                        isSelected
                          ? "bg-[color:var(--color-primary)] text-white"
                          : "bg-[color:var(--color-surface)]/60 text-[color:var(--color-heading)] hover:bg-[color:var(--color-surface)]"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span className="font-medium text-sm">{r}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Confirmación */}
            {date && selectedRange && (
              <div className="mt-4 p-3 bg-[color:var(--color-primary)]/10 rounded-[12px] text-center space-y-2">
                <Typography
                  as="p"
                  variant="small"
                  className="text-[color:var(--color-body)]"
                >
                  {format(date, "dd MMM", { locale: es })} • {selectedRange}
                </Typography>

                {/* Total de servicios */}
                {hasSelectedService && totalPrice > 0 && (
                  <div className="pt-2 border-t border-[color:var(--color-border)]/30">
                    <Typography
                      as="p"
                      variant="small"
                      className="text-[color:var(--color-muted)] mb-1"
                    >
                      Total de servicios
                    </Typography>
                    <Typography
                      as="p"
                      variant="h3"
                      className="text-[color:var(--color-primary)] font-bold"
                    >
                      S/ {totalPrice.toFixed(2)}
                    </Typography>
                  </div>
                )}

                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className="w-full rounded-[12px]"
                  onClick={setQueryParamsAndScroll}
                >
                  Reservar cita
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
