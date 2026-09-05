import React from "react";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import styles from "./MetricCard.module.css";

interface MetricCardProps {
  label: string;
  value: string;
  changePct?: number;
  isPositive?: boolean;
  comparisonLabel?: string;
  subtext?: string;
  icon?: React.ReactNode;
  sparklinePoints?: string; // e.g. "0,25 20,22 40,24 60,18 80,12 100,5"
}

export function MetricCard({
  label,
  value,
  changePct,
  isPositive = true,
  comparisonLabel = "this month",
  subtext,
  icon,
  sparklinePoints = "0,28 20,24 40,26 60,19 80,15 100,8",
}: MetricCardProps) {
  const hasChange = typeof changePct === "number";

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.labelGroup}>
          {icon && <div className={styles.iconWrapper}>{icon}</div>}
          <span className={styles.label}>{label}</span>
        </div>
        <button className={styles.moreButton} aria-label="Details" title="Metric details">
          <MoreHorizontal size={14} />
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.valueRow}>
          <span className={`${styles.value} tabular-nums`}>{value}</span>
        </div>

        <div className={styles.footer}>
          {hasChange ? (
            <span
              className={`${styles.trendBadge} ${
                isPositive ? styles.badgePositive : styles.badgeNegative
              }`}
            >
              {isPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
              {changePct > 0 ? `+${changePct}%` : `${changePct}%`}
            </span>
          ) : null}
          <span className={styles.comparisonText}>{subtext || comparisonLabel}</span>
        </div>
      </div>

      {/* Sleek Finova Sparkline Wave in Card Corner */}
      <div className={styles.sparklineContainer}>
        <svg viewBox="0 0 100 35" preserveAspectRatio="none" className={styles.sparklineSvg}>
          <defs>
            <linearGradient id={`grad-${label.replace(/\s+/g, "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1D3B8F" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#1D3B8F" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <polygon
            points={`0,35 ${sparklinePoints} 100,35`}
            fill={`url(#grad-${label.replace(/\s+/g, "")})`}
          />
          <polyline
            points={sparklinePoints}
            fill="none"
            stroke="#1D3B8F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
