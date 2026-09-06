import { NextResponse } from "next/server";
import { getRecentActivity } from "@/lib/finance/metrics";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId") || undefined;
    const activity = await getRecentActivity(organizationId);
    return NextResponse.json({ success: true, data: activity });
  } catch (error) {
    console.error("Failed to fetch recent activity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch activity logs" },
      { status: 500 }
    );
  }
}
