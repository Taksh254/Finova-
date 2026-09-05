import React from "react";
import { getDashboardMetrics, getCashFlowChartData } from "@/lib/finance/metrics";
import { OverviewDashboardClient } from "@/components/dashboard/OverviewDashboardClient";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const [metrics, cashFlowData] = await Promise.all([
    getDashboardMetrics(),
    getCashFlowChartData(),
  ]);

  return <OverviewDashboardClient metrics={metrics} cashFlowData={cashFlowData} />;
}
