import prisma from "@/lib/db/prisma";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";
import { logAudit } from "@/lib/orchestrator/activityLog";
import { ok, handleApiError, ValidationError } from "@/lib/api/http";

const VALID_TYPES = new Set(["REVENUE", "EXPENSE", "TRANSFER"]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cId = await resolveScopedOrganizationId(searchParams.get("organizationId"));
    const type = searchParams.get("type") || undefined;
    const category = searchParams.get("category") || undefined;
    const limit = Number(searchParams.get("limit") || 100);

    const transactions = await prisma.transaction.findMany({
      where: {
        organizationId: cId,
        ...(type ? { type } : {}),
        ...(category ? { category } : {}),
      },
      orderBy: { date: "desc" },
      take: Math.min(limit, 500),
      include: { account: true },
    });
    return ok(transactions);
  } catch (error) {
    return handleApiError(error, "TRANSACTIONS_FETCH_FAILED", "Failed to fetch transactions");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cId = await resolveScopedOrganizationId(typeof body.organizationId === "string" ? body.organizationId : undefined);

    const type = typeof body.type === "string" ? body.type : "";
    if (!VALID_TYPES.has(type)) throw new ValidationError("INVALID_TYPE", "type must be REVENUE, EXPENSE, or TRANSFER");

    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) throw new ValidationError("INVALID_AMOUNT", "amount must be a positive number");

    const category = typeof body.category === "string" ? body.category.trim() : "";
    if (!category) throw new ValidationError("INVALID_CATEGORY", "category is required");

    const description = typeof body.description === "string" ? body.description.trim() : "";
    if (!description) throw new ValidationError("INVALID_DESCRIPTION", "description is required");

    const date = body.date ? new Date(body.date) : new Date();
    if (Number.isNaN(date.getTime())) throw new ValidationError("INVALID_DATE", "date is invalid");

    const transaction = await prisma.transaction.create({
      data: {
        organizationId: cId,
        type,
        category,
        subCategory: typeof body.subCategory === "string" ? body.subCategory : undefined,
        vendor: typeof body.vendor === "string" ? body.vendor : undefined,
        amount,
        description,
        date,
        reference: typeof body.reference === "string" ? body.reference : undefined,
        accountId: typeof body.accountId === "string" ? body.accountId : undefined,
        status: "CLEARED",
      },
    });

    await logAudit({
      organizationId: cId,
      action: type === "EXPENSE" ? "EXPENSE_RECORDED" : "TRANSACTION_RECORDED",
      entityType: "Transaction",
      entityId: transaction.id,
      metadata: { type, amount, category },
    });

    return ok(transaction, 201);
  } catch (error) {
    return handleApiError(error, "TRANSACTION_CREATE_FAILED", "Failed to record transaction");
  }
}
