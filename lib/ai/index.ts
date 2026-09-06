import { RuleBasedFinancialAnalyzer } from "./financialAnalyzer";
import { LLMFinancialAnalyzer } from "./llmFinancialAnalyzer";
import { IAIFinancialService } from "./types";
import { isLLMAvailable } from "./llmClient";

export * from "./types";
export * from "./financialAnalyzer";
export * from "./llmFinancialAnalyzer";
export * from "./llmClient";

/**
 * AI Service Factory. Picks LLMFinancialAnalyzer (GPT-OSS via Groq, behind
 * IAIFinancialService) when GROQ_API_KEY is configured, otherwise falls
 * back to the deterministic rule engine - swapping providers never requires
 * touching call sites.
 */
let aiServiceInstance: IAIFinancialService | null = null;

export function getAIService(): IAIFinancialService {
  if (!aiServiceInstance) {
    aiServiceInstance = isLLMAvailable() ? new LLMFinancialAnalyzer() : new RuleBasedFinancialAnalyzer();
  }
  return aiServiceInstance;
}
