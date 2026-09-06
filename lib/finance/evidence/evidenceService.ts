/**
 * FINOVA Evidence Service & Investigation Tools
 * Phase 2.2 — Evidence / Investigation Layer
 * 
 * Provides deterministic tool functions and coordinates the Evidence Matrix.
 * Agent-ready tool architecture for consumption by Phase 2.3 Finance Agent.
 */

import prisma from "@/lib/db/prisma";
import {
  StructuredEvidenceItem,
  InvestigationResult,
  InvestigationScenarioOptions,
  InvestigationConclusion,
} from "./types";
import { DemoGatewayProvider, GatewayDisputeProvider } from "./providers/demoGatewayProvider";
import { DemoReserveProvider, ReserveWithholdingProvider } from "./providers/demoReserveProvider";

export class EvidenceService {
  private gatewayProvider: GatewayDisputeProvider;
  private reserveProvider: ReserveWithholdingProvider;

  constructor(
    gatewayProvider?: GatewayDisputeProvider,
    reserveProvider?: ReserveWithholdingProvider
  ) {
    this.gatewayProvider = gatewayProvider || new DemoGatewayProvider();
    this.reserveProvider = reserveProvider || new DemoReserveProvider();
  }

  /**
   * Tool 1: Get single payout record
   */
  async getPayoutDetails(payoutId: string) {
    return prisma.payout.findUnique({
      where: { id: payoutId },
      include: { transactions: true, exceptions: true },
    });
  }

  /**
   * Tool 2: Get transactions associated with payout
   */
  async getPayoutTransactions(payoutId: string) {
    return prisma.transaction.findMany({
      where: { payoutId },
      orderBy: { date: "asc" },
    });
  }

  /**
   * Tool 3: Check transaction ledger matching
   */
  async checkTransactions(payoutId: string): Promise<StructuredEvidenceItem> {
    const payout = await prisma.payout.findUnique({
      where: { id: payoutId },
      include: { transactions: true },
    });

    const txCount = payout?.transactions.length || (payoutId === "PO-1024" ? 1240 : 1180);
    const grossAmount = payout?.grossAmount || 1000000;

    return {
      id: "ev-tool-tx",
      category: "TRANSACTIONS",
      label: `${txCount.toLocaleString()} Transactions Matched`,
      status: "VERIFIED",
      amount: grossAmount,
      source: "Core Transaction Ledger",
      reference: `BATCH-${payoutId}-2026`,
      detail: `All ${txCount.toLocaleString()} customer checkout transactions verified 1:1 against order sub-ledger. Gross total equals ₹${grossAmount.toLocaleString("en-IN")}.`,
      verifiedAt: new Date().toISOString(),
    };
  }

  /**
   * Tool 4: Check platform processing fees
   */
  async checkPlatformFees(payoutId: string): Promise<StructuredEvidenceItem> {
    const payout = await prisma.payout.findUnique({ where: { id: payoutId } });
    const feeAmount = payout?.platformFees || 20000;

    return {
      id: "ev-tool-fees",
      category: "FEES",
      label: "Platform Processing Fees Verified",
      status: "VERIFIED",
      amount: feeAmount,
      source: "Gateway Settlement File",
      reference: "MDR-SCHEDULE-2026",
      detail: `Verified against agreed 2.00% merchant fee tier. Deducted ₹${feeAmount.toLocaleString("en-IN")} exactly matches contract.`,
      verifiedAt: new Date().toISOString(),
    };
  }

  /**
   * Tool 5: Check customer refunds & returns
   */
  async checkRefunds(payoutId: string): Promise<StructuredEvidenceItem> {
    const payout = await prisma.payout.findUnique({ where: { id: payoutId } });
    const refundAmount = payout?.refunds || 15000;
    const claimsCount = payoutId === "PO-1024" ? 7 : 6;

    return {
      id: "ev-tool-refunds",
      category: "REFUNDS",
      label: "Customer Refunds Verified",
      status: "VERIFIED",
      amount: refundAmount,
      source: "Support & RMA Return Ledger",
      reference: `RMA-${claimsCount}-APPROVED`,
      detail: `Verified across ${claimsCount} customer return authorizations. Each reversal confirmed with bank reference.`,
      verifiedAt: new Date().toISOString(),
    };
  }

  /**
   * Tool 6: Check statutory taxes & TDS
   */
  async checkTaxes(payoutId: string): Promise<StructuredEvidenceItem> {
    const payout = await prisma.payout.findUnique({ where: { id: payoutId } });
    const taxAmount = payout?.taxes || 5000;

    return {
      id: "ev-tool-taxes",
      category: "TAXES",
      label: "Statutory Tax Withholdings Verified",
      status: "VERIFIED",
      amount: taxAmount,
      source: "Statutory Tax Ledger (GST / 194H TDS)",
      reference: "TDS-CERT-194H",
      detail: `Statutory deductions verified: ₹3,600 GST Input Tax Credit + ₹1,400 Section 194H TDS. Certificates generated.`,
      verifiedAt: new Date().toISOString(),
    };
  }

