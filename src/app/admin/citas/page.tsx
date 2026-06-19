"use client";

import { useQuery } from "@tanstack/react-query";
import { addDays, endOfMonth, format as dfFormat, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import ManualAppointmentModal from "@/components/appointments/ManualAppointmentModal";
import StatusBadge from "@/components/appointments/StatusBadge";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  type Appointment,
  useDeleteAppointment,
  useSendAppointmentEmail,
  useUpdateAppointmentStatus,
} from "@/hooks/useAppointments";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import {
  formatDate,
  formatPrice,
  formatServices,
  formatTime,
  getPriceBreakdown,
} from "@/utils/appointmentHelpers";
import { copyReviewLink } from "@/utils/reviewHelpers";

function getDateRange(period: string) {
  const now = new Date();
  const fmt = (d: Date) => dfFormat(d, "yyyy-MM-dd");
  if (period === "today") return { dateStart: fmt(now), dateEnd: fmt(now) };
  if (period === "week") return { dateStart: fmt(now), dateEnd: fmt(addDays(now, 7)) };
  if (period === "month") return { dateStart: fmt(now), dateEnd: fmt(endOfMonth(now)) };
  return null;
}

function groupByDate(apps: Appointment[]) {
  const map = new Map<string, Appointment[]>();
  for (const a of apps) {
    const key = dfFormat(new Date(a.appointmentDate), "yyyy-MM-dd");
    const g = map.get(key) || [];
    g.push(a);
    map.set(key, g);
  }
  return [...map.entries()].sort(([a], [b]) => b.localeCompare(a));
}

function buildWaLink(a: Appointment) {
  const p = getPriceBreakdown(a);
  const svc = formatServices(a).map((s) => s.displayText).join(", ");
  const phone = (a.clientPhone || "").replace(/\D/g, "");
  const text = [
    `💄 *${a.clientName}*`,
    `📅 ${formatDate(a.appointmentDate)} · ${formatTime(a.appointmentTime)}`,
    `💄 ${svc}`,
    `💰 Total: ${formatPrice(p.totalPrice)}`,
    (a.locationType || "").toUpperCase() === "STUDIO"
      ? "📍 Studio — Av. Bolívar 1073, Pueblo Libre"
      : `📍 ${[a.address, a.district].filter(Boolean).join(", ")}`,
    a.additionalNotes ? `📝 ${a.additionalNotes}` : "",
  ].filter(Boolean).join("\n");
  return `https://wa.me/51${phone.slice(-9)}?text=${encodeURIComponent(text)}`;
}

const DATE_TABS = [
  { k: "today", l: "Hoy" },
  { k: "week", l: "Semana" },
  { k: "month", l: "Mes" },
  { k: "all", l: "Todas" },
] as const;

const STATUS_OPTS = [
  { k: "all", l: "Todas" },
  { k: "PENDING", l: "Pendientes" },
  { k: "CONFIRMED", l: "Confirmadas" },
  { k: "COMPLETED", l: "Completadas" },
  { k: "CANCELLED", l: "Canceladas" },
] as const;

