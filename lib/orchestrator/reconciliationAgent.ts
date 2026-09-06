/**
 * Reconciliation Agent - the orchestrator flow described in the Finova build
 * brief: a transaction enters -> agent retrieves candidate invoices -> proposes
 * a match with a confidence score and evidence -> orchestrator persists it as
 * PROPOSED -> a human approves/rejects -> decision is stored for audit.
 *
 * Never auto-approves: every proposal stops at PROPOSED until a human calls
 * decideReconciliationMatch.
 */

import prisma from "@/lib/db/prisma";
import { findReconciliationCandidates } from "./tools";
import { logAgentActivity, logAudit } from "./activityLog";
import { isLLMAvailable, callLLMForJSON } from "@/lib/ai/llmClient";
import { formatINR, formatDate } from "@/lib/finance/formatting";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";

interface LLMRationale {
  reasoning: string;
  evidence: string[];
  confidenceAdjustment: number; // -0.2..0.2, lets the LLM nudge the deterministic score
}

async function explainMatch(
  tx: { description: string | null; amount: number; date: Date; reference: string | null; category: string | null },
  inv: { vendorClient: string; amount: number; dueDate: Date; invoiceNumber: string; type: string },
  deterministicScore: number
): Promise<LLMRationale> {
  if (!isLLMAvailable()) {
    return {
      reasoning: `Amount and timing align: transaction of ${formatINR(tx.amount)} on ${formatDate(
        tx.date
      )} closely matches invoice ${inv.invoiceNumber} (${inv.vendorClient}) for ${formatINR(
        inv.amount
      )} due ${formatDate(inv.dueDate)}.`,
      evidence: [
        `Amount delta: ${formatINR(Math.abs(tx.amount - inv.amount))}`,
        `Date proximity: ${Math.round(
          Math.abs((tx.date.getTime() - inv.dueDate.getTime()) / 86_400_000)
        )} day(s) from due date`,
      ],
      confidenceAdjustment: 0,
    };
  }

  try {
    return await callLLMForJSON<LLMRationale>([
      {
        role: "system",
        content:
          "You are Finova's Reconciliation Agent. Given a bank transaction and a candidate invoice, " +
          'explain briefly why they likely match, list 2-3 concrete evidence bullet points, and return a ' +
          'confidenceAdjustment between -0.2 and 0.2. Respond ONLY as JSON: {"reasoning": string, "evidence": string[], "confidenceAdjustment": number}.',
      },
      {
        role: "user",
        content: JSON.stringify({
          transaction: { description: tx.description, amount: tx.amount, date: tx.date, reference: tx.reference, category: tx.category },
          invoice: { vendorClient: inv.vendorClient, amount: inv.amount, dueDate: inv.dueDate, invoiceNumber: inv.invoiceNumber, type: inv.type },
          deterministicScore,
        }),
      },
    ]);
  } catch (error) {
    console.error("Reconciliation Agent LLM explanation failed, using deterministic rationale:", error);
    return {
      reasoning: `Amount and timing align: transaction of ${formatINR(tx.amount)} closely matches invoice ${inv.invoiceNumber} (${inv.vendorClient}) for ${formatINR(inv.amount)}.`,
      evidence: [`Amount delta: ${formatINR(Math.abs(tx.amount - inv.amount))}`],
      confidenceAdjustment: 0,
    };
  }
}

/**
 * Scans for new reconciliation candidates, proposes the strongest match per
 * transaction, and persists it as PROPOSED (idempotent - skips pairs already
 * proposed/approved). Returns the newly created proposals.
 */
