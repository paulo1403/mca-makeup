"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ComplaintBook() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push("/");
    }
  };

  const [formData, setFormData] = useState({
    customerName: "",
    customerDni: "",
    customerAddress: "",
    customerPhone: "",
    customerEmail: "",
    serviceDate: "",
    serviceLocation: "",
    serviceType: "",
    serviceAmount: "",
    complaintType: "",
    complaintDetail: "",
    customerRequest: "",
    hasEvidence: false,
    evidenceDescription: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [complaintNumber, setComplaintNumber] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const generateComplaintNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `MCM-${year}${month}${day}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const number = generateComplaintNumber();
      setComplaintNumber(number);

      // Aquí enviarías los datos a tu API
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          complaintNumber: number,
          submissionDate: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitMessage("Su queja/reclamo ha sido registrado exitosamente.");
      } else {
        throw new Error("Error al enviar el reclamo");
      }
    } catch {
      setSubmitMessage("Error al enviar el reclamo. Por favor, intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Navigation */}
          <div className="mb-8">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-[color:var(--color-body)] hover:text-[color:var(--color-primary)] transition-colors duration-200 mb-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-serif text-[color:var(--color-heading)] mb-4">
              Libro de Reclamaciones
            </h1>
            <p className="text-lg text-[color:var(--color-body)] max-w-3xl mx-auto">
              Conforme a la Ley N° 29571 - Código de Protección y Defensa del Consumidor del Perú
            </p>
          </div>

          {/* Información importante */}
          <div className="bg-[color:var(--color-surface)] rounded-2xl border border-[color:var(--color-border)]/20 p-8 mb-8">
            <h2 className="text-2xl font-serif text-[color:var(--color-heading)] mb-4">
              Información Importante
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-[color:var(--color-primary)]/10 p-4 rounded-lg border border-[color:var(--color-primary)]/20">
                <h3 className="text-lg font-medium mb-2 text-[color:var(--color-primary)]">
                  ¿Qué es una QUEJA?
                </h3>
                <p className="text-sm text-[color:var(--color-body)]">
                  Disconformidad relacionada con la atención al público, demoras en la atención, o
                  aspectos que no involucren riesgos para la seguridad.
                </p>
              </div>

              <div className="bg-[color:var(--color-accent)]/10 p-4 rounded-lg border border-[color:var(--color-accent)]/20">
                <h3 className="text-lg font-medium mb-2 text-[color:var(--color-accent)]">
                  ¿Qué es un RECLAMO?
                </h3>
                <p className="text-sm text-[color:var(--color-body)]">
                  Disconformidad relacionada con el servicio prestado, productos defectuosos,
                  facturación o problemas que afecten los intereses económicos del consumidor.
                </p>
              </div>
            </div>

            <div className="bg-[color:var(--color-muted)]/10 p-4 rounded-lg border border-[color:var(--color-border)]">
              <p className="text-sm text-[color:var(--color-body)]">
                <strong>Importante:</strong> La presentación de este reclamo no impide acudir a
                otras vías de solución de controversias ni es requisito previo para interponer una
                denuncia ante el INDECOPI.
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-[color:var(--color-surface)] rounded-2xl border border-[color:var(--color-border)]/20 p-8 lg:p-12">
            {submitMessage ? (
              <div className="text-center py-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-green-800 mb-2">¡Reclamo Registrado!</h3>
                  <p className="text-green-700 mb-4">{submitMessage}</p>
                  {complaintNumber && (
                    <p className="text-sm text-green-600">
                      <strong>Número de reclamo:</strong> {complaintNumber}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSubmitMessage("");
                    setComplaintNumber("");
                    setFormData({
                      customerName: "",
                      customerDni: "",
                      customerAddress: "",
                      customerPhone: "",
                      customerEmail: "",
                      serviceDate: "",
                      serviceLocation: "",
                      serviceType: "",
                      serviceAmount: "",
                      complaintType: "",
                      complaintDetail: "",
                      customerRequest: "",
                      hasEvidence: false,
                      evidenceDescription: "",
                    });
                  }}
                  className="bg-[color:var(--color-primary)] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Nuevo Reclamo
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Datos del consumidor */}
                <section>
                  <h3 className="text-2xl font-serif text-[color:var(--color-heading)] mb-6 border-b border-[color:var(--color-border)] pb-2">
                    1. Datos del Consumidor
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="customerName"
                        className="block text-[color:var(--color-body)] font-medium mb-2"
                      >
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-surface)] text-[color:var(--color-body)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="customerDni"
                        className="block text-[color:var(--color-body)] font-medium mb-2"
                      >
                        DNI/Documento de Identidad *
                      </label>
                      <input
                        type="text"
                        id="customerDni"
                        name="customerDni"
                        value={formData.customerDni}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-surface)] text-[color:var(--color-body)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="customerAddress"
                        className="block text-[color:var(--color-body)] font-medium mb-2"
                      >
                        Dirección Completa *
                      </label>
                      <input
                        type="text"
                        id="customerAddress"
                        name="customerAddress"
                        value={formData.customerAddress}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-surface)] text-[color:var(--color-body)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="customerPhone"
                        className="block text-[color:var(--color-body)] font-medium mb-2"
                      >
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        id="customerPhone"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-surface)] text-[color:var(--color-body)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="customerEmail"
                        className="block text-[color:var(--color-body)] font-medium mb-2"
                      >
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        id="customerEmail"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-surface)] text-[color:var(--color-body)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
                      />
                    </div>
                  </div>
                </section>

                {/* Tipo de reclamo */}
                <section>
                  <h3 className="text-2xl font-serif text-[color:var(--color-heading)] mb-6 border-b border-[color:var(--color-border)] pb-2">
                    2. Tipo de Reclamo
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="flex items-center p-4 border border-[color:var(--color-border)] rounded-lg cursor-pointer hover:bg-[color:var(--color-surface-elevated)] transition-colors">
                      <input
                        type="radio"
                        name="complaintType"
                        value="queja"
                        checked={formData.complaintType === "queja"}
                        onChange={handleInputChange}
                        className="mr-3 text-[color:var(--color-primary)]"
                      />
                      <div>
                        <span className="font-medium text-[color:var(--color-heading)]">QUEJA</span>
                        <p className="text-sm text-[color:var(--color-body)] mt-1">
                          Disconformidad con la atención al cliente
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-[color:var(--color-border)] rounded-lg cursor-pointer hover:bg-[color:var(--color-surface-elevated)] transition-colors">
                      <input
                        type="radio"
                        name="complaintType"
                        value="reclamo"
                        checked={formData.complaintType === "reclamo"}
                        onChange={handleInputChange}
                        className="mr-3 text-[color:var(--color-primary)]"
                      />
                      <div>
                        <span className="font-medium text-[color:var(--color-heading)]">
                          RECLAMO
                        </span>
                        <p className="text-sm text-[color:var(--color-body)] mt-1">
                          Disconformidad con el servicio o producto
                        </p>
                      </div>
                    </label>
                  </div>
                </section>

                {/* Detalle del reclamo */}
                <section>
                  <h3 className="text-2xl font-serif text-[color:var(--color-heading)] mb-6 border-b border-[color:var(--color-border)] pb-2">
                    3. Detalle del Reclamo
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="complaintDetail"
                        className="block text-[color:var(--color-body)] font-medium mb-2"
                      >
                        Descripción del problema *
                      </label>
                      <textarea
                        id="complaintDetail"
                        name="complaintDetail"
                        value={formData.complaintDetail}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        placeholder="Describa detalladamente el problema o situación..."
                        className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-surface)] text-[color:var(--color-body)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="customerRequest"
                        className="block text-[color:var(--color-body)] font-medium mb-2"
                      >
                        Solución solicitada *
                      </label>
                      <textarea
                        id="customerRequest"
                        name="customerRequest"
                        value={formData.customerRequest}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        placeholder="¿Qué solución espera para este problema?"
                        className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-surface)] text-[color:var(--color-body)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
                      />
                    </div>
                  </div>
                </section>

                {/* Botón de envío */}
                <div className="flex justify-center pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-hover)] text-white font-medium px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Enviando..." : "Registrar Reclamo"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Información adicional */}
          <div className="mt-8 bg-[color:var(--color-surface)] rounded-2xl border border-[color:var(--color-border)]/20 p-6">
            <h3 className="text-lg font-medium text-[color:var(--color-heading)] mb-4">
              Información de Contacto
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-[color:var(--color-body)]">
              <div>
                <p>
                  <strong>Empresa:</strong> Marcela Cordero - Makeup Artist
                </p>
                <p>
                  <strong>Email:</strong> marcelacordero.bookings@gmail.com
                </p>
              </div>
              <div>
                <p>
                  <strong>WhatsApp:</strong> +51 989 164 990
                </p>
                <p>
                  <strong>Ubicación:</strong> Lima, Perú
                </p>
              </div>
            </div>
            <div className="mt-4 text-xs text-[color:var(--color-muted)]">
              <p>Tiempo de respuesta: Quejas (15 días), Reclamos (30 días)</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
