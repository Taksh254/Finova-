/**
 * POST /api/ai/chat - the Agent Orchestrator entrypoint (AGENTS.md Phase 8).
 * Accepts `message` (per the build brief) or `question` (the field name the
 * existing dashboard chat UIs already send) for backward compatibility, and
 * wraps the response in the app's standard { success, data } envelope like
 * every other route - the AGENTS.md-shaped payload (answer/agent/
 * agentsInvolved/toolCalls/data) lives at `data`.
 */

import { handleUserMessage } from "@/lib/agents";
import { createRequestContext } from "@/lib/agents/registry";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";
import { ok, handleApiError, ValidationError } from "@/lib/api/http";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message =
      typeof body.message === "string" ? body.message.trim() : typeof body.question === "string" ? body.question.trim() : "";
    if (!message) throw new ValidationError("INVALID_MESSAGE", "message (or question) is required");

    const organizationId = typeof body.organizationId === "string" ? body.organizationId : undefined;
    const cId = await resolveScopedOrganizationId(organizationId);

    // No login flow exists yet (see lib/auth/companyScope.ts) - default to
    // OWNER until real session-based auth populates ctx.role. See the Role
    // note in lib/agents/types.ts for how this seam is meant to be filled.
    const ctx = createRequestContext(cId, { role: "OWNER" });

    const params: Record<string, unknown> = {};
    if (typeof body.confirm === "boolean") params.confirm = body.confirm;
    if (typeof body.period === "string") params.period = body.period;
    if (typeof body.employeeId === "string") params.employeeId = body.employeeId;

    const result = await handleUserMessage(message, ctx, params);

    return ok({
      answer: result.answer,
      agent: result.agent,
      agentsInvolved: result.agentsInvolved,
      toolCalls: result.toolCalls.map((c) => ({ tool: c.tool, agent: c.agent, status: c.status, durationMs: c.durationMs })),
      data: result.data,
      mode: result.mode,
      confidenceScore: result.confidenceScore,
      ...(result.needsConfirmation ? { needsConfirmation: result.needsConfirmation } : {}),
    });
  } catch (error) {
    return handleApiError(error, "AI_CHAT_FAILED", "The AI agent system failed to answer");
  }
}
