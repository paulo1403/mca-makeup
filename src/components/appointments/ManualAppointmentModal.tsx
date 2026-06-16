"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Check, Plus, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import DistrictSelector from "@/components/DistrictSelector";
import ToggleServiceCategoryGroup from "@/components/booking-accordion/ToggleServiceSelector";
import { Calendar } from "@/components/ui/calendar";
import AdminFormField, { AdminInput, AdminSelect, AdminTextarea } from "@/components/ui/AdminFormField";
import Button from "@/components/ui/Button";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import { useAvailableRanges } from "@/hooks/useAvailableRanges";
import { useCreateAppointment, useUpdateAppointment } from "@/hooks/useAppointments";
import type { Appointment } from "@/hooks/useAppointments";
import { useGroupedServicesQuery } from "@/hooks/useServicesQuery";
import { type ServiceData, useServicesList } from "@/hooks/useServices";
import { useTransportCost } from "@/hooks/useTransportCost";
import { validateSelection } from "@/lib/serviceRules";
import { calculateNightShiftCost } from "@/utils/nightShift";

interface ManualAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAppointment?: Appointment | null;
}

type FormData = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  documentType: "PE" | "OTHER";
  clientDocument: string;
  locationType: "STUDIO" | "HOME";
  district: string;
  address: string;
  addressReference: string;
  selectedServices: {
    id: string;
    quantity: number;
    _customName?: string;
    _customPrice?: number;
    _customDuration?: number;
  }[];
  date: Date;
  timeSlot: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  additionalNotes: string;
};

function formatDni(value: string) {
  return value.replace(/\D/g, "").slice(0, 8);
}

function formatPhonePE(value: string) {
  const v = value.replace(/[^\d+]/g, "");
  if (v.startsWith("+51")) {
    const digits = v.substring(3);
    if (digits.length <= 3) return `+51 ${digits}`;
    if (digits.length <= 6) return `+51 ${digits.substring(0, 3)} ${digits.substring(3)}`;
    return `+51 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 9)}`;
  }
  if (v.startsWith("9") && !v.startsWith("+")) {
    if (v.length <= 3) return v;
    if (v.length <= 6) return `${v.substring(0, 3)} ${v.substring(3)}`;
    return `${v.substring(0, 3)} ${v.substring(3, 6)} ${v.substring(6, 9)}`;
  }
  return value;
}

function validatePEFields(phone: string, document: string): string | null {
  const cleanPhone = phone.replace(/[\s\-+()]/g, "");
  if (cleanPhone.length < 9 || cleanPhone.length > 12 || !/^\d+$/.test(cleanPhone)) {
    return "Teléfono debe tener 9 dígitos (ej. 999 999 999)";
  }
  if (document && !/^\d{8}$/.test(document)) {
    return "DNI debe tener exactamente 8 dígitos";
  }
  return null;
}

