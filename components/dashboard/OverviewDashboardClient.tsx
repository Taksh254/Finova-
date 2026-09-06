"use client";

import React, { useState } from "react";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CashFlowChart, CashFlowDataPoint } from "@/components/dashboard/CashFlowChart";
import { AICFOCommandCard } from "@/components/dashboard/AICFOCommandCard";
import { QuickActionsBar } from "@/components/dashboard/QuickActionsBar";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { OutstandingInvoicesCard, InvoiceSummaryData } from "@/components/dashboard/OutstandingInvoicesCard";
import { FinancialHealthCard, HealthScoreData } from "@/components/dashboard/FinancialHealthCard";
import { AIInsightsRow, AIInsightData } from "@/components/dashboard/AIInsightsRow";
import { AgentOrchestrator } from "@/components/dashboard/AgentOrchestrator";
import { FinancialModals } from "@/components/dashboard/FinancialModals";
import { Toast } from "@/components/dashboard/Toast";
import { formatINR } from "@/lib/finance/formatting";
import styles from "./OverviewDashboardClient.module.css";

interface MetricBlock {
  current: number;
  changePct: number;
  isPositive: boolean;
}

interface OverviewDashboardClientProps {
  overview: {
    cash: MetricBlock;
    revenue: MetricBlock;
    receivables: { current: number; count: number; overdue: number };
    payables: { current: number; count: number; dueSoon7Days: number };
    healthScore: HealthScoreData;
    invoiceSummary: InvoiceSummaryData;
    insights: AIInsightData[];
    cashFlowTrend: CashFlowDataPoint[];
  };
}

