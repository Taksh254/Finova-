"use client";

import React from "react";
import {
  Landmark,
  Check,
  Sparkles,
  User,
  FileText,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import styles from "./WorkflowSection.module.css";

export function WorkflowSection() {
  return (
    <section id="what-finova-does" className={styles.workflowSection} aria-label="What FINOVA Does">
      {/* Subtle organic atmospheric leaf blur on left edge */}
      <div className={styles.ambientLeafGlow} aria-hidden="true" />

      {/* Extremely faint financial data background watermarks */}
      <div className={styles.dataWatermarkLayer} aria-hidden="true">
        <span className={styles.watermarkWord} style={{ top: "15%", left: "4%" }}>BANK</span>
        <span className={styles.watermarkWord} style={{ top: "45%", left: "22%" }}>GL</span>
        <span className={styles.watermarkWord} style={{ top: "18%", left: "44%" }}>INVOICES</span>
        <span className={styles.watermarkWord} style={{ top: "52%", left: "65%" }}>EVIDENCE</span>
        <span className={styles.watermarkWord} style={{ top: "20%", right: "6%" }}>POLICIES</span>
      </div>

      <div className={styles.container}>
        {/* ================= SECTION HEADER ================= */}
        <div className={styles.workflowHeader}>
          <div className={styles.leftHeader}>
            <span className={styles.eyebrow}>WHAT FINOVA DOES</span>
            <h2 className={styles.headline}>
              From financial noise
              <br />
              to clear next steps.
            </h2>
          </div>

          <div className={styles.rightHeader}>
            <p className={styles.supportingText}>
              FINOVA connects bank transactions with internal accounting records,
              investigates what doesn&apos;t match, proposes a resolution and keeps a human in control of approval.
            </p>
          </div>
        </div>

        {/* ================= CINEMATIC WORKFLOW ENVIRONMENT ================= */}
        <div className={styles.workflowCanvas}>
          {/* Spatial Connecting Wave Line with Glowing Nodes */}
          <svg className={styles.connectingSvg} viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M 60,65 Q 160,85 260,50 T 480,75 T 700,45 T 920,70 T 1140,55"
              fill="none"
              stroke="rgba(74, 120, 88, 0.22)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Node 1 to 2 */}
          <div className={styles.flowNode} style={{ left: "16.8%", top: "49%" }}>
            <span className={styles.nodePulse} />
          </div>
          {/* Node 2 to 3 */}
          <div className={styles.flowNode} style={{ left: "33.2%", top: "44%" }}>
            <span className={styles.nodePulse} />
          </div>
          {/* Node 3 to 4 */}
          <div className={styles.flowNode} style={{ left: "49.6%", top: "52%" }}>
            <span className={styles.nodePulse} />
          </div>
          {/* Node 4 to 5 */}
          <div className={styles.flowNode} style={{ left: "66.5%", top: "47%" }}>
            <span className={styles.nodePulse} />
          </div>
          {/* Node 5 to 6 */}
          <div className={styles.flowNode} style={{ left: "82.8%", top: "51%" }}>
            <span className={styles.nodePulse} />
          </div>

          {/* 6 Spatial Liquid Glass Workflow Cards */}
          <div className={styles.flowRow}>
            {/* ================= STEP 01: BANK TRANSACTION ================= */}
            <div className={`${styles.glassCard} ${styles.cardStep1}`}>
              <div className={styles.cardHeader}>
                <span className={styles.stepBadge}>01</span>
                <span className={styles.stepTitle}>BANK TRANSACTION</span>
              </div>

              <div className={styles.bankCardBody}>
                <div className={styles.bankIconCircle}>
                  <Landmark size={18} strokeWidth={1.75} />
                </div>

                <div className={styles.vendorHeading}>CLOUDFLARE PRO</div>
                <div className={styles.primaryAmount}>₹1,00,000</div>

                <div className={styles.metaLines}>
                  <span>30 Sep 2026 &middot; USD</span>
                  <span>US Entity</span>
                </div>

                <div className={styles.unmatchedTag}>
                  Unmatched
                </div>
              </div>
            </div>

            {/* ================= STEP 02: RECONCILIATION ================= */}
            <div className={`${styles.glassCard} ${styles.cardStep2}`}>
              <div className={styles.cardHeader}>
                <span className={styles.stepBadge}>02</span>
                <span className={styles.stepTitle}>RECONCILIATION</span>
              </div>

              <div className={styles.reconcileBody}>
                <ul className={styles.checkList}>
                  <li className={styles.checkItem}>
                    <span className={styles.checkIconWrap}><Check size={11} strokeWidth={3} /></span>
                    <span>Amount</span>
                  </li>
                  <li className={styles.checkItem}>
                    <span className={styles.checkIconWrap}><Check size={11} strokeWidth={3} /></span>
                    <span>Date</span>
                  </li>
                  <li className={styles.checkItem}>
                    <span className={styles.checkIconWrap}><Check size={11} strokeWidth={3} /></span>
                    <span>Vendor</span>
                  </li>
                  <li className={styles.checkItem}>
                    <span className={styles.checkIconWrap}><Check size={11} strokeWidth={3} /></span>
                    <span>Reference</span>
                  </li>
                </ul>

                <div className={styles.reconcileSummaryBox}>
                  <div className={styles.matchedCount}>28 transactions matched</div>
                  <div className={styles.needsInvestigation}>1 needs investigation</div>
                </div>
              </div>
            </div>

            {/* ================= STEP 03: AI INVESTIGATION ================= */}
            <div className={`${styles.glassCard} ${styles.cardStep3}`}>
              <div className={styles.cardHeader}>
                <span className={styles.stepBadge}>03</span>
                <span className={styles.stepTitle}>AI INVESTIGATION</span>
              </div>

              <div className={styles.investigationBody}>
                <ul className={styles.checkList}>
                  <li className={styles.checkItem}>
                    <span className={styles.checkIconWrap}><Check size={11} strokeWidth={3} /></span>
                    <span>Invoice found</span>
                  </li>
                  <li className={styles.checkItem}>
                    <span className={styles.checkIconWrap}><Check size={11} strokeWidth={3} /></span>
                    <span>Previous transaction</span>
                  </li>
                  <li className={styles.checkItem}>
                    <span className={styles.checkIconWrap}><Check size={11} strokeWidth={3} /></span>
                    <span>Vendor record</span>
                  </li>
                </ul>

                <div className={styles.recommendationGlassPill}>
                  <div className={styles.sparkleIconCircle}>
                    <Sparkles size={13} strokeWidth={2} />
                  </div>
                  <div className={styles.recommendationText}>
                    <span className={styles.recLabel}>Evidence supports:</span>
                    <strong className={styles.recValue}>Software expense</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= STEP 04: PROPOSED ENTRY ================= */}
            <div className={`${styles.glassCard} ${styles.cardStep4}`}>
              <div className={styles.cardHeader}>
                <span className={styles.stepBadge}>04</span>
                <span className={styles.stepTitle}>PROPOSED ENTRY</span>
              </div>

              <div className={styles.proposedBody}>
                <div className={styles.ledgerTable}>
                  <div className={styles.ledgerRow}>
                    <span className={styles.ledgerAccount}>Dr &nbsp;6110 Software Expense</span>
                    <span className={styles.ledgerAmt}>₹1,00,000</span>
                  </div>
                  <div className={styles.ledgerRowCr}>
                    <span className={styles.ledgerAccount}>Cr &nbsp;1001 Bank</span>
                    <span className={styles.ledgerAmt}>₹1,00,000</span>
                  </div>
                </div>

                <div className={styles.safetyChecksStack}>
                  <div className={styles.safetyCheckItem}>
                    <span className={styles.checkIconWrap}><Check size={10} strokeWidth={3} /></span>
                    <span>Balanced</span>
                  </div>
                  <div className={styles.safetyCheckItem}>
                    <span className={styles.checkIconWrap}><Check size={10} strokeWidth={3} /></span>
                    <span>Invoice verified</span>
                  </div>
                  <div className={styles.safetyCheckItem}>
                    <span className={styles.checkIconWrap}><Check size={10} strokeWidth={3} /></span>
                    <span>No duplicate</span>
                  </div>
                  <div className={styles.safetyCheckItem}>
                    <span className={styles.checkIconWrap}><Check size={10} strokeWidth={3} /></span>
                    <span>Period open</span>
                  </div>
                  <div className={styles.safetyCheckItem}>
                    <span className={styles.checkIconWrap}><Check size={10} strokeWidth={3} /></span>
                    <span>Valid accounts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= STEP 05: CONTROLLER REVIEW ================= */}
            <div className={`${styles.glassCard} ${styles.cardStep5}`}>
              <div className={styles.cardHeader}>
                <span className={styles.stepBadge}>05</span>
                <span className={styles.stepTitle}>CONTROLLER REVIEW</span>
              </div>

              <div className={styles.reviewBody}>
                <div className={styles.controllerAvatarWrap}>
                  <div className={styles.avatarCircle}>
                    <User size={18} strokeWidth={1.8} />
                  </div>
                </div>

                <div className={styles.reviewPrompt}>
                  <span className={styles.promptLabel}>FINOVA recommends:</span>
                  <p className={styles.promptAction}>Post this transaction as Software Expense.</p>
                </div>

                <div className={styles.actionBtnGroup}>
                  <button type="button" className={styles.btnGhost}>Reject</button>
                  <button type="button" className={styles.btnGhost}>Edit</button>
                  <button type="button" className={styles.btnApprove}>Approve</button>
                </div>
              </div>
            </div>

            {/* ================= STEP 06: POLICY CREATION ================= */}
            <div className={`${styles.glassCard} ${styles.cardStep6}`}>
              <div className={styles.cardHeader}>
                <span className={styles.stepBadge}>06</span>
                <span className={styles.stepTitle}>POLICY CREATION</span>
              </div>

              <div className={styles.policyBody}>
                <div className={styles.policyRuleBox}>
                  <div className={styles.policyDocHeader}>
                    <FileText size={14} className={styles.policyDocIcon} />
                    <span className={styles.policyDocTitle}>Cloudflare payments: below ₹1,50,000</span>
                  </div>

                  <div className={styles.policyMetaGrid}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaKey}>Company</span>
                      <span className={styles.metaVal}>US entity</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaKey}>Currency</span>
                      <span className={styles.metaVal}>USD</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaKey}>Invoice</span>
                      <span className={styles.metaVal}>Required</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaKey}>Account</span>
                      <span className={styles.metaVal}>Software Expense &ndash; 6110</span>
                    </div>
                  </div>
                </div>

                <div className={styles.backtestGlassButton}>
                  <div className={styles.backtestLeft}>
                    <span className={styles.checkIconWrap}><Check size={11} strokeWidth={3} /></span>
                    <span>Ready for backtest</span>
                  </div>
                  <ArrowRight size={13} strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION BOTTOM EDITORIAL & TIMELINE ================= */}
        <div className={styles.sectionBottomRow}>
          <div className={styles.bottomEditorial}>
            <h3 className={styles.bottomHeadline}>
              Solve an accounting exception once.
              <br />
              Automate it safely for the future.
            </h3>
          </div>

          <div className={styles.timelineTrack}>
            <div className={styles.timelineStep}>
              <span className={styles.tlNum}>01</span>
              <span className={styles.tlText}>CURRENT DECISION</span>
            </div>
            <span className={styles.tlDivider}>&mdash;</span>
            <div className={styles.timelineStep}>
              <span className={styles.tlNum}>02</span>
              <span className={styles.tlText}>POLICY CANDIDATE</span>
            </div>
            <span className={styles.tlDivider}>&mdash;</span>
            <div className={styles.timelineStep}>
              <span className={styles.tlNum}>03</span>
              <span className={styles.tlText}>BACKTEST</span>
            </div>
            <span className={styles.tlDivider}>&mdash;</span>
            <div className={styles.timelineStep}>
              <span className={styles.tlNum}>04</span>
              <span className={styles.tlText}>FUTURE AUTOMATION</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
