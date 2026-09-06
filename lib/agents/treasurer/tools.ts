/**
 * Treasurer Agent tools: cash position, cash flow, receivables/payables,
 * upcoming obligations, recurring expenses, and cash forecasting. Forecasts
 * are calculated deterministically in lib/finance/forecast.ts - this layer
 * only exposes that service as a tool.
 */

import { toolRegistry } from "../registry";
import type { ToolContext } from "../types";
import * as tools from "@/lib/orchestrator/tools";
import { calculateCashFlowForecast } from "@/lib/finance/forecast";

export function registerTreasurerTools(): void {
  toolRegistry.register({
    name: "getBankAccounts",
    agent: "treasurer",
    description: "List active bank/cash accounts with balances.",
    isWrite: false,
    handler: (_params: unknown, ctx: ToolContext) => tools.getAccountBalances(ctx.companyId),
  });

  toolRegistry.register({
    name: "getBalances",
    agent: "treasurer",
    description: "Total cash position across all accounts.",
    isWrite: false,
    handler: (_params: unknown, ctx: ToolContext) => tools.getCashPosition(ctx.companyId),
  });

  toolRegistry.register({
    name: "getCashFlow",
    agent: "treasurer",
    description: "Historical monthly cash flow (inflow/outflow/net/balance).",
    isWrite: false,
    handler: (_params: unknown, ctx: ToolContext) => tools.getCashFlowTrend(ctx.companyId),
  });

  toolRegistry.register({
    name: "getReceivables",
    agent: "treasurer",
    description: "Outstanding (pending/overdue) receivable invoices.",
    isWrite: false,
    handler: (_params: unknown, ctx: ToolContext) => tools.getReceivables(ctx.companyId),
  });

  toolRegistry.register({
    name: "getPayables",
    agent: "treasurer",
    description: "Outstanding (pending/overdue) payable invoices.",
    isWrite: false,
    handler: (_params: unknown, ctx: ToolContext) => tools.getPayables(ctx.companyId),
  });

  toolRegistry.register({
    name: "getUpcomingPayments",
    agent: "treasurer",
    description: "Payables due within N days (default 14).",
    isWrite: false,
    handler: (params: { days?: number }, ctx: ToolContext) => tools.getUpcomingPayments(ctx.companyId, params?.days),
  });

  toolRegistry.register({
    name: "getRecurringExpenses",
    agent: "treasurer",
    description: "Vendors billing on a recurring (subscription/rent-like) pattern over the trailing months.",
    isWrite: false,
    handler: (params: { months?: number }, ctx: ToolContext) => tools.getRecurringExpenses(ctx.companyId, params?.months),
  });

  toolRegistry.register({
    name: "calculateCashForecast",
    agent: "treasurer",
    description: "Deterministic 30/60/90-day cash projection based on trailing net flow plus known payables/receivables.",
    isWrite: false,
    handler: (_params: unknown, ctx: ToolContext) => calculateCashFlowForecast(ctx.companyId),
  });

  toolRegistry.register({
    name: "calculateCashRunway",
    agent: "treasurer",
    description: "Months of runway at current average net burn.",
    isWrite: false,
    handler: (_params: unknown, ctx: ToolContext) => tools.calculateCashRunway(ctx.companyId),
  });
}
