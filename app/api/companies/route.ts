import prisma from "@/lib/db/prisma";
import { ok, handleApiError } from "@/lib/api/http";

export async function GET() {
  try {
    const companies = await prisma.organization.findMany({ orderBy: { createdAt: "asc" } });
    return ok(companies);
  } catch (error) {
    return handleApiError(error, "COMPANIES_FETCH_FAILED", "Failed to fetch companies");
  }
}
