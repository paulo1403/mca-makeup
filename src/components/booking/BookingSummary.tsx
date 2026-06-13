"use client";
import { format } from "date-fns";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-hot-toast";
import { generateQuotePng } from "@/components/share/QuoteShareCard";
import type { Appointment } from "@/hooks/useAppointments";
import { useTransportCost } from "@/hooks/useTransportCost";
import type { BookingData } from "@/lib/bookingSchema";
import type { Service } from "@/types";
import { calculateNightShiftCost } from "@/utils/nightShift";
import { useBookingSummary } from "../../hooks/useBookingSummary";
import useServicesQuery from "../../hooks/useServicesQuery";

export default function BookingSummary() {
  const { watch } = useFormContext<BookingData>();
  const { data: services = [] } = useServicesQuery();
  const selected = watch("selectedServices") || [];
  const transportEnabled = (watch("locationType") || "STUDIO") === "HOME";
  const district: string = watch("district") || "";

  const { transportCost, getTransportCost } = useTransportCost();
  useEffect(() => {
    if (transportEnabled && district) {
      getTransportCost(district);
    }
  }, [transportEnabled, district, getTransportCost]);

  const timeSlot: string = watch("timeSlot") || "";
  const nightShiftCost = timeSlot ? calculateNightShiftCost(timeSlot) : 0;

  const { subtotal, duration, transport, nightShift, total } = useBookingSummary(
    selected,
    services,
    transportEnabled,
    transportCost?.cost,
    nightShiftCost,
  );

  const date: Date | undefined = watch("date");
  const locationType: "HOME" | "STUDIO" = watch("locationType") || "STUDIO";
  const address: string = watch("address") || "";
  const name: string = watch("name") || "";
  const email: string = watch("email") || "";
  const phone: string = watch("phone") || "";
  const deposit = 150;

  const selectedIds = (selected || []).map((it) => it.id);
  const selectedServiceDetails = (services || [])
    .filter((s: Service) => selectedIds.includes(s.id))
    .map((s: Service) => ({
      ...s,
      quantity: (selected || []).find((it) => it.id === s.id)?.quantity || 1,
    }));

  return (
    <div className="bg-[color:var(--color-card)] p-6 rounded-lg border border-[color:var(--color-border)] space-y-8">
      <div className="space-y-3">
        <h5 className="font-serif text-[color:var(--color-heading)]">Cliente</h5>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-[color:var(--color-muted)]">Nombre</div>
          <div className="text-[color:var(--color-body)]">{name || "—"}</div>
          <div className="text-[color:var(--color-muted)]">Email</div>
          <div className="text-[color:var(--color-body)] break-words">{email || "—"}</div>
          <div className="text-[color:var(--color-muted)]">Teléfono</div>
          <div className="text-[color:var(--color-body)]">{phone || "—"}</div>
        </div>
      </div>

      <div className="space-y-3">
        <h5 className="font-serif text-[color:var(--color-heading)]">Servicios seleccionados</h5>
        {selectedServiceDetails.length > 0 ? (
          <ul className="space-y-2">
            {selectedServiceDetails.map((s: Service & { quantity: number }) => (
              <li key={s.id} className="grid grid-cols-2 text-sm">
                <span className="text-[color:var(--color-body)]">
                  {s.name}
                  {s.quantity > 1 ? ` ×${s.quantity}` : ""}
                </span>
                <span className="text-[color:var(--color-body)] text-right">
                  S/ {s.price} · {s.duration} min
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[color:var(--color-muted)]">No hay servicios seleccionados.</p>
        )}
      </div>

      <div className="space-y-3">
        <h5 className="font-serif text-[color:var(--color-heading)]">Detalles de la cita</h5>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-[color:var(--color-muted)]">Fecha</div>
          <div className="text-[color:var(--color-body)]">{date ? format(date, "dd/MM/yyyy") : "—"}</div>
          <div className="text-[color:var(--color-muted)]">Horario</div>
          <div className="text-[color:var(--color-body)]">{timeSlot || "—"}</div>
          <div className="text-[color:var(--color-muted)]">Duración</div>
          <div className="text-[color:var(--color-body)]">{duration} min</div>
        </div>
      </div>

      <div className="space-y-3">
        <h5 className="font-serif text-[color:var(--color-heading)]">Ubicación</h5>
        {locationType === "HOME" ? (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-[color:var(--color-muted)]">Tipo</div>
            <div className="text-[color:var(--color-body)]">A domicilio</div>
            <div className="text-[color:var(--color-muted)]">Distrito</div>
            <div className="text-[color:var(--color-body)]">{district || "—"}</div>
            <div className="text-[color:var(--color-muted)]">Dirección</div>
            <div className="text-[color:var(--color-body)]">{address || "—"}</div>
            <div className="text-[color:var(--color-muted)]">Transporte</div>
            <div className="text-[color:var(--color-body)]">S/ {transport}</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-[color:var(--color-muted)]">Tipo</div>
            <div className="text-[color:var(--color-body)]">En estudio</div>
            <div className="text-[color:var(--color-muted)]">Transporte</div>
            <div className="text-[color:var(--color-body)]">S/ 0</div>
          </div>
        )}
      </div>

      <div className="space-y-2 pt-4 border-t border-[color:var(--color-border)]">
        <div className="grid grid-cols-2 text-sm">
          <span className="text-[color:var(--color-muted)]">Servicios</span>
          <span className="text-[color:var(--color-body)] text-right">S/ {subtotal}</span>
        </div>
        <div className="grid grid-cols-2 text-sm">
          <span className="text-[color:var(--color-muted)]">Transporte</span>
          <span className="text-[color:var(--color-body)] text-right">S/ {transport}</span>
        </div>
        {nightShift > 0 && (
          <div className="grid grid-cols-2 text-sm">
            <span className="text-[color:var(--color-muted)]">Horario nocturno</span>
            <span className="text-[color:var(--color-body)] text-right">S/ {nightShift}</span>
          </div>
        )}
        <div className="grid grid-cols-2 font-serif text-lg mt-2">
          <span className="text-[color:var(--color-heading)]">Total</span>
          <span className="text-[color:var(--color-primary)] text-right">S/ {total}</span>
        </div>
        <div className="grid grid-cols-2 text-sm">
          <span className="text-[color:var(--color-muted)]">Depósito requerido</span>
          <span className="text-[color:var(--color-body)] text-right">S/ {deposit}</span>
        </div>
        <div className="grid grid-cols-2 text-sm">
          <span className="text-[color:var(--color-muted)]">Restante a pagar</span>
          <span className="text-[color:var(--color-body)] text-right">
            S/ {Math.max(0, (total || 0) - (deposit || 0))}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3">
          <button
            type="button"
            className="px-3 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 text-sm"
            onClick={async (event) => {
              const btn = event.currentTarget;
              const original = btn.textContent;
              const servicesForAppointment: Appointment["services"] = selectedServiceDetails.map(
                (s) => ({
                  id: s.id,
                  name: s.name,
                  quantity: s.quantity,
                  price: s.price,
                  duration: s.duration,
                }),
              );
              const mockAppointment: Appointment = {
                id: "preview",
                clientName: name || "",
                clientEmail: email || "",
                clientPhone: phone || "",
                serviceType: servicesForAppointment?.[0]?.name || "Servicios",
                services: servicesForAppointment,
                appointmentDate: date ? new Date(date).toISOString() : new Date().toISOString(),
                appointmentTime: timeSlot || "",
                status: "PENDING",
                additionalNotes: "",
                location: locationType === "HOME" ? "HOME" : "Studio",
                duration,
                servicePrice: subtotal,
                transportCost: transport,
                nightShiftCost: nightShift,
                totalPrice: total,
                district,
                address,
                addressReference: "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              try {
                const blob = await generateQuotePng({ appointment: mockAppointment, deposit });
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `presupuesto-preview.png`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  btn.textContent = "✅ Exportado";
                  toast.success("Imagen descargada");
                }
              } catch {
                toast.error("No se pudo exportar la imagen");
                btn.textContent = "⚠️ Error";
              } finally {
                setTimeout(() => (btn.textContent = original || "Exportar PNG"), 1800);
              }
            }}
          >
            Exportar PNG
          </button>
          <button
            type="button"
            className="px-3 py-2 bg-[color:var(--color-accent-secondary)] text-[color:var(--color-on-accent-contrast)] rounded text-sm"
            onClick={async (event) => {
              const btn = event.currentTarget;
              const original = btn.textContent;
              const textLines: string[] = [];
              const fecha = date ? format(date, "dd/MM/yyyy") : format(new Date(), "dd/MM/yyyy");
              const hora = timeSlot || "";
              const ubicacion =
                locationType === "HOME"
                  ? `a domicilio${district ? ` en ${district}:` : ":"}`
                  : "en Room Studio Pueblo Libre:";
              textLines.push("Este sería el detalle del servicio:");
              textLines.push(`Cita programada para el ${fecha} a la ${hora} ${ubicacion}`);
              textLines.push("");
              selectedServiceDetails.forEach((s) => {
                const priceLine = s.price * (s.quantity || 1);
                textLines.push(
                  `${s.name}${s.quantity > 1 ? ` ×${s.quantity}` : ""}: S/ ${priceLine}`,
                );
              });
              textLines.push(`Total S/ ${total}`);
              textLines.push(`Adelanto S/ ${deposit}`);
              textLines.push(`Restante S/ ${Math.max(0, (total || 0) - (deposit || 0))}`);
              try {
                await navigator.clipboard.writeText(textLines.join("\n"));
                toast.success("Texto copiado al portapapeles");
                btn.textContent = "✅ Copiado";
              } catch {
                toast.error("No se pudo copiar el texto");
                btn.textContent = "⚠️ Error";
              } finally {
                setTimeout(() => (btn.textContent = original || "Copiar texto"), 1800);
              }
            }}
          >
            Copiar texto
          </button>
        </div>
      </div>
    </div>
  );
}
