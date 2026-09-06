/**
 * Treasurer Agent - cash position, cash flow, receivables, payables,
 * liquidity, upcoming obligations, and cash forecasting. Forecasts are
 * always the deterministic output of lib/finance/forecast.ts; the LLM only
 * interprets and explains those numbers, never recomputes them.
 */

import type { Agent, AgentAnswer, ToolContext, ToolCallRecord } from "../types";
import { toolRegistry } from "../registry";
import { registerTreasurerTools } from "./tools";
import { synthesizeAnswer } from "../synthesize";
import { logAgentActivity } from "@/lib/orchestrator/activityLog";
import { formatINR } from "@/lib/finance/formatting";

registerTreasurerTools();

const SYSTEM_INSTRUCTIONS =
  "You are Finova's Treasurer Agent. You answer questions about cash position, cash flow, receivables, payables, " +
  "liquidity, upcoming obligations, and cash forecasts. Forecast figures are already computed deterministically - " +
  "explain and contextualize them, never recompute or adjust them yourself.";

const ALLOWED_TOOLS = [
  "getBankAccounts", "getBalances", "getCashFlow", "getReceivables", "getPayables",
  "getUpcomingPayments", "getRecurringExpenses", "calculateCashForecast", "calculateCashRunway",
];

async function call(name: string, params: unknown, ctx: ToolContext, calls: ToolCallRecord[]) {
  const { result, record } = await toolRegistry.execute(name, params as any, ctx);
  calls.push(record);
  return result;
}

/**
 * Gathers a data bundle for a Treasurer question. Also used by the
 * orchestrator when composing a multi-agent answer (e.g. "can we afford
 * payroll") - exported so it can be called without going through execute().
 */
export async function gatherTreasurerContext(message: string, ctx: ToolContext) {
  const lower = message.toLowerCase();
  const calls: ToolCallRecord[] = [];
  const data: Record<string, unknown> = {};

  data.cashPosition = await call("getBalances", {}, ctx, calls);
  data.runway = await call("calculateCashRunway", {}, ctx, calls);

  if (/forecast|projection|next (30|60|90)|future cash/.test(lower)) {
    data.forecast = await call("calculateCashForecast", {}, ctx, calls);
  }
  if (/receivable|owed to us|clients? owe/.test(lower)) {
    data.receivables = await call("getReceivables", {}, ctx, calls);
  }
  if (/payable|afford|obligation|owe|due/.test(lower)) {
    data.payables = await call("getPayables", {}, ctx, calls);
    data.upcomingPayments = await call("getUpcomingPayments", { days: 14 }, ctx, calls);
  }
  if (/recurring|subscription/.test(lower)) {
    data.recurringExpenses = await call("getRecurringExpenses", {}, ctx, calls);
  }
  if (/cash flow|inflow|outflow/.test(lower)) {
    data.cashFlow = await call("getCashFlow", {}, ctx, calls);
  }

  return { data, calls };
}

function fallbackAnswer(data: Record<string, unknown>): string {
  const parts: string[] = [];
  const cash = data.cashPosition as any;
  const runway = data.runway as any;
  if (cash) {
    parts.push(
      `Current cash position is ${formatINR(cash.total)}` +
        (runway?.runwayMonths != null ? `, giving approximately ${runway.runwayMonths} months of runway at the current burn rate.` : ".")
    );
  }
  const forecast = data.forecast as any;
  if (forecast) {
    parts.push(`30-day projected cash is ${formatINR(forecast.projected30Day)}.`);
  }
  const payables = data.payables as any[] | undefined;
  if (payables) {
    const total = payables.reduce((s, p) => s + Number(p.amount), 0);
    parts.push(`${payables.length} outstanding payable(s) totalling ${formatINR(total)}.`);
  }
  const receivables = data.receivables as any[] | undefined;
  if (receivables) {
    const total = receivables.reduce((s, r) => s + Number(r.amount), 0);
    parts.push(`${receivables.length} outstanding receivable(s) totalling ${formatINR(total)}.`);
  }
  return parts.join(" ") || "No matching treasury data was found for this query.";
}

export const treasurerAgent: Agent = {
  name: "treasurer",
  description: "Handles cash position, cash flow, receivables, payables, liquidity, and cash forecasting.",
  systemInstructions: SYSTEM_INSTRUCTIONS,
  allowedTools: ALLOWED_TOOLS,

  async execute(message: string, ctx: ToolContext): Promise<AgentAnswer> {
    const { data, calls } = await gatherTreasurerContext(message, ctx);
    const synthesis = await synthesizeAnswer({
      systemInstructions: SYSTEM_INSTRUCTIONS,
      question: message,
      context: data,
      fallback: () => fallbackAnswer(data),
    });

    await logAgentActivity({
      agentName: "treasurer-agent",
      taskType: "TREASURER_QUERY",
      status: "COMPLETED",
      summary: `Answered: "${message.slice(0, 120)}"`,
      input: { message },
      output: { answer: synthesis.answer, toolCalls: calls.map((c) => c.tool) },
      confidenceScore: synthesis.confidenceScore,
      mode: synthesis.mode,
      organizationId: ctx.companyId,
    });

    return {
      agent: "treasurer",
      answer: synthesis.answer,
      data,
      toolCalls: calls,
      confidenceScore: synthesis.confidenceScore,
      mode: synthesis.mode,
    };
  },
};
