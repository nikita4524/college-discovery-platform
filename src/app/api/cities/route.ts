import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cities = await prisma.college.findMany({
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    });
    const maxFee = await prisma.college.aggregate({ _max: { fees: true } });
    return NextResponse.json({
      cities: cities.map((c) => c.city),
      maxFee: maxFee._max.fees ?? 2500000,
    });
  } catch (error) {
    console.error("GET /api/cities:", error);
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 });
  }
}
