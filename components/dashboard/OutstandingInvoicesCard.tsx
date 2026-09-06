"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { formatINR } from "@/lib/finance/formatting";
import styles from "./OutstandingInvoicesCard.module.css";

export interface InvoiceSummaryBucket {
  amount: number;
  count: number;
}

export interface InvoiceSummaryData {
  overdue: InvoiceSummaryBucket;
  dueSoon: InvoiceSummaryBucket;
  pending: InvoiceSummaryBucket;
}

interface OutstandingInvoicesCardProps {
  invoiceSummary?: InvoiceSummaryData;
}

export function OutstandingInvoicesCard({ invoiceSummary }: OutstandingInvoicesCardProps) {
  const overdue = invoiceSummary?.overdue ?? { amount: 0, count: 0 };
  const dueSoon = invoiceSummary?.dueSoon ?? { amount: 0, count: 0 };
  const pending = invoiceSummary?.pending ?? { amount: 0, count: 0 };

  // "Due later" = pending invoices not already captured in the due-soon (7-day) window.
  const dueLater = { amount: Math.max(0, pending.amount - dueSoon.amount), count: Math.max(0, pending.count - dueSoon.count) };
  const total = overdue.amount + dueSoon.amount + dueLater.amount;
  const totalCount = overdue.count + dueSoon.count + dueLater.count;

  const pct = (n: number) => (total > 0 ? `${Math.max((n / total) * 100, 2)}%` : "0%");

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
          <span className={`${styles.mainValue} tabular-nums`}>{formatINR(total, true)}</span>
          <span className={styles.invoiceCount}>{totalCount} invoices</span>
        </div>
        <div className={styles.iconCircle}>
          <FileText size={18} />
        </div>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.segmentOverdue} style={{ width: pct(overdue.amount) }} title={`Overdue: ${formatINR(overdue.amount, true)}`} />
        <div className={styles.segmentDueWeek} style={{ width: pct(dueSoon.amount) }} title={`Due this week: ${formatINR(dueSoon.amount, true)}`} />
        <div className={styles.segmentDueLater} style={{ width: pct(dueLater.amount) }} title={`Due later: ${formatINR(dueLater.amount, true)}`} />
      </div>

      <div className={styles.legendGrid}>
        <div className={styles.legendItem}>
          <span className={styles.dotOverdue} />
          <div className={styles.legendMeta}>
            <span className={styles.legendLabel}>Overdue</span>
            <span className={styles.legendValue}>{formatINR(overdue.amount, true)} ({overdue.count})</span>
          </div>
        </div>

        <div className={styles.legendItem}>
          <span className={styles.dotDueWeek} />
          <div className={styles.legendMeta}>
            <span className={styles.legendLabel}>Due this week</span>
            <span className={styles.legendValue}>{formatINR(dueSoon.amount, true)} ({dueSoon.count})</span>
          </div>
        </div>

        <div className={styles.legendItem}>
          <span className={styles.dotDueLater} />
          <div className={styles.legendMeta}>
            <span className={styles.legendLabel}>Due later</span>
            <span className={styles.legendValue}>{formatINR(dueLater.amount, true)} ({dueLater.count})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
