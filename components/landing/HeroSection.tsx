"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  ShieldCheck,
  Zap,
  BarChart3,
  Download,
  Percent,
  RotateCcw,
  Receipt,
  Coins,
  Landmark,
  CheckCircle2,
  Search,
  FileText,
  AlertCircle,
} from "lucide-react";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  return (
    <section className={styles.heroRoot} aria-label="Hero">
      <div className={styles.heroContent}>
        {/* ================= LEFT COLUMN ================= */}
        <div className={styles.leftColumn}>
          {/* Eyebrow */}
          <div className={styles.eyebrow}>
            <span>FROM TRANSACTIONS TO TRUST</span>
          </div>

          {/* Editorial Headline */}
          <h1 className={styles.headline}>
            Every
            <br />
            payout has
            <br />
            a <span className={styles.goldText}>purpose.</span>
          </h1>

          {/* Supporting Copy */}
          <p className={styles.supportingCopy}>
            FINOVA&apos;s <strong>Payout Truth</strong> reconciles merchant payouts,
            explains every deduction, and posts accounting entries — while refusing
            to book anything it cannot explain.
          </p>

          {/* CTA Buttons */}
          <div className={styles.ctaRow}>
            <Link href="/payout-truth" className={styles.primaryCta}>
              <span>Explore Payout Truth</span>
              <ArrowRight size={16} strokeWidth={2.2} />
            </Link>

            <button type="button" className={styles.secondaryCta}>
              <div className={styles.playIconCircle}>
                <Play size={10} fill="#FFFFFF" />
              </div>
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Small Trust Indicators */}
          <div className={styles.trustIndicatorsGrid}>
            <div className={styles.trustItem}>
              <div className={styles.trustIconCircle}>
                <ShieldCheck size={18} strokeWidth={1.8} />
              </div>
              <div className={styles.trustMeta}>
                <span className={styles.trustTitle}>Audit Ready</span>
                <span className={styles.trustSubtext}>
                  Every transaction accounted for
                </span>
              </div>
            </div>

            <div className={styles.trustItem}>
              <div className={styles.trustIconCircle}>
                <Zap size={18} strokeWidth={1.8} />
              </div>
              <div className={styles.trustMeta}>
                <span className={styles.trustTitle}>Built for India</span>
                <span className={styles.trustSubtext}>
                  INR native, compliance first
                </span>
              </div>
            </div>

            <div className={styles.trustItem}>
              <div className={styles.trustIconCircle}>
                <BarChart3 size={18} strokeWidth={1.8} />
              </div>
              <div className={styles.trustMeta}>
                <span className={styles.trustTitle}>Finance Teams</span>
                <span className={styles.trustSubtext}>
                  Move faster from data to decisions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className={styles.rightColumn}>
          {/* Handwritten Annotation Note */}
          <div className={styles.annotationWrapper} aria-hidden="true">
            <span className={styles.handwrittenNote}>
              From payouts to possibilities.
            </span>
            <svg
              className={styles.handwrittenArrow}
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 8 C 22 10, 30 22, 24 34 M 18 30 L 24 34 L 28 26"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Floating Glass Payout Cards Stack */}
          <div className={styles.cardsStack}>
            {/* FRONT CARD: Payout #PO-1024 (Reconciled) */}
            <div className={styles.primaryCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                  <div className={styles.cardTitle}>Payout #PO-1024</div>
                  <div className={styles.cardSubtitle}>
                    RazorPay • Arcova Technologies
                  </div>
                </div>
                <div className={styles.cardHeaderRight}>
                  <span className={styles.badgeReconciled}>Reconciled</span>
                  <span className={styles.dateLabel}>12 Aug 2026</span>
                </div>
              </div>

              <div className={styles.itemsList}>
                <div className={styles.lineItem}>
                  <div className={styles.lineItemLabel}>
                    <div className={styles.itemIconBox}>
                      <Download size={13} strokeWidth={2} />
                    </div>
                    <span>Gross Sales</span>
                  </div>
                  <span className={`${styles.lineItemValue} tabular-nums`}>
                    ₹10,00,000
                  </span>
                </div>

                <div className={styles.lineItem}>
                  <div className={styles.lineItemLabel}>
                    <div className={styles.itemIconBox}>
                      <Percent size={13} strokeWidth={2} />
                    </div>
                    <span>Platform Fees</span>
                  </div>
                  <span className={`${styles.lineItemValue} ${styles.valueDeduction} tabular-nums`}>
                    - ₹20,000
                  </span>
                </div>

                <div className={styles.lineItem}>
                  <div className={styles.lineItemLabel}>
                    <div className={styles.itemIconBox}>
                      <RotateCcw size={13} strokeWidth={2} />
                    </div>
                    <span>Refunds</span>
                  </div>
                  <span className={`${styles.lineItemValue} ${styles.valueDeduction} tabular-nums`}>
                    - ₹15,000
                  </span>
                </div>

                <div className={styles.lineItem}>
                  <div className={styles.lineItemLabel}>
                    <div className={styles.itemIconBox}>
                      <Receipt size={13} strokeWidth={2} />
                    </div>
                    <span>Taxes (GST)</span>
                  </div>
                  <span className={`${styles.lineItemValue} ${styles.valueDeduction} tabular-nums`}>
                    - ₹5,000
                  </span>
                </div>
              </div>

              <div className={styles.dividerLine} />

              <div className={styles.summaryRow}>
                <div className={styles.summaryLabel}>
                  <div className={styles.itemIconBox}>
                    <Coins size={13} strokeWidth={2} />
                  </div>
                  <span>Expected Payout</span>
                </div>
                <span className={`${styles.summaryValueGold} tabular-nums`}>
                  ₹9,60,000
                </span>
              </div>

              <div className={styles.summaryRow}>
                <div className={styles.summaryLabel}>
                  <div className={styles.itemIconBox}>
                    <Landmark size={13} strokeWidth={2} />
                  </div>
                  <span>Bank Received</span>
                </div>
                <span className={`${styles.summaryValue} tabular-nums`}>
                  ₹9,60,000
                </span>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.statusExplained}>
                  <CheckCircle2 size={15} strokeWidth={2.2} />
                  <span>Every amount explained</span>
                </div>
                <Link
                  href="/payout-truth/po_rzp_4081"
                  className={styles.detailsLink}
                >
                  <span>View Details</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* BEHIND CARD: Payout #PO-1025 (Needs Review) */}
            <div className={styles.secondaryCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                  <div className={styles.cardTitle} style={{ fontSize: "16px" }}>
                    Payout #PO-1025
                  </div>
                  <div className={styles.cardSubtitle}>
                    RazorPay • Arcova
                  </div>
                </div>
                <div className={styles.cardHeaderRight}>
                  <span className={styles.badgeWarning}>Needs Review</span>
                  <span className={styles.dateLabel}>14 Aug 2026</span>
                </div>
              </div>

              <div className={styles.itemsList} style={{ gap: "8px" }}>
                <div className={styles.lineItem} style={{ fontSize: "12px" }}>
                  <span style={{ color: "rgba(245, 240, 230, 0.65)" }}>
                    Expected Payout
                  </span>
                  <span className="tabular-nums" style={{ fontWeight: 600 }}>
                    ₹9,60,000
                  </span>
                </div>

                <div className={styles.lineItem} style={{ fontSize: "12px" }}>
                  <span style={{ color: "rgba(245, 240, 230, 0.65)" }}>
                    Bank Received
                  </span>
                  <span className="tabular-nums" style={{ fontWeight: 600 }}>
                    ₹9,42,000
                  </span>
                </div>
              </div>

              {/* Warning box */}
              <div className={styles.warningBox}>
                <span className={styles.warningBoxLabel}>Unexplained Amount</span>
                <span className={`${styles.warningBoxValue} tabular-nums`}>
                  ₹18,000
                </span>
              </div>

              <Link
                href="/payout-truth/po_str_9140"
                className={styles.investigateBtn}
              >
                <span>Investigate</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Subtle Glass Workflow Strip (Below Cards) */}
          <div className={styles.workflowStrip} aria-label="Payout Truth Workflow">
            <div className={styles.workflowStep}>
              <div className={styles.stepIconCircle}>
                <Download size={14} strokeWidth={2} />
              </div>
              <div className={styles.stepLabelCol}>
                <span className={styles.stepNumber}>01</span>
                <span className={styles.stepTitle}>Receive Payout</span>
              </div>
            </div>

            <span className={styles.stepArrow}>→</span>

            <div className={styles.workflowStep}>
              <div className={styles.stepIconCircle}>
                <Search size={14} strokeWidth={2} />
              </div>
              <div className={styles.stepLabelCol}>
                <span className={styles.stepNumber}>02</span>
                <span className={styles.stepTitle}>Reconcile</span>
              </div>
            </div>

            <span className={styles.stepArrow}>→</span>

            <div className={styles.workflowStep}>
              <div className={styles.stepIconCircle}>
                <FileText size={14} strokeWidth={2} />
              </div>
              <div className={styles.stepLabelCol}>
                <span className={styles.stepNumber}>03</span>
                <span className={styles.stepTitle}>Explain</span>
              </div>
            </div>

            <span className={styles.stepArrow}>→</span>

            <div className={styles.workflowStep}>
              <div className={styles.stepIconCircle}>
                <CheckCircle2 size={14} strokeWidth={2} />
              </div>
              <div className={styles.stepLabelCol}>
                <span className={styles.stepNumber}>04</span>
                <span className={styles.stepTitle}>Book / Escalate</span>
              </div>
            </div>

            <span className={styles.stepArrow}>→</span>

            <div className={styles.workflowStep}>
              <div className={styles.stepIconCircle}>
                <ShieldCheck size={14} strokeWidth={2} />
              </div>
              <div className={styles.stepLabelCol}>
                <span className={styles.stepNumber}>05</span>
                <span className={styles.stepTitle}>Audit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Metadata Ticker */}
      <div className={styles.bottomTickerBar}>
        <div>
          BUILT FOR INDIA &nbsp;|&nbsp; DESIGNED FOR FINANCE TEAMS &nbsp;|&nbsp; POWERED BY DETERMINISTIC FINOPS —
        </div>
        <div className={styles.tickerRight}>
          TRUST TURNS TRANSACTIONS INTO GROWTH.
        </div>
      </div>
    </section>
  );
}
