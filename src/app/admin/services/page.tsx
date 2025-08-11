"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const SERVICE_CATEGORIES = {
  BRIDAL: "Novia",
  SOCIAL: "Social/Eventos",
  MATURE_SKIN: "Piel Madura",
  HAIRSTYLE: "Peinados",
  OTHER: "Otros",
};

export default function ServicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "SOCIAL",
    isActive: true,
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
      return;
    }
    loadServices();
  }, [session, status, router]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/services");
      if (!response.ok) throw new Error("Error al cargar servicios");
      const data = await response.json();
      setServices(data.services);
    } catch (error) {
      console.error("Error loading services:", error);
      setError("Error al cargar los servicios");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const url = editingService
        ? `/api/admin/services/${editingService.id}`
        : "/api/admin/services";
      const method = editingService ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al guardar el servicio");
      }

      await loadServices();
      closeModal();
    } catch (error) {
      console.error("Error saving service:", error);
      setError(error instanceof Error ? error.message : "Error al guardar");
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category,
      isActive: service.isActive,
    });
    setShowModal(true);
  };

  const handleView = (service: Service) => {
    setViewingService(service);
    setShowViewModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás segura de que quieres eliminar este servicio?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al eliminar el servicio");
      }

      await loadServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      setError(error instanceof Error ? error.message : "Error al eliminar");
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...service,
          isActive: !service.isActive,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al actualizar el servicio");
      }

      await loadServices();
    } catch (error) {
      console.error("Error toggling service status:", error);
      setError(error instanceof Error ? error.message : "Error al actualizar");
    }
  };

  const openNewModal = () => {
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      category: "SOCIAL",
      isActive: true,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
    setError("");
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile Header */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C] font-playfair">
            Gestión de Servicios
          </h1>
          <div className="flex items-center space-x-4 mt-1">
            <div className="text-sm text-gray-600">
              Total:{" "}
              <span className="font-semibold text-[#D4AF37]">
                {services.length}
              </span>{" "}
              servicios
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-gray-500">
                {services.filter((s) => s.isActive).length} activos
              </span>
            </div>
            <button
              onClick={() => setShowInfoModal(true)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-xs hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="hidden sm:inline">
                ¿Cómo funcionan las combinaciones?
              </span>
              <span className="sm:hidden">Info</span>
            </button>
          </div>
        </div>
        <button
          onClick={openNewModal}
          className="bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#B8941F] transition-colors font-medium shadow-md hover:shadow-lg w-full sm:w-auto flex items-center justify-center space-x-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Nuevo Servicio</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Mobile View - Cards */}
      <div className="block lg:hidden">
        {services.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-[#D4AF37] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#D4AF37]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.586V5L8 4z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes servicios aún
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Crea tu primer servicio para empezar a recibir reservas de tus
              clientes.
            </p>
            <button
              onClick={openNewModal}
              className="bg-[#D4AF37] text-white px-6 py-3 rounded-lg hover:bg-[#B8941F] transition-colors font-medium shadow-md hover:shadow-lg flex items-center space-x-2 mx-auto"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Crear Primer Servicio</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 transition-all hover:shadow-md"
              >
                {/* Header with service name and status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 mr-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {service.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleActive(service)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                      service.isActive
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    {service.isActive ? "Activo" : "Inactivo"}
                  </button>
                </div>

                {/* Service details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <div>
                      <p className="text-gray-500 text-xs">Categoría</p>
                      <p className="font-medium text-gray-900">
                        {
                          SERVICE_CATEGORIES[
                            service.category as keyof typeof SERVICE_CATEGORIES
                          ]
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    <div>
                      <p className="text-gray-500 text-xs">Precio</p>
                      <p className="font-medium text-gray-900">
                        S/ {service.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-gray-500 text-xs">Duración</p>
                      <p className="font-medium text-gray-900">
                        {service.duration} min
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="flex-1 bg-[#D4AF37] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#B8941F] transition-colors active:scale-95"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors active:scale-95"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        {services.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#D4AF37] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#D4AF37]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.586V5L8 4z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes servicios aún
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primer servicio para empezar a recibir reservas de tus
              clientes.
            </p>
            <button
              onClick={openNewModal}
              className="bg-[#D4AF37] text-white px-6 py-3 rounded-lg hover:bg-[#B8941F] transition-colors font-medium shadow-md hover:shadow-lg inline-flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Crear Primer Servicio</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 min-w-[200px]">
                    Servicio
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell w-24">
                    Categoría
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Precio
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell w-20">
                    Duración
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Estado
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {service.name}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden">
                          {
                            SERVICE_CATEGORIES[
                              service.category as keyof typeof SERVICE_CATEGORIES
                            ]
                          }
                        </div>
                        <div className="text-xs text-gray-500 md:hidden">
                          {service.duration} min
                        </div>
                        {service.description && (
                          <div className="text-xs text-gray-400 truncate mt-1">
                            {service.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900 hidden sm:table-cell">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {
                          SERVICE_CATEGORIES[
                            service.category as keyof typeof SERVICE_CATEGORIES
                          ]
                        }
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">
                      <span className="font-medium">S/ {service.price}</span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900 hidden md:table-cell">
                      {service.duration} min
                    </td>
                    <td className="px-3 py-4">
                      <button
                        onClick={() => toggleActive(service)}
                        className={`px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                          service.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {service.isActive ? "✓" : "✗"}
                      </button>
                    </td>
                    <td className="px-3 py-4 text-sm font-medium">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleView(service)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Ver detalles completos"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(service)}
                          className="text-[#D4AF37] hover:text-[#B8941F] p-1 rounded hover:bg-[#D4AF37]/10 transition-colors"
                          title="Editar servicio"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Eliminar servicio"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-6 border w-full max-w-md sm:max-w-2xl lg:max-w-3xl shadow-lg rounded-xl bg-white">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <svg
                  className="w-6 h-6 text-[#D4AF37] mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      editingService
                        ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        : "M12 6v6m0 0v6m0-6h6m-6 0H6"
                    }
                  />
                </svg>
                {editingService ? "Editar Servicio" : "Nuevo Servicio"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información básica */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Servicio *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-gray-900 text-base"
                    placeholder="Ej: Maquillaje de Novia - Paquete Básico"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-gray-900 text-base resize-none"
                    placeholder="Describe brevemente el servicio..."
                  />
                </div>
              </div>

              {/* Detalles del servicio */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio (S/) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-gray-900 text-base"
                    placeholder="150.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración (min) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-gray-900 text-base"
                    placeholder={formData.category === "HAIRSTYLE" ? "0" : "90"}
                  />
                  {formData.duration === "0" && (
                    <p className="text-xs text-blue-600 mt-1 flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      ⚡ Duración 0: Se realizará simultáneamente con el
                      maquillaje (no suma tiempo total)
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-gray-900 text-base bg-white"
                  >
                    {Object.entries(SERVICE_CATEGORIES).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Estado del servicio */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37] focus:ring-2"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Servicio activo (los clientes pueden reservar)
                </label>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors min-w-[120px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] font-medium transition-colors shadow-md hover:shadow-lg active:scale-95 min-w-[140px]"
                >
                  {editingService ? "Actualizar Servicio" : "Crear Servicio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de información sobre combinaciones de servicios */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                ¿Cómo Funcionan las Combinaciones de Servicios?
              </h2>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
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

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Combinaciones permitidas vs no permitidas */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                    <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                    ✅ Combinaciones Permitidas
                  </h3>
                  <ul className="text-sm text-green-700 space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        <strong>Solo Maquillaje:</strong> Cualquier categoría
                        (Novia, Social, Piel Madura)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        <strong>Maquillaje + Peinado:</strong> La combinación
                        perfecta
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        <strong>Máximo:</strong> 2 tipos de servicios diferentes
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-3 flex items-center">
                    <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                    ❌ No Permitido
                  </h3>
                  <ul className="text-sm text-red-700 space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        <strong>Solo Peinado:</strong> Debe incluir maquillaje
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        <strong>Novia + Social:</strong> No se pueden mezclar
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        <strong>3+ categorías:</strong> Demasiadas opciones
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Estrategia de precios */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
                  <span className="text-lg mr-2">💰</span>
                  Estrategia de Peinados: Servicios Complementarios
                </h3>

                <div className="space-y-3">
                  <p className="text-sm text-amber-700">
                    Los peinados son <strong>servicios complementarios</strong>{" "}
                    que:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-amber-800 mb-2">
                        🎯 Beneficios Comerciales:
                      </h4>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>
                          • Aumenta ventas al parecer &quot;incluido&quot;
                        </li>
                        <li>• Los clientes perciben mayor valor</li>
                        <li>• Incentiva paquetes completos</li>
                        <li>• Diferenciación competitiva</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-amber-800 mb-2">
                        ⚙️ Funcionamiento Técnico:
                      </h4>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Solo se reservan con maquillaje</li>
                        <li>• Sistema valida automáticamente</li>
                        <li>• Precio: puede variar (S/ 50, S/ 80, etc.)</li>
                        <li>
                          • Duración: 0 min = simultáneo, {">"} 0 min = se suma
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-100 rounded-lg">
                  <h4 className="text-sm font-medium text-amber-800 mb-1">
                    📝 Ejemplos Prácticos:
                  </h4>
                  <div className="text-xs text-amber-700 space-y-1">
                    <div>
                      • <strong>Cliente selecciona:</strong> &quot;Maquillaje
                      Social (S/ 150) + Peinado (S/ 50, 0min)&quot;
                    </div>
                    <div>
                      • <strong>Total que paga:</strong> S/ 200
                    </div>
                    <div>
                      • <strong>Duración total:</strong> 150 min + 0 min = 2h
                      30min (peinado simultáneo)
                    </div>
                    <div>
                      • <strong>Percepción del cliente:</strong> &quot;¡El
                      peinado no suma tiempo extra!&quot;
                    </div>
                  </div>
                </div>
              </div>

              {/* Flujo del cliente */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <span className="mr-2">👤</span>
                  ¿Qué Ve el Cliente Durante la Reserva?
                </h3>

                <div className="space-y-3 text-sm text-blue-700">
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span>
                      Ve todos los servicios organizados por categoría
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span>
                      Puede seleccionar múltiples servicios con checkboxes
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span>Ve precio total y duración en tiempo real</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <span>
                      Sistema valida automáticamente las combinaciones
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                      5
                    </span>
                    <span>
                      Si selecciona solo peinado, aparece mensaje explicativo
                    </span>
                  </div>
                </div>
              </div>

              {/* Tips para Marcela */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <span className="mr-2">💡</span>
                  Tips para Gestionar Servicios
                </h3>

                <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-700">
                  <div>
                    <h4 className="font-medium mb-2">✨ Creando Servicios:</h4>
                    <ul className="space-y-1">
                      <li>• Peinados con precio variable</li>
                      <li>• Maquillajes con precio real</li>
                      <li>• Duración 0 = simultáneo, {">"} 0 = secuencial</li>
                      <li>• Categorías apropiadas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">
                      🎨 Estrategias Avanzadas:
                    </h4>
                    <ul className="space-y-1">
                      <li>• &quot;Maquillaje Social Premium&quot;</li>
                      <li>• &quot;Peinado de Gala&quot; (S/ 80, 0min)</li>
                      <li>• Paquetes por temporada</li>
                      <li>• Ofertas especiales</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="px-6 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors font-medium"
                >
                  ¡Entendido!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de ver detalles del servicio */}
      {showViewModal && viewingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Detalles del Servicio
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
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

            {/* Contenido del modal */}
            <div className="p-6">
              {/* Nombre del servicio */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {viewingService.name}
                </h3>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      viewingService.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {viewingService.isActive ? "✓ Activo" : "✗ Inactivo"}
                  </span>
                  <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                    {
                      SERVICE_CATEGORIES[
                        viewingService.category as keyof typeof SERVICE_CATEGORIES
                      ]
                    }
                  </span>
                </div>
              </div>

              {/* Grid de información */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Información básica */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Información Básica
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Precio
                        </label>
                        <div className="text-2xl font-bold text-[#D4AF37]">
                          S/ {viewingService.price}
                          {viewingService.price === 0 && (
                            <span className="text-sm font-normal text-green-600 ml-2">
                              (Servicio complementario)
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Duración
                        </label>
                        <div className="text-lg font-semibold text-gray-900">
                          {viewingService.duration} minutos
                          <span className="text-sm font-normal text-gray-500 ml-2">
                            ({Math.floor(viewingService.duration / 60)}h{" "}
                            {viewingService.duration % 60}min)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fechas */}
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Fechas
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Creado
                        </label>
                        <div className="text-sm text-gray-900">
                          {new Date(
                            viewingService.createdAt,
                          ).toLocaleDateString("es-PE", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Última actualización
                        </label>
                        <div className="text-sm text-gray-900">
                          {new Date(
                            viewingService.updatedAt,
                          ).toLocaleDateString("es-PE", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {viewingService.description && (
                <div className="mb-6">
                  <div className="bg-amber-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-amber-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h7"
                        />
                      </svg>
                      Descripción
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {viewingService.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Información adicional según categoría */}
              {viewingService.category === "HAIRSTYLE" && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                    <span className="mr-2">💡</span>
                    Información Especial: Peinados
                  </h4>
                  <p className="text-sm text-purple-700">
                    Este servicio de peinado solo puede ser reservado junto con
                    un servicio de maquillaje. Los clientes verán el peinado
                    como un valor agregado a su servicio principal.
                  </p>
                </div>
              )}
            </div>

            {/* Footer del modal */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex justify-between">
                <div className="text-xs text-gray-500">
                  ID: {viewingService.id}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEdit(viewingService);
                    }}
                    className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors font-medium flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
