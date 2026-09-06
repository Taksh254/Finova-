/**
 * Risk Agent - combines signals from across the ledger (open exceptions,
 * health score components, cash runway) into a small set of prioritized
 * risk insights with assigned severity. This is the layer that sits just
 * before the CFO Agent in the orchestrator pipeline (see section 15 of the
 * build brief): it doesn't discover new facts, it triages the facts the
 * other agents/tools have already surfaced.
 */

import { getOpenExceptions, calculateCashRunway } from "./tools";
import { calculateHealthScore } from "@/lib/finance/healthScore";
import { logAgentActivity } from "./activityLog";
import { upsertInsight } from "./insights";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";

export async function runRiskAgent(organizationId?: string) {
  const cId = await resolveScopedOrganizationId(organizationId);

  const [exceptions, health, runway] = await Promise.all([
    getOpenExceptions(cId),
    calculateHealthScore(cId),
    calculateCashRunway(cId),
  ]);

  const insightsCreated: string[] = [];
  const criticalOrHigh = exceptions.filter((e) => e.severity === "CRITICAL" || e.severity === "HIGH");

  if (criticalOrHigh.length >= 2) {
    const insight = await upsertInsight({
      organizationId: cId,
      type: "RISK",
      title: `${criticalOrHigh.length} high-severity exceptions require review`,
      description: `${criticalOrHigh.length} open exceptions are flagged HIGH or CRITICAL severity across reconciliation, invoicing, and payroll.`,
      severity: criticalOrHigh.some((e) => e.severity === "CRITICAL") ? "CRITICAL" : "HIGH",
      confidence: 0.9,
      evidence: criticalOrHigh.map((e) => `${e.type}: ${e.title}`),
      recommendedAction: "Triage and resolve the highest-severity exceptions first.",
      actionRouteTo: "/exceptions",
      sourceAgent: "risk-agent",
    });
    insightsCreated.push(insight.id);
  }

  if (health.components.risk < 60 || health.components.liquidity < 40) {
    const drivers: string[] = [];
    if (health.components.liquidity < 40) drivers.push(health.explanation.liquidity);
    if (health.components.risk < 60) drivers.push(health.explanation.risk);
    const insight = await upsertInsight({
      organizationId: cId,
      type: "RISK",
      title: "Financial Health Score flags elevated risk",
      description: `Overall health score is ${health.score}/100, driven down by ${drivers.join(" and ")}.`,
      severity: health.score < 50 ? "HIGH" : "MEDIUM",
      confidence: 0.85,
      evidence: drivers,
      recommendedAction: "Review the Financial Health breakdown and address the weakest component first.",
      actionRouteTo: "/overview",
      sourceAgent: "risk-agent",
    });
    insightsCreated.push(insight.id);
  }

  await logAgentActivity({
    agentName: "risk-agent",
    taskType: "RISK_ANALYSIS",
    status: "COMPLETED",
    summary: `Health score ${health.score}/100. ${criticalOrHigh.length} high/critical exception(s) open. Runway ${
      runway.runwayMonths ?? "n/a"
    } months.`,
    output: { health, exceptionCount: exceptions.length, criticalOrHighCount: criticalOrHigh.length, runway, insightsCreated },
    confidenceScore: 0.87,
    mode: "RULE_ENGINE",
    organizationId: cId,
  });

  return { health, exceptions, runway, insightsCreated };
}
