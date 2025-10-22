"use client";

import Button from "@/components/ui/Button";
import Modal, { ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import Typography from "@/components/ui/Typography";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Eye,
  Filter,
  Globe,
  Search,
  Smartphone,
  User,
} from "lucide-react";
import { useState } from "react";

interface ErrorReport {
  id: string;
  reportId: string;
  userEmail?: string;
  userName: string;
  errorMessage: string;
  errorStack?: string;
  userAgent: string;
  url: string;
  timestamp: string;
  userDescription: string;
  errorType: "RUNTIME" | "NETWORK" | "UI" | "BOOKING" | "OTHER";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "PENDING" | "ACKNOWLEDGED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ErrorReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ErrorReport | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();

  // Fetch error reports
  const { data: reports = [], isLoading } = useQuery<ErrorReport[]>({
    queryKey: ["error-reports", statusFilter, severityFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (severityFilter !== "all") params.append("severity", severityFilter);

      const response = await fetch(`/api/admin/error-reports?${params}`);
      if (!response.ok) throw new Error("Failed to fetch error reports");
      return response.json();
    },
  });

  // Update report status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ reportId, status }: { reportId: string; status: string }) => {
      const response = await fetch(`/api/admin/error-reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["error-reports"] });
      setSelectedReport(null);
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "text-red-500 bg-red-500/10 border-red-400/30";
      case "HIGH":
        return "text-orange-500 bg-orange-500/10 border-orange-400/30";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-500/10 border-yellow-400/30";
      case "LOW":
        return "text-green-500 bg-green-500/10 border-green-400/30";
      default:
        return "text-[color:var(--color-muted)] bg-[color:var(--color-surface-elevated)] border-[color:var(--color-border)]";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-600 bg-yellow-500/10 border-yellow-400/30";
      case "ACKNOWLEDGED":
        return "text-blue-500 bg-blue-500/10 border-blue-400/30";
      case "IN_PROGRESS":
        return "text-purple-500 bg-purple-500/10 border-purple-400/30";
      case "RESOLVED":
        return "text-green-500 bg-green-500/10 border-green-400/30";
      case "CLOSED":
        return "text-[color:var(--color-muted)] bg-[color:var(--color-surface-elevated)] border-[color:var(--color-border)]";
      default:
        return "text-[color:var(--color-muted)] bg-[color:var(--color-surface-elevated)] border-[color:var(--color-border)]";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "RUNTIME":
        return <AlertTriangle className="w-4 h-4" />;
      case "NETWORK":
        return <Globe className="w-4 h-4" />;
      case "UI":
        return <Smartphone className="w-4 h-4" />;
      case "BOOKING":
        return <Calendar className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredReports = reports.filter(
    (report) =>
      report.reportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.userDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.errorMessage.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "PENDING").length,
    critical: reports.filter((r) => r.severity === "CRITICAL").length,
    resolved: reports.filter((r) => r.status === "RESOLVED").length,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Typography as="h1" variant="h2" className="text-[color:var(--color-heading)] mb-2">
          Reportes de Errores
        </Typography>
        <Typography className="text-[color:var(--color-body)]">
          Gestiona y resuelve los problemas reportados por los usuarios
        </Typography>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[color:var(--color-surface-elevated)] rounded-lg p-4 border border-[color:var(--color-border)]">
          <div className="text-2xl font-bold text-[color:var(--color-heading)]">{stats.total}</div>
          <Typography variant="caption" className="text-[color:var(--color-muted)]">
            Total de reportes
          </Typography>
        </div>
        <div className="bg-[color:var(--color-surface-elevated)] rounded-lg p-4 border border-[color:var(--color-border)]">
          <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
          <Typography variant="caption" className="text-[color:var(--color-muted)]">
            Pendientes
          </Typography>
        </div>
        <div className="bg-[color:var(--color-surface-elevated)] rounded-lg p-4 border border-[color:var(--color-border)]">
          <div className="text-2xl font-bold text-red-500">{stats.critical}</div>
          <Typography variant="caption" className="text-[color:var(--color-muted)]">
            Críticos
          </Typography>
        </div>
        <div className="bg-[color:var(--color-surface-elevated)] rounded-lg p-4 border border-[color:var(--color-border)]">
          <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
          <Typography variant="caption" className="text-[color:var(--color-muted)]">
            Resueltos
          </Typography>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[color:var(--color-surface-elevated)] rounded-lg p-6 mb-8 border border-[color:var(--color-border)]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Typography
              as="label"
              variant="small"
              className="block text-sm font-medium text-[color:var(--color-heading)] mb-2"
            >
              <Search className="w-4 h-4 inline mr-1" />
              Buscar
            </Typography>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ID, usuario, descripción..."
              className="w-full px-3 py-2 border rounded-lg border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-body)] focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]"
            />
          </div>
          <div>
            <Typography
              as="label"
              variant="small"
              className="block text-sm font-medium text-[color:var(--color-heading)] mb-2"
            >
              <Filter className="w-4 h-4 inline mr-1" />
              Estado
            </Typography>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-body)] focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]"
            >
              <option value="all">Todos</option>
              <option value="PENDING">Pendiente</option>
              <option value="ACKNOWLEDGED">Reconocido</option>
              <option value="IN_PROGRESS">En progreso</option>
              <option value="RESOLVED">Resuelto</option>
              <option value="CLOSED">Cerrado</option>
            </select>
          </div>
          <div>
            <Typography
              as="label"
              variant="small"
              className="block text-sm font-medium text-[color:var(--color-heading)] mb-2"
            >
              Gravedad
            </Typography>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-body)] focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]"
            >
              <option value="all">Todas</option>
              <option value="CRITICAL">Crítica</option>
              <option value="HIGH">Alta</option>
              <option value="MEDIUM">Media</option>
              <option value="LOW">Baja</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-[color:var(--color-surface)] rounded-lg border border-[color:var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[color:var(--color-surface-elevated)] border-b border-[color:var(--color-border)]">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
                  Reporte
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
                  Usuario
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
                  Tipo
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
                  Gravedad
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
                  Fecha
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-border)]">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-[color:var(--color-surface-elevated)]">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-[color:var(--color-heading)]">
                        {report.reportId}
                      </div>
                      <div className="text-sm text-[color:var(--color-muted)] truncate max-w-xs">
                        {report.userDescription}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-[color:var(--color-muted)] mr-2" />
                      <div>
                        <div className="text-sm font-medium text-[color:var(--color-heading)]">
                          {report.userName}
                        </div>
                        {report.userEmail && (
                          <div className="text-sm text-[color:var(--color-muted)]">
                            {report.userEmail}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getTypeIcon(report.errorType)}
                      <span className="ml-2 text-sm text-[color:var(--color-heading)]">
                        {report.errorType}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(report.severity)}`}
                    >
                      {report.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(report.status)}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[color:var(--color-heading)]">
                    {new Date(report.createdAt).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      as="button"
                      onClick={() => setSelectedReport(report)}
                      variant="soft"
                      size="sm"
                      className="inline-flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-[color:var(--color-muted)] mx-auto mb-4" />
            <Typography className="text-[color:var(--color-muted)]">
              No se encontraron reportes
            </Typography>
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <Modal
          open={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          size="xl"
          ariaLabelledBy="error-report-title"
        >
          <ModalHeader
            title={
              <Typography as="span" id="error-report-title" variant="h3">
                Reporte: {selectedReport.reportId}
              </Typography>
            }
            onClose={() => setSelectedReport(null)}
          />
          <ModalBody>
            {/* Badges */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(selectedReport.severity)}`}
              >
                {selectedReport.severity}
              </span>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedReport.status)}`}
              >
                {selectedReport.status}
              </span>
            </div>

            {/* Detailed report content */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Typography
                    variant="small"
                    className="font-semibold text-[color:var(--color-heading)] mb-2"
                  >
                    Información del Usuario
                  </Typography>
                  <div className="bg-[color:var(--color-surface-elevated)] rounded-lg p-4 space-y-2 text-[color:var(--color-body)] border border-[color:var(--color-border)]">
                    <div>
                      <span className="font-semibold text-[color:var(--color-heading)]">
                        Nombre:
                      </span>{" "}
                      {selectedReport.userName}
                    </div>
                    {selectedReport.userEmail && (
                      <div>
                        <span className="font-semibold text-[color:var(--color-heading)]">
                          Email:
                        </span>{" "}
                        {selectedReport.userEmail}
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-[color:var(--color-heading)]">IP:</span>{" "}
                      {selectedReport.ipAddress || "No disponible"}
                    </div>
                    <div>
                      <span className="font-semibold text-[color:var(--color-heading)]">
                        Fecha:
                      </span>{" "}
                      {new Date(selectedReport.timestamp).toLocaleString("es-ES")}
                    </div>
                  </div>
                </div>
                <div>
                  <Typography
                    variant="small"
                    className="font-semibold text-[color:var(--color-heading)] mb-2"
                  >
                    Información Técnica
                  </Typography>
                  <div className="bg-[color:var(--color-surface-elevated)] rounded-lg p-4 space-y-2 text-[color:var(--color-body)] border border-[color:var(--color-border)]">
                    <div>
                      <span className="font-semibold text-[color:var(--color-heading)]">URL:</span>{" "}
                      <code className="text-xs bg-[color:var(--color-surface)] px-1 rounded text-[color:var(--color-body)] border border-[color:var(--color-border)]">
                        {selectedReport.url}
                      </code>
                    </div>
                    <div>
                      <span className="font-semibold text-[color:var(--color-heading)]">Tipo:</span>{" "}
                      {selectedReport.errorType}
                    </div>
                    <div>
                      <span className="font-semibold text-[color:var(--color-heading)]">
                        User Agent:
                      </span>{" "}
                      <code className="text-xs bg-[color:var(--color-surface)] px-1 rounded break-all text-[color:var(--color-body)] border border-[color:var(--color-border)]">
                        {selectedReport.userAgent}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Typography
                  variant="small"
                  className="font-semibold text-[color:var(--color-heading)] mb-2"
                >
                  Descripción del Usuario
                </Typography>
                <div className="bg-[color:var(--color-surface-elevated)] rounded-lg p-4 border border-[color:var(--color-border)]">
                  <Typography className="text-[color:var(--color-body)]">
                    {selectedReport.userDescription}
                  </Typography>
                </div>
              </div>

              <div>
                <Typography
                  variant="small"
                  className="font-semibold text-[color:var(--color-heading)] mb-2"
                >
                  Error Técnico
                </Typography>
                <div className="bg-[color:var(--color-surface-elevated)] rounded-lg p-4 border border-[color:var(--color-border)]">
                  <div className="mb-2 text-[color:var(--color-body)]">
                    <span className="font-semibold text-[color:var(--color-heading)]">
                      Mensaje:
                    </span>{" "}
                    {selectedReport.errorMessage}
                  </div>
                  {selectedReport.errorStack && (
                    <div className="text-[color:var(--color-body)]">
                      <span className="font-semibold text-[color:var(--color-heading)]">
                        Stack Trace:
                      </span>
                      <pre className="text-xs bg-[color:var(--color-surface)] p-2 rounded mt-2 overflow-x-auto whitespace-pre-wrap text-[color:var(--color-body)] border border-[color:var(--color-border)]">
                        {selectedReport.errorStack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
              {["ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((status) => (
                <Button
                  key={status}
                  type="button"
                  onClick={() =>
                    updateStatusMutation.mutate({ reportId: selectedReport.id, status })
                  }
                  disabled={updateStatusMutation.isPending}
                  variant={selectedReport.status === status ? "primary" : "soft"}
                  size="md"
                  className="min-w-[140px]"
                >
                  {status.replace("_", " ")}
                </Button>
              ))}
            </div>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
