"use client";

import { ChevronLeft, ChevronRight, Loader2, Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import type { FinanceEntryDTO, PaymentMethod, ServiceLine } from "@/interfaces/finance";
import type { FinanceEntryType } from "@/interfaces/finance";
import {
  useDeleteFinanceEntry,
  useFinanceEntries,
  useFinanceStats,
  useUpdateFinanceEntry,
} from "@/hooks/useFinance";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 2,
});

const SERVICE_LINE_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "MAKEUP", label: "Maquillaje" },
  { value: "NAILS", label: "Uñas" },
  { value: "HAIR", label: "Peinado" },
  { value: "GENERAL", label: "General" },
] as const;

const TYPE_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "INCOME", label: "Ingresos" },
  { value: "EXPENSE", label: "Egresos" },
] as const;

function serviceLineLabel(value: string) {
  return SERVICE_LINE_OPTIONS.find((item) => item.value === value)?.label ?? value;
}

function paymentLabel(value: string) {
  switch (value) {
    case "YAPE":
      return "Yape";
    case "PLIN":
      return "Plin";
    case "TRANSFER":
      return "Transferencia";
    case "CASH":
      return "Efectivo";
    case "CARD":
      return "Tarjeta";
    default:
      return "Otro";
  }
}

function typeLabel(value: FinanceEntryType) {
  return value === "INCOME" ? "Ingreso" : "Egreso";
}

function sourceLabel(value: string) {
  return value === "PASTE" ? "Pegado" : value === "MANUAL" ? "Manual" : "IA";
}

function toDateInput(iso: string) {
  return iso.slice(0, 10);
}

