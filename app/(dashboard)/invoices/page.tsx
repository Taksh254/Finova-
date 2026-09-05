import React from "react";
import { FileText } from "lucide-react";
import { ModulePlaceholder } from "@/components/shell/ModulePlaceholder";

export default function InvoicesPage() {
  return (
    <ModulePlaceholder
      moduleName="Invoices & Payables Operations"
      description="Accounts receivable collections, vendor payable pipelines, and 3-way matching engine."
      icon={<FileText size={22} />}
      plannedFeatures={[
        {
          title: "AI Invoice Parser (OCR)",
          description: "Extract line items, GSTIN, PO references, and payment terms from PDF invoices.",
          schemaReady: "Invoice",
        },
        {
          title: "Automated Payables Approvals",
          description: "Dual authorization matrix with threshold-based routing for CFO sign-off.",
          schemaReady: "Invoice.status",
        },
        {
          title: "Dunning & AR Recovery",
          description: "Intelligent payment reminders with escalation cadence for overdue receivables.",
          schemaReady: "Invoice.type = RECEIVABLE",
        },
      ]}
    />
  );
}
