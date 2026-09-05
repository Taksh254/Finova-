"use client";

import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  GitCompare,
  FileWarning,
  UserX,
  Clock,
  ArrowRight,
} from "lucide-react";
import { NeedsAttentionItem } from "@/lib/finance/metrics";
import styles from "./ExceptionsPanel.module.css";

interface ExceptionsPanelProps {
  items: NeedsAttentionItem[];
}

export function ExceptionsPanel({ items }: ExceptionsPanelProps) {
  const getCategoryIcon = (category: NeedsAttentionItem["category"]) => {
    switch (category) {
      case "RECONCILIATION":
        return <GitCompare size={14} color="#60a5fa" />;
      case "INVOICE":
        return <FileWarning size={14} color="#f59e0b" />;
      case "PAYROLL":
        return <UserX size={14} color="#f43f5e" />;
      case "UPCOMING_PAYABLE":
        return <Clock size={14} color="#fbbf24" />;
      default:
        return <AlertTriangle size={14} color="#f59e0b" />;
    }
  };

  const getSeverityClass = (severity: NeedsAttentionItem["severity"]) => {
    switch (severity) {
      case "HIGH":
      case "CRITICAL":
        return styles.severityHigh;
      case "MEDIUM":
        return styles.severityMedium;
      default:
        return styles.severityLow;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <AlertTriangle size={15} color="var(--color-warning)" />
          <h3 className={styles.title}>NEEDS ATTENTION</h3>
          <span className={styles.countBadge}>{items.length} ACTIVE</span>
        </div>

        <Link href="/exceptions" className={styles.viewAll}>
          <span>View All</span>
          <ArrowRight size={12} />
        </Link>
      </div>

      <div className={styles.list}>
        {items.map((item) => (
          <Link key={item.id} href={item.link} className={styles.item}>
            <div className={styles.itemLeft}>
              <div className={styles.iconWrapper}>{getCategoryIcon(item.category)}</div>
              <span className={styles.itemTitle}>{item.title}</span>
            </div>

            <div className={styles.itemRight}>
              <span className={`${styles.severityTag} ${getSeverityClass(item.severity)}`}>
                {item.severity}
              </span>
              <ArrowRight size={13} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
