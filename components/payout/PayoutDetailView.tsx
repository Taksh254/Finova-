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
} from "lucide-react";
import { PayoutDetail } from "@/lib/finance/payoutService";
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
  const [reviewNote, setReviewNote] = useState("");
  const [showReviewInput, setShowReviewInput] = useState(false);

  const { breakdown, evidence, humanReview, accountingEntry } = payout;

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

  // Handle Human Review Submission
  const handleReviewAction = async (action: "APPROVE_RESOLUTION" | "REJECT" | "REQUEST_EVIDENCE") => {
    try {
      setIsProcessing(true);
      const res = await fetch(`/api/payouts/${payout.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          note: reviewNote,
          user: "Taksh (Finance Controller)",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit review");
      }

      setShowReviewInput(false);
      onPayoutUpdated(json.data, json.message || "Review decision recorded.");
    } catch (err: any) {
      alert(err.message || "Failed to process review.");
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
              <span className={`${styles.statusBadgeLarge} ${styles.badgeNeedsReview}`}>
                <ShieldAlert size={14} />
                <span>Needs Review</span>
              </span>
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

      {/* 5. Reconciliation Evidence Checked */}
      <div className={styles.evidenceCard}>
        <h3 className={styles.sectionHeading}>Reconciliation Evidence Checked</h3>
        <p className={styles.sectionSubtitle}>
          FINOVA verified every underlying ledger entry, tax rule, and bank log before reaching a verdict.
        </p>

        <div className={styles.evidenceList}>
          {evidence.map((item) => (
            <div
              key={item.id}
              className={`${styles.evidenceItem} ${
                item.status === "VERIFIED"
                  ? styles.evidenceVerified
                  : item.status === "MISMATCHED"
                  ? styles.evidenceMismatched
                  : item.status === "WARNING"
                  ? styles.evidenceWarning
                  : styles.evidenceInfo
              }`}
            >
              <div className={styles.evidenceIconCol}>
                {item.status === "VERIFIED" && <CheckCircle2 size={18} color="var(--color-positive)" />}
                {item.status === "MISMATCHED" && <FileX2 size={18} color="var(--color-negative)" />}
                {item.status === "WARNING" && <AlertTriangle size={18} color="var(--color-warning)" />}
                {item.status === "INFO" && <Clock size={18} color="var(--color-primary)" />}
              </div>

              <div className={styles.evidenceContent}>
                <span className={styles.evidenceLabel}>{item.label}</span>
                <p className={styles.evidenceDetail}>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Human Review Required Box (For Case B / Mismatched) */}
      {humanReview.required && (
        <div className={styles.humanReviewCard}>
          <div className={styles.reviewHeader}>
            <div className={styles.reviewTitleGroup}>
              <div className={styles.reviewIconBox}>
                <ShieldAlert size={20} />
              </div>
              <h3 className={styles.reviewTitle}>{humanReview.title}</h3>
            </div>

            <span className={`${styles.statusBadgeLarge} ${styles.badgeNeedsReview}`}>
              Action Required
            </span>
          </div>

          {/* Principle Banner */}
          <div className={styles.principleBanner}>
            <Sparkles size={16} />
            <span>&ldquo;FINOVA refuses to book what it cannot explain.&rdquo;</span>
          </div>

          {/* 4-Item Review Grid */}
          <div className={styles.reviewGrid}>
            <div className={styles.reviewBox}>
              <span className={styles.reviewBoxLabel}>What FINOVA Expected</span>
              <p className={styles.reviewBoxText}>{humanReview.whatFinovaExpected}</p>
            </div>

            <div className={styles.reviewBox}>
              <span className={styles.reviewBoxLabel}>What FINOVA Actually Found</span>
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
              <span>Why FINOVA is not confident enough to book this entry</span>
            </div>
            <p className={styles.reasonText}>{humanReview.reasonNotConfident}</p>
          </div>

          {/* Review Decision Buttons */}
          {humanReview.resolutionStatus === "PENDING" ? (
            <div>
              <div className={styles.reviewActionsRow}>
                <button
                  className={styles.approveBtn}
                  disabled={isProcessing}
                  onClick={() => handleReviewAction("APPROVE_RESOLUTION")}
                >
                  <Check size={14} />
                  <span>Approve Resolution (Dispute Account)</span>
                </button>

                <button
                  className={styles.rejectBtn}
                  disabled={isProcessing}
                  onClick={() => handleReviewAction("REJECT")}
                >
                  <X size={14} />
                  <span>Reject Settlement</span>
                </button>

                <button
                  className={styles.evidenceBtn}
                  disabled={isProcessing}
                  onClick={() => handleReviewAction("REQUEST_EVIDENCE")}
                >
                  <Send size={14} />
                  <span>Request More Evidence</span>
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.reviewOutcomeBanner}>
              <CheckCircle2 size={18} color="var(--color-positive)" />
              <div>
                <strong>Resolution Logged: </strong>
                <span>
                  {humanReview.resolutionStatus === "APPROVED" && "Discrepancy approved for booking to Disputed Gateway Receivables (Account #1490)."}
                  {humanReview.resolutionStatus === "REJECTED" && "Settlement rejected. Automatic formal dispute notice issued to gateway partner."}
                  {humanReview.resolutionStatus === "EVIDENCE_REQUESTED" && "Evidence webhook query dispatched. Awaiting itemized gateway trace."}
                </span>
                {humanReview.reviewerNote && (
                  <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
                    Note: {humanReview.reviewerNote}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. Successful Reconciled CTA & Accounting Entry Creation (For Case A) */}
      {(!humanReview.required || humanReview.resolutionStatus === "APPROVED") && (
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

              {/* Immutable Audit Log Stream */}
              <div className={styles.auditLogCard}>
                <div className={styles.auditLogHeading}>
                  <History size={14} />
                  <span>Immutable FINOVA Audit Trail</span>
                </div>

                {accountingEntry.auditLog.map((log, idx) => (
                  <div key={idx} className={styles.auditLogItem}>
                    <span className={styles.auditTimestamp}>
                      {new Date(log.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                    <span className={styles.auditActor}>{log.actor}</span>
                    <span className={styles.auditDetails}>{log.details}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
