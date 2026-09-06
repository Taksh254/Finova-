# FINOVA — Finance Operations Platform

FINOVA is a finance-operations platform built around one flagship capability: **Payout Truth**, a deterministic engine that reconciles payment-gateway payouts against bank settlements, investigates every mismatch, and keeps a human controller in the approval loop before anything is booked.

> **FINOVA refuses to book what it cannot explain.** Reconciliation arithmetic is 100% deterministic — no LLM ever touches the numbers.

---

## What's actually implemented

To keep this README honest as the product evolves, here's what's real vs. presentational today:

| Feature | Status |
|---|---|
| Deterministic reconciliation engine (`lib/finance/reconciliationEngine.ts`) | ✅ Live — real arithmetic, real Postgres-backed state |
| Payout Truth (`/payout-truth`) — list, detail, investigate, reconcile, review, accounting entry, audit log | ✅ Live — full CRUD against Postgres via Prisma |
| Controller Workbench (`/overview` — exception → investigation → correction → policy → close-run → replay → audit) | ✅ Live — persisted stage machine (`WorkbenchRun`). Note: despite the URL, this route renders the Workbench, not a metrics dashboard |
| Exceptions register (`/exceptions`) | ✅ Live — server-rendered directly from Prisma |
| Accounts, Expenses, Invoices, Payroll, Reports, Settings, Transactions, Treasury, Reconciliation, AI CFO, Help | 🚧 Placeholder "coming soon" screens (`ModulePlaceholder`) — no real data yet |

---

## Tech Stack

- **Framework:** Next.js 15.5.25 (App Router), React 19, TypeScript 5.9
- **Database:** PostgreSQL via Prisma ORM 6.19 — the checked-in dev config points at **Prisma Postgres** (`db.prisma.io`, Prisma's managed Postgres service); the actual provider behind any given deployment depends on whatever `DATABASE_URL` is set there
- **Styling:** CSS Modules — no Tailwind
- **Charts/Icons:** Recharts, lucide-react
- **Deployment:** Vercel (zero-config Next.js build)

---

## Visual Identity

Two distinct visual languages coexist in the app today:

- **Marketing site** (`/`): an *Editorial Ivory & Forest Green* aesthetic — ivory/cream surfaces (`#FAF8F4`), deep forest-green panels (`#121F17`–`#1E3327`), sage accents, and glassmorphic navigation capsules.
- **Dashboard** (`/overview`, `/payout-truth`, etc.): a cleaner operational UI — status colors for exceptions (crimson `#B53A3A`) and cleared items (green `#2B6E47`), with `Plus Jakarta Sans` / `Inter` typography.

---

## Quick Start

### Prerequisites
- Node.js 18+ (tested on v22.18)
- npm 9+
- A PostgreSQL database (local, Docker, or a hosted instance like Prisma Postgres/Supabase/Neon/AWS RDS)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure your database connection
cp .env.example .env   # then set DATABASE_URL to your Postgres connection string

# 3. Push the schema and seed demo data
npm run db:push
npm run db:seed

# 4. Generate the Prisma client (also runs automatically as part of `npm run build`)
npx prisma generate

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — this loads the marketing landing page. The dashboard lives at [http://localhost:3000/overview](http://localhost:3000/overview) (there is no automatic redirect).

### Production build

```bash
npm run build   # runs `prisma generate && next build`
npm run start
```

### Production migrations

Never run `prisma migrate dev` or `db push` against production. Use:

```bash
npx prisma migrate deploy
```

---

## Environment Variables

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string. Server-side only — never expose with a `NEXT_PUBLIC_` prefix. |

No other environment variables are currently read by the codebase.

---

## Architecture

```
finova-app/
├── app/
│   ├── page.tsx                    # Marketing landing page
│   ├── layout.tsx                  # Root layout (metadata, global styles)
│   ├── (dashboard)/                # Dashboard route group, wrapped by Sidebar + TopBar
│   │   ├── overview/               # ★ Controller Workbench (multi-stage exception workflow)
│   │   │                           # — note: URL is "overview", component is WorkbenchShell
│   │   ├── payout-truth/           # ★ Flagship: gateway payout reconciliation
│   │   │   └── [id]/               # Payout detail: evidence, investigation, review, entry, audit
│   │   ├── exceptions/             # Exceptions register (server-rendered from Prisma)
│   │   ├── ai-agents/              # AI agent panel
│   │   ├── reconciliation/, transactions/, invoices/, expenses/,
│   │   │                          # accounts/, reports/, ai-cfo/, payroll/, treasury/,
│   │   │                          # help/, settings/ — placeholder screens, no real data
│   │   └── layout.tsx
│   └── api/
│       ├── dashboard/{overview,activity,exceptions}/
│       ├── payouts/                # GET list; GET/[id]; POST reconcile/investigate/
│       │                           # rerun-reconciliation/review/accounting-entry
│       └── workbench/              # Controller Workbench state machine
├── components/
│   ├── landing/                    # Marketing page sections (Editorial* components)
│   ├── dashboard/                  # MetricCard, AICFOCommandCard,
│   │                                # FinancialHealthCard, ExceptionsPanel, etc.
│   ├── payout/                     # PayoutDetailView, PayoutTruthClient
│   ├── workbench/                  # WorkbenchShell + 8 stage components
│   └── shell/                      # Sidebar, TopBar, DashboardShellWrapper
├── lib/
│   ├── db/prisma.ts                # Prisma client singleton (globalThis pattern)
│   └── finance/
│       ├── reconciliationEngine.ts # Deterministic Gross − Fees − Refunds − Taxes ± Adj = Expected
│       ├── payoutService.ts        # PayoutTruthService — evidence, investigation, review, entries
│       ├── workbenchService.ts     # WorkbenchService — persisted stage machine
│       ├── evidence/               # EvidenceService + pluggable gateway/reserve providers
│       ├── metrics.ts              # Dashboard aggregations
│       └── formatting.ts           # INR/Lakhs/Crores formatters
└── prisma/
    ├── schema.prisma                # PostgreSQL — Company, Transaction, Invoice, Payout,
    │                                 # PayoutEvidence/Investigation/Review/AccountingEntry/AuditLog,
    │                                 # WorkbenchRun/WorkbenchAuditEvent, and more
    └── seed.ts                      # Demo dataset (incl. PO-1024 / PO-1025 payouts)
```

---

## Reconciliation Logic

The heart of the product, in full:

```
Expected Net Payout = Gross Amount − Platform Fees − Refunds − Taxes ± Adjustments
Difference           = Expected Net Payout − Actual Bank Received

difference === 0  →  RECONCILED
difference !== 0  →  NEEDS_REVIEW
```

When a payout needs review, the Controller Workbench walks it through: **Exception Queue → Investigation → Proposed Correction → Policy Proposal → Policy Backtest → Close Run → (Replay) → Audit Trail** — with every decision persisted and every action logged to an immutable audit trail (`PayoutAuditLog`, `WorkbenchAuditEvent`).
