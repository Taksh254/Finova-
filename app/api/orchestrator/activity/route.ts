import { NextResponse } from "next/server";
import { getRecentAgentActivity } from "@/lib/orchestrator";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId") || undefined;
    const limit = Number(searchParams.get("limit") || 20);
    const activity = await getRecentAgentActivity(organizationId, limit);
    return NextResponse.json({ success: true, data: activity });
  } catch (error) {
    console.error("Failed to fetch agent activity:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch agent activity" }, { status: 500 });
  }
}
