/**
 * Deterministic "tools" the Agent Orchestrator's specialist agents call to
 * ground their output in real Finova data. Every function here only reads
 * from Prisma - no LLM calls - so results are always trustworthy inputs for
 * the agents that then reason over them. Agents never touch Prisma directly.
 */

import prisma from "@/lib/db/prisma";
import { getDashboardMetrics, getCashFlowChartData } from "@/lib/finance/metrics";
import { REFERENCE_DATE } from "@/lib/finance/referenceDate";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";

async function resolveCompanyId(organizationId?: string): Promise<string> {
  return resolveScopedOrganizationId(organizationId);
}

export async function getCompanyFinancialSummary(organizationId?: string) {
  const cId = await resolveCompanyId(organizationId);
  const metrics = await getDashboardMetrics(cId);
  const company = await prisma.organization.findUnique({ where: { id: cId } });
  return { company: company?.displayName, currency: company?.currency, ...metrics };
}
// Backwards-compatible alias used throughout the existing orchestrator code.
export const getFinancialSummary = getCompanyFinancialSummary;

export async function getTransactions(
  organizationId?: string,
  filters: { type?: string; category?: string; accountId?: string; from?: Date; to?: Date; limit?: number } = {}
) {
  const cId = await resolveCompanyId(organizationId);
  return prisma.transaction.findMany({
    where: {
      organizationId: cId,
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.accountId ? { accountId: filters.accountId } : {}),
      ...(filters.from || filters.to
        ? { date: { ...(filters.from ? { gte: filters.from } : {}), ...(filters.to ? { lte: filters.to } : {}) } }
        : {}),
    },
    orderBy: { date: "desc" },
    take: filters.limit ?? 200,
    include: { account: true },
  });
}

export async function getRecentTransactions(organizationId?: string, limit = 15) {
  const cId = await resolveCompanyId(organizationId);
  return prisma.transaction.findMany({
    where: { organizationId: cId },
    orderBy: { date: "desc" },
    take: limit,
    include: { account: true },
  });
}

export async function getExpenses(organizationId?: string, filters: { category?: string; from?: Date; to?: Date } = {}) {
  return getTransactions(organizationId, { ...filters, type: "EXPENSE", limit: 500 });
}

export async function getRevenue(organizationId?: string, filters: { category?: string; from?: Date; to?: Date } = {}) {
  return getTransactions(organizationId, { ...filters, type: "REVENUE", limit: 500 });
}

export async function getHistoricalExpenses(organizationId?: string, months = 6) {
  const cId = await resolveCompanyId(organizationId);
  const since = new Date(REFERENCE_DATE);
  since.setMonth(since.getMonth() - months);
  return prisma.transaction.findMany({
    where: { organizationId: cId, type: "EXPENSE", date: { gte: since } },
    orderBy: { date: "asc" },
  });
}

export async function getHistoricalRevenue(organizationId?: string, months = 6) {
  const cId = await resolveCompanyId(organizationId);
  const since = new Date(REFERENCE_DATE);
  since.setMonth(since.getMonth() - months);
  return prisma.transaction.findMany({
    where: { organizationId: cId, type: "REVENUE", date: { gte: since } },
    orderBy: { date: "asc" },
  });
}

export async function getInvoices(organizationId?: string, filters: { type?: string; status?: string } = {}) {
  const cId = await resolveCompanyId(organizationId);
  return prisma.invoice.findMany({
    where: {
      organizationId: cId,
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    },
    orderBy: { dueDate: "asc" },
    include: { customer: true, items: true },
  });
}

export async function getOverdueInvoices(organizationId?: string) {
  const cId = await resolveCompanyId(organizationId);
  return prisma.invoice.findMany({
    where: { organizationId: cId, status: "OVERDUE" },
    orderBy: { dueDate: "asc" },
    include: { customer: true },
  });
}

