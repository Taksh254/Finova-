/**
 * AI Orchestrator (AGENTS.md Phase 5). Classifies a natural-language request
 * to one or more specialist agents, runs them, and - for compound questions
 * that span agents - deterministically combines their numeric results before
 * an LLM ever narrates the combination. The orchestrator never invents
 * financial data itself; every number in its answer traces back to an
 * agent's tool calls.
 */

import type { Agent, AgentName, ToolCallRecord, ToolContext } from "../types";
import { accountantAgent } from "../accountant/agent";
import { treasurerAgent } from "../treasurer/agent";
import { payrollAgent } from "../payroll/agent";
import { classifyAgents } from "./router";
import { synthesizeAnswer } from "../synthesize";
import { logAgentActivity } from "@/lib/orchestrator/activityLog";
import { formatINR } from "@/lib/finance/formatting";

const AGENTS: Record<AgentName, Agent> = {
  accountant: accountantAgent,
  treasurer: treasurerAgent,
  payroll: payrollAgent,
};

export interface OrchestratorResult {
  answer: string;
  agent: string;
  agentsInvolved: AgentName[];
  toolCalls: ToolCallRecord[];
  data: Record<string, unknown>;
  confidenceScore: number;
  mode: "RULE_ENGINE" | "LLM_SYNTHESIS";
  needsConfirmation?: { tool: string; message: string };
}

/**
 * The one hand-authored cross-agent combination: "can we afford payroll"
 * needs an actual comparison of two numbers, not two paragraphs stitched
 * together. Computed here, in code - the LLM is told to treat it as given.
 */
function buildAffordabilityNote(treasurerData: any, payrollData: any): string | undefined {
  const cash = treasurerData?.cashPosition?.total;
  const payrollTotal =
    payrollData?.result?.calculation?.totalNet ??
    payrollData?.payroll?.record?.totalAmount ??
    payrollData?.preview?.totalNet;
  if (cash == null || payrollTotal == null) return undefined;

  const cashNum = Number(cash);
  const payrollNum = Number(payrollTotal);
  const surplus = cashNum - payrollNum;
  const canAfford = surplus >= 0;

  return (
    `Current cash (${formatINR(cashNum)}) ${canAfford ? "covers" : "does not cover"} this period's payroll obligation ` +
    `(${formatINR(payrollNum)}), leaving ${canAfford ? "a surplus" : "a shortfall"} of ${formatINR(Math.abs(surplus))}.`
  );
}

export async function handleUserMessage(
  message: string,
  ctx: ToolContext,
  params: Record<string, unknown> = {}
): Promise<OrchestratorResult> {
  const agentNames = classifyAgents(message);

  if (agentNames.length === 1) {
    const result = await AGENTS[agentNames[0]].execute(message, ctx, params);
    return {
      answer: result.answer,
      agent: result.agent,
      agentsInvolved: [result.agent],
      toolCalls: result.toolCalls,
      data: result.data,
      confidenceScore: result.confidenceScore,
      mode: result.mode,
      needsConfirmation: result.needsConfirmation,
    };
  }

  const results = await Promise.all(agentNames.map((name) => AGENTS[name].execute(message, ctx, params)));

  // A confirmation gate from any one specialist takes priority over
  // synthesizing a combined answer - don't paper over a pending write.
  const pendingConfirmation = results.find((r) => r.needsConfirmation);
  if (pendingConfirmation) {
    return {
      answer: pendingConfirmation.answer,
      agent: pendingConfirmation.agent,
      agentsInvolved: results.map((r) => r.agent),
      toolCalls: results.flatMap((r) => r.toolCalls),
      data: Object.fromEntries(results.map((r) => [r.agent, r.data])),
      confidenceScore: pendingConfirmation.confidenceScore,
      mode: pendingConfirmation.mode,
      needsConfirmation: pendingConfirmation.needsConfirmation,
    };
  }

  const data = Object.fromEntries(results.map((r) => [r.agent, r.data]));
  const combinedAnalysis =
    agentNames.includes("treasurer") && agentNames.includes("payroll")
      ? buildAffordabilityNote(data.treasurer, data.payroll)
      : undefined;

  const synthesis = await synthesizeAnswer({
    systemInstructions:
      `You are Finova's AI Orchestrator, combining findings from these specialist agents: ${agentNames.join(", ")}. ` +
      "If a 'combinedAnalysis' field is present in the context, it is an authoritative, already-computed conclusion - " +
      "build your answer around it rather than re-deriving it.",
    question: message,
    context: { ...data, combinedAnalysis },
    fallback: () => combinedAnalysis ?? results.map((r) => r.answer).join(" "),
  });

  await logAgentActivity({
    agentName: "orchestrator-agent",
    taskType: "MULTI_AGENT_QUERY",
    status: "COMPLETED",
    summary: `Answered (${agentNames.join(" + ")}): "${message.slice(0, 100)}"`,
    input: { message, agentsInvolved: agentNames },
    output: { answer: synthesis.answer },
    confidenceScore: synthesis.confidenceScore,
    mode: synthesis.mode,
    organizationId: ctx.companyId,
  });

  return {
    answer: synthesis.answer,
    agent: "orchestrator",
    agentsInvolved: results.map((r) => r.agent),
    toolCalls: results.flatMap((r) => r.toolCalls),
    data,
    confidenceScore: synthesis.confidenceScore,
    mode: synthesis.mode,
  };
}
