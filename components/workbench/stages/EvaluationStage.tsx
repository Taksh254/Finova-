"use client";

import React from "react";
import { RotateCcw, ArrowRight, ShieldCheck, CheckCircle2, TrendingDown } from "lucide-react";
import styles from "./EvaluationStage.module.css";

interface EvaluationStageProps {
  onReset: () => void;
  onReturnToClose: () => void;
}

export function EvaluationStage({ onReset, onReturnToClose }: EvaluationStageProps) {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.stageHeaderRow}>
        <div>
          <span className={styles.stageEyebrow}>9/9 Evaluation</span>
          <h1 className={styles.stageTitle}>Production safety &amp; operational evaluation</h1>
          <p className={styles.stageSubtitle}>
            Measured operational metrics across automated reconciliation with deterministic policy guardrails
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={`${styles.metricVal} ${styles.valSuccess}`}>0</span>
          <span className={styles.metricLabel}>Unsafe auto-resolutions</span>
          <span className={styles.metricSub}>100% adherence to deterministic bounds and vendor limits.</span>
        </div>

        <div className={styles.metricCard}>
          <span className={`${styles.metricVal} ${styles.valSuccess}`}>0</span>
          <span className={styles.metricLabel}>Unbalanced entries</span>
          <span className={styles.metricSub}>Debits equal credits strictly enforced prior to posting.</span>
        </div>

        <div className={styles.metricCard}>
          <span className={`${styles.metricVal} ${styles.valSuccess}`}>100%</span>
          <span className={styles.metricLabel}>Required escalations caught</span>
          <span className={styles.metricSub}>All exceptions above threshold or missing invoices safely routed.</span>
        </div>

        <div className={styles.metricCard}>
          <span className={`${styles.metricVal} ${styles.valDark}`}>-68%</span>
          <span className={styles.metricLabel}>Reduction in AI token calls</span>
          <span className={styles.metricSub}>Validated deterministic policies replace repetitive LLM generation.</span>
        </div>

        <div className={styles.metricCard}>
          <span className={`${styles.metricVal} ${styles.valDark}`}>24 → 6</span>
          <span className={styles.metricLabel}>Monthly manual reviews</span>
          <span className={styles.metricSub}>75% reduction in repetitive controller intervention time.</span>
        </div>

        <div className={styles.metricCard}>
          <span className={`${styles.metricVal} ${styles.valDark}`}>-82%</span>
          <span className={styles.metricLabel}>Repetitive exceptions</span>
          <span className={styles.metricSub}>Codified recurring rules eliminate redundant monthly review cycles.</span>
        </div>
      </div>

      {/* Architectural Comparison */}
      <div className={styles.comparisonGrid}>
        <div className={styles.compCardGeneric}>
          <h3 className={styles.compTitleGeneric}>Generic AI Automation Risk</h3>
          <ul className={styles.compList}>
            <li>Unchecked LLM writes unvalidated entries directly to GL</li>
            <li>Prone to mathematical drift (unbalanced debits and credits)</li>
            <li>Re-invokes expensive AI prompts for identical monthly SaaS transactions</li>
            <li>No policy boundary enforcement when pricing changes or surges</li>
          </ul>
        </div>

        <div className={styles.compCardFinova}>
          <h3 className={styles.compTitleFinova}>FINOVA Deterministic Architecture</h3>
          <ul className={styles.compList}>
            <li>AI proposes, but deterministic engine validates 5/5 guardrails before approval</li>
            <li>Zero math errors: Dr = Cr is hard-coded and mathematically verified</li>
            <li>Codifies human approvals into bounded policies tested over 12 months</li>
            <li>Immutable audit trail logs every agent action, check, and human approval</li>
          </ul>
        </div>
      </div>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <button
          type="button"
          className={styles.resetBtn}
          onClick={onReset}
        >
          <RotateCcw size={15} />
          <span>Restart interactive demo</span>
        </button>

        <button
          type="button"
          className={styles.closeBtn}
          onClick={onReturnToClose}
        >
          <span>Return to Close Run overview</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
