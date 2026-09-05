import React from "react";
import { BarChart3 } from "lucide-react";
import { ModulePlaceholder } from "@/components/shell/ModulePlaceholder";

export default function ReportsPage() {
  return (
    <ModulePlaceholder
      moduleName="Financial Reporting & Audit Vault"
      description="GAAP/IndAS financial statements, board packets, audit trails, and tax compliance export packs."
      icon={<BarChart3 size={22} />}
      plannedFeatures={[
        {
          title: "Automated P&L, Balance Sheet, Cash Flow",
          description: "One-click generation of standard financial reports directly from reconciled ledgers.",
          schemaReady: "Transaction & CashFlowEntry",
        },
        {
          title: "Auditor Access Vault",
          description: "Time-bounded, tamper-proof read-only access for external audit compliance teams.",
          schemaReady: "User (role: AUDITOR)",
        },
        {
          title: "Board Deck PDF Export",
          description: "Executive presentation decks populated with key charts and Finova intelligence summaries.",
          schemaReady: "Document (type: REPORT)",
        },
      ]}
    />
  );
}
