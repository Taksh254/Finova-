import React from "react";
import { Users } from "lucide-react";
import { ModulePlaceholder } from "@/components/shell/ModulePlaceholder";

export default function PayrollPage() {
  return (
    <ModulePlaceholder
      moduleName="Payroll Operations"
      description="Monthly payroll runs, statutory compliance (PF/ESIC/TDS), anomaly detection, and disbursement pipelines."
      icon={<Users size={22} />}
      plannedFeatures={[
        {
          title: "Payroll Variance Detection",
          description: "Flag unexpected compensation spikes or missing deductions before bank disbursement.",
          schemaReady: "PayrollRecord.exceptions",
        },
        {
          title: "Statutory Filing Alignment",
          description: "Auto-reconcile salary components with tax compliance thresholds.",
          schemaReady: "PayrollRecord",
        },
        {
          title: "One-Click Batch Payouts",
          description: "Generate compliant bank transfer files and payout webhooks.",
          schemaReady: "PayrollRecord.status",
        },
      ]}
    />
  );
}