function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDay(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-PE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function groupByDate(entries: FinanceEntryDTO[]): Array<{ date: string; entries: FinanceEntryDTO[] }> {
  const map = new Map<string, FinanceEntryDTO[]>();
  for (const entry of entries) {
    const key = entry.entryDate.slice(0, 10);
    const group = map.get(key);
    if (group) group.push(entry);
    else map.set(key, [entry]);
  }
  return Array.from(map.entries())
    .map(([date, items]) => ({ date, entries: items }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function dayTotal(entries: FinanceEntryDTO[]) {
  const income = entries.filter((e) => e.type === "INCOME").reduce((s, e) => s + e.amount, 0);
  const expense = entries.filter((e) => e.type === "EXPENSE").reduce((s, e) => s + e.amount, 0);
  return { income, expense, net: income - expense };
}

const PAGE_LIMIT = 30;

export default function AdminFinancePage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState<"" | "INCOME" | "EXPENSE">("");
  const [serviceLine, setServiceLine] = useState<"" | "MAKEUP" | "NAILS" | "HAIR" | "GENERAL">("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const deleteMutation = useDeleteFinanceEntry();
  const updateMutation = useUpdateFinanceEntry();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    type: FinanceEntryType;
    amount: number;
    category: string;
  } | null>(null);
  const [editingEntry, setEditingEntry] = useState<{
    id: string;
    type: FinanceEntryType;
    entryDate: string;
    amount: string;
    category: string;
    serviceLine: ServiceLine;
    paymentMethod: PaymentMethod;
    note: string;
  } | null>(null);

  const filters = useMemo(
    () => ({ from, to, type: type || undefined, serviceLine: serviceLine || undefined, search }),
    [from, to, type, serviceLine, search],
  );

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data: stats, isLoading: statsLoading } = useFinanceStats({ from, to });
  const { data: entriesData, isLoading: entriesLoading } = useFinanceEntries({
    page,
    limit: PAGE_LIMIT,
    ...filters,
  });

  const marginPercent = useMemo(() => {
    const income = stats?.totals.thisMonthIncome || 0;
    const net = stats?.totals.thisMonthNet || 0;
    if (income <= 0) return 0;
    return (net / income) * 100;
  }, [stats]);

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Movimiento eliminado");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo eliminar";
      toast.error(message);
    }
  };

  const openDeleteModal = (entry: {
    id: string;
    type: FinanceEntryType;
    amount: number;
    category: string;
  }) => {
    setDeleteTarget(entry);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await handleDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  const openEditEntryModal = (entry: FinanceEntryDTO) => {
    setEditingEntry({
      id: entry.id,
      type: entry.type,
      entryDate: toDateInput(entry.entryDate),
      amount: String(entry.amount),
      category: entry.category,
      serviceLine: entry.serviceLine,
      paymentMethod: entry.paymentMethod,
      note: entry.note || "",
    });
  };

  const saveEntryEdition = async () => {
    if (!editingEntry) return;

    const parsedAmount = Number.parseFloat(editingEntry.amount.replace(",", "."));
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Monto inválido");
      return;
    }

    if (!editingEntry.category.trim()) {
      toast.error("Categoría requerida");
      return;
    }

    try {
      const [ey, em, ed] = editingEntry.entryDate.split("-").map(Number);
      await updateMutation.mutateAsync({
        id: editingEntry.id,
        body: {
          entryDate: new Date(ey, em - 1, ed).toISOString(),
          amount: parsedAmount,
          category: editingEntry.category.trim(),
          serviceLine: editingEntry.serviceLine,
          paymentMethod: editingEntry.paymentMethod,
          note: editingEntry.note.trim() || null,
        },
      });

      toast.success("Movimiento actualizado");
      setEditingEntry(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo actualizar";
      toast.error(message);
    }
  };

  const clearFilters = () => {
    setFrom("");
    setTo("");
    setType("");
    setServiceLine("");
    setSearch("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[color:var(--color-border)]/20 bg-(--color-surface)/30 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Typography as="h3" variant="h3" className="text-(--color-heading)">
            Filtros de análisis
          </Typography>
          <Button type="button" variant="soft" size="sm" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
          <label className="space-y-1 text-sm text-(--color-body)">
            <span>Desde</span>
            <input
              type="date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="w-full rounded-lg border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm text-(--color-body)">
            <span>Hasta</span>
            <input
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="w-full rounded-lg border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm text-(--color-body)">
            <span>Tipo</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as "" | "INCOME" | "EXPENSE")}
              className="w-full rounded-lg border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 px-3 py-2"
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm text-(--color-body)">
            <span>Línea de servicio</span>
            <select
              value={serviceLine}
              onChange={(event) =>
                setServiceLine(event.target.value as "" | "MAKEUP" | "NAILS" | "HAIR" | "GENERAL")
              }
              className="w-full rounded-lg border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 px-3 py-2"
            >
              {SERVICE_LINE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm text-(--color-body)">
            <span>Buscar</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Categoría o nota"
              className="w-full rounded-lg border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 px-3 py-2"
            />
          </label>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Ingreso mes"
          value={statsLoading ? "..." : currency.format(stats?.totals.thisMonthIncome || 0)}
        />
        <StatCard
          title="Egreso mes"
          value={statsLoading ? "..." : currency.format(stats?.totals.thisMonthExpense || 0)}
        />
        <StatCard
          title="Neto mes"
          value={statsLoading ? "..." : currency.format(stats?.totals.thisMonthNet || 0)}
        />
      </section>

      <section className="rounded-2xl border border-[color:var(--color-border)]/20 bg-(--color-surface)/30 p-4 sm:p-5">
        <Typography as="h3" variant="h3" className="text-(--color-heading)">
          Estado del negocio
        </Typography>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              (stats?.totals.thisMonthNet || 0) >= 0
                ? "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]"
                : "bg-[color:var(--color-danger)]/15 text-[color:var(--color-danger)]"
            }`}
          >
            {(stats?.totals.thisMonthNet || 0) >= 0 ? "Generando" : "Perdiendo"}
          </span>
          <Typography as="p" variant="small" className="text-(--color-body)">
            Margen neto del periodo: {marginPercent.toFixed(1)}%
          </Typography>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-[color:var(--color-border)]/20 bg-(--color-surface)/30 p-4 sm:p-5">
          <Typography as="h3" variant="h3" className="text-(--color-heading)">
            Resultado por línea de servicio
          </Typography>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--color-border)]/20 text-left text-(--color-muted)">
                  <th className="px-2 py-2">Línea</th>
                  <th className="px-2 py-2">Ingreso</th>
                  <th className="px-2 py-2">Egreso</th>
                  <th className="px-2 py-2">Neto</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.byServiceLine || []).map((row) => (
                  <tr key={row.serviceLine} className="border-b border-[color:var(--color-border)]/10 text-(--color-body)">
                    <td className="px-2 py-2">{serviceLineLabel(row.serviceLine)}</td>
                    <td className="px-2 py-2">{currency.format(row.income)}</td>
                    <td className="px-2 py-2">{currency.format(row.expense)}</td>
                    <td className={`px-2 py-2 font-medium ${row.net >= 0 ? "text-[color:var(--color-success)]" : "text-[color:var(--color-danger)]"}`}>
                      {currency.format(row.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(stats?.byServiceLine || []).length === 0 ? (
              <Typography as="p" variant="small" className="mt-3 text-(--color-body)">
                Sin datos para este filtro.
              </Typography>
            ) : null}
          </div>
        </article>

        <article className="rounded-2xl border border-[color:var(--color-border)]/20 bg-(--color-surface)/30 p-4 sm:p-5">
          <Typography as="h3" variant="h3" className="text-(--color-heading)">
            Top categorías (impacto)
          </Typography>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--color-border)]/20 text-left text-(--color-muted)">
                  <th className="px-2 py-2">Categoría</th>
                  <th className="px-2 py-2">Ingreso</th>
                  <th className="px-2 py-2">Egreso</th>
                  <th className="px-2 py-2">Neto</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.byCategory || []).slice(0, 8).map((row) => (
                  <tr key={row.category} className="border-b border-[color:var(--color-border)]/10 text-(--color-body)">
                    <td className="px-2 py-2">{row.category}</td>
                    <td className="px-2 py-2">{currency.format(row.income)}</td>
                    <td className="px-2 py-2">{currency.format(row.expense)}</td>
                    <td className={`px-2 py-2 font-medium ${row.net >= 0 ? "text-[color:var(--color-success)]" : "text-[color:var(--color-danger)]"}`}>
                      {currency.format(row.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(stats?.byCategory || []).length === 0 ? (
              <Typography as="p" variant="small" className="mt-3 text-(--color-body)">
                Sin datos para este filtro.
              </Typography>
            ) : null}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-[color:var(--color-border)]/20 bg-(--color-surface)/30 p-4 sm:p-5">
        <Typography as="h3" variant="h3" className="text-(--color-heading)">
          Movimientos
        </Typography>

        {entriesLoading ? (
          <Typography as="p" variant="small" className="mt-3 text-(--color-body)">
            Cargando...
          </Typography>
        ) : !entriesData?.entries.length ? (
          <Typography as="p" variant="small" className="mt-3 text-(--color-body)">
            Aún no hay movimientos registrados.
          </Typography>
        ) : (
          <>
            {groupByDate(entriesData.entries).map(({ date, entries }) => {
              const total = dayTotal(entries);
              return (
                <article key={date} className="mt-6 first:mt-4">
                  <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                    <Typography as="h4" variant="h4" className="text-(--color-heading)">
                      {formatDate(date)}
                    </Typography>
                    <span className="text-sm text-(--color-muted)">
                      {currency.format(total.income)} ingreso · {currency.format(total.expense)} egreso ·
                      <span className={total.net >= 0 ? "ml-1 text-[color:var(--color-success)]" : "ml-1 text-[color:var(--color-danger)]"}>
                        {currency.format(total.net)} neto
                      </span>
                    </span>
                  </div>

                  {/* Mobile */}
                  <div className="space-y-2 md:hidden">
                    {entries.map((entry) => (
                      <article
                        key={entry.id}
                        className="rounded-xl border border-[color:var(--color-border)]/20 bg-(--color-surface)/50 p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${entry.type === "INCOME" ? "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]" : "bg-[color:var(--color-danger)]/15 text-[color:var(--color-danger)]"}`}
                            >
                              {typeLabel(entry.type)}
                            </span>
                            <Typography as="p" variant="p" className="font-semibold text-(--color-heading)">
                              {currency.format(entry.amount)}
                            </Typography>
                          </div>
                          <span className="rounded bg-[color:var(--color-border)]/20 px-1.5 py-0.5 text-[10px] uppercase text-(--color-muted)">
                            {sourceLabel(entry.source)}
                          </span>
                        </div>

                        <div className="mt-1.5 text-sm text-(--color-body)">
                          <p>
                            {entry.category}
                            <span className="mx-1 text-(--color-muted)">·</span>
                            {serviceLineLabel(entry.serviceLine)}
                            <span className="mx-1 text-(--color-muted)">·</span>
                            {paymentLabel(entry.paymentMethod)}
                          </p>
                          {entry.note ? <p className="mt-0.5 text-(--color-muted)">{entry.note}</p> : null}
                        </div>

                        <div className="mt-2 flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditEntryModal(entry)}
                            className="text-(--color-primary) hover:bg-[color:var(--color-primary)]/10"
                            aria-label="Editar"
                          >
                            <Pencil className="mr-1 h-3.5 w-3.5" />
                            Editar
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              openDeleteModal({
                                id: entry.id,
                                type: entry.type,
                                amount: entry.amount,
                                category: entry.category,
                              })
                            }
                            className="text-[color:var(--color-danger)] hover:bg-[color:var(--color-danger)]/10"
                            aria-label="Eliminar"
                          >
                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                            Eliminar
                          </Button>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Desktop table */}
                  <div className="hidden overflow-x-auto md:block">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-[color:var(--color-border)]/20 text-left text-(--color-muted)">
                          <th className="px-2 py-1.5 font-medium">Tipo</th>
                          <th className="px-2 py-1.5 font-medium">Categoría</th>
                          <th className="px-2 py-1.5 font-medium">Servicio</th>
                          <th className="px-2 py-1.5 font-medium">Monto</th>
                          <th className="px-2 py-1.5 font-medium">Método</th>
                          <th className="px-2 py-1.5 font-medium">Nota</th>
                          <th className="px-2 py-1.5 font-medium">Origen</th>
                          <th className="px-2 py-1.5 font-medium">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((entry) => (
                          <tr key={entry.id} className="border-b border-[color:var(--color-border)]/10 text-(--color-body)">
                            <td className="px-2 py-1.5">
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${entry.type === "INCOME" ? "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]" : "bg-[color:var(--color-danger)]/15 text-[color:var(--color-danger)]"}`}
                              >
                                {typeLabel(entry.type)}
                              </span>
                            </td>
                            <td className="px-2 py-1.5">{entry.category}</td>
                            <td className="px-2 py-1.5 text-(--color-muted)">{serviceLineLabel(entry.serviceLine)}</td>
                            <td className="px-2 py-1.5 font-medium text-(--color-heading)">{currency.format(entry.amount)}</td>
                            <td className="px-2 py-1.5 text-(--color-muted)">{paymentLabel(entry.paymentMethod)}</td>
                            <td className="max-w-[180px] truncate px-2 py-1.5 text-(--color-muted)" title={entry.note ?? ""}>
                              {entry.note || "—"}
                            </td>
                            <td className="px-2 py-1.5">
                              <span className="rounded bg-[color:var(--color-border)]/20 px-1.5 py-0.5 text-[10px] uppercase text-(--color-muted)">
                                {sourceLabel(entry.source)}
                              </span>
                            </td>
                            <td className="px-2 py-1.5">
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => openEditEntryModal(entry)}
                                  className="text-(--color-primary) hover:bg-[color:var(--color-primary)]/10"
                                  aria-label="Editar"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() =>
                                    openDeleteModal({
                                      id: entry.id,
                                      type: entry.type,
                                      amount: entry.amount,
                                      category: entry.category,
                                    })
                                  }
                                  className="text-[color:var(--color-danger)] hover:bg-[color:var(--color-danger)]/10"
                                  aria-label="Eliminar"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              );
            })}
          </>
        )}

        {entriesData?.pagination && entriesData.pagination.pages > 1 ? (
          <div className="mt-6 flex items-center justify-between border-t border-[color:var(--color-border)]/20 pt-4">
            <Typography as="p" variant="small" className="text-(--color-muted)">
              {entriesData.pagination.total} movimientos · Página {page} de {entriesData.pagination.pages}
            </Typography>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="soft"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: entriesData.pagination.pages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === entriesData.pagination.pages || Math.abs(p - page) <= 2)
                .map((p, idx, arr) => (
                  <span key={p} className="flex items-center">
                    {idx > 0 && arr[idx - 1] !== p - 1 ? (
                      <span className="px-1 text-(--color-muted)">···</span>
                    ) : null}
                    <Button
                      type="button"
                      variant={p === page ? "primary" : "soft"}
                      size="sm"
                      onClick={() => setPage(p)}
                      className={p === page ? "" : "text-(--color-muted)"}
                    >
                      {p}
                    </Button>
                  </span>
                ))}
              <Button
                type="button"
                variant="soft"
                size="sm"
                disabled={page >= (entriesData.pagination.pages || 1)}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : entriesData?.pagination && entriesData.pagination.total > 0 ? (
          <Typography as="p" variant="small" className="mt-4 text-(--color-muted)">
            {entriesData.pagination.total} movimientos en total
          </Typography>
        ) : null}
      </section>

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        size="sm"
        ariaLabelledBy="finance-delete-title"
      >
        <ModalHeader title="Confirmar eliminación" onClose={() => setDeleteTarget(null)} />
        <ModalBody>
          <Typography as="p" variant="p" className="text-(--color-body)">
            ¿Seguro que deseas eliminar este {deleteTarget?.type === "INCOME" ? "ingreso" : "egreso"}?
          </Typography>
          {deleteTarget ? (
            <Typography as="p" variant="small" className="mt-2 text-(--color-muted)">
              {typeLabel(deleteTarget.type)} · {deleteTarget.category} · {currency.format(deleteTarget.amount)}
            </Typography>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="soft" size="sm" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button type="button" variant="danger" size="sm" onClick={confirmDelete}>
              {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sí, eliminar
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      <Modal
        open={editingEntry !== null}
        onClose={() => setEditingEntry(null)}
        size="md"
        ariaLabelledBy="finance-edit-entry-title"
      >
        <ModalHeader title={`Editar ${editingEntry?.type === "INCOME" ? "ingreso" : "egreso"}`} onClose={() => setEditingEntry(null)} />
        <ModalBody>
          {editingEntry ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-(--color-body)">
                <span>Fecha</span>
                <input
                  type="date"
                  value={editingEntry.entryDate}
                  onChange={(event) =>
                    setEditingEntry((prev) => (prev ? { ...prev, entryDate: event.target.value } : prev))
                  }
                  className="w-full rounded-lg border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 px-3 py-2"
                />
              </label>

              <label className="space-y-1 text-sm text-(--color-body)">
                <span>Monto</span>
                <input
                  value={editingEntry.amount}
                  onChange={(event) =>
                    setEditingEntry((prev) => (prev ? { ...prev, amount: event.target.value } : prev))
                  }
                  className="w-full rounded-lg border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 px-3 py-2"
                  placeholder="150"
                />
              </label>

              <label className="space-y-1 text-sm text-(--color-body)">
                <span>Categoría</span>
                <input
                  value={editingEntry.category}
                  onChange={(event) =>
                    setEditingEntry((prev) => (prev ? { ...prev, category: event.target.value } : prev))
                  }
                  className="w-full rounded-lg border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 px-3 py-2"
                  placeholder="maquillaje_novia"
                />
              </label>

              <label className="space-y-1 text-sm text-(--color-body)">
                <span>Servicio</span>
                <select
                  value={editingEntry.serviceLine}
                  onChange={(event) =>
                    setEditingEntry((prev) =>
                      prev
                        ? {
                            ...prev,
                            serviceLine: event.target.value as ServiceLine,
                          }
                        : prev,
                    )
                  }
                  className="w-full rounded-lg border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 px-3 py-2"
                >
                  {SERVICE_LINE_OPTIONS.filter((option) => option.value !== "").map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1 text-sm text-(--color-body)">
                <span>Medio de pago</span>
                <select
                  value={editingEntry.paymentMethod}
                  onChange={(event) =>
                    setEditingEntry((prev) =>
                      prev
                        ? {
                            ...prev,
                            paymentMethod: event.target.value as PaymentMethod,
                          }
                        : prev,
                    )
                  }
                  className="w-full rounded-lg border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 px-3 py-2"
                >
                  {[
                    "YAPE",
                    "PLIN",
                    "TRANSFER",
                    "CASH",
                    "CARD",
                    "OTHER",
                  ].map((value) => (
                    <option key={value} value={value}>
                      {paymentLabel(value)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1 text-sm text-(--color-body) sm:col-span-2">
                <span>Nota</span>
                <textarea
                  value={editingEntry.note}
                  onChange={(event) =>
                    setEditingEntry((prev) => (prev ? { ...prev, note: event.target.value } : prev))
                  }
                  rows={3}
                  className="w-full rounded-lg border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 px-3 py-2"
                  placeholder="Detalle opcional"
                />
              </label>
            </div>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="soft" size="sm" onClick={() => setEditingEntry(null)}>
              Cancelar
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={saveEntryEdition}>
              {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Guardar cambios
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <article className="rounded-xl border border-[color:var(--color-border)]/20 bg-(--color-surface)/50 p-4">
      <Typography as="p" variant="small" className="text-(--color-body)">
        {title}
      </Typography>
      <Typography as="p" variant="h3" className="mt-1 text-(--color-heading)">
        {value}
      </Typography>
    </article>
  );
}
