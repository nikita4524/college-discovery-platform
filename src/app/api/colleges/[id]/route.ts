import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withResolvedImage } from "@/lib/college-images";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const college = await prisma.college.findUnique({
      where: { id: params.id },
      include: {
        courses: true,
        placements: true,
        reviews: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { id: true, name: true, image: true } } },
        },
      },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    let isSaved = false;
    if (session?.user?.id) {
      const saved = await prisma.savedCollege.findUnique({
        where: {
          userId_collegeId: {
            userId: session.user.id,
            collegeId: params.id,
          },
        },
      });
      isSaved = !!saved;
    }

    return NextResponse.json({ ...withResolvedImage(college), isSaved });
  } catch (error) {
    console.error("GET /api/colleges/[id]:", error);
    return NextResponse.json({ error: "Failed to fetch college" }, { status: 500 });
  }
}
