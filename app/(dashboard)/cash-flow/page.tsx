import React from "react";
import { TrendingUp } from "lucide-react";
import { ModulePlaceholder } from "@/components/shell/ModulePlaceholder";

export default function CashFlowPage() {
  return (
    <ModulePlaceholder
      moduleName="Cash Flow Dynamics & Liquidity"
      description="Real-time multi-currency cash positioning, 13-week rolling cash flow forecasts, and runway sensitivity modeling."
      icon={<TrendingUp size={22} />}
      plannedFeatures={[
        {
          title: "13-Week Rolling Forecast",
          description: "Predictive treasury cash buffer projections based on historic collection curves and seasonal billing.",
          schemaReady: "CashFlowEntry",
        },
        {
          title: "Burn Rate Variance Tracking",
          description: "Decomposition of gross vs net cash burn into payroll, cloud infrastructure, and administrative overhead.",
          schemaReady: "Transaction.amount",
        },
        {
          title: "Scenario & Sensitivity Simulator",
          description: "Stress test liquidity under delayed client collections (+30d) or 20% marketing ramp.",
          schemaReady: "CashFlowEntry.netFlow",
        },
      ]}
    />
  );
}
