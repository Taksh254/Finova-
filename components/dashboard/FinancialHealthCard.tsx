"use client";

import React from "react";
import styles from "./FinancialHealthCard.module.css";

interface HealthMetric {
  label: string;
  value: number;
}

const metrics: HealthMetric[] = [
  { label: "Cash health", value: 92 },
  { label: "Profitability", value: 91 },
  { label: "Collections", value: 74 },
  { label: "Expense control", value: 84 },
];

export function FinancialHealthCard() {
  const score = 86;
  const circumference = 2 * Math.PI * 34; // r=34
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Financial Health</h3>

      <div className={styles.contentRow}>
        {/* Radial Gauge */}
        <div className={styles.gaugeArea}>
          <svg className={styles.gaugeSvg} viewBox="0 0 84 84">
            <circle
              cx="42"
              cy="42"
              r="34"
              className={styles.gaugeBgCircle}
              strokeWidth="7"
            />
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
            <span className={styles.scoreVerdict}>Healthy</span>
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
                <div
                  className={styles.fill}
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
