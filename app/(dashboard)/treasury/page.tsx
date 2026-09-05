import React from "react";
import { Landmark } from "lucide-react";
import { ModulePlaceholder } from "@/components/shell/ModulePlaceholder";

export default function TreasuryPage() {
  return (
    <ModulePlaceholder
      moduleName="Treasury & Cash Management"
      description="Liquidity forecasting, yield optimization on idle capital, sweep accounts, and multi-entity cash positioning."
      icon={<Landmark size={22} />}
      plannedFeatures={[
        {
          title: "13-Week Direct Cash Forecast",
          description: "Stochastic liquidity modeling incorporating historical seasonality and known payables.",
          schemaReady: "CashFlowEntry",
        },
        {
          title: "Idle Capital Yield Optimization",
          description: "Automated overnight sweeps into liquid mutual funds or fixed deposits.",
          schemaReady: "CashFlowEntry.balance",
        },
        {
          title: "Risk-Adjusted Runway Calculator",
          description: "Stress test operational runway under varying churn and delayed client collection scenarios.",
          schemaReady: "Company & CashFlowEntry",
        },
      ]}
    />
  );
}
