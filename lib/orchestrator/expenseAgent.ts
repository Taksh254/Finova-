/**
 * Expense Agent - spend pattern analysis, unusual spending, and category
 * trend comparisons. Reuses the "What Changed" engine's category-level
 * comparison rather than re-deriving expense deltas itself, so there's one
 * source of truth for "expenses moved X%" logic.
 */

import { calculateWhatChanged } from "@/lib/finance/whatChanged";
import { logAgentActivity } from "./activityLog";
import { upsertInsight } from "./insights";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";

export async function runExpenseAgent(organizationId?: string) {
  const cId = await resolveScopedOrganizationId(organizationId);
  const changes = await calculateWhatChanged(cId);

  const expenseChanges = changes.filter((c) => c.type === "EXPENSE_INCREASE" || c.type === "CATEGORY_SPIKE" || c.type === "UNUSUAL_TRANSACTION");
  const insightsCreated: string[] = [];

  for (const change of expenseChanges) {
    const insight = await upsertInsight({
      organizationId: cId,
      type: "EXPENSE",
      title: change.title,
      description: `${change.title} (impact: ${change.impact}).`,
      severity: change.severity === "HIGH" ? "HIGH" : change.severity === "MEDIUM" ? "MEDIUM" : "LOW",
      confidence: 0.82,
      evidence: [`Impact: ${change.impact}`],
      recommendedAction:
        change.type === "UNUSUAL_TRANSACTION"
          ? "Verify this transaction against a purchase order or approval record."
          : "Review the underlying vendor spend for this category.",
      actionRouteTo: "/expenses",
      sourceAgent: "expense-agent",
    });
    insightsCreated.push(insight.id);
  }

  await logAgentActivity({
    agentName: "expense-agent",
    taskType: "EXPENSE_ANALYSIS",
    status: "COMPLETED",
    summary:
      expenseChanges.length > 0
        ? `Detected ${expenseChanges.length} notable expense pattern(s).`
        : "Scanned expense activity - no notable anomalies found.",
    output: { expenseChanges, insightsCreated },
    confidenceScore: 0.82,
    mode: "RULE_ENGINE",
    organizationId: cId,
  });

  return { expenseChanges, insightsCreated };
}
