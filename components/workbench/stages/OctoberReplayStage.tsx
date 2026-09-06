"use client";

import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  FileCheck,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import styles from "./OctoberReplayStage.module.css";

interface OctoberReplayStageProps {
  onViewAuditTrail: () => void;
}

export function OctoberReplayStage({ onViewAuditTrail }: OctoberReplayStageProps) {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.stageHeaderRow}>
        <div>
          <span className={styles.stageEyebrow}>7/9 Next-month replay (October 2026)</span>
          <h1 className={styles.stageTitle}>Next-month runtime execution</h1>
          <p className={styles.stageSubtitle}>
            Simulating policy execution against incoming October 2026 transactions
          </p>
        </div>

        <div className={styles.policyVersionBadge}>
          <ShieldCheck size={15} />
          <span>Active Policy: Cloudflare Recurring v1.0</span>
        </div>
      </div>

      {/* 3 Scenarios Grid */}
      <div className={styles.cardsGrid}>
        {/* Scenario 1: Auto Cleared */}
        <div className={styles.replayCard}>
          <div className={styles.cardHeaderCleared}>
            <span className={styles.txDateBadge}>Oct 03, 2026</span>
            <span className={styles.statusCleared}>
              <CheckCircle2 size={12} strokeWidth={2.5} />
              <span>Auto-cleared</span>
            </span>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.vendorRow}>
              <span className={styles.vendorName}>CLOUDFLARE*PRO</span>
              <span className={styles.amount}>₹1,25,000.00</span>
            </div>

            <div className={styles.invoiceMeta}>
              <FileCheck size={14} style={{ color: "var(--color-cleared-green)" }} />
              <span>Invoice #CF-981204 verified</span>
            </div>

            <div className={styles.reasonBox}>
              <strong>Cleared by Policy v1.0:</strong> Amount ≤ ₹1,50,000, US entity, USD, valid
              invoice attached. Automatically posted to GL 6110 without human intervention.
            </div>
          </div>
        </div>

        {/* Scenario 2: Blocked - Exceeds Limit */}
        <div className={styles.replayCard}>
          <div className={styles.cardHeaderBlockedLimit}>
            <span className={styles.txDateBadge}>Oct 14, 2026</span>
            <span className={styles.statusBlockedLimit}>
              <AlertTriangle size={12} strokeWidth={2.5} />
              <span>Blocked (Limit)</span>
            </span>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.vendorRow}>
              <span className={styles.vendorName}>CLOUDFLARE*PRO</span>
              <span className={styles.amount}>₹7,00,000.00</span>
            </div>

            <div className={styles.invoiceMeta}>
              <FileCheck size={14} style={{ color: "#a7540d" }} />
              <span>Invoice #CF-983110 verified</span>
            </div>

            <div className={styles.reasonBox}>
              <strong>Boundary Triggered:</strong> ₹7,00,000 exceeds ₹1,50,000 threshold.
              Automation halted. Routed to Controller Exception Queue for manual review.
            </div>
          </div>
        </div>

        {/* Scenario 3: Blocked - Missing Invoice */}
        <div className={styles.replayCard}>
          <div className={styles.cardHeaderBlockedInvoice}>
            <span className={styles.txDateBadge}>Oct 21, 2026</span>
            <span className={styles.statusBlockedInvoice}>
              <ShieldAlert size={12} strokeWidth={2.5} />
              <span>Blocked (Missing Inv)</span>
            </span>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.vendorRow}>
              <span className={styles.vendorName}>CLOUDFLARE*PRO</span>
              <span className={styles.amount}>₹1,25,000.00</span>
            </div>

            <div className={styles.invoiceMeta}>
              <FileQuestion size={14} style={{ color: "var(--color-exception-red)" }} />
              <span>No invoice attached on file</span>
            </div>

            <div className={styles.reasonBox}>
              <strong>Deterministic Check Failed:</strong> Required source invoice missing. AI is
              forbidden from posting unbacked debits. Flagged to controller.
            </div>
          </div>
        </div>
      </div>

      {/* Summary Callout Banner */}
      <div className={styles.summaryCallout}>
        <div className={styles.summaryLeft}>
          <div className={styles.summaryBadge}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className={styles.summaryTitle}>
              Real-world Policy Replay: 1 Auto-cleared, 2 Safely Blocked
            </div>
            <div className={styles.summarySub}>
              Zero unchecked AI bookings. Strict boundary containment guaranteed.
            </div>
          </div>
        </div>

        <button
          type="button"
          className={styles.viewAuditBtn}
          onClick={onViewAuditTrail}
        >
          <span>View full audit trail</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
