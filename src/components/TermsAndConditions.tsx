'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function TermsAndConditions() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push('/');
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-serif text-[color:var(--color-heading)] mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-lg text-[color:var(--color-body)]">
              Última actualización: {new Date().toLocaleDateString('es-PE')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-[color:var(--color-surface)] rounded-2xl border border-[color:var(--color-border)]/20 p-8 lg:p-12 space-y-8">
            
            {/* Introducción */}
            <section>
              <h2 className="text-2xl font-serif text-[color:var(--color-heading)] mb-4">
                1. Aceptación de Términos
              </h2>
              <p className="text-[color:var(--color-body)] leading-relaxed mb-4">
                Al contratar los servicios de Marcela Cordero - Makeup Artist, usted acepta estar sujeto a estos 
                Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, le solicitamos 
                que no utilice nuestros servicios.
              </p>
              <p className="text-[color:var(--color-body)] leading-relaxed">
                Estos términos se rigen por las leyes de la República del Perú y están sujetos a la 
                jurisdicción de los tribunales de Lima.
              </p>
            </section>

            {/* Servicios */}
            <section>
              <h2 className="text-2xl font-serif text-[color:var(--color-heading)] mb-4">
                2. Descripción de Servicios
              </h2>
              
              <h3 className="text-xl font-medium text-[color:var(--color-heading)] mb-3">
                2.1 Servicios Ofrecidos
              </h3>
              <ul className="list-disc list-inside text-[color:var(--color-body)] space-y-2 mb-4 ml-4">
                <li>Maquillaje profesional para novias</li>
                <li>Maquillaje social para eventos sociales</li>
                <li>Maquillaje para sesiones fotográficas</li>
                <li>Peinado profesional</li>
                <li>Asesoría de imagen personalizada</li>
                <li>Servicios a domicilio en Lima Metropolitana</li>
              </ul>

              <h3 className="text-xl font-medium text-[color:var(--color-heading)] mb-3">
                2.2 Disponibilidad
              </h3>
              <p className="text-[color:var(--color-body)] leading-relaxed">
                Los servicios están disponibles según disponibilidad y agenda. Nos reservamos el derecho 
                de limitar o rechazar servicios a nuestra discreción profesional.
              </p>
            </section>

            {/* Reservas y citas */}
            <section>
              <h2 className="text-2xl font-serif text-[color:var(--color-heading)] mb-4">
                3. Reservas y Citas
              </h2>
              
              <h3 className="text-xl font-medium text-[color:var(--color-heading)] mb-3">
                3.1 Proceso de Reserva
              </h3>
              <ul className="list-disc list-inside text-[color:var(--color-body)] space-y-2 mb-4 ml-4">
                <li>Las citas deben ser confirmadas con al menos 48 horas de anticipación</li>
                <li>Se requiere información completa del cliente y del evento</li>
                <li>La confirmación se realiza vía WhatsApp, email o llamada telefónica</li>
                <li>Para bodas y eventos sociales, se recomienda reservar con 2-4 semanas de anticipación</li>
              </ul>

              <h3 className="text-xl font-medium text-[color:var(--color-heading)] mb-3">
                3.2 Modificaciones
              </h3>
              <p className="text-[color:var(--color-body)] leading-relaxed mb-4">
                Los cambios de fecha, hora o ubicación deben solicitarse con al menos 24 horas de anticipación. 
                No garantizamos disponibilidad para cambios de último momento.
              </p>

              <h3 className="text-xl font-medium text-[color:var(--color-heading)] mb-3">
                3.3 Cancelaciones
              </h3>
              <ul className="list-disc list-inside text-[color:var(--color-body)] space-y-2 ml-4">
                <li><strong>Con más de 48 horas:</strong> Cancelación gratuita</li>
                <li><strong>24-48 horas:</strong> Se cobra el 50% del servicio</li>
                <li><strong>Menos de 24 horas:</strong> Se cobra el 100% del servicio</li>
                <li><strong>No presentarse:</strong> Se cobra el 100% del servicio</li>
              </ul>
            </section>

            {/* Precios y pagos */}
            <section>
              <h2 className="text-2xl font-serif text-[color:var(--color-heading)] mb-4">
                4. Precios y Formas de Pago
              </h2>
              
              <h3 className="text-xl font-medium text-[color:var(--color-heading)] mb-3">
                4.1 Precios
              </h3>
              <ul className="list-disc list-inside text-[color:var(--color-body)] space-y-2 mb-4 ml-4">
                <li>Los precios están sujetos a cambios sin previo aviso</li>
                <li>Incluyen productos profesionales de alta calidad</li>
                <li>No incluyen IGV (se cobra por separado según corresponda)</li>
                <li>Los servicios a domicilio pueden tener costo adicional de movilidad</li>
              </ul>

              <h3 className="text-xl font-medium text-[color:var(--color-heading)] mb-3">
                4.2 Formas de Pago
              </h3>
              <ul className="list-disc list-inside text-[color:var(--color-body)] space-y-2 mb-4 ml-4">
                <li>Efectivo</li>
                <li>Transferencia bancaria</li>
                <li>Yape / Plin</li>
                <li>Tarjeta de débito/crédito (sujeto a disponibilidad)</li>
              </ul>

              <h3 className="text-xl font-medium text-[color:var(--color-heading)] mb-3">
                4.3 Adelanto
              </h3>
              <p className="text-[color:var(--color-body)] leading-relaxed">
                Para servicios de bodas y eventos sociales, se requiere un adelanto del 50% para 
                confirmar la reserva. El saldo se paga el día del servicio.
              </p>
            </section>

            {/* Responsabilidades */}
            <section>
              <h2 className="text-2xl font-serif text-[color:var(--color-heading)] mb-4">
                5. Responsabilidades
              </h2>
              
              <h3 className="text-xl font-medium text-[color:var(--color-heading)] mb-3">
                5.1 Del Cliente
              </h3>
              <ul className="list-disc list-inside text-[color:var(--color-body)] space-y-2 mb-4 ml-4">
                <li>Informar sobre alergias, sensibilidades o condiciones de la piel</li>
                <li>Llegar puntualmente a la cita o estar disponible para servicios a domicilio</li>
                <li>Proporcionar un espacio adecuado con buena iluminación (servicios a domicilio)</li>
                <li>Tener el rostro limpio y sin maquillaje previo</li>
                <li>Respetar los horarios acordados</li>
              </ul>

              <h3 className="text-xl font-medium text-[color:var(--color-heading)] mb-3">
                5.2 De Marcela Cordero - Makeup Artist
              </h3>
              <ul className="list-disc list-inside text-[color:var(--color-body)] space-y-2 ml-4">
                <li>Utilizar productos profesionales de calidad</li>
                <li>Mantener altos estándares de higiene y seguridad</li>
                <li>Cumplir con los horarios acordados</li>
                <li>Brindar un servicio profesional de excelencia</li>
                <li>Respetar la privacidad y confidencialidad del cliente</li>
              </ul>
            </section>

            {/* Limitaciones */}
            <section>
              <h2 className="text-2xl font-serif text-[color:var(--color-heading)] mb-4">
                6. Limitaciones de Responsabilidad
              </h2>
              <ul className="list-disc list-inside text-[color:var(--color-body)] space-y-2 ml-4">
                <li>No somos responsables por reacciones alérgicas no informadas previamente</li>
                <li>La durabilidad del maquillaje depende de factores externos (clima, actividades, tipo de piel)</li>
                <li>No nos hacemos responsables por daños a la ropa durante la aplicación</li>
                <li>En caso de fuerza mayor, la cita puede ser reprogramada sin penalidad</li>
              </ul>
            </section>

            {/* Propiedad intelectual */}
            <section>
              <h2 className="text-2xl font-serif text-[color:var(--color-heading)] mb-4">
                7. Propiedad Intelectual y Uso de Imágenes
              </h2>
              
              <h3 className="text-xl font-medium text-[color:var(--color-heading)] mb-3">
                7.1 Fotografías del Trabajo
              </h3>
              <p className="text-[color:var(--color-body)] leading-relaxed mb-4">
                Con su consentimiento expreso, podemos fotografiar nuestro trabajo para fines de:
              </p>
              <ul className="list-disc list-inside text-[color:var(--color-body)] space-y-2 mb-4 ml-4">
                <li>Portafolio profesional</li>
                <li>Redes sociales y marketing</li>
                <li>Sitio web</li>
                <li>Material promocional</li>
              </ul>

              <h3 className="text-xl font-medium text-[color:var(--color-heading)] mb-3">
                7.2 Derechos del Cliente
              </h3>
              <p className="text-[color:var(--color-body)] leading-relaxed">
                El cliente puede solicitar que sus fotografías no sean utilizadas para fines 
                promocionales en cualquier momento.
              </p>
            </section>

            {/* Información de contacto */}
            <section>
              <h2 className="text-2xl font-serif text-[color:var(--color-heading)] mb-4">
                8. Información de Contacto
              </h2>
              <div className="bg-[color:var(--color-primary)]/10 p-6 rounded-lg border border-[color:var(--color-primary)]/20">
                <p className="text-[color:var(--color-body)] leading-relaxed mb-4">
                  Para consultas sobre estos términos y condiciones:
                </p>
                <div className="space-y-2 text-[color:var(--color-body)]">
                  <p><strong>Empresa:</strong> Marcela Cordero - Makeup Artist</p>
                  <p><strong>Email:</strong> <span className="text-[color:var(--color-primary)]">marcela@marcelamakeup.com</span></p>
                  <p><strong>WhatsApp:</strong> +51 989 164 990</p>
                  <p><strong>Ubicación:</strong> Lima, Perú</p>
                  <p><strong>Horarios de atención:</strong> Lunes a Domingo, 9:00 AM - 8:00 PM</p>
                </div>
              </div>
            </section>

            {/* Fecha de vigencia */}
            <section className="border-t border-[color:var(--color-border)]/20 pt-8">
              <p className="text-center text-[color:var(--color-muted)]">
                Estos Términos y Condiciones están vigentes desde el {new Date().toLocaleDateString('es-PE')} y 
                se rigen por las leyes de la República del Perú, incluyendo la Ley N° 29571 - 
                Código de Protección y Defensa del Consumidor.
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}