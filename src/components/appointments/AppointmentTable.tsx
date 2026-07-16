"use client";
import { useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Link,
  Mail,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import StatusBadge from "@/components/appointments/StatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  type Appointment,
  useDeleteAppointment,
  useSendAppointmentEmail,
  useUpdateAppointmentStatus,
} from "@/hooks/useAppointments";
import { useIsSmallMobile } from "@/hooks/useMediaQuery";
import {
  formatDate,
  formatPrice,
  formatServices,
  formatTime,
  getPriceBreakdown,
} from "@/utils/appointmentHelpers";
import { copyReviewLink } from "@/utils/reviewHelpers";

// ponytail: inline wa link builder to avoid extra import
function buildWaLink(a: Appointment) {
  const svc = formatServices(a).map((s) => s.displayText).join(", ");
  const phone = (a.clientPhone || "").replace(/\D/g, "").slice(-9);
  const text = [
    `💄 *${a.clientName}*`,
    `📅 ${formatDate(a.appointmentDate)} · ${formatTime(a.appointmentTime)}`,
    `💄 ${svc}`,
    a.additionalNotes ? `📝 ${a.additionalNotes}` : "",
  ].filter(Boolean).join("\n");
  return `https://wa.me/51${phone}?text=${encodeURIComponent(text)}`;
}

interface AppointmentTableProps {
  appointments: Appointment[];
  highlightedId?: string;
  onViewDetails: (appointment: Appointment) => void;
  onEdit: (appointment: Appointment) => void;
}

