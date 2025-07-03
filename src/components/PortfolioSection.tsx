'use client';

import { useState } from 'react';

export default function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState('todos');

  const portfolioItems = [
    {
      id: 1,
      title: 'Maquillaje de Novia Clásico',
      category: 'novia',
      image: '/placeholder-bride-1.jpg',
      description: 'Look natural y elegante para ceremonia religiosa',
    },
    {
      id: 2,
      title: 'Sesión Editorial',
      category: 'editorial',
      image: '/placeholder-editorial-1.jpg',
      description: 'Maquillaje dramático para sesión de moda',
    },
    {
      id: 3,
      title: 'Maquillaje Social Elegante',
      category: 'social',
      image: '/placeholder-social-1.jpg',
      description: 'Look sofisticado para evento nocturno',
    },
    {
      id: 4,
      title: 'Novia Moderna',
      category: 'novia',
      image: '/placeholder-bride-2.jpg',
      description: 'Estilo contemporáneo con toques dorados',
    },
    {
      id: 5,
      title: 'Sesión de Estudio',
      category: 'editorial',
      image: '/placeholder-editorial-2.jpg',
      description: 'Maquillaje artístico para fotografía',
    },
    {
      id: 6,
      title: 'Graduación',
      category: 'social',
      image: '/placeholder-social-2.jpg',
      description: 'Look fresco y juvenil para celebración',
    },
  ];

  const filters = [
    { id: 'todos', label: 'Todos' },
    { id: 'novia', label: 'Novias' },
    { id: 'social', label: 'Social' },
    { id: 'editorial', label: 'Editorial' },
  ];

  const filteredItems =
    activeFilter === 'todos'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeFilter);

  return (
    <section id='portafolio' className='py-20 bg-gray-50'>
      <div className='container mx-auto px-6 lg:px-12'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl lg:text-5xl font-playfair text-primary-dark mb-4'>
            Mi Portafolio
          </h2>
          <p className='text-xl text-neutral max-w-3xl mx-auto mb-8'>
            Cada trabajo es único y refleja la personalidad de mis clientas.
            Descubre algunos de mis trabajos más destacados.
          </p>

          {/* Filter Buttons */}
          <div className='flex flex-wrap justify-center gap-4'>
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeFilter === filter.id
                    ? 'bg-primary-accent text-white shadow-lg'
                    : 'bg-white text-neutral hover:bg-primary-accent hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className='group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'
            >
              {/* Image */}
              <div className='relative h-64 overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-t from-primary-dark/50 to-transparent z-10'></div>
                {/* Placeholder for portfolio image */}
                <div className='absolute inset-0 bg-neutral-300 flex items-center justify-center'>
                  <span className='text-neutral text-sm'>Portfolio Image</span>
                </div>

                {/* Overlay on hover */}
                <div className='absolute inset-0 bg-primary-accent/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center'>
                  <button className='bg-white text-primary-dark px-6 py-3 rounded-lg font-medium'>
                    Ver Detalles
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className='p-6'>
                <h3 className='text-xl font-playfair text-primary-dark mb-2'>
                  {item.title}
                </h3>
                <p className='text-neutral'>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className='text-center mt-16'>
          <p className='text-xl text-neutral mb-6'>
            ¿Te gusta lo que ves? Trabajemos juntas para crear tu look perfecto.
          </p>
          <button
            className='btn-primary text-lg px-8 py-4'
            onClick={() =>
              document
                .getElementById('contacto')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Solicitar Cotización
          </button>
        </div>

        {/* Social Proof */}
        <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
          <div className='bg-white p-6 rounded-xl shadow-md'>
            <div className='text-3xl font-bold text-primary-accent mb-2'>
              200+
            </div>
            <div className='text-neutral'>Clientas Felices</div>
          </div>
          <div className='bg-white p-6 rounded-xl shadow-md'>
            <div className='text-3xl font-bold text-primary-accent mb-2'>
              150+
            </div>
            <div className='text-neutral'>Bodas Realizadas</div>
          </div>
          <div className='bg-white p-6 rounded-xl shadow-md'>
            <div className='text-3xl font-bold text-primary-accent mb-2'>5</div>
            <div className='text-neutral'>Años de Experiencia</div>
          </div>
        </div>
      </div>
    </section>
  );
}
