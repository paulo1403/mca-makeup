"use client";

import { Copy, Loader2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import type { CreateFinanceEntriesRequest, PaymentMethod, ServiceLine } from "@/interfaces/finance";
import type { FinanceEntryType } from "@/interfaces/finance";
import {
  useCreateFinanceEntries,
  useParseFinanceText,
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
  { value: "MAKEUP", label: "Maquillaje" },
  { value: "NAILS", label: "Uñas" },
  { value: "HAIR", label: "Peinado" },
  { value: "GENERAL", label: "General" },
] as const;

const PAYMENT_OPTIONS = [
  { value: "YAPE", label: "Yape" },
  { value: "PLIN", label: "Plin" },
  { value: "TRANSFER", label: "Transferencia" },
  { value: "CASH", label: "Efectivo" },
  { value: "CARD", label: "Tarjeta" },
  { value: "OTHER", label: "Otro" },
] as const;

const INCOME_CATEGORIES = [
  { value: "servicio", label: "Servicio" },
  { value: "propina", label: "Propina" },
  { value: "venta_productos", label: "Venta de productos" },
  { value: "adelanto", label: "Adelanto / Seña" },
  { value: "otro_ingreso", label: "Otro ingreso" },
] as const;

const EXPENSE_CATEGORIES = [
  { value: "materiales", label: "Materiales" },
  { value: "transporte", label: "Transporte" },
  { value: "pago_personal", label: "Pago a personal" },
  { value: "agua", label: "Agua" },
  { value: "luz", label: "Luz" },
  { value: "internet", label: "Internet" },
  { value: "alquiler", label: "Alquiler" },
  { value: "publicidad", label: "Publicidad" },
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "comida", label: "Comida" },
  { value: "productos", label: "Compra de productos" },
  { value: "otro_gasto", label: "Otro gasto" },
] as const;

