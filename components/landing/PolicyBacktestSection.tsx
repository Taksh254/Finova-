"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Play,
  Check,
  Lock,
} from "lucide-react";
import styles from "./PolicyBacktestSection.module.css";

const backtestTransactions = [
  {
    date: "Jun 04",
    vendor: "Cloudflare",
    amount: "₹1,20,000",
    status: "valid",
    reason: "Invoice verified · Within limit",
  },
  {
    date: "Jul 12",
    vendor: "Cloudflare",
    amount: "₹1,35,000",
    status: "valid",
    reason: "Invoice verified · Within limit",
  },
  {
    date: "Aug 18",
    vendor: "Cloudflare",
    amount: "₹7,50,000",
    status: "blocked",
    reason: "Exceeds ₹1,50,000 threshold",
  },
  {
    date: "Sep 02",
    vendor: "Cloudflare",
    amount: "₹1,25,000",
    status: "blocked",
    reason: "Missing tax invoice",
  },
];

export function PolicyBacktestSection() {
  const [activated, setActivated] = useState(false);
  const [backtested, setBacktested] = useState(true);

  return (
    <section id="policy" className={styles.policySectionRoot} aria-label="Policy and Backtesting">
      <div className={styles.transitionGlow} />

      <div className={styles.policyContainer}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>
            <span>◆</span> POLICY AUTOMATION &amp; BACKTESTING
          </span>
          <h2 className={styles.headline}>
            Solve it once.
            <br />
            Automate it <span className={styles.italicHeadline}>safely.</span>
          </h2>
          <p className={styles.supportingText}>
            When an exception is resolved, FINOVA drafts a strictly bounded policy.
            Before any policy goes live, you can backtest it across historical close runs to guarantee no improper postings.
          </p>
        </div>

        <div className={styles.policyGrid}>
          {/* ================= LEFT: SECTION 9 POLICY PROPOSAL ================= */}
          <div className={styles.policyGlassCard}>
            <div className={styles.policyCardHeader}>
              <span className={styles.policyCardTag}>POLICY PROPOSAL #POL-2026-04</span>
              <span className={styles.statusProposedBadge}>
                {activated ? "ACTIVE" : "PROPOSED"}
              </span>
            </div>

            <h3 className={styles.policyCardTitle}>Cloudflare recurring payments</h3>
            <div className={styles.policyCardLimit}>Threshold: Below ₹1,50,000</div>

            {/* Structured attributes */}
            <div className={styles.policyMetaList}>
              <div className={styles.policyMetaItem}>
                <span className={styles.metaKey}>Company</span>
                <span className={styles.metaVal}>US Entity</span>
              </div>
              <div className={styles.policyMetaItem}>
                <span className={styles.metaKey}>Currency</span>
                <span className={styles.metaVal}>USD / INR Equiv</span>
              </div>
              <div className={styles.policyMetaItem}>
                <span className={styles.metaKey}>Invoice Requirement</span>
                <span className={styles.metaVal}>Required</span>
              </div>
              <div className={styles.policyMetaItem}>
                <span className={styles.metaKey}>Account</span>
                <span className={styles.metaVal}>Software Expense (6110)</span>
              </div>
            </div>

            {/* Amber Glass Warning Pill */}
            <div className={styles.amberWarningPill}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>
                Transaction approval does not activate this policy. Human authorization required.
              </span>
            </div>

            {/* Action Buttons */}
            <div className={styles.policyButtonsRow}>
              <button
                type="button"
                className={styles.backtestBtn}
                onClick={() => setBacktested(true)}
              >
                <Play size={13} fill="currentColor" />
                <span>Backtest policy</span>
              </button>

              <button
                type="button"
                className={styles.activateBtn}
                onClick={() => setActivated(!activated)}
              >
                <Lock size={13} />
                <span>{activated ? "Policy active ✓" : "Activate policy"}</span>
              </button>
            </div>
          </div>

          {/* ================= RIGHT: SECTION 10 BACKTEST RESULTS ================= */}
          <div className={styles.backtestCol}>
            {/* 3 Floating Glass Stat Cards */}
            <div className={styles.backtestStatsGrid}>
              <div className={`${styles.statGlassCard} ${styles.statCardValid}`}>
                <span className={styles.statNumber}>12</span>
                <span className={styles.statTitle}>Valid cases</span>
                <span className={styles.statDesc}>matched historically</span>
              </div>

              <div className={`${styles.statGlassCard} ${styles.statCardBlocked}`}>
                <span className={styles.statNumber}>2</span>
                <span className={styles.statTitle}>Unusual cases</span>
                <span className={styles.statDesc}>safely blocked</span>
              </div>

              <div className={`${styles.statGlassCard} ${styles.statCardZero}`}>
                <span className={styles.statNumber}>0</span>
                <span className={styles.statTitle}>Incorrect</span>
                <span className={styles.statDesc}>matches or entries</span>
              </div>
            </div>

            {/* Translucent Glass Table */}
            <div className={styles.historicalGlassTable}>
              <div className={styles.tableHeader}>
                <span>Historical Backtest Simulation (Q2 &ndash; Q3)</span>
                <span>Verification</span>
              </div>

              {backtestTransactions.map((tx, idx) => (
                <div
                  key={idx}
                  className={`${styles.histRow} ${
                    tx.status === "valid" ? styles.histRowValid : styles.histRowBlocked
                  }`}
                >
                  <div className={styles.rowLeft}>
                    <span className={styles.rowDate}>{tx.date}</span>
                    <span className={styles.rowVendor}>{tx.vendor}</span>
                    <span style={{ fontSize: "0.72rem", opacity: 0.8 }}>({tx.reason})</span>
                  </div>

                  <div className={styles.rowRight}>
                    <span className={styles.rowAmount}>{tx.amount}</span>
                    {tx.status === "valid" ? (
                      <span className={styles.badgePassed}>
                        <CheckCircle2 size={11} />
                        Matched
                      </span>
                    ) : (
                      <span className={styles.badgeBlocked}>
                        <ShieldAlert size={11} />
                        Blocked
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
