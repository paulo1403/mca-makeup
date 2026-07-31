import { type NextRequest } from "next/server";
import { getObject } from "@/lib/minio";

export const revalidate = 86400;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> },
) {
  try {
    const { key } = await params;
    const objectKey = key.join("/");
    if (!objectKey || objectKey.includes("..") || objectKey.startsWith("/")) {
      return new Response("Invalid key", { status: 400 });
    }

    const res = await getObject(objectKey);
    if (!res.Body) return new Response("Not found", { status: 404 });

    const body = await res.Body.transformToByteArray();
    return new Response(new Uint8Array(body), {
      status: 200,
      headers: {
        "Content-Type": res.ContentType || "application/octet-stream",
        "Cache-Control": "public, max-age=86400, immutable",
        "Content-Length": String(body.length),
      },
    });
  } catch (error) {
    console.error("Error serving media:", error);
    return new Response("Not found", { status: 404 });
  }
}
