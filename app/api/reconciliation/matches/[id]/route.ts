import { NextResponse } from "next/server";
import { decideReconciliationMatch } from "@/lib/orchestrator";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const decision = body.decision as "APPROVED" | "REJECTED";
    const decidedBy = typeof body.decidedBy === "string" ? body.decidedBy : "current-user";

    if (decision !== "APPROVED" && decision !== "REJECTED") {
      return NextResponse.json({ success: false, error: "decision must be APPROVED or REJECTED" }, { status: 400 });
    }

    const match = await decideReconciliationMatch(id, decision, decidedBy);
    return NextResponse.json({ success: true, data: match });
  } catch (error) {
    console.error("Failed to record reconciliation decision:", error);
    return NextResponse.json({ success: false, error: "Failed to record reconciliation decision" }, { status: 500 });
  }
}
