'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ComplaintBook() {
  const [formData, setFormData] = useState({
    // Datos del consumidor
    customerName: '',
    customerDni: '',
    customerAddress: '',
    customerPhone: '',
    customerEmail: '',
    
    // Datos del servicio
    serviceDate: '',
    serviceLocation: '',
    serviceType: '',
    serviceAmount: '',
    
    // Tipo de reclamo
    complaintType: '', // 'queja' o 'reclamo'
    
    // Detalle del reclamo
    complaintDetail: '',
    customerRequest: '',
    
    // Datos adicionales
    hasEvidence: false,
    evidenceDescription: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [complaintNumber, setComplaintNumber] = useState('');

  const serviceTypes = [
    'Maquillaje de Novia',
    'Maquillaje Social',
    'Sesión Fotográfica',
    'Peinado Profesional',
    'Asesoría de Imagen',
    'Otro',
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const generateComplaintNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `MCM-${year}${month}${day}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const number = generateComplaintNumber();
      setComplaintNumber(number);

      // Aquí enviarías los datos a tu API
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          complaintNumber: number,
          submissionDate: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitMessage('Su queja/reclamo ha sido registrado exitosamente.');
        // Reset form
        setFormData({
          customerName: '',
          customerDni: '',
          customerAddress: '',
          customerPhone: '',
          customerEmail: '',
          serviceDate: '',
          serviceLocation: '',
          serviceType: '',
          serviceAmount: '',
          complaintType: '',
          complaintDetail: '',
          customerRequest: '',
          hasEvidence: false,
          evidenceDescription: '',
        });
      } else {
        throw new Error('Error al registrar la queja/reclamo');
      }
    } catch (error) {
      setSubmitMessage('Hubo un error al registrar su queja/reclamo. Por favor intente nuevamente.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() - 30);
  const minDate = maxDate.toISOString().split('T')[0];

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
              Libro de Reclamaciones
            </h1>
            <p className="text-lg text-neutral max-w-3xl mx-auto">
              Este libro de reclamaciones cumple con lo establecido en el Código de Protección y 
              Defensa del Consumidor (Ley N° 29571) y permite registrar quejas y reclamos sobre 
              nuestros servicios.
            </p>
          </div>

          {/* Información Legal */}
          <div className="bg-primary-dark text-white p-6 rounded-2xl mb-8">
            <h2 className="text-2xl font-playfair mb-4">Información Importante</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2 text-primary-accent">¿Qué es una QUEJA?</h3>
                <p className="text-sm text-gray-300">
                  Disconformidad no relacionada directamente con el servicio, sino con la 
                  atención al cliente, demoras en respuesta, trato inadecuado, etc.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-primary-accent">¿Qué es un RECLAMO?</h3>
                <p className="text-sm text-gray-300">
                  Disconformidad relacionada directamente con el servicio prestado, calidad 
                  del maquillaje, productos utilizados, cumplimiento de horarios, etc.
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">
                <strong>Plazo:</strong> Tiene hasta 30 días calendario desde ocurrido el hecho para presentar su queja o reclamo.
                <br />
                <strong>Respuesta:</strong> Quejas (5 días hábiles) | Reclamos (15 días hábiles)
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Datos del Consumidor */}
              <section>
                <h3 className="text-2xl font-playfair text-primary-dark mb-6 border-b pb-2">
                  1. Datos del Consumidor
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="customerName" className="block text-neutral font-medium mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
                      placeholder="Nombres y apellidos completos"
                    />
                  </div>

                  <div>
                    <label htmlFor="customerDni" className="block text-neutral font-medium mb-2">
                      DNI / Documento de Identidad *
                    </label>
                    <input
                      type="text"
                      id="customerDni"
                      name="customerDni"
                      value={formData.customerDni}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
                      placeholder="Número de DNI"
                      pattern="[0-9]{8}"
                      maxLength={8}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="customerAddress" className="block text-neutral font-medium mb-2">
                    Dirección Completa *
                  </label>
                  <input
                    type="text"
                    id="customerAddress"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
                    placeholder="Dirección completa con distrito"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label htmlFor="customerPhone" className="block text-neutral font-medium mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      id="customerPhone"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
                      placeholder="+51 999 999 999"
                    />
                  </div>

                  <div>
                    <label htmlFor="customerEmail" className="block text-neutral font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="customerEmail"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
                      placeholder="su@email.com"
                    />
                  </div>
                </div>
              </section>

              {/* Datos del Servicio */}
              <section>
                <h3 className="text-2xl font-playfair text-primary-dark mb-6 border-b pb-2">
                  2. Datos del Servicio
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="serviceDate" className="block text-neutral font-medium mb-2">
                      Fecha del Servicio *
                    </label>
                    <input
                      type="date"
                      id="serviceDate"
                      name="serviceDate"
                      value={formData.serviceDate}
                      onChange={handleInputChange}
                      required
                      min={minDate}
                      max={today}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="serviceType" className="block text-neutral font-medium mb-2">
                      Tipo de Servicio *
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
                    >
                      <option value="">Seleccione el servicio</option>
                      {serviceTypes.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label htmlFor="serviceLocation" className="block text-neutral font-medium mb-2">
                      Lugar del Servicio *
                    </label>
                    <input
                      type="text"
                      id="serviceLocation"
                      name="serviceLocation"
                      value={formData.serviceLocation}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
                      placeholder="Dirección donde se prestó el servicio"
                    />
                  </div>

                  <div>
                    <label htmlFor="serviceAmount" className="block text-neutral font-medium mb-2">
                      Monto Pagado
                    </label>
                    <input
                      type="number"
                      id="serviceAmount"
                      name="serviceAmount"
                      value={formData.serviceAmount}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </section>

              {/* Tipo de Queja/Reclamo */}
              <section>
                <h3 className="text-2xl font-playfair text-primary-dark mb-6 border-b pb-2">
                  3. Tipo de Queja/Reclamo
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="queja"
                      name="complaintType"
                      value="queja"
                      checked={formData.complaintType === 'queja'}
                      onChange={handleInputChange}
                      className="mr-3"
                      required
                    />
                    <label htmlFor="queja" className="text-neutral">
                      <strong>QUEJA</strong> - Disconformidad con la atención al cliente
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="reclamo"
                      name="complaintType"
                      value="reclamo"
                      checked={formData.complaintType === 'reclamo'}
                      onChange={handleInputChange}
                      className="mr-3"
                      required
                    />
                    <label htmlFor="reclamo" className="text-neutral">
                      <strong>RECLAMO</strong> - Disconformidad con el servicio prestado
                    </label>
                  </div>
                </div>
              </section>

              {/* Detalle del Reclamo */}
              <section>
                <h3 className="text-2xl font-playfair text-primary-dark mb-6 border-b pb-2">
                  4. Detalle de la Queja/Reclamo
                </h3>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="complaintDetail" className="block text-neutral font-medium mb-2">
                      Describa detalladamente los hechos *
                    </label>
                    <textarea
                      id="complaintDetail"
                      name="complaintDetail"
                      value={formData.complaintDetail}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
                      placeholder="Describa con el mayor detalle posible lo ocurrido, incluyendo fecha, hora, personas involucradas, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="customerRequest" className="block text-neutral font-medium mb-2">
                      ¿Qué solución solicita? *
                    </label>
                    <textarea
                      id="customerRequest"
                      name="customerRequest"
                      value={formData.customerRequest}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
                      placeholder="Indique específicamente qué solución o compensación espera recibir"
                    />
                  </div>
                </div>
              </section>

              {/* Evidencias */}
              <section>
                <h3 className="text-2xl font-playfair text-primary-dark mb-6 border-b pb-2">
                  5. Evidencias
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasEvidence"
                      name="hasEvidence"
                      checked={formData.hasEvidence}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <label htmlFor="hasEvidence" className="text-neutral">
                      Adjunto evidencias (fotografías, documentos, etc.)
                    </label>
                  </div>

                  {formData.hasEvidence && (
                    <div>
                      <label htmlFor="evidenceDescription" className="block text-neutral font-medium mb-2">
                        Describa las evidencias adjuntas
                      </label>
                      <textarea
                        id="evidenceDescription"
                        name="evidenceDescription"
                        value={formData.evidenceDescription}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
                        placeholder="Describa qué evidencias está adjuntando y envíelas por email a marcela@marcelamakeup.com"
                      />
                    </div>
                  )}
                </div>
              </section>

              {/* Información Legal */}
              <section className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-primary-dark mb-4">
                  Información sobre el procedimiento
                </h4>
                <div className="text-sm text-neutral space-y-2">
                  <p>• La empresa debe responder en un plazo máximo de 5 días hábiles para quejas y 15 días hábiles para reclamos.</p>
                  <p>• Usted puede acudir a INDECOPI si no está conforme con la respuesta de la empresa.</p>
                  <p>• La presentación de esta queja/reclamo no tiene costo alguno para usted.</p>
                  <p>• Mantenga el número de registro que se le proporcionará para hacer seguimiento.</p>
                </div>
              </section>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-4 rounded-lg font-medium transition-colors ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {isSubmitting ? 'Registrando...' : 'Registrar Queja/Reclamo'}
                </button>
              </div>

              {/* Success/Error Message */}
              {submitMessage && (
                <div
                  className={`p-6 rounded-lg text-center ${
                    submitMessage.includes('exitosamente')
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <p className="font-medium">{submitMessage}</p>
                  {complaintNumber && (
                    <p className="mt-2 text-lg">
                      <strong>Número de registro: {complaintNumber}</strong>
                      <br />
                      <span className="text-sm">Guarde este número para hacer seguimiento de su queja/reclamo</span>
                      <br />
                      <a 
                        href="/consultar-reclamo" 
                        className="text-primary-accent hover:underline text-sm mt-2 inline-block"
                      >
                        Consultar estado de mi queja/reclamo →
                      </a>
                    </p>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Información de Contacto */}
          <div className="mt-8 bg-primary-accent/10 p-6 rounded-2xl">
            <h3 className="text-xl font-playfair text-primary-dark mb-4">
              Información de la Empresa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-neutral">
              <div>
                <p><strong>Razón Social:</strong> Marcela Cordero - Makeup Artist</p>
                <p><strong>Dirección:</strong> Lima, Perú</p>
              </div>
              <div>
                <p><strong>Teléfono:</strong> +51 999 123 456</p>
                <p><strong>Email:</strong> marcela@marcelamakeup.com</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
