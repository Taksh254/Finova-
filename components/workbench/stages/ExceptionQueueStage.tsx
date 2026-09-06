"use client";

import React from "react";
import { ArrowRight, AlertCircle, ShieldAlert } from "lucide-react";
import styles from "./ExceptionQueueStage.module.css";

interface ExceptionItem {
  id: string;
  name: string;
  amount: string;
  date: string;
  status: "Unmatched" | "Blocked";
  reason: string;
  reference: string;
  vendor: string;
}

const exceptions: ExceptionItem[] = [
  {
    id: "exc-cloudflare",
    name: "CLOUDFLARE*PRO",
    amount: "₹1,00,000",
    date: "Sep 12, 2026",
    status: "Unmatched",
    reason: "No matching GL entry found",
    reference: "CF-928374",
    vendor: "Cloudflare",
  },
  {
    id: "exc-duplicate",
    name: "Duplicate payment",
    amount: "₹50,000",
    date: "Sep 18, 2026",
    status: "Blocked",
    reason: "Possible duplicate of txn on Sep 05",
    reference: "AWS-88192",
    vendor: "Amazon Web Services",
  },
];

interface ExceptionQueueStageProps {
  selectedId: string;
  onSelect: (id: string) => void;
  onInvestigate: (id: string) => void;
}

export function ExceptionQueueStage({
  selectedId,
  onSelect,
  onInvestigate,
}: ExceptionQueueStageProps) {
  const current = exceptions.find((e) => e.id === selectedId) || exceptions[0];

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <span className={styles.stageEyebrow}>2/9 Exception queue</span>
          <h1 className={styles.stageTitle}>Review and resolve exceptions</h1>
          <p className={styles.stageSubtitle}>
            2 transactions flagged for review in September 2026
          </p>
        </div>
      </div>

      <div className={styles.queueSplit}>
        {/* Left List */}
        <div className={styles.listCol}>
          <div className={styles.listHeader}>
            <span className={styles.countText}>2 exceptions</span>
            <button type="button" className={styles.sortSelector}>
              Sort: Date ▾
            </button>
          </div>

          {exceptions.map((exc) => {
            const isSelected = exc.id === selectedId;
            return (
              <div
                key={exc.id}
                className={`${styles.exceptionCard} ${isSelected ? styles.cardActive : ""}`}
                onClick={() => onSelect(exc.id)}
              >
                <div className={styles.cardTop}>
                  <div className={styles.cardTitleArea}>
                    <span className={styles.dotRed} />
                    <span className={styles.vendorName}>{exc.name}</span>
                  </div>
                  <span className={styles.amount}>{exc.amount}</span>
                </div>

                <div className={styles.cardBottom}>
                  <span className={styles.txDate}>{exc.date}</span>
                  <span
                    className={`${styles.statusPill} ${
                      exc.status === "Unmatched" ? styles.pillUnmatched : styles.pillBlocked
                    }`}
                  >
                    {exc.status}
                  </span>
                </div>

                <div className={styles.reasonText}>{exc.reason}</div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Panel */}
        <div className={styles.detailPanel}>
          <div>
            <h2 className={styles.detailHeading}>Exception details</h2>

            <div className={styles.detailFields}>
              <div className={styles.fieldRow}>
                <span className={styles.fieldKey}>Status</span>
                <span
                  className={`${styles.statusPill} ${
                    current.status === "Unmatched" ? styles.pillUnmatched : styles.pillBlocked
                  }`}
                >
                  {current.status}
                </span>
              </div>

              <div className={styles.fieldRow}>
                <span className={styles.fieldKey}>Reason</span>
                <span className={styles.fieldVal}>{current.reason}</span>
              </div>

              <div className={styles.fieldRow}>
                <span className={styles.fieldKey}>Date</span>
                <span className={styles.fieldVal}>{current.date}</span>
              </div>

              <div className={styles.fieldRow}>
                <span className={styles.fieldKey}>Amount</span>
                <span className={styles.fieldValMono}>{current.amount}</span>
              </div>

              <div className={styles.fieldRow}>
                <span className={styles.fieldKey}>Description</span>
                <span className={styles.fieldVal}>{current.name}</span>
              </div>

              <div className={styles.fieldRow}>
                <span className={styles.fieldKey}>Bank reference</span>
                <span className={styles.fieldValMono}>{current.reference}</span>
              </div>

              <div className={styles.fieldRow}>
                <span className={styles.fieldKey}>Vendor</span>
                <span className={styles.fieldVal}>{current.vendor}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className={styles.investigateBtn}
            onClick={() => onInvestigate(current.id)}
          >
            <span>{current.id === "exc-duplicate" ? "Inspect duplicate" : "Investigate"}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
