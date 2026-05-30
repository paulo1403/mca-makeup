import { NextResponse } from "next/server";
import { z } from "zod";
import { parseFinanceText } from "@/utils/financeParser";

const parseBodySchema = z.object({
  text: z.string().min(1, "Debes pegar contenido para analizar."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = parseBodySchema.parse(body);

    const parsed = parseFinanceText(text, "PASTE");

    return NextResponse.json({
      success: true,
      ...parsed,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Entrada inválida",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("Error parsing finance text:", error);
    return NextResponse.json(
      {
        success: false,
        message: "No se pudo analizar el contenido",
      },
      { status: 500 },
    );
  }
}
