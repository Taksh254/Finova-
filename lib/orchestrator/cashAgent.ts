/**
 * Cash Agent - current cash position, movement, runway, and liquidity
 * pressure. Deterministic: reads through the tools layer + the shared cash
 * forecast service, never touches Prisma directly.
 */

import { getCashPosition, calculateCashRunway } from "./tools";
import { calculateCashFlowForecast } from "@/lib/finance/forecast";
import { logAgentActivity } from "./activityLog";
import { upsertInsight } from "./insights";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";
import { formatINR } from "@/lib/finance/formatting";

export async function runCashAgent(organizationId?: string) {
  const cId = await resolveScopedOrganizationId(organizationId);

  const [cash, runway, forecast] = await Promise.all([
    getCashPosition(cId),
    calculateCashRunway(cId),
    calculateCashFlowForecast(cId),
  ]);

  const insightsCreated: string[] = [];

  if (runway.runwayMonths !== null && runway.runwayMonths < 9) {
    const severity = runway.runwayMonths < 3 ? "CRITICAL" : runway.runwayMonths < 6 ? "HIGH" : "MEDIUM";
    const insight = await upsertInsight({
      organizationId: cId,
      type: "CASH",
      title: `Cash runway is ${runway.runwayMonths} months`,
      description: `At the current average net burn of ${formatINR(runway.netBurn)}/month, cash reserves of ${formatINR(
        cash.total
      )} cover approximately ${runway.runwayMonths} months.`,
      severity,
      confidence: 0.9,
      evidence: [
        `Current cash: ${formatINR(cash.total)}`,
        `Avg monthly revenue: ${formatINR(runway.avgMonthlyRevenue)}`,
        `Avg monthly expense: ${formatINR(runway.avgMonthlyExpense)}`,
      ],
      recommendedAction: "Prioritize collection of outstanding receivables and review discretionary spend.",
      actionRouteTo: "/invoices?filter=overdue",
      sourceAgent: "cash-agent",
    });
    insightsCreated.push(insight.id);
  }

  if (forecast.projectedMonthlyBurn > 0 && forecast.projected90Day < cash.total * 0.5) {
    const insight = await upsertInsight({
      organizationId: cId,
      type: "CASH",
      title: "90-day cash projection shows significant liquidity pressure",
      description: `Projected cash in 90 days (${formatINR(forecast.projected90Day)}) is less than half of today's position (${formatINR(
        cash.total
      )}) at the current burn trajectory.`,
      severity: "HIGH",
      confidence: 0.75,
      evidence: forecast.drivers,
      recommendedAction: "Review the cash flow forecast and accelerate collections or defer non-critical payables.",
      actionRouteTo: "/cash-flow",
      sourceAgent: "cash-agent",
    });
    insightsCreated.push(insight.id);
  }

  const summary =
    runway.runwayMonths !== null
      ? `Cash position ${formatINR(cash.total)} with ${runway.runwayMonths} months runway.`
      : `Cash position ${formatINR(cash.total)}; company is net cash-flow positive.`;

  await logAgentActivity({
    agentName: "cash-agent",
    taskType: "CASH_ANALYSIS",
    status: "COMPLETED",
    summary,
    output: { cash, runway, forecast, insightsCreated },
    confidenceScore: 0.9,
    mode: "RULE_ENGINE",
    organizationId: cId,
  });

  return { cash, runway, forecast, insightsCreated };
}
