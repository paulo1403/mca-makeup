import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // Obtener estadísticas básicas
    const [
      totalReviews,
      approvedReviews,
      pendingReviews,
      averageRatingResult,
      ratingDistribution,
      aspectRatings,
      recommendationStats,
      recentReviews
    ] = await Promise.all([
      // Total de reviews
      prisma.review.count(),
      
      // Reviews aprobados
      prisma.review.count({ where: { isApproved: true } }),
      
      // Reviews pendientes
      prisma.review.count({ where: { isApproved: false } }),
      
      // Rating promedio
      prisma.review.aggregate({
        where: { isApproved: true },
        _avg: { rating: true }
      }),
      
      // Distribución de ratings
      prisma.review.groupBy({
        by: ['rating'],
        where: { isApproved: true },
        _count: { rating: true }
      }),
      
      // Ratings por aspecto
      prisma.review.aggregate({
        where: { 
          isApproved: true,
          ratingProfessionalism: { not: null }
        },
        _avg: {
          ratingProfessionalism: true,
          ratingPunctuality: true,
          ratingQuality: true,
          ratingCustomerService: true,
          ratingValue: true,
        }
      }),
      
      // Estadísticas de recomendación
      prisma.review.groupBy({
        by: ['wouldRecommend'],
        where: { isApproved: true },
        _count: { wouldRecommend: true }
      }),
      
      // Reviews recientes
      prisma.review.findMany({
        where: { isApproved: false },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          clientName: true,
          rating: true,
          serviceType: true,
          createdAt: true,
        }
      })
    ]);
    
    // Procesar distribución de ratings
    const ratingDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDistribution.forEach(item => {
      ratingDist[item.rating as keyof typeof ratingDist] = item._count.rating;
    });
    
    // Procesar estadísticas de recomendación
    let recommendationRate = 0;
    const totalRecommendations = recommendationStats.reduce((acc, item) => acc + item._count.wouldRecommend, 0);
    const positiveRecommendations = recommendationStats.find(item => item.wouldRecommend === true)?._count.wouldRecommend || 0;
    
    if (totalRecommendations > 0) {
      recommendationRate = (positiveRecommendations / totalRecommendations) * 100;
    }
    
    // Estadísticas por tipo de servicio
    const serviceStats = await prisma.review.groupBy({
      by: ['serviceType'],
      where: { isApproved: true },
      _count: { serviceType: true },
      _avg: { rating: true },
      orderBy: { _count: { serviceType: 'desc' } }
    });
    
    // Reviews por mes (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyReviews = await prisma.review.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: sixMonthsAgo }
      },
      _count: { id: true }
    });
    
    // Procesar datos mensuales
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const count = monthlyReviews.filter(review => {
        const reviewDate = new Date(review.createdAt);
        const reviewMonthKey = `${reviewDate.getFullYear()}-${String(reviewDate.getMonth() + 1).padStart(2, '0')}`;
        return reviewMonthKey === monthKey;
      }).length;
      
      monthlyData.push({
        month: monthKey,
        count
      });
    }
    
    const stats = {
      totalReviews,
      averageRating: Number(averageRatingResult._avg.rating?.toFixed(1)) || 0,
      ratingDistribution: ratingDist,
      aspectRatings: {
        professionalism: Number(aspectRatings._avg.ratingProfessionalism?.toFixed(1)) || 0,
        punctuality: Number(aspectRatings._avg.ratingPunctuality?.toFixed(1)) || 0,
        quality: Number(aspectRatings._avg.ratingQuality?.toFixed(1)) || 0,
        customerService: Number(aspectRatings._avg.ratingCustomerService?.toFixed(1)) || 0,
        value: Number(aspectRatings._avg.ratingValue?.toFixed(1)) || 0,
      },
      recommendationRate: Number(recommendationRate.toFixed(1)),
      approvedReviews,
      pendingReviews,
      serviceStats,
      monthlyData,
      recentReviews
    };
    
    return NextResponse.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Error fetching review stats:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}
