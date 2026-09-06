import { NextResponse } from "next/server";
import { getAIService } from "@/lib/ai";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId") || undefined;
    const aiService = getAIService();
    const brief = await aiService.generateFinancialBrief(organizationId);
    return NextResponse.json({ success: true, data: brief });
  } catch (error) {
    console.error("Failed to generate AI financial brief:", error);
    return NextResponse.json(
      { success: false, error: "Failed to synthesize AI financial brief" },
      { status: 500 }
    );
  }
}
