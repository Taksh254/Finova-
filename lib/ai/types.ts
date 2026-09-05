/**
 * AI Service Interfaces & Types for FINOVA
 * Designed for future LLM integration, agentic workflows, and RAG retrieval.
 */

export type FinancialHealthStatus = "STABLE" | "WATCHLIST" | "CRITICAL" | "OPTIMAL";

export interface FinancialObservation {
  id: string;
  type: "REVENUE" | "EXPENSE" | "PAYABLE" | "RECEIVABLE" | "CASH_FLOW" | "ANOMALY";
  title: string;
  detail: string;
  changePercentage?: number;
  impact: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "WARNING";
  metricRef?: string;
}

export interface RecommendedAction {
  id: string;
  action: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  category: "CASH_PRESERVATION" | "AR_COLLECTION" | "EXPENSE_REDUCTION" | "RECONCILIATION";
  potentialImpact?: string;
  routeTo?: string; // App route to take action
}

export interface FinancialBrief {
  generatedAt: string;
  healthStatus: FinancialHealthStatus;
  summary: string;
  observations: FinancialObservation[];
  recommendedActions: RecommendedAction[];
  modelInfo: {
    engine: string;
    mode: "RULE_ENGINE" | "LLM_SYNTHESIS" | "AGENTIC";
    confidenceScore: number;
  };
}

export interface IAIFinancialService {
  generateFinancialBrief(companyId?: string): Promise<FinancialBrief>;
}
