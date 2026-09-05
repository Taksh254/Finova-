import React from "react";
import { ArrowLeftRight } from "lucide-react";
import { ModulePlaceholder } from "@/components/shell/ModulePlaceholder";

export default function TransactionsPage() {
  return (
    <ModulePlaceholder
      moduleName="Transaction Ledger"
      description="Multi-account double-entry transaction feed with automated classification, tagging, and entity attribution."
      icon={<ArrowLeftRight size={22} />}
      plannedFeatures={[
        {
          title: "Multi-Bank Ingestion",
          description: "Real-time sync and normalization across HDFC, ICICI, and Kotak accounts.",
          schemaReady: "Transaction",
        },
        {
          title: "Automated Category Classification",
          description: "ML categorization mapping raw descriptors to chart of accounts.",
          schemaReady: "Transaction.category",
        },
        {
          title: "Audit Trail & Reference Linking",
          description: "Trace transactions directly to source invoices, receipts, and bank logs.",
          schemaReady: "Transaction.reference",
        },
      ]}
    />
  );
}
