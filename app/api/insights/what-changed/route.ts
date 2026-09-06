import { calculateWhatChanged } from "@/lib/finance/whatChanged";
import { ok, handleApiError } from "@/lib/api/http";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId") || undefined;
    const changes = await calculateWhatChanged(organizationId);
    return ok({ changes });
  } catch (error) {
    return handleApiError(error, "WHAT_CHANGED_FAILED", "Failed to compute period-over-period changes");
  }
}
