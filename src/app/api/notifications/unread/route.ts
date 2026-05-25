import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUnreadCount } from "@/lib/notifications-store";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const count = getUnreadCount(session.user.id);
    return NextResponse.json({ count });
  } catch (error) {
    console.error("GET /api/notifications/unread:", error);
    return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 });
  }
}
