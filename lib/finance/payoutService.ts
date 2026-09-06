/**
 * FINOVA Payout Truth Service
 * Authoritative financial calculation, reconciliation, and audit logging engine.
 * 
 * Principle: "FINOVA refuses to book what it cannot explain."
 */

export type PayoutStatus = "RECONCILED" | "NEEDS_REVIEW" | "PROCESSING";

export interface PayoutSummary {
  payoutsToReconcile: number;
  successfullyReconciled: number;
  exceptionsCount: number;
  totalValueReconciled: number;
}

export interface PayoutListItem {
  id: string;
  merchant: string;
  gateway: string;
  date: string;
  grossAmount: number;
  expectedPayout: number;
  actualReceived: number;
  difference: number;
  status: PayoutStatus;
  transactionsCount: number;
  hasAccountingEntry: boolean;
}

export interface PayoutBreakdown {
  gross: number;
  platformFees: number;
  platformFeeRate: string;
  refunds: number;
  refundsCount: number;
  taxes: number;
  taxDetails: string;
  adjustments: number;
  expectedNet: number;
  actualBank: number;
  difference: number;
  unexplained: number;
}

export interface EvidenceItem {
  id: string;
  label: string;
  status: "VERIFIED" | "MISMATCHED" | "WARNING" | "INFO";
  detail: string;
  category: "TRANSACTIONS" | "FEES" | "REFUNDS" | "TAXES" | "BANK";
}

export interface HumanReviewData {
  required: boolean;
  title: string;
  whatFinovaExpected: string;
  whatFinovaFound: string;
  differenceSummary: string;
  reasonNotConfident: string;
  suggestedResolution: string;
  resolutionStatus?: "PENDING" | "APPROVED" | "REJECTED" | "EVIDENCE_REQUESTED";
  resolvedAt?: string;
  reviewerNote?: string;
}

export interface DoubleEntryLine {
  type: "DEBIT" | "CREDIT";
  accountCode: string;
  accountName: string;
  amount: number;
}

export interface AuditLogItem {
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}

export interface AccountingEntry {
  created: boolean;
  entryNumber?: string;
  createdAt?: string;
  createdBy?: string;
  lines: DoubleEntryLine[];
  auditLog: AuditLogItem[];
}

export interface PayoutDetail {
  id: string;
  merchant: string;
  gateway: string;
  merchantLogoLetter: string;
  merchantLogoBg: string;
  bankAccount: string;
  date: string;
  status: PayoutStatus;
  transactionsCount: number;
  breakdown: PayoutBreakdown;
  evidence: EvidenceItem[];
  humanReview: HumanReviewData;
  accountingEntry: AccountingEntry;
}

// In-memory persistent state store for active session
const payoutsStore: Map<string, PayoutDetail> = new Map();

