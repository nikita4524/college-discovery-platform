import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateCSV } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      include: { college: { include: { placements: true } } },
      orderBy: { savedAt: "desc" },
    });

    const headers = [
      "Name",
      "Location",
      "Fees",
      "Rating",
      "Average Package",
      "Placement Rate",
    ];

    const data = saved.map((s) => ({
      Name: s.college.name,
      Location: s.college.location,
      Fees: s.college.fees,
      Rating: s.college.rating,
      "Average Package": s.college.placements?.averagePackage ?? "N/A",
      "Placement Rate": s.college.placements?.placementRate ?? "N/A",
    }));

    const csv = generateCSV(data, headers);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="saved-colleges.csv"',
      },
    });
  } catch (error) {
    console.error("GET /api/saved/export:", error);
    return NextResponse.json({ error: "Failed to export" }, { status: 500 });
  }
}
