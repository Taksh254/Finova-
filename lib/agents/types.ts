/**
 * Common interfaces for the Finova Agent System (AGENTS.md Phase 1).
 *
 * Hard rule enforced by this design: the LLM never touches Prisma and never
 * computes financial numbers. The call chain is always
 *   LLM (interprets) -> Tool (registry-mediated) -> Service -> Prisma.
 * Agents gather data through registered tools, then hand the results to the
 * LLM purely to explain them in prose - see accountant/agent.ts etc.
 */

export type AgentName = "accountant" | "treasurer" | "payroll";

/**
 * Role hierarchy for tool authorization. There is no login flow yet (see
 * lib/auth/companyScope.ts) - ctx.role defaults to OWNER everywhere until
 * real session-based auth exists, so nothing breaks today. Once auth lands,
 * populate ToolContext.role from the authenticated CompanyMember and every
 * check in lib/agents/permissions.ts starts actually restricting access -
 * no other code in this directory needs to change.
 */
export type Role = "MEMBER" | "ACCOUNTANT" | "ADMIN" | "OWNER";

export interface ToolContext {
  companyId: string;
  requestId: string;
  userId?: string;
  role?: Role;
}

export type ToolCallStatus = "SUCCESS" | "ERROR" | "NEEDS_CONFIRMATION" | "FORBIDDEN";

export interface ToolCallRecord {
  tool: string;
  agent: AgentName;
  status: ToolCallStatus;
  durationMs: number;
  error?: string;
}

export interface ToolDefinition<TParams = any, TResult = any> {
  name: string;
  agent: AgentName;
  description: string;
  /** Read tools only ever query Prisma; write tools mutate financial state. */
  isWrite: boolean;
  /** Sensitive write ops (payroll runs, categorization) must be re-invoked with params.confirm === true. */
  requiresConfirmation?: boolean;
  /** Minimum role required to invoke. Defaults to MEMBER for reads, ACCOUNTANT for writes. */
  minRole?: Role;
  handler: (params: TParams, ctx: ToolContext) => Promise<TResult>;
}

export interface AgentAnswer {
  agent: AgentName;
  answer: string;
  data: Record<string, unknown>;
  toolCalls: ToolCallRecord[];
  confidenceScore: number;
  mode: "RULE_ENGINE" | "LLM_SYNTHESIS";
  needsConfirmation?: { tool: string; message: string };
}

export interface Agent {
  name: AgentName;
  description: string;
  systemInstructions: string;
  allowedTools: string[];
  execute(message: string, ctx: ToolContext, params?: Record<string, unknown>): Promise<AgentAnswer>;
}
