/**
 * "What Changed?" engine - compares the current reporting period against the
 * previous one and surfaces the deltas worth a human's attention: revenue,
 * expenses (overall and by category), cash, and outsized individual
 * transactions. Purely deterministic aggregation - no LLM.
 */

import prisma from "@/lib/db/prisma";
import { getDashboardMetrics } from "@/lib/finance/metrics";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";
import { formatINR } from "@/lib/finance/formatting";

export type ChangeSeverity = "LOW" | "MEDIUM" | "HIGH";

export interface FinancialChange {
  type: "REVENUE_INCREASE" | "REVENUE_DECREASE" | "EXPENSE_INCREASE" | "EXPENSE_DECREASE" | "CASH_CHANGE" | "CATEGORY_SPIKE" | "UNUSUAL_TRANSACTION";
  title: string;
  impact: string;
  severity: ChangeSeverity;
}

function severityForPct(pct: number): ChangeSeverity {
  const abs = Math.abs(pct);
  if (abs >= 25) return "HIGH";
  if (abs >= 10) return "MEDIUM";
  return "LOW";
}

// Current period (Aug 2025) vs previous (Jul 2025) - matches the reference
// window the rest of the dashboard uses (see lib/finance/metrics.ts).
const CURRENT_START = new Date("2025-08-01T00:00:00.000Z");
const CURRENT_END = new Date("2025-08-31T23:59:59.999Z");
const PREV_START = new Date("2025-07-01T00:00:00.000Z");
const PREV_END = new Date("2025-07-31T23:59:59.999Z");

export async function calculateWhatChanged(organizationId?: string): Promise<FinancialChange[]> {
  const cId = await resolveScopedOrganizationId(organizationId);
  const changes: FinancialChange[] = [];

  const metrics = await getDashboardMetrics(cId);

  if (Math.abs(metrics.revenue.changePct) >= 5) {
    changes.push({
      type: metrics.revenue.changePct >= 0 ? "REVENUE_INCREASE" : "REVENUE_DECREASE",
      title: `Revenue ${metrics.revenue.changePct >= 0 ? "increased" : "decreased"} ${Math.abs(metrics.revenue.changePct)}%`,
      impact: formatINR(Math.abs(metrics.revenue.current - metrics.revenue.previous)),
      severity: severityForPct(metrics.revenue.changePct),
    });
  }

  if (Math.abs(metrics.expenses.changePct) >= 5) {
    changes.push({
      type: metrics.expenses.changePct >= 0 ? "EXPENSE_INCREASE" : "EXPENSE_DECREASE",
      title: `Expenses ${metrics.expenses.changePct >= 0 ? "increased" : "decreased"} ${Math.abs(metrics.expenses.changePct)}%`,
      impact: formatINR(Math.abs(metrics.expenses.current - metrics.expenses.previous)),
      severity: severityForPct(metrics.expenses.changePct),
    });
  }

  if (Math.abs(metrics.cashPosition.changePct) >= 3) {
    changes.push({
      type: "CASH_CHANGE",
      title: `Cash position ${metrics.cashPosition.changePct >= 0 ? "grew" : "declined"} ${Math.abs(metrics.cashPosition.changePct)}%`,
      impact: formatINR(Math.abs(metrics.cashPosition.current - metrics.cashPosition.previous)),
      severity: severityForPct(metrics.cashPosition.changePct),
    });
  }

  // Per-category expense movement - find the biggest mover.
  const [currentByCategory, prevByCategory] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["category"],
      where: { organizationId: cId, type: "EXPENSE", date: { gte: CURRENT_START, lte: CURRENT_END } },
      _sum: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ["category"],
      where: { organizationId: cId, type: "EXPENSE", date: { gte: PREV_START, lte: PREV_END } },
      _sum: { amount: true },
    }),
  ]);

  const prevMap = new Map(prevByCategory.map((c) => [c.category, c._sum.amount || 0]));
  for (const c of currentByCategory) {
    const current = c._sum.amount || 0;
    const previous = prevMap.get(c.category) || 0;
    if (previous <= 0) continue;
    const changePct = ((current - previous) / previous) * 100;
    if (Math.abs(changePct) >= 20) {
      changes.push({
        type: "CATEGORY_SPIKE",
        title: `${c.category} spending ${changePct >= 0 ? "increased" : "decreased"} ${Math.abs(Math.round(changePct))}%`,
        impact: formatINR(Math.abs(current - previous)),
        severity: severityForPct(changePct),
      });
    }
  }

  // Individual transactions well above their category's trailing average.
  const currentTx = await prisma.transaction.findMany({
    where: { organizationId: cId, date: { gte: CURRENT_START, lte: CURRENT_END } },
  });
  const combinedAvg = new Map<string, { sum: number; count: number }>();
  for (const c of currentByCategory) {
    const category = c.category ?? "Uncategorized";
    const entry = combinedAvg.get(category) || { sum: 0, count: 0 };
    entry.sum += c._sum.amount || 0;
    entry.count += 1;
    combinedAvg.set(category, entry);
  }
  for (const c of prevByCategory) {
    const category = c.category ?? "Uncategorized";
    const entry = combinedAvg.get(category) || { sum: 0, count: 0 };
    entry.sum += c._sum.amount || 0;
    entry.count += 1;
    combinedAvg.set(category, entry);
  }
  for (const tx of currentTx) {
    const category = tx.category ?? "Uncategorized";
    const baseline = combinedAvg.get(category);
    if (!baseline || baseline.count === 0) continue;
    const avg = baseline.sum / baseline.count;
    if (avg > 0 && tx.amount > avg * 1.6 && tx.amount > 100000) {
      changes.push({
        type: "UNUSUAL_TRANSACTION",
        title: `Unusual ${category.toLowerCase()} transaction: ${tx.description}`,
        impact: formatINR(tx.amount),
        severity: tx.amount > avg * 2.5 ? "HIGH" : "MEDIUM",
      });
    }
  }

  return changes.sort((a, b) => {
    const rank = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return rank[a.severity] - rank[b.severity];
  });
}
