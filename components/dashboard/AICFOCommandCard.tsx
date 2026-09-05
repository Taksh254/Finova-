"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, AlertCircle, TrendingUp, ShieldAlert, Sparkles } from "lucide-react";
import styles from "./AICFOCommandCard.module.css";

interface AICFOCommandCardProps {
  onAction?: (actionType: string) => void;
}

export function AICFOCommandCard({ onAction }: AICFOCommandCardProps) {
  return (
    <div className={styles.card}>
      {/* Background Orbital Rings Graphic */}
      <div className={styles.orbitalAura}>
        <div className={styles.ring1} />
        <div className={styles.ring2} />
        <div className={styles.ring3} />
        <div className={styles.glowingCore} />
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>AI CFO</h3>
            <span className={styles.monitoringBadge}>
              <span className={styles.greenDot} />
              Monitoring
            </span>
          </div>
          <p className={styles.attentionCount}>3 things need your attention.</p>
        </div>
      </div>

      {/* Priority Alerts List */}
      <div className={styles.alertList}>
        {/* Item 01 */}
        <div className={styles.alertItem}>
          <div className={`${styles.iconBadge} ${styles.redBadge}`}>
            <ShieldAlert size={14} />
          </div>
          <div className={styles.alertContent}>
            <div className={styles.alertTitle}>3 invoices are overdue (₹84,500)</div>
            <div className={styles.alertSubtext}>4 invoices are more than 15 days overdue.</div>
            <Link
              href="/invoices"
              className={styles.actionLink}
              onClick={() => onAction && onAction("review-invoices")}
            >
              <span>Review invoices</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Item 02 */}
        <div className={styles.alertItem}>
          <div className={`${styles.iconBadge} ${styles.amberBadge}`}>
            <AlertCircle size={14} />
          </div>
          <div className={styles.alertContent}>
            <div className={styles.alertTitle}>Cash flow may tighten in 18 days</div>
            <div className={styles.alertSubtext}>
              Marketing expenses increased 18% this month (₹42,000 above average).
            </div>
            <Link
              href="/expenses"
              className={styles.actionLink}
              onClick={() => onAction && onAction("investigate-expenses")}
            >
              <span>Investigate</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Item 03 */}
        <div className={styles.alertItem}>
          <div className={`${styles.iconBadge} ${styles.emeraldBadge}`}>
            <TrendingUp size={14} />
          </div>
          <div className={styles.alertContent}>
            <div className={styles.alertTitle}>₹27,400 duplicate expense flagged</div>
            <div className={styles.alertSubtext}>
              Cash runway improved by 21 days based on current inflows and collections.
            </div>
            <Link
              href="/reconciliation"
              className={styles.actionLink}
              onClick={() => onAction && onAction("view-recommendations")}
            >
              <span>Review recommendations</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Motto */}
      <div className={styles.footer}>
        <span className={styles.footerMotto}>&ldquo;Proactive insights. Real impact.&rdquo;</span>
        <Sparkles size={13} className={styles.footerSparkle} />
      </div>
    </div>
  );
}
