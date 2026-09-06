/**
 * "Expenses" are EXPENSE-type Transactions - there is no separate Expense
 * table (see prisma/schema.prisma comments). This route is a thin,
 * category-scoped view over /api/transactions so the Expenses page and the
 * "Add Expense" modal don't need to know that detail.
 */
import prisma from "@/lib/db/prisma";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";
import { logAudit } from "@/lib/orchestrator/activityLog";
import { ok, handleApiError, ValidationError } from "@/lib/api/http";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cId = await resolveScopedOrganizationId(searchParams.get("organizationId"));
    const category = searchParams.get("category") || undefined;
    const limit = Number(searchParams.get("limit") || 100);

    const expenses = await prisma.transaction.findMany({
      where: { organizationId: cId, type: "EXPENSE", ...(category ? { category } : {}) },
      orderBy: { date: "desc" },
      take: Math.min(limit, 500),
      include: { account: true },
    });
    return ok(expenses);
  } catch (error) {
    return handleApiError(error, "EXPENSES_FETCH_FAILED", "Failed to fetch expenses");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cId = await resolveScopedOrganizationId(typeof body.organizationId === "string" ? body.organizationId : undefined);

    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) throw new ValidationError("INVALID_AMOUNT", "amount must be a positive number");

    const category = typeof body.category === "string" ? body.category.trim() : "";
    if (!category) throw new ValidationError("INVALID_CATEGORY", "category is required");

    const vendor = typeof body.vendor === "string" ? body.vendor.trim() : "";
    if (!vendor) throw new ValidationError("INVALID_VENDOR", "vendor is required");

    const date = body.date ? new Date(body.date) : new Date();
    if (Number.isNaN(date.getTime())) throw new ValidationError("INVALID_DATE", "date is invalid");

    const expense = await prisma.transaction.create({
      data: {
        organizationId: cId,
        type: "EXPENSE",
        category,
        vendor,
        amount,
        description: typeof body.description === "string" && body.description.trim() ? body.description.trim() : `${category} — ${vendor}`,
        date,
        accountId: typeof body.accountId === "string" ? body.accountId : undefined,
        status: "CLEARED",
      },
    });

    await logAudit({
      organizationId: cId,
      action: "EXPENSE_RECORDED",
      entityType: "Transaction",
      entityId: expense.id,
      metadata: { amount, category, vendor },
    });

    return ok(expense, 201);
  } catch (error) {
    return handleApiError(error, "EXPENSE_CREATE_FAILED", "Failed to record expense");
  }
}
