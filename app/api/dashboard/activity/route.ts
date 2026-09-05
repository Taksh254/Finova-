import { NextResponse } from "next/server";
import { getRecentActivity } from "@/lib/finance/metrics";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId") || undefined;
    const activity = await getRecentActivity(companyId);
    return NextResponse.json({ success: true, data: activity });
  } catch (error) {
    console.error("Failed to fetch recent activity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch activity logs" },
      { status: 500 }
    );
  }
}
