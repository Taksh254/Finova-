"use client";

import React from "react";
import styles from "./FinancialHealthCard.module.css";

export interface HealthScoreData {
  score: number;
  components: {
    liquidity: number;
    profitability: number;
    growth: number;
    expenseControl: number;
    receivables: number;
    risk: number;
  };
}

interface FinancialHealthCardProps {
  healthScore?: HealthScoreData;
}

function verdictFor(score: number): string {
  if (score >= 75) return "Healthy";
  if (score >= 50) return "Fair";
  return "At Risk";
}

export function FinancialHealthCard({ healthScore }: FinancialHealthCardProps) {
  const score = healthScore?.score ?? 0;
  const c = healthScore?.components;

  const metrics = [
    { label: "Cash health", value: c?.liquidity ?? 0 },
    { label: "Profitability", value: c?.profitability ?? 0 },
    { label: "Collections", value: c?.receivables ?? 0 },
    { label: "Expense control", value: c?.expenseControl ?? 0 },
  ];

  const circumference = 2 * Math.PI * 34; // r=34
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Financial Health</h3>

      <div className={styles.contentRow}>
        {/* Radial Gauge */}
        <div className={styles.gaugeArea}>
          <svg className={styles.gaugeSvg} viewBox="0 0 84 84">
            <circle cx="42" cy="42" r="34" className={styles.gaugeBgCircle} strokeWidth="7" />
            <circle
              cx="42"
              cy="42"
              r="34"
              className={styles.gaugeFillCircle}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className={styles.gaugeTextGroup}>
            <span className={styles.scoreNumber}>{score}</span>
            <span className={styles.scoreMax}>/100</span>
            <span className={styles.scoreVerdict}>{verdictFor(score)}</span>
          </div>
        </div>

        {/* Metrics Horizontal Progress Bars */}
        <div className={styles.metricsList}>
          {metrics.map((m) => (
            <div key={m.label} className={styles.metricItem}>
              <div className={styles.metricMeta}>
                <span className={styles.metricLabel}>{m.label}</span>
                <span className={styles.metricValue}>{m.value}%</span>
              </div>
              <div className={styles.track}>
                <div className={styles.fill} style={{ width: `${m.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
