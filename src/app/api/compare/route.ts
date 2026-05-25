import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withResolvedImage } from "@/lib/college-images";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const collegeIds: string[] = body.collegeIds ?? [];

    if (!Array.isArray(collegeIds) || collegeIds.length === 0) {
      return NextResponse.json({ error: "collegeIds required" }, { status: 400 });
    }
    if (collegeIds.length > 3) {
      return NextResponse.json({ error: "Maximum 3 colleges allowed" }, { status: 400 });
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: collegeIds } },
      include: { courses: true, placements: true },
    });

    const ordered = collegeIds
      .map((id) => colleges.find((c) => c.id === id))
      .filter(Boolean);

    return NextResponse.json(ordered.map((c) => withResolvedImage(c!)));
  } catch (error) {
    console.error("POST /api/compare:", error);
    return NextResponse.json({ error: "Failed to compare colleges" }, { status: 500 });
  }
}
