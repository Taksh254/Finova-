/**
 * Composes the single "dashboard overview" payload the frontend needs to
 * render the whole Overview page in one request, instead of the client
 * firing off a dozen separate fetches. Pulls from the finance layer
 * (deterministic metrics/health/forecast) and the orchestrator's read-only
 * tools/insights (agent output) - never queries Prisma directly itself.
 */

import prisma from "@/lib/db/prisma";
import { getDashboardMetrics, getCashFlowChartData } from "@/lib/finance/metrics";
import { calculateHealthScore } from "@/lib/finance/healthScore";
import { calculateCashFlowForecast } from "@/lib/finance/forecast";
import { getRecentTransactions, getAccountBalances } from "@/lib/orchestrator/tools";
import { listInsights } from "@/lib/orchestrator/insights";
import { getRecentAgentActivity } from "@/lib/orchestrator/activityLog";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";
import { REFERENCE_DATE } from "@/lib/finance/referenceDate";

export async function getDashboardOverview(organizationId?: string) {
  const cId = await resolveScopedOrganizationId(organizationId);

  const [metrics, cashFlowTrend, healthScore, cashForecast, recentTransactions, accounts, insights, agentActivity, invoiceStats] =
    await Promise.all([
      getDashboardMetrics(cId),
      getCashFlowChartData(cId),
      calculateHealthScore(cId),
      calculateCashFlowForecast(cId),
      getRecentTransactions(cId, 8),
      getAccountBalances(cId),
      listInsights(cId, "NEW"),
      getRecentAgentActivity(cId, 10),
      getInvoiceSummary(cId),
    ]);

  const profitCurrent = metrics.revenue.current - metrics.expenses.current;
  const profitPrevious = metrics.revenue.previous - metrics.expenses.previous;
  const profitChangePct = profitPrevious !== 0 ? Math.round(((profitCurrent - profitPrevious) / Math.abs(profitPrevious)) * 1000) / 10 : 0;

  return {
    cash: { ...metrics.cashPosition, accounts },
    revenue: metrics.revenue,
    expenses: metrics.expenses,
    profit: {
      current: profitCurrent,
      previous: profitPrevious,
      changePct: profitChangePct,
      isPositive: profitCurrent >= profitPrevious,
    },
    receivables: metrics.accountsReceivable,
    payables: metrics.accountsPayable,
    healthScore,
    cashForecast,
    cashFlowTrend,
    recentTransactions,
    invoiceSummary: invoiceStats,
    insights,
    agentActivity,
  };
}

async function getInvoiceSummary(organizationId: string) {
  const [overdue, dueSoon, pending, paidThisMonth] = await Promise.all([
    prisma.invoice.aggregate({ where: { organizationId, status: "OVERDUE" }, _sum: { amount: true }, _count: true }),
    prisma.invoice.aggregate({
      where: {
        organizationId,
        status: "PENDING",
        dueDate: { gte: REFERENCE_DATE, lte: new Date(REFERENCE_DATE.getTime() + 7 * 86_400_000) },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.invoice.aggregate({ where: { organizationId, status: "PENDING" }, _sum: { amount: true }, _count: true }),
    prisma.invoice.aggregate({ where: { organizationId, status: "PAID" }, _sum: { amount: true }, _count: true }),
  ]);

  return {
    overdue: { amount: overdue._sum.amount || 0, count: overdue._count },
    dueSoon: { amount: dueSoon._sum.amount || 0, count: dueSoon._count },
    pending: { amount: pending._sum.amount || 0, count: pending._count },
    paid: { amount: paidThisMonth._sum.amount || 0, count: paidThisMonth._count },
  };
}
