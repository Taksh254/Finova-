/**
 * Agent Orchestrator entrypoint - runs the specialist agents in the order
 * described in the build brief (Cash / Expense / Revenue in parallel ->
 * Reconciliation -> Risk, which synthesizes all of it), then persists a
 * single ORCHESTRATOR_RUN activity summarizing the pipeline. The CFO Agent
 * is intentionally NOT run here - it answers on-demand questions
 * (POST /api/ai/ask) rather than running on every sync.
 */

import { runCashAgent } from "./cashAgent";
import { runExpenseAgent } from "./expenseAgent";
import { runRevenueAgent } from "./revenueAgent";
import { runReconciliationAgent } from "./reconciliationAgent";
import { runRiskAgent } from "./riskAgent";
import { logAgentActivity } from "./activityLog";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";

export async function runOrchestrator(organizationId?: string) {
  const cId = await resolveScopedOrganizationId(organizationId);

  const [cash, expense, revenue, reconciliationProposals] = await Promise.all([
    runCashAgent(cId),
    runExpenseAgent(cId),
    runRevenueAgent(cId),
    runReconciliationAgent(cId),
  ]);

  // Risk Agent runs last - it triages the exceptions/health signals the
  // other agents' work has already been folded into via getOpenExceptions
  // and the health score.
  const risk = await runRiskAgent(cId);

  const totalInsights =
    cash.insightsCreated.length + expense.insightsCreated.length + revenue.insightsCreated.length + risk.insightsCreated.length;

  await logAgentActivity({
    agentName: "cfo-agent",
    taskType: "ORCHESTRATOR_RUN",
    status: "COMPLETED",
    summary: `Orchestrator sync complete: ${reconciliationProposals.length} reconciliation match(es) proposed, ${totalInsights} new insight(s) surfaced.`,
    output: {
      reconciliationProposed: reconciliationProposals.length,
      insightsCreated: totalInsights,
      healthScore: risk.health.score,
    },
    confidenceScore: 0.9,
    mode: "RULE_ENGINE",
    organizationId: cId,
  });

  return { cash, expense, revenue, reconciliationProposals, risk, totalInsights };
}
