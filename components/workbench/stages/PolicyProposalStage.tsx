"use client";

import React from "react";
import { ArrowRight, AlertTriangle, ShieldCheck, FileCheck } from "lucide-react";
import styles from "./PolicyProposalStage.module.css";

interface PolicyProposalStageProps {
  onBacktestPolicy: () => void;
}

export function PolicyProposalStage({ onBacktestPolicy }: PolicyProposalStageProps) {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.stageHeaderRow}>
        <div>
          <span className={styles.stageEyebrow}>5/9 Policy proposal</span>
          <h1 className={styles.stageTitle}>Codify resolution into automated policy</h1>
          <p className={styles.stageSubtitle}>
            Entry approved for September 2026. FINOVA detected recurring SaaS pattern.
          </p>
        </div>
      </div>

      {/* Main Policy Card */}
      <div className={styles.policyCard}>
        <div className={styles.policyCardHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.policyStatusBadge}>
              <ShieldCheck size={14} />
              <span>Draft Policy Proposal</span>
            </span>
          </div>
          <span className={styles.policyVersion}>Target: v1.0-draft</span>
        </div>

        <div className={styles.policyBody}>
          <div className={styles.policyTitleGroup}>
            <h2 className={styles.policyName}>Cloudflare recurring software expense</h2>
            <span className={styles.policyDesc}>
              Automatically reconcile and post recurring Cloudflare invoices within deterministic boundaries.
            </span>
          </div>

          {/* Logic Box */}
          <div className={styles.ruleLogicBox}>
            <div className={styles.ruleLine}>
              <span className={styles.ruleKeyword}>IF</span>
              <span className={styles.ruleCondition}>
                Vendor equals <span className={styles.ruleHighlight}>&ldquo;Cloudflare, Inc.&rdquo;</span>
              </span>
            </div>
            <div className={styles.ruleLine}>
              <span className={styles.ruleKeyword}>AND</span>
              <span className={styles.ruleCondition}>
                Transaction amount is <span className={styles.ruleHighlight}>≤ ₹1,50,000.00</span>
              </span>
            </div>
            <div className={styles.ruleLine}>
              <span className={styles.ruleKeyword}>AND</span>
              <span className={styles.ruleCondition}>
                Entity is <span className={styles.ruleHighlight}>&ldquo;US Parent Corp&rdquo;</span> &amp; Currency is <span className={styles.ruleHighlight}>&ldquo;USD&rdquo;</span>
              </span>
            </div>
            <div className={styles.ruleLine}>
              <span className={styles.ruleKeyword}>AND</span>
              <span className={styles.ruleCondition}>
                Source vendor invoice exists with matching unbilled reference
              </span>
            </div>
            <div className={styles.ruleLine}>
              <span className={styles.ruleKeyword} style={{ color: "var(--color-cleared-green)" }}>THEN</span>
              <span className={styles.ruleCondition} style={{ fontWeight: 600 }}>
                Auto-generate balanced entry (Dr 6110 Software Expense / Cr 1001 Operating Bank)
              </span>
            </div>
          </div>

          {/* Boundaries Grid */}
          <div className={styles.boundariesGrid}>
            <div className={styles.boundaryCard}>
              <span className={styles.boundaryLabel}>Max Threshold</span>
              <span className={styles.boundaryVal}>₹1,50,000</span>
              <span className={styles.boundarySub}>Strict ceiling</span>
            </div>

            <div className={styles.boundaryCard}>
              <span className={styles.boundaryLabel}>Frequency</span>
              <span className={styles.boundaryVal}>Monthly</span>
              <span className={styles.boundarySub}>Once per billing cycle</span>
            </div>

            <div className={styles.boundaryCard}>
              <span className={styles.boundaryLabel}>Variance</span>
              <span className={styles.boundaryVal}>₹0.00</span>
              <span className={styles.boundarySub}>Exact invoice match</span>
            </div>

            <div className={styles.boundaryCard}>
              <span className={styles.boundaryLabel}>Safety Fallback</span>
              <span className={styles.boundaryVal}>Route to Queue</span>
              <span className={styles.boundarySub}>Controller review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className={styles.safetyCallout}>
        <AlertTriangle size={20} className={styles.calloutIcon} />
        <div className={styles.calloutText}>
          <span className={styles.calloutTitle}>Human-in-the-loop requirement</span>
          <span className={styles.calloutDesc}>
            Approving the September transaction <strong>did not activate</strong> this policy. In accordance
            with FINOVA internal accounting standards, new policies must undergo deterministic backtesting
            against 12 months of historical data before activation.
          </span>
        </div>
      </div>

      {/* Footer Action */}
      <div className={styles.actionBar}>
        <button
          type="button"
          className={styles.backtestBtn}
          onClick={onBacktestPolicy}
        >
          <span>Run policy backtest on historical data</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
