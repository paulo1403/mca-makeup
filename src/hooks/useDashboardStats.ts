import { useQuery } from "@tanstack/react-query";

export interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  todayAppointments: number;
  thisWeekAppointments: number;
  thisMonthAppointments: number;
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  publicReviews: number;
  averageRating: number;
}

export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();

      if (!data.success) {
        throw new Error("Failed to fetch dashboard stats");
      }

      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
};
