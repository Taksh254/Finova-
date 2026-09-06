/**
 * FINOVA Structured Evidence & Investigation Types
 * Phase 2.2 — Evidence / Investigation Layer
 */

export type EvidenceStatus =
  | "NOT_CHECKED"
  | "CHECKING"
  | "VERIFIED"
  | "NO_MATCH"
  | "PARTIALLY_MATCHED"
  | "FAILED";

export type EvidenceCategory =
  | "TRANSACTIONS"
  | "FEES"
  | "REFUNDS"
  | "TAXES"
  | "GATEWAY_DISPUTES"
  | "RESERVE_WITHHOLDING"
  | "BANK";

export type InvestigationConclusion =
  | "EXPLAINED"
  | "PARTIALLY_EXPLAINED"
  | "UNEXPLAINED";

export interface StructuredEvidenceItem {
  id: string;
  category: EvidenceCategory;
  label: string;
  status: EvidenceStatus;
  amount?: number;
  source: string;
  reference?: string;
  detail: string;
  verifiedAt?: string;
  metadata?: Record<string, any>;
}

export interface InvestigationResult {
  payoutId: string;
  originalExpected: number;
  actualReceived: number;
  originalVariance: number;
  evidence: StructuredEvidenceItem[];
  conclusion: InvestigationConclusion;
  totalEvidenceDiscovered: number;
  remainingVariance: number;
  applicableAdjustment: number;
  investigatedAt: string;
  notes: string;
}

export interface InvestigationScenarioOptions {
  scenario?: "FULL" | "PARTIAL" | "NONE";
}
