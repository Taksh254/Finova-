import { NextResponse } from "next/server";
import { getNeedsAttentionItems } from "@/lib/finance/metrics";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId") || undefined;
    const items = await getNeedsAttentionItems(organizationId);
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Failed to fetch attention items:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch attention items" },
      { status: 500 }
    );
  }
}