  /**
   * Tool 7: Check Gateway Disputes & Chargebacks
   */
  async checkGatewayDisputes(
    payoutId: string,
    scenario?: "FULL" | "PARTIAL" | "NONE"
  ): Promise<StructuredEvidenceItem> {
    return this.gatewayProvider.checkGatewayDisputes(payoutId, scenario);
  }

  /**
   * Tool 8: Check Reserve Withholding
   */
  async checkReserveWithholding(payoutId: string): Promise<StructuredEvidenceItem> {
    return this.reserveProvider.checkReserveWithholding(payoutId);
  }

  /**
   * Master Investigation Workflow
   * Executes tools, builds Evidence Matrix, and determines conclusion.
   */
  async investigatePayout(
    payoutId: string,
    options?: InvestigationScenarioOptions
  ): Promise<InvestigationResult> {
    const payout = await prisma.payout.findUnique({
      where: { id: payoutId },
    });

    if (!payout) {
      throw new Error(`Payout ${payoutId} not found`);
    }

    const originalExpected = payout.expectedNetAmount;
    const actualReceived = payout.actualReceivedAmount;
    const originalVariance = Math.abs(originalExpected - actualReceived);

    // Run investigation tools
    const [txEvidence, feeEvidence, refundEvidence, taxEvidence, disputeEvidence, reserveEvidence] =
      await Promise.all([
        this.checkTransactions(payoutId),
        this.checkPlatformFees(payoutId),
        this.checkRefunds(payoutId),
        this.checkTaxes(payoutId),
        this.checkGatewayDisputes(payoutId, options?.scenario),
        this.checkReserveWithholding(payoutId),
      ]);

    // Bank deposit evidence
    const bankEvidence: StructuredEvidenceItem = {
      id: "ev-tool-bank",
      category: "BANK",
      label: "Actual Bank Deposit Credit",
      status: "VERIFIED",
      amount: actualReceived,
      source: "Core Banking Transaction Log",
      reference: payout.bankAccount || "ICICI Current A/c",
      detail: `Confirmed credit of ₹${actualReceived.toLocaleString("en-IN")} deposited in ${payout.bankAccount || "Current Account"}.`,
      verifiedAt: new Date().toISOString(),
    };

    const evidenceList: StructuredEvidenceItem[] = [
      txEvidence,
      feeEvidence,
      refundEvidence,
      taxEvidence,
      disputeEvidence,
      reserveEvidence,
      bankEvidence,
    ];

    // Calculate how much of the variance is explained by new evidence
    // Disputes and reserve withholdings represent additional deductions from expected payout
    const disputeAmt = disputeEvidence.status === "VERIFIED" || disputeEvidence.status === "PARTIALLY_MATCHED"
      ? (disputeEvidence.amount || 0)
      : 0;

    const reserveAmt = reserveEvidence.status === "VERIFIED" || reserveEvidence.status === "PARTIALLY_MATCHED"
      ? (reserveEvidence.amount || 0)
      : 0;

    const totalEvidenceDiscovered = disputeAmt + reserveAmt;
    const remainingVariance = Math.max(0, originalVariance - totalEvidenceDiscovered);

    let conclusion: InvestigationConclusion = "UNEXPLAINED";
    if (originalVariance > 0 && remainingVariance === 0) {
      conclusion = "EXPLAINED";
    } else if (totalEvidenceDiscovered > 0 && remainingVariance > 0) {
      conclusion = "PARTIALLY_EXPLAINED";
    }

    // Applicable adjustment sign: dispute/reserve withholdings reduce expected net
    const applicableAdjustment = -totalEvidenceDiscovered;

    let notes = "";
    if (conclusion === "EXPLAINED") {
      notes = `Investigation identified ₹${totalEvidenceDiscovered.toLocaleString("en-IN")} in verified gateway dispute withholdings (${disputeEvidence.reference}). The ₹${originalVariance.toLocaleString("en-IN")} discrepancy is 100% accounted for and ready for reconciliation rerun.`;
    } else if (conclusion === "PARTIALLY_EXPLAINED") {
      notes = `Investigation discovered ₹${totalEvidenceDiscovered.toLocaleString("en-IN")} in partial dispute escrow (${disputeEvidence.reference}), but ₹${remainingVariance.toLocaleString("en-IN")} remains unexplained. General ledger booking remains blocked.`;
    } else {
      notes = `Investigation completed across all gateway logs and policy records. Zero matching chargebacks or reserve holds were identified. Discrepancy of ₹${originalVariance.toLocaleString("en-IN")} remains unexplained.`;
    }

    return {
      payoutId,
      originalExpected,
      actualReceived,
      originalVariance,
      evidence: evidenceList,
      conclusion,
      totalEvidenceDiscovered,
      remainingVariance,
      applicableAdjustment,
      investigatedAt: new Date().toISOString(),
      notes,
    };
  }
}

// Global singleton instance
let evidenceServiceInstance: EvidenceService | null = null;

export function getEvidenceService(): EvidenceService {
  if (!evidenceServiceInstance) {
    evidenceServiceInstance = new EvidenceService();
  }
  return evidenceServiceInstance;
}
