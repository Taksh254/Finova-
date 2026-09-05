import React from "react";
import { Landmark } from "lucide-react";
import { ModulePlaceholder } from "@/components/shell/ModulePlaceholder";

export default function AccountsPage() {
  return (
    <ModulePlaceholder
      moduleName="Accounts & Banking Operations"
      description="Direct bank feed aggregations across HDFC Business, ICICI Current, and corporate credit lines with ledger syncing."
      icon={<Landmark size={22} />}
      plannedFeatures={[
        {
          title: "Multi-Bank Aggregation",
          description: "Encrypted API connections pulling opening/closing balances and settled statement lines in real time.",
          schemaReady: "Company.currency",
        },
        {
          title: "Virtual Account & Sub-Ledgers",
          description: "Segregated operating pools for vendor escrows, statutory tax withholdings, and payroll reserves.",
          schemaReady: "CashFlowEntry.balance",
        },
        {
          title: "Automated Feed Health & Syncing",
          description: "Continuous webhook synchronization verifying zero gap between bank records and internal ERP balances.",
          schemaReady: "Transaction.reference",
        },
      ]}
    />
  );
}
