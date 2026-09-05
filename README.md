# FINOVA — AI-Powered Finance Operations Platform

FINOVA is an autonomous AI-powered Finance Operations and CFO platform designed for finance teams, controllers, and growing businesses.

Built around the core operational intelligence loop:
**OBSERVE → UNDERSTAND → DECIDE → ACT → REVIEW**

---

## Visual Identity & Design System

Finova uses a bespoke **Warm Cream & Royal Blue** financial operating system aesthetic:
- **Primary Action**: Royal Blue (`#1D3B8F`) & Deep Royal Blue (`#142A68`)
- **Backgrounds**: Warm Cream (`#F7F3E8`), Soft Cream (`#FCFAF4`), Crisp White Surfaces (`#FFFFFF`)
- **Typography**: Dark Navy (`#0F1A3E`) headings with `Plus Jakarta Sans` and `Inter`
- **Accents**: Subtle Emerald (`#15803D`) for positive financial health, subtle Crimson (`#DC2626`) for exceptions & overdue receivables.

---

## Key Features

1. **Executive Overview Dashboard**:
   - Total Cash, Accounts Receivable, Accounts Payable, and Monthly Revenue metrics with live sparklines.
   - Interactive Cash Flow Area Chart with timeframe toggles (`7D`, `30D`, `3M`, `6M`, `1Y`) and embedded AI insights.
   - Autonomous **AI CFO Command Center** with orbital intelligence core and actionable priority items.
   - Lower 3-column analysis: Recent Transactions ledger, Outstanding Invoices segmented aging bar, and Financial Health radial gauge (`86/100 Healthy`).
   - Strategic AI Insights row and Finova Brand Banner.

2. **Autonomous AI Agent Orchestrator**:
   - Coordinates 5 specialized finance agents:
     - **CFO Agent**: Liquidity runway simulation & capital strategy
     - **Analysis Agent**: Spend variance & SaaS vendor hike tracking
     - **Reconciliation Agent**: Real-time bank vs internal ledger mismatch matching
     - **Invoice Agent**: Automated intake, matching, and aging tracking
     - **Reporting Agent**: Real-time provisional P&L and GST compliance generation

3. **Interactive Financial Operations**:
   - Quick Actions Bar for one-click invoice creation, expense recording, and report generation.
   - Instant AI CFO reasoning chat modal for ad-hoc liquidity and variance queries.
   - Double-entry relational database backing with Prisma ORM and SQLite.

---

## Quick Start Guide

### Prerequisites
- Node.js 18+ (Tested on v22.18.0)
- npm 9+

### Running the Application

```bash
# Install dependencies
npm install

# Push database schema & seed initial demo data
npm run db:push
npm run db:seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app automatically redirects to the `/overview` dashboard.

---

## Architecture

```
finova-app/
├── app/
│   ├── (dashboard)/
│   │   ├── overview/          # Primary Executive Finance Command Center
│   │   ├── transactions/      # Transaction Ledger
│   │   ├── invoices/          # Invoices & Accounts Receivable
│   │   ├── expenses/          # Spend Management & Anomaly Detection
│   │   ├── cash-flow/         # Cash Flow Dynamics & 13-week forecast
│   │   ├── accounts/          # Multi-bank aggregation & reconciliation
│   │   ├── reconciliation/    # Bank Reconciliation Engine
│   │   ├── reports/           # Financial Reports & Audit Vault
│   │   ├── ai-agents/         # Autonomous AI Agent Fleet & Orchestrator
│   │   ├── ai-cfo/            # AI CFO Reasoning Foundation
│   │   └── settings/          # Workspace Configuration
│   ├── api/
│   │   ├── dashboard/         # Aggregated metrics, cash flow, exceptions, events
│   │   └── ai/brief/          # AI Financial Intelligence synthesis
│   ├── globals.css            # Finova Cream & Royal Blue Design System
│   └── layout.tsx             # Shell wrapper (Sidebar + TopBar)
├── components/
│   ├── dashboard/             # MetricCard, CashFlowChart, AICFOCommandCard, QuickActionsBar,
│   │                          # RecentTransactions, OutstandingInvoicesCard, FinancialHealthCard,
│   │                          # AIInsightsRow, AgentOrchestrator, FinancialModals, Toast
│   └── shell/                 # Sidebar, TopBar, ModulePlaceholder
├── lib/
│   ├── ai/                    # IAIFinancialService abstraction & RuleBasedFinancialAnalyzer
│   ├── db/                    # Prisma client singleton
│   └── finance/               # Metrics computations, formatters (₹ Lakhs/Crores, INR)
└── prisma/
    ├── schema.prisma          # 8 core relational models
    ├── dev.db                 # SQLite database
    └── seed.ts                # Seed dataset for Arcova Technologies Pvt. Ltd.
```
