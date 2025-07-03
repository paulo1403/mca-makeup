import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/appointments - Get all appointments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: 'insensitive' } },
        { clientEmail: { contains: search, mode: 'insensitive' } },
        { serviceType: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get appointments with pagination
    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.appointment.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        appointments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST /api/admin/appointments - Create new appointment (admin use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientName,
      clientEmail,
      clientPhone,
      serviceType,
      appointmentDate,
      appointmentTime,
      additionalNotes,
      status = 'PENDING',
    } = body;

    // Validate required fields
    if (
      !clientName ||
      !clientEmail ||
      !clientPhone ||
      !serviceType ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        clientName,
        clientEmail,
        clientPhone,
        serviceType,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        additionalNotes,
        status,
      },
    });

    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Appointment created successfully',
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/appointments - Update appointment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    // Update appointment
    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Appointment updated successfully',
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/appointments - Delete appointment
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    // Delete appointment
    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}
