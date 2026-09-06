import { NextResponse } from "next/server";
import { getCashFlowChartData } from "@/lib/finance/metrics";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId") || undefined;
    const chartData = await getCashFlowChartData(organizationId);
    return NextResponse.json({ success: true, data: chartData });
  } catch (error) {
    console.error("Failed to fetch cash flow data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cash flow entries" },
      { status: 500 }
    );
  }
}
