import type {
  EntrySource,
  FinanceEntryType,
  FinanceParsePreviewItem,
  PaymentMethod,
  ServiceLine,
} from "@/interfaces/finance";

const TYPE_MAP: Record<string, FinanceEntryType> = {
  INGRESO: "INCOME",
  INCOME: "INCOME",
  EGRESO: "EXPENSE",
  GASTO: "EXPENSE",
  EXPENSE: "EXPENSE",
};

const SERVICE_LINE_MAP: Record<string, ServiceLine> = {
  MAQUILLAJE: "MAKEUP",
  MAKEUP: "MAKEUP",
  UNAS: "NAILS",
  UÑAS: "NAILS",
  NAILS: "NAILS",
  PEINADO: "HAIR",
  PEINADOS: "HAIR",
  HAIR: "HAIR",
  GENERAL: "GENERAL",
};

const PAYMENT_MAP: Record<string, PaymentMethod> = {
  YAPE: "YAPE",
  PLIN: "PLIN",
  TRANSFERENCIA: "TRANSFER",
  TRANSFER: "TRANSFER",
  EFECTIVO: "CASH",
  CASH: "CASH",
  TARJETA: "CARD",
  CARD: "CARD",
  OTRO: "OTHER",
  OTHER: "OTHER",
};

function normalizeCategory(raw: string) {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
}

function parseDateOrNull(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const date = new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T00:00:00.000Z`);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  const latamMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (latamMatch) {
    const date = new Date(`${latamMatch[3]}-${latamMatch[2]}-${latamMatch[1]}T00:00:00.000Z`);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  return null;
}

function todayISO() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString();
}

export function parseFinanceText(text: string, source: EntrySource = "PASTE") {
  const rawLines = text.split(/\r?\n/);
  const items: FinanceParsePreviewItem[] = [];

  let headerDate = todayISO();

  for (const [index, raw] of rawLines.entries()) {
    const lineNumber = index + 1;
    const line = raw.trim();

    if (!line) {
      continue;
    }

    if (line.toUpperCase().startsWith("FECHA:")) {
      const dateRaw = line.split(":").slice(1).join(":").trim();
      const parsed = parseDateOrNull(dateRaw);
      if (parsed) {
        headerDate = parsed;
      } else {
        items.push({
          line: lineNumber,
          rawLine: raw,
          isValid: false,
          errors: ["Fecha de encabezado inválida. Usa YYYY-MM-DD o DD/MM/YYYY."],
          parsed: null,
        });
      }
      continue;
    }

    const parts = line.split("|").map((part) => part.trim());
    const errors: string[] = [];

    if (parts.length < 6) {
      errors.push("Formato inválido. Debe ser: TIPO | MONTO | CATEGORIA | SERVICIO | MEDIO | NOTA");
      items.push({
        line: lineNumber,
        rawLine: raw,
        isValid: false,
        errors,
        parsed: null,
      });
      continue;
    }

    const [rawType, rawAmount, rawCategory, rawServiceLine, rawPayment, ...restNote] = parts;
    const rawNote = restNote.join(" | ").trim();

    const type = TYPE_MAP[rawType.toUpperCase()];
    if (!type) {
      errors.push("TIPO inválido. Usa INGRESO, EGRESO o GASTO.");
    }

    const normalizedAmount = Number.parseFloat(rawAmount.replace(",", "."));
    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      errors.push("MONTO inválido. Debe ser un número mayor a 0.");
    }

    const category = normalizeCategory(rawCategory);
    if (!category) {
      errors.push("CATEGORIA inválida.");
    }

    const serviceLine = SERVICE_LINE_MAP[rawServiceLine.toUpperCase()];
    if (!serviceLine) {
      errors.push("SERVICIO inválido. Usa MAQUILLAJE, UÑAS, PEINADO o GENERAL.");
    }

    const paymentMethod = PAYMENT_MAP[rawPayment.toUpperCase()];
    if (!paymentMethod) {
      errors.push("MEDIO inválido. Usa YAPE, PLIN, EFECTIVO, TARJETA, TRANSFERENCIA u OTRO.");
    }

    const parsed =
      errors.length === 0 && type && serviceLine && paymentMethod
        ? {
            entryDate: headerDate,
            type,
            amount: normalizedAmount,
            category,
            serviceLine,
            paymentMethod,
            note: rawNote || null,
            source,
          }
        : null;

    items.push({
      line: lineNumber,
      rawLine: raw,
      isValid: errors.length === 0,
      errors,
      parsed,
    });
  }

  return {
    summary: {
      totalLines: items.length,
      validLines: items.filter((item) => item.isValid).length,
      invalidLines: items.filter((item) => !item.isValid).length,
    },
    items,
  };
}
