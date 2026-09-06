import { NextResponse } from "next/server";
import { getPayoutService } from "@/lib/finance/payoutService";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const scenario = body.scenario as "FULL" | "PARTIAL" | "NONE" | undefined;

    const payoutService = getPayoutService();
    const result = await payoutService.rerunReconciliationWithEvidence(id, { scenario });

    if (!result) {
      return NextResponse.json(
        { success: false, error: `Payout ${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.payout,
      evidence: result.evidence,
      message:
        result.evidence.difference === 0
          ? "Deterministic reconciliation re-executed successfully. Discrepancy 100% resolved via verified evidence."
          : `Reconciliation re-executed. Remaining variance: ₹${result.evidence.difference.toLocaleString("en-IN")}.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to re-run reconciliation.",
      },
      { status: 500 }
    );
  }
}
