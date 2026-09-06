/**
 * The Tool Registry - the only door between an agent and application data.
 * Agents never import Prisma or lib/finance/* services directly; they call
 * toolRegistry.execute("toolName", params, ctx), which enforces
 * authorization, confirmation-gating for sensitive writes, and logs every
 * call (AGENTS.md Phases 1 & 6-7).
 */

import { randomUUID } from "crypto";
import type { Role, ToolContext, ToolDefinition, ToolCallRecord, AgentName } from "./types";
import { assertToolPermission, ForbiddenToolError } from "./permissions";
import { logToolExecution } from "./observability";

export class ToolNotFoundError extends Error {
  constructor(name: string) {
    super(`Unknown tool: "${name}"`);
    this.name = "ToolNotFoundError";
  }
}

export class ConfirmationRequiredError extends Error {
  constructor(public readonly toolName: string, public readonly record: ToolCallRecord) {
    super(`Tool "${toolName}" is a sensitive write operation and requires confirmation (pass confirm: true)`);
    this.name = "ConfirmationRequiredError";
  }
}

class ToolRegistry {
  private tools = new Map<string, ToolDefinition>();

  register(tool: ToolDefinition): void {
    // Idempotent by design: Next.js dev-mode hot reload can re-evaluate a
    // module (and its top-level registerXTools() call) without the process
    // restarting, so "already registered" must be a silent no-op, not an error.
    if (this.tools.has(tool.name)) return;
    this.tools.set(tool.name, tool);
  }

  get(name: string): ToolDefinition {
    const tool = this.tools.get(name);
    if (!tool) throw new ToolNotFoundError(name);
    return tool;
  }

  list(agent?: AgentName): ToolDefinition[] {
    const all = Array.from(this.tools.values());
    return agent ? all.filter((t) => t.agent === agent) : all;
  }

  async execute<TParams extends { confirm?: boolean } = any, TResult = any>(
    name: string,
    params: TParams,
    ctx: ToolContext
  ): Promise<{ result: TResult; record: ToolCallRecord }> {
    const tool = this.get(name);
    const startedAt = new Date().toISOString();

    try {
      assertToolPermission(tool, ctx);
    } catch (error) {
      const record: ToolCallRecord = { tool: name, agent: tool.agent, status: "FORBIDDEN", durationMs: 0 };
      logToolExecution({
        requestId: ctx.requestId, userId: ctx.userId, companyId: ctx.companyId,
        agent: tool.agent, tool: name, timestamp: startedAt, status: "FORBIDDEN", latencyMs: 0,
        error: error instanceof ForbiddenToolError ? error.message : "Forbidden",
      });
      throw error;
    }

    if (tool.isWrite && tool.requiresConfirmation && !params?.confirm) {
      const record: ToolCallRecord = { tool: name, agent: tool.agent, status: "NEEDS_CONFIRMATION", durationMs: 0 };
      logToolExecution({
        requestId: ctx.requestId, userId: ctx.userId, companyId: ctx.companyId,
        agent: tool.agent, tool: name, timestamp: startedAt, status: "NEEDS_CONFIRMATION", latencyMs: 0,
      });
      throw new ConfirmationRequiredError(name, record);
    }

    const start = Date.now();
    try {
      const result = await tool.handler(params, ctx);
      const durationMs = Date.now() - start;
      const record: ToolCallRecord = { tool: name, agent: tool.agent, status: "SUCCESS", durationMs };
      logToolExecution({
        requestId: ctx.requestId, userId: ctx.userId, companyId: ctx.companyId,
        agent: tool.agent, tool: name, timestamp: startedAt, status: "SUCCESS", latencyMs: durationMs,
      });
      return { result, record };
    } catch (error) {
      const durationMs = Date.now() - start;
      const message = error instanceof Error ? error.message : "Unknown error";
      const record: ToolCallRecord = { tool: name, agent: tool.agent, status: "ERROR", durationMs, error: message };
      logToolExecution({
        requestId: ctx.requestId, userId: ctx.userId, companyId: ctx.companyId,
        agent: tool.agent, tool: name, timestamp: startedAt, status: "ERROR", latencyMs: durationMs, error: message,
      });
      throw error;
    }
  }
}

export const toolRegistry = new ToolRegistry();

export function createRequestContext(companyId: string, opts: { userId?: string; role?: Role } = {}): ToolContext {
  return { companyId, requestId: randomUUID(), userId: opts.userId, role: opts.role };
}
