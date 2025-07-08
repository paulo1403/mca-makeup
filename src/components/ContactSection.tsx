'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const services = [
    'Maquillaje de Novia',
    'Maquillaje Social',
    'Sesión Fotográfica',
    'Peinado Profesional',
    'Asesoría de Imagen',
    'Otro (especificar en mensaje)',
  ];

  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName: formData.name,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          serviceType: formData.service,
          appointmentDate: formData.date,
          appointmentTime: formData.time,
          additionalNotes: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitMessage(
          '¡Solicitud enviada con éxito! Te contactaré pronto para confirmar tu cita.'
        );
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          date: '',
          time: '',
          message: '',
        });
      } else {
        throw new Error('Error al enviar la solicitud');
      }
    } catch {
      setSubmitMessage(
        'Hubo un error al enviar tu solicitud. Por favor intenta nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <section id='contacto' className='py-20 bg-gray-50' ref={ref}>
      <div className='container mx-auto px-6 lg:px-12'>
        {/* Header */}
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className='text-4xl lg:text-5xl font-playfair text-primary-dark mb-4'>
            Agenda tu Cita
          </h2>
          <p className='text-xl text-neutral max-w-3xl mx-auto'>
            ¿Lista para verte hermosa? Completa el formulario y me pondré en
            contacto contigo para confirmar tu cita y todos los detalles.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
          {/* Contact Form */}
          <div className='bg-white p-8 rounded-2xl shadow-lg'>
            <h3 className='text-2xl font-playfair text-primary-dark mb-6'>
              Formulario de Solicitud
            </h3>

            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Personal Info */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-neutral font-medium mb-2'
                  >
                    Nombre Completo *
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent'
                    placeholder='Tu nombre completo'
                  />
                </div>

                <div>
                  <label
                    htmlFor='phone'
                    className='block text-neutral font-medium mb-2'
                  >
                    Teléfono *
                  </label>
                  <input
                    type='tel'
                    id='phone'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent'
                    placeholder='+1 234 567 8900'
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-neutral font-medium mb-2'
                >
                  Email *
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent'
                  placeholder='tu@email.com'
                />
              </div>

              {/* Service Selection */}
              <div>
                <label
                  htmlFor='service'
                  className='block text-neutral font-medium mb-2'
                >
                  Tipo de Servicio *
                </label>
                <select
                  id='service'
                  name='service'
                  value={formData.service}
                  onChange={handleInputChange}
                  required
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent'
                >
                  <option value=''>Selecciona un servicio</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='date'
                    className='block text-neutral font-medium mb-2'
                  >
                    Fecha Preferida *
                  </label>
                  <input
                    type='date'
                    id='date'
                    name='date'
                    value={formData.date}
                    onChange={handleInputChange}
                    min={today}
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent'
                  />
                </div>

                <div>
                  <label
                    htmlFor='time'
                    className='block text-neutral font-medium mb-2'
                  >
                    Hora Preferida *
                  </label>
                  <select
                    id='time'
                    name='time'
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent'
                  >
                    <option value=''>Selecciona una hora</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor='message'
                  className='block text-neutral font-medium mb-2'
                >
                  Mensaje Adicional
                </label>
                <textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent'
                  placeholder='Cuéntame sobre tu evento, estilo preferido, o cualquier detalle especial...'
                />
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg font-medium transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {isSubmitting ? 'Enviando...' : 'Solicitar Cita'}
              </button>

              {/* Submit Message */}
              {submitMessage && (
                <div
                  className={`p-4 rounded-lg ${
                    submitMessage.includes('éxito')
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {submitMessage}
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className='space-y-8'>
            {/* Direct Contact */}
            <div className='bg-primary-dark text-white p-8 rounded-2xl'>
              <h3 className='text-2xl font-playfair mb-6'>
                Información de Contacto
              </h3>

              <div className='space-y-6'>
                <div className='flex items-center'>
                  <Mail
                    className='w-6 h-6 text-primary-accent mr-4'
                  />
                  <div>
                    <div className='font-medium'>Email</div>
                    <div className='text-gray-300'>
                      marcela@marcelamakeup.com
                    </div>
                  </div>
                </div>

                <div className='flex items-center'>
                  <Phone
                    className='w-6 h-6 text-primary-accent mr-4'
                  />
                  <div>
                    <div className='font-medium'>Teléfono</div>
                    <div className='text-gray-300'>+1 (555) 123-4567</div>
                  </div>
                </div>

                <div className='flex items-center'>
                  <MapPin
                    className='w-6 h-6 text-primary-accent mr-4'
                  />
                  <div>
                    <div className='font-medium'>Ubicación</div>
                    <div className='text-gray-300'>
                      Servicio a domicilio disponible
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className='mt-8 pt-8 border-t border-white/20'>
                <h4 className='font-playfair text-lg mb-4'>
                  Sígueme en Redes Sociales
                </h4>
                <div className='flex space-x-4'>
                  <a
                    href='#'
                    className='bg-primary-accent hover:bg-opacity-80 p-3 rounded-full transition-colors'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.751-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z' />
                    </svg>
                  </a>
                  <a
                    href='#'
                    className='bg-primary-accent hover:bg-opacity-80 p-3 rounded-full transition-colors'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                    </svg>
                  </a>
                  <a
                    href='#'
                    className='bg-primary-accent hover:bg-opacity-80 p-3 rounded-full transition-colors'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.085' />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className='bg-white p-8 rounded-2xl shadow-lg'>
              <h3 className='text-2xl font-playfair text-primary-dark mb-6'>
                Horarios de Atención
              </h3>

              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-neutral'>Lunes - Viernes</span>
                  <span className='font-medium'>9:00 AM - 8:00 PM</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-neutral'>Sábados</span>
                  <span className='font-medium'>8:00 AM - 10:00 PM</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-neutral'>Domingos</span>
                  <span className='font-medium'>10:00 AM - 6:00 PM</span>
                </div>
              </div>

              <div className='mt-6 p-4 bg-primary-accent/10 rounded-lg'>
                <p className='text-sm text-primary-dark'>
                  <strong>Nota:</strong> Los fines de semana suelo tener mayor
                  demanda, especialmente para bodas. Te recomiendo agendar con
                  anticipación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
