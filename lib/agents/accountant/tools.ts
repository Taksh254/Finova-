/**
 * Accountant Agent tools. Every handler here is a thin wrapper over the
 * existing deterministic functions in lib/orchestrator/tools.ts - no
 * business logic is duplicated, per AGENTS.md's "reuse existing
 * architecture" rule.
 */

import { toolRegistry } from "../registry";
import type { ToolContext } from "../types";
import * as tools from "@/lib/orchestrator/tools";
import { getOpenExceptions } from "@/lib/orchestrator/tools";

export function registerAccountantTools(): void {
  toolRegistry.register({
    name: "getTransactions",
    agent: "accountant",
    description: "List transactions, optionally filtered by type/category/account/date range.",
    isWrite: false,
    handler: (params: { type?: string; category?: string; accountId?: string; from?: string; to?: string; limit?: number }, ctx: ToolContext) =>
      tools.getTransactions(ctx.companyId, {
        type: params?.type,
        category: params?.category,
        accountId: params?.accountId,
        from: params?.from ? new Date(params.from) : undefined,
        to: params?.to ? new Date(params.to) : undefined,
        limit: params?.limit,
      }),
  });

  toolRegistry.register({
    name: "getTransaction",
    agent: "accountant",
    description: "Look up a single transaction by id.",
    isWrite: false,
    handler: (params: { transactionId: string }, ctx: ToolContext) => tools.getTransactionById(ctx.companyId, params.transactionId),
  });

  toolRegistry.register({
    name: "getAccounts",
    agent: "accountant",
    description: "List active bank/cash accounts with balances.",
    isWrite: false,
    handler: (_params: unknown, ctx: ToolContext) => tools.getAccountBalances(ctx.companyId),
  });

  toolRegistry.register({
    name: "getLedger",
    agent: "accountant",
    description: "Chronological transaction ledger with a running net-flow total.",
    isWrite: false,
    handler: (params: { accountId?: string; from?: string; to?: string; limit?: number }, ctx: ToolContext) =>
      tools.getLedger(ctx.companyId, {
        accountId: params?.accountId,
        from: params?.from ? new Date(params.from) : undefined,
        to: params?.to ? new Date(params.to) : undefined,
        limit: params?.limit,
      }),
  });

  toolRegistry.register({
    name: "getExpenses",
    agent: "accountant",
    description: "List expense transactions, optionally filtered by category/date range.",
    isWrite: false,
    handler: (params: { category?: string; from?: string; to?: string }, ctx: ToolContext) =>
      tools.getExpenses(ctx.companyId, {
        category: params?.category,
        from: params?.from ? new Date(params.from) : undefined,
        to: params?.to ? new Date(params.to) : undefined,
      }),
  });

  toolRegistry.register({
    name: "getInvoices",
    agent: "accountant",
    description: "List invoices, optionally filtered by type (RECEIVABLE/PAYABLE) or status.",
    isWrite: false,
    handler: (params: { type?: string; status?: string }, ctx: ToolContext) => tools.getInvoices(ctx.companyId, params ?? {}),
  });

  toolRegistry.register({
    name: "getInvoice",
    agent: "accountant",
    description: "Look up a single invoice by id.",
    isWrite: false,
    handler: (params: { invoiceId: string }, ctx: ToolContext) => tools.getInvoiceById(ctx.companyId, params.invoiceId),
  });

  toolRegistry.register({
    name: "categorizeTransaction",
    agent: "accountant",
    description: "Re-categorize a transaction. Sensitive write - requires confirm: true.",
    isWrite: true,
    requiresConfirmation: true,
    minRole: "ACCOUNTANT",
    handler: (params: { transactionId: string; category: string; subCategory?: string }, ctx: ToolContext) =>
      tools.categorizeTransaction(ctx.companyId, params.transactionId, params.category, params.subCategory),
  });

  toolRegistry.register({
    name: "getFinancialSummary",
    agent: "accountant",
    description: "Revenue, expenses, cash position, AR/AP, and runway summary for the company.",
    isWrite: false,
    handler: (_params: unknown, ctx: ToolContext) => tools.getFinancialSummary(ctx.companyId),
  });

  toolRegistry.register({
    name: "getOpenExceptions",
    agent: "accountant",
    description: "Open reconciliation/invoice/payroll exceptions - the basis for anomaly detection.",
    isWrite: false,
    handler: (_params: unknown, ctx: ToolContext) => getOpenExceptions(ctx.companyId),
  });
}
