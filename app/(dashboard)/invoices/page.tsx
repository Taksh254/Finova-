"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FileText, Plus } from "lucide-react";
import { formatINR, formatDate } from "@/lib/finance/formatting";
import { FinancialModals } from "@/components/dashboard/FinancialModals";
import { Toast } from "@/components/dashboard/Toast";
import styles from "./InvoicesPage.module.css";

interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  type: "RECEIVABLE" | "PAYABLE";
  vendorClient: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: string;
  customer?: { name: string } | null;
}

type TabKey = "all" | "overdue" | "pending" | "paid";

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "overdue", label: "Overdue" },
  { key: "pending", label: "Pending" },
  { key: "paid", label: "Paid" },
];

function statusClass(status: string): string {
  if (status === "PAID") return styles.statusPaid;
  if (status === "OVERDUE") return styles.statusOverdue;
  if (status === "PENDING") return styles.statusPending;
  return styles.statusOther;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Read the initial tab from ?filter=overdue style deep links (e.g. from the
  // AI CFO command card) without needing a useSearchParams() Suspense boundary.
  useEffect(() => {
    const filter = new URLSearchParams(window.location.search).get("filter") as TabKey | null;
    if (filter && TABS.some((t) => t.key === filter)) setTab(filter);
  }, []);

  const fetchInvoices = useCallback(async () => {
    try {
      const res = await fetch("/api/invoices");
      const json = await res.json();
      if (json.success) setInvoices(json.data);
    } catch (error) {
      console.error("Failed to load invoices:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filtered = useMemo(() => {
    if (tab === "all") return invoices;
    if (tab === "overdue") return invoices.filter((i) => i.status === "OVERDUE");
    if (tab === "pending") return invoices.filter((i) => i.status === "PENDING");
    return invoices.filter((i) => i.status === "PAID");
  }, [invoices, tab]);

  const receivableTotal = invoices.filter((i) => i.type === "RECEIVABLE" && i.status !== "PAID").reduce((s, i) => s + i.amount, 0);
  const payableTotal = invoices.filter((i) => i.type === "PAYABLE" && i.status !== "PAID").reduce((s, i) => s + i.amount, 0);
  const overdueTotal = invoices.filter((i) => i.status === "OVERDUE").reduce((s, i) => s + i.amount, 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}>
            <FileText size={20} />
          </div>
          <div>
            <h2 className={styles.title}>Invoices &amp; Payables</h2>
            <p className={styles.subtitle}>Receivables owed to you and payables you owe vendors, in one ledger.</p>
          </div>
        </div>
        <button className={styles.createBtn} onClick={() => setModalOpen(true)}>
          <Plus size={14} /> New Invoice
        </button>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Outstanding Receivables</span>
          <div className={styles.summaryValue}>{formatINR(receivableTotal, true)}</div>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Outstanding Payables</span>
          <div className={styles.summaryValue}>{formatINR(payableTotal, true)}</div>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Overdue</span>
          <div className={styles.summaryValue}>{formatINR(overdueTotal, true)}</div>
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
        <div className={styles.emptyState}>Loading invoices...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>No invoices in this view.</div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Type</th>
                <th>Client / Vendor</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.invoiceNumber}</td>
                  <td>{inv.type}</td>
                  <td>{inv.customer?.name || inv.vendorClient}</td>
                  <td>{formatDate(inv.issueDate)}</td>
                  <td>{formatDate(inv.dueDate)}</td>
                  <td>{formatINR(inv.amount)}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${statusClass(inv.status)}`}>{inv.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FinancialModals
        modalType={modalOpen ? "create-invoice" : null}
        onClose={() => setModalOpen(false)}
        onSuccess={(msg) => {
          setToastMessage(msg);
          fetchInvoices();
        }}
      />
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