export async function runReconciliationAgent(organizationId?: string, maxProposals = 10) {
  const cId = await resolveScopedOrganizationId(organizationId);
  const run = await prisma.reconciliationRun.create({ data: { organizationId: cId, status: "RUNNING" } });

  const candidates = await findReconciliationCandidates(cId);

  const seenTransactionIds = new Set<string>();
  const created = [];

  for (const candidate of candidates) {
    if (created.length >= maxProposals) break;
    if (seenTransactionIds.has(candidate.transaction.id)) continue; // best match per transaction only
    seenTransactionIds.add(candidate.transaction.id);

    const existing = await prisma.reconciliationMatch.findUnique({
      where: {
        transactionId_invoiceId: {
          transactionId: candidate.transaction.id,
          invoiceId: candidate.invoice.id,
        },
      },
    });
    if (existing) continue;

    const rationale = await explainMatch(candidate.transaction, candidate.invoice, candidate.score);
    const finalScore = Math.max(0, Math.min(1, candidate.score + rationale.confidenceAdjustment));

    const match = await prisma.reconciliationMatch.create({
      data: {
        runId: run.id,
        transactionId: candidate.transaction.id,
        invoiceId: candidate.invoice.id,
        confidenceScore: finalScore,
        matchType: isLLMAvailable() ? "LLM_ASSISTED" : "DETERMINISTIC",
        reasoning: rationale.reasoning,
        evidence: JSON.stringify(rationale.evidence),
        status: "PROPOSED",
        organizationId: cId,
      },
      include: { transaction: true, invoice: true },
    });

    created.push(match);
  }

  await prisma.reconciliationRun.update({
    where: { id: run.id },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  await logAgentActivity({
    agentName: "reconciliation-agent",
    taskType: "RECONCILIATION_MATCH",
    status: created.length > 0 ? "NEEDS_APPROVAL" : "COMPLETED",
    summary:
      created.length > 0
        ? `Proposed ${created.length} new transaction-to-invoice match${created.length === 1 ? "" : "es"} pending approval.`
        : "Scanned for reconciliation candidates - no new matches found.",
    input: { candidatesScanned: candidates.length, runId: run.id },
    output: { proposed: created.map((m) => ({ id: m.id, confidenceScore: m.confidenceScore })) },
    confidenceScore: created.length ? created[0].confidenceScore : undefined,
    mode: isLLMAvailable() ? "LLM_SYNTHESIS" : "RULE_ENGINE",
    organizationId: cId,
  });

  return created;
}

export async function listReconciliationMatches(organizationId?: string) {
  const cId = await resolveScopedOrganizationId(organizationId);
  return prisma.reconciliationMatch.findMany({
    where: { organizationId: cId },
    include: { transaction: true, invoice: true },
    orderBy: [{ status: "asc" }, { confidenceScore: "desc" }],
  });
}

export async function decideReconciliationMatch(
  matchId: string,
  decision: "APPROVED" | "REJECTED",
  decidedBy: string
) {
  let match = await prisma.reconciliationMatch.update({
    where: { id: matchId },
    data: { status: decision, decidedBy, decidedAt: new Date() },
    include: { transaction: true, invoice: true },
  });

  if (decision === "APPROVED") {
    await prisma.invoice.update({
      where: { id: match.invoiceId },
      data: { status: "PAID", paidDate: match.transaction.date },
    });

    await prisma.payment.create({
      data: {
        organizationId: match.organizationId,
        invoiceId: match.invoiceId,
        transactionId: match.transactionId,
        amount: match.transaction.amount,
        paymentDate: match.transaction.date,
        method: "BANK_TRANSFER",
        reference: match.transaction.reference,
      },
    });

    // Refresh so the returned payload reflects the invoice's new PAID status
    // rather than the pre-update snapshot captured above.
    match = await prisma.reconciliationMatch.findUniqueOrThrow({
      where: { id: matchId },
      include: { transaction: true, invoice: true },
    });
  }

  await logAgentActivity({
    agentName: "reconciliation-agent",
    taskType: "RECONCILIATION_MATCH",
    status: "COMPLETED",
    summary: `Match between transaction "${match.transaction.description}" and invoice ${match.invoice.invoiceNumber} was ${decision.toLowerCase()} by ${decidedBy}.`,
    output: { matchId: match.id, decision },
    confidenceScore: match.confidenceScore,
    mode: match.matchType === "LLM_ASSISTED" ? "LLM_SYNTHESIS" : "RULE_ENGINE",
    organizationId: match.organizationId,
  });

  await logAudit({
    organizationId: match.organizationId,
    action: decision === "APPROVED" ? "RECONCILIATION_APPROVED" : "RECONCILIATION_REJECTED",
    entityType: "ReconciliationMatch",
    entityId: match.id,
    metadata: {
      decidedBy,
      transactionId: match.transactionId,
      invoiceId: match.invoiceId,
      confidenceScore: match.confidenceScore,
    },
  });

  return match;
}
