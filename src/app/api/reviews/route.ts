import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { collegeId, rating, comment } = await request.json();
    if (!collegeId || !rating || !comment) {
      return NextResponse.json(
        { error: "collegeId, rating, and comment required" },
        { status: 400 }
      );
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        collegeId,
        userId: session.user.id,
        rating,
        comment,
      },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, image: true } },
        college: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("GET /api/reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
