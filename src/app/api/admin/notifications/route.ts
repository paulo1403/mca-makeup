import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

// GET /api/admin/notifications - Get notifications for admin
export async function GET() {
  try {
    // Obtener notificaciones de la base de datos
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      include: {
        appointment: true, // Incluir datos de la cita si existe
      },
    });

    return NextResponse.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

// PUT /api/admin/notifications - Mark notification as read
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, read } = body;

    // Actualizar el estado de la notificación en la base de datos
    const notification = await prisma.notification.update({
      where: { id },
      data: { read },
    });

    return NextResponse.json({
      success: true,
      message: "Notification updated successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update notification" },
      { status: 500 },
    );
  }
}
