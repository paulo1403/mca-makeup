'use client';

import { useState } from 'react';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewsDisplay from '@/components/reviews/ReviewsDisplay';
import { MessageSquare, Star, Users, TrendingUp, Heart } from 'lucide-react';

type TabType = 'form' | 'reviews';

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('reviews');
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-4">
            Experiencias de Nuestras Clientas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre lo que dicen nuestras clientas sobre nuestros servicios de maquillaje 
            y comparte tu propia experiencia para ayudar a otras personas.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'reviews'
                    ? 'bg-[#D4AF37] text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Star className="w-5 h-5" />
                <span>Ver Reseñas</span>
              </button>
              
              <button
                onClick={() => setActiveTab('form')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'form'
                    ? 'bg-[#D4AF37] text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Escribir Reseña</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <ReviewsDisplay 
                maxReviews={undefined} 
                showTitle={false} 
                onWriteReview={() => setActiveTab('form')}
              />
              
              {/* Call to Action */}
              <div className="text-center bg-white p-8 rounded-2xl shadow-lg border">
                <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-4">
                  ¿Ya has usado nuestros servicios?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Tu opinión es muy valiosa para nosotros y para futuras clientas. 
                  Comparte tu experiencia y ayúdanos a seguir mejorando.
                </p>
                <button
                  onClick={() => setActiveTab('form')}
                  className="bg-[#D4AF37] text-white px-8 py-3 rounded-lg hover:bg-[#B8941F] transition-colors font-medium"
                >
                  Escribir mi reseña
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'form' && (
            <div className="space-y-8">
              <ReviewForm />
              
              {/* Why Reviews Matter */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border">
                <h3 className="text-xl font-playfair font-bold text-gray-900 mb-4 text-center">
                  ¿Por qué son importantes las reseñas?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ayuda a otras clientas</h4>
                    <p className="text-sm text-gray-600">
                      Tu experiencia puede ayudar a otras personas a tomar decisiones informadas
                    </p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Nos ayuda a mejorar</h4>
                    <p className="text-sm text-gray-600">
                      Tu feedback nos permite identificar áreas de mejora y seguir creciendo
                    </p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Construye confianza</h4>
                    <p className="text-sm text-gray-600">
                      Las reseñas auténticas generan confianza en nuestra comunidad
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
