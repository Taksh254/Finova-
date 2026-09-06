"use client";

import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import styles from "./CloseRunStage.module.css";

interface CloseRunStageProps {
  onRunReconciliation: () => void;
}

export function CloseRunStage({ onRunReconciliation }: CloseRunStageProps) {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.stageHeaderRow}>
        <div className={styles.titleArea}>
          <span className={styles.stageEyebrow}>1/9 Close run overview</span>
          <h1 className={styles.stageTitle}>September 2026 Close</h1>
          <p className={styles.stageSubtitle}>
            Reconcile bank transactions with your general ledger
          </p>
        </div>

        <button
          type="button"
          className={styles.runReconBtn}
          onClick={onRunReconciliation}
        >
          <span>Run reconciliation</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* 5 Stats Cards Grid */}
      <div className={styles.statGrid}>
        {/* Bank CSV */}
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span className={styles.cardLabel}>Bank CSV</span>
            <span className={styles.loadedPill}>
              <CheckCircle2 size={11} strokeWidth={2.5} />
              <span>Loaded</span>
            </span>
          </div>
          <span className={styles.fileName}>finova_bank_sep.csv</span>
          <span className={styles.txCount}>30 transactions</span>
        </div>

        {/* GL CSV */}
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span className={styles.cardLabel}>GL CSV</span>
            <span className={styles.loadedPill}>
              <CheckCircle2 size={11} strokeWidth={2.5} />
              <span>Loaded</span>
            </span>
          </div>
          <span className={styles.fileName}>finova_gl_sep.csv</span>
          <span className={styles.txCount}>30 transactions</span>
        </div>

        {/* Total Transactions */}
        <div className={styles.statCard}>
          <div className={styles.metricBig}>30</div>
          <div className={styles.metricLabel}>Total transactions</div>
        </div>

        {/* Matched Automatically */}
        <div className={styles.statCard}>
          <div className={`${styles.metricBig} ${styles.metricMatched}`}>28</div>
          <div className={styles.metricLabel}>Matched automatically</div>
        </div>

        {/* Exceptions */}
        <div className={styles.statCard}>
          <div className={`${styles.metricBig} ${styles.metricExceptions}`}>2</div>
          <div className={styles.metricLabel}>Exceptions</div>
        </div>
      </div>

      {/* Bottom Split */}
      <div className={styles.bottomSplit}>
        {/* Recent Activity */}
        <div className={styles.activityBox}>
          <h3 className={styles.boxTitle}>Recent activity</h3>
          <table className={styles.activityTable}>
            <tbody>
              <tr>
                <td className={styles.timeCol}>10:14</td>
                <td>Bank file loaded</td>
                <td style={{ textAlign: "right", color: "var(--text-editorial-muted)" }}>
                  30 transactions
                </td>
              </tr>
              <tr>
                <td className={styles.timeCol}>10:14</td>
                <td>GL file loaded</td>
                <td style={{ textAlign: "right", color: "var(--text-editorial-muted)" }}>
                  30 transactions
                </td>
              </tr>
              <tr>
                <td className={styles.timeCol}>10:15</td>
                <td style={{ fontWeight: 600 }}>Reconciliation completed</td>
                <td style={{ textAlign: "right", color: "var(--color-cleared-green)", fontWeight: 500 }}>
                  28 matched, 2 exceptions
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Expenses Finance Card */}
        <div className={styles.expensesCard}>
          <div>
            {/* Header: Title + Subtle View Details Control */}
            <div className={styles.expensesHeader}>
              <h3 className={styles.expensesTitle}>
                Total expenses · September 2026
              </h3>
              <button
                type="button"
                className={styles.viewDetailsBtn}
                aria-label="View expense details"
              >
                <span>View details</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>

            {/* Primary Metric + Green Indicator */}
            <div className={styles.metricSection}>
              <div className={styles.primaryMetric}>₹24.8L</div>
              <div className={styles.indicatorWrap}>
                <span className={styles.greenIndicator}>↑ 8.4%</span>
                <span className={styles.vsText}>vs August 2026</span>
              </div>
            </div>

            {/* Subtle Horizontal Spending Breakdown Bar */}
            <div className={styles.breakdownBar} role="progressbar" aria-label="Spending breakdown">
              <div className={styles.segmentSoftware} title="Software & SaaS: 38%" />
              <div className={styles.segmentPayroll} title="Payroll: 25%" />
              <div className={styles.segmentOperations} title="Operations: 21%" />
              <div className={styles.segmentOther} title="Other: 16%" />
            </div>

            {/* Categories Breakdown */}
            <div className={styles.categoriesGrid}>
              {/* Category 1 */}
              <div className={styles.categoryRow}>
                <div className={styles.categoryLeft}>
                  <span className={`${styles.categoryDot} ${styles.dotSoftware}`} />
                  <span className={styles.categoryName}>Software &amp; SaaS</span>
                </div>
                <div className={styles.categoryRight}>
                  <span className={styles.categoryAmount}>₹9.6L</span>
                  <span className={styles.categoryPercent}>38%</span>
                </div>
              </div>

              {/* Category 2 */}
              <div className={styles.categoryRow}>
                <div className={styles.categoryLeft}>
                  <span className={`${styles.categoryDot} ${styles.dotPayroll}`} />
                  <span className={styles.categoryName}>Payroll</span>
                </div>
                <div className={styles.categoryRight}>
                  <span className={styles.categoryAmount}>₹6.2L</span>
                  <span className={styles.categoryPercent}>25%</span>
                </div>
              </div>

              {/* Category 3 */}
              <div className={styles.categoryRow}>
                <div className={styles.categoryLeft}>
                  <span className={`${styles.categoryDot} ${styles.dotOperations}`} />
                  <span className={styles.categoryName}>Operations</span>
                </div>
                <div className={styles.categoryRight}>
                  <span className={styles.categoryAmount}>₹5.1L</span>
                  <span className={styles.categoryPercent}>21%</span>
                </div>
              </div>

              {/* Category 4 */}
              <div className={styles.categoryRow}>
                <div className={styles.categoryLeft}>
                  <span className={`${styles.categoryDot} ${styles.dotOther}`} />
                  <span className={styles.categoryName}>Other</span>
                </div>
                <div className={styles.categoryRight}>
                  <span className={styles.categoryAmount}>₹3.9L</span>
                  <span className={styles.categoryPercent}>16%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Small Secondary Glass Area at Bottom */}
          <div className={styles.secondaryGlassFooter}>
            <div className={styles.footerColLeft}>
              <span className={styles.glassFooterLead}>Every rupee accounted for.</span>
              <span className={styles.glassFooterSub}>Clearer data. Safer decisions.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
