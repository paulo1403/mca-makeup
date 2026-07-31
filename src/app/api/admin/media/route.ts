import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { deleteFile } from "@/lib/minio";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { key } = await request.json();
    if (!key || typeof key !== "string" || key.includes("..") || key.startsWith("/")) {
      return NextResponse.json({ error: "Key inválido" }, { status: 400 });
    }

    await deleteFile(key);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
