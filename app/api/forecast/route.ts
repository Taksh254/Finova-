import { calculateCashFlowForecast } from "@/lib/finance/forecast";
import { ok, handleApiError } from "@/lib/api/http";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId") || undefined;
    const forecast = await calculateCashFlowForecast(organizationId);
    return ok(forecast);
  } catch (error) {
    return handleApiError(error, "FORECAST_FAILED", "Failed to compute cash flow forecast");
  }
}
