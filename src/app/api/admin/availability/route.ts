import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/availability - Get availability settings
export async function GET() {
  try {
    const availability = await prisma.availability.findMany({
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: availability,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}

// POST /api/admin/availability - Create availability slot
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, startTime, endTime, available = true } = body;

    // Validate required fields
    if (!date || !startTime || !endTime) {
      return NextResponse.json(
        {
          success: false,
          message: 'Date, start time, and end time are required',
        },
        { status: 400 }
      );
    }

    // Create or update availability
    const availability = await prisma.availability.upsert({
      where: {
        date_startTime_endTime: {
          date: new Date(date),
          startTime,
          endTime,
        },
      },
      update: {
        available,
      },
      create: {
        date: new Date(date),
        startTime,
        endTime,
        available,
      },
    });

    return NextResponse.json({
      success: true,
      data: availability,
      message: 'Availability updated successfully',
    });
  } catch (error) {
    console.error('Error creating/updating availability:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update availability' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/availability - Update availability
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Availability ID is required' },
        { status: 400 }
      );
    }

    // Update availability
    const availability = await prisma.availability.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: availability,
      message: 'Availability updated successfully',
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update availability' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/availability - Delete availability
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Availability ID is required' },
        { status: 400 }
      );
    }

    // Delete availability
    await prisma.availability.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Availability deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting availability:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete availability' },
      { status: 500 }
    );
  }
}
