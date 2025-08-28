import { useQuery } from '@tanstack/react-query';

export interface RecentAppointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  services?: Array<{
    id?: string;
    name?: string;
    serviceName?: string;
    quantity?: number;
    price?: number;
    duration?: number;
  }>;
  appointmentDate: string;
  appointmentTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  additionalNotes?: string;
  createdAt: string;
}

export const useRecentAppointments = (limit: number = 5) => {
  return useQuery<RecentAppointment[]>({
    queryKey: ['recent-appointments', limit],
    queryFn: async () => {
      const response = await fetch(`/api/admin/appointments?limit=${limit}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to fetch recent appointments');
      }
      
      return data.data.appointments;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 30 * 60 * 1000, // Refresh every 30 minutes
  });
};
