import { getDashboardOverview } from "@/lib/dashboard/overview";
import { ok, handleApiError } from "@/lib/api/http";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId") || undefined;
    const overview = await getDashboardOverview(organizationId);
    return ok(overview);
  } catch (error) {
    return handleApiError(error, "DASHBOARD_OVERVIEW_FAILED", "Failed to compute dashboard overview");
  }
}