export async function getUpcomingPayables(organizationId?: string, days = 7) {
  const cId = await resolveCompanyId(organizationId);
  const end = new Date(REFERENCE_DATE);
  end.setDate(end.getDate() + days);
  return prisma.invoice.findMany({
    where: {
      organizationId: cId,
      type: "PAYABLE",
      status: "PENDING",
      dueDate: { gte: REFERENCE_DATE, lte: end },
    },
    orderBy: { dueDate: "asc" },
  });
}

export async function getCustomerPaymentHistory(customerId: string) {
  return prisma.invoice.findMany({
    where: { customerId },
    include: { payments: true },
    orderBy: { issueDate: "desc" },
  });
}

export async function getCustomerConcentration(organizationId?: string) {
  const cId = await resolveCompanyId(organizationId);
  const invoices = await prisma.invoice.findMany({
    where: { organizationId: cId, type: "RECEIVABLE" },
    include: { customer: true },
  });
  const totals = new Map<string, { name: string; total: number }>();
  let grandTotal = 0;
  for (const inv of invoices) {
    const key = inv.customerId || inv.vendorClient;
    const name = inv.customer?.name || inv.vendorClient;
    const existing = totals.get(key) || { name, total: 0 };
    existing.total += inv.amount;
    totals.set(key, existing);
    grandTotal += inv.amount;
  }
  return Array.from(totals.entries())
    .map(([customerId, v]) => ({
      customerId,
      name: v.name,
      total: v.total,
      shareOfTotal: grandTotal > 0 ? Math.round((v.total / grandTotal) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export async function getAccountBalances(organizationId?: string) {
  const cId = await resolveCompanyId(organizationId);
  return prisma.account.findMany({ where: { organizationId: cId, status: "ACTIVE" }, orderBy: { balance: "desc" } });
}

export async function getCashPosition(organizationId?: string) {
  const cId = await resolveCompanyId(organizationId);
  const accounts = await getAccountBalances(cId);
  const total = accounts.reduce((sum, a) => sum + a.balance, 0);
  return { total, accounts };
}

/**
 * Deterministic runway estimate: current cash divided by the average net
 * monthly burn over the trailing window (revenue - expenses, floored at a
 * minimum so a net-positive company doesn't report an infinite runway).
 */
export async function calculateCashRunway(organizationId?: string, trailingMonths = 3) {
  const cId = await resolveCompanyId(organizationId);
  const cash = await getCashPosition(cId);
  const since = new Date(REFERENCE_DATE);
  since.setMonth(since.getMonth() - trailingMonths);

  const [revenue, expenses] = await Promise.all([
    prisma.transaction.aggregate({ where: { organizationId: cId, type: "REVENUE", date: { gte: since } }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { organizationId: cId, type: "EXPENSE", date: { gte: since } }, _sum: { amount: true } }),
  ]);

  const avgMonthlyRevenue = (revenue._sum.amount || 0) / trailingMonths;
  const avgMonthlyExpense = (expenses._sum.amount || 0) / trailingMonths;
  const netBurn = avgMonthlyExpense - avgMonthlyRevenue;
  const effectiveBurn = Math.max(netBurn, avgMonthlyExpense * 0.1); // guard against div-by-~0 for net-positive companies

  return {
    currentCash: cash.total,
    avgMonthlyRevenue: Math.round(avgMonthlyRevenue),
    avgMonthlyExpense: Math.round(avgMonthlyExpense),
    netBurn: Math.round(netBurn),
    runwayMonths: effectiveBurn > 0 ? Math.round((cash.total / effectiveBurn) * 10) / 10 : null,
  };
}

export async function getCashFlowTrend(organizationId?: string) {
  const cId = await resolveCompanyId(organizationId);
  return getCashFlowChartData(cId);
}

export async function getOpenExceptions(organizationId?: string) {
  const cId = await resolveCompanyId(organizationId);
  return prisma.exception.findMany({
    where: { organizationId: cId, status: { in: ["OPEN", "IN_REVIEW"] } },
    orderBy: { severity: "desc" },
  });
}

/**
 * Finds bank transactions that don't yet have an approved reconciliation
 * match against a pending/overdue invoice of the opposite (matching) type,
 * scored by amount proximity and date proximity. This is the deterministic
 * pass the Reconciliation Agent refines with an LLM-written rationale.
 */
export async function findReconciliationCandidates(organizationId?: string) {
  const cId = await resolveCompanyId(organizationId);

  const [transactions, invoices, existingMatches] = await Promise.all([
    prisma.transaction.findMany({ where: { organizationId: cId } }),
    prisma.invoice.findMany({ where: { organizationId: cId, status: { in: ["PENDING", "OVERDUE"] } } }),
    prisma.reconciliationMatch.findMany({ where: { organizationId: cId, status: { not: "REJECTED" } } }),
  ]);

  const matchedTransactionIds = new Set(existingMatches.map((m) => m.transactionId));
  const matchedInvoiceIds = new Set(existingMatches.map((m) => m.invoiceId));

  const candidates: Array<{
    transaction: (typeof transactions)[number];
    invoice: (typeof invoices)[number];
    amountDeltaPct: number;
    dayDelta: number;
    score: number;
  }> = [];

  for (const tx of transactions) {
    if (matchedTransactionIds.has(tx.id)) continue;

    for (const inv of invoices) {
      if (matchedInvoiceIds.has(inv.id)) continue;

      // A RECEIVABLE invoice is settled by an inbound REVENUE transaction;
      // a PAYABLE invoice is settled by an outbound EXPENSE transaction.
      const typeAligns =
        (inv.type === "RECEIVABLE" && tx.type === "REVENUE") ||
        (inv.type === "PAYABLE" && tx.type === "EXPENSE");
      if (!typeAligns) continue;

      const amountDeltaPct = Math.abs(tx.amount - inv.amount) / inv.amount;
      if (amountDeltaPct > 0.05) continue; // more than 5% off - not a candidate

      const dayDelta = Math.abs((tx.date.getTime() - inv.dueDate.getTime()) / 86_400_000);
      if (dayDelta > 45) continue;

      const amountScore = 1 - amountDeltaPct / 0.05; // 1.0 at exact match, 0 at 5% off
      const dateScore = 1 - Math.min(dayDelta, 45) / 45;
      const score = Math.round((amountScore * 0.7 + dateScore * 0.3) * 100) / 100;

      candidates.push({ transaction: tx, invoice: inv, amountDeltaPct, dayDelta, score });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates;
}

export async function findPotentialInvoiceMatches(organizationId?: string) {
  return findReconciliationCandidates(organizationId);
}

export async function getTransactionById(organizationId: string | undefined, transactionId: string) {
  const cId = await resolveCompanyId(organizationId);
  return prisma.transaction.findFirst({ where: { id: transactionId, organizationId: cId }, include: { account: true } });
}

export async function getInvoiceById(organizationId: string | undefined, invoiceId: string) {
  const cId = await resolveCompanyId(organizationId);
  return prisma.invoice.findFirst({ where: { id: invoiceId, organizationId: cId }, include: { customer: true, items: true, payments: true } });
}

/**
 * A ledger view: transactions in chronological order with a running total.
 * The running total is a relative net-flow accumulator (REVENUE +, EXPENSE -,
 * TRANSFER excluded), not a reconciled account balance snapshot - it answers
 * "how did the numbers move", not "what does the bank say the balance was".
 */
export async function getLedger(
  organizationId?: string,
  filters: { accountId?: string; from?: Date; to?: Date; limit?: number } = {}
) {
  const cId = await resolveCompanyId(organizationId);
  const transactions = await prisma.transaction.findMany({
    where: {
      organizationId: cId,
      ...(filters.accountId ? { accountId: filters.accountId } : {}),
      ...(filters.from || filters.to
        ? { date: { ...(filters.from ? { gte: filters.from } : {}), ...(filters.to ? { lte: filters.to } : {}) } }
        : {}),
    },
    orderBy: { date: "asc" },
    take: filters.limit ?? 500,
    include: { account: true },
  });

  let runningTotal = 0;
  return transactions.map((tx) => {
    const signedAmount = tx.type === "EXPENSE" ? -Number(tx.amount) : tx.type === "REVENUE" ? Number(tx.amount) : 0;
    runningTotal += signedAmount;
    return { ...tx, signedAmount, runningTotal: Math.round(runningTotal) };
  });
}

/**
 * Categorizes a transaction. This is a WRITE tool - callers must go through
 * the agent tool registry (which enforces confirmation + writes an audit
 * record), never call this directly from an LLM-authored code path.
 */
export async function categorizeTransaction(
  organizationId: string | undefined,
  transactionId: string,
  category: string,
  subCategory?: string
) {
  const cId = await resolveCompanyId(organizationId);
  const existing = await prisma.transaction.findFirst({ where: { id: transactionId, organizationId: cId } });
  if (!existing) throw new Error(`Transaction ${transactionId} not found for this company`);

  const updated = await prisma.transaction.update({
    where: { id: transactionId },
    data: { category, ...(subCategory !== undefined ? { subCategory } : {}) },
  });

  return { before: { category: existing.category, subCategory: existing.subCategory }, after: updated };
}

/**
 * Deterministic recurring-expense detection: groups EXPENSE transactions by
 * vendor, and flags a vendor as "recurring" if it billed in 3+ distinct
 * months with amounts within 15% of the group average - a subscription/rent
 * pattern, not a one-off purchase.
 */
export async function getRecurringExpenses(organizationId?: string, months = 6) {
  const cId = await resolveCompanyId(organizationId);
  const since = new Date(REFERENCE_DATE);
  since.setMonth(since.getMonth() - months);

  const expenses = await prisma.transaction.findMany({
    where: { organizationId: cId, type: "EXPENSE", date: { gte: since }, vendor: { not: null } },
    orderBy: { date: "asc" },
  });

  const byVendor = new Map<string, typeof expenses>();
  for (const tx of expenses) {
    const key = tx.vendor!;
    if (!byVendor.has(key)) byVendor.set(key, []);
    byVendor.get(key)!.push(tx);
  }

  const recurring: Array<{ vendor: string; occurrences: number; avgAmount: number; lastAmount: number; lastDate: Date; category: string }> = [];
  for (const [vendor, txs] of byVendor.entries()) {
    const distinctMonths = new Set(txs.map((t) => `${t.date.getFullYear()}-${t.date.getMonth()}`));
    if (distinctMonths.size < 3) continue;

    const avgAmount = txs.reduce((s, t) => s + Number(t.amount), 0) / txs.length;
    const withinTolerance = txs.every((t) => Math.abs(Number(t.amount) - avgAmount) / avgAmount <= 0.15);
    if (!withinTolerance) continue;

    const last = txs[txs.length - 1];
    recurring.push({
      vendor,
      occurrences: txs.length,
      avgAmount: Math.round(avgAmount),
      lastAmount: Number(last.amount),
      lastDate: last.date,
      category: last.category ?? "Uncategorized",
    });
  }

  return recurring.sort((a, b) => b.avgAmount - a.avgAmount);
}

/** All outstanding (PENDING/OVERDUE) receivable invoices - the Treasurer's AR view. */
export async function getReceivables(organizationId?: string) {
  const cId = await resolveCompanyId(organizationId);
  return prisma.invoice.findMany({
    where: { organizationId: cId, type: "RECEIVABLE", status: { in: ["PENDING", "OVERDUE"] } },
    orderBy: { dueDate: "asc" },
    include: { customer: true },
  });
}

/** All outstanding (PENDING/OVERDUE) payable invoices - the Treasurer's AP view. */
export async function getPayables(organizationId?: string) {
  const cId = await resolveCompanyId(organizationId);
  return prisma.invoice.findMany({
    where: { organizationId: cId, type: "PAYABLE", status: { in: ["PENDING", "OVERDUE"] } },
    orderBy: { dueDate: "asc" },
  });
}

export async function getUpcomingPayments(organizationId?: string, days = 14) {
  return getUpcomingPayables(organizationId, days);
}
