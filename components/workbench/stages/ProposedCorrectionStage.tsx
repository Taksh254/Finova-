"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Check,
} from "lucide-react";
import styles from "./ProposedCorrectionStage.module.css";

interface ProposedCorrectionStageProps {
  selectedId: string;
  onSelectException: (id: string) => void;
  onApproveEntry: () => void;
  onReject?: () => void;
}

export function ProposedCorrectionStage({
  selectedId,
  onSelectException,
  onApproveEntry,
  onReject,
}: ProposedCorrectionStageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [approvedState, setApprovedState] = useState(false);

  const isDuplicate = selectedId === "exc-duplicate";

  const handleApprove = () => {
    setApprovedState(true);
    setTimeout(() => {
      onApproveEntry();
    }, 400);
  };

  if (isDuplicate) {
    return (
      <div className={styles.container}>
        <div className={styles.stageHeaderRow}>
          <div>
            <span className={styles.stageEyebrow}>4/9 Proposed correction</span>
            <h1 className={styles.stageTitle}>Duplicate payment safety guardrail</h1>
            <p className={styles.stageSubtitle}>
              Protection against erroneous automatic booking
            </p>
          </div>
        </div>

        <div className={styles.duplicateWarningCard}>
          <div className={styles.dupWarningTop}>
            <ShieldAlert size={28} className={styles.dupIcon} />
            <h2 className={styles.dupTitle}>Potential duplicate payment detected</h2>
          </div>

          <div className={styles.dupBody}>
            Bank transaction <strong>₹50,000</strong> on Sep 18, 2026 matches an identical debited charge
            from Sep 05, 2026 for <strong>Amazon Web Services (AWS-88192)</strong>.
          </div>

          <div className={styles.dupSafetyCallout}>
            <strong>Safety Guardrail Active:</strong> The AI Agent is strictly prohibited from proposing or
            booking journal entries for potential duplicate charges. Only manual resolution or vendor dispute
            is allowed.
          </div>

          <div className={styles.dupActions}>
            <button
              type="button"
              className={styles.resolveDupBtn}
              onClick={() => alert("Flagged as duplicate. Dispute ticket opened with AWS Billing.")}
            >
              Resolve as duplicate & dispute
            </button>
            <button
              type="button"
              className={styles.switchExcBtn}
              onClick={() => onSelectException("exc-cloudflare")}
            >
              Switch to Cloudflare exception →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.stageHeaderRow}>
        <div>
          <span className={styles.stageEyebrow}>4/9 Proposed correction</span>
          <h1 className={styles.stageTitle}>AI proposed entry & safety verification</h1>
          <p className={styles.stageSubtitle}>
            Agent proposed matching bank debit with Vendor Invoice #CF-928374
          </p>
        </div>
      </div>

      {/* Main Correction Card */}
      <div className={styles.correctionCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleGroup}>
            <span className={styles.cardTitle}>Proposed Journal Entry</span>
            <span className={styles.balancedBadge}>
              <CheckCircle2 size={13} strokeWidth={2.5} />
              <span>Balanced (Dr = Cr)</span>
            </span>
          </div>
          <span className={styles.memoSnippet}>Period: September 2026 • Entity: US Corp</span>
        </div>

        {/* Journal Entry Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.journalTable}>
            <thead>
              <tr>
                <th>Account</th>
                <th>Type</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Memo / Reference</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className={styles.accountCode}>6110</span>
                  <span className={styles.accountName}>Software Expense</span>
                </td>
                <td>
                  <span className={styles.typePillDr}>Debit</span>
                </td>
                <td>
                  <span className={styles.amountDr}>₹1,00,000.00</span>
                </td>
                <td>
                  <span style={{ color: "var(--text-editorial-muted)" }}>—</span>
                </td>
                <td className={styles.memoCell}>
                  Cloudflare Pro plan — Aug/Sep 2026 (Inv #CF-928374)
                </td>
              </tr>
              <tr>
                <td>
                  <span className={styles.accountCode}>1001</span>
                  <span className={styles.accountName}>Operating Bank (HDFC)</span>
                </td>
                <td>
                  <span className={styles.typePillCr}>Credit</span>
                </td>
                <td>
                  <span style={{ color: "var(--text-editorial-muted)" }}>—</span>
                </td>
                <td>
                  <span className={styles.amountCr}>₹1,00,000.00</span>
                </td>
                <td className={styles.memoCell}>
                  Auto-debit bank reference TXN-928374
                </td>
              </tr>
              <tr className={styles.totalsRow}>
                <td>Total</td>
                <td>—</td>
                <td className={styles.amountDr}>₹1,00,000.00</td>
                <td className={styles.amountCr}>₹1,00,000.00</td>
                <td style={{ color: "var(--color-cleared-green)", fontSize: "12px" }}>
                  Net Difference: ₹0.00
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Guardrails (5/5 Passed) */}
        <div className={styles.guardrailsSection}>
          <div className={styles.guardrailsHeader}>
            <h3 className={styles.guardrailsTitle}>Deterministic checks</h3>
            <span className={styles.guardrailsPassedCount}>5 of 5 passed</span>
          </div>

          <div className={styles.checksGrid}>
            <div className={styles.checkCard}>
              <CheckCircle2 size={16} className={styles.checkIcon} strokeWidth={2.5} />
              <div className={styles.checkDetails}>
                <span className={styles.checkName}>Balanced entry</span>
                <span className={styles.checkDesc}>
                  Total debits equal total credits (₹1,00,000 = ₹1,00,000). Net diff ₹0.00.
                </span>
              </div>
            </div>

            <div className={styles.checkCard}>
              <CheckCircle2 size={16} className={styles.checkIcon} strokeWidth={2.5} />
              <div className={styles.checkDetails}>
                <span className={styles.checkName}>Invoice verified</span>
                <span className={styles.checkDesc}>
                  Vendor invoice CF-928374 on file, unbooked, and mathematically matches bank debit.
                </span>
              </div>
            </div>

            <div className={styles.checkCard}>
              <CheckCircle2 size={16} className={styles.checkIcon} strokeWidth={2.5} />
              <div className={styles.checkDetails}>
                <span className={styles.checkName}>Allowed accounts</span>
                <span className={styles.checkDesc}>
                  Account 6110 is active in Chart of Accounts and permitted for SaaS subscriptions.
                </span>
              </div>
            </div>

            <div className={styles.checkCard}>
              <CheckCircle2 size={16} className={styles.checkIcon} strokeWidth={2.5} />
              <div className={styles.checkDetails}>
                <span className={styles.checkName}>Accounting period open</span>
                <span className={styles.checkDesc}>
                  September 2026 is currently open for transaction posting.
                </span>
              </div>
            </div>

            <div className={styles.checkCard} style={{ gridColumn: "span 2" }}>
              <CheckCircle2 size={16} className={styles.checkIcon} strokeWidth={2.5} />
              <div className={styles.checkDetails}>
                <span className={styles.checkName}>No duplicate entry</span>
                <span className={styles.checkDesc}>
                  Hash check verified zero existing GL records matching bank reference TXN-928374 or invoice CF-928374.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className={styles.actionsBar}>
        <div className={styles.leftActions}>
          <button
            type="button"
            className={styles.rejectBtn}
            onClick={() => {
              if (onReject) onReject();
              else alert("Proposal rejected. Transaction remains in exception queue.");
            }}
          >
            Reject proposal
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel edit" : "Edit entry"}
          </button>
        </div>

        <button
          type="button"
          className={styles.approveBtn}
          onClick={handleApprove}
        >
          {approvedState ? (
            <>
              <Check size={16} />
              <span>Entry approved</span>
            </>
          ) : (
            <>
              <span>Approve this entry</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
