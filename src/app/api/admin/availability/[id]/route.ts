import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/admin/availability/[id] - Update time slot (toggle active/inactive)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          message: 'isActive debe ser un valor booleano',
        },
        { status: 400 }
      );
    }

    // Update the time slot
    const timeSlot = await prisma.regularAvailability.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({
      success: true,
      ...timeSlot,
    });

  } catch (error) {
    console.error('Error updating time slot:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          message: 'Horario no encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error al actualizar el horario' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/availability/[id] - Delete time slot
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete the time slot
    await prisma.regularAvailability.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Horario eliminado exitosamente',
    });

  } catch (error) {
    console.error('Error deleting time slot:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          message: 'Horario no encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error al eliminar el horario' },
      { status: 500 }
    );
  }
}