function initializeStore() {
  if (payoutsStore.size > 0) return;

  // =========================================================================
  // CASE A: FULL SUCCESS (RECONCILED)
  // =========================================================================
  const caseA: PayoutDetail = {
    id: "PO-RZP-8492",
    merchant: "Razorpay Gateway Settlement",
    gateway: "Razorpay",
    merchantLogoLetter: "R",
    merchantLogoBg: "#0C2340",
    bankAccount: "HDFC Current A/c •••• 4092",
    date: "2026-09-02",
    status: "RECONCILED",
    transactionsCount: 1240,
    breakdown: {
      gross: 1000000,
      platformFees: 20000,
      platformFeeRate: "2.0% + GST",
      refunds: 15000,
      refundsCount: 7,
      taxes: 5000,
      taxDetails: "GST @ 18% on fee (₹3,600) + TDS u/s 194H (₹1,400)",
      adjustments: 0,
      expectedNet: 960000,
      actualBank: 960000,
      difference: 0,
      unexplained: 0,
    },
    evidence: [
      {
        id: "ev-1",
        label: "1,240 transactions matched",
        status: "VERIFIED",
        detail: "All 1,240 customer order UTRs matched 1:1 between internal sales records and the gateway settlement batch. Zero orphaned transactions.",
        category: "TRANSACTIONS",
      },
      {
        id: "ev-2",
        label: "Platform fees verified",
        status: "VERIFIED",
        detail: "₹20,000 charged at exactly 2.00% standard rate per the active Razorpay Enterprise Merchant Agreement. No surprise charges.",
        category: "FEES",
      },
      {
        id: "ev-3",
        label: "Refunds verified",
        status: "VERIFIED",
        detail: "₹15,000 across 7 authorized customer return requests, each backed by an approved RMA slip and reversal reference.",
        category: "REFUNDS",
      },
      {
        id: "ev-4",
        label: "Tax deductions verified",
        status: "VERIFIED",
        detail: "Statutory tax withheld matches tax rules: ₹3,600 GST Input Credit + ₹1,400 Section 194H TDS Certificate generated.",
        category: "TAXES",
      },
      {
        id: "ev-5",
        label: "Bank amount verified",
        status: "VERIFIED",
        detail: "Bank credit of exactly ₹9,60,000 verified in HDFC Current A/c statement at 11:42 AM IST (Ref: HDFCR5202609029148).",
        category: "BANK",
      },
    ],
    humanReview: {
      required: false,
      title: "No Review Required",
      whatFinovaExpected: "Expected net payout ₹9,60,000.",
      whatFinovaFound: "Received exact bank credit of ₹9,60,000.",
      differenceSummary: "₹0 difference. 100% explained.",
      reasonNotConfident: "",
      suggestedResolution: "Ready for immediate accounting entry booking.",
      resolutionStatus: "APPROVED",
    },
    accountingEntry: {
      created: false,
      lines: [
        { type: "DEBIT", accountCode: "1010", accountName: "HDFC Bank Current Account", amount: 960000 },
        { type: "DEBIT", accountCode: "5040", accountName: "Payment Gateway Processing Fees", amount: 20000 },
        { type: "DEBIT", accountCode: "4090", accountName: "Customer Returns & Refund Allowances", amount: 15000 },
        { type: "DEBIT", accountCode: "1320", accountName: "GST & TDS Statutory Tax Credit", amount: 5000 },
        { type: "CREDIT", accountCode: "1210", accountName: "Merchant Settlement Clearing Account", amount: 1000000 },
      ],
      auditLog: [
        {
          timestamp: "2026-09-02T11:43:10.000Z",
          action: "PAYOUT_RECEIVED",
          actor: "Razorpay Webhook Listener",
          details: "Received settlement payload for 1,240 orders totaling ₹10,00,000 Gross.",
        },
        {
          timestamp: "2026-09-02T11:43:14.000Z",
          action: "RECONCILIATION_COMPLETED",
          actor: "FINOVA Payout Truth Engine",
          details: "Reconciled all 5 deduction categories. Every rupee traced. Zero discrepancy.",
        },
      ],
    },
  };

  // =========================================================================
  // CASE B: EXCEPTION / DISCREPANCY (NEEDS REVIEW)
  // =========================================================================
  const caseB: PayoutDetail = {
    id: "PO-STR-9140",
    merchant: "Stripe India Settlement",
    gateway: "Stripe",
    merchantLogoLetter: "S",
    merchantLogoBg: "#635BFF",
    bankAccount: "ICICI Current A/c •••• 8812",
    date: "2026-09-04",
    status: "NEEDS_REVIEW",
    transactionsCount: 1180,
    breakdown: {
      gross: 1000000,
      platformFees: 20000,
      platformFeeRate: "2.0% standard",
      refunds: 15000, // authorized in ERP
      refundsCount: 6,
      taxes: 5000,
      taxDetails: "GST on fee (₹3,600) + TDS withholdings (₹1,400)",
      adjustments: 0,
      expectedNet: 960000,
      actualBank: 942000,
      difference: 18000,
      unexplained: 18000,
    },
    evidence: [
      {
        id: "ev-b1",
        label: "1,180 transactions matched",
        status: "VERIFIED",
        detail: "Underlying sales transactions verified against order fulfillment database (#ORD-8812 to #ORD-9992).",
        category: "TRANSACTIONS",
      },
      {
        id: "ev-b2",
        label: "Platform fees verified",
        status: "VERIFIED",
        detail: "Standard platform processing fee of ₹20,000 corresponds to 2.0% agreed merchant pricing tier.",
        category: "FEES",
      },
      {
        id: "ev-b3",
        label: "Refund amount differs",
        status: "MISMATCHED",
        detail: "Stripe deducted ₹33,000 under batch refunds, but internal CRM and support logs authorize only ₹15,000 in refunds. ₹18,000 is unlogged or an unauthorized customer chargeback.",
        category: "REFUNDS",
      },
      {
        id: "ev-b4",
        label: "₹18,000 remains unexplained",
        status: "WARNING",
        detail: "Expected net payout was ₹9,60,000, but actual deposit in ICICI Bank was ₹9,42,000. Shortfall of ₹18,000 has no matching transaction in your accounting books.",
        category: "BANK",
      },
      {
        id: "ev-b5",
        label: "Tax deductions verified",
        status: "VERIFIED",
        detail: "Tax deduction calculated on contracted fee matches statutory requirements (₹5,000).",
        category: "TAXES",
      },
    ],
    humanReview: {
      required: true,
      title: "Human Review Required",
      whatFinovaExpected: "FINOVA expected a net bank credit of ₹9,60,000 after standard ₹20,000 platform fees, ₹15,000 authorized customer refunds, and ₹5,000 taxes.",
      whatFinovaFound: "Bank deposit received was ₹9,42,000. Stripe deducted an extra ₹18,000 which has no matching return slip, credit memo, or fee schedule in your ERP.",
      differenceSummary: "₹18,000 cannot be explained",
      reasonNotConfident: "FINOVA refuses to book what it cannot explain. Booking this entry automatically would leave an untraceable ₹18,000 leakage in your merchant clearing ledger. A human controller must verify whether Stripe levied an unnotified international chargeback or disputed reversal.",
      suggestedResolution: "Contact Stripe Merchant Support for the itemized Dispute Log, or approve a temporary hold to 'Disputed Gateway Receivables'.",
      resolutionStatus: "PENDING",
    },
    accountingEntry: {
      created: false,
      lines: [
        { type: "DEBIT", accountCode: "1020", accountName: "ICICI Bank Current Account", amount: 942000 },
        { type: "DEBIT", accountCode: "5040", accountName: "Payment Gateway Processing Fees", amount: 20000 },
        { type: "DEBIT", accountCode: "4090", accountName: "Authorized Customer Refunds", amount: 15000 },
        { type: "DEBIT", accountCode: "1320", accountName: "GST & TDS Statutory Credit", amount: 5000 },
        { type: "DEBIT", accountCode: "1490", accountName: "Disputed Gateway Receivables (Unexplained)", amount: 18000 },
        { type: "CREDIT", accountCode: "1210", accountName: "Merchant Settlement Clearing Account", amount: 1000000 },
      ],
      auditLog: [
        {
          timestamp: "2026-09-04T15:20:00.000Z",
          action: "PAYOUT_RECEIVED",
          actor: "Stripe Webhook Listener",
          details: "Received settlement credit for 1,180 orders totaling ₹10,00,000 Gross.",
        },
        {
          timestamp: "2026-09-04T15:20:06.000Z",
          action: "DISCREPANCY_FLAGGED",
          actor: "FINOVA Payout Truth Engine",
          details: "DISCREPANCY DETECTED: Bank received ₹9,42,000 vs expected ₹9,60,000. ₹18,000 remains unexplained. Autonomous booking blocked.",
        },
      ],
    },
  };

  // =========================================================================
  // CASE C: PROCESSING (IN-TRANSIT REALISTIC DEMO)
  // =========================================================================
  const caseC: PayoutDetail = {
    id: "PO-CSH-3301",
    merchant: "Cashfree AutoSplit Batch",
    gateway: "Cashfree",
    merchantLogoLetter: "C",
    merchantLogoBg: "#00897B",
    bankAccount: "Kotak Bank A/c •••• 1045",
    date: "2026-09-06",
    status: "PROCESSING",
    transactionsCount: 412,
    breakdown: {
      gross: 450000,
      platformFees: 9000,
      platformFeeRate: "2.0%",
      refunds: 3500,
      refundsCount: 2,
      taxes: 2250,
      taxDetails: "Statutory withholdings",
      adjustments: 0,
      expectedNet: 435250,
      actualBank: 0,
      difference: 0,
      unexplained: 0,
    },
    evidence: [
      {
        id: "ev-c1",
        label: "412 transactions matched",
        status: "VERIFIED",
        detail: "Real-time payment order batch verified against checkout session tokens.",
        category: "TRANSACTIONS",
      },
      {
        id: "ev-c2",
        label: "Platform fees verified",
        status: "VERIFIED",
        detail: "₹9,000 fee corresponds strictly to contracted 2.0% volume tier.",
        category: "FEES",
      },
      {
        id: "ev-c3",
        label: "Settlement in transit",
        status: "INFO",
        detail: "NEFT settlement window currently open. Bank credit expected by 4:00 PM IST today.",
        category: "BANK",
      },
    ],
    humanReview: {
      required: false,
      title: "Settlement In Progress",
      whatFinovaExpected: "Expected net deposit ₹4,35,250.",
      whatFinovaFound: "Awaiting bank credit confirmation.",
      differenceSummary: "In transit",
      reasonNotConfident: "",
      suggestedResolution: "System will auto-reconcile immediately upon bank statement webhook.",
    },
    accountingEntry: {
      created: false,
      lines: [],
      auditLog: [
        {
          timestamp: "2026-09-06T08:30:00.000Z",
          action: "BATCH_INITIATED",
          actor: "Cashfree API Poller",
          details: "Captured batch of 412 orders. Settlement in transit.",
        },
      ],
    },
  };

  payoutsStore.set(caseA.id, caseA);
  payoutsStore.set(caseB.id, caseB);
  payoutsStore.set(caseC.id, caseC);
}