function CitasContent() {
  const [period, setPeriod] = useState("today");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selId, setSelId] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [emailId, setEmailId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const { data: stats } = useDashboardStats();
  const upd = useUpdateAppointmentStatus();
  const del = useDeleteAppointment();
  const mail = useSendAppointmentEmail();

  const range = getDateRange(period);
  const qp = useMemo(() => {
    const p: Record<string, string> = { page: String(page), limit: "50" };
    if (status !== "all") p.status = status;
    if (search) p.search = search;
    if (range) { p.dateStart = range.dateStart; p.dateEnd = range.dateEnd; }
    return p;
  }, [page, status, search, range]);

  const { data, isLoading } = useQuery({
    queryKey: ["appointments", "citas", qp],
    queryFn: async () => {
      const res = await fetch(`/api/admin/appointments?${new URLSearchParams(qp)}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json.data as { appointments: Appointment[]; pagination: { page: number; limit: number; total: number; pages: number } };
    },
    staleTime: 60_000,
  });

  const apps: Appointment[] = data?.appointments || [];
  const pag = data?.pagination;
  const grouped = useMemo(() => groupByDate(apps), [apps]);
  const selAppt = apps.find((a) => a.id === selId) || null;

  const toggleExpand = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const onStatus = (id: string, s: Appointment["status"]) => upd.mutate({ id, status: s });
  const onDelete = (id: string) => del.mutate(id, { onSuccess: () => { toast.success("Eliminada"); setSelId(null); }, onError: (e) => toast.error(e.message) });
  const doEmail = () => { if (emailId) mail.mutate(emailId, { onSuccess: () => { toast.success("Email enviado"); setEmailId(null); }, onError: (e) => toast.error(e.message) }); };
  const onEdit = (a: Appointment) => { setEditing(a); setShowManual(true); };
  const onNew = () => { setEditing(null); setShowManual(true); };

  const pen = apps.filter((a) => a.status === "PENDING").length;
  const conf = apps.filter((a) => a.status === "CONFIRMED").length;
  const todayN = apps.filter((a) => isSameDay(new Date(a.appointmentDate), new Date())).length;
  const rev = apps.filter((a) => a.status === "COMPLETED").reduce((s, a) => s + (a.totalPrice || 0), 0);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="shrink-0 space-y-2 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {DATE_TABS.map((t) => (
              <button key={t.k} onClick={() => { setPeriod(t.k); setPage(1); }}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${period === t.k ? "bg-[color:var(--color-primary)] text-white" : "text-[color:var(--color-muted)] hover:bg-[color:var(--color-surface-elevated)]"}`}>
                {t.l}
              </button>
            ))}
          </div>
          <Button variant="primary" size="sm" onClick={onNew}>
            <Plus className="w-3.5 h-3.5" /> Nueva
          </Button>
        </div>

        {/* Stats pills */}
        <div className="flex items-center gap-2 flex-wrap text-[11px]">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[color:var(--color-surface-elevated)] text-[color:var(--color-muted)]">
            <Calendar className="w-3 h-3" /> <strong className="text-[color:var(--color-heading)]">{todayN}</strong> hoy
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]">
            <Clock className="w-3 h-3" /> <strong>{pen}</strong> pend
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]">
            <CheckCircle2 className="w-3 h-3" /> <strong>{conf}</strong> conf
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]">
            S/ <strong>{new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 }).format(rev)}</strong> mes
          </span>
          {pag && <span className="text-[color:var(--color-muted)]">{pag.total} total</span>}
        </div>

        {/* Search + status */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[color:var(--color-muted)]" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar cliente o servicio..."
              className="w-full pl-8 pr-6 py-1.5 text-xs rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] focus:outline-none focus:ring-1 focus:ring-[color:var(--color-primary)]" />
            {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2"><X className="w-3 h-3 text-[color:var(--color-muted)]" /></button>}
          </div>
          <div className="flex gap-0.5 overflow-x-auto scrollbar-none -mr-2 pr-2">
            {STATUS_OPTS.map((t) => (
              <button key={t.k} onClick={() => { setStatus(t.k); setPage(1); }}
                className={`shrink-0 px-2 py-1 text-[11px] font-medium rounded-md border transition-colors ${status === t.k ? "bg-[color:var(--color-surface-elevated)] border-[color:var(--color-border)] text-[color:var(--color-heading)]" : "border-transparent text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)]"}`}>
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main: list + detail */}
      <div className="flex-1 flex gap-0 min-h-0">
        {/* List */}
        <div className={`flex-1 min-w-0 overflow-y-auto ${selAppt ? "hidden lg:block lg:w-[55%] lg:flex-none lg:border-r lg:border-[color:var(--color-border)] lg:pr-3" : ""}`}>
          {isLoading ? (
            <div className="py-16 text-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[color:var(--color-primary)] mx-auto" /></div>
          ) : apps.length === 0 ? (
            <div className="py-16 text-center text-sm text-[color:var(--color-muted)]">
              {period !== "all" ? "Sin citas en este período" : "Sin citas"}
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {grouped.map(([dk, dayApps]) => {
                const isOpen = !expanded.has(dk);
                return (
                  <div key={dk}>
                    <button onClick={() => toggleExpand(dk)}
                      className="w-full flex items-center gap-2 text-left py-1 px-1 rounded-md hover:bg-[color:var(--color-surface-elevated)]/50">
                      <ChevronDown className={`w-3 h-3 text-[color:var(--color-muted)] transition-transform ${!isOpen ? "-rotate-90" : ""}`} />
                      <Calendar className="w-3 h-3 text-[color:var(--color-primary)]" />
                      <span className="text-[11px] font-semibold text-[color:var(--color-muted)] uppercase">
                        {dfFormat(new Date(`${dk}T12:00:00`), "EEE d MMM", { locale: es })}
                      </span>
                      <span className="text-[10px] text-[color:var(--color-muted)] bg-[color:var(--color-surface-elevated)] px-1.5 py-0.5 rounded-full ml-auto">{dayApps.length}</span>
                    </button>
                    {isOpen && (
                      <div className="ml-5 space-y-0.5 mt-0.5">
                        {dayApps.map((a) => {
                          const active = selId === a.id;
                          const pr = getPriceBreakdown(a);
                          const svc = formatServices(a).map((s) => s.displayText).join(", ");
                          const isStudio = (a.locationType || "").toUpperCase() === "STUDIO";
                          return (
                            <button key={a.id} onClick={() => setSelId(active ? null : a.id)}
                              className={`w-full text-left rounded-lg border transition-all ${active ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5 ring-1 ring-[color:var(--color-primary)]/20" : "border-transparent hover:bg-[color:var(--color-surface-elevated)]"}`}>
                              <div className="px-3 py-2">
                                <div className="text-[11px] font-semibold text-[color:var(--color-primary)] tabular-nums mb-1">
                                  {formatTime(a.appointmentTime).split(" - ")[0]}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-medium text-[color:var(--color-heading)] truncate">{a.clientName}</span>
                                  <StatusBadge status={a.status} className="text-[10px] py-0 px-1.5" />
                                </div>
                                <div className="text-[11px] text-[color:var(--color-muted)] truncate mt-1">
                                  {svc}
                                  {pr.totalPrice > 0 && <span className="ml-1.5 font-medium text-[color:var(--color-heading)]">{formatPrice(pr.totalPrice)}</span>}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              {pag && pag.pages > 1 && (
                <div className="flex justify-center gap-1 pt-2">
                  {Array.from({ length: pag.pages }, (_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)}
                      className={`w-7 h-7 rounded text-xs ${page === i + 1 ? "bg-[color:var(--color-primary)] text-white" : "text-[color:var(--color-muted)] hover:bg-[color:var(--color-surface-elevated)]"}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selAppt && (
          <div className="hidden lg:flex lg:w-[45%] lg:flex-none lg:flex-col lg:pl-3 lg:overflow-y-auto">
            <DetailPanel
              a={selAppt}
              onClose={() => setSelId(null)}
              onEdit={onEdit}
              onStatus={(id, s) => onStatus(id, s)}
              onDelete={(id) => onDelete(id)}
              onEmail={(id) => setEmailId(id)}
              isUpdating={upd.isPending}
              isDeleting={del.isPending}
              isSending={mail.isPending}
            />
          </div>
        )}

        {/* Mobile modal for detail */}
        {selAppt && (
          <div className="fixed inset-0 z-50 lg:hidden bg-[color:var(--color-surface)]">
            <DetailPanel
              a={selAppt}
              onClose={() => setSelId(null)}
              onEdit={onEdit}
              onStatus={(id, s) => onStatus(id, s)}
              onDelete={(id) => onDelete(id)}
              onEmail={(id) => setEmailId(id)}
              isUpdating={upd.isPending}
              isDeleting={del.isPending}
              isSending={mail.isPending}
            />
          </div>
        )}
      </div>

      <ManualAppointmentModal isOpen={showManual} onClose={() => { setShowManual(false); setEditing(null); }} editingAppointment={editing} />
      <ConfirmModal open={!!emailId} title="Enviar email" description="¿Enviar email con los detalles de la cita?" confirmText={mail.isPending ? "Enviando..." : "Enviar"} cancelText="Cancelar" onConfirm={doEmail} onCancel={() => setEmailId(null)} />
    </div>
  );
}

function DetailPanel({ a, onClose, onEdit, onStatus, onDelete, onEmail, isUpdating, isDeleting, isSending }: {
  a: Appointment;
  onClose: () => void;
  onEdit: (a: Appointment) => void;
  onStatus: (id: string, s: Appointment["status"]) => void;
  onDelete: (id: string) => void;
  onEmail: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  isSending: boolean;
}) {
  const pr = getPriceBreakdown(a);
  const svc = formatServices(a);
  const [delOpen, setDelOpen] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copiar texto");
  const [exportLabel, setExportLabel] = useState("Exportar PNG");

  const handleExport = async () => {
    setExportLabel("Exportando...");
    try {
      const { copyQuotePngToClipboard, generateQuotePng } = await import("@/components/share/QuoteShareCard");
      const copied = await copyQuotePngToClipboard({ appointment: a, deposit: 150 });
      if (!copied) {
        const blob = await generateQuotePng({ appointment: a, deposit: 150 });
        if (blob) {
          const url = URL.createObjectURL(blob);
          const el = document.createElement("a");
          el.href = url; el.download = `presupuesto-${a.id}.png`;
          document.body.appendChild(el);
          el.click();
          document.body.removeChild(el);
          URL.revokeObjectURL(url);
          toast.success("Imagen descargada");
        }
      } else {
        toast.success("Imagen copiada al portapapeles");
      }
    } catch { toast.error("No se pudo exportar"); }
    setTimeout(() => setExportLabel("Exportar PNG"), 1800);
  };

  const handleCopyText = async () => {
    setCopyLabel("Copiando...");
    try {
      const { buildQuoteText } = await import("@/components/share/QuoteShareCard");
      await navigator.clipboard.writeText(buildQuoteText({ appointment: a, deposit: 150 }));
      toast.success("Texto copiado");
    } catch { toast.error("No se pudo copiar"); }
    setTimeout(() => setCopyLabel("Copiar texto"), 1800);
  };

  const handleCopyAddress = () => {
    const addr = `${a.address}${a.district ? `, ${a.district}` : ""}, Lima, Perú`;
    navigator.clipboard.writeText(addr);
    toast.success("Dirección copiada");
  };

  const handleOpenMaps = () => {
    const q = encodeURIComponent(`${a.address}${a.district ? `, ${a.district}` : ""}, Lima, Perú`);
    window.open(`https://maps.google.com/maps?q=${q}`, "_blank");
  };

  // ponytail: review status helpers inline
  const reviewStatusColor = (s: string) =>
    s === "APPROVED" ? "bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]"
    : s === "REJECTED" ? "bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)]"
    : "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]";
  const reviewStatusText = (s: string) =>
    s === "APPROVED" ? "Publicada" : s === "REJECTED" ? "Rechazada" : "Pendiente";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between p-3 border-b border-[color:var(--color-border)] shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[color:var(--color-heading)]">{a.clientName}</span>
            <StatusBadge status={a.status} className="text-[10px]" />
          </div>
          <div className="text-xs text-[color:var(--color-muted)] mt-0.5">{formatDate(a.appointmentDate)} · {formatTime(a.appointmentTime)}</div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-[color:var(--color-surface-elevated)]"><X className="w-4 h-4 text-[color:var(--color-muted)]" /></button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
        {/* Contact */}
        <div>
          <p className="text-[10px] font-semibold text-[color:var(--color-muted)] uppercase mb-1">Contacto</p>
          {a.clientEmail && <div className="flex items-center gap-1.5 text-[color:var(--color-body)]"><Mail className="w-3 h-3 text-[color:var(--color-muted)]" />{a.clientEmail}</div>}
          {a.clientPhone && <div className="flex items-center gap-1.5 text-[color:var(--color-body)]"><Phone className="w-3 h-3 text-[color:var(--color-muted)]" />{a.clientPhone}</div>}
          {a.clientDocument && (
            <div className="flex items-center gap-1.5 text-[color:var(--color-body)] mt-0.5">
              <span className="text-[color:var(--color-muted)]">{a.documentType === "PE" ? "DNI" : "Doc"}:</span>
              <span>{a.clientDocument}</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <p className="text-[10px] font-semibold text-[color:var(--color-muted)] uppercase mb-1">Ubicación</p>
          <div className="flex items-start gap-1.5 text-[color:var(--color-body)]">
            <MapPin className="w-3 h-3 text-[color:var(--color-muted)] mt-0.5 shrink-0" />
            <span>{(a.locationType || "").toUpperCase() === "STUDIO" ? "Studio — Av. Bolívar 1073, Pueblo Libre" : [a.address, a.district, a.addressReference ? `Ref: ${a.addressReference}` : ""].filter(Boolean).join(", ")}</span>
          </div>
          {(a.locationType || "").toUpperCase() !== "STUDIO" && a.address && (
            <div className="flex gap-1.5 mt-1.5">
              <Button variant="outline" size="xs" onClick={handleCopyAddress}>Copiar</Button>
              <Button variant="outline" size="xs" onClick={handleOpenMaps}>Maps</Button>
            </div>
          )}
        </div>

        {/* Price */}
        <div>
          <p className="text-[10px] font-semibold text-[color:var(--color-muted)] uppercase mb-1">Costos</p>
          <div className="space-y-0.5">
            {svc.map((s) => (
              <div key={s.name} className="flex justify-between text-[color:var(--color-body)]">
                <span>{s.displayText}</span>
              </div>
            ))}
            <div className="flex justify-between"><span className="text-[color:var(--color-muted)]">Servicios</span><span className="font-medium">{formatPrice(pr.servicePrice)}</span></div>
            {pr.hasTransport && <div className="flex justify-between"><span className="text-[color:var(--color-muted)]">Movilidad</span><span className="font-medium">{formatPrice(pr.transportCost)}</span></div>}
            {pr.hasNightShift && <div className="flex justify-between"><span className="text-[color:var(--color-muted)]">Nocturno</span><span className="font-medium">{formatPrice(pr.nightShiftCost)}</span></div>}
            <div className="flex justify-between border-t border-[color:var(--color-border)] pt-1 font-semibold">
              <span>Total</span>
              <span className="text-[color:var(--color-primary)]">{formatPrice(pr.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {a.additionalNotes ? (
          <div>
            <p className="text-[10px] font-semibold text-[color:var(--color-muted)] uppercase mb-1">Notas</p>
            <p className="text-[color:var(--color-body)] bg-[color:var(--color-surface-elevated)] rounded p-2">{a.additionalNotes.replace(/^\[REGISTRO MANUAL\]\s*/i, "")}</p>
          </div>
        ) : null}

        {/* Review */}
        {a.review && (
          <div>
            <p className="text-[10px] font-semibold text-[color:var(--color-muted)] uppercase mb-1">Reseña</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-medium rounded-full ${reviewStatusColor(a.review.status)}`}>
                  {reviewStatusText(a.review.status)}
                </span>
              </div>
              {a.review.rating && (
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < (a.review?.rating || 0) ? "text-[color:var(--color-primary)] fill-current" : "text-[color:var(--color-border)]"}`} />
                  ))}
                </div>
              )}
              {a.review.reviewText && (
                <p className="text-[color:var(--color-body)] italic bg-[color:var(--color-surface-elevated)] p-2 rounded border border-[color:var(--color-border)]">
                  &ldquo;{a.review.reviewText}&rdquo;
                </p>
              )}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="space-y-0.5 text-[10px] text-[color:var(--color-muted)] border-t border-[color:var(--color-border)]/30 pt-2">
          <p>Creada: {new Date(a.createdAt).toLocaleString("es-ES")}</p>
          <p>Actualizada: {new Date(a.updatedAt).toLocaleString("es-ES")}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-[color:var(--color-border)] p-3 space-y-2 shrink-0">
        {/* Budget tools */}
        <div className="flex gap-1.5">
          <Button variant="outline" size="xs" onClick={handleCopyText} disabled={copyLabel !== "Copiar texto"}>{copyLabel}</Button>
          <Button variant="outline" size="xs" onClick={handleExport} disabled={exportLabel !== "Exportar PNG"}>{exportLabel}</Button>
        </div>

        {/* Status + tools */}
        <div className="flex flex-wrap gap-1.5">
          {a.status === "PENDING" && <>
            <Button variant="primary" size="xs" onClick={() => onStatus(a.id, "CONFIRMED")} disabled={isUpdating}><CheckCircle2 className="w-3 h-3" />Confirmar</Button>
            <Button variant="outline" size="xs" onClick={() => onStatus(a.id, "CANCELLED")} disabled={isUpdating}><XCircle className="w-3 h-3" />Cancelar</Button>
          </>}
          {a.status === "CONFIRMED" && <Button variant="primary" size="xs" onClick={() => onStatus(a.id, "COMPLETED")} disabled={isUpdating}><CheckCircle2 className="w-3 h-3" />Completar</Button>}
          {(a.status === "COMPLETED" || a.status === "CANCELLED") && <Button variant="outline" size="xs" onClick={() => onStatus(a.id, "CONFIRMED")} disabled={isUpdating}><RotateCcw className="w-3 h-3" />Reabrir</Button>}
          <Button variant="ghost" size="xs" onClick={() => onEdit(a)}><Pencil className="w-3 h-3" /></Button>
          <Button variant="ghost" size="xs" onClick={() => onEmail(a.id)} disabled={isSending}><Mail className="w-3 h-3" /></Button>
          <a href={buildWaLink(a)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-2 py-1 rounded text-xs bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20"><MessageCircle className="w-3 h-3" /></a>
          {a.review?.reviewToken ? <Button variant="ghost" size="xs" onClick={() => copyReviewLink(a.review!.reviewToken)}><Star className="w-3 h-3" /></Button> : null}
          <Button variant="ghost" size="xs" onClick={() => setDelOpen(true)} className="ml-auto text-[color:var(--color-danger)]"><Trash2 className="w-3 h-3" /></Button>
        </div>
      </div>

      <ConfirmModal open={delOpen} title="Eliminar cita" description="¿Eliminar esta cita? No se puede deshacer." confirmText="Eliminar" cancelText="Cancelar" destructive onConfirm={() => { onDelete(a.id); setDelOpen(false); }} onCancel={() => setDelOpen(false)} />
    </div>
  );
}

export default function CitasPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[color:var(--color-primary)] mx-auto" /></div>}>
      <CitasContent />
    </Suspense>
  );
}
