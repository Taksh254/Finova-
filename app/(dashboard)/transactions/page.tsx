"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { formatINR, formatDate } from "@/lib/finance/formatting";
import styles from "./TransactionsPage.module.css";

interface TransactionRecord {
  id: string;
  date: string;
  type: "REVENUE" | "EXPENSE" | "TRANSFER";
  category: string;
  vendor?: string | null;
  description: string;
  status: string;
  amount: number;
  account?: { name: string } | null;
}

type TabKey = "all" | "REVENUE" | "EXPENSE" | "TRANSFER";

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "REVENUE", label: "Revenue" },
  { key: "EXPENSE", label: "Expense" },
  { key: "TRANSFER", label: "Transfer" },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("all");

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch("/api/transactions?limit=200");
      const json = await res.json();
      if (json.success) setTransactions(json.data);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filtered = useMemo(
    () => (tab === "all" ? transactions : transactions.filter((t) => t.type === tab)),
    [transactions, tab]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}>
            <ArrowLeftRight size={20} />
          </div>
          <div>
            <h2 className={styles.title}>Transactions</h2>
            <p className={styles.subtitle}>Multi-account ledger feed with automated categorization.</p>
          </div>
        </div>
      </div>

      <div className={styles.tabsRow}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`${styles.tab} ${tab === t.key ? styles.tabActive : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.emptyState}>Loading transactions...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>No transactions in this view.</div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Account</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr key={tx.id}>
                  <td>{formatDate(tx.date)}</td>
                  <td>{tx.description}</td>
                  <td>{tx.category}</td>
                  <td>{tx.account?.name ?? "—"}</td>
                  <td>{tx.status}</td>
                  <td className={tx.type === "REVENUE" ? styles.amountCredit : styles.amountDebit}>
                    {tx.type === "REVENUE" ? "+" : "-"}
                    {formatINR(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
