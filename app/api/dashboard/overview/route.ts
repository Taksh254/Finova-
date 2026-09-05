import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/lib/finance/metrics";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId") || undefined;
    const metrics = await getDashboardMetrics(companyId);
    return NextResponse.json({ success: true, data: metrics });
  } catch (error) {
    console.error("Failed to fetch dashboard metrics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to compute financial metrics" },
      { status: 500 }
    );
  }
}
