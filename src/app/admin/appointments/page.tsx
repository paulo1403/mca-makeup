"use client";

import { useState, useEffect, useCallback } from "react";

interface Appointment {
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
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(filter !== "all" && { status: filter }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/admin/appointments?${params}`);
      const result = await response.json();

      if (result.success) {
        setAppointments(result.data.appointments);
        setPagination(result.data.pagination);
      } else {
        console.error("Error fetching appointments:", result.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filter, searchTerm]);

  useEffect(() => {
    fetchAppointments();
  }, [filter, searchTerm, currentPage, fetchAppointments]);

  const updateAppointmentStatus = async (
    id: string,
    status: Appointment["status"]
  ) => {
    try {
      setUpdating(id);
      const response = await fetch("/api/admin/appointments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      const result = await response.json();

      if (result.success) {
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
        );
      } else {
        console.error("Error updating appointment:", result.message);
        alert("Error al actualizar la cita");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Error al actualizar la cita");
    } finally {
      setUpdating(null);
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm("¿Estás segura de que quieres eliminar esta cita?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/appointments?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setAppointments((prev) => prev.filter((apt) => apt.id !== id));
      } else {
        console.error("Error deleting appointment:", result.message);
        alert("Error al eliminar la cita");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Error al eliminar la cita");
    }
  };

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Appointment["status"]) => {
    switch (status) {
      case "PENDING":
        return "Pendiente";
      case "CONFIRMED":
        return "Confirmada";
      case "COMPLETED":
        return "Completada";
      case "CANCELLED":
        return "Cancelada";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1C1C1C]">Gestión de Citas</h1>
        <div className="text-sm text-gray-600">
          Total: {pagination?.total || 0} citas
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre, email o servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div className="md:w-48">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="PENDING">Pendientes</option>
              <option value="CONFIRMED">Confirmadas</option>
              <option value="COMPLETED">Completadas</option>
              <option value="CANCELLED">Canceladas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No se encontraron citas
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {appointment.clientName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.clientEmail}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.clientPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.serviceType}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.duration} min •{" "}
                        {appointment.location || "A domicilio"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(appointment.appointmentDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(appointment.appointmentTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusText(appointment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {appointment.status === "PENDING" && (
                          <>
                            <button
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment.id,
                                  "CONFIRMED"
                                )
                              }
                              disabled={updating === appointment.id}
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment.id,
                                  "CANCELLED"
                                )
                              }
                              disabled={updating === appointment.id}
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
                            >
                              Cancelar
                            </button>
                          </>
                        )}

                        {appointment.status === "CONFIRMED" && (
                          <button
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.id,
                                "COMPLETED"
                              )
                            }
                            disabled={updating === appointment.id}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                          >
                            Completar
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowModal(true);
                          }}
                          className="bg-[#D4AF37] text-white px-3 py-1 rounded text-xs hover:bg-[#B8941F]"
                        >
                          Ver Detalles
                        </button>

                        <button
                          onClick={() => deleteAppointment(appointment.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded ${
                    currentPage === page
                      ? "bg-[#D4AF37] text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1C1C1C]">
                  Detalles de la Cita
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cliente
                    </label>
                    <p className="text-gray-900">
                      {selectedAppointment.clientName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">
                      {selectedAppointment.clientEmail}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <p className="text-gray-900">
                      {selectedAppointment.clientPhone}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Servicio
                    </label>
                    <p className="text-gray-900">
                      {selectedAppointment.serviceType}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha
                    </label>
                    <p className="text-gray-900">
                      {formatDate(selectedAppointment.appointmentDate)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora
                    </label>
                    <p className="text-gray-900">
                      {formatTime(selectedAppointment.appointmentTime)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración
                    </label>
                    <p className="text-gray-900">
                      {selectedAppointment.duration} minutos
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ubicación
                    </label>
                    <p className="text-gray-900">
                      {selectedAppointment.location || "A domicilio"}
                    </p>
                  </div>
                </div>

                {selectedAppointment.additionalNotes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas Adicionales
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {selectedAppointment.additionalNotes}
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-4 pt-4">
                  <span className="text-sm font-medium text-gray-700">
                    Estado:
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedAppointment.status
                    )}`}
                  >
                    {getStatusText(selectedAppointment.status)}
                  </span>
                </div>

                <div className="text-sm text-gray-500 pt-4 border-t">
                  <p>
                    Creada:{" "}
                    {new Date(selectedAppointment.createdAt).toLocaleString(
                      "es-ES"
                    )}
                  </p>
                  <p>
                    Actualizada:{" "}
                    {new Date(selectedAppointment.updatedAt).toLocaleString(
                      "es-ES"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cerrar
                </button>
                {selectedAppointment.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => {
                        updateAppointmentStatus(
                          selectedAppointment.id,
                          "CONFIRMED"
                        );
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Confirmar Cita
                    </button>
                    <button
                      onClick={() => {
                        updateAppointmentStatus(
                          selectedAppointment.id,
                          "CANCELLED"
                        );
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Cancelar Cita
                    </button>
                  </>
                )}
                {selectedAppointment.status === "CONFIRMED" && (
                  <button
                    onClick={() => {
                      updateAppointmentStatus(
                        selectedAppointment.id,
                        "COMPLETED"
                      );
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Marcar como Completada
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
