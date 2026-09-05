import prisma from "@/lib/db/prisma";

export interface DashboardMetrics {
  revenue: {
    current: number;
    previous: number;
    changePct: number;
    isPositive: boolean;
  };
  expenses: {
    current: number;
    previous: number;
    changePct: number;
    isPositive: boolean; // For expenses, reduction is positive
  };
  cashPosition: {
    current: number;
    previous: number;
    changePct: number;
    isPositive: boolean;
  };
  accountsReceivable: {
    current: number;
    overdue: number;
    count: number;
    changePct: number;
    isPositive: boolean;
  };
  accountsPayable: {
    current: number;
    dueSoon7Days: number;
    count: number;
    changePct: number;
    isPositive: boolean;
  };
  runway: {
    months: number;
    burnRate: number;
    previousMonths: number;
    changePct: number;
    isPositive: boolean;
  };
}

export interface NeedsAttentionItem {
  id: string;
  category: "RECONCILIATION" | "INVOICE" | "PAYROLL" | "UPCOMING_PAYABLE";
  title: string;
  count?: number;
  amount?: number;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  link: string;
}

export interface ActivityEvent {
  id: string;
  type: "INVOICE" | "TRANSACTION" | "PAYROLL" | "EXCEPTION" | "TREASURY";
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  status?: string;
  severity?: string;
}

