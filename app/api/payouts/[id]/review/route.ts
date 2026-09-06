import { NextResponse } from "next/server";
import { getPayoutService } from "@/lib/finance/payoutService";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const {
      action,
      note,
      explanation,
      evidenceReference,
      requestedEvidence,
      escalationReason,
      user,
    } = body;

    const validActions = [
      "APPROVE_EXPLANATION",
      "APPROVE_RESOLUTION",
      "REQUEST_EVIDENCE",
      "ESCALATE",
      "REJECT",
    ];

    if (!action || !validActions.includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid action. Must be APPROVE_EXPLANATION, REQUEST_EVIDENCE, or ESCALATE.",
        },
        { status: 400 }
      );
    }

    // Validation
    if ((action === "APPROVE_EXPLANATION" || action === "APPROVE_RESOLUTION") && !explanation && !note) {
      return NextResponse.json(
        { success: false, error: "Explanation / Reason is required." },
        { status: 400 }
      );
    }

    if (action === "REQUEST_EVIDENCE" && !requestedEvidence && !note) {
      return NextResponse.json(
        { success: false, error: "Please specify what evidence is needed." },
        { status: 400 }
      );
    }

    if ((action === "ESCALATE" || action === "REJECT") && !escalationReason && !note) {
      return NextResponse.json(
        { success: false, error: "Please provide an escalation reason or note." },
        { status: 400 }
      );
    }

    const service = getPayoutService();
    const updatedPayout = await service.submitReview(
      id,
      action,
      {
        action,
        note,
        explanation: explanation || note,
        evidenceReference,
        requestedEvidence: requestedEvidence || note,
        escalationReason: escalationReason || note,
        user: user || "Taksh (Finance Controller)",
      }
    );

    if (!updatedPayout) {
      return NextResponse.json(
        { success: false, error: "Payout not found" },
        { status: 404 }
      );
    }

    let message = "Review decision logged successfully.";
    if (action === "APPROVE_EXPLANATION" || action === "APPROVE_RESOLUTION") {
      message = "Human explanation recorded. Discrepancy logged for evidence verification.";
    } else if (action === "ESCALATE" || action === "REJECT") {
      message = "Payout escalated for formal gateway dispute and senior audit.";
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
