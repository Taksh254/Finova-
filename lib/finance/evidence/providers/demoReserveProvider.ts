/**
 * Demo Reserve Withholding Evidence Provider
 * Inspects rolling reserve hold logs and contract reserve terms (Demo Provider).
 * Swappable with real ERP / merchant contract connectors.
 */

import { StructuredEvidenceItem } from "../types";

export interface ReserveWithholdingProvider {
  checkReserveWithholding(payoutId: string): Promise<StructuredEvidenceItem>;
}

export class DemoReserveProvider implements ReserveWithholdingProvider {
  async checkReserveWithholding(payoutId: string): Promise<StructuredEvidenceItem> {
    const timestamp = new Date().toISOString();

    return {
      id: `ev-reserve-${payoutId}`,
      category: "RESERVE_WITHHOLDING",
      label: "Rolling Reserve Policy Audit",
      status: "NO_MATCH",
      amount: 0,
      source: "Merchant Agreement Policy Engine",
      reference: "POLICY-CLAUSE-8B",
      detail:
        "Verified against active merchant agreement. Zero rolling reserve withholdings or security escrows applied to this settlement period.",
      verifiedAt: timestamp,
      metadata: {
        reserveRate: "0.00%",
        policyStatus: "INACTIVE",
      },
    };
  }
}
