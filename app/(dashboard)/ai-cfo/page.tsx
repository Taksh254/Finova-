import React from "react";
import { Bot } from "lucide-react";
import { ModulePlaceholder } from "@/components/shell/ModulePlaceholder";

export default function AICFOPage() {
  return (
    <ModulePlaceholder
      moduleName="FINOVA AI CFO & Copilot"
      description="Autonomous reasoning agents for financial inquiry, budget scenario simulation, and policy RAG retrieval."
      icon={<Bot size={22} />}
      plannedFeatures={[
        {
          title: "Policy & Contract RAG Retrieval",
          description: "Semantic search over company financial policies, vendor SLAs, and board minutes.",
          schemaReady: "Document (content & metadata)",
        },
        {
          title: "Proactive Variance Explanation",
          description: "Autonomous root-cause analysis when actuals deviate >10% from operating budgets.",
          schemaReady: "Transaction & Exception",
        },
        {
          title: "Executive Scenario Planning",
          description: "Natural language 'what-if' queries: 'What happens to runway if we hire 5 engineers in Q3?'.",
          schemaReady: "CashFlowEntry & PayrollRecord",
        },
      ]}
    />
  );
}
