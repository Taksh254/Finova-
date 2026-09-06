import { NextResponse } from "next/server";
import { getPayoutService } from "@/lib/finance/payoutService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = getPayoutService();
    const payout = await service.getPayoutDetail(id);

    if (!payout) {
      return NextResponse.json(
        { success: false, error: "Payout not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: payout,
    });
  } catch (error) {
    console.error("Failed to fetch payout detail:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve payout detail" },
      { status: 500 }
    );
  }
}
