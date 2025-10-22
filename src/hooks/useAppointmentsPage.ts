import {
  type Appointment,
  useAppointmentUrlParams,
  useAppointments,
} from "@/hooks/useAppointments";
import { scrollToAppointment } from "@/utils/appointmentHelpers";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export const useAppointmentsPage = () => {
  const router = useRouter();
  const { filter: urlFilter } = useAppointmentUrlParams();
  const searchParams =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : undefined;
  const highlightId = searchParams?.get("highlightId") || null;
  const showDetail = searchParams?.get("showDetail") || null;

  // Estado local
  const [filter, setFilter] = useState(urlFilter);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(highlightId);

  // Query de citas
  const { data, isLoading, error } = useAppointments({
    page: currentPage,
    filter,
    searchTerm,
    id: highlightId || undefined,
  });

  const appointments = useMemo(() => data?.appointments || [], [data?.appointments]);
  const pagination = data?.pagination;

  // Efectos para manejar URL params
  useEffect(() => {
    setFilter(urlFilter);
  }, [urlFilter]);

  useEffect(() => {
    if (highlightId) {
      setHighlightedId(highlightId);
      // Remover el highlight después de 5 segundos
      const timer = setTimeout(() => setHighlightedId(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [highlightId]);

  // Efecto para abrir modal cuando se especifica en URL
  useEffect(() => {
    if (showDetail && highlightId && appointments.length > 0) {
      const appointment = appointments.find((apt) => apt.id === highlightId);
      if (appointment) {
        setSelectedAppointment(appointment);
        setShowModal(true);
      }
    }
  }, [appointments, showDetail, highlightId]);

  // Scroll al appointment destacado
  useEffect(() => {
    if (highlightedId && appointments.some((apt) => apt.id === highlightedId)) {
      scrollToAppointment(highlightedId);
    }
  }, [highlightedId, appointments]);

  // Handlers
  const handleSearchChange = (search: string) => {
    if (searchTerm !== search) {
      setSearchTerm(search);
      setCurrentPage(1);
    }
  };

  const handleFilterChange = (newFilter: string) => {
    if (filter !== newFilter) {
      setFilter(newFilter);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);

    // Limpiar parámetros de URL si están presentes
    const params = new URLSearchParams(window.location.search);
    if (params.has("showDetail") || params.has("highlightId")) {
      params.delete("showDetail");
      params.delete("highlightId");
      const newUrl = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`;
      router.replace(newUrl);
    }
  };

  return {
    // Data
    appointments,
    pagination,

    // Estado
    filter,
    searchTerm,
    currentPage,
    selectedAppointment,
    showModal,
    highlightedId,

    // Estado de loading/error
    isLoading,
    error,

    // Handlers
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handleViewDetails,
    handleCloseModal,
  };
};
