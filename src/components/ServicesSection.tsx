'use client';

export default function ServicesSection() {
  const services = [
    {
      title: 'Maquillaje de Novia',
      description:
        'El día más importante de tu vida merece un look perfecto. Incluye prueba previa y retoque para la ceremonia.',
      price: 'Desde $150',
      features: [
        'Consulta personalizada',
        'Prueba de maquillaje',
        'Maquillaje del día',
        'Retoque incluido',
        'Productos de alta gama',
      ],
      popular: true,
    },
    {
      title: 'Maquillaje Social',
      description:
        'Para eventos especiales, fiestas, graduaciones y ocasiones que requieren un look elegante y sofisticado.',
      price: 'Desde $80',
      features: [
        'Maquillaje personalizado',
        'Duración 4-6 horas',
        'Productos profesionales',
        'Estilo según ocasión',
      ],
    },
    {
      title: 'Sesión Fotográfica',
      description:
        'Maquillaje especializado para fotografía profesional, editorial y sesiones de estudio.',
      price: 'Desde $100',
      features: [
        'Maquillaje HD',
        'Resistente a luces',
        'Retoque durante sesión',
        'Múltiples looks',
      ],
    },
    {
      title: 'Peinado Profesional',
      description:
        'Peinados elegantes que complementan perfectamente tu maquillaje para cualquier ocasión especial.',
      price: 'Desde $60',
      features: [
        'Peinado personalizado',
        'Productos profesionales',
        'Fijación duradera',
        'Accesorios incluidos',
      ],
    },
  ];

  return (
    <section id='servicios' className='py-20 bg-white'>
      <div className='container mx-auto px-6 lg:px-12'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl lg:text-5xl font-playfair text-primary-dark mb-4'>
            Mis Servicios
          </h2>
          <p className='text-xl text-neutral max-w-3xl mx-auto'>
            Cada servicio está diseñado para resaltar tu belleza natural y
            hacerte sentir segura y radiante en tu día especial.
          </p>
        </div>

        {/* Services Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-xl shadow-lg transition-transform hover:scale-105 ${
                service.popular
                  ? 'bg-gradient-to-br from-primary-accent/10 to-secondary-accent/10 border-2 border-primary-accent'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              {service.popular && (
                <div className='absolute -top-3 left-6 bg-primary-accent text-white px-4 py-1 rounded-full text-sm font-medium'>
                  Más Popular
                </div>
              )}

              <div className='mb-6'>
                <h3 className='text-2xl font-playfair text-primary-dark mb-2'>
                  {service.title}
                </h3>
                <p className='text-neutral mb-4'>{service.description}</p>
                <div className='text-3xl font-bold text-secondary-accent'>
                  {service.price}
                </div>
              </div>

              <ul className='space-y-3 mb-6'>
                {service.features.map((feature, idx) => (
                  <li key={idx} className='flex items-center text-neutral'>
                    <svg
                      className='w-5 h-5 text-primary-accent mr-3 flex-shrink-0'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  service.popular
                    ? 'btn-primary'
                    : 'bg-primary-dark text-white hover:bg-neutral'
                }`}
                onClick={() =>
                  document
                    .getElementById('contacto')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Solicitar Información
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className='mt-16 text-center'>
          <div className='bg-primary-dark text-white p-8 rounded-xl'>
            <h3 className='text-2xl font-playfair mb-4'>
              Servicios a Domicilio
            </h3>
            <p className='text-lg mb-6'>
              Me desplazo hasta tu ubicación para que disfrutes de la comodidad
              de tu hogar en tu día especial. Servicio disponible en toda la
              ciudad.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <div className='flex items-center'>
                <svg
                  className='w-6 h-6 text-primary-accent mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
                <span>Sin costo adicional</span>
              </div>
              <div className='flex items-center'>
                <svg
                  className='w-6 h-6 text-primary-accent mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span>Puntualidad garantizada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
