import { runOrchestrator } from "@/lib/orchestrator/runAll";
import { ok, handleApiError } from "@/lib/api/http";

/**
 * Triggers the full Agent Orchestrator pipeline (Cash + Expense + Revenue in
 * parallel -> Reconciliation -> Risk). This is what the dashboard's
 * "Sync All Agents" button calls.
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId") || undefined;
    const result = await runOrchestrator(organizationId);
    return ok(result);
  } catch (error) {
    return handleApiError(error, "ORCHESTRATOR_RUN_FAILED", "Agent Orchestrator run failed");
  }
}
