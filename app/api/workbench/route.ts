import { NextResponse } from "next/server";
import { workbenchService } from "@/lib/finance/workbenchService";

export async function GET() {
  try {
    const state = workbenchService.getState();
    return NextResponse.json({ success: true, state });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to get workbench state" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    let updatedState;
    switch (action) {
      case "set_stage":
        updatedState = workbenchService.setStage(payload?.stage || 1);
        break;
      case "set_tab":
        updatedState = workbenchService.setActiveTab(payload?.tab || "close");
        break;
      case "reconcile":
        updatedState = workbenchService.runReconciliation();
        break;
      case "select_exception":
        updatedState = workbenchService.selectException(payload?.id || "exc-cloudflare");
        break;
      case "approve_entry":
        updatedState = workbenchService.approveEntry(payload?.actor);
        break;
      case "backtest_policy":
        updatedState = workbenchService.backtestPolicy();
        break;
      case "activate_policy":
        updatedState = workbenchService.activatePolicy(payload?.actor);
        break;
      case "reset":
        updatedState = workbenchService.reset();
        break;
      default:
        updatedState = workbenchService.getState();
    }

    return NextResponse.json({ success: true, state: updatedState });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update workbench state" },
      { status: 400 }
    );
  }
}
