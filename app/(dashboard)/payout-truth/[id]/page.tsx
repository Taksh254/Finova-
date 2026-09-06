import React from "react";
import { notFound } from "next/navigation";
import { getPayoutService } from "@/lib/finance/payoutService";
import { PayoutDetailContainer } from "@/components/payout/PayoutDetailContainer";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: `Payout Truth — ${id} | FINOVA`,
    description: `Detailed payout reconciliation truth and transaction breakdown for ${id}`,
  };
}

export default async function PayoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = getPayoutService();
  const payout = await service.getPayoutDetail(id);

  if (!payout) {
    notFound();
  }

  return <PayoutDetailContainer initialPayout={payout} />;
}
