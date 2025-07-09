import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/admin/availability/special/[id] - Delete special date
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete the special date
    await prisma.specialDate.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Fecha especial eliminada exitosamente',
    });

  } catch (error) {
    console.error('Error deleting special date:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          message: 'Fecha especial no encontrada',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error al eliminar la fecha especial' },
      { status: 500 }
    );
  }
}
