'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Complaint {
  complaintNumber: string;
  submissionDate: string;
  complaintType: 'QUEJA' | 'RECLAMO';
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  responseDate?: string;
  response?: string;
  customerName: string;
  serviceType?: string;
}

export default function ComplaintStatus() {
  const [complaintNumber, setComplaintNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!complaintNumber.trim()) {
      setError('Por favor ingrese el número de queja/reclamo');
      return;
    }

    setIsSearching(true);
    setError('');
    setComplaint(null);

    try {
      const response = await fetch(`/api/complaints?number=${encodeURIComponent(complaintNumber)}`);
      
      if (response.ok) {
        const data = await response.json();
        setComplaint(data.complaint);
      } else {
        setError('Queja/reclamo no encontrado. Verifique el número ingresado.');
      }
    } catch (error) {
      setError('Error al consultar el estado. Intente nuevamente.');
      console.error('Error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente de Revisión';
      case 'IN_PROGRESS':
        return 'En Proceso';
      case 'RESOLVED':
        return 'Resuelto';
      case 'CLOSED':
        return 'Cerrado';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-playfair text-primary-dark mb-4">
              Consultar Estado de Queja/Reclamo
            </h1>
            <p className="text-lg text-neutral max-w-3xl mx-auto">
              Ingrese el número de registro de su queja o reclamo para consultar su estado y respuesta.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label htmlFor="complaintNumber" className="block text-neutral font-medium mb-2">
                  Número de Queja/Reclamo
                </label>
                <input
                  type="text"
                  id="complaintNumber"
                  value={complaintNumber}
                  onChange={(e) => setComplaintNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
                  placeholder="Ejemplo: MCM-20250708-001"
                />
                <p className="text-sm text-neutral mt-2">
                  El número de registro se proporcionó al enviar su queja/reclamo
                </p>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSearching}
                  className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                    isSearching
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {isSearching ? 'Consultando...' : 'Consultar Estado'}
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Results */}
          {complaint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8 lg:p-12"
            >
              <h2 className="text-2xl font-playfair text-primary-dark mb-6">
                Información de su Queja/Reclamo
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-primary-dark mb-2">Número de Registro</h3>
                  <p className="text-neutral">{complaint.complaintNumber}</p>
                </div>

                <div>
                  <h3 className="font-medium text-primary-dark mb-2">Fecha de Presentación</h3>
                  <p className="text-neutral">
                    {new Date(complaint.submissionDate).toLocaleDateString('es-PE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-primary-dark mb-2">Tipo</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    complaint.complaintType === 'QUEJA' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {complaint.complaintType}
                  </span>
                </div>

                <div>
                  <h3 className="font-medium text-primary-dark mb-2">Estado Actual</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(complaint.status)}`}>
                    {getStatusText(complaint.status)}
                  </span>
                </div>

                {complaint.serviceType && (
                  <div>
                    <h3 className="font-medium text-primary-dark mb-2">Servicio</h3>
                    <p className="text-neutral">{complaint.serviceType}</p>
                  </div>
                )}

                {complaint.responseDate && (
                  <div>
                    <h3 className="font-medium text-primary-dark mb-2">Fecha de Respuesta</h3>
                    <p className="text-neutral">
                      {new Date(complaint.responseDate).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>

              {complaint.response && (
                <div className="border-t pt-6">
                  <h3 className="font-medium text-primary-dark mb-4">Respuesta de la Empresa</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-neutral leading-relaxed">{complaint.response}</p>
                  </div>
                </div>
              )}

              {complaint.status === 'PENDING' && (
                <div className="border-t pt-6">
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Estado: Pendiente de Revisión</h4>
                    <p className="text-yellow-700 text-sm">
                      Su {complaint.complaintType.toLowerCase()} está siendo revisada. 
                      Responderemos en un plazo máximo de {complaint.complaintType === 'QUEJA' ? '5' : '15'} días hábiles.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Information */}
          <div className="mt-8 bg-primary-accent/10 p-6 rounded-2xl">
            <h3 className="text-xl font-playfair text-primary-dark mb-4">
              Información Importante
            </h3>
            <div className="text-neutral space-y-2">
              <p>• <strong>Quejas:</strong> Respuesta máxima en 5 días hábiles</p>
              <p>• <strong>Reclamos:</strong> Respuesta máxima en 15 días hábiles</p>
              <p>• Si no está conforme con nuestra respuesta, puede acudir a INDECOPI</p>
              <p>• Para más información, contáctenos al +51 989 164 990 o marcelacordero.bookings@gmail.com</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
