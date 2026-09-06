"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PayoutDetail } from "@/lib/finance/payoutService";
import { PayoutDetailView } from "./PayoutDetailView";
import { Toast } from "@/components/dashboard/Toast";

interface PayoutDetailContainerProps {
  initialPayout: PayoutDetail;
}

export function PayoutDetailContainer({ initialPayout }: PayoutDetailContainerProps) {
  const router = useRouter();
  const [payout, setPayout] = useState<PayoutDetail>(initialPayout);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  return (
    <div>
      <PayoutDetailView
        payout={payout}
        onBack={() => router.push("/payout-truth")}
        onSwitchPayout={(id) => router.push(`/payout-truth/${id}`)}
        onPayoutUpdated={(updated, msg) => {
          setPayout(updated);
          setToastMessage(msg);
        }}
      />
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
