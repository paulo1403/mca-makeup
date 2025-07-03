import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/stats - Get dashboard statistics
export async function GET() {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get appointment counts
    const [
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      todayAppointments,
      thisWeekAppointments,
      thisMonthAppointments,
    ] = await Promise.all([
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: 'PENDING' } }),
      prisma.appointment.count({ where: { status: 'CONFIRMED' } }),
      prisma.appointment.count({
        where: {
          appointmentDate: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.appointment.count({
        where: {
          appointmentDate: {
            gte: weekStart,
          },
        },
      }),
      prisma.appointment.count({
        where: {
          appointmentDate: {
            gte: monthStart,
          },
        },
      }),
    ]);

    // Get service type distribution
    const serviceStats = await prisma.appointment.groupBy({
      by: ['serviceType'],
      _count: {
        serviceType: true,
      },
      orderBy: {
        _count: {
          serviceType: 'desc',
        },
      },
    });

    // Get recent appointments
    const recentAppointments = await prisma.appointment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        clientName: true,
        clientEmail: true,
        serviceType: true,
        appointmentDate: true,
        appointmentTime: true,
        status: true,
        createdAt: true,
      },
    });

    // Calculate estimated revenue (basic calculation with average price)
    const thisMonthRevenue = thisMonthAppointments * 150; // Average price

    // Get weekly schedule
    const weeklySchedule = await Promise.all(
      Array.from({ length: 7 }, async (_, index) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + index);
        const count = await prisma.appointment.count({
          where: {
            appointmentDate: {
              gte: date,
              lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        });
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'long' }),
          count,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalAppointments,
          pendingAppointments,
          confirmedAppointments,
          todayAppointments,
          thisWeekAppointments,
          thisMonthRevenue,
        },
        serviceStats: serviceStats.map((stat) => ({
          service: stat.serviceType,
          count: stat._count.serviceType,
          percentage: Math.round(
            (stat._count.serviceType / totalAppointments) * 100
          ),
        })),
        recentAppointments,
        weeklySchedule,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
