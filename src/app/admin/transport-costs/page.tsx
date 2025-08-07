"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface TransportCost {
  id: string;
  district: string;
  cost: number;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TransportCostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [transportCosts, setTransportCosts] = useState<TransportCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCost, setEditingCost] = useState<TransportCost | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    district: "",
    cost: "",
    isActive: true,
    notes: "",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
      return;
    }
    fetchTransportCosts();
  }, [session, status, router]);

  const fetchTransportCosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/transport-costs");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al cargar costos de transporte");
      }

      setTransportCosts(data.transportCosts);
    } catch (error) {
      console.error("Error fetching transport costs:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const url = editingCost
        ? `/api/admin/transport-costs/${editingCost.id}`
        : "/api/admin/transport-costs";

      const method = editingCost ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          district: formData.district,
          cost: parseFloat(formData.cost),
          isActive: formData.isActive,
          notes: formData.notes || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al guardar costo de transporte");
      }

      await fetchTransportCosts();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving transport cost:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    }
  };

  const handleDelete = async (id: string, district: string) => {
    if (
      !confirm(
        `¿Estás segura de que quieres eliminar el costo de transporte para ${district}?`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/transport-costs/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar costo de transporte");
      }

      await fetchTransportCosts();
    } catch (error) {
      console.error("Error deleting transport cost:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    }
  };

  const handleEdit = (cost: TransportCost) => {
    setEditingCost(cost);
    setFormData({
      district: cost.district,
      cost: cost.cost.toString(),
      isActive: cost.isActive,
      notes: cost.notes || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      district: "",
      cost: "",
      isActive: true,
      notes: "",
    });
    setEditingCost(null);
    setError("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Costos de Transporte
          </h1>
          <p className="text-gray-600">
            Gestiona los costos de transporte para servicios a domicilio
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            + Agregar Costo de Transporte
          </button>
        </div>

        {/* Transport Costs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distrito
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transportCosts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No hay costos de transporte configurados
                    </td>
                  </tr>
                ) : (
                  transportCosts.map((cost) => (
                    <tr key={cost.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {cost.district}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          S/ {cost.cost.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            cost.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {cost.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {cost.notes || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(cost)}
                          className="text-[#D4AF37] hover:text-[#B8941F] mr-4"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(cost.id, cost.district)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCost
                    ? "Editar Costo de Transporte"
                    : "Nuevo Costo de Transporte"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distrito *
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-gray-900 placeholder-gray-500"
                    required
                    placeholder="Ej: San Miguel, La Molina, Miraflores"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Costo (S/) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({ ...formData, cost: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-gray-900 placeholder-gray-500"
                    required
                    placeholder="25.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-gray-900 placeholder-gray-500"
                    rows={3}
                    placeholder="Ej: Incluye peaje, zona de difícil acceso, etc."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Activo
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#B8941F]"
                  >
                    {editingCost ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
