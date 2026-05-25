import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addNotification, NotificationType } from "@/lib/notifications-store";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message, type } = body as { message?: string; type?: NotificationType };

    if (!message || !type) {
      return NextResponse.json({ error: "message and type required" }, { status: 400 });
    }

    const validTypes: NotificationType[] = ["save", "compare", "success", "error"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid notification type" }, { status: 400 });
    }

    const notification = addNotification(session.user.id, message, type);
    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error("POST /api/notifications:", error);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}