export class PayoutTruthService {
  constructor() {
    initializeStore();
  }

  /**
   * Get KPI summary cards
   */
  async getSummary(): Promise<PayoutSummary> {
    initializeStore();
    const all = Array.from(payoutsStore.values());

    const payoutsToReconcile = all.filter((p) => p.status === "PROCESSING").length;
    const successfullyReconciled = all.filter((p) => p.status === "RECONCILED").length;
    const exceptionsCount = all.filter((p) => p.status === "NEEDS_REVIEW").length;
    const totalValueReconciled = all
      .filter((p) => p.status === "RECONCILED")
      .reduce((sum, p) => sum + p.breakdown.actualBank, 0);

    return {
      payoutsToReconcile,
      successfullyReconciled,
      exceptionsCount,
      totalValueReconciled,
    };
  }

  /**
   * Get list of all payouts for the table
   */
  async getPayoutsList(): Promise<PayoutListItem[]> {
    initializeStore();
    return Array.from(payoutsStore.values()).map((p) => ({
      id: p.id,
      merchant: p.merchant,
      gateway: p.gateway,
      date: p.date,
      grossAmount: p.breakdown.gross,
      expectedPayout: p.breakdown.expectedNet,
      actualReceived: p.breakdown.actualBank,
      difference: p.breakdown.difference,
      status: p.status,
      transactionsCount: p.transactionsCount,
      hasAccountingEntry: p.accountingEntry.created,
    }));
  }

