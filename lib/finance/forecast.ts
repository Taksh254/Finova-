/**
 * Cash Flow Forecast - a simple, explainable extrapolation from historical
 * monthly net cash flow, adjusted by invoices already known to be due in the
 * forecast window. No ML, no LLM: just the trailing average burn/growth
 * rate plus what's already on the books.
 */

import prisma from "@/lib/db/prisma";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";
import { REFERENCE_DATE } from "@/lib/finance/referenceDate";

export interface CashFlowForecast {
  currentCash: number;
  projected30Day: number;
  projected60Day: number;
  projected90Day: number;
  projectedMonthlyBurn: number;
  estimatedRunwayMonths: number | null;
  drivers: string[];
}

export async function calculateCashFlowForecast(organizationId?: string, trailingMonths = 3): Promise<CashFlowForecast> {
  const cId = await resolveScopedOrganizationId(organizationId);

  const entries = await prisma.cashFlowEntry.findMany({
    where: { organizationId: cId },
    orderBy: { date: "asc" },
  });

  const latest = entries[entries.length - 1];
  const currentCash = latest?.balance ?? 0;

  const trailing = entries.slice(-trailingMonths);
  const avgNetFlow = trailing.length > 0 ? trailing.reduce((sum, e) => sum + e.netFlow, 0) / trailing.length : 0;
  const dailyNetFlow = avgNetFlow / 30;

  const projected30Day = Math.round(currentCash + dailyNetFlow * 30);
  const projected60Day = Math.round(currentCash + dailyNetFlow * 60);
  const projected90Day = Math.round(currentCash + dailyNetFlow * 90);

  const projectedMonthlyBurn = avgNetFlow < 0 ? Math.round(-avgNetFlow) : 0;
  const estimatedRunwayMonths = projectedMonthlyBurn > 0 ? Math.round((currentCash / projectedMonthlyBurn) * 10) / 10 : null;

  const in90Days = new Date(REFERENCE_DATE);
  in90Days.setDate(in90Days.getDate() + 90);

  const [duePayables, expectedReceivables] = await Promise.all([
    prisma.invoice.aggregate({
      where: { organizationId: cId, type: "PAYABLE", status: { in: ["PENDING", "OVERDUE"] }, dueDate: { lte: in90Days } },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.invoice.aggregate({
      where: { organizationId: cId, type: "RECEIVABLE", status: { in: ["PENDING", "OVERDUE"] }, dueDate: { lte: in90Days } },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const drivers: string[] = [];
  drivers.push(
    avgNetFlow >= 0
      ? `Trailing ${trailingMonths}-month average net cash flow is positive (+₹${Math.round(avgNetFlow).toLocaleString("en-IN")}/mo)`
      : `Trailing ${trailingMonths}-month average net burn is ₹${Math.round(-avgNetFlow).toLocaleString("en-IN")}/mo`
  );
  if ((duePayables._count || 0) > 0) {
    drivers.push(`${duePayables._count} payable(s) totalling ₹${(duePayables._sum.amount || 0).toLocaleString("en-IN")} due within 90 days`);
  }
  if ((expectedReceivables._count || 0) > 0) {
    drivers.push(`${expectedReceivables._count} receivable(s) totalling ₹${(expectedReceivables._sum.amount || 0).toLocaleString("en-IN")} expected within 90 days`);
  }

  return {
    currentCash,
    projected30Day,
    projected60Day,
    projected90Day,
    projectedMonthlyBurn,
    estimatedRunwayMonths,
    drivers,
  };
}
