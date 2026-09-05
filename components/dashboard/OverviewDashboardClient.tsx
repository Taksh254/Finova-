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
import { OutstandingInvoicesCard } from "@/components/dashboard/OutstandingInvoicesCard";
import { FinancialHealthCard } from "@/components/dashboard/FinancialHealthCard";
import { AIInsightsRow } from "@/components/dashboard/AIInsightsRow";
import { AgentOrchestrator } from "@/components/dashboard/AgentOrchestrator";
import { FinancialModals } from "@/components/dashboard/FinancialModals";
import { Toast } from "@/components/dashboard/Toast";
import styles from "./OverviewDashboardClient.module.css";

interface OverviewDashboardClientProps {
  metrics: {
    revenue: { current: number; changePct: number; isPositive: boolean };
    expenses: { current: number; changePct: number; isPositive: boolean };
    cashPosition: { current: number; changePct: number; isPositive: boolean };
    accountsReceivable: { current: number; count: number; overdue: number };
    accountsPayable: { current: number; count: number; dueSoon7Days: number };
  };
  cashFlowData: CashFlowDataPoint[];
}

export function OverviewDashboardClient({
  metrics,
  cashFlowData,
}: OverviewDashboardClientProps) {
  const [activeModal, setActiveModal] = useState<"create-invoice" | "add-expense" | "ask-ai-cfo" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  return (
    <div className={styles.container}>
      {/* Row 1: Top 4 Financial Metric Cards */}
      <div className={styles.metricsGrid}>
        {/* 1. Total Cash */}
        <MetricCard
          label="Total Cash"
          value="₹12.4L"
          changePct={8.4}
          isPositive={true}
          comparisonLabel="this month"
          icon={<Wallet size={14} />}
          sparklinePoints="0,30 20,26 40,24 60,18 80,12 100,6"
        />

        {/* 2. Accounts Receivable */}
        <MetricCard
          label="Accounts Receivable"
          value="₹4.8L"
          subtext="12 outstanding invoices"
          icon={<ArrowDownLeft size={14} />}
          sparklinePoints="0,28 20,24 40,26 60,20 80,16 100,10"
        />

        {/* 3. Accounts Payable */}
        <MetricCard
          label="Accounts Payable"
          value="₹2.1L"
          subtext="7 upcoming payments"
          icon={<ArrowUpRight size={14} />}
          sparklinePoints="0,18 20,22 40,19 60,24 80,21 100,16"
        />

        {/* 4. Monthly Revenue */}
        <MetricCard
          label="Monthly Revenue"
          value="₹8.6L"
          changePct={14.2}
          isPositive={true}
          comparisonLabel="vs last month"
          icon={<TrendingUp size={14} />}
          sparklinePoints="0,32 20,27 40,22 60,16 80,11 100,4"
        />
      </div>

      {/* Row 2: Cash Flow Area Chart (68%) & AI CFO Command Center (32%) */}
      <div className={styles.middleRow}>
        <div className={styles.cashFlowCol}>
          <CashFlowChart
            data={cashFlowData}
            onAskCFO={() => setActiveModal("ask-ai-cfo")}
          />
        </div>
        <div className={styles.aiCfoCol}>
          <AICFOCommandCard
            onAction={(action) => {
              if (action === "review-invoices") {
                showToast("Opening 3 overdue invoices (₹84,500 total)...");
              } else if (action === "investigate-expenses") {
                showToast("Scanning August marketing spend anomalies (+18%)...");
              } else {
                showToast("Analyzing duplicate SaaS subscriptions across departments...");
              }
            }}
          />
        </div>
      </div>

      {/* Row 3: Quick Financial Actions Bar */}
      <QuickActionsBar
        onCreateInvoice={() => setActiveModal("create-invoice")}
        onAddExpense={() => setActiveModal("add-expense")}
        onRecordTransaction={() => showToast("Transaction recorder initialized. Syncing bank feeds...")}
        onReconcile={() => showToast("Reconciliation Agent triggered: verifying 82 transaction hashes...")}
        onGenerateReport={() => showToast("Financial Report Generator compiled August 2025 statement.")}
        onAskCFO={() => setActiveModal("ask-ai-cfo")}
      />

      {/* Row 4: 3-Column Section: Transactions, Invoices Status, Financial Health */}
      <div className={styles.threeColRow}>
        <div className={styles.recentTxCol}>
          <RecentTransactions />
        </div>
        <div className={styles.invoicesCol}>
          <OutstandingInvoicesCard totalAmount="₹3.72L" totalCount={12} />
        </div>
        <div className={styles.healthCol}>
          <FinancialHealthCard />
        </div>
      </div>

      {/* Row 5: AI Insights Row */}
      <AIInsightsRow
        onSelectInsight={(id) => {
          if (id === "revenue-accelerating") {
            showToast("Opening revenue acceleration breakdown (3 enterprise contracts)...");
          } else if (id === "vendor-pricing") {
            showToast("Reviewing vendor price escalations across AWS, Notion, Figma...");
          } else {
            showToast("Displaying 4 underutilized software licenses (₹28,000 potential savings)...");
          }
        }}
      />

      {/* Row 6: Autonomous AI Agent Orchestrator */}
      <AgentOrchestrator
        onTriggerSync={() => showToast("Orchestrator sync initiated across 5 specialized agents.")}
        onApproveBatch={() => showToast("Reconciliation Agent batch (3 transactions) approved and posted to ledger.")}
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
