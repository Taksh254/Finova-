import React from "react";
import { getDashboardOverview } from "@/lib/dashboard/overview";
import { OverviewDashboardClient } from "@/components/dashboard/OverviewDashboardClient";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const overview = await getDashboardOverview();
  return <OverviewDashboardClient overview={overview} />;
}
