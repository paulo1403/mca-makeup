"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  MapPin,
  Search,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const selected = districts.find(
    (d: { name: string }) => d.name === selectedDistrict,
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--color-muted)] pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar distrito..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-[12px] bg-[color:var(--color-surface)]/60 text-[color:var(--color-heading)] placeholder:text-[color:var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/30 border border-[color:var(--color-border)]"
        />
      </div>

      {selected && (
        <div className="p-4 rounded-[12px] bg-[color:var(--color-primary)]/10 border border-[color:var(--color-primary)]/20 text-center">
          <p className="text-sm text-[color:var(--color-muted)] mb-1">
            {selected.name}
          </p>
          <p className="text-2xl font-bold text-[color:var(--color-primary)]">
            S/ {selected.cost?.toFixed(2)}
          </p>
          <p className="text-xs text-[color:var(--color-muted)] mt-1">
            Costo de transporte
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
        {filtered.map((d: { name: string; cost: number }) => (
          <button
            key={d.name}
            type="button"
            onClick={() => setSelectedDistrict(d.name)}
            className={`px-3 py-2 rounded-[12px] text-sm transition-colors ${
              selectedDistrict === d.name
                ? "bg-[color:var(--color-primary)] text-white"
                : "bg-[color:var(--color-surface)]/60 text-[color:var(--color-heading)] hover:bg-[color:var(--color-surface)]"
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

  const categories = [
    { key: "BRIDAL", label: "Novias" },
    { key: "SOCIAL", label: "Social/Eventos" },
    { key: "MATURE_SKIN", label: "Piel Madura" },
    { key: "HAIRSTYLE", label: "Peinados" },
    { key: "OTHER", label: "Otros" },
  ];

  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const catServices = services.filter(
          (s: { category: string }) => s.category === cat.key,
        );
        if (catServices.length === 0) return null;
        return (
          <div key={cat.key}>
            <h4 className="text-sm font-semibold text-[color:var(--color-heading)] mb-2">
              {cat.label}
            </h4>
            <div className="space-y-2">
              {catServices.map(
                (s: { id: string; name: string; price: number; duration: number }) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-[12px] bg-[color:var(--color-surface)]/60 border border-[color:var(--color-border)]/20"
                  >
                    <div>
                      <p className="text-sm font-medium text-[color:var(--color-heading)]">
                        {s.name}
                      </p>
                      <p className="text-xs text-[color:var(--color-muted)]">
                        {s.duration} min
                      </p>
                    </div>
                    <p className="text-sm font-bold text-[color:var(--color-primary)]">
                      S/ {s.price.toFixed(2)}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        );
      })}
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
        <div className="grid grid-cols-2 gap-2">
          {slots.map((slot) => (
            <div
              key={slot}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-[12px] bg-[color:var(--color-surface)]/60 text-[color:var(--color-heading)]"
            >
              <Clock className="w-4 h-4" />
              <span className="font-medium text-sm">{slot}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ConsultasPage() {
  return (
    <section className="contact-section py-10 sm:py-20 relative min-h-screen pt-32">
      <div className="contact-container px-4 sm:px-6">
        <div className="contact-header mb-8 sm:mb-12 text-center">
          <h1 className="text-h1 contact-title text-3xl sm:text-4xl lg:text-5xl font-bold">
            Consultas
          </h1>
          <p className="text-[color:var(--color-body)] mt-3 max-w-md mx-auto">
            Consulta precios, transportes y disponibilidad
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Tabs defaultValue="transport">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="transport" className="flex-1">
                <Truck className="w-4 h-4 mr-1.5" />
                Transporte
              </TabsTrigger>
              <TabsTrigger value="services" className="flex-1">
                <DollarSign className="w-4 h-4 mr-1.5" />
                Servicios
              </TabsTrigger>
              <TabsTrigger value="availability" className="flex-1">
                <CalendarIcon className="w-4 h-4 mr-1.5" />
                Disponibilidad
              </TabsTrigger>
            </TabsList>

            <div className="rounded-[16px] bg-[color:var(--color-surface)]/40 border border-[color:var(--color-border)]/30 p-5">
              <TabsContent value="transport">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-[color:var(--color-primary)]" />
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
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-[color:var(--color-primary)]" />
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
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-[color:var(--color-primary)]" />
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
        </div>
      </div>
    </section>
  );
}
