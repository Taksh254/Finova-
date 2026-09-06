/**
 * Finova Health Score - a deterministic, explainable 0-100 composite of six
 * components. Every component is a pure function of numbers already on the
 * dashboard (no LLM involved), so the score can always be explained back to
 * a user by pointing at the underlying metric.
 */

import prisma from "@/lib/db/prisma";
import { getDashboardMetrics } from "@/lib/finance/metrics";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";

function clamp(value: number, min = 0, max = 100): number {
  return Math.round(Math.max(min, Math.min(max, value)));
}

export interface HealthScoreResult {
  score: number;
  components: {
    liquidity: number;
    profitability: number;
    growth: number;
    expenseControl: number;
    receivables: number;
    risk: number;
  };
  explanation: Record<string, string>;
}

const WEIGHTS = {
  liquidity: 0.2,
  profitability: 0.2,
  growth: 0.15,
  expenseControl: 0.15,
  receivables: 0.15,
  risk: 0.15,
};

export async function calculateHealthScore(organizationId?: string): Promise<HealthScoreResult> {
  const cId = await resolveScopedOrganizationId(organizationId);
  const metrics = await getDashboardMetrics(cId);

  const [highExceptions, criticalExceptions] = await Promise.all([
    prisma.exception.count({ where: { organizationId: cId, status: { in: ["OPEN", "IN_REVIEW"] }, severity: "HIGH" } }),
    prisma.exception.count({ where: { organizationId: cId, status: { in: ["OPEN", "IN_REVIEW"] }, severity: "CRITICAL" } }),
  ]);

  // Liquidity: runway of 12+ months is a full score, <=1 month is near zero.
  const liquidity = clamp((metrics.runway.months / 12) * 100);

  // Profitability: net margin on current-period revenue vs expenses.
  const netMargin = metrics.revenue.current > 0
    ? ((metrics.revenue.current - metrics.expenses.current) / metrics.revenue.current) * 100
    : 0;
  const profitability = clamp(50 + netMargin * 1.5);

  // Growth: MoM revenue change. 0% -> neutral 50, +25% or more -> 100.
  const growth = clamp(50 + metrics.revenue.changePct * 2);

  // Expense control: expenses should grow slower than revenue.
  const expenseControl = clamp(50 + (metrics.revenue.changePct - metrics.expenses.changePct) * 2);

  // Receivables: penalize a high proportion of AR that's gone overdue.
  const overdueRatio = metrics.accountsReceivable.current > 0
    ? metrics.accountsReceivable.overdue / metrics.accountsReceivable.current
    : 0;
  const receivables = clamp(100 - overdueRatio * 150);

  // Risk: penalize open high/critical exceptions.
  const risk = clamp(100 - highExceptions * 12 - criticalExceptions * 25);

  const components = { liquidity, profitability, growth, expenseControl, receivables, risk };
  const score = clamp(
    components.liquidity * WEIGHTS.liquidity +
      components.profitability * WEIGHTS.profitability +
      components.growth * WEIGHTS.growth +
      components.expenseControl * WEIGHTS.expenseControl +
      components.receivables * WEIGHTS.receivables +
      components.risk * WEIGHTS.risk
  );

  return {
    score,
    components,
    explanation: {
      liquidity: `${metrics.runway.months} months of runway at current burn rate`,
      profitability: `${netMargin.toFixed(1)}% net margin this period`,
      growth: `Revenue changed ${metrics.revenue.changePct}% month-over-month`,
      expenseControl: `Expenses changed ${metrics.expenses.changePct}% vs. ${metrics.revenue.changePct}% revenue growth`,
      receivables: `${(overdueRatio * 100).toFixed(1)}% of receivables are overdue`,
      risk: `${highExceptions} high-severity and ${criticalExceptions} critical open exception(s)`,
    },
  };
}
