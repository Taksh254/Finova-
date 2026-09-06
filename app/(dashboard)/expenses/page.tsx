"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Receipt, Plus } from "lucide-react";
import { formatINR, formatDate } from "@/lib/finance/formatting";
import { FinancialModals } from "@/components/dashboard/FinancialModals";
import { Toast } from "@/components/dashboard/Toast";
import styles from "../invoices/InvoicesPage.module.css";

interface ExpenseRecord {
  id: string;
  date: string;
  category: string;
  vendor?: string | null;
  description: string;
  amount: number;
  account?: { name: string } | null;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch("/api/expenses");
      const json = await res.json();
      if (json.success) setExpenses(json.data);
    } catch (error) {
      console.error("Failed to load expenses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = new Map<string, number>();
  for (const e of expenses) byCategory.set(e.category, (byCategory.get(e.category) || 0) + e.amount);
  const topCategory = Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}>
            <Receipt size={20} />
          </div>
          <div>
            <h2 className={styles.title}>Expenses</h2>
            <p className={styles.subtitle}>Corporate spend across every category and vendor.</p>
          </div>
        </div>
        <button className={styles.createBtn} onClick={() => setModalOpen(true)}>
          <Plus size={14} /> Add Expense
        </button>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Total Recorded</span>
          <div className={styles.summaryValue}>{formatINR(total, true)}</div>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Top Category</span>
          <div className={styles.summaryValue}>{topCategory ? topCategory[0] : "—"}</div>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Entries</span>
          <div className={styles.summaryValue}>{expenses.length}</div>
        </div>
      </div>

      {loading ? (
        <div className={styles.emptyState}>Loading expenses...</div>
      ) : expenses.length === 0 ? (
        <div className={styles.emptyState}>No expenses recorded yet.</div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Vendor</th>
                <th>Category</th>
                <th>Account</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id}>
                  <td>{formatDate(e.date)}</td>
                  <td>{e.vendor || e.description}</td>
                  <td>{e.category}</td>
                  <td>{e.account?.name ?? "—"}</td>
                  <td>{formatINR(e.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FinancialModals
        modalType={modalOpen ? "add-expense" : null}
        onClose={() => setModalOpen(false)}
        onSuccess={(msg) => {
          setToastMessage(msg);
          fetchExpenses();
        }}
      />
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
