/**
 * Structured, per-tool-call execution logging (AGENTS.md Phase 7).
 * Every field the brief asks for (request/user/org id, agent, tool,
 * timestamp, status, latency, errors) goes out as one JSON line. Deliberately
 * redacts anything that looks like a secret before it's ever serialized -
 * defense in depth even though tool params here are financial query filters,
 * not credentials.
 */

const SECRET_KEY_PATTERN = /(key|token|password|secret|authorization|credential)/i;
const REDACTED = "[REDACTED]";

export function redact(value: unknown, depth = 0): unknown {
  if (depth > 4 || value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SECRET_KEY_PATTERN.test(k) ? REDACTED : redact(v, depth + 1);
    }
    return out;
  }
  return value;
}

export interface ExecutionLogEntry {
  requestId: string;
  userId?: string;
  companyId: string;
  agent: string;
  tool: string;
  timestamp: string;
  status: "SUCCESS" | "ERROR" | "NEEDS_CONFIRMATION" | "FORBIDDEN";
  latencyMs: number;
  error?: string;
}

export function logToolExecution(entry: ExecutionLogEntry): void {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ scope: "agent-tool-execution", ...entry }));
}
