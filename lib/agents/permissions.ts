import type { Role, ToolDefinition, ToolContext } from "./types";

const ROLE_RANK: Record<Role, number> = { MEMBER: 0, ACCOUNTANT: 1, ADMIN: 2, OWNER: 3 };

export class ForbiddenToolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenToolError";
  }
}

/**
 * No authentication exists yet - ctx.role defaults to OWNER (see the note on
 * Role in types.ts) so every tool is callable in the current single-tenant
 * demo. This function is the single seam real auth plugs into later: once a
 * route populates ctx.role from a real session, this starts enforcing.
 */
export function assertToolPermission(tool: ToolDefinition, ctx: ToolContext): void {
  const role: Role = ctx.role ?? "OWNER";
  const minRole: Role = tool.minRole ?? (tool.isWrite ? "ACCOUNTANT" : "MEMBER");
  if (ROLE_RANK[role] < ROLE_RANK[minRole]) {
    throw new ForbiddenToolError(`Role "${role}" may not call tool "${tool.name}" (requires ${minRole}+)`);
  }
}
