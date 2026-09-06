"use client";

import React from "react";
import { ArrowRight, CheckCircle2, ShieldAlert, Check, ShieldCheck } from "lucide-react";
import styles from "./PolicyBacktestStage.module.css";

interface PolicyBacktestStageProps {
  onActivatePolicy: () => void;
}

const historicalTxns = [
  {
    date: "Sep 12, 2026",
    ref: "CF-928374",
    amount: "₹1,00,000.00",
    invoice: "Verified",
    status: "Matched",
    notes: "Regular Pro subscription (Target exception resolved)",
  },
  {
    date: "Aug 28, 2026",
    ref: "CF-889102",
    amount: "₹2,10,000.00",
    invoice: "Verified",
    status: "Blocked",
    notes: "Exceeded ₹1,50,000 limit (Annual CDN plan upgrade)",
  },
  {
    date: "Aug 12, 2026",
    ref: "CF-881204",
    amount: "₹1,00,000.00",
    invoice: "Verified",
    status: "Matched",
    notes: "Standard monthly Pro plan",
  },
  {
    date: "Jul 12, 2026",
    ref: "CF-872911",
    amount: "₹1,00,000.00",
    invoice: "Verified",
    status: "Matched",
    notes: "Standard monthly Pro plan",
  },
  {
    date: "Jun 10, 2026",
    ref: "CF-864019",
    amount: "₹1,72,000.00",
    invoice: "Verified",
    status: "Blocked",
    notes: "Exceeded ₹1,50,000 limit (Enterprise add-on bundle)",
  },
  {
    date: "May 12, 2026",
    ref: "CF-859182",
    amount: "₹1,00,000.00",
    invoice: "Verified",
    status: "Matched",
    notes: "Standard monthly Pro plan",
  },
  {
    date: "Apr 12, 2026",
    ref: "CF-849102",
    amount: "₹1,00,000.00",
    invoice: "Verified",
    status: "Matched",
    notes: "Standard monthly Pro plan",
  },
];

export function PolicyBacktestStage({ onActivatePolicy }: PolicyBacktestStageProps) {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.stageHeaderRow}>
        <div>
          <span className={styles.stageEyebrow}>6/9 Policy backtest</span>
          <h1 className={styles.stageTitle}>Historical backtest results (past 12 months)</h1>
          <p className={styles.stageSubtitle}>
            Policy tested against 14 historical Cloudflare transactions
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={`${styles.metricNumber} ${styles.matchedNum}`}>12</span>
          <span className={styles.metricTitle}>Matched safely</span>
          <span className={styles.metricDesc}>
            Met all 5 criteria, booked to GL 6110 with verified invoice.
          </span>
        </div>

        <div className={styles.metricCard}>
          <span className={`${styles.metricNumber} ${styles.blockedNum}`}>2</span>
          <span className={styles.metricTitle}>Unusual transactions blocked</span>
          <span className={styles.metricDesc}>
            Safely flagged amounts &gt; ₹1,50,000 (Jun 10 and Aug 28).
          </span>
        </div>

        <div className={styles.metricCard}>
          <span className={`${styles.metricNumber} ${styles.zeroNum}`}>0</span>
          <span className={styles.metricTitle}>False positives / errors</span>
          <span className={styles.metricDesc}>
            Zero incorrect automated postings across 12 months of test data.
          </span>
        </div>
      </div>

      {/* Historical Ledger Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Historical ledger backtest sample</h3>
          <span className={styles.periodBadge}>Evaluated period: Oct 2025 – Sep 2026</span>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.backtestTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference</th>
                <th>Amount</th>
                <th>Invoice</th>
                <th>Backtest Result</th>
                <th>Evaluation Notes</th>
              </tr>
            </thead>
            <tbody>
              {historicalTxns.map((tx, idx) => (
                <tr key={idx}>
                  <td>{tx.date}</td>
                  <td className={styles.monoCell}>{tx.ref}</td>
                  <td className={styles.monoCell}>{tx.amount}</td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <CheckCircle2 size={12} style={{ color: "var(--color-cleared-green)" }} />
                      <span>{tx.invoice}</span>
                    </span>
                  </td>
                  <td>
                    {tx.status === "Matched" ? (
                      <span className={styles.matchedPill}>
                        <Check size={11} strokeWidth={3} />
                        <span>Matched</span>
                      </span>
                    ) : (
                      <span className={styles.blockedPill}>
                        <ShieldAlert size={11} strokeWidth={2.5} />
                        <span>Blocked (Cap)</span>
                      </span>
                    )}
                  </td>
                  <td className={styles.noteCell}>{tx.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Banner */}
      <div className={styles.summaryBanner}>
        <ShieldCheck size={20} className={styles.summaryIcon} />
        <div className={styles.summaryText}>
          <strong>Deterministic Boundary Proven:</strong> Policy v1.0 successfully automated 85.7% of
          routine billing while halting 100% of out-of-scope invoices without hallucinating entries.
        </div>
      </div>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <button
          type="button"
          className={styles.activateBtn}
          onClick={onActivatePolicy}
        >
          <span>Activate policy v1.0 for recurring runs</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
