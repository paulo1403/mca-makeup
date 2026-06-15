"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  MapPin,
  Minus,
  Plus,
  Search,
  Sparkles,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { useAvailableSlots } from "@/hooks/useAvailableSlots";
import { useDistricts } from "@/hooks/useDistricts";
import { useServicesList } from "@/hooks/useServices";

function TransportTab() {
  const { districts = [] } = useDistricts();
  const [search, setSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const filtered = districts.filter((d: { name: string }) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = districts.find((d: { name: string }) => d.name === selectedDistrict);

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--color-muted)] pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar distrito..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[color:var(--color-surface)] text-[color:var(--color-heading)] placeholder:text-[color:var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/30 focus:border-[color:var(--color-primary)] border border-[color:var(--color-border)] transition-colors"
        />
      </div>

      {selected && (
        <div className="p-5 rounded-xl bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-primary-hover)] text-white text-center shadow-lg shadow-[color:var(--color-primary)]/20">
          <p className="text-sm text-white/80 mb-1">{selected.name}</p>
          <p className="text-3xl font-bold">S/ {selected.cost?.toFixed(2)}</p>
          <p className="text-xs text-white/70 mt-1">Costo de transporte</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
        {filtered.map((d: { name: string; cost: number }) => (
          <button
            key={d.name}
            type="button"
            onClick={() => setSelectedDistrict(d.name)}
            className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
              selectedDistrict === d.name
                ? "bg-[color:var(--color-primary)] text-white border-[color:var(--color-primary)] shadow-md"
                : "bg-[color:var(--color-surface)] text-[color:var(--color-heading)] border-[color:var(--color-border)] hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-accent-soft)]"
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function ServicesTab() {
  const { data: services = [] } = useServicesList();
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});

  const toggleCat = (key: string) => {
    setOpenCats((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = 1;
      }
      return next;
    });
  };

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) {
      setSelected((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      setSelected((prev) => ({ ...prev, [id]: qty }));
    }
  };

  const total = services.reduce((sum: number, s: { id: string; price: number }) => {
    return sum + (s.price || 0) * (selected[s.id] || 0);
  }, 0);

  const selectedCount = Object.keys(selected).length;

  const categories = [
    { key: "BRIDAL", label: "Novias" },
    { key: "SOCIAL", label: "Social/Eventos" },
    { key: "MATURE_SKIN", label: "Piel Madura" },
    { key: "HAIRSTYLE", label: "Peinados" },
    { key: "OTHER", label: "Otros" },
  ];

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-[color:var(--color-primary)]/5 border border-[color:var(--color-primary)]/15 text-sm text-[color:var(--color-body)] flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-[color:var(--color-primary)] shrink-0 mt-0.5" />
        <span>Toca cada servicio para calcular el precio total.</span>
      </div>

      {categories.map((cat) => {
        const catServices = services.filter((s: { category: string }) => s.category === cat.key);
        if (catServices.length === 0) return null;
        const isOpen = openCats[cat.key] ?? true;

        const catSelectedCount = catServices.filter(
          (s: { id: string }) => selected[s.id],
        ).length;

        return (
          <div
            key={cat.key}
            className="rounded-xl border border-[color:var(--color-border)]/30 bg-[color:var(--color-surface)]/40 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleCat(cat.key)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[color:var(--color-accent-soft)]/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[color:var(--color-heading)]">
                  {cat.label}
                </span>
                {catSelectedCount > 0 && (
                  <span className="text-[10px] font-medium text-white bg-[color:var(--color-primary)] px-1.5 py-0.5 rounded-full">
                    {catSelectedCount}
                  </span>
                )}
              </div>
              <svg
                className={`w-4 h-4 text-[color:var(--color-muted)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="px-4 pb-3 space-y-1.5">
                {catServices.map(
                  (s: { id: string; name: string; price: number; duration: number }) => {
                    const isSelected = !!selected[s.id];
                    const qty = selected[s.id] || 0;
                    return (
                      <div
                        key={s.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-[color:var(--color-primary)]/5 border-[color:var(--color-primary)]/30"
                            : "border-transparent hover:bg-[color:var(--color-accent-soft)]/30"
                        }`}
                        onClick={() => toggle(s.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggle(s.id);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[color:var(--color-heading)]">
                            {s.name}
                          </p>
                          <p className="text-xs text-[color:var(--color-muted)]">
                            {s.duration} min
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isSelected && (
                            <div
                              className="flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => updateQty(s.id, qty - 1)}
                                className="w-6 h-6 rounded bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)] flex items-center justify-center hover:bg-[color:var(--color-accent-soft)] transition-colors"
                                aria-label="Reducir cantidad"
                              >
                                <Minus className="w-3 h-3 text-[color:var(--color-body)]" />
                              </button>
                              <span className="w-5 text-center text-sm font-semibold text-[color:var(--color-heading)]">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(s.id, qty + 1)}
                                className="w-6 h-6 rounded bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)] flex items-center justify-center hover:bg-[color:var(--color-accent-soft)] transition-colors"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus className="w-3 h-3 text-[color:var(--color-body)]" />
                              </button>
                            </div>
                          )}
                          <span className="text-sm font-bold text-[color:var(--color-primary)] min-w-[4rem] text-right">
                            S/ {((s.price || 0) * (qty || 1)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </div>
        );
      })}

      {selectedCount > 0 && (
        <div className="sticky bottom-4 rounded-xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)]/40 shadow-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[color:var(--color-muted)]">
              {selectedCount} servicio{selectedCount !== 1 ? "s" : ""} seleccionado{selectedCount !== 1 ? "s" : ""}
            </p>
            <p className="text-lg font-bold text-[color:var(--color-heading)]">
              S/ {total.toFixed(2)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelected({})}
            className="text-xs font-medium text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[color:var(--color-accent-soft)]"
          >
            Limpiar
          </button>
        </div>
      )}
    </div>
  );
}

function AvailabilityTab() {
  const [date, setDate] = useState<Date | null>(null);
  const { data, isLoading } = useAvailableSlots(date);
  const slots: string[] = data?.availableRanges || [];

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        locale={es}
        selected={date ?? undefined}
        onSelect={(d) => setDate(d ?? null)}
        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
        className="mx-auto w-full max-w-[320px] rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3"
        classNames={{
          caption_label: "text-sm font-semibold capitalize text-[color:var(--color-heading)]",
          weekday: "text-[0.78rem] font-semibold text-[color:var(--calendar-label)] w-9",
          day_button: "h-9 w-9 text-sm font-medium text-[color:var(--color-heading)]",
          disabled: "h-9 w-9 text-sm font-medium text-[color:var(--calendar-inactive)] opacity-50",
          outside: "h-9 w-9 text-sm font-medium text-[color:var(--calendar-inactive)] opacity-60",
        }}
      />

      {!date ? (
        <p className="text-sm text-[color:var(--color-muted)] text-center">
          Selecciona una fecha para ver horarios
        </p>
      ) : isLoading ? (
        <div className="space-y-2">
          {["sk-1", "sk-2", "sk-3"].map((key) => (
            <div
              key={key}
              className="h-10 bg-[color:var(--color-surface)]/60 rounded-[12px] animate-pulse"
            />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <p className="text-sm text-[color:var(--color-muted)] text-center">
          No hay horarios disponibles
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {slots.map((slot) => (
            <div
              key={slot}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)]/30 text-[color:var(--color-heading)] hover:border-[color:var(--color-primary)]/30 transition-colors"
            >
              <Clock className="w-4 h-4 text-[color:var(--color-primary)]" />
              <span className="font-medium text-sm">{slot}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ConsultasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "transport";
  const validTabs = ["transport", "services", "availability"];
  const [tab, setTab] = useState(validTabs.includes(tabFromUrl) ? tabFromUrl : "transport");

  const handleTabChange = useCallback(
    (value: string) => {
      setTab(value);
      const params = new URLSearchParams(searchParams.toString());
      if (value === "transport") {
        params.delete("tab");
      } else {
        params.set("tab", value);
      }
      const qs = params.toString();
      router.replace(`/consultas${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <section className="min-h-screen bg-[color:var(--color-background)] pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Información útil
          </div>
          <Typography
            as="h1"
            variant="h1"
            className="text-[color:var(--color-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-3"
          >
            Consultas
          </Typography>
          <Typography
            as="p"
            variant="p"
            className="text-[color:var(--color-body)] max-w-md mx-auto"
          >
            Consulta precios de servicios, costos de transporte por distrito y horarios disponibles.
          </Typography>
        </div>

        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList className="w-full mb-6 bg-[color:var(--color-accent-soft)] p-1.5 rounded-xl border border-[color:var(--color-border)]/30 h-auto">
            <TabsTrigger
              value="transport"
              className="flex-1 py-2.5 rounded-lg text-[color:var(--color-body)] data-active:bg-[color:var(--color-surface)] data-active:text-[color:var(--color-primary)] data-active:shadow-sm transition-all"
            >
              <Truck className="w-4 h-4 mr-1.5" />
              Transporte
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="flex-1 py-2.5 rounded-lg text-[color:var(--color-body)] data-active:bg-[color:var(--color-surface)] data-active:text-[color:var(--color-primary)] data-active:shadow-sm transition-all"
            >
              <DollarSign className="w-4 h-4 mr-1.5" />
              Servicios
            </TabsTrigger>
            <TabsTrigger
              value="availability"
              className="flex-1 py-2.5 rounded-lg text-[color:var(--color-body)] data-active:bg-[color:var(--color-surface)] data-active:text-[color:var(--color-primary)] data-active:shadow-sm transition-all"
            >
              <CalendarIcon className="w-4 h-4 mr-1.5" />
              Disponibilidad
            </TabsTrigger>
          </TabsList>

          <div className="rounded-2xl bg-[color:var(--color-surface)]/60 border border-[color:var(--color-border)]/30 p-5 sm:p-6 backdrop-blur-sm">
            <TabsContent value="transport">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[color:var(--color-primary)]/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[color:var(--color-primary)]" />
                </div>
                <Typography
                  as="h3"
                  variant="h3"
                  className="font-semibold text-[color:var(--color-heading)]"
                >
                  Costo de transporte
                </Typography>
              </div>
              <TransportTab />
            </TabsContent>

            <TabsContent value="services">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[color:var(--color-primary)]/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[color:var(--color-primary)]" />
                </div>
                <Typography
                  as="h3"
                  variant="h3"
                  className="font-semibold text-[color:var(--color-heading)]"
                >
                  Servicios y precios
                </Typography>
              </div>
              <ServicesTab />
            </TabsContent>

            <TabsContent value="availability">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[color:var(--color-primary)]/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[color:var(--color-primary)]" />
                </div>
                <Typography
                  as="h3"
                  variant="h3"
                  className="font-semibold text-[color:var(--color-heading)]"
                >
                  Horarios disponibles
                </Typography>
              </div>
              <AvailabilityTab />
            </TabsContent>
          </div>
        </Tabs>

        <div className="mt-10 text-center">
          <div className="rounded-2xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)]/40 p-6 sm:p-8 shadow-sm">
            <Typography as="h3" variant="h3" className="text-[color:var(--color-heading)] mb-2">
              ¿Listo para reservar?
            </Typography>
            <Typography as="p" variant="p" className="text-[color:var(--color-body)] mb-5 max-w-sm mx-auto">
              Agenda tu cita de maquillaje profesional en pocos pasos.
            </Typography>
            <Button as="a" href="/booking" variant="primary" size="lg">
              Reservar Cita
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ConsultasPage() {
  return (
    <Suspense fallback={null}>
      <ConsultasContent />
    </Suspense>
  );
}
