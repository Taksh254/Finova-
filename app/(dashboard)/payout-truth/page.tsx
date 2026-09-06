import React from "react";
import { getPayoutService } from "@/lib/finance/payoutService";
import { PayoutTruthClient } from "@/components/payout/PayoutTruthClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payout Truth — FINOVA",
  description: "Know exactly where every rupee went with autonomous payout reconciliation and audit truth.",
};

export default async function PayoutTruthPage() {
  const service = getPayoutService();
  const [summary, payouts] = await Promise.all([
    service.getSummary(),
    service.getPayoutsList(),
  ]);

  return (
    <PayoutTruthClient
      initialSummary={summary}
      initialPayouts={payouts}
    />
  );
}
