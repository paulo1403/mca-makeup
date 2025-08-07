import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  additionalNotes?: string;
  location?: string;
  duration: number;
  servicePrice?: number;
  transportCost?: number;
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
}

// Hook para obtener citas
export const useAppointments = ({
  page,
  filter,
  searchTerm,
}: UseAppointmentsParams) => {
  return useQuery({
    queryKey: ["appointments", page, filter, searchTerm],
    queryFn: async (): Promise<AppointmentsResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(filter === "all" || !filter
          ? { status: "PENDING,CONFIRMED" }
          : { status: filter }),
        ...(searchTerm && { search: searchTerm }),
      });

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
  const highlightParam = searchParams.get("highlight");
  const showDetailParam = searchParams.get("showDetail");

  return {
    filter:
      filterParam &&
      ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].includes(filterParam)
        ? filterParam
        : "all",
    highlightId: highlightParam,
    showDetail: showDetailParam === "true",
  };
};
