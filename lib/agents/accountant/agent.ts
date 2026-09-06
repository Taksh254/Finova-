/**
 * Accountant Agent - transactions, expenses, invoices, ledger,
 * categorization, financial summaries, and anomaly detection (open
 * exceptions). Data gathering is deterministic tool calls; the LLM step (if
 * configured) only narrates what those tools returned.
 */

import type { Agent, AgentAnswer, ToolContext, ToolCallRecord } from "../types";
import { toolRegistry } from "../registry";
import { registerAccountantTools } from "./tools";
import { synthesizeAnswer } from "../synthesize";
import { logAgentActivity } from "@/lib/orchestrator/activityLog";
import { formatINR } from "@/lib/finance/formatting";

registerAccountantTools();

const SYSTEM_INSTRUCTIONS =
  "You are Finova's Accountant Agent. You answer questions about transactions, expenses, invoices, the ledger, " +
  "and financial summaries, and flag anomalies using the open-exceptions data you're given. Recommend concrete " +
  "next actions (e.g. review an overdue invoice) where relevant.";

const ALLOWED_TOOLS = [
  "getTransactions", "getTransaction", "getAccounts", "getLedger", "getExpenses",
  "getInvoices", "getInvoice", "categorizeTransaction", "getFinancialSummary", "getOpenExceptions",
];

async function call(name: string, params: unknown, ctx: ToolContext, calls: ToolCallRecord[]) {
  const { result, record } = await toolRegistry.execute(name, params as any, ctx);
  calls.push(record);
  return result;
}

async function gatherContext(message: string, ctx: ToolContext) {
  const lower = message.toLowerCase();
  const calls: ToolCallRecord[] = [];
  const data: Record<string, unknown> = {};

  data.summary = await call("getFinancialSummary", {}, ctx, calls);

  if (/invoice|receivable|payable|overdue/.test(lower)) {
    data.invoices = await call("getInvoices", {}, ctx, calls);
  }
  if (/expense|spend|cost/.test(lower)) {
    data.expenses = await call("getExpenses", {}, ctx, calls);
  }
  if (/ledger|running balance/.test(lower)) {
    data.ledger = await call("getLedger", { limit: 100 }, ctx, calls);
  }
  if (/transaction/.test(lower) && !data.expenses) {
    data.transactions = await call("getTransactions", { limit: 25 }, ctx, calls);
  }
  if (/anomal|unusual|suspicious|exception|flag/.test(lower) || Object.keys(data).length === 1) {
    data.openExceptions = await call("getOpenExceptions", {}, ctx, calls);
  }

  return { data, calls };
}

function fallbackAnswer(data: Record<string, unknown>): string {
  const parts: string[] = [];
  const summary = data.summary as any;
  if (summary) {
    parts.push(
      `Revenue is ${formatINR(summary.revenue.current)} and expenses are ${formatINR(summary.expenses.current)} for the current period.`
    );
  }
  const invoices = data.invoices as any[] | undefined;
  if (invoices) {
    const overdue = invoices.filter((i) => i.status === "OVERDUE");
    parts.push(`${invoices.length} invoice(s) on file${overdue.length ? `, ${overdue.length} overdue` : ""}.`);
  }
  const expenses = data.expenses as any[] | undefined;
  if (expenses) {
    const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
    parts.push(`${expenses.length} expense transaction(s) totalling ${formatINR(total)}.`);
  }
  const exceptions = data.openExceptions as any[] | undefined;
  if (exceptions && exceptions.length) {
    parts.push(`${exceptions.length} open exception(s) flagged for review.`);
  }
  if (!parts.length) parts.push("No matching financial data was found for this query.");
  return parts.join(" ");
}

export const accountantAgent: Agent = {
  name: "accountant",
  description: "Handles transactions, expenses, invoices, ledger, categorization, and financial summaries.",
  systemInstructions: SYSTEM_INSTRUCTIONS,
  allowedTools: ALLOWED_TOOLS,

  async execute(message: string, ctx: ToolContext): Promise<AgentAnswer> {
    const { data, calls } = await gatherContext(message, ctx);
    const synthesis = await synthesizeAnswer({
      systemInstructions: SYSTEM_INSTRUCTIONS,
      question: message,
      context: data,
      fallback: () => fallbackAnswer(data),
    });

    await logAgentActivity({
      agentName: "accountant-agent",
      taskType: "ACCOUNTANT_QUERY",
      status: "COMPLETED",
      summary: `Answered: "${message.slice(0, 120)}"`,
      input: { message },
      output: { answer: synthesis.answer, toolCalls: calls.map((c) => c.tool) },
      confidenceScore: synthesis.confidenceScore,
      mode: synthesis.mode,
      organizationId: ctx.companyId,
    });

    return {
      agent: "accountant",
      answer: synthesis.answer,
      data,
      toolCalls: calls,
      confidenceScore: synthesis.confidenceScore,
      mode: synthesis.mode,
    };
  },
};
