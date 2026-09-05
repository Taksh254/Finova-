import React from "react";
import { Receipt } from "lucide-react";
import { ModulePlaceholder } from "@/components/shell/ModulePlaceholder";

export default function ExpensesPage() {
  return (
    <ModulePlaceholder
      moduleName="Expenses & Spend Management"
      description="Corporate spend categorization, receipt OCR pairing, duplicate detection, and automated spend anomaly alerting."
      icon={<Receipt size={22} />}
      plannedFeatures={[
        {
          title: "Autonomous Spend Classification",
          description: "Multi-class categorization attributing transactions to chart of accounts and departmental cost centers.",
          schemaReady: "Transaction.category",
        },
        {
          title: "Duplicate & Recurring Detection",
          description: "Statistical detection of twin invoices and unapproved software vendor pricing escalations.",
          schemaReady: "Exception.FRAUD_ALERT",
        },
        {
          title: "Approval Workflow Routing",
          description: "Policy checks against departmental spend ceilings with autonomous CFO sign-off routing.",
          schemaReady: "Exception.POLICY_BREACH",
        },
      ]}
    />
  );
}
