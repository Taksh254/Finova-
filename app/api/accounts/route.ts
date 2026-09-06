import { getAccountBalances } from "@/lib/orchestrator/tools";
import { ok, handleApiError } from "@/lib/api/http";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId") || undefined;
    const accounts = await getAccountBalances(organizationId);
    return ok(accounts);
  } catch (error) {
    return handleApiError(error, "ACCOUNTS_FETCH_FAILED", "Failed to fetch accounts");
  }
}
