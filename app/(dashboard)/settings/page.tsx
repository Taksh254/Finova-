import React from "react";
import { Settings } from "lucide-react";
import { ModulePlaceholder } from "@/components/shell/ModulePlaceholder";

export default function SettingsPage() {
  return (
    <ModulePlaceholder
      moduleName="Workspace & Entity Configuration"
      description="Fiscal calendar settings, chart of accounts mapping, ERP integrations, and role-based permissions."
      icon={<Settings size={22} />}
      plannedFeatures={[
        {
          title: "Chart of Accounts Structure",
          description: "Configure revenue and expense hierarchies matching your accounting standards.",
          schemaReady: "Company",
        },
        {
          title: "Bank Feed Connectors",
          description: "Secure Open Banking / Account Aggregator API integrations for real-time bank feeds.",
          schemaReady: "Transaction.reference",
        },
        {
          title: "Team & Role Access Control",
          description: "Granular authorization matrix for CFO, Controllers, Analysts, and Auditors.",
          schemaReady: "User.role",
        },
      ]}
    />
  );
}
