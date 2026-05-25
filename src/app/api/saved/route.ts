import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withResolvedImage } from "@/lib/college-images";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      include: {
        college: { include: { courses: true, placements: true } },
      },
      orderBy: { savedAt: "desc" },
    });

    return NextResponse.json(
      saved.map((s) => ({
        ...s,
        college: withResolvedImage(s.college),
      }))
    );
  } catch (error) {
    console.error("GET /api/saved:", error);
    return NextResponse.json({ error: "Failed to fetch saved colleges" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { collegeId } = await request.json();
    if (!collegeId) {
      return NextResponse.json({ error: "collegeId required" }, { status: 400 });
    }

    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: { userId: session.user.id, collegeId },
      },
    });
    if (existing) {
      return NextResponse.json(existing);
    }

    const saved = await prisma.savedCollege.create({
      data: { userId: session.user.id, collegeId },
      include: { college: true },
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Already saved" }, { status: 400 });
    }
    console.error("POST /api/saved:", error);
    return NextResponse.json({ error: "Failed to save college" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { collegeId } = await request.json();
    if (!collegeId) {
      return NextResponse.json({ error: "collegeId required" }, { status: 400 });
    }

    await prisma.savedCollege.deleteMany({
      where: { userId: session.user.id, collegeId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/saved:", error);
    return NextResponse.json({ error: "Failed to remove saved college" }, { status: 500 });
  }
}
