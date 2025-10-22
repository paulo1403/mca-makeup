"use client";

import { getReviewStatusColor, getReviewStatusText } from "@/utils/reviewHelpers";
import {
  CheckCircle,
  ChevronDown,
  Eye,
  EyeOff,
  Filter,
  MessageSquare,
  Search,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface Review {
  id: string;
  appointmentId: string;
  rating: number;
  reviewText: string | null;
  reviewerName: string;
  reviewerEmail: string;
  isPublic: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminResponse: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  appointment: {
    id: string;
    clientName: string;
    clientEmail: string;
    serviceType: string;
    appointmentDate: string;
    services: { name?: string; serviceName?: string }[];
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", pagination.page.toString());
      params.set("limit", pagination.limit.toString());

      if (filter !== "ALL") {
        params.set("status", filter);
      }

      const response = await fetch(`/api/admin/reviews?${params}`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const updateReviewStatus = async (
    reviewId: string,
    status: "APPROVED" | "REJECTED",
    isPublic?: boolean,
  ): Promise<void> => {
    try {
      setSubmitting(true);
      const response = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: reviewId,
          status,
          isPublic: isPublic !== undefined ? isPublic : undefined,
          adminResponse: adminResponse.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchReviews();
        setShowModal(false);
        setAdminResponse("");
        setSelectedReview(null);
      }
    } catch (error) {
      console.error("Error updating review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (
      !confirm(
        "¿Estás segura de que quieres eliminar esta reseña? Esta acción no se puede deshacer.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        fetchReviews();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const openModal = (review: Review) => {
    setSelectedReview(review);
    setAdminResponse(review.adminResponse || "");
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "text-[color:var(--color-accent)] fill-current"
            : "text-[color:var(--color-muted)]"
        }`}
      />
    ));
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewText?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--color-heading)]">
            Gestión de Reseñas
          </h1>
          <p className="text-[color:var(--color-muted)]">Administra las reseñas de tus clientes</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)]/30 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[color:var(--color-muted)]" />
              <div className="relative inline-block">
                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value as "ALL" | "PENDING" | "APPROVED" | "REJECTED")
                  }
                  className="appearance-none pr-8 border border-[color:var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface)] focus:border-[color:var(--color-primary)] bg-[color:var(--color-surface)] text-[color:var(--color-heading)]"
                >
                  <option value="ALL">Todas</option>
                  <option value="PENDING">Pendientes</option>
                  <option value="APPROVED">Aprobadas</option>
                  <option value="REJECTED">Rechazadas</option>
                </select>

                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-[color:var(--color-muted)] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 text-[color:var(--color-muted)] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre del cliente o contenido de la reseña..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-[color:var(--color-border)] rounded-lg text-sm appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface)] focus:border-[color:var(--color-primary)] bg-[color:var(--color-surface)] text-[color:var(--color-heading)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)]/30">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--color-primary)] mx-auto mb-4" />
            <p className="text-[color:var(--color-muted)]">Cargando reseñas...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-[color:var(--color-muted)] mx-auto mb-4" />
            <p className="text-[color:var(--color-muted)]">No se encontraron reseñas</p>
          </div>
        ) : (
          <div className="divide-y divide-[color:var(--color-border)]/30">
            {filteredReviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[color:var(--color-heading)]">
                        {review.reviewerName}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${getReviewStatusColor(review.status)}`}
                      >
                        {getReviewStatusText(review.status)}
                      </span>
                      {review.isPublic && review.status === "APPROVED" && (
                        <span className="px-2 py-1 text-xs rounded-full font-medium bg-[color:var(--color-primary)]/12 text-[color:var(--color-primary)]">
                          Pública
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">({review.rating}/5)</span>
                    </div>
                    <p className="text-sm text-[color:var(--color-muted)] mb-2">
                      Cliente: {review.appointment.clientName} •{" "}
                      {formatDate(review.appointment.appointmentDate)}
                    </p>
                    {review.reviewText && (
                      <p className="text-[color:var(--color-heading)] bg-[color:var(--color-surface)] border border-[color:var(--color-border)]/30 p-3 rounded-lg mb-3">
                        &ldquo;{review.reviewText}&rdquo;
                      </p>
                    )}
                    {review.adminResponse && (
                      <div className="bg-[color:var(--color-accent)]/12 p-3 rounded-lg border-l-4 border-[color:var(--color-accent)]">
                        <p className="text-sm font-medium text-[color:var(--color-heading)] mb-1">
                          Tu respuesta:
                        </p>
                        <p className="text-sm text-[color:var(--color-muted)]">
                          {review.adminResponse}
                        </p>
                        <p className="text-xs text-[color:var(--color-muted)] mt-1">
                          Respondido el {formatDate(review.respondedAt!)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openModal(review)}
                      className="p-2 text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10 rounded-lg transition-colors"
                      title="Ver detalles y responder"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>

                    {review.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => updateReviewStatus(review.id, "APPROVED", true)}
                          className="p-2 text-[color:var(--status-confirmed-text)] hover:bg-[color:var(--status-confirmed-bg)] rounded-lg transition-colors"
                          title="Aprobar y hacer pública"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateReviewStatus(review.id, "REJECTED")}
                          className="p-2 text-[color:var(--status-cancelled-text)] hover:bg-[color:var(--status-cancelled-bg)] rounded-lg transition-colors"
                          title="Rechazar"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}

                    {review.status === "APPROVED" && (
                      <button
                        onClick={() => updateReviewStatus(review.id, "APPROVED", !review.isPublic)}
                        className="p-2 text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10 rounded-lg transition-colors"
                        title={review.isPublic ? "Ocultar de público" : "Hacer pública"}
                      >
                        {review.isPublic ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => deleteReview(review.id)}
                      className="p-2 text-[color:var(--status-cancelled-text)] hover:bg-[color:var(--status-cancelled-bg)] rounded-lg transition-colors"
                      title="Eliminar reseña"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-[color:var(--color-muted)]">
                  Enviada el {formatDate(review.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="border-t border-[color:var(--color-border)]/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[color:var(--color-muted)]">
                Mostrando {(pagination.page - 1) * pagination.limit + 1} a{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} de{" "}
                {pagination.total} reseñas
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 text-sm border border-[color:var(--color-border)]/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[color:var(--color-surface)] text-[color:var(--color-heading)]"
                >
                  Anterior
                </button>
                <span className="text-sm text-[color:var(--color-muted)]">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 text-sm border border-[color:var(--color-border)]/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[color:var(--color-surface)] text-[color:var(--color-heading)]"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Review Details and Response */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)]/30 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-[color:var(--color-heading)]">
                  Detalle de Reseña
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)]"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Review Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-[color:var(--color-heading)] mb-2">
                    {selectedReview.reviewerName}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(selectedReview.rating)}
                    <span className="text-sm text-[color:var(--color-muted)]">
                      ({selectedReview.rating}/5)
                    </span>
                  </div>
                  <p className="text-sm text-[color:var(--color-muted)] mb-3">
                    {selectedReview.reviewerEmail} • {formatDate(selectedReview.createdAt)}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-[color:var(--color-heading)] mb-2">
                    Información de la cita:
                  </h4>
                  <p className="text-sm text-[color:var(--color-muted)]">
                    Cliente: {selectedReview.appointment.clientName}
                    <br />
                    Fecha: {formatDate(selectedReview.appointment.appointmentDate)}
                    <br />
                    Servicio: {selectedReview.appointment.serviceType}
                  </p>
                </div>

                {selectedReview.reviewText && (
                  <div>
                    <h4 className="font-medium text-[color:var(--color-heading)] mb-2">
                      Comentarios:
                    </h4>
                    <p className="text-[color:var(--color-heading)] bg-[color:var(--color-surface)] border border-[color:var(--color-border)]/30 p-3 rounded-lg">
                      &ldquo;{selectedReview.reviewText}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {/* Admin Response */}
              <div className="mb-6">
                <label
                  htmlFor="adminResponse"
                  className="block text-sm font-medium text-[color:var(--color-heading)] mb-2"
                >
                  Tu respuesta (opcional):
                </label>
                <textarea
                  id="adminResponse"
                  rows={3}
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Escribe una respuesta para el cliente..."
                  className="w-full px-3 py-2 border border-[color:var(--color-border)]/30 rounded-lg focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)] bg-[color:var(--color-surface)] text-[color:var(--color-heading)]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {selectedReview.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => updateReviewStatus(selectedReview.id, "APPROVED", true)}
                      disabled={submitting}
                      className="flex-1 bg-[color:var(--status-confirmed-text)] text-white py-2 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? "Procesando..." : "Aprobar y Publicar"}
                    </button>
                    <button
                      onClick={() => updateReviewStatus(selectedReview.id, "APPROVED", false)}
                      disabled={submitting}
                      className="flex-1 bg-[color:var(--color-primary)] text-white py-2 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? "Procesando..." : "Aprobar (Privada)"}
                    </button>
                    <button
                      onClick={() => updateReviewStatus(selectedReview.id, "REJECTED")}
                      disabled={submitting}
                      className="flex-1 bg-[color:var(--status-cancelled-text)] text-white py-2 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? "Procesando..." : "Rechazar"}
                    </button>
                  </>
                )}

                {selectedReview.status === "APPROVED" && (
                  <button
                    onClick={() =>
                      updateReviewStatus(selectedReview.id, "APPROVED", !selectedReview.isPublic)
                    }
                    disabled={submitting}
                    className="flex-1 bg-[color:var(--color-primary)] text-white py-2 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting
                      ? "Procesando..."
                      : selectedReview.isPublic
                        ? "Hacer Privada"
                        : "Hacer Pública"}
                  </button>
                )}

                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[color:var(--color-border)]/30 text-[color:var(--color-heading)] rounded-lg hover:bg-[color:var(--color-surface)] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
