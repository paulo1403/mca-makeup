"use client";

import ConfirmModal from "@/components/ui/ConfirmModal";
import Modal, { ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { CheckCircle, DollarSign, MapPin, Pencil, Trash2, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; district: string } | null>(null);

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
          cost: Number.parseFloat(formData.cost),
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
    setDeleteConfirm({ id, district });
  };

  const performDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const response = await fetch(`/api/admin/transport-costs/${deleteConfirm.id}`, {
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
    } finally {
      setDeleteConfirm(null);
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
      <div className="min-h-screen bg-[color:var(--color-surface)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-primary)] mx-auto"></div>
          <p className="mt-4 text-[color:var(--color-muted)]">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-surface)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[color:var(--color-heading)] mb-2">
            Costos de Transporte
          </h1>
          <p className="text-[color:var(--color-muted)]">
            Gestiona los costos de transporte para servicios a domicilio
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-[color:var(--color-danger)]/10 border border-[color:var(--color-danger)]/30 text-[color:var(--color-danger)] px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-[color:var(--color-accent-secondary)] text-[color:var(--color-on-accent-contrast)] hover:opacity-90 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            + Agregar Costo de Transporte
          </button>
        </div>

        {/* Transport Costs Table */}
        <div className="bg-[color:var(--color-surface)] rounded-lg border border-[color:var(--color-border)] shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[color:var(--color-border)]">
              <thead className="bg-[color:var(--color-surface-elevated)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
                    Distrito
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
                    Costo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
                    Notas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[color:var(--color-surface)] divide-y divide-[color:var(--color-border)]">
                {transportCosts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No hay costos de transporte configurados
                    </td>
                  </tr>
                ) : (
                  transportCosts.map((cost) => (
                    <tr key={cost.id} className="hover:bg-[color:var(--color-surface-elevated)]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center text-sm font-medium text-[color:var(--color-heading)]">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-[color:var(--color-muted)]" />{" "}
                          {cost.district}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center text-sm font-medium text-[color:var(--color-primary)]">
                          <DollarSign className="w-3.5 h-3.5 mr-1" /> S/ {cost.cost.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${cost.isActive ? "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]" : "bg-[color:var(--color-danger)]/15 text-[color:var(--color-danger)]"}`}
                        >
                          {cost.isActive ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {cost.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[color:var(--color-on-surface)] max-w-xs truncate">
                          {cost.notes || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <div className="relative group">
                            <button
                              aria-label="Editar"
                              onClick={() => handleEdit(cost)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] hover:bg-[color:var(--color-surface)] transition-colors focus-ring"
                            >
                              <Pencil className="w-5 h-5 text-[color:var(--color-accent-secondary)]" />
                              <span className="sr-only">Editar</span>
                            </button>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)] text-[color:var(--color-on-surface)] shadow-sm opacity-0 group-hover:opacity-100">
                              Editar
                            </div>
                          </div>
                          <div className="relative group">
                            <button
                              aria-label="Eliminar"
                              onClick={() => handleDelete(cost.id, cost.district)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] hover:bg-[color:var(--color-surface)] transition-colors focus-ring"
                            >
                              <Trash2 className="w-5 h-5 text-[color:var(--color-danger)]" />
                              <span className="sr-only">Eliminar</span>
                            </button>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)] text-[color:var(--color-on-surface)] shadow-sm opacity-0 group-hover:opacity-100">
                              Eliminar
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <Modal
          open={showModal}
          onClose={handleCloseModal}
          closeOnBackdrop
          closeOnEsc
          size="sm"
          ariaLabelledBy="transport-costs-modal-title"
        >
          <ModalHeader
            title={
              <span id="transport-costs-modal-title" className="inline-flex items-center gap-2">
                {editingCost ? "Editar Costo de Transporte" : "Nuevo Costo de Transporte"}
              </span>
            }
            onClose={handleCloseModal}
          />
          <ModalBody>
            <form id="transport-costs-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--color-muted)] mb-1">
                  Distrito *
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 border border-[color:var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)] placeholder-[color:var(--color-muted)]"
                  required
                  placeholder="Ej: San Miguel, La Molina, Miraflores"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[color:var(--color-muted)] mb-1">
                  Costo (S/) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className="w-full px-3 py-2 border border-[color:var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)] placeholder-[color:var(--color-muted)]"
                  required
                  placeholder="25.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[color:var(--color-muted)] mb-1">
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-[color:var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)] placeholder-[color:var(--color-muted)]"
                  rows={3}
                  placeholder="Ej: Incluye peaje, zona de difícil acceso, etc."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-[color:var(--color-border)] text-[color:var(--color-primary)] focus:ring-[color:var(--color-primary)]"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 text-sm text-[color:var(--color-on-surface)]"
                >
                  Activo
                </label>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <div className="flex gap-3 pt-2 w-full justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 border border-[color:var(--color-border)] text-[color:var(--color-on-surface)] rounded-md hover:bg-[color:var(--color-surface-elevated)]"
              >
                Cancelar
              </button>
              <button
                form="transport-costs-form"
                type="submit"
                className="px-4 py-2 bg-[color:var(--color-accent-secondary)] text-[color:var(--color-on-accent-contrast)] rounded-md hover:opacity-90"
              >
                {editingCost ? "Actualizar" : "Crear"}
              </button>
            </div>
          </ModalFooter>
        </Modal>
        <ConfirmModal
          open={!!deleteConfirm}
          title="Eliminar costo de transporte"
          description={`¿Estás segura de que quieres eliminar el costo de transporte para ${deleteConfirm?.district}?`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          destructive
          icon={<Trash2 className="w-5 h-5 text-[color:var(--color-danger)]" />}
          onConfirm={performDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      </div>
    </div>
  );
}
