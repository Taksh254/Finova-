/**
 * Revenue Agent - revenue trend analysis, customer concentration, and
 * receivables health. Reuses the "What Changed" engine for the topline
 * revenue delta and the customer-concentration tool for concentration risk.
 */

import { calculateWhatChanged } from "@/lib/finance/whatChanged";
import { getCustomerConcentration, getOverdueInvoices } from "./tools";
import { logAgentActivity } from "./activityLog";
import { upsertInsight } from "./insights";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";
import { formatINR } from "@/lib/finance/formatting";

const CONCENTRATION_THRESHOLD_PCT = 30; // one customer above this share of AR is a concentration risk

export async function runRevenueAgent(organizationId?: string) {
  const cId = await resolveScopedOrganizationId(organizationId);

  const [changes, concentration, overdueInvoices] = await Promise.all([
    calculateWhatChanged(cId),
    getCustomerConcentration(cId),
    getOverdueInvoices(cId),
  ]);

  const insightsCreated: string[] = [];

  const revenueChange = changes.find((c) => c.type === "REVENUE_INCREASE" || c.type === "REVENUE_DECREASE");
  if (revenueChange) {
    const insight = await upsertInsight({
      organizationId: cId,
      type: "REVENUE",
      title: revenueChange.title,
      description: `${revenueChange.title} (impact: ${revenueChange.impact}) month-over-month.`,
      severity: revenueChange.type === "REVENUE_DECREASE" ? revenueChange.severity : "LOW",
      confidence: 0.85,
      evidence: [`Impact: ${revenueChange.impact}`],
      recommendedAction: revenueChange.type === "REVENUE_DECREASE" ? "Review pipeline and recent churn." : undefined,
      actionRouteTo: "/invoices",
      sourceAgent: "revenue-agent",
    });
    insightsCreated.push(insight.id);
  }

  const topCustomer = concentration[0];
  if (topCustomer && topCustomer.shareOfTotal >= CONCENTRATION_THRESHOLD_PCT) {
    const insight = await upsertInsight({
      organizationId: cId,
      type: "REVENUE",
      title: `Customer concentration risk: ${topCustomer.name} is ${topCustomer.shareOfTotal}% of receivables`,
      description: `${topCustomer.name} accounts for ${formatINR(topCustomer.total)} (${topCustomer.shareOfTotal}%) of total outstanding receivables, concentrating collection risk in a single account.`,
      severity: topCustomer.shareOfTotal >= 50 ? "HIGH" : "MEDIUM",
      confidence: 0.8,
      evidence: [`${topCustomer.name}: ${formatINR(topCustomer.total)} (${topCustomer.shareOfTotal}% of AR)`],
      recommendedAction: "Consider diversifying the client pipeline or securing payment terms with this account.",
      actionRouteTo: "/invoices",
      sourceAgent: "revenue-agent",
    });
    insightsCreated.push(insight.id);
  }

  if (overdueInvoices.length > 0) {
    const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const insight = await upsertInsight({
      organizationId: cId,
      type: "REVENUE",
      title: `${formatINR(totalOverdue)} in overdue receivables`,
      description: `${overdueInvoices.length} invoice(s) totalling ${formatINR(totalOverdue)} are past their due date.`,
      severity: overdueInvoices.length >= 3 ? "HIGH" : "MEDIUM",
      confidence: 0.95,
      evidence: overdueInvoices.map((inv) => `${inv.invoiceNumber} — ${inv.vendorClient}: ${formatINR(inv.amount)}`),
      recommendedAction: "Send payment reminders and consider a collections escalation for the oldest invoices.",
      actionRouteTo: "/invoices?filter=overdue",
      sourceAgent: "revenue-agent",
    });
    insightsCreated.push(insight.id);
  }

  await logAgentActivity({
    agentName: "revenue-agent",
    taskType: "REVENUE_ANALYSIS",
    status: "COMPLETED",
    summary: `Analyzed revenue trend, customer concentration (top: ${topCustomer?.name ?? "n/a"}), and ${overdueInvoices.length} overdue invoice(s).`,
    output: { revenueChange, concentration, overdueCount: overdueInvoices.length, insightsCreated },
    confidenceScore: 0.85,
    mode: "RULE_ENGINE",
    organizationId: cId,
  });

  return { revenueChange, concentration, overdueInvoices, insightsCreated };
}
