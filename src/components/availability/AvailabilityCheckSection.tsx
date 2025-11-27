"use client";

import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import CompactServiceSelector from "@/components/availability/CompactServiceSelector";
import { useAvailableRanges } from "@/hooks/useAvailableRanges";
import type { ServiceSelection, LocationType } from "@/types";
import { Calendar, Clock, MapPin, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import { format } from "date-fns";

export default function AvailabilityCheckSection() {
  const [date, setDate] = useState<Date | null>(null);
  const [locationType, setLocationType] = useState<LocationType>("HOME");
  const [serviceSelection, setServiceSelection] = useState<ServiceSelection>({});
  const [selectedRange, setSelectedRange] = useState<string>("");

  const { data, isLoading } = useAvailableRanges(date, serviceSelection, locationType);

  const availableRanges: string[] = useMemo(() => data?.availableRanges || [], [data]);

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

    const el = document.querySelector("#booking-flow");
    if (el) {
      (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mb-10 sm:mb-14 p-6 sm:p-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 shrink-0 rounded-full bg-[color:var(--color-primary)]/30 border border-[color:var(--color-border)] flex items-center justify-center">
          <Calendar className="w-4 h-4 text-[color:var(--color-heading)]" />
        </div>
        <Typography as="h3" variant="h3" className="text-[color:var(--color-heading)] text-base sm:text-lg">
          Chequear disponibilidad
        </Typography>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Fecha */}
        <div className="p-3 sm:p-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          <Typography as="h4" variant="h4" className="text-[color:var(--color-heading)] text-sm mb-2">
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
                  <Typography as="span" variant="small" className="font-medium text-[color:var(--color-heading)]">
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
                  {(["lun", "mar", "mié", "jue", "vie", "sáb", "dom"]).map((d) => (
                    <span key={d} className="custom-weekday-cell">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
          />
        </div>

        {/* Ubicación y servicio */}
        <div className="space-y-3">
          <div className="p-3 sm:p-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
            <Typography as="h4" variant="h4" className="text-[color:var(--color-heading)] text-sm mb-3">
              Ubicación
            </Typography>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={locationType === "HOME" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setLocationType("HOME")}
              >
                <MapPin className="w-4 h-4 mr-1" /> A domicilio
              </Button>
              <Button
                type="button"
                variant={locationType === "STUDIO" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setLocationType("STUDIO")}
              >
                <MapPin className="w-4 h-4 mr-1" /> Estudio
              </Button>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
            <Typography as="h4" variant="h4" className="text-[color:var(--color-heading)] text-sm mb-2">
              Servicio (opcional)
            </Typography>
            <CompactServiceSelector value={serviceSelection} onChangeAction={setServiceSelection} />
            <Typography as="p" variant="p" className="text-[color:var(--color-body)] text-xs mt-2">
              Elegir un servicio ayuda a calcular bloques de tiempo más precisos.
            </Typography>
          </div>
        </div>
      </div>

      {/* Horarios disponibles */}
      <div className="mt-4 p-3 sm:p-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <div className="flex items-center justify-between mb-3">
          <Typography as="h4" variant="h4" className="text-[color:var(--color-heading)] text-sm">
            Horarios disponibles
          </Typography>
          {date && (
            <Typography as="span" variant="small" className="text-[color:var(--color-body)] text-xs">
              {format(date, "dd/MM/yyyy")}
            </Typography>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {["sk-1", "sk-2", "sk-3"].map((key) => (
              <div key={key} className="h-10 bg-[color:var(--color-surface)] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : date && availableRanges.length === 0 ? (
          <div className="text-center py-2">
            <Typography as="p" variant="p" className="text-[color:var(--color-body)] text-sm">
              No hay horarios disponibles para la fecha seleccionada
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {availableRanges.map((r) => {
              const isSelected = selectedRange === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRange(r)}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 w-full ${
                    isSelected
                      ? "bg-[color:var(--color-primary)] text-white border-2 border-[color:var(--color-primary)]"
                      : "bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]/50"
                  }`}
                >
                  <Clock className={`w-4 h-4 ${isSelected ? "text-white" : "text-[color:var(--color-accent)]"}`} />
                  <span className={`font-medium text-sm ${isSelected ? "text-white" : "text-[color:var(--color-heading)]"}`}>{r}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Selección y acción */}
        {date && selectedRange && (
          <div className="mt-4 p-3 bg-[color:var(--color-primary)]/10 rounded-lg border border-[color:var(--color-primary)]/20">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[color:var(--color-primary)] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div>
                  <span className="text-[color:var(--color-body)] text-xs">Seleccionaste</span>
                  <p className="text-[color:var(--color-heading)] font-medium text-sm">
                    {format(date, "dd MMM", { locale: es })}
                  </p>
                  <span className="text-[color:var(--color-body)] text-xs">
                    {selectedRange}
                  </span>
                </div>
              </div>
              <Button type="button" variant="primary" size="sm" className="w-full sm:w-auto" onClick={setQueryParamsAndScroll}>
                Usar este horario en el formulario
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
