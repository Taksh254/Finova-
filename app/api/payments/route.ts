import prisma from "@/lib/db/prisma";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";
import { ok, handleApiError } from "@/lib/api/http";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = await resolveScopedOrganizationId(searchParams.get("organizationId"));
    const payments = await prisma.payment.findMany({
      where: { organizationId: orgId },
      orderBy: { paymentDate: "desc" },
      include: { invoice: true, transaction: true },
    });
    return ok(payments);
  } catch (error) {
    return handleApiError(error, "PAYMENTS_FETCH_FAILED", "Failed to fetch payments");
  }
}
