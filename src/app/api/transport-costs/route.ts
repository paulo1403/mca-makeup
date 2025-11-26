import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Obtener todos los costos de transporte (API pública)
export async function GET() {
    try {
        const transportCosts = await prisma.transportCost.findMany({
            where: {
                isActive: true,
            },
            select: {
                district: true,
                cost: true,
                notes: true,
            },
            orderBy: {
                cost: "asc",
            },
        });

        return NextResponse.json(transportCosts);
    } catch (error) {
        console.error("Error fetching transport costs:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