function ActionsMenu({
  appointment,
  onStatusUpdate,
  onViewDetails,
  onEdit,
  onSendEmail,
  onDelete,
  isUpdating,
  isSendingEmail,
}: {
  appointment: Appointment;
  onStatusUpdate: (id: string, status: Appointment["status"]) => void;
  onViewDetails: (appointment: Appointment) => void;
  onEdit: (appointment: Appointment) => void;
  onSendEmail: (id: string) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isSendingEmail: boolean;
}) {
  const [open, setOpen] = useState(false);

  const items: { label: string; icon: React.ReactNode; onClick: () => void; danger?: boolean }[] = [];

  if (appointment.status === "PENDING") {
    items.push({
      label: "Cancelar",
      icon: <XCircle className="w-3.5 h-3.5" />,
      onClick: () => { onStatusUpdate(appointment.id, "CANCELLED"); setOpen(false); },
      danger: true,
    });
  }
  items.push(
    {
      label: "Ver detalles",
      icon: <Eye className="w-3.5 h-3.5" />,
      onClick: () => { onViewDetails(appointment); setOpen(false); },
    },
    {
      label: "Editar",
      icon: <Pencil className="w-3.5 h-3.5" />,
      onClick: () => { onEdit(appointment); setOpen(false); },
    },
    {
      label: "Enviar email",
      icon: <Mail className="w-3.5 h-3.5" />,
      onClick: () => { onSendEmail(appointment.id); setOpen(false); },
    },
  );
  if (appointment.review?.reviewToken) {
    items.push({
      label: "Link de reseña",
      icon: <Link className="w-3.5 h-3.5" />,
      onClick: () => { copyReviewLink(appointment.review!.reviewToken); setOpen(false); },
    });
  }
  items.push({
    label: "Eliminar",
    icon: <Trash2 className="w-3.5 h-3.5" />,
    onClick: () => { onDelete(appointment.id); setOpen(false); },
    danger: true,
  });

  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              aria-label="Más acciones"
              onClick={() => setOpen(!open)}
              variant="ghost"
              size="icon-sm"
            />
          }
        >
          <MoreHorizontal className="w-4 h-4 text-[color:var(--color-muted)]" />
        </TooltipTrigger>
        <TooltipContent>Más</TooltipContent>
      </Tooltip>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-44 bg-[color:var(--color-surface)] rounded-lg shadow-lg border border-[color:var(--color-border)] z-50 overflow-hidden">
            {items.map((item) => (
              <button key={item.label}
                onClick={item.onClick}
                disabled={(item.label === "Cancelar" || item.label === "Reabrir") && isUpdating}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-[color:var(--color-surface-elevated)] ${
                  item.danger ? "text-[color:var(--color-danger)]" : "text-[color:var(--color-body)]"
                }`}>
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ActionButton({
  tooltip,
  onClick,
  disabled,
  children,
}: {
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            aria-label={tooltip}
            disabled={disabled}
            onClick={onClick}
            variant="ghost"
            size="icon-sm"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

function MobileAppointmentCard({
  appointment,
  isHighlighted,
  onStatusUpdate,
  onDelete,
  onViewDetails,
  onEdit,
  onSendEmail,
  isUpdating,
  isDeleting,
  isSendingEmail,
}: {
  appointment: Appointment;
  isHighlighted: boolean;
  onStatusUpdate: (id: string, status: Appointment["status"]) => void;
  onDelete: (id: string) => void;
  onViewDetails: (appointment: Appointment) => void;
  onEdit: (appointment: Appointment) => void;
  onSendEmail: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  isSendingEmail: boolean;
}) {
  const priceInfo = getPriceBreakdown(appointment);
  const servicesLabel = formatServices(appointment)
    .map((s) => s.displayText)
    .join(", ");
  const isStudio = (appointment.location || "").toLowerCase().includes("studio");

  return (
    <div
      id={`appointment-${appointment.id}`}
      className={`bg-[color:var(--color-surface)] rounded-xl border shadow-sm transition-all duration-200 overflow-hidden mb-4 last:mb-0 ${
        isHighlighted
          ? "border-[color:var(--color-primary)]/60 ring-2 ring-[color:var(--color-primary)]/30"
          : "border-[color:var(--color-border)]"
      }`}
    >
      <div
        className={`px-4 py-3 border-b ${
          isHighlighted
            ? "border-[color:var(--color-primary)]/30 bg-[color:var(--color-primary)]/5"
            : "border-[color:var(--color-border)]/60 bg-[color:var(--color-surface-elevated)]/50"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
              <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-[color:var(--color-accent-soft)] text-[color:var(--color-muted)] text-xs">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[color:var(--color-heading)] text-sm truncate max-w-[50vw]">
                  {appointment.clientName}
                </span>
                {isHighlighted && (
                  <span className="text-[10px] text-[color:var(--color-muted)]">Destacada</span>
                )}
              </div>
              <span className="text-xs text-[color:var(--color-muted)] line-clamp-1">
                {servicesLabel}
              </span>
            </div>
          </div>
          <StatusBadge status={appointment.status} className="shrink-0" />
        </div>
      </div>

      <div className="px-4 py-3 space-y-2">
        <div className="grid grid-cols-2 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[color:var(--color-muted)]" />
            <span className="text-[color:var(--color-body)]">
              {formatDate(appointment.appointmentDate)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[color:var(--color-muted)]" />
            <span className="text-[color:var(--color-body)]">
              {formatTime(appointment.appointmentTime)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[color:var(--color-muted)]" />
            <span className="text-[color:var(--color-body)]">
              {isStudio ? "Studio" : "A domicilio"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[color:var(--color-muted)]">Total</span>
            <span className="font-medium text-[color:var(--color-heading)]">
              {priceInfo.totalPrice > 0 ? formatPrice(priceInfo.totalPrice) : "-"}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-2.5 border-t border-[color:var(--color-border)]/50 bg-[color:var(--color-surface-elevated)]/30 flex gap-2">
        {appointment.status === "PENDING" && (
          <>
            <Button
              onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
              disabled={isUpdating}
              variant="outline"
              size="sm"
              type="button"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Confirmar
            </Button>
            <ActionButton
              tooltip="Cancelar"
              onClick={() => onStatusUpdate(appointment.id, "CANCELLED")}
              disabled={isUpdating}
            >
              <XCircle className="w-3.5 h-3.5" />
            </ActionButton>
          </>
        )}
        {appointment.status === "CONFIRMED" && (
          <>
            <Button
              onClick={() => onStatusUpdate(appointment.id, "COMPLETED")}
              disabled={isUpdating}
              variant="outline"
              size="sm"
              type="button"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Completada
            </Button>
            <ActionButton
              tooltip="Copiar link de reseña"
              onClick={() =>
                appointment.review?.reviewToken && copyReviewLink(appointment.review.reviewToken)
              }
            >
              <Link className="w-3.5 h-3.5" />
            </ActionButton>
          </>
        )}
        {(appointment.status === "COMPLETED" || appointment.status === "CANCELLED") && (
          <>
            <Button
              onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
              disabled={isUpdating}
              variant="outline"
              size="sm"
              type="button"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reabrir
            </Button>
            {appointment.status === "COMPLETED" && (
              <ActionButton
                tooltip="Copiar link de reseña"
                onClick={() =>
                  appointment.review?.reviewToken && copyReviewLink(appointment.review.reviewToken)
                }
              >
                <Link className="w-3.5 h-3.5" />
              </ActionButton>
            )}
          </>
        )}

        <ActionButton tooltip="Ver detalles" onClick={() => onViewDetails(appointment)}>
          <Eye className="w-3.5 h-3.5" />
        </ActionButton>
        <ActionButton tooltip="Editar" onClick={() => onEdit(appointment)}>
          <Pencil className="w-3.5 h-3.5" />
        </ActionButton>
        <ActionButton
          tooltip="Enviar email"
          onClick={() => onSendEmail(appointment.id)}
          disabled={isSendingEmail}
        >
          <Mail className="w-3.5 h-3.5" />
        </ActionButton>
        <a
          href={buildWaLink(appointment)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
          title="WhatsApp"
          aria-label="Enviar WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </a>
        <ActionButton
          tooltip="Eliminar"
          onClick={() => onDelete(appointment.id)}
          disabled={isDeleting}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </ActionButton>
      </div>
    </div>
  );
}

function AppointmentRow({
  appointment,
  isHighlighted,
  onStatusUpdate,
  onDelete,
  onViewDetails,
  onEdit,
  onSendEmail,
  isUpdating,
  isDeleting,
  isSendingEmail,
}: {
  appointment: Appointment;
  isHighlighted: boolean;
  onStatusUpdate: (id: string, status: Appointment["status"]) => void;
  onDelete: (id: string) => void;
  onViewDetails: (appointment: Appointment) => void;
  onEdit: (appointment: Appointment) => void;
  onSendEmail: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  isSendingEmail: boolean;
}) {
  const priceInfo = getPriceBreakdown(appointment);
  const serviceLabel = formatServices(appointment)
    .map((s) => s.displayText)
    .join(", ");

  return (
    <TableRow
      id={`appointment-${appointment.id}`}
      className={
        isHighlighted
          ? "bg-[color:var(--color-primary)]/8 ring-2 ring-inset ring-[color:var(--color-primary)]/30"
          : "hover:bg-[color:var(--color-accent-soft)]/50 transition-colors"
      }
    >
      <TableCell className="px-3 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-[color:var(--color-accent-soft)] text-[color:var(--color-muted)] text-xs">
              <User className="w-3.5 h-3.5" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="text-sm font-medium text-[color:var(--color-heading)] truncate max-w-[24vw]">
              {appointment.clientName}
            </div>
            {isHighlighted && (
              <span className="text-[10px] text-[color:var(--color-muted)]">Destacada</span>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="px-3 py-3">
        <div className="text-sm text-[color:var(--color-body)] truncate max-w-[20vw]">
          {serviceLabel}
        </div>
        {appointment.district && (
          <div className="text-xs text-[color:var(--color-muted)] mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {appointment.district}
          </div>
        )}
      </TableCell>
      <TableCell className="px-3 py-3 whitespace-normal">
        <div className="flex items-center gap-1.5 text-sm text-[color:var(--color-body)]">
          <Calendar className="w-3.5 h-3.5 text-[color:var(--color-muted)]" />
          {formatDate(appointment.appointmentDate)}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[color:var(--color-muted)] mt-0.5">
          <Clock className="w-3 h-3" />
          {formatTime(appointment.appointmentTime)}
        </div>
      </TableCell>
      <TableCell className="px-3 py-3 whitespace-normal">
        {priceInfo.totalPrice > 0 ? (
          <div>
            <div className="text-sm font-medium text-[color:var(--color-heading)]">
              {formatPrice(priceInfo.totalPrice)}
            </div>
            {(priceInfo.hasTransport || priceInfo.hasNightShift) && (
              <div className="text-xs text-[color:var(--color-muted)] mt-0.5">
                +{priceInfo.hasTransport && `movilidad ${formatPrice(priceInfo.transportCost)}`}
                {priceInfo.hasTransport && priceInfo.hasNightShift && " · "}
                {priceInfo.hasNightShift && `nocturno ${formatPrice(priceInfo.nightShiftCost)}`}
              </div>
            )}
          </div>
        ) : (
          <span className="text-sm text-[color:var(--color-muted)]">—</span>
        )}
      </TableCell>
      <TableCell className="px-3 py-3">
        <div className="flex items-center gap-1.5">
          <StatusBadge status={appointment.status} />
        </div>
      </TableCell>
      <TableCell className="px-3 py-3">
        <div className="flex items-center gap-1">
          {appointment.status === "PENDING" && (
            <ActionButton
              tooltip="Confirmar"
              onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
              disabled={isUpdating}
            >
              <CheckCircle className="w-4 h-4 text-[color:var(--color-muted)]" />
            </ActionButton>
          )}
          {appointment.status === "CONFIRMED" && (
            <ActionButton
              tooltip="Completar"
              onClick={() => onStatusUpdate(appointment.id, "COMPLETED")}
              disabled={isUpdating}
            >
              <CheckCircle className="w-4 h-4 text-[color:var(--color-muted)]" />
            </ActionButton>
          )}
          {(appointment.status === "COMPLETED" || appointment.status === "CANCELLED") && (
            <ActionButton
              tooltip="Reabrir"
              onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
              disabled={isUpdating}
            >
              <RotateCcw className="w-4 h-4 text-[color:var(--color-muted)]" />
            </ActionButton>
          )}
          <a
            href={buildWaLink(appointment)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
            title="WhatsApp"
            aria-label="Enviar WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <ActionsMenu
            appointment={appointment}
            onStatusUpdate={onStatusUpdate}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onSendEmail={onSendEmail}
            onDelete={onDelete}
            isUpdating={isUpdating}
            isSendingEmail={isSendingEmail}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function AppointmentTable({
  appointments,
  highlightedId,
  onViewDetails,
  onEdit,
}: AppointmentTableProps) {
  const updateStatusMutation = useUpdateAppointmentStatus();
  const deleteMutation = useDeleteAppointment();
  const sendEmailMutation = useSendAppointmentEmail();
  const isMobile = useIsSmallMobile();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [emailConfirmId, setEmailConfirmId] = useState<string | null>(null);

  const handleStatusUpdate = (id: string, status: Appointment["status"]) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleSendEmail = (id: string) => {
    setEmailConfirmId(id);
  };

  let content: React.ReactNode = null;

  if (appointments && appointments.length > 0) {
    if (isMobile) {
      content = (
        <div>
          {appointments.map((appointment) => (
            <MobileAppointmentCard
              key={appointment.id}
              appointment={appointment}
              isHighlighted={appointment.id === highlightedId}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onSendEmail={handleSendEmail}
              isUpdating={updateStatusMutation.isPending}
              isDeleting={deleteMutation.isPending}
              isSendingEmail={sendEmailMutation.isPending}
            />
          ))}
        </div>
      );
    } else {
      content = (
        <div className="rounded-xl border border-[color:var(--color-border)] overflow-hidden bg-[color:var(--color-surface)] shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[color:var(--color-border)] hover:bg-transparent">
                <TableHead className="px-3 py-3 text-[color:var(--color-muted)] uppercase tracking-wider text-xs font-semibold">
                  Cliente
                </TableHead>
                <TableHead className="px-3 py-3 text-[color:var(--color-muted)] uppercase tracking-wider text-xs font-semibold">
                  Servicio
                </TableHead>
                <TableHead className="px-3 py-3 text-[color:var(--color-muted)] uppercase tracking-wider text-xs font-semibold">
                  Fecha & Hora
                </TableHead>
                <TableHead className="px-3 py-3 text-[color:var(--color-muted)] uppercase tracking-wider text-xs font-semibold">
                  Precio
                </TableHead>
                <TableHead className="px-3 py-3 text-[color:var(--color-muted)] uppercase tracking-wider text-xs font-semibold">
                  Estado
                </TableHead>
                <TableHead className="px-3 py-3 text-[color:var(--color-muted)] uppercase tracking-wider text-xs font-semibold">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  isHighlighted={appointment.id === highlightedId}
                  onStatusUpdate={handleStatusUpdate}
                  onDelete={handleDelete}
                  onViewDetails={onViewDetails}
                  onEdit={onEdit}
                  onSendEmail={handleSendEmail}
                  isUpdating={updateStatusMutation.isPending}
                  isDeleting={deleteMutation.isPending}
                  isSendingEmail={sendEmailMutation.isPending}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }
  }

  return (
    <>
      {content}
      <ConfirmModal
        open={!!deleteConfirmId}
        title="Eliminar cita"
        description="¿Estás segura de que quieres eliminar esta cita? Esta acción no se puede deshacer."
        confirmText={deleteMutation.isPending ? "Eliminando..." : "Confirmar eliminación"}
        cancelText="Cancelar"
        destructive
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteMutation.mutate(deleteConfirmId, {
              onSuccess: () => {
                toast.success("Cita eliminada");
                setDeleteConfirmId(null);
              },
              onError: (err) => {
                toast.error(err instanceof Error ? err.message : "No se pudo eliminar la cita");
              },
            });
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
      <ConfirmModal
        open={!!emailConfirmId}
        title="Enviar email a la clienta"
        description="Se enviará un correo con los detalles de la cita según su estado actual. ¿Deseas continuar?"
        confirmText={sendEmailMutation.isPending ? "Enviando..." : "Enviar email"}
        cancelText="Cancelar"
        onConfirm={() => {
          if (emailConfirmId) {
            sendEmailMutation.mutate(emailConfirmId, {
              onSuccess: () => {
                toast.success("Email enviado correctamente");
                setEmailConfirmId(null);
              },
              onError: (err) => {
                toast.error(err instanceof Error ? err.message : "No se pudo enviar el email");
              },
            });
          }
        }}
        onCancel={() => setEmailConfirmId(null)}
      />
    </>
  );
}
