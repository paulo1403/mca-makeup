"use client";

import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import { useCreateAppointment } from "@/hooks/useAppointments";

interface ManualAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function ManualAppointmentModal({ isOpen, onClose }: ManualAppointmentModalProps) {
  const createAppointment = useCreateAppointment();

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [serviceType, setServiceType] = useState("Servicio privado (novia)");
  const [appointmentDate, setAppointmentDate] = useState(getTodayDate());
  const [appointmentTime, setAppointmentTime] = useState("10:00 - 12:00");
  const [status, setStatus] = useState<"PENDING" | "CONFIRMED" | "COMPLETED">("COMPLETED");
  const [duration, setDuration] = useState("120");
  const [locationType, setLocationType] = useState<"HOME" | "STUDIO">("HOME");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [addressReference, setAddressReference] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [transportCost, setTransportCost] = useState("0");
  const [nightShiftCost, setNightShiftCost] = useState("0");
  const [totalPrice, setTotalPrice] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const suggestedTotal = useMemo(() => {
    const service = Number.parseFloat(servicePrice || "0") || 0;
    const transport = Number.parseFloat(transportCost || "0") || 0;
    const night = Number.parseFloat(nightShiftCost || "0") || 0;
    return service + transport + night;
  }, [servicePrice, transportCost, nightShiftCost]);

  const resetForm = () => {
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setServiceType("Servicio privado (novia)");
    setAppointmentDate(getTodayDate());
    setAppointmentTime("10:00 - 12:00");
    setStatus("COMPLETED");
    setDuration("120");
    setLocationType("HOME");
    setDistrict("");
    setAddress("");
    setAddressReference("");
    setServicePrice("");
    setTransportCost("0");
    setNightShiftCost("0");
    setTotalPrice("");
    setAdditionalNotes("");
  };

  const handleClose = () => {
    if (!createAppointment.isPending) {
      onClose();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!clientName || !clientEmail || !clientPhone || !serviceType || !appointmentDate) {
      toast.error("Completa los campos requeridos");
      return;
    }

    const serviceValue = Number.parseFloat(servicePrice || "0");
    const transportValue = Number.parseFloat(transportCost || "0");
    const nightValue = Number.parseFloat(nightShiftCost || "0");
    const manualTotal = Number.parseFloat(totalPrice || "0");

    createAppointment.mutate(
      {
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientPhone: clientPhone.trim(),
        serviceType: serviceType.trim(),
        appointmentDate,
        appointmentTime: appointmentTime.trim() || "10:00 - 12:00",
        status,
        duration: Number.parseInt(duration, 10) || 120,
        locationType,
        district: district.trim() || undefined,
        address: address.trim() || undefined,
        addressReference: addressReference.trim() || undefined,
        servicePrice: serviceValue > 0 ? serviceValue : 0,
        transportCost: transportValue > 0 ? transportValue : 0,
        nightShiftCost: nightValue > 0 ? nightValue : 0,
        totalPrice: manualTotal > 0 ? manualTotal : suggestedTotal,
        additionalNotes: `[REGISTRO MANUAL] ${additionalNotes.trim()}`.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Ingreso manual registrado");
          resetForm();
          onClose();
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "No se pudo registrar";
          toast.error(message);
        },
      },
    );
  };

  return (
    <Modal open={isOpen} onClose={handleClose} size="lg" ariaLabelledBy="manual-appointment-title">
      <ModalHeader title="Registrar cita manual" onClose={handleClose} />
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-sm text-[color:var(--color-muted)]">
              Usa este formulario para registrar servicios privados (por ejemplo novias) y llevar
              control real de ingresos sin depender de la reserva web.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-sm font-medium text-[color:var(--color-heading)]">
                  Nombre *
                </span>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  autoComplete="name"
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm"
                  placeholder="Nombre de clienta"
                  required
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-[color:var(--color-heading)]">
                  Telefono *
                </span>
                <input
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm"
                  placeholder="999 999 999"
                  required
                />
              </label>

              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm font-medium text-[color:var(--color-heading)]">
                  Email *
                </span>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm"
                  placeholder="cliente@email.com"
                  required
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm font-medium text-[color:var(--color-heading)]">
                  Servicio *
                </span>
                <input
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm"
                  placeholder="Paquete novia premium"
                  required
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-[color:var(--color-heading)]">
                  Fecha *
                </span>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm"
                  required
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-[color:var(--color-heading)]">
                  Horario *
                </span>
                <input
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm"
                  placeholder="10:00 - 12:00"
                  required
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-[color:var(--color-heading)]">
                  Duracion (min)
                </span>
                <input
                  type="number"
                  min="30"
                  step="15"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  inputMode="numeric"
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm"
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-[color:var(--color-heading)]">
                  Estado
                </span>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "PENDING" | "CONFIRMED" | "COMPLETED")
                  }
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm"
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="CONFIRMED">Confirmada</option>
                  <option value="COMPLETED">Completada</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-sm font-medium text-[color:var(--color-heading)]">
                  Ubicacion
                </span>
                <select
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value as "HOME" | "STUDIO")}
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm"
                >
                  <option value="HOME">Domicilio</option>
                  <option value="STUDIO">Studio</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-[color:var(--color-heading)]">
                  Distrito
                </span>
                <input
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm"
                  placeholder="Miraflores"
                />
              </label>

              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm font-medium text-[color:var(--color-heading)]">
                  Direccion
                </span>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="street-address"
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm"
                  placeholder="Av. Ejemplo 123"
                />
              </label>

              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm font-medium text-[color:var(--color-heading)]">
                  Referencia
                </span>
                <input
                  value={addressReference}
                  onChange={(e) => setAddressReference(e.target.value)}
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm"
                  placeholder="Frente al parque"
                />
              </label>
            </div>

            <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] p-3 space-y-3">
              <div className="text-sm font-semibold text-[color:var(--color-heading)]">
                Costos manuales
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="space-y-1">
                  <span className="text-sm text-[color:var(--color-muted)]">Servicios (S/)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value)}
                    inputMode="decimal"
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm"
                    placeholder="0.00"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm text-[color:var(--color-muted)]">Movilidad (S/)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={transportCost}
                    onChange={(e) => setTransportCost(e.target.value)}
                    inputMode="decimal"
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm"
                    placeholder="0.00"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm text-[color:var(--color-muted)]">Nocturno (S/)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={nightShiftCost}
                    onChange={(e) => setNightShiftCost(e.target.value)}
                    inputMode="decimal"
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm"
                    placeholder="0.00"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm text-[color:var(--color-muted)]">Total manual (S/)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(e.target.value)}
                    inputMode="decimal"
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm"
                    placeholder="Dejalo vacio para autocalcular"
                  />
                </label>
              </div>
              <div className="text-xs text-[color:var(--color-muted)]">
                Total sugerido por sistema: <strong>S/ {suggestedTotal.toFixed(2)}</strong>
              </div>
            </div>

            <label className="space-y-1 block">
              <span className="text-sm font-medium text-[color:var(--color-heading)]">Notas</span>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 text-sm min-h-[88px]"
                placeholder="Detalles del servicio privado"
              />
            </label>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="w-full flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:flex-1 px-3 py-2.5 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] min-h-[44px]"
              disabled={createAppointment.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:flex-1 px-3 py-2.5 rounded-lg bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-hover)] disabled:opacity-50 min-h-[44px]"
              disabled={createAppointment.isPending}
            >
              {createAppointment.isPending ? "Guardando..." : "Registrar ingreso"}
            </button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}