export default function CrearPage() {
  const [quickType, setQuickType] = useState<FinanceEntryType>("INCOME");
  const [quickCategory, setQuickCategory] = useState("");
  const [quickAmount, setQuickAmount] = useState("");
  const [quickService, setQuickService] = useState<ServiceLine>("GENERAL");
  const [quickPayment, setQuickPayment] = useState<PaymentMethod>("CASH");
  const [quickNote, setQuickNote] = useState("");
  const [quickDate, setQuickDate] = useState(new Date().toISOString().slice(0, 10));

  const [rawText, setRawText] = useState("");

  const createMutation = useCreateFinanceEntries();
  const parseMutation = useParseFinanceText();

  const categories = quickType === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validParsedEntries = useMemo(() => {
    if (!parseMutation.data) return [];
    return parseMutation.data.items
      .filter((item) => item.isValid && item.parsed)
      .map((item) => item.parsed) as CreateFinanceEntriesRequest["entries"];
  }, [parseMutation.data]);

  const handleQuickSubmit = async () => {
    const amount = Number.parseFloat(quickAmount.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Ingresa un monto válido");
      return;
    }
    if (!quickCategory) {
      toast.error("Selecciona una categoría");
      return;
    }

    const [y, m, d] = quickDate.split("-").map(Number);

    try {
      await createMutation.mutateAsync({
        entries: [
          {
            entryDate: new Date(y, m - 1, d).toISOString(),
            type: quickType,
            amount,
            category: quickCategory,
            serviceLine: quickService,
            paymentMethod: quickPayment,
            note: quickNote.trim() || null,
            source: "MANUAL",
          },
        ],
      });
      toast.success(`${quickType === "INCOME" ? "Ingreso" : "Egreso"} guardado`);
      setQuickAmount("");
      setQuickNote("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar";
      toast.error(message);
    }
  };

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

  const handleSaveBatch = async () => {
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

  const copyTemplate = async () => {
    await navigator.clipboard.writeText(DEFAULT_TEMPLATE);
    toast.success("Formato copiado");
  };

  return (
    <div className="space-y-6">
      {/* Quick entry */}
      <section className="rounded-2xl border border-[color:var(--color-border)]/20 bg-(--color-surface)/30 p-4 sm:p-5">
        <Typography as="h3" variant="h3" className="text-(--color-heading)">
          Nuevo movimiento
        </Typography>

        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            variant={quickType === "INCOME" ? "primary" : "soft"}
            size="sm"
            onClick={() => { setQuickType("INCOME"); setQuickCategory(""); }}
          >
            Ingreso
          </Button>
          <Button
            type="button"
            variant={quickType === "EXPENSE" ? "primary" : "soft"}
            size="sm"
            onClick={() => { setQuickType("EXPENSE"); setQuickCategory(""); }}
          >
            Egreso
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1 text-sm text-(--color-body)">
            <span>Fecha</span>
            <input
              type="date"
              value={quickDate}
              onChange={(e) => setQuickDate(e.target.value)}
              className="w-full rounded-lg border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm text-(--color-body)">
            <span>Categoría</span>
            <select
              value={quickCategory}
              onChange={(e) => setQuickCategory(e.target.value)}
              className="w-full rounded-lg border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 px-3 py-2"
            >
              <option value="">Seleccionar...</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm text-(--color-body)">
            <span>Monto (S/)</span>
            <input
              type="text"
              inputMode="decimal"
              value={quickAmount}
              onChange={(e) => setQuickAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 px-3 py-2"
            />
          </label>

          <label className="space-y-1 text-sm text-(--color-body)">
            <span>Método de pago</span>
            <select
              value={quickPayment}
              onChange={(e) => setQuickPayment(e.target.value as PaymentMethod)}
              className="w-full rounded-lg border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 px-3 py-2"
            >
              {PAYMENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm text-(--color-body)">
            <span>Línea de servicio</span>
            <select
              value={quickService}
              onChange={(e) => setQuickService(e.target.value as ServiceLine)}
              className="w-full rounded-lg border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 px-3 py-2"
            >
              {SERVICE_LINE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm text-(--color-body) sm:col-span-2 lg:col-span-2">
            <span>Nota (opcional)</span>
            <input
              type="text"
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="Detalle del movimiento"
              className="w-full rounded-lg border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 px-3 py-2"
            />
          </label>
        </div>

        <div className="mt-4">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleQuickSubmit}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Agregar {quickType === "INCOME" ? "ingreso" : "egreso"}
          </Button>
        </div>
      </section>

      {/* Paste batch */}
      <section className="rounded-2xl border border-[color:var(--color-border)]/20 bg-(--color-surface)/30 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Typography as="h3" variant="h3" className="text-(--color-heading)">
            Carga por lote
          </Typography>
          <Button type="button" variant="secondary" size="sm" onClick={copyTemplate}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar formato
          </Button>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={DEFAULT_TEMPLATE}
            className="min-h-48 w-full rounded-xl border border-[color:var(--color-border)]/20 bg-(--color-surface)/60 p-3 text-sm text-(--color-body)"
          />

          <div className="rounded-xl border border-[color:var(--color-border)]/20 bg-(--color-surface)/50 p-3 text-sm text-(--color-body)">
            <p className="font-semibold text-(--color-heading)">Formato por línea</p>
            <p className="mt-2">TIPO | MONTO | CATEGORIA | SERVICIO | MEDIO | NOTA</p>
            <p className="mt-2">TIPO: INGRESO, EGRESO o GASTO</p>
            <p className="mt-1">SERVICIO: MAQUILLAJE, UÑAS, PEINADO, GENERAL, TRANSPORTE, MATERIALES, etc.</p>
            <p className="mt-1">MEDIO: YAPE, PLIN, EFECTIVO, TARJETA, TRANSFERENCIA u OTRO</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="button" variant="secondary" size="md" onClick={handleParse}>
            {parseMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Analizar
          </Button>
          <Button type="button" variant="primary" size="md" onClick={handleSaveBatch}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Guardar filas ({validParsedEntries.length})
          </Button>
          {parseMutation.data ? (
            <Button
              type="button"
              variant="soft"
              size="md"
              onClick={() => { setRawText(""); parseMutation.reset(); }}
            >
              Limpiar
            </Button>
          ) : null}
        </div>
      </section>

      {/* Parse preview */}
      {parseMutation.data ? (
        <section className="rounded-2xl border border-[color:var(--color-border)]/20 bg-(--color-surface)/30 p-4 sm:p-5">
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
                className={`rounded-lg border p-3 text-sm ${
                  item.isValid
                    ? "border-[color:var(--color-success)]/40 bg-[color:var(--color-success)]/10"
                    : "border-[color:var(--color-danger)]/40 bg-[color:var(--color-danger)]/10"
                }`}
              >
                <p className="font-medium">Línea {item.line}: {item.rawLine}</p>
                {!item.isValid ? <p className="mt-1 text-[color:var(--color-danger)]">{item.errors.join(" ")}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
