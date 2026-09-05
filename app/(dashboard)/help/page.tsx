import React from "react";
import { HelpCircle } from "lucide-react";
import { ModulePlaceholder } from "@/components/shell/ModulePlaceholder";

export default function HelpPage() {
  return (
    <ModulePlaceholder
      moduleName="Help Center & Operating Manual"
      description="Documentation on Finova Observe-Understand-Decide-Act workflows, shortcuts, and support contacts."
      icon={<HelpCircle size={22} />}
      plannedFeatures={[
        {
          title: "Observe-to-Review Workflow Guide",
          description: "Step-by-step walkthroughs for financial exception resolution and reconciliation sign-off.",
          schemaReady: "Document (type: POLICY)",
        },
        {
          title: "API & Webhook Documentation",
          description: "Developer guides for ingesting ERP batches and triggering external disbursement runs.",
          schemaReady: "Document",
        },
        {
          title: "Dedicated Finance Specialist Support",
          description: "Direct priority routing to Finova operational accountants for high-severity disputes.",
          schemaReady: "Exception.severity",
        },
      ]}
    />
  );
}
