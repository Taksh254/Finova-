import { listInsights } from "@/lib/orchestrator/insights";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";
import { ok, handleApiError } from "@/lib/api/http";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cId = await resolveScopedOrganizationId(searchParams.get("organizationId"));
    const status = searchParams.get("status") || undefined;
    const insights = await listInsights(cId, status);
    return ok(insights);
  } catch (error) {
    return handleApiError(error, "INSIGHTS_FETCH_FAILED", "Failed to fetch insights");
  }
}
