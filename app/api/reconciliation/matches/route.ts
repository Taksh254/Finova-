import { NextResponse } from "next/server";
import { listReconciliationMatches, runReconciliationAgent } from "@/lib/orchestrator";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId") || undefined;
    const matches = await listReconciliationMatches(organizationId);
    return NextResponse.json({ success: true, data: matches });
  } catch (error) {
    console.error("Failed to list reconciliation matches:", error);
    return NextResponse.json({ success: false, error: "Failed to list reconciliation matches" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId") || undefined;
    const proposed = await runReconciliationAgent(organizationId);
    return NextResponse.json({ success: true, data: proposed });
  } catch (error) {
    console.error("Reconciliation Agent scan failed:", error);
    return NextResponse.json({ success: false, error: "Reconciliation Agent scan failed" }, { status: 500 });
  }
}
