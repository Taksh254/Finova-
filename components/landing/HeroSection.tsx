"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Lock,
  Layers,
  Zap,
} from "lucide-react";
import styles from "./HeroSection.module.css";

type TabKey = "payout" | "cash" | "collections";

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("payout");

  return (
    <section className={styles.heroContainer} aria-label="FINOVA Overview">
      <div className={styles.heroContent}>
        {/* Retention Trust Badge */}
        <div className={styles.retentionBadge}>
          <span className={styles.retentionHighlight}>98.4% Retention</span>
          <span>Trusted by 620+ High-Growth Indian SMEs & D2C Brands</span>
        </div>

        {/* Hero Title */}
        <h1 className={styles.heroTitle}>
          The Financial Operating System That Small Businesses{" "}
          <span className={styles.gradientText}>Never Cancel.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className={styles.heroSubtitle}>
          Small businesses bleed 2–4% of revenue to opaque payment gateway cuts,
          delayed settlements, and payroll cash crunches. FINOVA reconciles every
          single rupee autonomously, predicts your 18-day cash runway, and
          protects your operating margin.
        </p>

        {/* Hero Action CTAs */}
        <div className={styles.ctaRow}>
          <Link href="/payout-truth" className={styles.primaryHeroBtn}>
            <span>Launch Live Sandbox</span>
            <ArrowRight size={18} strokeWidth={2} />
          </Link>
          <a href="#roi-calculator" className={styles.secondaryHeroBtn}>
            <Zap size={18} color="var(--color-primary)" />
            <span>Calculate Your Leakage</span>
          </a>
        </div>

        {/* Micro Guarantee Proof */}
        <div className={styles.proofMicroText}>
          <CheckCircle2 size={15} className={styles.checkIcon} />
          <span>No credit card required</span>
          <span>•</span>
          <CheckCircle2 size={15} className={styles.checkIcon} />
          <span>Works with Razorpay, Stripe, Cashfree & Tally</span>
          <span>•</span>
          <CheckCircle2 size={15} className={styles.checkIcon} />
          <span>Bank-grade 256-bit encryption</span>
        </div>

        {/* Interactive Live FinOps Showcase */}
        <div className={styles.showcaseWrapper}>
          {/* Top Window Bar */}
          <div className={styles.showcaseTopBar}>
            <div className={styles.windowControls} aria-hidden="true">
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>

            <div className={styles.tabsContainer} role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === "payout"}
                className={`${styles.tabButton} ${
                  activeTab === "payout" ? styles.tabButtonActive : ""
                }`}
                onClick={() => setActiveTab("payout")}
              >
                <ShieldCheck size={16} />
                <span>Payout Truth Engine</span>
              </button>

              <button
                role="tab"
                aria-selected={activeTab === "cash"}
                className={`${styles.tabButton} ${
                  activeTab === "cash" ? styles.tabButtonActive : ""
                }`}
                onClick={() => setActiveTab("cash")}
              >
                <TrendingUp size={16} />
                <span>18-Day Cash Radar</span>
              </button>

              <button
                role="tab"
                aria-selected={activeTab === "collections"}
                className={`${styles.tabButton} ${
                  activeTab === "collections" ? styles.tabButtonActive : ""
                }`}
                onClick={() => setActiveTab("collections")}
              >
                <Zap size={16} />
                <span>Smart Receivables</span>
              </button>
            </div>
          </div>

          {/* Showcase Body Content */}
          <div className={styles.showcaseBody}>
            {activeTab === "payout" && (
              <div>
                <div className={styles.previewHeader}>
                  <div className={styles.previewMeta}>
                    <div className={styles.previewTitle}>
                      <span>Razorpay Batch #PO-RZP-8842</span>
                      <span className={`${styles.statusTag} ${styles.statusGreen}`}>
                        ✓ Reconciled to Last Rupee
                      </span>
                    </div>
                    <span className={styles.previewSubtitle}>
                      Settlement Period: Yesterday, 23:59 IST • 482 Underlying Transactions Verified
                    </span>
                  </div>
                  <Link href="/payout-truth" className={styles.actionLinkBtn}>
                    View In Sandbox →
                  </Link>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricCard}>
                    <span className={styles.metricCardLabel}>Gross Merchant Volume</span>
                    <span className={`${styles.metricCardValue} tabular-nums`}>
                      ₹8,45,000.00
                    </span>
                    <span className={`${styles.metricCardNote} ${styles.noteMuted}`}>
                      482 client payments
                    </span>
                  </div>

                  <div className={styles.metricCard}>
                    <span className={styles.metricCardLabel}>Standard Gateway Fee</span>
                    <span className={`${styles.metricCardValue} tabular-nums`}>
                      -₹16,900.00
                    </span>
                    <span className={`${styles.metricCardNote} ${styles.noteMuted}`}>
                      2.00% agreed contract rate
                    </span>
                  </div>

                  <div className={styles.metricCard}>
                    <span className={styles.metricCardLabel}>GST On MDR (18%)</span>
                    <span className={`${styles.metricCardValue} tabular-nums`}>
                      -₹3,042.00
                    </span>
                    <span className={`${styles.metricCardNote} ${styles.noteMuted}`}>
                      ITC eligible input credit
                    </span>
                  </div>

                  <div className={styles.metricCard}>
                    <span className={styles.metricCardLabel}>Net Bank Deposit</span>
                    <span className={`${styles.metricCardValue} tabular-nums`} style={{ color: "var(--color-primary)" }}>
                      ₹8,25,058.00
                    </span>
                    <span className={`${styles.metricCardNote} ${styles.notePositive}`}>
                      HDFC ••••9104 Verified
                    </span>
                  </div>
                </div>

                <div className={`${styles.showcaseAlert} ${styles.alertWarning}`}>
                  <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div className={styles.alertContent}>
                    <div className={styles.alertTitle}>
                      Autonomous AI Leakage Protection Active
                    </div>
                    <div className={styles.alertDesc}>
                      FINOVA detected <strong>₹1,420 excess fee</strong> charged on 3 international corporate cards. Dispute package pre-compiled with gateway ticket ref #RZP-DISP-4109 and auto-credited to pending ledger.
                    </div>
                  </div>
                </div>

                <div className={styles.showcaseFooter}>
                  <div className={styles.showcaseFooterLeft}>
                    <Lock size={15} />
                    <span>Cryptographically verified against bank settlement UTR & gateway webhook logs</span>
                  </div>
                  <Link href="/payout-truth" className={styles.actionLinkBtn}>
                    Explore Full Flagship Flow
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "cash" && (
              <div>
                <div className={styles.previewHeader}>
                  <div className={styles.previewMeta}>
                    <div className={styles.previewTitle}>
                      <span>18-Day Forward Cash Runway Forecast</span>
                      <span className={`${styles.statusTag} ${styles.statusBlue}`}>
                        AI Confidence: 99.1%
                      </span>
                    </div>
                    <span className={styles.previewSubtitle}>
                      Live telemetry connected across HDFC Current Account, ICICI Tax Reserve, and Razorpay
                    </span>
                  </div>
                  <Link href="/cash-flow" className={styles.actionLinkBtn}>
                    View Cash Flow →
                  </Link>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricCard}>
                    <span className={styles.metricCardLabel}>Liquid Cash Balance</span>
                    <span className={`${styles.metricCardValue} tabular-nums`}>
                      ₹24,80,450
                    </span>
                    <span className={`${styles.metricCardNote} ${styles.notePositive}`}>
                      Combined 2 operating banks
                    </span>
                  </div>

                  <div className={styles.metricCard}>
                    <span className={styles.metricCardLabel}>18-Day Outflows (Payroll + Rent)</span>
                    <span className={`${styles.metricCardValue} tabular-nums`} style={{ color: "var(--color-negative)" }}>
                      -₹12,40,000
                    </span>
                    <span className={`${styles.metricCardNote} ${styles.noteNegative}`}>
                      Payroll in 9 days (₹8.2L)
                    </span>
                  </div>

                  <div className={styles.metricCard}>
                    <span className={styles.metricCardLabel}>Guaranteed Inflows</span>
                    <span className={`${styles.metricCardValue} tabular-nums`} style={{ color: "var(--color-positive)" }}>
                      +₹9,10,000
                    </span>
                    <span className={`${styles.metricCardNote} ${styles.notePositive}`}>
                      8 high-intent contracts
                    </span>
                  </div>

                  <div className={styles.metricCard}>
                    <span className={styles.metricCardLabel}>Projected Safe Cushion</span>
                    <span className={`${styles.metricCardValue} tabular-nums`} style={{ color: "var(--color-primary)" }}>
                      ₹21,50,450
                    </span>
                    <span className={`${styles.metricCardNote} ${styles.notePositive}`}>
                      Zero overdraft risk detected
                    </span>
                  </div>
                </div>

                <div className={`${styles.showcaseAlert} ${styles.alertSuccess}`}>
                  <Sparkles size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div className={styles.alertContent}>
                    <div className={styles.alertTitle}>
                      Runway Health: 5.6 Months • No Payroll Anxiety
                    </div>
                    <div className={styles.alertDesc}>
                      FINOVA simulated 100 scenario permutations. Even in a 30% late-payment scenario, salary buffer remains intact by 14 days without requiring credit lines.
                    </div>
                  </div>
                </div>

                <div className={styles.showcaseFooter}>
                  <div className={styles.showcaseFooterLeft}>
                    <TrendingUp size={15} />
                    <span>Calculates burn rate, tax withholding, and vendor credit terms automatically</span>
                  </div>
                  <Link href="/overview" className={styles.actionLinkBtn}>
                    Open Dashboard Radar
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "collections" && (
              <div>
                <div className={styles.previewHeader}>
                  <div className={styles.previewMeta}>
                    <div className={styles.previewTitle}>
                      <span>Autonomous Accounts Receivable & Dunning</span>
                      <span className={`${styles.statusTag} ${styles.statusGreen}`}>
                        38% Faster DSO
                      </span>
                    </div>
                    <span className={styles.previewSubtitle}>
                      Gentle, branded WhatsApp and email reminders triggered precisely when client finance teams run payment runs
                    </span>
                  </div>
                  <Link href="/invoices" className={styles.actionLinkBtn}>
                    View Invoices →
                  </Link>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricCard}>
                    <span className={styles.metricCardLabel}>Total Monitored AR</span>
                    <span className={`${styles.metricCardValue} tabular-nums`}>
                      ₹18,50,000
                    </span>
                    <span className={`${styles.metricCardNote} ${styles.noteMuted}`}>
                      24 active SME clients
                    </span>
                  </div>

                  <div className={styles.metricCard}>
                    <span className={styles.metricCardLabel}>Recovered This Week</span>
                    <span className={`${styles.metricCardValue} tabular-nums`} style={{ color: "var(--color-positive)" }}>
                      ₹6,20,000
                    </span>
                    <span className={`${styles.metricCardNote} ${styles.notePositive}`}>
                      5 invoices settled in 48h
                    </span>
                  </div>

                  <div className={styles.metricCard}>
                    <span className={styles.metricCardLabel}>Overdue Invoices (&gt;30d)</span>
                    <span className={`${styles.metricCardValue} tabular-nums`} style={{ color: "var(--color-warning)" }}>
                      ₹1,40,000
                    </span>
                    <span className={`${styles.metricCardNote} ${styles.noteNegative}`}>
                      Down from ₹5.8L last month
                    </span>
                  </div>

                  <div className={styles.metricCard}>
                    <span className={styles.metricCardLabel}>Founder Hours Saved</span>
                    <span className={`${styles.metricCardValue} tabular-nums`} style={{ color: "var(--color-primary)" }}>
                      16.5 hrs/mo
                    </span>
                    <span className={`${styles.metricCardNote} ${styles.notePositive}`}>
                      Zero awkward manual followups
                    </span>
                  </div>
                </div>

                <div className={`${styles.showcaseAlert} ${styles.alertBlue}`}>
                  <FileCheck2 size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div className={styles.alertContent}>
                    <div className={styles.alertTitle}>
                      AI Tone Matching: High Conversion, Zero Damaged Relationships
                    </div>
                    <div className={styles.alertDesc}>
                      Unlike aggressive collections bots, FINOVA uses professional, courteous payment reminders that clients actually respond to—delivering 94% on-time settlement.
                    </div>
                  </div>
                </div>

                <div className={styles.showcaseFooter}>
                  <div className={styles.showcaseFooterLeft}>
                    <Zap size={15} />
                    <span>Includes 1-click UPI & NEFT payment links embedded in every reminder</span>
                  </div>
                  <Link href="/invoices" className={styles.actionLinkBtn}>
                    Explore Invoices Engine
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
