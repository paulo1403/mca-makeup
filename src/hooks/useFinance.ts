import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateFinanceEntriesRequest,
  FinanceEntryDTO,
  FinanceEntriesResponse,
  FinanceStatsResponse,
  ParseFinanceResponse,
} from "@/interfaces/finance";

interface FinanceEntriesFilters {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  type?: "INCOME" | "EXPENSE";
  serviceLine?: "MAKEUP" | "NAILS" | "HAIR" | "GENERAL";
  search?: string;
}

function toSearchParams(filters: FinanceEntriesFilters) {
  const params = new URLSearchParams();

  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.type) params.set("type", filters.type);
  if (filters.serviceLine) params.set("serviceLine", filters.serviceLine);
  if (filters.search) params.set("search", filters.search);

  return params.toString();
}

export function useFinanceEntries(filters: FinanceEntriesFilters = {}) {
  return useQuery<FinanceEntriesResponse["data"]>({
    queryKey: ["finance-entries", filters],
    queryFn: async () => {
      const query = toSearchParams(filters);
      const response = await fetch(`/api/admin/finance/entries${query ? `?${query}` : ""}`);
      const payload = await response.json();

      if (!payload.success) {
        throw new Error(payload.message || "Failed to fetch finance entries");
      }

      return payload.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useFinanceStats(filters: Pick<FinanceEntriesFilters, "from" | "to"> = {}) {
  return useQuery<FinanceStatsResponse["data"]>({
    queryKey: ["finance-stats", filters],
    queryFn: async () => {
      const query = toSearchParams(filters);
      const response = await fetch(`/api/admin/finance/stats${query ? `?${query}` : ""}`);
      const payload = await response.json();

      if (!payload.success) {
        throw new Error(payload.message || "Failed to fetch finance stats");
      }

      return payload.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useParseFinanceText() {
  return useMutation<ParseFinanceResponse, Error, { text: string }>({
    mutationFn: async ({ text }) => {
      const response = await fetch("/api/admin/finance/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const payload = await response.json();

      if (!payload.success) {
        throw new Error(payload.message || "Failed to parse finance text");
      }

      return payload;
    },
  });
}

export function useCreateFinanceEntries() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, CreateFinanceEntriesRequest>({
    mutationFn: async (body) => {
      const response = await fetch("/api/admin/finance/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const payload = await response.json();
      if (!payload.success) {
        throw new Error(payload.message || "Failed to create finance entries");
      }

      return payload;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["finance-entries"] }),
        queryClient.invalidateQueries({ queryKey: ["finance-stats"] }),
      ]);
    },
  });
}

export function useDeleteFinanceEntry() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      const response = await fetch(`/api/admin/finance/entries/${id}`, {
        method: "DELETE",
      });

      const payload = await response.json();
      if (!payload.success) {
        throw new Error(payload.message || "Failed to delete finance entry");
      }

      return payload;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["finance-entries"] }),
        queryClient.invalidateQueries({ queryKey: ["finance-stats"] }),
      ]);
    },
  });
}

export function useUpdateFinanceEntry() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; data: FinanceEntryDTO },
    Error,
    {
      id: string;
      body: Partial<
        Pick<
          FinanceEntryDTO,
          "entryDate" | "type" | "amount" | "category" | "serviceLine" | "paymentMethod" | "note"
        >
      >;
    }
  >({
    mutationFn: async ({ id, body }) => {
      const response = await fetch(`/api/admin/finance/entries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const payload = await response.json();
      if (!payload.success) {
        throw new Error(payload.message || "Failed to update finance entry");
      }

      return payload;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["finance-entries"] }),
        queryClient.invalidateQueries({ queryKey: ["finance-stats"] }),
      ]);
    },
  });
}