export default function ManualAppointmentModal({ isOpen, onClose, editingAppointment }: ManualAppointmentModalProps) {
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const { data: groupedServices } = useGroupedServicesQuery();
  const { data: servicesList } = useServicesList();
  const { transportCost, getTransportCost, loading: transportLoading } = useTransportCost();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const isEditing = !!editingAppointment;

  const buildDefaultValues = useCallback((): FormData => {
    if (editingAppointment) {
      const stripManual = (notes: string | undefined | null) =>
        (notes || "").replace(/^\[REGISTRO MANUAL\]\s*/i, "");
      return {
        clientName: editingAppointment.clientName || "",
        clientEmail: editingAppointment.clientEmail || "",
        clientPhone: editingAppointment.clientPhone || "",
        documentType: (editingAppointment.documentType as "PE" | "OTHER") || "PE",
        clientDocument: editingAppointment.clientDocument || "",
        locationType: (editingAppointment.location || "").toLowerCase().includes("studio")
          ? "STUDIO"
          : "HOME",
        district: editingAppointment.district || "",
        address: editingAppointment.address || "",
        addressReference: editingAppointment.addressReference || "",
        selectedServices: (editingAppointment.services || []).map((s) => ({
          id: s.id,
          quantity: s.quantity || 1,
          ...((s as Record<string, unknown>)._customName ? { _customName: (s as Record<string, unknown>)._customName as string } : {}),
          ...((s as Record<string, unknown>)._customPrice != null ? { _customPrice: (s as Record<string, unknown>)._customPrice as number } : {}),
          ...((s as Record<string, unknown>)._customDuration != null ? { _customDuration: (s as Record<string, unknown>)._customDuration as number } : {}),
        })),
        date: new Date(editingAppointment.appointmentDate),
        timeSlot: editingAppointment.appointmentTime || "",
        status: editingAppointment.status,
        additionalNotes: stripManual(editingAppointment.additionalNotes),
      };
    }
    return {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      documentType: "PE" as const,
      clientDocument: "",
      locationType: "HOME" as const,
      district: "",
      address: "",
      addressReference: "",
      selectedServices: [],
      date: undefined as unknown as Date,
      timeSlot: "",
      status: "PENDING" as const,
      additionalNotes: "",
    };
  }, [editingAppointment]);

  const form = useForm<FormData>({
    defaultValues: buildDefaultValues(),
  });

  const {
    watch,
    setValue,
    reset,
    handleSubmit,
  } = form;

  useEffect(() => {
    if (isOpen) {
      reset(buildDefaultValues());
    }
  }, [isOpen, buildDefaultValues, reset]);

  const locationType = watch("locationType");
  const district = watch("district");
  const date = watch("date");
  const timeSlot = watch("timeSlot");
  const selectedServices = watch("selectedServices") || [];
  const formStatus = watch("status");

  const serviceSelection = useMemo(
    () =>
      selectedServices.reduce<Record<string, number>>((acc, cur) => {
        if (cur.id) acc[cur.id] = cur.quantity;
        return acc;
      }, {}),
    [selectedServices],
  );

  const calculated = useMemo(() => {
    const items: ({ price: number; duration: number; quantity: number; name: string })[] = selectedServices
      .map((s) => {
        if ("_customPrice" in s && s._customPrice != null) {
          return { price: s._customPrice, duration: s._customDuration || 0, quantity: s.quantity || 1, name: s._customName || "Servicio" };
        }
        const svc = servicesList?.find((x: ServiceData) => x.id === s.id);
        if (!svc) return null;
        return { price: svc.price, duration: svc.duration, quantity: s.quantity || 1, name: svc.name };
      })
      .filter((x): x is NonNullable<typeof x> => x != null);
    const subtotal = items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0);
    const duration = items.reduce((sum, it) => sum + (it.duration || 0) * (it.quantity || 1), 0);
    const transport =
      locationType === "HOME" && transportCost ? transportCost.cost : 0;
    const nightShift = timeSlot ? calculateNightShiftCost(timeSlot) : 0;
    return { subtotal, total: subtotal + transport + nightShift, duration, transport, nightShift };
  }, [selectedServices, servicesList, locationType, transportCost, timeSlot]);

  const { data: rangesData, isLoading: slotsLoading } = useAvailableRanges(
    date || null,
    serviceSelection,
    locationType,
    calculated.duration || undefined,
  );

  const [customServiceName, setCustomServiceName] = useState("");
  const [customServiceUnitPrice, setCustomServiceUnitPrice] = useState("");
  const [customServiceDuration, setCustomServiceDuration] = useState("");

  const addCustomService = () => {
    if (!customServiceName.trim()) {
      toast.error("Ingresa un nombre para el servicio");
      return;
    }
    const price = Number.parseFloat(customServiceUnitPrice);
    if (Number.isNaN(price) || price <= 0) {
      toast.error("Ingresa un precio válido");
      return;
    }
    const dur = Number.parseInt(customServiceDuration, 10) || 0;
    if (!selectedServices.some((s) => s.id === `_custom_${customServiceName.trim()}`)) {
      setValue("selectedServices", [
        ...selectedServices,
        {
          id: `_custom_${customServiceName.trim()}`,
          quantity: 1,
          _customName: customServiceName.trim(),
          _customPrice: price,
          _customDuration: dur,
        },
      ], { shouldValidate: true });
    } else {
      // increment quantity if already exists
      setValue("selectedServices", selectedServices.map((s) =>
        s.id === `_custom_${customServiceName.trim()}`
          ? { ...s, quantity: (s.quantity || 1) + 1, _customPrice: price, _customDuration: dur }
          : s
      ), { shouldValidate: true });
    }
    setCustomServiceName("");
    setCustomServiceUnitPrice("");
    setCustomServiceDuration("");
  };

  const removeCustomService = (id: string) => {
    setValue("selectedServices", selectedServices.filter((s) => s.id !== id), { shouldValidate: true });
  };

  const [customServicePrice, setCustomServicePrice] = useState<string>("");
  const [customTransportCost, setCustomTransportCost] = useState<string>("");
  const [customNightShiftCost, setCustomNightShiftCost] = useState<string>("");
  const [priceOverridden, setPriceOverridden] = useState(false);

  const effectiveServicePrice = priceOverridden && customServicePrice
    ? Number.parseFloat(customServicePrice) || 0
    : calculated.subtotal;
  const effectiveTransport = priceOverridden && customTransportCost
    ? Number.parseFloat(customTransportCost) || 0
    : calculated.transport;
  const effectiveNightShift = priceOverridden && customNightShiftCost
    ? Number.parseFloat(customNightShiftCost) || 0
    : calculated.nightShift;
  const effectiveTotal = effectiveServicePrice + effectiveTransport + effectiveNightShift;

  const onSubmit = (data: FormData) => {
    const selectionMap = (data.selectedServices || []).reduce<Record<string, number>>((acc, s) => {
      if (s.id && !s.id.startsWith("_custom_")) acc[s.id] = s.quantity;
      return acc;
    }, {});
    const validation = validateSelection(selectionMap, servicesList || []);
    if (validation) {
      toast.error(validation.message);
      if (validation.suggestion) toast.error(validation.suggestion);
      return;
    }

    if (data.documentType === "PE") {
      const peError = validatePEFields(data.clientPhone, data.clientDocument);
      if (peError) {
        toast.error(peError);
        return;
      }
    }

    if (!data.date || !data.timeSlot) {
      toast.error("Selecciona fecha y horario");
      return;
    }

    const serviceNames = (data.selectedServices || [])
      .map((s) => {
        if ("_customName" in s && s._customName) {
          return `${s._customName}${s.quantity > 1 ? ` x${s.quantity}` : ""}`;
        }
        const svc = servicesList?.find((x: ServiceData) => x.id === s.id);
        return svc ? `${svc.name}${s.quantity > 1 ? ` x${s.quantity}` : ""}` : "";
      })
      .filter(Boolean)
      .join(", ");

    const dateStr = format(data.date, "yyyy-MM-dd");

    const sanitizePrice = (v: number) => (Number.isFinite(v) ? v : 0);

    const payload = {
      clientName: data.clientName.trim(),
      clientEmail: data.clientEmail.trim(),
      clientPhone: data.clientPhone.trim(),
      clientDocument: data.clientDocument.trim() || undefined,
      documentType: data.documentType,
      serviceType: serviceNames || "Servicio",
      appointmentDate: dateStr,
      appointmentTime: data.timeSlot.trim(),
      status: data.status,
      duration: calculated.duration || 120,
      locationType: data.locationType,
      district: data.locationType === "HOME" ? data.district.trim() || undefined : undefined,
      address: data.locationType === "HOME" ? data.address.trim() || undefined : undefined,
      addressReference: data.locationType === "HOME" ? data.addressReference.trim() || undefined : undefined,
      additionalNotes: data.additionalNotes.trim(),
      services: data.selectedServices,
      totalDuration: calculated.duration,
      servicePrice: sanitizePrice(effectiveServicePrice),
      transportCost: sanitizePrice(effectiveTransport),
      nightShiftCost: sanitizePrice(effectiveNightShift),
      totalPrice: sanitizePrice(effectiveTotal),
    };

    const onSuccess = () => {
      toast.success(isEditing ? "Cita actualizada correctamente" : "Cita registrada correctamente");
      reset(buildDefaultValues());
      onClose();
    };

    const onError = (err: Error) => {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar la cita");
    };

    if (isEditing && editingAppointment) {
      updateAppointment.mutate({ id: editingAppointment.id, ...payload }, { onSuccess, onError });
    } else {
      createAppointment.mutate(payload, { onSuccess, onError });
    }
  };

  const isPending = createAppointment.isPending || updateAppointment.isPending;

  return (
    <Modal open={isOpen} onClose={() => !isPending && onClose()} size="lg" ariaLabelledBy="manual-appointment-title">
      <ModalHeader
        title={
          <span className="text-base font-semibold text-[color:var(--color-heading)]">
            {isEditing ? "Editar cita" : "Nueva cita"}
          </span>
        }
        onClose={() => !isPending && onClose()}
      />
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <div className="space-y-5">
              <div>
                <p className="text-[11px] font-semibold text-[color:var(--color-muted)] uppercase tracking-wider mb-2">Datos de la clienta</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AdminFormField label="Nombre" required>
                    <AdminInput
                      value={watch("clientName")}
                      onChange={(e) => setValue("clientName", e.target.value)}
                      placeholder="Nombre de clienta"
                    />
                  </AdminFormField>
                  <AdminFormField label="Email" required>
                    <AdminInput
                      type="email"
                      value={watch("clientEmail")}
                      onChange={(e) => setValue("clientEmail", e.target.value)}
                      placeholder="cliente@email.com"
                    />
                  </AdminFormField>
                  <AdminFormField label="Tipo doc">
                    <AdminSelect
                      value={watch("documentType")}
                      onChange={(e) => {
                        setValue("documentType", e.target.value as "PE" | "OTHER");
                        if (e.target.value === "OTHER") setValue("clientDocument", "");
                      }}
                    >
                      <option value="PE">Perú (DNI)</option>
                      <option value="OTHER">Otro</option>
                    </AdminSelect>
                  </AdminFormField>
                  {watch("documentType") === "PE" && (
                    <AdminFormField label="Documento">
                      <AdminInput
                        value={watch("clientDocument")}
                        onChange={(e) => setValue("clientDocument", formatDni(e.target.value))}
                        placeholder="12345678"
                        maxLength={8}
                      />
                    </AdminFormField>
                  )}
                  <AdminFormField label="Teléfono" required className="sm:col-span-2">
                    <AdminInput
                      value={watch("clientPhone")}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const docType = watch("documentType");
                        setValue("clientPhone", docType === "PE" ? formatPhonePE(raw) : raw);
                      }}
                      inputMode="tel"
                      placeholder={watch("documentType") === "PE" ? "+51 999 999 999" : "+XX XXX XXX XXXX"}
                    />
                  </AdminFormField>
                </div>
              </div>

              <div className="border-t border-[color:var(--color-border)]" />

              <div>
                <p className="text-[11px] font-semibold text-[color:var(--color-muted)] uppercase tracking-wider mb-2">Ubicación</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AdminFormField label="Tipo">
                    <AdminSelect
                      value={locationType}
                      onChange={(e) => {
                        setValue("locationType", e.target.value as "STUDIO" | "HOME");
                        if (e.target.value === "STUDIO") {
                          setValue("district", "");
                          setValue("address", "");
                          setValue("addressReference", "");
                        }
                      }}
                    >
                      <option value="HOME">A domicilio</option>
                      <option value="STUDIO">Studio</option>
                    </AdminSelect>
                  </AdminFormField>
                  {locationType === "HOME" && (
                    <>
                      <AdminFormField label="Distrito">
                        <DistrictSelector
                          value={district}
                          onChange={(val) => setValue("district", val)}
                        />
                      </AdminFormField>
                      <AdminFormField label="Dirección" className="sm:col-span-2">
                        <AdminInput
                          value={watch("address")}
                          onChange={(e) => setValue("address", e.target.value)}
                          placeholder="Av. Ejemplo 123"
                        />
                      </AdminFormField>
                      <AdminFormField label="Referencia" className="sm:col-span-2">
                        <AdminInput
                          value={watch("addressReference")}
                          onChange={(e) => setValue("addressReference", e.target.value)}
                          placeholder="Frente al parque"
                        />
                      </AdminFormField>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t border-[color:var(--color-border)]" />

              <div>
                <p className="text-[11px] font-semibold text-[color:var(--color-muted)] uppercase tracking-wider mb-2">Servicios</p>
                {groupedServices && Object.keys(groupedServices).length > 0 ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {Object.entries(groupedServices).map(([category, services]) => (
                        <ToggleServiceCategoryGroup
                          key={category}
                          category={category}
                          services={services}
                          fieldName="selectedServices"
                        />
                      ))}
                    </div>

                    {/* Custom services */}
                    {(selectedServices.filter((s) => "_customName" in s && s._customName).length > 0) && (
                      <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 space-y-2">
                        <p className="text-xs font-medium text-[color:var(--color-muted)]">Servicios personalizados</p>
                        {selectedServices.filter((s) => "_customName" in s && s._customName).map((s) => (
                          <div key={s.id} className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-[color:var(--color-heading)]">{s._customName}</span>
                              {s.quantity > 1 && (
                                <span className="text-xs text-[color:var(--color-muted)] ml-1">×{s.quantity}</span>
                              )}
                              {s._customDuration ? (
                                <span className="text-xs text-[color:var(--color-muted)] ml-2">{s._customDuration}min</span>
                              ) : null}
                            </div>
                            <span className="text-sm font-medium text-[color:var(--color-heading)] shrink-0">
                              S/ {((s._customPrice || 0) * (s.quantity || 1)).toFixed(2)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeCustomService(s.id)}
                              className="p-1 rounded-md hover:bg-[color:var(--color-danger)]/10 text-[color:var(--color-muted)] hover:text-[color:var(--color-danger)] transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-end gap-2">
                      <AdminFormField label="Servicio nuevo" className="flex-1">
                        <AdminInput
                          value={customServiceName}
                          onChange={(e) => setCustomServiceName(e.target.value)}
                          placeholder="Nombre del servicio"
                        />
                      </AdminFormField>
                      <AdminFormField label="Precio S/" className="w-24">
                        <AdminInput
                          type="number"
                          min="0"
                          step="0.01"
                          value={customServiceUnitPrice}
                          onChange={(e) => setCustomServiceUnitPrice(e.target.value)}
                          placeholder="0.00"
                        />
                      </AdminFormField>
                      <AdminFormField label="Duración" className="w-24">
                        <AdminInput
                          type="number"
                          min="0"
                          step="5"
                          value={customServiceDuration}
                          onChange={(e) => setCustomServiceDuration(e.target.value)}
                          placeholder="min"
                        />
                      </AdminFormField>
                      <button
                        type="button"
                        onClick={addCustomService}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[color:var(--color-primary)] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Agregar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[color:var(--color-muted)]">Cargando servicios...</p>
                )}
              </div>

              <div className="border-t border-[color:var(--color-border)]" />

              <div>
                <p className="text-[11px] font-semibold text-[color:var(--color-muted)] uppercase tracking-wider mb-2">Fecha y horario</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Calendar
                    mode="single"
                    locale={es}
                    selected={date ?? undefined}
                    onSelect={(d) => {
                      if (d) {
                        setValue("date", d);
                        setValue("timeSlot", "");
                      }
                    }}
                    month={selectedMonth}
                    onMonthChange={setSelectedMonth}
                    required
                    className="mx-auto w-full max-w-[300px] rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-2"
                    classNames={{
                      caption_label: "text-sm font-semibold capitalize text-[color:var(--color-heading)]",
                      weekday: "text-xs font-semibold text-[color:var(--color-muted)] w-9",
                      day_button: "h-9 w-9 text-sm font-medium text-[color:var(--color-heading)]",
                      disabled: "h-9 w-9 text-sm font-medium text-[color:var(--calendar-inactive)] opacity-50",
                      outside: "h-9 w-9 text-sm font-medium text-[color:var(--calendar-inactive)] opacity-60",
                    }}
                  />

                  <div>
                    <p className="text-xs font-medium text-[color:var(--color-muted)] mb-2">
                      {date ? format(date, "dd MMM yyyy", { locale: es }) : "Selecciona una fecha"}
                    </p>
                    {slotsLoading ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-8 bg-[color:var(--color-surface)] rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : rangesData?.availableRanges?.length ? (
                      <div className="grid grid-cols-2 gap-1.5">
                        {rangesData.availableRanges.map((r: string) => {
                          const isSelected = timeSlot === r;
                          return (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setValue("timeSlot", r)}
                              className={`flex items-center justify-center px-2 py-1.5 rounded-lg transition-colors text-xs font-medium ${
                                isSelected
                                  ? "bg-[color:var(--color-primary)] text-white"
                                  : "bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]/50"
                              }`}
                            >
                              {r}
                            </button>
                          );
                        })}
                      </div>
                    ) : date ? (
                      <p className="text-xs text-[color:var(--color-body)]">No hay horarios disponibles para esta fecha.</p>
                    ) : (
                      <p className="text-xs text-[color:var(--color-body)]">Selecciona servicios, fecha y ubicación para ver horarios.</p>
                    )}
                    {date && timeSlot && (
                      <div className="mt-2 p-2 bg-[color:var(--color-primary)]/10 rounded-lg flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
                        <span className="text-xs font-medium text-[color:var(--color-heading)]">
                          {format(date, "dd MMM", { locale: es })} &middot; {timeSlot}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-[color:var(--color-border)]" />

              <div>
                <p className="text-[11px] font-semibold text-[color:var(--color-muted)] uppercase tracking-wider mb-2">Resumen y estado</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AdminFormField label="Estado">
                    <AdminSelect
                      value={formStatus}
                      onChange={(e) => setValue("status", e.target.value as FormData["status"])}
                    >
                      <option value="PENDING">Pendiente</option>
                      <option value="CONFIRMED">Confirmada</option>
                      <option value="COMPLETED">Completada</option>
                      <option value="CANCELLED">Cancelada</option>
                    </AdminSelect>
                  </AdminFormField>
                  <div className="sm:col-span-2 space-y-2">
                    <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] p-3 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[color:var(--color-muted)]">
                          Costos {priceOverridden ? "(personalizados)" : "(calculados automáticamente)"}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (!priceOverridden) {
                              setCustomServicePrice(calculated.subtotal > 0 ? String(calculated.subtotal) : "");
                              setCustomTransportCost(calculated.transport > 0 ? String(calculated.transport) : "");
                              setCustomNightShiftCost(calculated.nightShift > 0 ? String(calculated.nightShift) : "");
                            }
                            setPriceOverridden(!priceOverridden);
                          }}
                          className="text-[10px] text-[color:var(--color-primary)] hover:underline"
                        >
                          {priceOverridden ? "Usar calculados" : "Personalizar"}
                        </button>
                      </div>

                      {priceOverridden ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <AdminFormField label="Servicios (S/)">
                            <AdminInput
                              type="number"
                              min="0"
                              step="0.01"
                              value={customServicePrice}
                              onChange={(e) => setCustomServicePrice(e.target.value)}
                              inputMode="decimal"
                              placeholder={calculated.subtotal.toFixed(2)}
                            />
                          </AdminFormField>
                          <AdminFormField label="Movilidad (S/)">
                            <AdminInput
                              type="number"
                              min="0"
                              step="0.01"
                              value={customTransportCost}
                              onChange={(e) => setCustomTransportCost(e.target.value)}
                              inputMode="decimal"
                              placeholder={calculated.transport.toFixed(2)}
                            />
                          </AdminFormField>
                          <AdminFormField label="Nocturno (S/)">
                            <AdminInput
                              type="number"
                              min="0"
                              step="0.01"
                              value={customNightShiftCost}
                              onChange={(e) => setCustomNightShiftCost(e.target.value)}
                              inputMode="decimal"
                              placeholder={calculated.nightShift.toFixed(2)}
                            />
                          </AdminFormField>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-[color:var(--color-muted)]">Servicios</span>
                            <span className="text-[color:var(--color-heading)]">S/ {calculated.subtotal.toFixed(2)}</span>
                          </div>
                          {locationType === "HOME" && (
                            <div className="flex justify-between">
                              <span className="text-[color:var(--color-muted)]">Movilidad</span>
                              <span className="text-[color:var(--color-heading)]">
                                {transportLoading ? (
                                  <span className="text-[color:var(--color-muted)] text-[10px]">Calculando...</span>
                                ) : (
                                  <>S/ {calculated.transport.toFixed(2)}</>
                                )}
                              </span>
                            </div>
                          )}
                          {calculated.nightShift > 0 && (
                            <div className="flex justify-between">
                              <span className="text-[color:var(--color-muted)]">Recargo nocturno</span>
                              <span className="text-[color:var(--color-heading)]">S/ {calculated.nightShift.toFixed(2)}</span>
                            </div>
                          )}
                        </>
                      )}

                      <div className="flex justify-between pt-1.5 border-t border-[color:var(--color-border)]">
                        <span className="font-semibold text-[color:var(--color-heading)]">Total</span>
                        <span className="font-semibold text-[color:var(--color-heading)]">S/ {effectiveTotal.toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] text-[color:var(--color-muted)] pt-1">
                        Duración total: {calculated.duration} min
                        {calculated.transport > 0 && " · Incluye movilidad"}
                        {calculated.nightShift > 0 && " · Incluye recargo nocturno"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <AdminFormField label="Notas adicionales">
                <AdminTextarea
                  value={watch("additionalNotes")}
                  onChange={(e) => setValue("additionalNotes", e.target.value)}
                  placeholder="Notas sobre la cita"
                />
              </AdminFormField>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="w-full flex flex-col sm:flex-row items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                className="w-full sm:flex-1"
                onClick={() => !isPending && onClose()}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full sm:flex-1"
                disabled={isPending}
              >
                {isPending ? "Guardando..." : isEditing ? "Guardar cambios" : "Registrar cita"}
              </Button>
            </div>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  );
}
