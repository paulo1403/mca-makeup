'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  AlertTriangle, 
  Eye, 
  AlertCircle, 
  Filter,
  Search,
  Calendar,
  User,
  Globe,
  Smartphone
} from 'lucide-react';

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
  errorType: 'RUNTIME' | 'NETWORK' | 'UI' | 'BOOKING' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ErrorReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ErrorReport | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const queryClient = useQueryClient();

  // Fetch error reports
  const { data: reports = [], isLoading } = useQuery<ErrorReport[]>({
    queryKey: ['error-reports', statusFilter, severityFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (severityFilter !== 'all') params.append('severity', severityFilter);
      
      const response = await fetch(`/api/admin/error-reports?${params}`);
      if (!response.ok) throw new Error('Failed to fetch error reports');
      return response.json();
    },
  });

  // Update report status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ reportId, status }: { reportId: string; status: string }) => {
      const response = await fetch(`/api/admin/error-reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['error-reports'] });
      setSelectedReport(null);
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'ACKNOWLEDGED': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'IN_PROGRESS': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'RESOLVED': return 'text-green-600 bg-green-50 border-green-200';
      case 'CLOSED': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'RUNTIME': return <AlertTriangle className="w-4 h-4" />;
      case 'NETWORK': return <Globe className="w-4 h-4" />;
      case 'UI': return <Smartphone className="w-4 h-4" />;
      case 'BOOKING': return <Calendar className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredReports = reports.filter(report =>
    report.reportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.userDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.errorMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'PENDING').length,
    critical: reports.filter(r => r.severity === 'CRITICAL').length,
    resolved: reports.filter(r => r.status === 'RESOLVED').length,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1C1C1C] mb-2">Reportes de Errores</h1>
        <p className="text-gray-600">Gestiona y resuelve los problemas reportados por los usuarios</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total de reportes</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pendientes</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          <div className="text-sm text-gray-600">Críticos</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="text-sm text-gray-600">Resueltos</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ID, usuario, descripción..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gravedad
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
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
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporte
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gravedad
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{report.reportId}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {report.userDescription}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.userName}</div>
                        {report.userEmail && (
                          <div className="text-sm text-gray-500">{report.userEmail}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getTypeIcon(report.errorType)}
                      <span className="ml-2 text-sm text-gray-900">{report.errorType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(report.severity)}`}>
                      {report.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(report.createdAt).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-[#D4AF37] hover:text-[#B8941F] text-sm font-medium flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron reportes</p>
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal content would go here */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Reporte: {selectedReport.reportId}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(selectedReport.severity)}`}>
                      {selectedReport.severity}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedReport.status)}`}>
                      {selectedReport.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Detailed report content */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Información del Usuario</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-gray-800">
                      <div><strong className="text-gray-900">Nombre:</strong> {selectedReport.userName}</div>
                      {selectedReport.userEmail && (
                        <div><strong className="text-gray-900">Email:</strong> {selectedReport.userEmail}</div>
                      )}
                      <div><strong className="text-gray-900">IP:</strong> {selectedReport.ipAddress || 'No disponible'}</div>
                      <div><strong className="text-gray-900">Fecha:</strong> {new Date(selectedReport.timestamp).toLocaleString('es-ES')}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Información Técnica</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-gray-800">
                      <div><strong className="text-gray-900">URL:</strong> <code className="text-xs bg-white px-1 rounded text-gray-800">{selectedReport.url}</code></div>
                      <div><strong className="text-gray-900">Tipo:</strong> {selectedReport.errorType}</div>
                      <div><strong className="text-gray-900">User Agent:</strong> <code className="text-xs bg-white px-1 rounded break-all text-gray-800">{selectedReport.userAgent}</code></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Descripción del Usuario</h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-900">{selectedReport.userDescription}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Error Técnico</h4>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="mb-2 text-gray-800"><strong className="text-gray-900">Mensaje:</strong> {selectedReport.errorMessage}</div>
                    {selectedReport.errorStack && (
                      <div className="text-gray-800">
                        <strong className="text-gray-900">Stack Trace:</strong>
                        <pre className="text-xs bg-white p-2 rounded mt-2 overflow-x-auto whitespace-pre-wrap text-gray-800">
                          {selectedReport.errorStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status update */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Actualizar Estado</h4>
                  <div className="flex flex-wrap gap-2">
                    {['ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatusMutation.mutate({ 
                          reportId: selectedReport.id, 
                          status 
                        })}
                        disabled={updateStatusMutation.isPending}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedReport.status === status
                            ? 'bg-[#D4AF37] text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } disabled:opacity-50`}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
