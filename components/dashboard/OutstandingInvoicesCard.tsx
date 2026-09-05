"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import styles from "./OutstandingInvoicesCard.module.css";

interface OutstandingInvoicesCardProps {
  totalAmount?: string;
  totalCount?: number;
}

export function OutstandingInvoicesCard({
  totalAmount = "₹3.72L",
  totalCount = 12,
}: OutstandingInvoicesCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Outstanding Invoices</h3>
        <Link href="/invoices" className={styles.viewAllLink}>
          <span>View all</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className={styles.valueRow}>
        <div className={styles.numberGroup}>
          <span className={`${styles.mainValue} tabular-nums`}>{totalAmount}</span>
          <span className={styles.invoiceCount}>{totalCount} invoices</span>
        </div>
        <div className={styles.iconCircle}>
          <FileText size={18} />
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className={styles.progressBar}>
        <div className={styles.segmentOverdue} style={{ width: "33%" }} title="Overdue: ₹1.24L" />
        <div className={styles.segmentDueWeek} style={{ width: "29%" }} title="Due this week: ₹1.08L" />
        <div className={styles.segmentDueLater} style={{ width: "38%" }} title="Due later: ₹1.40L" />
      </div>

      {/* Legend Breakdown */}
      <div className={styles.legendGrid}>
        <div className={styles.legendItem}>
          <span className={styles.dotOverdue} />
          <div className={styles.legendMeta}>
            <span className={styles.legendLabel}>Overdue</span>
            <span className={styles.legendValue}>₹1.24L (4)</span>
          </div>
        </div>

        <div className={styles.legendItem}>
          <span className={styles.dotDueWeek} />
          <div className={styles.legendMeta}>
            <span className={styles.legendLabel}>Due this week</span>
            <span className={styles.legendValue}>₹1.08L (3)</span>
          </div>
        </div>

        <div className={styles.legendItem}>
          <span className={styles.dotDueLater} />
          <div className={styles.legendMeta}>
            <span className={styles.legendLabel}>Due later</span>
            <span className={styles.legendValue}>₹1.40L (5)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
