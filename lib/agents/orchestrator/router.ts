/**
 * Deterministic intent router: keyword classification, not an LLM call.
 * Routing which agent(s) handle a question is not itself a financial
 * calculation or a place where hallucination risk is worth accepting - a
 * plain, testable, zero-latency rule set is the right tool here (the LLM
 * still does all the *explaining*, inside each agent).
 */

import type { AgentName } from "../types";

const KEYWORDS: Record<AgentName, RegExp> = {
  accountant: /transaction|expense|invoice|ledger|categor|vendor|receipt|anomal|exception/i,
  treasurer: /\bcash\b|afford|runway|forecast|liquidit|receivable|payable|bank account|cash flow/i,
  payroll: /payroll|salary|employee|payslip|attendance|\bleave\b|headcount/i,
};

// Fixed iteration order -> stable, reproducible agentsInvolved ordering
// regardless of which keywords happened to match.
const ORDER: AgentName[] = ["accountant", "treasurer", "payroll"];

export function classifyAgents(message: string): AgentName[] {
  const matched = ORDER.filter((name) => KEYWORDS[name].test(message));
  return matched.length ? matched : ["accountant"]; // general financial questions default to the Accountant
}