  /**
   * Get deep investigation view data for a single payout
   */
  async getPayoutDetail(id: string): Promise<PayoutDetail | null> {
    initializeStore();
    const payout = payoutsStore.get(id);
    if (!payout) return null;
    return payout;
  }

  /**
   * Re-run reconciliation algorithm on a payout
   */
  async reconcilePayout(id: string): Promise<PayoutDetail | null> {
    initializeStore();
    const payout = payoutsStore.get(id);
    if (!payout) return null;

    // Authoritative math
    const expected =
      payout.breakdown.gross -
      payout.breakdown.platformFees -
      payout.breakdown.refunds -
      payout.breakdown.taxes +
      payout.breakdown.adjustments;

    payout.breakdown.expectedNet = expected;

    if (payout.breakdown.actualBank > 0) {
      const diff = expected - payout.breakdown.actualBank;
      payout.breakdown.difference = Math.abs(diff);
      payout.breakdown.unexplained = Math.abs(diff);

      if (diff === 0) {
        payout.status = "RECONCILED";
        payout.humanReview.required = false;
      } else {
        payout.status = "NEEDS_REVIEW";
        payout.humanReview.required = true;
      }
    }

    payout.accountingEntry.auditLog.push({
      timestamp: new Date().toISOString(),
      action: "RECONCILIATION_REEVALUATED",
      actor: "FINOVA Payout Truth Engine",
      details: `Re-calculated variance: Expected ₹${expected} vs Received ₹${payout.breakdown.actualBank}. Status: ${payout.status}.`,
    });

    payoutsStore.set(id, payout);
    return payout;
  }

