import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateReview } from '@/hooks/useReviews';
import { Star, Heart, MessageCircle, User, Calendar } from 'lucide-react';

const reviewSchema = z.object({
  clientName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  clientEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  clientPhone: z.string().optional(),
  rating: z.number().min(1, 'Debes seleccionar una calificación').max(5),
  comment: z.string().min(10, 'El comentario debe tener al menos 10 caracteres'),
  serviceType: z.string().min(1, 'Debe especificar el tipo de servicio'),
  serviceDate: z.string().optional(),
  
  // Aspectos específicos (opcionales)
  ratingProfessionalism: z.number().min(1).max(5).optional(),
  ratingPunctuality: z.number().min(1).max(5).optional(),
  ratingQuality: z.number().min(1).max(5).optional(),
  ratingCustomerService: z.number().min(1).max(5).optional(),
  ratingValue: z.number().min(1).max(5).optional(),
  
  // Aspectos cualitativos
  whatLikedMost: z.string().optional(),
  suggestedImprovements: z.string().optional(),
  wouldRecommend: z.boolean().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const serviceTypes = [
  'Maquillaje de Novia',
  'Maquillaje Social',
  'Maquillaje Editorial',
  'Maquillaje para Eventos',
  'Asesoría de Imagen',
  'Peinados',
  'Otro'
];

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  label: string;
  required?: boolean;
}

function StarRating({ rating, onRatingChange, label, required = false }: StarRatingProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`p-1 transition-colors ${
              star <= rating
                ? 'text-[#D4AF37] hover:text-[#B8941F]'
                : 'text-gray-300 hover:text-[#D4AF37]'
            }`}
          >
            <Star className="w-8 h-8 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ReviewForm() {
  const [showDetailedRatings, setShowDetailedRatings] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const createReviewMutation = useCreateReview();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      wouldRecommend: true,
    }
  });
  
  const watchedRating = watch('rating');
  const watchedDetailedRatings = {
    professionalism: watch('ratingProfessionalism'),
    punctuality: watch('ratingPunctuality'),
    quality: watch('ratingQuality'),
    customerService: watch('ratingCustomerService'),
    value: watch('ratingValue'),
  };
  
  const onSubmit = async (data: ReviewFormData) => {
    try {
      await createReviewMutation.mutateAsync(data);
      setSubmitted(true);
      reset();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };
  
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg border">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <Heart className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-playfair text-gray-900 mb-2">
            ¡Gracias por tu Review!
          </h3>
          <p className="text-gray-600 mb-6">
            Tu comentario ha sido enviado y será revisado antes de publicarse. 
            ¡Agradecemos mucho tu tiempo y retroalimentación!
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg hover:bg-[#B8941F] transition-colors"
          >
            Enviar otro Review
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg border">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-playfair text-gray-900 mb-2">
          Comparte tu Experiencia
        </h2>
        <p className="text-gray-600">
          Tu opinión es muy valiosa para nosotros. Ayúdanos a mejorar nuestros servicios.
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información Personal */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Información Personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <input
                {...register('clientName')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="Tu nombre completo"
              />
              {errors.clientName && (
                <p className="text-red-500 text-sm mt-1">{errors.clientName.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (opcional)
              </label>
              <input
                {...register('clientEmail')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="tu@email.com"
              />
              {errors.clientEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.clientEmail.message}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Información del Servicio */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Información del Servicio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de servicio <span className="text-red-500">*</span>
              </label>
              <select
                {...register('serviceType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              >
                <option value="">Selecciona un servicio</option>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.serviceType && (
                <p className="text-red-500 text-sm mt-1">{errors.serviceType.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha del servicio (opcional)
              </label>
              <input
                {...register('serviceDate')}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        {/* Calificación General */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <StarRating
            rating={watchedRating || 0}
            onRatingChange={(rating) => setValue('rating', rating)}
            label="Calificación general"
            required
          />
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
          )}
        </div>
        
        {/* Calificaciones Detalladas */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Calificaciones Detalladas (Opcional)
            </h3>
            <button
              type="button"
              onClick={() => setShowDetailedRatings(!showDetailedRatings)}
              className="text-[#D4AF37] hover:text-[#B8941F] text-sm font-medium"
            >
              {showDetailedRatings ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          
          {showDetailedRatings && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StarRating
                rating={watchedDetailedRatings.professionalism || 0}
                onRatingChange={(rating) => setValue('ratingProfessionalism', rating)}
                label="Profesionalismo"
              />
              <StarRating
                rating={watchedDetailedRatings.punctuality || 0}
                onRatingChange={(rating) => setValue('ratingPunctuality', rating)}
                label="Puntualidad"
              />
              <StarRating
                rating={watchedDetailedRatings.quality || 0}
                onRatingChange={(rating) => setValue('ratingQuality', rating)}
                label="Calidad del trabajo"
              />
              <StarRating
                rating={watchedDetailedRatings.customerService || 0}
                onRatingChange={(rating) => setValue('ratingCustomerService', rating)}
                label="Atención al cliente"
              />
              <StarRating
                rating={watchedDetailedRatings.value || 0}
                onRatingChange={(rating) => setValue('ratingValue', rating)}
                label="Relación calidad-precio"
              />
            </div>
          )}
        </div>
        
        {/* Comentarios */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Comentarios
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuéntanos sobre tu experiencia <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('comment')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="Describe tu experiencia con el servicio..."
              />
              {errors.comment && (
                <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ¿Qué fue lo que más te gustó? (opcional)
              </label>
              <textarea
                {...register('whatLikedMost')}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="Lo que más valoraste del servicio..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sugerencias de mejora (opcional)
              </label>
              <textarea
                {...register('suggestedImprovements')}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="¿Cómo podríamos mejorar nuestro servicio?"
              />
            </div>
          </div>
        </div>
        
        {/* Recomendación */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <label className="flex items-center">
            <input
              {...register('wouldRecommend')}
              type="checkbox"
              className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
            />
            <span className="ml-2 text-sm text-gray-700">
              Recomendaría este servicio a otras personas
            </span>
          </label>
        </div>
        
        {/* Botón de envío */}
        <div className="text-center pt-6">
          <button
            type="submit"
            disabled={createReviewMutation.isPending}
            className="bg-[#D4AF37] text-white px-8 py-3 rounded-lg hover:bg-[#B8941F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {createReviewMutation.isPending ? 'Enviando...' : 'Enviar Review'}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Tu review será revisado antes de publicarse
          </p>
        </div>
      </form>
    </div>
  );
}
