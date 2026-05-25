import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withResolvedImage } from "@/lib/college-images";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const city = searchParams.get("city") ?? "";
    const state = searchParams.get("state") ?? "";
    const minFee = searchParams.get("minFee");
    const maxFee = searchParams.get("maxFee");
    const rating = searchParams.get("rating");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.CollegeWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }
    const citiesParam = searchParams.get("cities") ?? city;
    if (citiesParam) {
      const cityList = citiesParam.split(",").filter(Boolean);
      if (cityList.length === 1) where.city = cityList[0];
      else if (cityList.length > 1) where.city = { in: cityList };
    }
    if (state) where.state = state;
    if (minFee || maxFee) {
      where.fees = {};
      if (minFee) (where.fees as { gte?: number }).gte = parseInt(minFee, 10);
      if (maxFee) (where.fees as { lte?: number }).lte = parseInt(maxFee, 10);
    }
    if (rating) where.rating = { gte: parseFloat(rating) };

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        include: { courses: true, placements: true },
        orderBy: { rating: "desc" },
        skip,
        take: limit,
      }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({
      colleges: colleges.map(withResolvedImage),
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error("GET /api/colleges:", error);
    return NextResponse.json({ error: "Failed to fetch colleges" }, { status: 500 });
  }
}