  /**
   * Create accounting entry for reconciled or approved payout
   */
  async createAccountingEntry(id: string, user: string = "Finance Controller"): Promise<PayoutDetail | null> {
    initializeStore();
    const payout = payoutsStore.get(id);
    if (!payout) return null;

    // Rule: "FINOVA refuses to book what it cannot explain."
    if (payout.status === "NEEDS_REVIEW" && payout.humanReview.resolutionStatus !== "APPROVED") {
      throw new Error("FINOVA refuses to book what it cannot explain. Discrepancy requires human resolution approval first.");
    }

    const entryNum = `AE-2026-${payout.id.replace("PO-", "")}`;
    const timestamp = new Date().toISOString();

    payout.accountingEntry.created = true;
    payout.accountingEntry.entryNumber = entryNum;
    payout.accountingEntry.createdAt = timestamp;
    payout.accountingEntry.createdBy = user;

    payout.accountingEntry.auditLog.push({
      timestamp,
      action: "ACCOUNTING_ENTRY_CREATED",
      actor: user,
      details: `Created double-entry general ledger voucher ${entryNum} for ${payout.merchant} (${payout.id}). Total settled: ₹${payout.breakdown.actualBank.toLocaleString("en-IN")}.`,
    });

    payoutsStore.set(id, payout);
    return payout;
  }

  /**
   * Handle human controller review actions
   */
  async submitReview(
    id: string,
    action: "APPROVE_RESOLUTION" | "REJECT" | "REQUEST_EVIDENCE",
    reviewerNote: string = "",
    user: string = "Taksh (Finance Controller)"
  ): Promise<PayoutDetail | null> {
    initializeStore();
    const payout = payoutsStore.get(id);
    if (!payout) return null;

    const timestamp = new Date().toISOString();

    if (action === "APPROVE_RESOLUTION") {
      payout.humanReview.resolutionStatus = "APPROVED";
      payout.humanReview.resolvedAt = timestamp;
      payout.humanReview.reviewerNote = reviewerNote || "Approved: Book ₹18,000 discrepancy to Disputed Gateway Receivables (Account #1490) pending merchant credit memo.";
      
      payout.accountingEntry.auditLog.push({
        timestamp,
        action: "HUMAN_REVIEW_APPROVED",
        actor: user,
        details: `Discrepancy resolution approved by ${user}. Authorized provisional allocation to Disputed Gateway Receivables.`,
      });
    } else if (action === "REJECT") {
      payout.humanReview.resolutionStatus = "REJECTED";
      payout.humanReview.resolvedAt = timestamp;
      payout.humanReview.reviewerNote = reviewerNote || "Settlement rejected. Automatic formal dispute notice issued to Stripe Merchant Operations.";

      payout.accountingEntry.auditLog.push({
        timestamp,
        action: "SETTLEMENT_REJECTED",
        actor: user,
        details: `Payout settlement rejected by ${user}. Formal demand note dispatched to payment gateway.`,
      });
    } else if (action === "REQUEST_EVIDENCE") {
      payout.humanReview.resolutionStatus = "EVIDENCE_REQUESTED";
      payout.humanReview.resolvedAt = timestamp;
      payout.humanReview.reviewerNote = reviewerNote || "Requested itemized fee & dispute statement via gateway API.";

      payout.accountingEntry.auditLog.push({
        timestamp,
        action: "EVIDENCE_REQUESTED",
        actor: user,
        details: `Automated webhook dispatched requesting itemized dispute debit log from gateway partner.`,
      });
    }

    payoutsStore.set(id, payout);
    return payout;
  }
}

// Global singleton instance
let payoutServiceInstance: PayoutTruthService | null = null;

export function getPayoutService(): PayoutTruthService {
  if (!payoutServiceInstance) {
    payoutServiceInstance = new PayoutTruthService();
  }
  return payoutServiceInstance;
}
