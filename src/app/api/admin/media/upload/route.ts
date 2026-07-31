import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { randomUUID } from "crypto";
import { uploadFile } from "@/lib/minio";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Archivo no válido" }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: `Tipo no permitido: ${file.type}` }, { status: 400 });
    }
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "Archivo muy grande (máx 25MB)" }, { status: 413 });
    }

    const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "";
    const safeExt = ext && /^[a-z0-9]+$/.test(ext) ? ext : "bin";
    const prefix = file.type.startsWith("video/") ? "videos" : "services";
    const key = `${prefix}/${randomUUID()}-${Date.now()}.${safeExt}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadFile(key, buffer, file.type);

    return NextResponse.json({ key, url: `/media/${key}`, type: file.type });
  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json({ error: "Error interno al subir archivo" }, { status: 500 });
  }
}
