export type FinanceEntryType = "INCOME" | "EXPENSE";

export type ServiceLine = "MAKEUP" | "NAILS" | "HAIR" | "GENERAL";

export type PaymentMethod = "YAPE" | "PLIN" | "TRANSFER" | "CASH" | "CARD" | "OTHER";

export type EntrySource = "PASTE" | "MANUAL" | "AI";

export interface FinanceEntryDTO {
  id: string;
  entryDate: string;
  type: FinanceEntryType;
  amount: number;
  category: string;
  serviceLine: ServiceLine;
  paymentMethod: PaymentMethod;
  note: string | null;
  source: EntrySource;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceParsePreviewItem {
  line: number;
  rawLine: string;
  isValid: boolean;
  errors: string[];
  parsed: {
    entryDate: string;
    type: FinanceEntryType;
    amount: number;
    category: string;
    serviceLine: ServiceLine;
    paymentMethod: PaymentMethod;
    note: string | null;
    source: EntrySource;
  } | null;
}

export interface ParseFinanceRequest {
  text: string;
}

export interface ParseFinanceResponse {
  success: boolean;
  summary: {
    totalLines: number;
    validLines: number;
    invalidLines: number;
  };
  items: FinanceParsePreviewItem[];
}

export interface CreateFinanceEntriesRequest {
  entries: Array<{
    entryDate: string;
    type: FinanceEntryType;
    amount: number;
    category: string;
    serviceLine: ServiceLine;
    paymentMethod: PaymentMethod;
    note?: string | null;
    source?: EntrySource;
  }>;
}

export interface FinanceEntriesResponse {
  success: boolean;
  data: {
    entries: FinanceEntryDTO[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface FinanceStatsResponse {
  success: boolean;
  data: {
    totals: {
      thisMonthIncome: number;
      thisMonthExpense: number;
      thisMonthNet: number;
      allTimeIncome: number;
      allTimeExpense: number;
      allTimeNet: number;
    };
    byServiceLine: Array<{
      serviceLine: ServiceLine;
      income: number;
      expense: number;
      net: number;
    }>;
    byCategory: Array<{
      category: string;
      income: number;
      expense: number;
      net: number;
    }>;
    daily: Array<{
      day: string;
      income: number;
      expense: number;
      net: number;
    }>;
  };
}
