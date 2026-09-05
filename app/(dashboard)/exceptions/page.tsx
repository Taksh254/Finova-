import React from "react";
import { AlertTriangle } from "lucide-react";
import prisma from "@/lib/db/prisma";
import { formatINR, formatDate } from "@/lib/finance/formatting";
import styles from "./ExceptionsPage.module.css";

export const dynamic = "force-dynamic";

export default async function ExceptionsPage() {
  const exceptions = await prisma.exception.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.iconBox}>
            <AlertTriangle size={22} color="var(--color-warning)" />
          </div>
          <div>
            <h2 className={styles.title}>Financial Exceptions &amp; Anomaly Queue</h2>
            <p className={styles.subtitle}>
              Active discrepancies identified by Finova automated rules &amp; ML observation engines
            </p>
          </div>
        </div>
        <div className={styles.metaBadge}>
          {exceptions.filter((e) => e.status === "OPEN").length} OPEN ANOMALIES
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Severity</th>
              <th>Description</th>
              <th>Status</th>
              <th>Logged</th>
            </tr>
          </thead>
          <tbody>
            {exceptions.map((exc) => (
              <tr key={exc.id}>
                <td>
                  <span className={styles.typeBadge}>{exc.type}</span>
                </td>
                <td>
                  <span
                    className={`${styles.severityBadge} ${
                      exc.severity === "HIGH"
                        ? styles.sevHigh
                        : exc.severity === "MEDIUM"
                        ? styles.sevMed
                        : styles.sevLow
                    }`}
                  >
                    {exc.severity}
                  </span>
                </td>
                <td>
                  <div className={styles.descCell}>
                    <span className={styles.descTitle}>{exc.title}</span>
                    <span className={styles.descDetail}>{exc.description}</span>
                  </div>
                </td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      exc.status === "OPEN" ? styles.statusOpen : styles.statusReview
                    }`}
                  >
                    {exc.status}
                  </span>
                </td>
                <td className={styles.dateCell}>{formatDate(exc.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
