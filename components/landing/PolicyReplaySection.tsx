"use client";

import React from "react";
import {
  ShieldCheck,
  Check,
  X,
  ArrowDown,
  ArrowRight,
  Lock,
  Zap,
  FileCheck,
  FileX,
  AlertCircle,
  Building,
} from "lucide-react";
import styles from "./PolicyReplaySection.module.css";

export function PolicyReplaySection() {
  return (
    <section id="safe-automation" className={styles.sectionRoot} aria-label="Safe Automation — Autonomous Replay">
      <div className={styles.container}>
        {/* ================= 1. SECTION HEADER ================= */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>SAFE AUTOMATION</span>
          <h2 className={styles.headline}>
            AUTONOMOUS EXECUTION.
            <br />
            <span className={styles.headlineAccent}>BOUNDED POLICY.</span>
          </h2>
          <p className={styles.supportingCopy}>
            Once approved, FINOVA tests the decision against future transactions &mdash;
            automatically clearing what fits and stopping what doesn&apos;t.
          </p>
        </div>

        {/* ================= 2. SPATIAL REPLAY SIMULATION ENVIRONMENT ================= */}
        <div className={styles.replayCanvas}>
          {/* TOP: Floating Apple Liquid Glass Active Policy Capsule */}
          <div className={styles.policyCapsuleWrapper}>
            <div className={styles.policyCapsule}>
              <div className={styles.policyTopBar}>
                <div className={styles.policyStatusRow}>
                  <span className={styles.liveGreenDot} />
                  <span className={styles.policyStatusLabel}>POLICY ACTIVE</span>
                </div>
                <span className={styles.policyIdTag}>RULE #CF-0926</span>
              </div>

              <div className={styles.policyMainRow}>
                <div className={styles.vendorBlock}>
                  <div className={styles.vendorIconWrap}>
                    <Building size={16} />
                  </div>
                  <div>
                    <div className={styles.vendorTitle}>CLOUDFLARE</div>
                    <div className={styles.vendorConstraint}>Below ₹1,50,000 threshold</div>
                  </div>
                </div>

                <div className={styles.policyParameters}>
                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Entity</span>
                    <strong className={styles.paramVal}>US entity</strong>
                  </div>
                  <div className={styles.paramDivider} />
                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Currency</span>
                    <strong className={styles.paramVal}>USD</strong>
                  </div>
                  <div className={styles.paramDivider} />
                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Evidence</span>
                    <strong className={styles.paramVal}>Invoice required</strong>
                  </div>
                  <div className={styles.paramDivider} />
                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>GL Account</span>
                    <strong className={styles.paramVal}>6110 Software Expense</strong>
                  </div>
                </div>

                <div className={styles.systemStatePill}>
                  <Lock size={12} strokeWidth={2.4} />
                  <span>ACTIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTRAL: Horizontal Liquid Glass Timeline Connector */}
          <div className={styles.timelineRibbon}>
            <div className={styles.timelineNode}>
              <span className={styles.tlMonth}>SEPTEMBER</span>
              <span className={styles.tlEvent}>Human Approved</span>
            </div>
            <div className={styles.timelineArrow}>
              <ArrowRight size={14} />
            </div>
            <div className={`${styles.timelineNode} ${styles.tlNodeActive}`}>
              <Zap size={13} className={styles.zapIcon} />
              <span className={styles.tlMonth}>POLICY ACTIVATED</span>
              <span className={styles.tlEvent}>Deterministic Boundary</span>
            </div>
            <div className={styles.timelineArrow}>
              <ArrowRight size={14} />
            </div>
            <div className={styles.timelineNode}>
              <span className={styles.tlMonth}>OCTOBER REPLAY</span>
              <span className={styles.tlEvent}>3 Inbound Transactions</span>
            </div>
          </div>

          {/* Spatial Pipeline Flow Routing SVGs */}
          <div className={styles.routingTree}>
            <div className={styles.routingStem} />
            <div className={styles.routingBranches} />
          </div>

          {/* OCTOBER REPLAY: 3 Inbound Transactions Travelling Through Same Policy Engine */}
          <div className={styles.transactionsGrid}>
            {/* ================= TRANSACTION 01: AUTO-CLEARED ================= */}
            <div className={`${styles.txObject} ${styles.txSuccess}`}>
              <div className={styles.txHeader}>
                <span className={styles.txBatchId}>TRANSACTION 01</span>
                <span className={styles.txPeriod}>OCTOBER 2026</span>
              </div>

              <div className={styles.txVendorRow}>
                <span className={styles.txVendorName}>CLOUDFLARE</span>
                <span className={styles.txAmountValid}>₹1,25,000</span>
              </div>

              <div className={styles.criteriaPills}>
                <div className={styles.criteriaCheck}>
                  <Check size={11} strokeWidth={3} className={styles.iconGreen} />
                  <span>Invoice verified</span>
                </div>
                <div className={styles.criteriaCheck}>
                  <Check size={11} strokeWidth={3} className={styles.iconGreen} />
                  <span>US entity verified</span>
                </div>
                <div className={styles.criteriaCheck}>
                  <Check size={11} strokeWidth={3} className={styles.iconGreen} />
                  <span>USD currency match</span>
                </div>
              </div>

              <div className={styles.pipelineTransition}>
                <ArrowDown size={12} className={styles.arrowIcon} />
                <span className={styles.policyMatchText}>MATCHED POLICY RULE</span>
              </div>

              <div className={styles.outcomeBadgeSuccess}>
                <ShieldCheck size={14} strokeWidth={2.4} />
                <span>AUTO-CLEARED</span>
              </div>
              <div className={styles.outcomeDetailSuccess}>
                Safe repeat &middot; Posted automatically
              </div>
            </div>

            {/* ================= TRANSACTION 02: BLOCKED (EXCEEDS LIMIT) ================= */}
            <div className={`${styles.txObject} ${styles.txBlocked}`}>
              <div className={styles.txHeader}>
                <span className={styles.txBatchId}>TRANSACTION 02</span>
                <span className={styles.txPeriod}>OCTOBER 2026</span>
              </div>

              <div className={styles.txVendorRow}>
                <span className={styles.txVendorName}>CLOUDFLARE</span>
                <span className={styles.txAmountExceeded}>₹7,00,000</span>
              </div>

              <div className={styles.criteriaPills}>
                <div className={styles.criteriaCheck}>
                  <Check size={11} strokeWidth={3} className={styles.iconGreen} />
                  <span>Invoice verified</span>
                </div>
                <div className={styles.criteriaCheck}>
                  <Check size={11} strokeWidth={3} className={styles.iconGreen} />
                  <span>US entity verified</span>
                </div>
                <div className={styles.criteriaCheck}>
                  <Check size={11} strokeWidth={3} className={styles.iconGreen} />
                  <span>USD currency match</span>
                </div>
              </div>

              <div className={styles.pipelineTransition}>
                <ArrowDown size={12} className={styles.arrowIcon} />
                <span className={styles.policyCheckText}>POLICY CHECK HALT</span>
              </div>

              <div className={styles.outcomeBadgeBlocked}>
                <X size={14} strokeWidth={2.6} />
                <span>BLOCKED</span>
              </div>
              <div className={styles.outcomeDetailBlocked}>
                Amount exceeds ₹1,50,000 limit &rarr; Controller review
              </div>
            </div>

            {/* ================= TRANSACTION 03: BLOCKED (MISSING EVIDENCE) ================= */}
            <div className={`${styles.txObject} ${styles.txBlocked}`}>
              <div className={styles.txHeader}>
                <span className={styles.txBatchId}>TRANSACTION 03</span>
                <span className={styles.txPeriod}>OCTOBER 2026</span>
              </div>

              <div className={styles.txVendorRow}>
                <span className={styles.txVendorName}>CLOUDFLARE</span>
                <span className={styles.txAmountValid}>₹1,25,000</span>
              </div>

              <div className={styles.criteriaPills}>
                <div className={styles.criteriaFail}>
                  <X size={11} strokeWidth={3} className={styles.iconRed} />
                  <span>Invoice missing</span>
                </div>
                <div className={styles.criteriaCheck}>
                  <Check size={11} strokeWidth={3} className={styles.iconGreen} />
                  <span>US entity verified</span>
                </div>
                <div className={styles.criteriaCheck}>
                  <Check size={11} strokeWidth={3} className={styles.iconGreen} />
                  <span>USD currency match</span>
                </div>
              </div>

              <div className={styles.pipelineTransition}>
                <ArrowDown size={12} className={styles.arrowIcon} />
                <span className={styles.policyCheckText}>POLICY CHECK HALT</span>
              </div>

              <div className={styles.outcomeBadgeBlocked}>
                <X size={14} strokeWidth={2.6} />
                <span>BLOCKED</span>
              </div>
              <div className={styles.outcomeDetailBlocked}>
                Required evidence missing &rarr; Flagged for investigation
              </div>
            </div>
          </div>

          {/* ================= 3. THE CORE VISUAL MESSAGE: BOUNDED LEARNING ================= */}
          <div className={styles.boundedProofBar}>
            <div className={styles.proofLeft}>
              <span className={styles.proofStep}>ONE APPROVED DECISION</span>
              <span className={styles.proofArrow}>&rarr;</span>
              <span className={styles.proofStep}>BECOMES BOUNDED POLICY</span>
            </div>
            <div className={styles.proofDivider} />
            <div className={styles.proofRight}>
              <div className={styles.proofCapabilityGreen}>
                <Check size={12} strokeWidth={2.6} />
                <span>AUTO-CLEARS VALID REPEATS</span>
              </div>
              <div className={styles.proofCapabilityRed}>
                <Lock size={12} strokeWidth={2.4} />
                <span>BLOCKS UNSAFE VARIATIONS</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 4. BEFORE / AFTER COMPARISON ================= */}
        <div className={styles.contrastGrid}>
          <div className={styles.contrastColBefore}>
            <span className={styles.contrastTag}>BEFORE FINOVA</span>
            <div className={styles.contrastPoints}>
              <span>&bull; Manual review required on every single exception</span>
              <span>&bull; Human controllers repeatedly approving identical SaaS debits</span>
              <span>&bull; Audit trail scattered across emails and offline spreadsheets</span>
            </div>
          </div>

          <div className={styles.contrastDivider} />

          <div className={styles.contrastColAfter}>
            <span className={styles.contrastTagActive}>WITH BOUNDED AUTOMATION</span>
            <div className={styles.contrastPoints}>
              <span>&bull; Policy activated with strict monetary and entity guardrails</span>
              <span>&bull; Identical low-risk repeats clear automatically in seconds</span>
              <span>&bull; Unsafe deviations immediately halted for controller oversight</span>
            </div>
          </div>
        </div>

        {/* ================= 5. SECTION END EDITORIAL STATEMENT ================= */}
        <div className={styles.footerEditorial}>
          <p className={styles.statementSerif}>
            &ldquo;FINOVA doesn&apos;t learn to approve everything.
            <br />
            It learns when it is safe to proceed.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
