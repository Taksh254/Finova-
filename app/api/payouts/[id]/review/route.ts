import { NextResponse } from "next/server";
import { getPayoutService } from "@/lib/finance/payoutService";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { action, note, user } = body;

    if (!action || !["APPROVE_RESOLUTION", "REJECT", "REQUEST_EVIDENCE"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action. Must be APPROVE_RESOLUTION, REJECT, or REQUEST_EVIDENCE" },
        { status: 400 }
      );
    }

    const service = getPayoutService();
    const updatedPayout = await service.submitReview(
      id,
      action,
      note,
      user || "Taksh (Finance Controller)"
    );

    if (!updatedPayout) {
      return NextResponse.json(
        { success: false, error: "Payout not found" },
        { status: 404 }
      );
    }

    let message = "Review decision logged successfully.";
    if (action === "APPROVE_RESOLUTION") {
      message = "Discrepancy approved for booking to Disputed Gateway Receivables.";
    } else if (action === "REJECT") {
      message = "Settlement rejected. Dispute claim dispatched to gateway.";
    } else if (action === "REQUEST_EVIDENCE") {
      message = "Evidence request dispatched to payment gateway API.";
    }

    return NextResponse.json({
      success: true,
      data: updatedPayout,
      message,
    });
  } catch (error: any) {
    console.error("Failed to submit review:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}
