import prisma from "@/lib/db/prisma";

export type AgentName =
  | "cfo-agent"
  | "analysis-agent"
  | "reconciliation-agent"
  | "invoice-agent"
  | "reporting-agent"
  | "cash-agent"
  | "expense-agent"
  | "revenue-agent"
  | "risk-agent"
  | "accountant-agent"
  | "treasurer-agent"
  | "payroll-agent"
  | "orchestrator-agent";

export type AgentTaskType =
  | "FINANCIAL_BRIEF"
  | "RECONCILIATION_MATCH"
  | "CHAT_QUERY"
  | "CASH_ANALYSIS"
  | "EXPENSE_ANALYSIS"
  | "REVENUE_ANALYSIS"
  | "RISK_ANALYSIS"
  | "ORCHESTRATOR_RUN"
  | "ACCOUNTANT_QUERY"
  | "TREASURER_QUERY"
  | "PAYROLL_QUERY"
  | "PAYROLL_CALCULATION"
  | "MULTI_AGENT_QUERY";
export type AgentActivityStatus = "COMPLETED" | "FAILED" | "NEEDS_APPROVAL";
export type AgentMode = "RULE_ENGINE" | "LLM_SYNTHESIS";

export async function logAgentActivity(params: {
  agentName: AgentName;
  taskType: AgentTaskType;
  status: AgentActivityStatus;
  summary: string;
  input?: unknown;
  output?: unknown;
  confidenceScore?: number;
  mode: AgentMode;
  organizationId: string;
}) {
  return prisma.agentActivity.create({
    data: {
      agentName: params.agentName,
      taskType: params.taskType,
      status: params.status,
      summary: params.summary,
      input: params.input !== undefined ? JSON.stringify(params.input) : null,
      output: params.output !== undefined ? JSON.stringify(params.output) : null,
      confidenceScore: params.confidenceScore,
      mode: params.mode,
      organizationId: params.organizationId,
    },
  });
}

export async function getRecentAgentActivity(organizationId?: string, limit = 20) {
  const orgId = organizationId || (await prisma.organization.findFirst())?.id || "comp_arcova";
  return prisma.agentActivity.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Records a financially-significant HUMAN action (agent actions are already
 * traced via logAgentActivity/AgentActivity). Every mutating API route that
 * touches money - invoice creation, expense entry, reconciliation decisions -
 * should call this so the audit trail spec requires stays complete.
 */
export async function logAudit(params: {
  organizationId: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: unknown;
}) {
  return prisma.auditLog.create({
    data: {
      organizationId: params.organizationId,
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      metadata: params.metadata !== undefined ? JSON.stringify(params.metadata) : null,
    },
  });
}
