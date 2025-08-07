"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Trash2,
  Filter,
  Search,
} from "lucide-react";

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
  const [filter, setFilter] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  >("ALL");
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pendiente";
      case "APPROVED":
        return "Aprobada";
      case "REJECTED":
        return "Rechazada";
      default:
        return status;
    }
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
          i < rating ? "text-[#D4AF37] fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.appointment.clientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (review.reviewText &&
        review.reviewText.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Reseñas
          </h1>
          <p className="text-gray-600">
            Administra las reseñas de tus clientes
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(
                    e.target.value as
                      | "ALL"
                      | "PENDING"
                      | "APPROVED"
                      | "REJECTED",
                  )
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              >
                <option value="ALL">Todas</option>
                <option value="PENDING">Pendientes</option>
                <option value="APPROVED">Aprobadas</option>
                <option value="REJECTED">Rechazadas</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre del cliente o contenido de la reseña..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando reseñas...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No se encontraron reseñas</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredReviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {review.reviewerName}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(review.status)}`}
                      >
                        {getStatusText(review.status)}
                      </span>
                      {review.isPublic && review.status === "APPROVED" && (
                        <span className="px-2 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-800">
                          Pública
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">
                        ({review.rating}/5)
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Cliente: {review.appointment.clientName} •{" "}
                      {formatDate(review.appointment.appointmentDate)}
                    </p>
                    {review.reviewText && (
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mb-3">
                        &ldquo;{review.reviewText}&rdquo;
                      </p>
                    )}
                    {review.adminResponse && (
                      <div className="bg-[#D4AF37]/10 p-3 rounded-lg border-l-4 border-[#D4AF37]">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Tu respuesta:
                        </p>
                        <p className="text-sm text-gray-700">
                          {review.adminResponse}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Respondido el {formatDate(review.respondedAt!)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openModal(review)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver detalles y responder"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>

                    {review.status === "PENDING" && (
                      <>
                        <button
                          onClick={() =>
                            updateReviewStatus(review.id, "APPROVED", true)
                          }
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Aprobar y hacer pública"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            updateReviewStatus(review.id, "REJECTED")
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Rechazar"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}

                    {review.status === "APPROVED" && (
                      <button
                        onClick={() =>
                          updateReviewStatus(
                            review.id,
                            "APPROVED",
                            !review.isPublic,
                          )
                        }
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title={
                          review.isPublic
                            ? "Ocultar de público"
                            : "Hacer pública"
                        }
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
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar reseña"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Enviada el {formatDate(review.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {(pagination.page - 1) * pagination.limit + 1} a{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                de {pagination.total} reseñas
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={pagination.page === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-700">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Detalle de Reseña
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Review Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {selectedReview.reviewerName}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(selectedReview.rating)}
                    <span className="text-sm text-gray-600">
                      ({selectedReview.rating}/5)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {selectedReview.reviewerEmail} •{" "}
                    {formatDate(selectedReview.createdAt)}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Información de la cita:
                  </h4>
                  <p className="text-sm text-gray-600">
                    Cliente: {selectedReview.appointment.clientName}
                    <br />
                    Fecha:{" "}
                    {formatDate(selectedReview.appointment.appointmentDate)}
                    <br />
                    Servicio: {selectedReview.appointment.serviceType}
                  </p>
                </div>

                {selectedReview.reviewText && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Comentarios:
                    </h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      &ldquo;{selectedReview.reviewText}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {/* Admin Response */}
              <div className="mb-6">
                <label
                  htmlFor="adminResponse"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tu respuesta (opcional):
                </label>
                <textarea
                  id="adminResponse"
                  rows={3}
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Escribe una respuesta para el cliente..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {selectedReview.status === "PENDING" && (
                  <>
                    <button
                      onClick={() =>
                        updateReviewStatus(selectedReview.id, "APPROVED", true)
                      }
                      disabled={submitting}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? "Procesando..." : "Aprobar y Publicar"}
                    </button>
                    <button
                      onClick={() =>
                        updateReviewStatus(selectedReview.id, "APPROVED", false)
                      }
                      disabled={submitting}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? "Procesando..." : "Aprobar (Privada)"}
                    </button>
                    <button
                      onClick={() =>
                        updateReviewStatus(selectedReview.id, "REJECTED")
                      }
                      disabled={submitting}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? "Procesando..." : "Rechazar"}
                    </button>
                  </>
                )}

                {selectedReview.status === "APPROVED" && (
                  <button
                    onClick={() =>
                      updateReviewStatus(
                        selectedReview.id,
                        "APPROVED",
                        !selectedReview.isPublic,
                      )
                    }
                    disabled={submitting}
                    className="flex-1 bg-[#D4AF37] text-white py-2 px-4 rounded-lg hover:bg-[#B8941F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
