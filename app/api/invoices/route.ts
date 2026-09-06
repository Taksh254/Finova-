import prisma from "@/lib/db/prisma";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";
import { logAudit } from "@/lib/orchestrator/activityLog";
import { ok, handleApiError, ValidationError } from "@/lib/api/http";

const VALID_TYPES = new Set(["RECEIVABLE", "PAYABLE"]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = await resolveScopedOrganizationId(searchParams.get("organizationId"));
    const status = searchParams.get("status") || undefined;
    const type = searchParams.get("type") || undefined;

    const invoices = await prisma.invoice.findMany({
      where: {
        organizationId: orgId,
        ...(status ? { status } : {}),
        ...(type ? { type } : {}),
      },
      orderBy: { dueDate: "asc" },
      include: { customer: true, items: true, payments: true },
    });
    return ok(invoices);
  } catch (error) {
    return handleApiError(error, "INVOICES_FETCH_FAILED", "Failed to fetch invoices");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orgId = await resolveScopedOrganizationId(typeof body.organizationId === "string" ? body.organizationId : undefined);

    const type = typeof body.type === "string" ? body.type : "RECEIVABLE";
    if (!VALID_TYPES.has(type)) throw new ValidationError("INVALID_TYPE", "type must be RECEIVABLE or PAYABLE");

    const vendorClient = typeof body.vendorClient === "string" ? body.vendorClient.trim() : "";
    if (!vendorClient) throw new ValidationError("INVALID_VENDOR_CLIENT", "vendorClient (client/vendor name) is required");

    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) throw new ValidationError("INVALID_AMOUNT", "amount must be a positive number");

    const dueDate = body.dueDate ? new Date(body.dueDate) : null;
    if (!dueDate || Number.isNaN(dueDate.getTime())) throw new ValidationError("INVALID_DUE_DATE", "dueDate is required and must be valid");

    const issueDate = body.issueDate ? new Date(body.issueDate) : new Date();

    const prefix = type === "RECEIVABLE" ? "INV-AR" : "INV-AP";
    const countForPrefix = await prisma.invoice.count({ where: { organizationId: orgId, invoiceNumber: { startsWith: prefix } } });
    const invoiceNumber = `${prefix}-${String(countForPrefix + 1).padStart(3, "0")}`;

    const invoice = await prisma.invoice.create({
      data: {
        organizationId: orgId,
        invoiceNumber,
        type,
        vendorClient,
        customerId: typeof body.customerId === "string" ? body.customerId : undefined,
        amount,
        issueDate,
        dueDate,
        status: "PENDING",
        description: typeof body.description === "string" ? body.description : undefined,
        items: {
          create: [
            {
              description: typeof body.description === "string" && body.description ? body.description : vendorClient,
              quantity: 1,
              unitPrice: amount,
              total: amount,
            },
          ],
        },
      },
      include: { items: true, customer: true },
    });

    await logAudit({
      organizationId: orgId,
      action: "INVOICE_CREATED",
      entityType: "Invoice",
      entityId: invoice.id,
      metadata: { invoiceNumber, type, amount, vendorClient },
    });

    return ok(invoice, 201);
  } catch (error) {
    return handleApiError(error, "INVOICE_CREATE_FAILED", "Failed to create invoice");
  }
}