export function OverviewDashboardClient({ overview }: OverviewDashboardClientProps) {
  const [activeModal, setActiveModal] = useState<"create-invoice" | "add-expense" | "record-transaction" | "ask-ai-cfo" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isReconciling, setIsReconciling] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleReconcile = async () => {
    if (isReconciling) return;
    setIsReconciling(true);
    showToast("Running Reconciliation Agent...");
    try {
      const res = await fetch("/api/agents/run", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        const count = json.data.reconciliationProposals?.length ?? 0;
        showToast(
          count > 0
            ? `Reconciliation Agent proposed ${count} new match${count === 1 ? "" : "es"} - review them on the Reconciliation page.`
            : "Reconciliation Agent ran - no new matches found."
        );
      } else {
        showToast(`Reconciliation run failed: ${json.error?.message || "unknown error"}`);
      }
    } catch (error) {
      console.error("Reconciliation run failed:", error);
      showToast("Reconciliation run failed due to a network error.");
    } finally {
      setIsReconciling(false);
    }
  };

  const handleGenerateReport = () => {
    const lines = [
      "FINOVA — FINANCIAL SUMMARY REPORT",
      `Generated: ${new Date().toLocaleString("en-IN")}`,
      "",
      "== CASH POSITION ==",
      `Total Cash: ${formatINR(overview.cash.current, true)} (${overview.cash.isPositive ? "+" : ""}${overview.cash.changePct}% this month)`,
      "",
      "== REVENUE ==",
      `Monthly Revenue: ${formatINR(overview.revenue.current, true)} (${overview.revenue.isPositive ? "+" : ""}${overview.revenue.changePct}% vs last month)`,
      "",
      "== RECEIVABLES ==",
      `Accounts Receivable: ${formatINR(overview.receivables.current, true)} across ${overview.receivables.count} outstanding invoice(s), ${overview.receivables.overdue} overdue`,
      "",
      "== PAYABLES ==",
      `Accounts Payable: ${formatINR(overview.payables.current, true)} across ${overview.payables.count} upcoming payment(s), ${overview.payables.dueSoon7Days} due within 7 days`,
      "",
      "== FINANCIAL HEALTH ==",
      `Overall Score: ${overview.healthScore.score}/100`,
      `  - Liquidity: ${overview.healthScore.components.liquidity}%`,
      `  - Profitability: ${overview.healthScore.components.profitability}%`,
      `  - Growth: ${overview.healthScore.components.growth}%`,
      `  - Expense Control: ${overview.healthScore.components.expenseControl}%`,
      `  - Receivables: ${overview.healthScore.components.receivables}%`,
      `  - Risk: ${overview.healthScore.components.risk}%`,
      "",
      "== INVOICE STATUS ==",
      `Overdue: ${formatINR(overview.invoiceSummary.overdue.amount, true)} (${overview.invoiceSummary.overdue.count})`,
      `Due Soon: ${formatINR(overview.invoiceSummary.dueSoon.amount, true)} (${overview.invoiceSummary.dueSoon.count})`,
      `Pending: ${formatINR(overview.invoiceSummary.pending.amount, true)} (${overview.invoiceSummary.pending.count})`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finova-financial-summary-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Financial summary report downloaded.");
  };

  return (
    <div className={styles.container}>
      {/* Row 1: Top 4 Financial Metric Cards */}
      <div className={styles.metricsGrid}>
        <MetricCard
          label="Total Cash"
          value={formatINR(overview.cash.current, true)}
          changePct={overview.cash.changePct}
          isPositive={overview.cash.isPositive}
          comparisonLabel="this month"
          icon={<Wallet size={14} />}
        />

        <MetricCard
          label="Accounts Receivable"
          value={formatINR(overview.receivables.current, true)}
          subtext={`${overview.receivables.count} outstanding invoices`}
          icon={<ArrowDownLeft size={14} />}
        />

        <MetricCard
          label="Accounts Payable"
          value={formatINR(overview.payables.current, true)}
          subtext={`${overview.payables.count} upcoming payments`}
          icon={<ArrowUpRight size={14} />}
        />

        <MetricCard
          label="Monthly Revenue"
          value={formatINR(overview.revenue.current, true)}
          changePct={overview.revenue.changePct}
          isPositive={overview.revenue.isPositive}
          comparisonLabel="vs last month"
          icon={<TrendingUp size={14} />}
        />
      </div>

      {/* Row 2: Cash Flow Area Chart (68%) & AI CFO Command Center (32%) */}
      <div className={styles.middleRow}>
        <div className={styles.cashFlowCol}>
          <CashFlowChart
            data={overview.cashFlowTrend}
            insight={overview.insights[0] ? { title: overview.insights[0].title, description: overview.insights[0].description } : null}
            onAskCFO={() => setActiveModal("ask-ai-cfo")}
          />
        </div>
        <div className={styles.aiCfoCol}>
          <AICFOCommandCard
            onAction={(action) => {
              showToast(`Opening: ${action}`);
            }}
          />
        </div>
      </div>

      {/* Row 3: Quick Financial Actions Bar */}
      <QuickActionsBar
        onCreateInvoice={() => setActiveModal("create-invoice")}
        onAddExpense={() => setActiveModal("add-expense")}
        onRecordTransaction={() => setActiveModal("record-transaction")}
        onReconcile={handleReconcile}
        onGenerateReport={handleGenerateReport}
        onAskCFO={() => setActiveModal("ask-ai-cfo")}
      />

      {/* Row 4: 3-Column Section: Transactions, Invoices Status, Financial Health */}
      <div className={styles.threeColRow}>
        <div className={styles.recentTxCol}>
          <RecentTransactions />
        </div>
        <div className={styles.invoicesCol}>
          <OutstandingInvoicesCard invoiceSummary={overview.invoiceSummary} />
        </div>
        <div className={styles.healthCol}>
          <FinancialHealthCard healthScore={overview.healthScore} />
        </div>
      </div>

      {/* Row 5: AI Insights Row */}
      <AIInsightsRow insights={overview.insights} onSelectInsight={() => {}} />

      {/* Row 6: Autonomous AI Agent Orchestrator */}
      <AgentOrchestrator
        onTriggerSync={() => showToast("Orchestrator sync initiated across 5 specialized agents.")}
        onApproveBatch={() => showToast("Reconciliation Agent batch approved and posted to ledger.")}
      />

      {/* Interactive Modals */}
      <FinancialModals
        modalType={activeModal}
        onClose={() => setActiveModal(null)}
        onSuccess={(msg) => showToast(msg)}
      />

      {/* Floating Feedback Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
