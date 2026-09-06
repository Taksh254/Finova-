import prisma from "@/lib/db/prisma";
import { logAudit } from "@/lib/orchestrator/activityLog";
import { ok, fail, handleApiError, ValidationError } from "@/lib/api/http";

const VALID_STATUSES = new Set(["DRAFT", "SENT", "PENDING", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED", "EXCEPTION"]);

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { customer: true, items: true, payments: true },
    });
    if (!invoice) return fail("INVOICE_NOT_FOUND", "Invoice could not be found.", 404);
    return ok(invoice);
  } catch (error) {
    return handleApiError(error, "INVOICE_FETCH_FAILED", "Failed to fetch invoice");
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.invoice.findUnique({ where: { id } });
    if (!existing) return fail("INVOICE_NOT_FOUND", "Invoice could not be found.", 404);

    const status = typeof body.status === "string" ? body.status : undefined;
    if (status && !VALID_STATUSES.has(status)) {
      throw new ValidationError("INVALID_STATUS", `status must be one of ${Array.from(VALID_STATUSES).join(", ")}`);
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(status === "PAID" ? { paidDate: new Date() } : {}),
      },
      include: { customer: true, items: true, payments: true },
    });

    await logAudit({
      organizationId: invoice.organizationId,
      action: "INVOICE_UPDATED",
      entityType: "Invoice",
      entityId: invoice.id,
      metadata: { previousStatus: existing.status, newStatus: invoice.status },
    });

    return ok(invoice);
  } catch (error) {
    return handleApiError(error, "INVOICE_UPDATE_FAILED", "Failed to update invoice");
  }
}
