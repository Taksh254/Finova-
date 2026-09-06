/**
 * Demo Gateway Dispute Evidence Provider
 * Connects to Payment Gateway Dispute & Settlement logs (Demo Provider).
 * Designed to be swapped with live Razorpay / Stripe API connectors in production.
 */

import { StructuredEvidenceItem } from "../types";

export interface GatewayDisputeProvider {
  checkGatewayDisputes(
    payoutId: string,
    scenario?: "FULL" | "PARTIAL" | "NONE"
  ): Promise<StructuredEvidenceItem>;
}

export class DemoGatewayProvider implements GatewayDisputeProvider {
  async checkGatewayDisputes(
    payoutId: string,
    scenario: "FULL" | "PARTIAL" | "NONE" = "FULL"
  ): Promise<StructuredEvidenceItem> {
    const timestamp = new Date().toISOString();

    // Canonical check for PO-1025 / PO-STR-9140
    if (payoutId === "PO-1025" || payoutId === "PO-STR-9140") {
      if (scenario === "NONE") {
        return {
          id: "ev-dispute-none",
          category: "GATEWAY_DISPUTES",
          label: "Gateway Dispute & Chargeback Query",
          status: "NO_MATCH",
          amount: 0,
          source: "Razorpay Dispute & Settlement API",
          reference: "QUERY-RZP-EMPTY",
          detail:
            "Gateway dispute ledger queried. Zero active dispute chargebacks or reversals logged for this settlement batch.",
          verifiedAt: timestamp,
        };
      }

      if (scenario === "PARTIAL") {
        return {
          id: "ev-dispute-partial",
          category: "GATEWAY_DISPUTES",
          label: "Gateway Dispute Chargeback Withholding (Partial)",
          status: "PARTIALLY_MATCHED",
          amount: 10000,
          source: "Razorpay Dispute & Settlement API",
          reference: "GD-88421",
          detail:
            "Partial dispute withholding identified for transaction #ORD-9140. Gateway placed ₹10,000 in escrow pending dispute arbitration. ₹8,000 remains unexplained.",
          verifiedAt: timestamp,
          metadata: {
            disputeId: "disp_88421",
            orderId: "ORD-9140",
            chargebackAmount: 10000,
            cardType: "Visa International",
          },
        };
      }

      // Default: FULL explanation of ₹18,000
      return {
        id: "ev-dispute-88421",
        category: "GATEWAY_DISPUTES",
        label: "Gateway Dispute Chargeback Withholding",
        status: "VERIFIED",
        amount: 18000,
        source: "Razorpay Dispute & Settlement API",
        reference: "GD-88421",
        detail:
          "Itemized dispute chargeback withholding for international transaction #ORD-9140. Card issuer placed ₹18,000 in escrow pending dispute arbitration.",
        verifiedAt: timestamp,
        metadata: {
          disputeId: "disp_88421",
          orderId: "ORD-9140",
          chargebackAmount: 18000,
          currency: "INR",
          cardType: "Visa International Corporate",
          reasonCode: "4837_FRAUD_DISPUTE",
          issuerBank: "HSBC International",
        },
      };
    }

    // Default for clean payouts (e.g. PO-1024)
    return {
      id: `ev-dispute-${payoutId}`,
      category: "GATEWAY_DISPUTES",
      label: "Gateway Dispute & Chargeback Query",
      status: "NO_MATCH",
      amount: 0,
      source: "Razorpay Dispute & Settlement API",
      reference: "QUERY-RZP-CLEAN",
      detail:
        "Settlement dispute ledger queried. Zero chargebacks or dispute holds recorded for this batch.",
      verifiedAt: timestamp,
    };
  }
}
