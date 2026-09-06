import { NextResponse } from "next/server";
import { getPayoutService } from "@/lib/finance/payoutService";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = getPayoutService();
    const updatedPayout = await service.reconcilePayout(id);

    if (!updatedPayout) {
      return NextResponse.json(
        { success: false, error: "Payout not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPayout,
      message: `Payout ${id} re-evaluated successfully.`,
    });
  } catch (error) {
    console.error("Failed to reconcile payout:", error);
    return NextResponse.json(
      { success: false, error: "Failed to run payout reconciliation" },
      { status: 500 }
    );
  }
}
