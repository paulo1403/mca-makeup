'use client';

import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
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
              Políticas de Privacidad
            </h1>
            <p className="text-lg text-neutral">
              Última actualización: {new Date().toLocaleDateString('es-PE')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 space-y-8">
            
            {/* Introducción */}
            <section>
              <h2 className="text-2xl font-playfair text-primary-dark mb-4">
                1. Introducción
              </h2>
              <p className="text-neutral leading-relaxed mb-4">
                Marcela Cordero - Makeup Artist (&quot;nosotros&quot;, &quot;nuestro&quot; o &quot;la empresa&quot;) se compromete a proteger 
                la privacidad y los datos personales de nuestros clientes. Esta Política de Privacidad describe 
                cómo recopilamos, utilizamos, almacenamos y protegemos su información personal de acuerdo con la 
                Ley N° 29733 - Ley de Protección de Datos Personales del Perú y su Reglamento.
              </p>
              <p className="text-neutral leading-relaxed">
                Al utilizar nuestros servicios de maquillaje profesional, peinado y asesoría de imagen, 
                usted acepta las prácticas descritas en esta política.
              </p>
            </section>

            {/* Información que recopilamos */}
            <section>
              <h2 className="text-2xl font-playfair text-primary-dark mb-4">
                2. Información que Recopilamos
              </h2>
              
              <h3 className="text-xl font-medium text-primary-dark mb-3">
                2.1 Datos Personales
              </h3>
              <ul className="list-disc list-inside text-neutral space-y-2 mb-4 ml-4">
                <li>Nombre completo</li>
                <li>Número de teléfono y correo electrónico</li>
                <li>Dirección de domicilio (para servicios a domicilio)</li>
                <li>Fecha de nacimiento (opcional, para ocasiones especiales)</li>
                <li>Preferencias de estilo y tipo de piel</li>
                <li>Información sobre alergias o sensibilidades a productos cosméticos</li>
              </ul>

              <h3 className="text-xl font-medium text-primary-dark mb-3">
                2.2 Información del Servicio
              </h3>
              <ul className="list-disc list-inside text-neutral space-y-2 mb-4 ml-4">
                <li>Tipo de evento o servicio solicitado</li>
                <li>Fecha, hora y ubicación de la cita</li>
                <li>Historial de servicios recibidos</li>
                <li>Fotografías del trabajo realizado (con su consentimiento expreso)</li>
                <li>Comentarios y preferencias específicas</li>
              </ul>

              <h3 className="text-xl font-medium text-primary-dark mb-3">
                2.3 Información Técnica
              </h3>
              <ul className="list-disc list-inside text-neutral space-y-2 ml-4">
                <li>Dirección IP y datos de navegación del sitio web</li>
                <li>Información del dispositivo utilizado</li>
                <li>Cookies y tecnologías similares</li>
              </ul>
            </section>

            {/* Cómo utilizamos la información */}
            <section>
              <h2 className="text-2xl font-playfair text-primary-dark mb-4">
                3. Cómo Utilizamos su Información
              </h2>
              <ul className="list-disc list-inside text-neutral space-y-2 ml-4">
                <li>Coordinar y brindar nuestros servicios de maquillaje y peinado</li>
                <li>Comunicarnos sobre citas, cambios de horario y confirmaciones</li>
                <li>Personalizar nuestros servicios según sus preferencias y necesidades</li>
                <li>Enviar recordatorios de citas y seguimiento post-servicio</li>
                <li>Mejorar la calidad de nuestros servicios</li>
                <li>Crear un portafolio profesional (solo con autorización expresa)</li>
                <li>Enviar promociones y ofertas especiales (con su consentimiento)</li>
                <li>Cumplir con obligaciones legales y tributarias</li>
              </ul>
            </section>

            {/* Base legal */}
            <section>
              <h2 className="text-2xl font-playfair text-primary-dark mb-4">
                4. Base Legal del Tratamiento
              </h2>
              <p className="text-neutral leading-relaxed mb-4">
                El tratamiento de sus datos personales se basa en:
              </p>
              <ul className="list-disc list-inside text-neutral space-y-2 ml-4">
                <li><strong>Consentimiento:</strong> Para el envío de comunicaciones promocionales y uso de fotografías</li>
                <li><strong>Ejecución contractual:</strong> Para la prestación de servicios de maquillaje contratados</li>
                <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y atención al cliente</li>
                <li><strong>Cumplimiento legal:</strong> Para cumplir con obligaciones tributarias y normativas</li>
              </ul>
            </section>

            {/* Compartir información */}
            <section>
              <h2 className="text-2xl font-playfair text-primary-dark mb-4">
                5. Compartir su Información
              </h2>
              <p className="text-neutral leading-relaxed mb-4">
                No vendemos, alquilamos ni compartimos sus datos personales con terceros, excepto en los siguientes casos:
              </p>
              <ul className="list-disc list-inside text-neutral space-y-2 ml-4">
                <li>Proveedores de servicios tecnológicos (hosting, procesamiento de pagos)</li>
                <li>Autoridades competentes cuando sea requerido por ley</li>
                <li>En caso de emergencia médica durante la prestación del servicio</li>
                <li>Colaboradores profesionales (fotógrafos, wedding planners) con su autorización</li>
              </ul>
            </section>

            {/* Seguridad */}
            <section>
              <h2 className="text-2xl font-playfair text-primary-dark mb-4">
                6. Seguridad de los Datos
              </h2>
              <p className="text-neutral leading-relaxed mb-4">
                Implementamos medidas de seguridad técnicas, organizativas y legales para proteger sus datos:
              </p>
              <ul className="list-disc list-inside text-neutral space-y-2 ml-4">
                <li>Cifrado de datos sensibles</li>
                <li>Acceso restringido a la información personal</li>
                <li>Capacitación del personal en protección de datos</li>
                <li>Respaldos seguros de la información</li>
                <li>Monitoreo regular de nuestros sistemas</li>
              </ul>
            </section>

            {/* Retención de datos */}
            <section>
              <h2 className="text-2xl font-playfair text-primary-dark mb-4">
                7. Retención de Datos
              </h2>
              <p className="text-neutral leading-relaxed mb-4">
                Conservamos sus datos personales durante:
              </p>
              <ul className="list-disc list-inside text-neutral space-y-2 ml-4">
                <li><strong>Datos de contacto:</strong> Hasta 3 años después del último servicio</li>
                <li><strong>Historial de servicios:</strong> Hasta 5 años para fines de atención al cliente</li>
                <li><strong>Fotografías:</strong> Hasta que revoque su consentimiento</li>
                <li><strong>Datos tributarios:</strong> Según los plazos establecidos por SUNAT</li>
              </ul>
            </section>

            {/* Derechos */}
            <section>
              <h2 className="text-2xl font-playfair text-primary-dark mb-4">
                8. Sus Derechos
              </h2>
              <p className="text-neutral leading-relaxed mb-4">
                De acuerdo con la Ley de Protección de Datos Personales del Perú, usted tiene derecho a:
              </p>
              <ul className="list-disc list-inside text-neutral space-y-2 ml-4">
                <li><strong>Acceso:</strong> Conocer qué datos tenemos sobre usted</li>
                <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                <li><strong>Cancelación:</strong> Solicitar la eliminación de sus datos</li>
                <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos</li>
                <li><strong>Revocación:</strong> Retirar su consentimiento en cualquier momento</li>
                <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
              </ul>
              <p className="text-neutral leading-relaxed mt-4">
                Para ejercer estos derechos, contáctenos a través de: 
                <span className="text-primary-accent font-medium"> marcela@marcelamakeup.com</span>
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-playfair text-primary-dark mb-4">
                9. Uso de Cookies
              </h2>
              <p className="text-neutral leading-relaxed mb-4">
                Nuestro sitio web utiliza cookies para:
              </p>
              <ul className="list-disc list-inside text-neutral space-y-2 ml-4">
                <li>Mejorar la funcionalidad del sitio web</li>
                <li>Analizar el tráfico y uso del sitio</li>
                <li>Personalizar su experiencia de navegación</li>
                <li>Recordar sus preferencias</li>
              </ul>
              <p className="text-neutral leading-relaxed mt-4">
                Puede configurar su navegador para rechazar cookies, aunque esto puede afectar 
                la funcionalidad del sitio.
              </p>
            </section>

            {/* Menores de edad */}
            <section>
              <h2 className="text-2xl font-playfair text-primary-dark mb-4">
                10. Menores de Edad
              </h2>
              <p className="text-neutral leading-relaxed">
                Nuestros servicios están dirigidos a personas mayores de 18 años. Para menores de edad, 
                requerimos autorización expresa de los padres o tutores legales. No recopilamos 
                intencionalmente datos de menores de 14 años sin consentimiento parental.
              </p>
            </section>

            {/* Transferencias internacionales */}
            <section>
              <h2 className="text-2xl font-playfair text-primary-dark mb-4">
                11. Transferencias Internacionales
              </h2>
              <p className="text-neutral leading-relaxed">
                Algunos de nuestros proveedores de servicios tecnológicos pueden estar ubicados fuera del Perú. 
                En estos casos, aseguramos que cumplan con niveles de protección equivalentes a los 
                establecidos en la legislación peruana.
              </p>
            </section>

            {/* Cambios */}
            <section>
              <h2 className="text-2xl font-playfair text-primary-dark mb-4">
                12. Cambios a esta Política
              </h2>
              <p className="text-neutral leading-relaxed">
                Nos reservamos el derecho de actualizar esta Política de Privacidad. Los cambios 
                significativos serán notificados a través de nuestro sitio web o por correo electrónico. 
                Le recomendamos revisar periódicamente esta política.
              </p>
            </section>

            {/* Quejas y Reclamos */}
            <section>
              <h2 className="text-2xl font-playfair text-primary-dark mb-4">
                13. Quejas y Reclamos
              </h2>
              <p className="text-neutral leading-relaxed mb-4">
                De acuerdo con el Código de Protección y Defensa del Consumidor (Ley N° 29571), 
                usted tiene derecho a presentar quejas y reclamos sobre nuestros servicios y 
                el tratamiento de sus datos personales.
              </p>
              
              <h3 className="text-xl font-medium text-primary-dark mb-3">
                13.1 Diferencias entre Queja y Reclamo
              </h3>
              <ul className="list-disc list-inside text-neutral space-y-2 mb-4 ml-4">
                <li><strong>Queja:</strong> Disconformidad no relacionada directamente con el servicio, 
                sino con la atención al público en general</li>
                <li><strong>Reclamo:</strong> Disconformidad relacionada con el servicio prestado o 
                el tratamiento de sus datos personales</li>
              </ul>

              <h3 className="text-xl font-medium text-primary-dark mb-3">
                13.2 Proceso de Presentación
              </h3>
              <div className="bg-secondary-accent/10 p-6 rounded-lg mb-4">
                <p className="text-neutral leading-relaxed mb-4">
                  <strong>Plazo para presentar:</strong> Hasta 30 días calendario después de ocurrido el hecho.
                </p>
                <p className="text-neutral leading-relaxed mb-4">
                  <strong>Canales disponibles:</strong>
                </p>
                <ul className="list-disc list-inside text-neutral space-y-2 ml-4">
                  <li>Presencial: Durante la prestación del servicio</li>
                  <li>Email: marcela@marcelamakeup.com (indicar &quot;QUEJA&quot; o &quot;RECLAMO&quot; en el asunto)</li>
                  <li>WhatsApp: +51 999 123 456</li>
                  <li><a href="/libro-reclamaciones" className="text-primary-accent hover:underline">Libro de Reclamaciones Virtual</a></li>
                </ul>
              </div>

              <h3 className="text-xl font-medium text-primary-dark mb-3">
                13.3 Información Requerida
              </h3>
              <ul className="list-disc list-inside text-neutral space-y-2 mb-4 ml-4">
                <li>Identificación del consumidor (nombre, DNI, teléfono, email)</li>
                <li>Identificación del bien contratado o servicio prestado</li>
                <li>Detalle de los hechos materia de la queja o reclamo</li>
                <li>Pedido del consumidor</li>
                <li>Fecha del incidente</li>
              </ul>

              <h3 className="text-xl font-medium text-primary-dark mb-3">
                13.4 Plazos de Respuesta
              </h3>
              <ul className="list-disc list-inside text-neutral space-y-2 mb-4 ml-4">
                <li><strong>Quejas:</strong> Respuesta en un máximo de 5 días hábiles</li>
                <li><strong>Reclamos:</strong> Respuesta en un máximo de 15 días hábiles</li>
              </ul>

              <h3 className="text-xl font-medium text-primary-dark mb-3">
                13.5 Instancias Superiores
              </h3>
              <p className="text-neutral leading-relaxed mb-4">
                Si no está conforme con nuestra respuesta, puede acudir a:
              </p>
              <ul className="list-disc list-inside text-neutral space-y-2 ml-4">
                <li><strong>INDECOPI:</strong> Para reclamos de consumo en general</li>
                <li><strong>Autoridad Nacional de Protección de Datos Personales (ANPD):</strong> 
                Para temas específicos de protección de datos</li>
                <li><strong>Arbitraje de Consumo:</strong> Como alternativa de resolución de conflictos</li>
              </ul>
            </section>

            {/* Contacto */}
            <section>
              <h2 className="text-2xl font-playfair text-primary-dark mb-4">
                14. Contacto
              </h2>
              <div className="bg-primary-accent/10 p-6 rounded-lg">
                <p className="text-neutral leading-relaxed mb-4">
                  Si tiene preguntas sobre esta Política de Privacidad o sobre el tratamiento de sus datos personales, 
                  puede contactarnos:
                </p>
                <div className="space-y-2 text-neutral">
                  <p><strong>Responsable:</strong> Marcela Cordero - Makeup Artist</p>
                  <p><strong>Email:</strong> <span className="text-primary-accent">marcela@marcelamakeup.com</span></p>
                  <p><strong>Teléfono:</strong> +51 999 123 456</p>
                  <p><strong>Dirección:</strong> Lima, Perú</p>
                </div>
                <p className="text-neutral leading-relaxed mt-4">
                  También puede presentar una reclamación ante la Autoridad Nacional de Protección de Datos Personales 
                  (ANPD) si considera que sus derechos han sido vulnerados.
                </p>
              </div>
            </section>

            {/* Fecha de vigencia */}
            <section className="border-t pt-8">
              <p className="text-center text-neutral">
                Esta Política de Privacidad está vigente desde el {new Date().toLocaleDateString('es-PE')} y 
                cumple con la Ley N° 29733 - Ley de Protección de Datos Personales del Perú y la 
                Ley N° 29571 - Código de Protección y Defensa del Consumidor.
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
