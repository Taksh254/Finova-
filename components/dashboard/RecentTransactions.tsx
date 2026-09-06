"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./RecentTransactions.module.css";

interface TransactionRecord {
  id: string;
  date: string;
  description: string;
  category: string;
  type: string;
  status: string;
  amount: number;
  account?: { name: string } | null;
}

const ICON_PALETTE = ["#1D3B8F", "#FF9900", "#4285F4", "#0C2340", "#64748B", "#0F766E"];

function iconColorFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return ICON_PALETTE[hash % ICON_PALETTE.length];
}

function statusLabel(tx: TransactionRecord): "Completed" | "Received" | "Pending" {
  if (tx.status === "PENDING") return "Pending";
  if (tx.type === "REVENUE") return "Received";
  return "Completed";
}

function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", { month: "short", day: "2-digit" }).format(new Date(iso));
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/transactions?limit=5")
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.success) setTransactions(json.data);
      })
      .catch((error) => console.error("Failed to load recent transactions:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Transactions</h3>
        <Link href="/transactions" className={styles.viewAllLink}>
          <span>View all</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Description</th>
              <th className={styles.th}>Category</th>
              <th className={styles.th}>Account</th>
              <th className={styles.th}>Status</th>
              <th className={`${styles.th} ${styles.thAmount}`}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {!loading && transactions.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.tdDesc}>
                  No transactions yet.
                </td>
              </tr>
            )}
            {transactions.map((tx) => {
              const status = statusLabel(tx);
              const isCredit = tx.type === "REVENUE";
              return (
                <tr key={tx.id} className={styles.tr}>
                  <td className={styles.tdDate}>{formatShortDate(tx.date)}</td>
                  <td className={styles.tdDesc}>
                    <div className={styles.descCell}>
                      <div className={styles.vendorIcon} style={{ backgroundColor: iconColorFor(tx.description) }}>
                        {tx.description.charAt(0).toUpperCase()}
                      </div>
                      <span className={styles.descText}>{tx.description}</span>
                    </div>
                  </td>
                  <td className={styles.tdCategory}>{tx.category}</td>
                  <td className={styles.tdAccount}>{tx.account?.name ?? "—"}</td>
                  <td className={styles.tdStatus}>
                    <span
                      className={`${styles.statusPill} ${
                        status === "Received" ? styles.statusReceived : styles.statusCompleted
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className={`${styles.tdAmount} tabular-nums`}>
                    <span className={isCredit ? styles.amountCredit : styles.amountDebit}>
                      {isCredit ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
