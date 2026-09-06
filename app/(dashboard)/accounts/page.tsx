"use client";

import React, { useEffect, useState } from "react";
import { Landmark } from "lucide-react";
import { formatINR } from "@/lib/finance/formatting";
import styles from "../invoices/InvoicesPage.module.css";

interface AccountRecord {
  id: string;
  name: string;
  type: string;
  currency: string;
  balance: number;
  status: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/accounts")
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.success) setAccounts(json.data);
      })
      .catch((error) => console.error("Failed to load accounts:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const total = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}>
            <Landmark size={20} />
          </div>
          <div>
            <h2 className={styles.title}>Accounts &amp; Banking</h2>
            <p className={styles.subtitle}>Bank, cash, and card accounts that transactions clear against.</p>
          </div>
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Total Balance</span>
          <div className={styles.summaryValue}>{formatINR(total, true)}</div>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Active Accounts</span>
          <div className={styles.summaryValue}>{accounts.length}</div>
        </div>
      </div>

      {loading ? (
        <div className={styles.emptyState}>Loading accounts...</div>
      ) : accounts.length === 0 ? (
        <div className={styles.emptyState}>No accounts configured yet.</div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Account</th>
                <th>Type</th>
                <th>Currency</th>
                <th>Status</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr key={acc.id}>
                  <td>{acc.name}</td>
                  <td>{acc.type}</td>
                  <td>{acc.currency}</td>
                  <td>{acc.status}</td>
                  <td>{formatINR(acc.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
