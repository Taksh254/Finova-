import prisma from "@/lib/db/prisma";

export interface InsightInput {
  organizationId: string;
  type: "CASH" | "EXPENSE" | "REVENUE" | "RISK" | "RECONCILIATION" | "GENERAL";
  title: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number;
  evidence: string[];
  recommendedAction?: string;
  actionRouteTo?: string;
  sourceAgent: string;
}

/**
 * Persists a finding as an AIInsight - but only if an unresolved insight with
 * the same (organizationId, type, title) doesn't already exist, so re-running the
 * orchestrator repeatedly doesn't spam the dashboard's attention feed.
 */
export async function upsertInsight(input: InsightInput) {
  const existing = await prisma.aIInsight.findFirst({
    where: {
      organizationId: input.organizationId,
      type: input.type,
      title: input.title,
      status: { in: ["NEW", "ACKNOWLEDGED"] },
    },
  });
  if (existing) return existing;

  return prisma.aIInsight.create({
    data: {
      organizationId: input.organizationId,
      type: input.type,
      title: input.title,
      description: input.description,
      severity: input.severity,
      confidence: input.confidence,
      evidence: JSON.stringify(input.evidence),
      recommendedAction: input.recommendedAction,
      actionRouteTo: input.actionRouteTo,
      sourceAgent: input.sourceAgent,
      status: "NEW",
    },
  });
}

export async function listInsights(organizationId: string, status?: string) {
  return prisma.aIInsight.findMany({
    where: { organizationId, ...(status ? { status } : {}) },
    orderBy: [{ severity: "desc" }, { createdAt: "desc" }],
  });
}

export async function updateInsightStatus(id: string, status: "ACKNOWLEDGED" | "RESOLVED" | "DISMISSED") {
  return prisma.aIInsight.update({
    where: { id },
    data: { status, resolvedAt: status === "RESOLVED" ? new Date() : undefined },
  });
}
