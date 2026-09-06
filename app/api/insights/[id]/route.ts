import { updateInsightStatus } from "@/lib/orchestrator/insights";
import { logAudit } from "@/lib/orchestrator/activityLog";
import { ok, handleApiError, ValidationError } from "@/lib/api/http";

const VALID_STATUSES = new Set(["ACKNOWLEDGED", "RESOLVED", "DISMISSED"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const status = typeof body.status === "string" ? body.status : "";
    if (!VALID_STATUSES.has(status)) {
      throw new ValidationError("INVALID_STATUS", "status must be ACKNOWLEDGED, RESOLVED, or DISMISSED");
    }

    const insight = await updateInsightStatus(id, status as "ACKNOWLEDGED" | "RESOLVED" | "DISMISSED");

    await logAudit({
      organizationId: insight.organizationId,
      action: `INSIGHT_${status}`,
      entityType: "AIInsight",
      entityId: insight.id,
    });

    return ok(insight);
  } catch (error) {
    return handleApiError(error, "INSIGHT_UPDATE_FAILED", "Failed to update insight");
  }
}
