"use client";

import { Copy, Loader2, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import type { CreateFinanceEntriesRequest } from "@/interfaces/finance";
import {
  useCreateFinanceEntries,
  useDeleteFinanceEntry,
  useFinanceEntries,
  useFinanceStats,
  useParseFinanceText,
  useUpdateFinanceEntry,
} from "@/hooks/useFinance";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 2,
});

const DEFAULT_TEMPLATE = `FECHA: 2026-05-29
INGRESO | 380 | maquillaje_novia | maquillaje | yape | Boda Valeria
EGRESO | 45 | transporte | general | efectivo | Taxi ida y vuelta
GASTO | 120 | productos | general | tarjeta | Base + correctores
INGRESO | 90 | manicure_softgel | unas | plin | Cliente Camila`;

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

function typeLabel(value: "INCOME" | "EXPENSE") {
  return value === "INCOME" ? "Ingreso" : "Egreso";
}

function toDateInput(iso: string) {
  return iso.slice(0, 10);
}

export default function AdminFinancePage() {
  const [rawText, setRawText] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState<"" | "INCOME" | "EXPENSE">("");
  const [serviceLine, setServiceLine] = useState<"" | "MAKEUP" | "NAILS" | "HAIR" | "GENERAL">("");
  const [search, setSearch] = useState("");

  const parseMutation = useParseFinanceText();
  const createMutation = useCreateFinanceEntries();
  const deleteMutation = useDeleteFinanceEntry();
  const updateMutation = useUpdateFinanceEntry();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    type: "INCOME" | "EXPENSE";
    amount: number;
    category: string;
  } | null>(null);
  const [editingIncome, setEditingIncome] = useState<{
    id: string;
    entryDate: string;
    amount: string;
    category: string;
    serviceLine: "MAKEUP" | "NAILS" | "HAIR" | "GENERAL";
    paymentMethod: "YAPE" | "PLIN" | "TRANSFER" | "CASH" | "CARD" | "OTHER";
    note: string;
  } | null>(null);

  const filters = useMemo(
    () => ({ from, to, type: type || undefined, serviceLine: serviceLine || undefined, search }),
    [from, to, type, serviceLine, search],
  );

  const { data: stats, isLoading: statsLoading } = useFinanceStats({ from, to });
  const { data: entriesData, isLoading: entriesLoading } = useFinanceEntries({
    page: 1,
    limit: 50,
    ...filters,
  });

  const marginPercent = useMemo(() => {
    const income = stats?.totals.thisMonthIncome || 0;
    const net = stats?.totals.thisMonthNet || 0;
    if (income <= 0) return 0;
    return (net / income) * 100;
  }, [stats]);

  const validParsedEntries = useMemo(() => {
    if (!parseMutation.data) return [];
    return parseMutation.data.items
      .filter((item) => item.isValid && item.parsed)
      .map((item) => item.parsed) as CreateFinanceEntriesRequest["entries"];
  }, [parseMutation.data]);

  const handleParse = async () => {
    if (!rawText.trim()) {
      toast.error("Pega un texto con movimientos primero");
      return;
    }

    try {
      await parseMutation.mutateAsync({ text: rawText });
      toast.success("Texto analizado");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo analizar";
      toast.error(message);
    }
  };

  const handleSave = async () => {
    if (validParsedEntries.length === 0) {
      toast.error("No hay filas válidas para guardar");
      return;
    }

    try {
      await createMutation.mutateAsync({ entries: validParsedEntries });
      toast.success(`${validParsedEntries.length} movimientos guardados`);
      setRawText("");
      parseMutation.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar";
      toast.error(message);
    }
  };

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
    type: "INCOME" | "EXPENSE";
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

  const openEditIncomeModal = (entry: {
    id: string;
    entryDate: string;
    amount: number;
    category: string;
    serviceLine: "MAKEUP" | "NAILS" | "HAIR" | "GENERAL";
    paymentMethod: "YAPE" | "PLIN" | "TRANSFER" | "CASH" | "CARD" | "OTHER";
    note: string | null;
  }) => {
    setEditingIncome({
      id: entry.id,
      entryDate: toDateInput(entry.entryDate),
      amount: String(entry.amount),
      category: entry.category,
      serviceLine: entry.serviceLine,
      paymentMethod: entry.paymentMethod,
      note: entry.note || "",
    });
  };

  const saveIncomeEdition = async () => {
    if (!editingIncome) return;

    const parsedAmount = Number.parseFloat(editingIncome.amount.replace(",", "."));
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Monto inválido");
      return;
    }

    if (!editingIncome.category.trim()) {
      toast.error("Categoría requerida");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: editingIncome.id,
        body: {
          entryDate: new Date(`${editingIncome.entryDate}T00:00:00.000Z`).toISOString(),
          amount: parsedAmount,
          category: editingIncome.category.trim(),
          serviceLine: editingIncome.serviceLine,
          paymentMethod: editingIncome.paymentMethod,
          note: editingIncome.note.trim() || null,
        },
      });

      toast.success("Ingreso actualizado");
      setEditingIncome(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo actualizar";
      toast.error(message);
    }
  };

  const copyTemplate = async () => {
    await navigator.clipboard.writeText(DEFAULT_TEMPLATE);
    toast.success("Formato copiado");
  };

  const clearFilters = () => {
    setFrom("");
    setTo("");
    setType("");
    setServiceLine("");
    setSearch("");
  };

  return (
    <div className="space-y-6">
      <section>
        <Typography as="h1" variant="h2" className="text-(--color-heading)">
          Finanzas
        </Typography>
      </section>

      <section className="rounded-2xl border border-border/20 bg-(--color-surface)/30 p-4 sm:p-5">
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
              className="w-full rounded-lg border border-border/20 bg-(--color-surface)/60 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm text-(--color-body)">
            <span>Hasta</span>
            <input
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="w-full rounded-lg border border-border/20 bg-(--color-surface)/60 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm text-(--color-body)">
            <span>Tipo</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as "" | "INCOME" | "EXPENSE")}
              className="w-full rounded-lg border border-border/20 bg-(--color-surface)/60 px-3 py-2"
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
              className="w-full rounded-lg border border-border/20 bg-(--color-surface)/60 px-3 py-2"
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
              className="w-full rounded-lg border border-border/20 bg-(--color-surface)/60 px-3 py-2"
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

      <section className="rounded-2xl border border-border/20 bg-(--color-surface)/30 p-4 sm:p-5">
        <Typography as="h3" variant="h3" className="text-(--color-heading)">
          Estado del negocio
        </Typography>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              (stats?.totals.thisMonthNet || 0) >= 0
                ? "bg-emerald-500/15 text-emerald-700"
                : "bg-red-500/15 text-red-700"
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
        <article className="rounded-2xl border border-border/20 bg-(--color-surface)/30 p-4 sm:p-5">
          <Typography as="h3" variant="h3" className="text-(--color-heading)">
            Resultado por línea de servicio
          </Typography>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border/20 text-left text-(--color-muted)">
                  <th className="px-2 py-2">Línea</th>
                  <th className="px-2 py-2">Ingreso</th>
                  <th className="px-2 py-2">Egreso</th>
                  <th className="px-2 py-2">Neto</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.byServiceLine || []).map((row) => (
                  <tr key={row.serviceLine} className="border-b border-border/10 text-(--color-body)">
                    <td className="px-2 py-2">{serviceLineLabel(row.serviceLine)}</td>
                    <td className="px-2 py-2">{currency.format(row.income)}</td>
                    <td className="px-2 py-2">{currency.format(row.expense)}</td>
                    <td className={`px-2 py-2 font-medium ${row.net >= 0 ? "text-emerald-700" : "text-red-700"}`}>
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

        <article className="rounded-2xl border border-border/20 bg-(--color-surface)/30 p-4 sm:p-5">
          <Typography as="h3" variant="h3" className="text-(--color-heading)">
            Top categorías (impacto)
          </Typography>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border/20 text-left text-(--color-muted)">
                  <th className="px-2 py-2">Categoría</th>
                  <th className="px-2 py-2">Ingreso</th>
                  <th className="px-2 py-2">Egreso</th>
                  <th className="px-2 py-2">Neto</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.byCategory || []).slice(0, 8).map((row) => (
                  <tr key={row.category} className="border-b border-border/10 text-(--color-body)">
                    <td className="px-2 py-2">{row.category}</td>
                    <td className="px-2 py-2">{currency.format(row.income)}</td>
                    <td className="px-2 py-2">{currency.format(row.expense)}</td>
                    <td className={`px-2 py-2 font-medium ${row.net >= 0 ? "text-emerald-700" : "text-red-700"}`}>
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

      <section className="rounded-2xl border border-border/20 bg-(--color-surface)/30 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Typography as="h3" variant="h3" className="text-(--color-heading)">
            Captura inteligente por formato
          </Typography>
          <Button type="button" variant="secondary" size="sm" onClick={copyTemplate}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar formato
          </Button>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <textarea
            value={rawText}
            onChange={(event) => setRawText(event.target.value)}
            placeholder={DEFAULT_TEMPLATE}
            className="min-h-64 w-full rounded-xl border border-border/20 bg-(--color-surface)/60 p-3 text-sm text-(--color-body)"
          />

          <div className="rounded-xl border border-border/20 bg-(--color-surface)/50 p-3 text-sm text-(--color-body)">
            <p className="font-semibold text-(--color-heading)">Estructura por línea</p>
            <p className="mt-2">TIPO | MONTO | CATEGORIA | SERVICIO | MEDIO | NOTA</p>
            <p className="mt-2">TIPO: INGRESO, EGRESO o GASTO</p>
            <p className="mt-1">SERVICIO: MAQUILLAJE, UÑAS, PEINADO o GENERAL</p>
            <p className="mt-1">MEDIO: YAPE, PLIN, EFECTIVO, TARJETA, TRANSFERENCIA u OTRO</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="button" variant="secondary" size="md" onClick={handleParse}>
            {parseMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Analizar
          </Button>
          <Button type="button" variant="primary" size="md" onClick={handleSave}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Guardar filas válidas ({validParsedEntries.length})
          </Button>
        </div>
      </section>

      {parseMutation.data ? (
        <section className="rounded-2xl border border-border/20 bg-(--color-surface)/30 p-4 sm:p-5">
          <Typography as="h3" variant="h3" className="text-(--color-heading)">
            Vista previa
          </Typography>
          <Typography as="p" variant="small" className="mt-2 text-(--color-body)">
            Válidas: {parseMutation.data.summary.validLines} · Inválidas: {parseMutation.data.summary.invalidLines}
          </Typography>

          <div className="mt-4 space-y-2">
            {parseMutation.data.items.map((item) => (
              <div
                key={`${item.line}-${item.rawLine}`}
                className={`rounded-lg border p-3 text-sm ${item.isValid ? "border-emerald-500/40 bg-emerald-500/10" : "border-red-500/40 bg-red-500/10"}`}
              >
                <p className="font-medium">Línea {item.line}: {item.rawLine}</p>
                {!item.isValid ? <p className="mt-1 text-red-700">{item.errors.join(" ")}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-border/20 bg-(--color-surface)/30 p-4 sm:p-5">
        <Typography as="h3" variant="h3" className="text-(--color-heading)">
          Movimientos recientes
        </Typography>

        {entriesLoading ? (
          <Typography as="p" variant="small" className="mt-3 text-(--color-body)">
            Cargando...
          </Typography>
        ) : (
          <>
            <div className="mt-4 space-y-3 md:hidden">
              {(entriesData?.entries || []).map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-xl border border-border/20 bg-(--color-surface)/50 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Typography as="p" variant="small" className="text-(--color-muted)">
                        {new Date(entry.entryDate).toLocaleDateString("es-PE")}
                      </Typography>
                      <Typography as="p" variant="p" className="font-semibold text-(--color-heading)">
                        {currency.format(entry.amount)}
                      </Typography>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${entry.type === "INCOME" ? "bg-emerald-500/15 text-emerald-700" : "bg-red-500/15 text-red-700"}`}
                    >
                      {typeLabel(entry.type)}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-(--color-body)">
                    <p>{entry.category}</p>
                    <p className="text-(--color-muted)">{serviceLineLabel(entry.serviceLine)}</p>
                  </div>

                  <div className="mt-3 flex gap-2">
                    {entry.type === "INCOME" ? (
                      <button
                        type="button"
                        onClick={() => openEditIncomeModal(entry)}
                        className="inline-flex min-h-9 items-center rounded-md px-3 text-(--color-primary) hover:bg-primary/10"
                        aria-label="Editar ingreso"
                      >
                        <Pencil className="mr-1 h-4 w-4" />
                        Editar
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() =>
                        openDeleteModal({
                          id: entry.id,
                          type: entry.type,
                          amount: entry.amount,
                          category: entry.category,
                        })
                      }
                      className="inline-flex min-h-9 items-center rounded-md px-3 text-red-600 hover:bg-red-500/10"
                      aria-label="Eliminar movimiento"
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-4 hidden overflow-x-auto md:block">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-border/20 text-left text-(--color-muted)">
                    <th className="px-2 py-2">Fecha</th>
                    <th className="px-2 py-2">Tipo</th>
                    <th className="px-2 py-2">Categoría</th>
                    <th className="px-2 py-2">Servicio</th>
                    <th className="px-2 py-2">Monto</th>
                    <th className="px-2 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {(entriesData?.entries || []).map((entry) => (
                    <tr key={entry.id} className="border-b border-border/10 text-(--color-body)">
                      <td className="px-2 py-2">{new Date(entry.entryDate).toLocaleDateString("es-PE")}</td>
                      <td className="px-2 py-2">{typeLabel(entry.type)}</td>
                      <td className="px-2 py-2">{entry.category}</td>
                      <td className="px-2 py-2">{serviceLineLabel(entry.serviceLine)}</td>
                      <td className="px-2 py-2">{currency.format(entry.amount)}</td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-1">
                          {entry.type === "INCOME" ? (
                            <button
                              type="button"
                              onClick={() => openEditIncomeModal(entry)}
                              className="inline-flex items-center rounded-md p-1 text-(--color-primary) hover:bg-primary/10"
                              aria-label="Editar ingreso"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={() =>
                              openDeleteModal({
                                id: entry.id,
                                type: entry.type,
                                amount: entry.amount,
                                category: entry.category,
                              })
                            }
                            className="inline-flex items-center rounded-md p-1 text-red-600 hover:bg-red-500/10"
                            aria-label="Eliminar movimiento"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(entriesData?.entries || []).length === 0 ? (
              <Typography as="p" variant="small" className="mt-3 text-(--color-body)">
                Aún no hay movimientos registrados.
              </Typography>
            ) : null}
          </>
        )}
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
        open={editingIncome !== null}
        onClose={() => setEditingIncome(null)}
        size="md"
        ariaLabelledBy="finance-edit-income-title"
      >
        <ModalHeader title="Editar ingreso" onClose={() => setEditingIncome(null)} />
        <ModalBody>
          {editingIncome ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-(--color-body)">
                <span>Fecha</span>
                <input
                  type="date"
                  value={editingIncome.entryDate}
                  onChange={(event) =>
                    setEditingIncome((prev) => (prev ? { ...prev, entryDate: event.target.value } : prev))
                  }
                  className="w-full rounded-lg border border-border/20 bg-(--color-surface)/60 px-3 py-2"
                />
              </label>

              <label className="space-y-1 text-sm text-(--color-body)">
                <span>Monto</span>
                <input
                  value={editingIncome.amount}
                  onChange={(event) =>
                    setEditingIncome((prev) => (prev ? { ...prev, amount: event.target.value } : prev))
                  }
                  className="w-full rounded-lg border border-border/20 bg-(--color-surface)/60 px-3 py-2"
                  placeholder="150"
                />
              </label>

              <label className="space-y-1 text-sm text-(--color-body)">
                <span>Categoría</span>
                <input
                  value={editingIncome.category}
                  onChange={(event) =>
                    setEditingIncome((prev) => (prev ? { ...prev, category: event.target.value } : prev))
                  }
                  className="w-full rounded-lg border border-border/20 bg-(--color-surface)/60 px-3 py-2"
                  placeholder="maquillaje_novia"
                />
              </label>

              <label className="space-y-1 text-sm text-(--color-body)">
                <span>Servicio</span>
                <select
                  value={editingIncome.serviceLine}
                  onChange={(event) =>
                    setEditingIncome((prev) =>
                      prev
                        ? {
                            ...prev,
                            serviceLine: event.target.value as "MAKEUP" | "NAILS" | "HAIR" | "GENERAL",
                          }
                        : prev,
                    )
                  }
                  className="w-full rounded-lg border border-border/20 bg-(--color-surface)/60 px-3 py-2"
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
                  value={editingIncome.paymentMethod}
                  onChange={(event) =>
                    setEditingIncome((prev) =>
                      prev
                        ? {
                            ...prev,
                            paymentMethod: event.target.value as
                              | "YAPE"
                              | "PLIN"
                              | "TRANSFER"
                              | "CASH"
                              | "CARD"
                              | "OTHER",
                          }
                        : prev,
                    )
                  }
                  className="w-full rounded-lg border border-border/20 bg-(--color-surface)/60 px-3 py-2"
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
                  value={editingIncome.note}
                  onChange={(event) =>
                    setEditingIncome((prev) => (prev ? { ...prev, note: event.target.value } : prev))
                  }
                  rows={3}
                  className="w-full rounded-lg border border-border/20 bg-(--color-surface)/60 px-3 py-2"
                  placeholder="Detalle opcional"
                />
              </label>
            </div>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="soft" size="sm" onClick={() => setEditingIncome(null)}>
              Cancelar
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={saveIncomeEdition}>
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
    <article className="rounded-xl border border-border/20 bg-(--color-surface)/50 p-4">
      <Typography as="p" variant="small" className="text-(--color-body)">
        {title}
      </Typography>
      <Typography as="p" variant="h3" className="mt-1 text-(--color-heading)">
        {value}
      </Typography>
    </article>
  );
}
