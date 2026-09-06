import prisma from "@/lib/db/prisma";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";
import { ok, handleApiError, ValidationError } from "@/lib/api/http";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = await resolveScopedOrganizationId(searchParams.get("organizationId"));
    const customers = await prisma.customer.findMany({
      where: { organizationId: orgId },
      orderBy: { name: "asc" },
      include: { invoices: { select: { id: true, status: true, amount: true } } },
    });
    return ok(customers);
  } catch (error) {
    return handleApiError(error, "CUSTOMERS_FETCH_FAILED", "Failed to fetch customers");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orgId = await resolveScopedOrganizationId(typeof body.organizationId === "string" ? body.organizationId : undefined);

    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) throw new ValidationError("INVALID_NAME", "name is required");

    const customer = await prisma.customer.create({
      data: {
        organizationId: orgId,
        name,
        email: typeof body.email === "string" ? body.email : undefined,
        phone: typeof body.phone === "string" ? body.phone : undefined,
        companyName: typeof body.companyName === "string" ? body.companyName : undefined,
      },
    });
    return ok(customer, 201);
  } catch (error) {
    return handleApiError(error, "CUSTOMER_CREATE_FAILED", "Failed to create customer");
  }
}
