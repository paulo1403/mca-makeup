"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronDown, ChevronUp, Clock, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import Typography from "@/components/ui/Typography";
import { useAvailableRanges } from "@/hooks/useAvailableRanges";
import { useDistricts } from "@/hooks/useDistricts";
import { useServicesList } from "@/hooks/useServices";
import type { LocationType, ServiceSelection } from "@/types";

export default function AvailabilityCheckSection() {
  const [date, setDate] = useState<Date | null>(null);
  const [locationType, setLocationType] = useState<LocationType>("HOME");
  const [serviceSelection, setServiceSelection] = useState<ServiceSelection>({});
  const [selectedRange, setSelectedRange] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [district, setDistrict] = useState<string>("");

  const { data, isLoading } = useAvailableRanges(date, serviceSelection, locationType);

  const { data: allServices = [] } = useServicesList();
  const { districts: transportCosts = [] } = useDistricts();

  const availableRanges: string[] = useMemo(() => data?.availableRanges || [], [data]);
  const hasSelectedService = useMemo(() => {
    return Object.values(serviceSelection).some((q) => q > 0);
  }, [serviceSelection]);

  const selectedServiceNames = useMemo(() => {
    const names: string[] = [];
    Object.entries(serviceSelection).forEach(([serviceId, quantity]) => {
      if (quantity > 0) {
        const service = allServices.find((s: { id: string; name: string }) => s.id === serviceId);
        if (service) {
          names.push(quantity > 1 ? `${service.name} ×${quantity}` : service.name);
        }
      }
    });
    return names;
  }, [serviceSelection, allServices]);

  const servicesPrice = useMemo(() => {
    let total = 0;
    Object.entries(serviceSelection).forEach(([serviceId, quantity]) => {
      if (quantity > 0) {
        const service = allServices.find((s: { id: string; price: number }) => s.id === serviceId);
        if (service) {
          total += service.price * quantity;
        }
      }
    });
    return total;
  }, [serviceSelection, allServices]);

  const transportCost = useMemo(() => {
    if (locationType !== "HOME" || !district) return 0;
    const d = transportCosts.find(
      (t: { name: string; cost: number }) => t.name === district,
    );
    return d?.cost || 0;
  }, [locationType, district, transportCosts]);

  const totalPrice = servicesPrice + transportCost;

  useEffect(() => {
    setSelectedRange("");
  }, []);

  useEffect(() => {
    const handler = () => {
      setDate(null);
      setSelectedRange("");
      setServiceSelection({});
      setLocationType("HOME");
      setDistrict("");
    };
    window.addEventListener("availability:reset", handler);
    return () => window.removeEventListener("availability:reset", handler);
  }, []);

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
          .filter((parts) => parts.length === 2 && parts[0] && Number(parts[1]) > 0)
          .reduce((acc, [id, qty]) => {
            acc[id] = Number(qty);
            return acc;
          }, {} as ServiceSelection);
        setServiceSelection(items);
      }
      setDistrict(detail.district || "");

      setIsExpanded(true);
    };
    window.addEventListener("quote:continue", handler as EventListener);
    return () => window.removeEventListener("quote:continue", handler as EventListener);
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
      window.dispatchEvent(new CustomEvent("availability:prefill", { detail: payload }));
    } catch { }

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
      className={`mb-8 rounded-[16px] bg-[color:var(--color-surface)]/40 border border-[color:var(--color-border)]/30 w-full max-w-full overflow-hidden transition-all duration-200 hover:border-[color:var(--color-primary)]/30 ${!hasSelectedService ? "hidden" : ""}`}
    >
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-[color:var(--color-surface)]/20 transition-all duration-200 rounded-[16px] group"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[color:var(--color-primary)]/20 transition-colors">
              <CalendarIcon className="w-6 h-6 text-[color:var(--color-primary)]" />
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

      <div className={`px-5 pb-5 space-y-4 ${isExpanded ? "block" : "hidden"}`}>
          {/* Mini resumen de selección anterior */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-[12px] bg-[color:var(--color-surface)]/60 border border-[color:var(--color-border)]/20">
            <div className="flex items-center gap-1.5 text-xs text-[color:var(--color-muted)]">
              <MapPin className="w-3.5 h-3.5" />
              <span>{locationType === "STUDIO" ? "Estudio" : `Domicilio${district ? ` - ${district}` : ""}`}</span>
            </div>
            <span className="text-[color:var(--color-border)]">•</span>
            <div className="flex flex-wrap gap-1">
              {selectedServiceNames.map((name, i) => (
                <span
                  key={`svc-${i}-${name}`}
                  className="text-xs px-2 py-0.5 rounded-full bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]"
                >
                  {name}
                </span>
              ))}
            </div>
            <span className="text-[color:var(--color-border)]">•</span>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[color:var(--color-muted)]">Servicios:</span>
              <span className="font-medium text-[color:var(--color-heading)]">S/ {servicesPrice.toFixed(2)}</span>
            </div>
            {locationType === "HOME" && transportCost > 0 && (
              <>
                <span className="text-[color:var(--color-border)]">•</span>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-[color:var(--color-muted)]">Transporte:</span>
                  <span className="font-medium text-[color:var(--color-heading)]">S/ {transportCost.toFixed(2)}</span>
                </div>
              </>
            )}
            <span className="text-[color:var(--color-border)]">•</span>
            <span className="text-xs font-bold text-[color:var(--color-primary)]">
              Total: S/ {totalPrice.toFixed(2)}
            </span>
          </div>

          {/* Fecha */}
          <div>
            <Typography
              as="h4"
              variant="h4"
              className="font-semibold text-[color:var(--color-heading)] mb-2 text-center"
            >
              Fecha
            </Typography>
            <Calendar
              mode="single"
              locale={es}
              selected={date ?? undefined}
              onSelect={(d) => setDate(d ?? null)}
              className="mx-auto w-full max-w-[360px] rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3"
              classNames={{
                caption_label:
                  "text-sm font-semibold capitalize text-[color:var(--color-heading)]",
                weekday:
                  "text-[0.78rem] font-semibold text-[color:var(--calendar-label)] w-9",
                day_button: "h-9 w-9 text-sm font-medium text-[color:var(--color-heading)]",
                disabled:
                  "h-9 w-9 text-sm font-medium text-[color:var(--calendar-inactive)] opacity-50",
                outside:
                  "h-9 w-9 text-sm font-medium text-[color:var(--calendar-inactive)] opacity-60",
              }}
            />
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

            {isLoading ? (
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
                <Typography as="p" variant="small" className="text-[color:var(--color-body)]">
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
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-[12px] transition-colors ${isSelected
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

            {date && selectedRange && (
              <div className="mt-4 p-3 bg-[color:var(--color-primary)]/10 rounded-[12px] text-center space-y-2">
                <Typography as="p" variant="small" className="text-[color:var(--color-body)]">
                  {format(date, "dd MMM", { locale: es })} • {selectedRange}
                </Typography>

                {totalPrice > 0 && (
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
    </div>
  );
}