export async function getDashboardMetrics(companyId?: string): Promise<DashboardMetrics> {
  const company = companyId
    ? await prisma.company.findUnique({ where: { id: companyId } })
    : await prisma.company.findFirst();

  const cId = company?.id || "comp_arcova";

  // Define current period (August 2025) and previous period (July 2025)
  const currentStart = new Date("2025-08-01T00:00:00.000Z");
  const currentEnd = new Date("2025-08-31T23:59:59.999Z");

  const prevStart = new Date("2025-07-01T00:00:00.000Z");
  const prevEnd = new Date("2025-07-31T23:59:59.999Z");

  // 1. Current & Previous Revenue
  const currentRevTx = await prisma.transaction.aggregate({
    where: {
      companyId: cId,
      type: "REVENUE",
      date: { gte: currentStart, lte: currentEnd },
    },
    _sum: { amount: true },
  });

  const prevRevTx = await prisma.transaction.aggregate({
    where: {
      companyId: cId,
      type: "REVENUE",
      date: { gte: prevStart, lte: prevEnd },
    },
    _sum: { amount: true },
  });

  const currentRev = currentRevTx._sum.amount || 0;
  const prevRev = prevRevTx._sum.amount || 0;
  const revChangePct = prevRev > 0 ? ((currentRev - prevRev) / prevRev) * 100 : 0;

  // 2. Current & Previous Expenses
  const currentExpTx = await prisma.transaction.aggregate({
    where: {
      companyId: cId,
      type: "EXPENSE",
      date: { gte: currentStart, lte: currentEnd },
    },
    _sum: { amount: true },
  });

  const prevExpTx = await prisma.transaction.aggregate({
    where: {
      companyId: cId,
      type: "EXPENSE",
      date: { gte: prevStart, lte: prevEnd },
    },
    _sum: { amount: true },
  });

  const currentExp = currentExpTx._sum.amount || 0;
  const prevExp = prevExpTx._sum.amount || 0;
  const expChangePct = prevExp > 0 ? ((currentExp - prevExp) / prevExp) * 100 : 0;

  // 3. Cash Position (Latest CashFlowEntry balance)
  const latestCashEntry = await prisma.cashFlowEntry.findFirst({
    where: { companyId: cId },
    orderBy: { date: "desc" },
  });

  const prevCashEntry = await prisma.cashFlowEntry.findFirst({
    where: { companyId: cId, date: { lte: prevEnd } },
    orderBy: { date: "desc" },
  });

  const currentCash = latestCashEntry?.balance || 19807000;
  const prevCash = prevCashEntry?.balance || 18842000;
  const cashChangePct = prevCash > 0 ? ((currentCash - prevCash) / prevCash) * 100 : 0;

  // 4. Accounts Receivable (unpaid RECEIVABLE invoices)
  const arInvoices = await prisma.invoice.findMany({
    where: {
      companyId: cId,
      type: "RECEIVABLE",
      status: { in: ["PENDING", "OVERDUE"] },
    },
  });

  const currentAR = arInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAR = arInvoices
    .filter((inv) => inv.status === "OVERDUE")
    .reduce((sum, inv) => sum + inv.amount, 0);

  // Baseline previous AR for realistic period comparison
  const prevAR = 3280000;
  const arChangePct = prevAR > 0 ? ((currentAR - prevAR) / prevAR) * 100 : 0;

  // 5. Accounts Payable (unpaid PAYABLE invoices)
  const apInvoices = await prisma.invoice.findMany({
    where: {
      companyId: cId,
      type: "PAYABLE",
      status: { in: ["PENDING", "OVERDUE"] },
    },
  });

  const currentAP = apInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  // Upcoming payables due within 7 days from reference date (2025-09-05)
  const refDate = new Date("2025-09-05T00:00:00.000Z");
  const sevenDaysLater = new Date("2025-09-12T23:59:59.999Z");

  const dueSoonAP = apInvoices
    .filter((inv) => inv.dueDate >= refDate && inv.dueDate <= sevenDaysLater)
    .reduce((sum, inv) => sum + inv.amount, 0);

  const prevAP = 980000;
  const apChangePct = prevAP > 0 ? ((currentAP - prevAP) / prevAP) * 100 : 0;

  // 6. Runway Calculation
  // Monthly net burn = current expenses - current revenue (if negative, company is net positive!)
  // In our realistic case, if net positive, runway is based on gross burn (current expenses)
  const monthlyGrossBurn = currentExp > 0 ? currentExp : 3000000;
  const runwayMonths = Math.round((currentCash / monthlyGrossBurn) * 10) / 10;
  const prevMonthlyBurn = prevExp > 0 ? prevExp : 2800000;
  const prevRunwayMonths = Math.round((prevCash / prevMonthlyBurn) * 10) / 10;
  const runwayChangePct =
    prevRunwayMonths > 0 ? ((runwayMonths - prevRunwayMonths) / prevRunwayMonths) * 100 : 0;

  return {
    revenue: {
      current: currentRev,
      previous: prevRev,
      changePct: Math.round(revChangePct * 10) / 10,
      isPositive: revChangePct >= 0,
    },
    expenses: {
      current: currentExp,
      previous: prevExp,
      changePct: Math.round(expChangePct * 10) / 10,
      isPositive: expChangePct <= 0, // Lower expenses is positive
    },
    cashPosition: {
      current: currentCash,
      previous: prevCash,
      changePct: Math.round(cashChangePct * 10) / 10,
      isPositive: cashChangePct >= 0,
    },
    accountsReceivable: {
      current: currentAR,
      overdue: overdueAR,
      count: arInvoices.length,
      changePct: Math.round(arChangePct * 10) / 10,
      isPositive: arChangePct <= 0, // Lower outstanding receivables is generally cleaner
    },
    accountsPayable: {
      current: currentAP,
      dueSoon7Days: dueSoonAP,
      count: apInvoices.length,
      changePct: Math.round(apChangePct * 10) / 10,
      isPositive: apChangePct <= 0,
    },
    runway: {
      months: runwayMonths,
      burnRate: monthlyGrossBurn,
      previousMonths: prevRunwayMonths,
      changePct: Math.round(runwayChangePct * 10) / 10,
      isPositive: runwayChangePct >= 0,
    },
  };
}

