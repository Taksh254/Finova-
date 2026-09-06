"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowDown,
  Sparkles,
  FileCheck2,
  FileX2,
  HelpCircle,
  Building2,
  FileText,
  CreditCard,
  Receipt,
  RotateCcw,
  Check,
  X,
  Send,
  History,
  Search,
  RefreshCw,
} from "lucide-react";
import { PayoutDetail } from "@/lib/finance/payoutService";
import { InvestigationResult } from "@/lib/finance/evidence/types";
import { formatINR, formatDate } from "@/lib/finance/formatting";
import styles from "./PayoutDetailView.module.css";

interface PayoutDetailViewProps {
  payout: PayoutDetail;
  onBack: () => void;
  onSwitchPayout: (id: string) => void;
  onPayoutUpdated: (updated: PayoutDetail, toastMessage: string) => void;
}

export function PayoutDetailView({
  payout,
  onBack,
  onSwitchPayout,
  onPayoutUpdated,
}: PayoutDetailViewProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeModal, setActiveModal] = useState<"NONE" | "APPROVE" | "REQUEST_EVIDENCE" | "ESCALATE">("NONE");
  const [explanationText, setExplanationText] = useState("");
  const [evidenceRefText, setEvidenceRefText] = useState("");
  const [evidenceRequestText, setEvidenceRequestText] = useState("");
  const [escalationText, setEscalationText] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Phase 2.2 Investigation state
  const [investigationState, setInvestigationState] = useState<"IDLE" | "RUNNING" | "COMPLETED">(
    payout.investigation ? "COMPLETED" : "IDLE"
  );
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [investigationResult, setInvestigationResult] = useState<InvestigationResult | null>(
    payout.investigation || null
  );
  const [scenario, setScenario] = useState<"FULL" | "PARTIAL" | "NONE">("FULL");
  const [rerunSuccess, setRerunSuccess] = useState(false);

  const { breakdown, evidence, humanReview, accountingEntry } = payout;

  // Handle Investigate with FINOVA
  const handleRunInvestigation = async (chosenScenario: "FULL" | "PARTIAL" | "NONE" = scenario) => {
    try {
      setIsProcessing(true);
      setInvestigationState("RUNNING");
      setActiveStepIndex(1);

      // Progressive check display
      setTimeout(() => setActiveStepIndex(2), 250);
      setTimeout(() => setActiveStepIndex(3), 500);
      setTimeout(() => setActiveStepIndex(4), 800);
      setTimeout(() => setActiveStepIndex(5), 1100);

      const res = await fetch(`/api/payouts/${payout.id}/investigate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: chosenScenario }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Investigation failed.");
      }

      await new Promise((resolve) => setTimeout(resolve, 1400));
      setActiveStepIndex(6);

      setInvestigationResult(json.data.investigation);
      setInvestigationState("COMPLETED");
      onPayoutUpdated(json.data.payout, json.message || "Investigation complete!");
    } catch (err: any) {
      alert(err.message || "Investigation failed.");
      setInvestigationState("IDLE");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Re-run Reconciliation
  const handleRerunReconciliation = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch(`/api/payouts/${payout.id}/rerun-reconciliation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to re-run reconciliation");
      }

      setRerunSuccess(true);
      onPayoutUpdated(json.data, json.message || "Reconciliation re-executed!");
    } catch (err: any) {
      alert(err.message || "Reconciliation rerun failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Create Accounting Entry
  const handleCreateEntry = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch(`/api/payouts/${payout.id}/accounting-entry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: "Taksh (Finance Controller)" }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to create accounting entry");
      }

      onPayoutUpdated(json.data, `Accounting entry ${json.data.accountingEntry.entryNumber} created!`);
    } catch (err: any) {
      alert(err.message || "Failed to book accounting entry.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Approve Explanation Submission
  const handleApproveExplanation = async () => {
    if (!explanationText.trim()) {
      setFormError("Reason / Explanation cannot be empty.");
      return;
    }

    try {
      setIsProcessing(true);
      setFormError(null);
      const res = await fetch(`/api/payouts/${payout.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "APPROVE_EXPLANATION",
          explanation: explanationText.trim(),
          evidenceReference: evidenceRefText.trim(),
          user: "Taksh (Finance Controller)",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit review");
      }

      setActiveModal("NONE");
      onPayoutUpdated(json.data, json.message || "Explanation recorded successfully.");
    } catch (err: any) {
      setFormError(err.message || "Failed to submit review.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Request More Evidence
  const handleRequestEvidence = async () => {
    if (!evidenceRequestText.trim()) {
      setFormError("Please specify what evidence is needed.");
      return;
    }

    try {
      setIsProcessing(true);
      setFormError(null);
      const res = await fetch(`/api/payouts/${payout.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REQUEST_EVIDENCE",
          requestedEvidence: evidenceRequestText.trim(),
          user: "Taksh (Finance Controller)",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to request evidence");
      }

      setActiveModal("NONE");
      onPayoutUpdated(json.data, json.message || "Evidence request dispatched.");
    } catch (err: any) {
      setFormError(err.message || "Failed to dispatch request.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Reject / Escalate
  const handleEscalate = async () => {
    if (!escalationText.trim()) {
      setFormError("Please provide an escalation reason or note.");
      return;
    }

    try {
      setIsProcessing(true);
      setFormError(null);
      const res = await fetch(`/api/payouts/${payout.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ESCALATE",
          escalationReason: escalationText.trim(),
          user: "Taksh (Finance Controller)",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to escalate payout");
      }

      setActiveModal("NONE");
      onPayoutUpdated(json.data, json.message || "Payout escalated for investigation.");
    } catch (err: any) {
      setFormError(err.message || "Failed to escalate payout.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.detailContainer}>
      {/* 1. Top Controls & Demo Case Quick Switcher */}
      <div className={styles.topNavRow}>
        <Link href="/payout-truth" className={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Back to All Payouts</span>
        </Link>

        <div className={styles.demoCasePills}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", padding: "0 6px" }}>
            QUICK SWITCH:
          </span>
          <Link
            href="/payout-truth/PO-1024"
            className={`${styles.casePill} ${payout.id === "PO-1024" || payout.id === "PO-RZP-8492" ? styles.casePillActive : ""}`}
          >
            Case A: Reconciled (PO-1024)
          </Link>
          <Link
            href="/payout-truth/PO-1025"
            className={`${styles.casePill} ${payout.id === "PO-1025" || payout.id === "PO-STR-9140" ? styles.casePillActive : ""}`}
          >
            Case B: Discrepancy (PO-1025)
          </Link>
        </div>
      </div>

      {/* 2. Payout Hero Identification Card */}
      <div className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div className={styles.heroLeft}>
            <div className={styles.merchantIcon} style={{ backgroundColor: payout.merchantLogoBg }}>
              {payout.merchantLogoLetter}
            </div>
            <div className={styles.heroTitleGroup}>
              <div className={styles.heroTitleRow}>
                <span className={styles.payoutIdText}>{payout.id}</span>
                <h2 className={styles.merchantHeading}>{payout.merchant}</h2>
              </div>
              <div className={styles.heroSubtext}>
                <span>Settled: {formatDate(payout.date)}</span>
                <span className={styles.dotSep}>•</span>
                <span>Bank: {payout.bankAccount}</span>
                <span className={styles.dotSep}>•</span>
                <span>{payout.transactionsCount} transactions</span>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            {payout.status === "RECONCILED" && (
              <span className={`${styles.statusBadgeLarge} ${styles.badgeReconciled}`}>
                <CheckCircle2 size={14} />
                <span>Reconciled</span>
              </span>
            )}
            {payout.status === "NEEDS_REVIEW" && (
              <>
                {humanReview.resolutionStatus === "ESCALATED" ? (
                  <span className={`${styles.statusBadgeLarge} ${styles.badgeEscalated}`}>
                    <AlertTriangle size={14} />
                    <span>Escalated</span>
                  </span>
                ) : humanReview.resolutionStatus === "EVIDENCE_REQUESTED" ? (
                  <span className={`${styles.statusBadgeLarge} ${styles.badgeUnderReview}`}>
                    <Clock size={14} />
                    <span>Under Review</span>
                  </span>
                ) : humanReview.resolutionStatus === "EXPLAINED" ? (
                  <span className={`${styles.statusBadgeLarge} ${styles.badgeExplained}`}>
                    <FileText size={14} />
                    <span>Explained / Ready for Booking</span>
                  </span>
                ) : (
                  <span className={`${styles.statusBadgeLarge} ${styles.badgeNeedsReview}`}>
                    <ShieldAlert size={14} />
                    <span>Needs Human Review</span>
                  </span>
                )}
              </>
            )}
            {payout.status === "PROCESSING" && (
              <span className={`${styles.statusBadgeLarge} ${styles.badgeProcessing}`}>
                <Clock size={14} />
                <span>Processing</span>
              </span>
            )}
          </div>
        </div>

        {/* Hero Numbers Ribbon */}
        <div className={styles.metricsRibbon}>
          <div className={styles.ribbonItem}>
            <span className={styles.ribbonLabel}>Gross Amount</span>
            <span className={styles.ribbonValue}>{formatINR(breakdown.gross)}</span>
          </div>

          <div className={styles.ribbonItem}>
            <span className={styles.ribbonLabel}>Total Deductions</span>
            <span className={styles.ribbonValue}>
              {formatINR(breakdown.platformFees + breakdown.refunds + breakdown.taxes)}
            </span>
          </div>

          <div className={styles.ribbonItem}>
            <span className={styles.ribbonLabel}>Expected Net</span>
            <span className={styles.ribbonValue}>{formatINR(breakdown.expectedNet)}</span>
          </div>

          <div className={styles.ribbonItem}>
            <span className={styles.ribbonLabel}>Actual Received</span>
            <span className={styles.ribbonValue}>
              {breakdown.actualBank > 0 ? formatINR(breakdown.actualBank) : "Pending Bank Credit"}
            </span>
          </div>

          <div className={styles.ribbonItem}>
            <span className={styles.ribbonLabel}>Difference</span>
            <span
              className={`${styles.ribbonValue} ${
                breakdown.difference > 0 ? styles.ribbonDifferenceMismatch : styles.ribbonDifferenceMatched
              }`}
            >
              {breakdown.difference > 0 ? `-${formatINR(breakdown.difference)}` : "₹0 (Exact Match)"}
            </span>
          </div>
        </div>
      </div>

      {/* 2.5 Structured Reconciliation Breakdown Financial Table */}
      <div className={styles.breakdownCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "6px" }}>
          <div>
            <h3 className={styles.sectionHeading}>Reconciliation Breakdown</h3>
            <p className={styles.sectionSubtitle}>
              Direct comparison between underlying merchant transactions and the actual bank settlement credit.
            </p>
          </div>
          {payout.status === "NEEDS_REVIEW" && (
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-negative)", background: "#FEF2F2", padding: "4px 10px", borderRadius: "6px", border: "1px solid #FECACA" }}>
              {formatINR(breakdown.difference)} Unexplained Variance
            </span>
          )}
        </div>

        <table className={styles.breakdownTable}>
          <tbody>
            <tr>
              <td>
                <div className={styles.breakdownLabelCol}>
                  <span className={styles.breakdownSign}>+</span>
                  <span>Gross Transactions</span>
                  <span className={styles.breakdownSubtext}>({payout.transactionsCount} orders)</span>
                </div>
              </td>
              <td className={styles.breakdownValueCol}>{formatINR(breakdown.gross)}</td>
            </tr>
            <tr>
              <td>
                <div className={styles.breakdownLabelCol}>
                  <span className={styles.breakdownSign}>−</span>
                  <span>Platform Processing Fees</span>
                  <span className={styles.breakdownSubtext}>({breakdown.platformFeeRate})</span>
                </div>
              </td>
              <td className={styles.breakdownValueCol}>-{formatINR(breakdown.platformFees)}</td>
            </tr>
            <tr>
              <td>
                <div className={styles.breakdownLabelCol}>
                  <span className={styles.breakdownSign}>−</span>
                  <span>Customer Refunds &amp; Returns</span>
                  <span className={styles.breakdownSubtext}>({breakdown.refundsCount} claims)</span>
                </div>
              </td>
              <td className={styles.breakdownValueCol}>-{formatINR(breakdown.refunds)}</td>
            </tr>
            <tr>
              <td>
                <div className={styles.breakdownLabelCol}>
                  <span className={styles.breakdownSign}>−</span>
                  <span>Taxes &amp; Statutory Deductions</span>
                  <span className={styles.breakdownSubtext}>({breakdown.taxDetails})</span>
                </div>
              </td>
              <td className={styles.breakdownValueCol}>-{formatINR(breakdown.taxes)}</td>
            </tr>
            {breakdown.adjustments !== 0 && (
              <tr>
                <td>
                  <div className={styles.breakdownLabelCol}>
                    <span className={styles.breakdownSign}>±</span>
                    <span>Platform Adjustments</span>
                  </div>
                </td>
                <td className={styles.breakdownValueCol}>{formatINR(breakdown.adjustments)}</td>
              </tr>
            )}
            <tr className={styles.breakdownExpectedRow}>
              <td>
                <div className={styles.breakdownLabelCol}>
                  <span className={styles.breakdownSign}>=</span>
                  <span>Expected Net Payout</span>
                </div>
              </td>
              <td className={styles.breakdownValueCol}>{formatINR(breakdown.expectedNet)}</td>
            </tr>
            <tr className={styles.breakdownBankRow}>
              <td>
                <div className={styles.breakdownLabelCol}>
                  <Building2 size={15} color="var(--color-primary)" />
                  <span>Actual Bank Received</span>
                  <span className={styles.breakdownSubtext}>({payout.bankAccount})</span>
                </div>
              </td>
              <td className={styles.breakdownValueCol}>{formatINR(breakdown.actualBank)}</td>
            </tr>
            {breakdown.difference !== 0 ? (
              <tr className={styles.breakdownUnexplainedRow}>
                <td>
                  <div className={styles.breakdownLabelCol}>
                    <AlertTriangle size={15} color="var(--color-negative)" />
                    <span>Unexplained Shortfall (Difference)</span>
                  </div>
                </td>
                <td className={styles.breakdownValueCol}>-{formatINR(breakdown.difference)}</td>
              </tr>
            ) : (
              <tr style={{ background: "#F0FDF4", color: "#15803D", fontWeight: 700 }}>
                <td>
                  <div className={styles.breakdownLabelCol}>
                    <CheckCircle2 size={15} color="#15803D" />
                    <span>Difference</span>
                  </div>
                </td>
                <td className={styles.breakdownValueCol} style={{ color: "#15803D" }}>₹0 (100% Explained)</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Mathematical Reconciliation Formula */}
      <div className={styles.calcCard}>
        <h3 className={styles.sectionHeading}>Payout Reconciliation Calculation</h3>
        <p className={styles.sectionSubtitle}>
          Authoritative breakdown showing how FINOVA computes the expected net payout against actual bank credit.
        </p>

        <div className={styles.formulaGrid}>
          {/* Left: Equation breakdown */}
          <div className={styles.equationSide}>
            <div className={styles.equationRow}>
              <span>Gross Customer Payments</span>
              <strong>{formatINR(breakdown.gross)}</strong>
            </div>

            <div className={styles.equationRow}>
              <span>
                <span className={styles.equationSign}>−</span> Platform Processing Fees ({breakdown.platformFeeRate})
              </span>
              <span>{formatINR(breakdown.platformFees)}</span>
            </div>

            <div className={styles.equationRow}>
              <span>
                <span className={styles.equationSign}>−</span> Customer Refunds &amp; Returns ({breakdown.refundsCount} orders)
              </span>
              <span>{formatINR(breakdown.refunds)}</span>
            </div>

            <div className={styles.equationRow}>
              <span>
                <span className={styles.equationSign}>−</span> Statutory Taxes &amp; TDS Withheld
              </span>
              <span>{formatINR(breakdown.taxes)}</span>
            </div>

            {breakdown.adjustments !== 0 && (
              <div className={styles.equationRow}>
                <span>
                  <span className={styles.equationSign}>±</span> Platform Adjustments
                </span>
                <span>{formatINR(breakdown.adjustments)}</span>
              </div>
            )}

            <div className={styles.equationDivider} />

            <div className={styles.expectedNetRow}>
              <span>Expected Net Payout</span>
              <span className="tabular-nums">{formatINR(breakdown.expectedNet)}</span>
            </div>
          </div>

          {/* Center VS pill */}
          <div className={styles.vsPill}>VS</div>

          {/* Right: Bank Comparison */}
          <div className={styles.comparisonSide}>
            <div className={styles.comparisonRow}>
              <span>Actual Bank Received</span>
              <span className={styles.comparisonHighlight}>
                {breakdown.actualBank > 0 ? formatINR(breakdown.actualBank) : "Awaiting Credit"}
              </span>
            </div>

            <div
              className={`${styles.discrepancyBox} ${
                breakdown.difference > 0 ? styles.discrepancyAlert : styles.discrepancyZero
              }`}
            >
              <div className={styles.discrepancyLabel}>
                {breakdown.difference > 0 ? (
                  <>
                    <AlertTriangle size={15} />
                    <span>Unexplained Shortfall</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} />
                    <span>100% Reconciled</span>
                  </>
                )}
              </div>
              <div className={styles.discrepancyVal}>
                {breakdown.difference > 0 ? formatINR(breakdown.difference) : "₹0 Difference"}
              </div>
            </div>

            <span style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
              {breakdown.difference > 0
                ? "FINOVA calculated that your bank account received ₹18,000 less than expected based on contracted fees and verified returns."
                : "Every single rupee from gross orders down to bank credit is accounted for across platform fees, refunds, and taxes."}
            </span>
          </div>
        </div>
      </div>

      {/* 4. "Where Did The Money Go?" Waterfall Visualization */}
      <div className={styles.waterfallCard}>
        <h3 className={styles.sectionHeading}>Where did the money go?</h3>
        <p className={styles.sectionSubtitle}>
          Visual journey of funds from customer checkout to bank settlement.
        </p>

        <div className={styles.flowDiagram}>
          {/* Node 1: Gross Inflow */}
          <div className={styles.nodeGross}>
            <div className={styles.nodeTitle}>
              <CreditCard size={16} />
              <span>Gross Customer Payments</span>
            </div>
            <span className={styles.nodeAmount}>{formatINR(breakdown.gross)}</span>
          </div>

          <div className={styles.flowArrowRow}>
            <ArrowDown size={20} />
          </div>

          {/* Middle Branches: Deductions */}
          <div className={styles.flowBranchGrid}>
            <div className={styles.deductionNode}>
              <div className={styles.deductionTop}>
                <span>Platform Fees</span>
                <span>{breakdown.platformFeeRate}</span>
              </div>
              <span className={styles.deductionAmount}>{formatINR(breakdown.platformFees)}</span>
              <span className={styles.deductionSub}>Gateway pricing tier</span>
            </div>

            <div className={styles.deductionNode}>
              <div className={styles.deductionTop}>
                <span>Customer Refunds</span>
                <span>{breakdown.refundsCount} claims</span>
              </div>
              <span className={styles.deductionAmount}>{formatINR(breakdown.refunds)}</span>
              <span className={styles.deductionSub}>Authorized reversals</span>
            </div>

            <div className={styles.deductionNode}>
              <div className={styles.deductionTop}>
                <span>Statutory Taxes</span>
                <span>GST + TDS</span>
              </div>
              <span className={styles.deductionAmount}>{formatINR(breakdown.taxes)}</span>
              <span className={styles.deductionSub}>{breakdown.taxDetails}</span>
            </div>
          </div>

          <div className={styles.flowArrowRow}>
            <ArrowDown size={20} />
          </div>

          {/* Node 2: Expected Net */}
          <div className={styles.nodeExpected}>
            <div className={styles.nodeTitle}>
              <Receipt size={16} />
              <span>Expected Net Settlement</span>
            </div>
            <span className={styles.nodeAmount}>{formatINR(breakdown.expectedNet)}</span>
          </div>

          <div className={styles.flowArrowRow}>
            <ArrowDown size={20} />
          </div>

          {/* Node 3: Final Settlement Split */}
          {breakdown.difference === 0 ? (
            <div className={styles.nodeBankSuccess}>
              <div className={styles.nodeTitle}>
                <Building2 size={18} />
                <span>Bank Received ({payout.bankAccount})</span>
              </div>
              <span className={styles.nodeAmount}>{formatINR(breakdown.actualBank)}</span>
            </div>
          ) : (
            <div className={styles.bottomSettlementRow}>
              <div className={styles.nodeBankShortfall}>
                <div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
                    Bank Received
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-heading)" }}>
                    {formatINR(breakdown.actualBank)}
                  </div>
                </div>
                <Building2 size={20} color="var(--color-primary)" />
              </div>

              <div className={styles.nodeUnexplainedGap}>
                <div>
                  <div className={styles.gapTitle}>
                    <ShieldAlert size={16} />
                    <span>Unexplained Shortfall</span>
                  </div>
                  <div className={styles.gapAmount}>
                    {formatINR(breakdown.difference)}
                  </div>
                </div>
                <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
          Missing Rupee Gap
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. PHASE 2.2: Autonomous Evidence Engine & Investigation Console */}
      {(payout.status === "NEEDS_REVIEW" || breakdown.adjustments !== 0 || investigationState !== "IDLE") && (
        <div className={styles.investigationCard}>
          <div className={styles.investigationHeader}>
            <div className={styles.investigationTitleRow}>
              <div className={styles.investigationIconBox}>
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className={styles.sectionHeading} style={{ margin: 0 }}>
                  Autonomous Evidence Engine (Phase 2.2)
                </h3>
                <p className={styles.sectionSubtitle} style={{ margin: 0 }}>
                  Investigate discrepancies across gateway dispute logs and reserve withholding agreements.
                </p>
              </div>
            </div>

            {investigationState === "IDLE" && (
              <button
                className={styles.investigateActionBtn}
                disabled={isProcessing}
                onClick={() => handleRunInvestigation(scenario)}
              >
                <Search size={15} />
                <span>Investigate with FINOVA</span>
              </button>
            )}
          </div>

          {/* Stepper Progress when running */}
          {investigationState === "RUNNING" && (
            <div className={styles.stepperContainer}>
              <div className={`${styles.stepItem} ${activeStepIndex >= 1 ? styles.stepDone : ""}`}>
                <span className={`${styles.stepIcon} ${activeStepIndex === 1 ? styles.stepIconSpin : activeStepIndex > 1 ? styles.stepIconDone : styles.stepIconPending}`}>
                  {activeStepIndex > 1 ? <Check size={12} /> : "1"}
                </span>
                <span>Core Transaction Ledger: Auditing order batches #ORD-8812 to #ORD-9992...</span>
              </div>

              <div className={`${styles.stepItem} ${activeStepIndex >= 2 ? styles.stepDone : ""}`}>
                <span className={`${styles.stepIcon} ${activeStepIndex === 2 ? styles.stepIconSpin : activeStepIndex > 2 ? styles.stepIconDone : styles.stepIconPending}`}>
                  {activeStepIndex > 2 ? <Check size={12} /> : "2"}
                </span>
                <span>Settlement Fee File: Verifying 2.00% agreed merchant pricing schedule...</span>
              </div>

              <div className={`${styles.stepItem} ${activeStepIndex >= 3 ? styles.stepDone : ""}`}>
                <span className={`${styles.stepIcon} ${activeStepIndex === 3 ? styles.stepIconSpin : activeStepIndex > 3 ? styles.stepIconDone : styles.stepIconPending}`}>
                  {activeStepIndex > 3 ? <Check size={12} /> : "3"}
                </span>
                <span>Refund Ledger &amp; RMA Authorizations: Reconciling customer return tickets...</span>
              </div>

              <div className={`${styles.stepItem} ${activeStepIndex >= 4 ? styles.stepDone : ""}`}>
                <span className={`${styles.stepIcon} ${activeStepIndex === 4 ? styles.stepIconSpin : activeStepIndex > 4 ? styles.stepIconDone : styles.stepIconPending}`}>
                  {activeStepIndex > 4 ? <Check size={12} /> : "4"}
                </span>
                <span>Gateway Dispute API: Querying chargeback escrows &amp; dispute withholdings...</span>
              </div>

              <div className={`${styles.stepItem} ${activeStepIndex >= 5 ? styles.stepDone : ""}`}>
                <span className={`${styles.stepIcon} ${activeStepIndex === 5 ? styles.stepIconSpin : activeStepIndex > 5 ? styles.stepIconDone : styles.stepIconPending}`}>
                  {activeStepIndex > 5 ? <Check size={12} /> : "5"}
                </span>
                <span>Merchant Policy Engine: Inspecting rolling reserve withholding clauses...</span>
              </div>
            </div>
          )}

          {/* Completed Investigation Card */}
          {investigationState === "COMPLETED" && (
            <div className={styles.conclusionBox}>
              <div className={styles.conclusionHeader}>
                <div>
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", color: "var(--text-heading)", fontWeight: 700 }}>
                    Investigation Findings
                  </h4>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Evaluated across 6 financial evidence domains • {investigationResult?.evidence.length || 7} verification records
                  </span>
                </div>

                {investigationResult?.conclusion === "EXPLAINED" && (
                  <span className={styles.conclusionBadgeExplained}>
                    <CheckCircle2 size={14} />
                    <span>100% Explained</span>
                  </span>
                )}

                {investigationResult?.conclusion === "PARTIALLY_EXPLAINED" && (
                  <span className={styles.conclusionBadgePartial}>
                    <AlertTriangle size={14} />
                    <span>Partially Explained</span>
                  </span>
                )}

                {investigationResult?.conclusion === "UNEXPLAINED" && (
                  <span className={styles.conclusionBadgeUnexplained}>
                    <ShieldAlert size={14} />
                    <span>Unexplained Shortfall</span>
                  </span>
                )}
              </div>

              {/* Verified Dispute Match Details */}
              {investigationResult?.totalEvidenceDiscovered && investigationResult.totalEvidenceDiscovered > 0 ? (
                <div className={styles.evidenceMatchCard}>
                  <div className={styles.evidenceMatchTop}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <CheckCircle2 size={16} color="#15803D" />
                      <strong style={{ fontSize: "13.5px", color: "var(--text-heading)" }}>
                        Discovered Verified Adjustment: {formatINR(investigationResult.totalEvidenceDiscovered)}
                      </strong>
                    </div>

                    <div style={{ display: "flex", gap: "6px" }}>
                      <span className={styles.provenancePill}>
                        Source: {investigationResult.evidence.find(e => e.category === "GATEWAY_DISPUTES")?.source || "Razorpay API"}
                      </span>
                      <span className={styles.provenanceRefBadge}>
                        Ref: {investigationResult.evidence.find(e => e.category === "GATEWAY_DISPUTES")?.reference || "GD-88421"}
                      </span>
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                    {investigationResult.evidence.find(e => e.category === "GATEWAY_DISPUTES")?.detail}
                  </p>
                </div>
              ) : (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "12px 14px", fontSize: "12.5px", color: "#B91C1C" }}>
                  Zero active dispute chargebacks or reserve withholdings matched this batch. Shortfall remains unexplained.
                </div>
              )}

              {/* Rerun Reconciliation Action Row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Remaining Unexplained: <strong style={{ color: investigationResult?.remainingVariance === 0 ? "#15803D" : "var(--color-negative)" }}>{formatINR(investigationResult?.remainingVariance || 0)}</strong>
                  </div>
                </div>

                {payout.status !== "RECONCILED" && (
                  <button
                    className={styles.rerunReconciliationBtn}
                    disabled={isProcessing}
                    onClick={handleRerunReconciliation}
                  >
                    <RefreshCw size={14} />
                    <span>Re-run Reconciliation</span>
                  </button>
                )}
                {payout.status === "RECONCILED" && (
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#15803D", background: "#DCFCE7", padding: "6px 14px", borderRadius: "8px", border: "1px solid #86EFAC" }}>
                    ✓ Reconciled &amp; Ready for Accounting
                  </span>
                )}
              </div>

              {/* Quick Scenario Selector for Testing Cases C & D */}
              <div className={styles.scenarioSelectRow}>
                <span>Demo Test Scenarios:</span>
                <button
                  className={`${styles.scenarioOptionBtn} ${scenario === "FULL" ? styles.scenarioOptionBtnActive : ""}`}
                  onClick={() => {
                    setScenario("FULL");
                    handleRunInvestigation("FULL");
                  }}
                >
                  Full Dispute (₹18k)
                </button>
                <button
                  className={`${styles.scenarioOptionBtn} ${scenario === "PARTIAL" ? styles.scenarioOptionBtnActive : ""}`}
                  onClick={() => {
                    setScenario("PARTIAL");
                    handleRunInvestigation("PARTIAL");
                  }}
                >
                  Partial Dispute (₹10k)
                </button>
                <button
                  className={`${styles.scenarioOptionBtn} ${scenario === "NONE" ? styles.scenarioOptionBtnActive : ""}`}
                  onClick={() => {
                    setScenario("NONE");
                    handleRunInvestigation("NONE");
                  }}
                >
                  No Match (₹0)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5.5 What FINOVA Checked (Evidence Matrix) */}
      <div className={styles.evidenceCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "6px" }}>
          <div>
            <h3 className={styles.sectionHeading}>What FINOVA Checked (Evidence Matrix)</h3>
            <p className={styles.sectionSubtitle}>
              Authoritative evidence verified against internal ledgers, gateway dispute APIs, and reserve policies.
            </p>
          </div>
          {payout.status === "RECONCILED" && breakdown.adjustments !== 0 && (
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#15803D", background: "#DCFCE7", padding: "4px 10px", borderRadius: "6px", border: "1px solid #86EFAC" }}>
              Reconciled via Verified Evidence
            </span>
          )}
        </div>

        <div className={styles.evidenceList}>
          {evidence.map((item) => (
            <div
              key={item.id}
              className={`${styles.evidenceItem} ${
                item.status === "VERIFIED"
                  ? styles.evidenceVerified
                  : item.status === "NO_MATCH"
                  ? styles.evidenceInfo
                  : item.status === "MISMATCHED"
                  ? styles.evidenceMismatched
                  : item.status === "WARNING"
                  ? styles.evidenceWarning
                  : item.status === "NOT_CHECKED"
                  ? styles.evidenceNotChecked
                  : styles.evidenceInfo
              }`}
            >
              <div className={styles.evidenceIconCol}>
                {item.status === "VERIFIED" && <CheckCircle2 size={18} color="var(--color-positive)" />}
                {item.status === "NO_MATCH" && <Check size={18} color="#64748B" />}
                {item.status === "MISMATCHED" && <FileX2 size={18} color="var(--color-negative)" />}
                {item.status === "WARNING" && <AlertTriangle size={18} color="var(--color-warning)" />}
                {item.status === "NOT_CHECKED" && <Clock size={18} color="#94A3B8" />}
                {item.status === "INFO" && <HelpCircle size={18} color="var(--color-primary)" />}
              </div>

              <div className={styles.evidenceContent}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span className={styles.evidenceLabel}>{item.label}</span>
                  {item.status === "NOT_CHECKED" && (
                    <span className={styles.notCheckedTag}>Not checked yet</span>
                  )}
                  {item.status === "NO_MATCH" && (
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748B", background: "#F1F5F9", padding: "2px 8px", borderRadius: "4px", border: "1px solid #CBD5E1" }}>
                      Checked — No Withholdings
                    </span>
                  )}
                  {item.source && (
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", background: "var(--bg-surface)", padding: "1px 6px", borderRadius: "4px", border: "1px solid var(--border-subtle)" }}>
                      Source: {item.source}
                    </span>
                  )}
                  {item.reference && (
                    <span style={{ fontSize: "11px", fontFamily: "var(--font-mono, monospace)", color: "#1D4ED8", background: "#EFF6FF", padding: "1px 6px", borderRadius: "4px", border: "1px solid #BFDBFE" }}>
                      Ref: {item.reference}
                    </span>
                  )}
                </div>
                <p className={styles.evidenceDetail}>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Human Review Required Panel (For Case B / NEEDS_REVIEW) */}
      {humanReview.required && (
        <div className={styles.humanReviewCard}>
          <div className={styles.reviewHeader}>
            <div className={styles.reviewTitleGroup}>
              <div className={styles.reviewIconBox}>
                <ShieldAlert size={20} />
              </div>
              <h3 className={styles.reviewTitle}>Human Review Required</h3>
            </div>

            <span className={`${styles.statusBadgeLarge} ${
              humanReview.resolutionStatus === "ESCALATED"
                ? styles.badgeEscalated
                : humanReview.resolutionStatus === "EVIDENCE_REQUESTED"
                ? styles.badgeUnderReview
                : humanReview.resolutionStatus === "EXPLAINED"
                ? styles.badgeExplained
                : styles.badgeNeedsReview
            }`}>
              {humanReview.resolutionStatus === "ESCALATED" && "Escalated for Audit"}
              {humanReview.resolutionStatus === "EVIDENCE_REQUESTED" && "Evidence Requested"}
              {humanReview.resolutionStatus === "EXPLAINED" && "Explanation Recorded"}
              {humanReview.resolutionStatus === "PENDING" && "Action Required"}
            </span>
          </div>

          <p style={{ margin: "0 0 16px 0", fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            FINOVA cannot safely create an accounting entry until the {formatINR(breakdown.difference)} variance is explained.
          </p>

          {/* Principle Banner */}
          <div className={styles.principleBanner}>
            <Sparkles size={16} />
            <span>&ldquo;FINOVA refuses to book what it cannot explain.&rdquo;</span>
          </div>

          {/* 3-Item Review Grid */}
          <div className={styles.reviewGrid}>
            <div className={styles.reviewBox}>
              <span className={styles.reviewBoxLabel}>What FINOVA Expected</span>
              <p className={styles.reviewBoxText}>{humanReview.whatFinovaExpected}</p>
            </div>

            <div className={styles.reviewBox}>
              <span className={styles.reviewBoxLabel}>What the Bank Actually Received</span>
              <p className={styles.reviewBoxText}>{humanReview.whatFinovaFound}</p>
            </div>

            <div className={styles.reviewBox} style={{ borderLeft: "3px solid var(--color-negative)" }}>
              <span className={styles.reviewBoxLabel}>Difference</span>
              <p className={styles.reviewBoxText} style={{ fontWeight: 700, color: "var(--color-negative)", fontSize: "15px" }}>
                {humanReview.differenceSummary}
              </p>
            </div>
          </div>

          {/* Why FINOVA will not book */}
          <div className={styles.reasonCard}>
            <div className={styles.reasonHeading}>
              <AlertTriangle size={14} />
              <span>Why FINOVA cannot safely create an accounting entry</span>
            </div>
            <p className={styles.reasonText}>{humanReview.reasonNotConfident}</p>
          </div>

          {/* Review Decision Actions */}
          {humanReview.resolutionStatus === "PENDING" ? (
            <div>
              <div className={styles.reviewActionsRow}>
                <button
                  className={styles.approveBtn}
                  disabled={isProcessing}
                  onClick={() => {
                    setFormError(null);
                    setActiveModal("APPROVE");
                  }}
                >
                  <Check size={14} />
                  <span>Approve Explanation</span>
                </button>

                <button
                  className={styles.evidenceBtn}
                  disabled={isProcessing}
                  onClick={() => {
                    setFormError(null);
                    setActiveModal("REQUEST_EVIDENCE");
                  }}
                >
                  <Send size={14} />
                  <span>Request More Evidence</span>
                </button>

                <button
                  className={styles.rejectBtn}
                  disabled={isProcessing}
                  onClick={() => {
                    setFormError(null);
                    setActiveModal("ESCALATE");
                  }}
                >
                  <AlertTriangle size={14} />
                  <span>Reject / Escalate</span>
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.reviewOutcomeBanner}>
              <CheckCircle2 size={18} color="var(--color-primary)" />
              <div className={styles.reviewOutcomeDetails}>
                <strong>Decision Recorded: </strong>
                <span>
                  {humanReview.resolutionStatus === "EXPLAINED" && "Explanation submitted. Payout marked as Explained — Pending Phase 2.2 evidence verification."}
                  {humanReview.resolutionStatus === "ESCALATED" && "Settlement escalated for formal gateway dispute / senior controller audit."}
                  {humanReview.resolutionStatus === "EVIDENCE_REQUESTED" && "Itemized evidence requested from payment gateway API."}
                </span>
                {humanReview.reviewerNote && (
                  <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
                    <strong>Note:</strong> {humanReview.reviewerNote}
                  </p>
                )}
                {humanReview.evidenceReference && (
                  <span className={styles.outcomeReference}>
                    <strong>Reference:</strong> {humanReview.evidenceReference}
                  </span>
                )}
              </div>

              <button
                className={styles.reopenReviewBtn}
                onClick={() => {
                  setFormError(null);
                  setActiveModal("APPROVE");
                }}
              >
                Change Decision
              </button>
            </div>
          )}
        </div>
      )}

      {/* 7. Accounting Entry Section: Reconciled or Guardrail Blocked */}
      {payout.status === "RECONCILED" ? (
        <div className={styles.reconciledActionCard}>
          <div className={styles.reconciledBanner}>
            <div className={styles.reconciledPillGroup}>
              <span className={styles.reconciledCheck}>
                <CheckCircle2 size={16} />
                <span>Payout Fully Reconciled</span>
              </span>
              <span className={styles.reconciledCheck}>
                <CheckCircle2 size={16} />
                <span>Every Rupee Explained</span>
              </span>
              <span className={styles.reconciledCheck}>
                <CheckCircle2 size={16} />
                <span>Zero Anomaly Gap</span>
              </span>
            </div>

            {!accountingEntry.created && (
              <button
                className={styles.bookEntryBtn}
                disabled={isProcessing}
                onClick={handleCreateEntry}
              >
                <FileCheck2 size={16} />
                <span>Create Accounting Entry</span>
              </button>
            )}
          </div>

          {/* Confirmation & General Ledger Breakdown */}
          {accountingEntry.created && (
            <div className={styles.entryConfirmationBox}>
              <div className={styles.entryConfirmationHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle2 size={20} color="var(--color-positive)" />
                  <div>
                    <strong style={{ fontSize: "15px", color: "var(--text-heading)" }}>
                      Accounting Entry Created &amp; Posted to Ledger
                    </strong>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      Created by {accountingEntry.createdBy} on {formatDate(accountingEntry.createdAt || "")}
                    </div>
                  </div>
                </div>

                <span className={styles.entryNumberBadge}>
                  VOUCHER: {accountingEntry.entryNumber}
                </span>
              </div>

              {/* Double-Entry Ledger Lines */}
              <table className={styles.entryTable}>
                <thead>
                  <tr>
                    <th>Account Code</th>
                    <th>Account Name</th>
                    <th style={{ textAlign: "right" }}>Debit (₹)</th>
                    <th style={{ textAlign: "right" }}>Credit (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {accountingEntry.lines.map((line, idx) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{line.accountCode}</td>
                      <td>{line.accountName}</td>
                      <td className={styles.debitAmount}>
                        {line.type === "DEBIT" ? `₹${line.amount.toLocaleString("en-IN")}` : "—"}
                      </td>
                      <td className={styles.creditAmount}>
                        {line.type === "CREDIT" ? `₹${line.amount.toLocaleString("en-IN")}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.guardrailBlockedCard}>
          <div className={styles.guardrailIcon}>
            <ShieldAlert size={18} />
          </div>
          <div className={styles.guardrailContent}>
            <h4>Accounting Entry Blocked (FINOVA Safety Guardrail)</h4>
            <p>
              &ldquo;FINOVA refuses to book what it cannot explain.&rdquo; Ledger entries are mathematically locked for {payout.id} because a variance of {formatINR(breakdown.difference)} remains unexplained. Even with a human review recorded, double-entry vouchers cannot be posted until verified in Phase 2.2.
            </p>
          </div>
        </div>
      )}

      {/* 8. Audit-Friendly Review Activity Timeline */}
      <div className={styles.reviewActivityCard}>
        <h3 className={styles.sectionHeading}>Review Activity &amp; Audit Trail</h3>
        <p className={styles.sectionSubtitle}>
          Verifiable sequence of automated checks and human controller actions.
        </p>

        <div className={styles.timelineContainer}>
          {accountingEntry.auditLog.map((log, idx) => (
            <div key={idx} className={styles.timelineItem}>
              <div className={`${styles.timelineNode} ${idx === accountingEntry.auditLog.length - 1 ? styles.timelineNodeActive : ""}`}>
                {log.action.includes("DISCREPANCY") || log.action.includes("ESCALATED") ? (
                  <AlertTriangle size={15} color="var(--color-negative)" />
                ) : log.action.includes("RECONCILIATION") || log.action.includes("EXPLANATION") ? (
                  <CheckCircle2 size={15} color="var(--color-positive)" />
                ) : (
                  <History size={15} />
                )}
              </div>
              <div className={styles.timelineBody}>
                <div className={styles.timelineHeader}>
                  <span className={styles.timelineTitle}>{log.actor} — {log.action.replace(/_/g, " ")}</span>
                  <span className={styles.timelineTime}>
                    {new Date(log.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                </div>
                <p className={styles.timelineDesc}>{log.details}</p>
              </div>
            </div>
          ))}

          {/* Transparent Roadmap for Future Phase 2.2 Milestones */}
          {payout.status === "NEEDS_REVIEW" && (
            <>
              <div className={styles.timelineItem}>
                <div className={`${styles.timelineNode} ${styles.timelineNodeFuture}`}>
                  <Clock size={15} />
                </div>
                <div className={styles.timelineBody}>
                  <div className={styles.timelineHeader}>
                    <span className={styles.timelineTitle} style={{ color: "#64748B" }}>
                      Autonomous Evidence Agent (Phase 2.2)
                    </span>
                    <span className={styles.timelineFutureBadge}>NEXT PHASE</span>
                  </div>
                  <p className={styles.timelineDesc}>
                    Automated gateway API dispute query and merchant contract clause inspection.
                  </p>
                </div>
              </div>

              <div className={styles.timelineItem}>
                <div className={`${styles.timelineNode} ${styles.timelineNodeFuture}`}>
                  <FileCheck2 size={15} />
                </div>
                <div className={styles.timelineBody}>
                  <div className={styles.timelineHeader}>
                    <span className={styles.timelineTitle} style={{ color: "#64748B" }}>
                      General Ledger Voucher Posting
                    </span>
                    <span className={styles.timelineFutureBadge}>PENDING PROOF</span>
                  </div>
                  <p className={styles.timelineDesc}>
                    Final posting to merchant clearing ledger once every rupee is mathematically resolved.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL 1: Approve Explanation */}
      {activeModal === "APPROVE" && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal("NONE")}>
          <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <div className={styles.modalIconCircle}>
                  <Check size={20} />
                </div>
                <div>
                  <h3 className={styles.modalTitle}>Approve Payout Explanation</h3>
                  <p className={styles.modalSubtitle}>
                    Provide explanation for why {payout.id} differs from the expected amount.
                  </p>
                </div>
              </div>
              <button className={styles.modalCloseBtn} onClick={() => setActiveModal("NONE")}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>
                  Reason / Explanation <span className={styles.modalRequiredStar}>*</span>
                </label>
                <textarea
                  className={styles.modalTextarea}
                  placeholder="Explain why this payout differs from the expected amount, e.g., Gateway withheld ₹18,000 rolling reserve for international card transactions."
                  value={explanationText}
                  onChange={(e) => {
                    setExplanationText(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  rows={4}
                />
                {formError && (
                  <div className={styles.modalErrorText}>
                    <AlertTriangle size={13} />
                    <span>{formError}</span>
                  </div>
                )}
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>
                  Optional Evidence / Reference
                </label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="e.g., Ticket #RZP-9912 or Dispute Memo #DM-402"
                  value={evidenceRefText}
                  onChange={(e) => setEvidenceRefText(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalCancelBtn}
                disabled={isProcessing}
                onClick={() => setActiveModal("NONE")}
              >
                Cancel
              </button>
              <button
                className={styles.modalSubmitBtn}
                disabled={isProcessing}
                onClick={handleApproveExplanation}
              >
                <Check size={14} />
                <span>{isProcessing ? "Submitting..." : "Submit Review"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Request More Evidence */}
      {activeModal === "REQUEST_EVIDENCE" && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal("NONE")}>
          <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <div className={styles.modalIconCircle}>
                  <Send size={18} />
                </div>
                <div>
                  <h3 className={styles.modalTitle}>Request More Evidence</h3>
                  <p className={styles.modalSubtitle}>
                    Specify what gateway evidence or documentation is needed.
                  </p>
                </div>
              </div>
              <button className={styles.modalCloseBtn} onClick={() => setActiveModal("NONE")}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>
                  What evidence is needed? <span className={styles.modalRequiredStar}>*</span>
                </label>
                <textarea
                  className={styles.modalTextarea}
                  placeholder="e.g., Request itemized fee breakdown for July 2026 settlements and chargeback notice."
                  value={evidenceRequestText}
                  onChange={(e) => {
                    setEvidenceRequestText(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  rows={4}
                />
                {formError && (
                  <div className={styles.modalErrorText}>
                    <AlertTriangle size={13} />
                    <span>{formError}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalCancelBtn}
                disabled={isProcessing}
                onClick={() => setActiveModal("NONE")}
              >
                Cancel
              </button>
              <button
                className={styles.modalSubmitBtn}
                disabled={isProcessing}
                onClick={handleRequestEvidence}
              >
                <Send size={14} />
                <span>{isProcessing ? "Sending..." : "Submit Request"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Reject / Escalate */}
      {activeModal === "ESCALATE" && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal("NONE")}>
          <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <div className={`${styles.modalIconCircle} ${styles.modalIconCircleDanger}`}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className={styles.modalTitle}>Escalate Payout for Investigation</h3>
                  <p className={styles.modalSubtitle}>
                    Escalate this payout for further investigation? This will flag the exception as critical.
                  </p>
                </div>
              </div>
              <button className={styles.modalCloseBtn} onClick={() => setActiveModal("NONE")}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>
                  Escalation Reason / Notes <span className={styles.modalRequiredStar}>*</span>
                </label>
                <textarea
                  className={styles.modalTextarea}
                  placeholder="e.g., ₹18,000 shortfall not authorized in merchant agreement. Escalate to Gateway Operations Lead."
                  value={escalationText}
                  onChange={(e) => {
                    setEscalationText(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  rows={4}
                />
                {formError && (
                  <div className={styles.modalErrorText}>
                    <AlertTriangle size={13} />
                    <span>{formError}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalCancelBtn}
                disabled={isProcessing}
                onClick={() => setActiveModal("NONE")}
              >
                Cancel
              </button>
              <button
                className={styles.modalSubmitBtnDanger}
                disabled={isProcessing}
                onClick={handleEscalate}
              >
                <AlertTriangle size={14} />
                <span>{isProcessing ? "Escalating..." : "Escalate"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
