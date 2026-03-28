import { useQuery } from "@tanstack/react-query";

export interface IncomeMonthlyItem {
  month: string;
  label: string;
  total: number;
  manual: number;
  web: number;
  completedCount: number;
}

export interface IncomeStats {
  totals: {
    allTime: number;
    thisMonth: number;
    thisYear: number;
    manualAllTime: number;
    manualThisMonth: number;
    webAllTime: number;
    webThisMonth: number;
  };
  monthly: IncomeMonthlyItem[];
  insights: {
    topManualMonth: IncomeMonthlyItem | null;
    topWebMonth: IncomeMonthlyItem | null;
  };
  recentManual: Array<{
    id: string;
    clientName: string;
    serviceType: string | null;
    appointmentDate: string;
    totalPrice: number | null;
  }>;
}

export const useIncomeStats = () => {
  return useQuery<IncomeStats>({
    queryKey: ["income-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/income");
      const payload = await response.json();

      if (!payload.success) {
        throw new Error(payload.message || "Failed to fetch income stats");
      }

      return payload.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
};
