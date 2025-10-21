"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { Service, ServiceFormData } from "./types";
import ServicesHeader from "./components/ServicesHeader";
import ServiceListMobile from "./components/ServiceListMobile";
import ServiceTableDesktop from "./components/ServiceTableDesktop";
import ServiceFormModal from "./components/ServiceFormModal";
import ServiceInfoModal from "./components/ServiceInfoModal";
import ViewServiceModal from "./components/ViewServiceModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

const SERVICE_CATEGORIES = {
  BRIDAL: "Novia",
  SOCIAL: "Social/Eventos",
  MATURE_SKIN: "Piel Madura",
  HAIRSTYLE: "Peinados",
  OTHER: "Otros",
};

const fetchServices = async () => {
  const response = await fetch("/api/admin/services");
  if (!response.ok) throw new Error("Error al cargar servicios");
  return response.json(); // { services: Service[] }
};

export default function ServicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState("");

  const { data: servicesData, isLoading: isServicesLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: fetchServices,
    enabled: status !== "loading" && !!session,
  });
  const services: Service[] = servicesData?.services ?? [];
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<ServiceFormData>({
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
    }
  }, [session, status, router]);


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

      await queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      await queryClient.invalidateQueries({ queryKey: ["services"] });
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
    setDeleteId(id);
    setShowDeleteModal(true);
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

      await queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      await queryClient.invalidateQueries({ queryKey: ["services"] });
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

  if (status === "loading" || isServicesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[color:var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ServicesHeader
        services={services}
        onOpenInfo={() => setShowInfoModal(true)}
        onCreateNew={openNewModal}
      />

      {error && (
        <div className="bg-[color:var(--status-cancelled-bg)] border border-[color:var(--status-cancelled-border)] text-[color:var(--status-cancelled-text)] px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Mobile View - Cards */}
      <ServiceListMobile
        services={services}
        serviceCategories={SERVICE_CATEGORIES}
        toggleActive={toggleActive}
        handleEdit={handleEdit}
        handleView={handleView}
        handleDelete={handleDelete}
        openNewModal={openNewModal}
      />

      {/* Desktop View - Table */}
      <ServiceTableDesktop
        services={services}
        serviceCategories={SERVICE_CATEGORIES}
        toggleActive={toggleActive}
        handleView={handleView}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        openNewModal={openNewModal}
      />

      {/* Modal */}
      <ServiceFormModal
        show={showModal}
        editingService={editingService}
        formData={formData}
        setFormData={setFormData}
        onClose={closeModal}
        onSubmit={handleSubmit}
        serviceCategories={SERVICE_CATEGORIES}
      />

      {/* Modal de información sobre combinaciones de servicios */}
      <ServiceInfoModal show={showInfoModal} onClose={() => setShowInfoModal(false)} />
      {/* Modal de ver detalles del servicio */}
      <ViewServiceModal
        show={showViewModal && !!viewingService}
        viewingService={viewingService}
        onClose={() => setShowViewModal(false)}
        serviceCategories={SERVICE_CATEGORIES}
        onEdit={(service) => { setShowViewModal(false); handleEdit(service); }}
      />

      <ConfirmModal
        open={showDeleteModal}
        title="Eliminar servicio"
        description="Esta acción eliminará el servicio de forma permanente. ¿Deseas continuar?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        destructive
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            const response = await fetch(`/api/admin/services/${deleteId}`, { method: "DELETE" });
            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.error || "Error al eliminar el servicio");
            }
            await queryClient.invalidateQueries({ queryKey: ["admin-services"] });
            await queryClient.invalidateQueries({ queryKey: ["services"] });
            setShowDeleteModal(false);
            setDeleteId(null);
          } catch (error) {
            console.error("Error deleting service:", error);
            setError(error instanceof Error ? error.message : "Error al eliminar");
          }
        }}
        onCancel={() => { setShowDeleteModal(false); setDeleteId(null); }}
      />
    </div>
  );
}