export async function getNeedsAttentionItems(companyId?: string): Promise<NeedsAttentionItem[]> {
  const company = companyId
    ? await prisma.company.findUnique({ where: { id: companyId } })
    : await prisma.company.findFirst();

  const cId = company?.id || "comp_arcova";

  const openExceptions = await prisma.exception.findMany({
    where: { companyId: cId, status: { in: ["OPEN", "IN_REVIEW"] } },
  });

  const reconciliationCount = openExceptions.filter((e) => e.type === "RECONCILIATION").length;
  const invoiceCount = openExceptions.filter((e) => e.type === "INVOICE").length;
  const payrollCount = openExceptions.filter((e) => e.type === "PAYROLL").length;

  // Upcoming payable due within 7 days
  const refDate = new Date("2025-09-05T00:00:00.000Z");
  const sevenDaysLater = new Date("2025-09-12T23:59:59.999Z");

  const dueSoonPayables = await prisma.invoice.findMany({
    where: {
      companyId: cId,
      type: "PAYABLE",
      status: "PENDING",
      dueDate: { gte: refDate, lte: sevenDaysLater },
    },
  });

  const dueSoonTotal = dueSoonPayables.reduce((sum, inv) => sum + inv.amount, 0);

  const items: NeedsAttentionItem[] = [
    {
      id: "attn-recon",
      category: "RECONCILIATION",
      title: `${reconciliationCount} reconciliation mismatches`,
      count: reconciliationCount,
      severity: "HIGH",
      link: "/exceptions?filter=reconciliation",
    },
    {
      id: "attn-invoice",
      category: "INVOICE",
      title: `${invoiceCount} invoice exceptions`,
      count: invoiceCount,
      severity: "HIGH",
      link: "/exceptions?filter=invoice",
    },
    {
      id: "attn-payroll",
      category: "PAYROLL",
      title: `${payrollCount} payroll anomaly`,
      count: payrollCount,
      severity: "MEDIUM",
      link: "/exceptions?filter=payroll",
    },
    {
      id: "attn-payable",
      category: "UPCOMING_PAYABLE",
      title: `₹${(dueSoonTotal / 100000).toFixed(1)}L upcoming payables due within 7 days`,
      amount: dueSoonTotal,
      severity: "MEDIUM",
      link: "/invoices?filter=due-soon",
    },
  ];

  return items;
}

export async function getRecentActivity(companyId?: string): Promise<ActivityEvent[]> {
  const company = companyId
    ? await prisma.company.findUnique({ where: { id: companyId } })
    : await prisma.company.findFirst();

  const cId = company?.id || "comp_arcova";

  // Gather recent events
  const events: ActivityEvent[] = [
    {
      id: "act-1",
      type: "INVOICE",
      title: "Invoice processed",
      description: "INV-AR-004 for Mahindra Finance (₹18.5L) issued and sent for customer approval",
      timestamp: "2025-09-05T09:30:00.000Z",
      amount: 1850000,
      status: "ISSUED",
    },
    {
      id: "act-2",
      type: "TRANSACTION",
      title: "Transaction reconciled",
      description: "HDFC Current Account payout ₹2.85L cleared with Workday India",
      timestamp: "2025-09-04T16:45:00.000Z",
      amount: 285000,
      status: "RECONCILED",
    },
    {
      id: "act-3",
      type: "EXCEPTION",
      title: "Payroll exception detected",
      description: "Salary variance >30% detected on employee EMP-047 without HR amendment log",
      timestamp: "2025-09-03T11:15:00.000Z",
      severity: "HIGH",
      status: "OPEN",
    },
    {
      id: "act-4",
      type: "TRANSACTION",
      title: "Payment received",
      description: "Inflow ₹14.2L credited from Wipro Technologies for enterprise software renewal",
      timestamp: "2025-09-02T14:20:00.000Z",
      amount: 1420000,
      status: "CLEARED",
    },
    {
      id: "act-5",
      type: "TREASURY",
      title: "Cash forecast updated",
      description: "Q3 liquidity model refreshed — runway projected at 5.9 months at current burn rate",
      timestamp: "2025-09-01T10:00:00.000Z",
      status: "PROJECTED",
    },
  ];

  return events;
}

export async function getCashFlowChartData(companyId?: string) {
  const company = companyId
    ? await prisma.company.findUnique({ where: { id: companyId } })
    : await prisma.company.findFirst();

  const cId = company?.id || "comp_arcova";

  const entries = await prisma.cashFlowEntry.findMany({
    where: { companyId: cId },
    orderBy: { date: "asc" },
  });

  return entries.map((e) => ({
    id: e.id,
    period: e.period,
    label: new Intl.DateTimeFormat("en-IN", { month: "short", year: "2-digit" }).format(e.date),
    date: e.date.toISOString(),
    inflow: e.inflow,
    outflow: e.outflow,
    netFlow: e.netFlow,
    balance: e.balance,
  }));
}
