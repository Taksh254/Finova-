"use client";

import React from "react";
import {
  Plus,
  ArrowLeftRight,
  GitCompare,
  FileSpreadsheet,
  Sparkles,
} from "lucide-react";
import styles from "./QuickActionsBar.module.css";

interface QuickActionsBarProps {
  onCreateInvoice: () => void;
  onAddExpense: () => void;
  onRecordTransaction: () => void;
  onReconcile: () => void;
  onGenerateReport: () => void;
  onAskCFO: () => void;
}

export function QuickActionsBar({
  onCreateInvoice,
  onAddExpense,
  onRecordTransaction,
  onReconcile,
  onGenerateReport,
  onAskCFO,
}: QuickActionsBarProps) {
  return (
    <div className={styles.actionBar}>
      {/* Primary Action */}
      <button
        className={`${styles.actionBtn} ${styles.btnPrimary}`}
        onClick={onCreateInvoice}
        id="btn-create-invoice"
      >
        <Plus size={14} />
        <span>Create Invoice</span>
      </button>

      {/* Secondary Actions */}
      <button
        className={`${styles.actionBtn} ${styles.btnSecondary}`}
        onClick={onAddExpense}
        id="btn-add-expense"
      >
        <Plus size={14} />
        <span>Add Expense</span>
      </button>

      <button
        className={`${styles.actionBtn} ${styles.btnSecondary}`}
        onClick={onRecordTransaction}
        id="btn-record-tx"
      >
        <ArrowLeftRight size={14} />
        <span>Record Transaction</span>
      </button>

      <button
        className={`${styles.actionBtn} ${styles.btnSecondary}`}
        onClick={onReconcile}
        id="btn-reconcile"
      >
        <GitCompare size={14} />
        <span>Reconcile Account</span>
      </button>

      <button
        className={`${styles.actionBtn} ${styles.btnSecondary}`}
        onClick={onGenerateReport}
        id="btn-generate-report"
      >
        <FileSpreadsheet size={14} />
        <span>Generate Report</span>
      </button>

      {/* AI CFO Action */}
      <button
        className={`${styles.actionBtn} ${styles.btnAICFO}`}
        onClick={onAskCFO}
        id="btn-ask-ai-cfo"
      >
        <Sparkles size={14} className={styles.sparkleIcon} />
        <span>Ask AI CFO</span>
      </button>
    </div>
  );
}
