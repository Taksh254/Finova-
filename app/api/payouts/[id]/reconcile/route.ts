import { NextResponse } from "next/server";
import { getPayoutService } from "@/lib/finance/payoutService";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = getPayoutService();
    const result = await service.reconcilePayoutWithEvidence(id);

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Payout not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.payout,
      reconciliationEvidence: {
        matchedTransactions: result.evidence.matchedTransactions,
        grossSales: result.evidence.grossSales,
        platformFees: result.evidence.platformFees,
        refunds: result.evidence.refunds,
        taxes: result.evidence.taxes,
        expectedPayout: result.evidence.expectedPayout,
        actualReceived: result.evidence.actualReceived,
        difference: result.evidence.difference,
        status: result.evidence.status,
      },
      message: `Payout ${id} re-evaluated successfully. Status: ${result.evidence.status}.`,
    });
  } catch (error) {
    console.error("Failed to reconcile payout:", error);
    return NextResponse.json(
      { success: false, error: "Failed to run payout reconciliation" },
      { status: 500 }
    );
  }
}
