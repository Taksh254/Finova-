import React from "react";
import { GitCompare } from "lucide-react";
import { ModulePlaceholder } from "@/components/shell/ModulePlaceholder";

export default function ReconciliationPage() {
  return (
    <ModulePlaceholder
      moduleName="Reconciliation Engine"
      description="Automated reconciliation between internal accounting ledgers and bank statement records with fuzzy matching."
      icon={<GitCompare size={22} />}
      plannedFeatures={[
        {
          title: "Deterministic & Fuzzy Matching",
          description: "Match 90%+ transactions instantly using reference numbers, amounts, and dates.",
          schemaReady: "Transaction <-> Exception",
        },
        {
          title: "Discrepancy Investigation Workflow",
          description: "One-click exception assignment, ledger adjustment journal entries, and resolution notes.",
          schemaReady: "Exception.type = RECONCILIATION",
        },
        {
          title: "Multi-Currency Alignment",
          description: "Track forex gain/loss on foreign client invoices vs settlement date exchange rates.",
          schemaReady: "Company.currency",
        },
      ]}
    />
  );
}
