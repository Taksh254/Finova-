import { RuleBasedFinancialAnalyzer } from "./financialAnalyzer";
import { IAIFinancialService } from "./types";

export * from "./types";
export * from "./financialAnalyzer";

/**
 * AI Service Factory
 * In future phases, easily switch between RuleBasedFinancialAnalyzer and LLMFinancialAnalyzer
 * based on environment variables or tenant configuration.
 */
let aiServiceInstance: IAIFinancialService | null = null;

export function getAIService(): IAIFinancialService {
  if (!aiServiceInstance) {
    aiServiceInstance = new RuleBasedFinancialAnalyzer();
  }
  return aiServiceInstance;
}
