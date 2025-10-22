import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  services?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    duration: number;
  }>;
  appointmentDate: string;
  appointmentTime: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  additionalNotes?: string;
  location?: string;
  duration: number;
  servicePrice?: number;
  transportCost?: number;
  nightShiftCost?: number;
  totalPrice?: number;
  district?: string;
  address?: string;
  addressReference?: string;
  createdAt: string;
  updatedAt: string;
  review?: {
    reviewToken: string;
    rating: number | null;
    reviewText: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED";
    isPublic: boolean;
  };
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface AppointmentsResponse {
  appointments: Appointment[];
  pagination: PaginationData;
}

interface UseAppointmentsParams {
  page: number;
  filter: string;
  searchTerm: string;
  id?: string;
}

// Hook para obtener citas
export const useAppointments = ({ page, filter, searchTerm, id }: UseAppointmentsParams) => {
  return useQuery({
    queryKey: ["appointments", page, filter, searchTerm, id ?? null],
    queryFn: async (): Promise<AppointmentsResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(filter === "all" || !filter ? { status: "PENDING,CONFIRMED" } : { status: filter }),
        ...(searchTerm && { search: searchTerm }),
      });

      // Fetch base list and, if id provided, also fetch the single appointment
      if (id) {
        const [baseResponse, singleResponse] = await Promise.all([
          fetch(`/api/admin/appointments?${params}`),
          fetch(`/api/admin/appointments?id=${id}&limit=10`),
        ]);

        const baseResult = await baseResponse.json();
        const singleResult = await singleResponse.json();

        if (!baseResult.success) {
          throw new Error(baseResult.message || "Error fetching appointments");
        }
        if (!singleResult.success) {
          throw new Error(singleResult.message || "Error fetching appointment by id");
        }

        const baseData: AppointmentsResponse = baseResult.data;
        const singleList: Appointment[] = singleResult.data.appointments || [];
        const single = singleList[0];

        const merged = single
          ? [single, ...baseData.appointments.filter((a: Appointment) => a.id !== single.id)]
          : baseData.appointments;

        return {
          appointments: merged,
          pagination: baseData.pagination,
        };
      }

      const response = await fetch(`/api/admin/appointments?${params}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Error fetching appointments");
      }

      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para actualizar estado de cita
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Appointment["status"];
    }) => {
      const response = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Error updating appointment");
      }

      return result.data;
    },
    onSuccess: () => {
      // Invalidar todas las queries de appointments para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

// Hook para eliminar cita
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/appointments?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Error deleting appointment");
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

// Hook para manejar parámetros de URL
export const useAppointmentUrlParams = () => {
  const searchParams = useSearchParams();

  const filterParam = searchParams.get("filter");
  // Edit: usar "highlightId" para mantener consistencia
  const highlightParam = searchParams.get("highlightId");
  const showDetailParam = searchParams.get("showDetail");

  return {
    filter:
      filterParam && ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].includes(filterParam)
        ? filterParam
        : "all",
    highlightId: highlightParam,
    showDetail: showDetailParam === "true",
  };
};
