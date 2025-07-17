'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  MessageSquare, 
  User, 
  Palette,
  Send,
  Sparkles,
  Heart,
  Instagram
} from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import { format, isAfter, isBefore, isSameDay, subDays, addMonths } from 'date-fns';

registerLocale('es', es);

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: null as Date | null,
    time: null as Date | null,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const services = [
    'Maquillaje de Novia - Paquete Básico (S/ 480)',
    'Maquillaje de Novia - Paquete Clásico (S/ 980)',
    'Maquillaje Social - Estilo Natural (S/ 200)',
    'Maquillaje Social - Estilo Glam (S/ 210)',
    'Maquillaje para Piel Madura (S/ 230)',
    'Peinados (desde S/ 65)',
    'Otro (especificar en mensaje)',
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

  // Función especial para formatear teléfono
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remover todo excepto números y +
    value = value.replace(/[^\d+]/g, '');
    
    // Si empieza con +51, formatear como +51 999 999 999
    if (value.startsWith('+51')) {
      const digits = value.substring(3);
      if (digits.length <= 3) {
        value = `+51 ${digits}`;
      } else if (digits.length <= 6) {
        value = `+51 ${digits.substring(0, 3)} ${digits.substring(3)}`;
      } else {
        value = `+51 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 9)}`;
      }
    }
    // Si empieza con 9 (número peruano), formatear como 999 999 999
    else if (value.startsWith('9') && !value.startsWith('+')) {
      if (value.length <= 3) {
        value = value;
      } else if (value.length <= 6) {
        value = `${value.substring(0, 3)} ${value.substring(3)}`;
      } else {
        value = `${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6, 9)}`;
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      date: date,
    }));
  };

  const handleTimeChange = (time: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      time: time,
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
          appointmentDate: formData.date ? format(formData.date, 'yyyy-MM-dd') : '',
          appointmentTime: formData.time ? format(formData.time, 'HH:mm') : '',
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
          date: null,
          time: null,
          message: '',
        });
      } else {
        // Intentar obtener el mensaje de error del servidor
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || errorData?.error || 'Error al enviar la solicitud';
        throw new Error(errorMessage);
      }
    } catch (error: unknown) {
      let errorMessage = 'Hubo un error al enviar tu solicitud. Por favor intenta nuevamente.';
      
      // Si es un error del servidor con mensaje específico
      if (error instanceof Error && error.message) {
        if (error.message.includes('Teléfono') || error.message.includes('teléfono')) {
          errorMessage = 'Por favor verifica el formato del teléfono. Ej: +51 999 209 880 o 999 209 880';
        } else if (error.message.includes('Email') || error.message.includes('email')) {
          errorMessage = 'Por favor verifica que el email sea válido.';
        } else if (error.message.includes('fecha') || error.message.includes('hora')) {
          errorMessage = 'Por favor selecciona una fecha y hora válidas.';
        }
      }
      
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id='contacto' 
      className='py-16 md:py-24 section-bg-contact relative overflow-hidden' 
      ref={ref}
    >
      {/* Overlays difuminados */}
      <div className="section-overlay-top" />
      <div className="section-overlay-bottom" />
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-accent/5 via-transparent to-transparent" />
      <div className="absolute top-20 left-10 text-primary-accent/10">
        <Sparkles className="w-12 h-12" />
      </div>
      <div className="absolute bottom-20 right-10 text-primary-accent/10">
        <Heart className="w-10 h-10" />
      </div>

      <div className='container mx-auto px-4 md:px-6 relative z-10'>
        {/* Header */}
        <motion.div
          className='text-center mb-12 md:mb-16'
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Palette className="w-6 h-6 text-primary-accent" />
            <span className="text-primary-accent text-sm font-medium tracking-wider uppercase">
              Contacto
            </span>
            <Palette className="w-6 h-6 text-primary-accent" />
          </div>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-4'>
            Agenda tu{' '}
            <span className="text-primary-accent font-allura text-4xl md:text-5xl lg:text-6xl block md:inline">
              Cita
            </span>
          </h2>
          <p className='text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed'>
            ¿Lista para verte hermosa? Completa el formulario y me pondré en
            contacto contigo para confirmar tu cita y todos los detalles.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12'>
          {/* Contact Form */}
          <motion.div 
            className='lg:col-span-3'
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className='bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl'>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-accent to-secondary-accent rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h3 className='text-xl md:text-2xl font-playfair font-semibold text-white'>
                  Formulario de Solicitud
                </h3>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Personal Info */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className="space-y-2">
                    <label
                      htmlFor='name'
                      className='flex items-center gap-2 text-white font-medium text-sm'
                    >
                      <User className="w-4 h-4 text-primary-accent" />
                      Nombre Completo *
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-primary-accent focus:border-transparent transition-all duration-300'
                      placeholder='Tu nombre completo'
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor='phone'
                      className='flex items-center gap-2 text-white font-medium text-sm'
                    >
                      <Phone className="w-4 h-4 text-primary-accent" />
                      Teléfono *
                    </label>
                    <input
                      type='tel'
                      id='phone'
                      name='phone'
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      required
                      className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-primary-accent focus:border-transparent transition-all duration-300'
                      placeholder='+51 999 209 880 o 999 209 880'
                      maxLength={15}
                    />
                    <p className="text-xs text-white/60 mt-1">
                      📱 Formato: +51 999 209 880 o 999 209 880
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor='email'
                    className='flex items-center gap-2 text-white font-medium text-sm'
                  >
                    <Mail className="w-4 h-4 text-primary-accent" />
                    Email *
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-primary-accent focus:border-transparent transition-all duration-300'
                    placeholder='tu@email.com'
                  />
                </div>

                {/* Service Selection */}
                <div className="space-y-2">
                  <label
                    htmlFor='service'
                    className='flex items-center gap-2 text-white font-medium text-sm'
                  >
                    <Palette className="w-4 h-4 text-primary-accent" />
                    Tipo de Servicio *
                  </label>
                  <select
                    id='service'
                    name='service'
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-primary-accent focus:border-transparent transition-all duration-300'
                  >
                    <option value='' className="bg-primary-dark text-white">Selecciona un servicio</option>
                    {services.map((service) => (
                      <option key={service} value={service} className="bg-primary-dark text-white">
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date and Time */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className="space-y-2">
                    <label
                      htmlFor='date'
                      className='flex items-center gap-2 text-white font-medium text-sm'
                    >
                      <Calendar className="w-4 h-4 text-primary-accent" />
                      Fecha Preferida *
                    </label>
                    <div className='relative'>
                      <DatePicker
                        selected={formData.date}
                        onChange={handleDateChange}
                        minDate={new Date()}
                        maxDate={addMonths(new Date(), 6)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Selecciona una fecha"
                        className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-primary-accent focus:border-transparent transition-all duration-300'
                        wrapperClassName='w-full'
                        calendarClassName='shadow-xl border-0 rounded-xl bg-white'
                        showPopperArrow={false}
                        required
                        locale="es"
                        excludeDates={[]}
                        filterDate={(date) => {
                          return isAfter(date, subDays(new Date(), 1));
                        }}
                        dayClassName={(date) => {
                          const today = new Date();
                          
                          if (isBefore(date, today)) {
                            return 'text-gray-300 cursor-not-allowed bg-gray-100';
                          }
                          
                          if (isSameDay(date, today)) {
                            return 'text-primary-accent font-semibold hover:bg-primary-accent hover:text-white rounded-full';
                          }
                          
                          return 'text-primary-dark hover:bg-primary-accent hover:text-white rounded-full transition-colors duration-200';
                        }}
                        weekDayClassName={() => 'text-primary-accent font-medium'}
                        monthClassName={() => 'text-primary-accent'}
                        dropdownMode="select"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor='time'
                      className='flex items-center gap-2 text-white font-medium text-sm'
                    >
                      <Clock className="w-4 h-4 text-primary-accent" />
                      Hora Preferida *
                    </label>
                    <DatePicker
                      selected={formData.time}
                      onChange={handleTimeChange}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={60}
                      timeCaption="Hora"
                      dateFormat="HH:mm"
                      placeholderText="Selecciona una hora"
                      className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-primary-accent focus:border-transparent transition-all duration-300'
                      wrapperClassName='w-full'
                      calendarClassName='shadow-xl border-0 rounded-xl bg-white'
                      showPopperArrow={false}
                      required
                      locale="es"
                      minTime={new Date(new Date().setHours(9, 0, 0, 0))}
                      maxTime={new Date(new Date().setHours(20, 0, 0, 0))}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label
                    htmlFor='message'
                    className='flex items-center gap-2 text-white font-medium text-sm'
                  >
                    <MessageSquare className="w-4 h-4 text-primary-accent" />
                    Mensaje Adicional
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-primary-accent focus:border-transparent transition-all duration-300 resize-none'
                    placeholder='Cuéntame sobre tu evento, estilo preferido, o cualquier detalle especial...'
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type='submit'
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3 ${
                    isSubmitting
                      ? 'bg-gray-500 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-primary-accent to-secondary-accent hover:from-secondary-accent hover:to-primary-accent text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Solicitar Cita
                    </>
                  )}
                </motion.button>

                {/* Submit Message */}
                {submitMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border ${
                      submitMessage.includes('éxito')
                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                        : 'bg-red-500/20 text-red-300 border-red-500/30'
                    }`}
                  >
                    {submitMessage}
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className='lg:col-span-2 space-y-6'
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Direct Contact */}
            <div className='bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl'>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-accent to-secondary-accent rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <h3 className='text-xl md:text-2xl font-playfair font-semibold text-white'>
                  Información de Contacto
                </h3>
              </div>

              <div className='space-y-4'>
                <motion.a
                  href="https://wa.me/51989164990"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className='flex items-center p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-primary-accent/30 transition-all duration-300 group'
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className='font-medium text-white group-hover:text-primary-accent transition-colors'>WhatsApp / Contacto</div>
                    <div className='text-gray-300 text-sm'>
                      +51 989 164 990
                    </div>
                  </div>
                </motion.a>

                <motion.a
                  href="tel:+51999209880"
                  whileHover={{ scale: 1.02 }}
                  className='flex items-center p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-primary-accent/30 transition-all duration-300 group'
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-accent to-secondary-accent rounded-full flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className='font-medium text-white group-hover:text-primary-accent transition-colors'>Reservas</div>
                    <div className='text-gray-300 text-sm'>+51 999 209 880</div>
                  </div>
                </motion.a>

                <div className='flex items-center p-4 bg-white/5 rounded-2xl border border-white/10'>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className='font-medium text-white'>Locación</div>
                    <div className='text-gray-300 text-sm'>
                      Room Studio - Pueblo Libre<br />
                      <span className="text-xs">(cdra 10 Av Bolívar)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              {/* Divisor elegante */}
              <div className="section-divider-decorated mt-6 mb-6" />
              <div>
                <h4 className='font-playfair text-lg text-white mb-4 flex items-center gap-2'>
                  <Sparkles className="w-5 h-5 text-primary-accent" />
                  Sígueme en Redes Sociales
                </h4>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className='flex gap-3'>
                    <motion.a
                      href='https://www.instagram.com/marcelacorderomakeup/'
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className='w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl'
                    >
                      <Instagram className="w-6 h-6 text-white" />
                    </motion.a>
                    <motion.a
                      href="https://wa.me/51989164990"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className='w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl'
                    >
                      <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.085' />
                      </svg>
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className='bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl'>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-accent to-secondary-accent rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className='text-xl md:text-2xl font-playfair font-semibold text-white'>
                  Horarios de Atención
                </h3>
              </div>

              <div className='space-y-3'>
                <div className='flex justify-between items-center p-3 bg-white/5 rounded-xl'>
                  <span className='text-gray-300'>Lunes - Viernes</span>
                  <span className='font-medium text-white'>9:00 AM - 8:00 PM</span>
                </div>
                <div className='flex justify-between items-center p-3 bg-white/5 rounded-xl'>
                  <span className='text-gray-300'>Sábados</span>
                  <span className='font-medium text-white'>8:00 AM - 10:00 PM</span>
                </div>
                <div className='flex justify-between items-center p-3 bg-white/5 rounded-xl'>
                  <span className='text-gray-300'>Domingos</span>
                  <span className='font-medium text-white'>10:00 AM - 6:00 PM</span>
                </div>
              </div>

              <div className='mt-6 p-4 bg-gradient-to-r from-primary-accent/20 to-secondary-accent/20 rounded-xl border border-primary-accent/30'>
                <p className='text-sm text-white leading-relaxed'>
                  <strong className="text-primary-accent">Nota:</strong> Los fines de semana suelo tener mayor
                  demanda, especialmente para bodas. Te recomiendo agendar con
                  anticipación.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
