import { FinancialBrief, IAIFinancialService } from "./types";
import { callLLMForJSON, getModelName } from "./llmClient";
import {
  getFinancialSummary,
  getOverdueInvoices,
  getUpcomingPayables,
  getOpenExceptions,
  getRecentTransactions,
  logAgentActivity,
} from "@/lib/orchestrator";
import { RuleBasedFinancialAnalyzer } from "./financialAnalyzer";

type LLMBriefPayload = Pick<FinancialBrief, "summary" | "healthStatus" | "observations" | "recommendedActions">;

/**
 * Analysis Agent: synthesizes the daily financial brief by handing the LLM a
 * grounded JSON snapshot of real Finova data and asking it to explain,
 * surface risks and recommend actions. Falls back to the deterministic
 * RuleBasedFinancialAnalyzer if no LLM key is configured or the call fails.
 */
export class LLMFinancialAnalyzer implements IAIFinancialService {
  private fallback = new RuleBasedFinancialAnalyzer();

  async generateFinancialBrief(organizationId?: string): Promise<FinancialBrief> {
    const [summary, overdueInvoices, upcomingPayables, exceptions, recentTransactions] = await Promise.all([
      getFinancialSummary(organizationId),
      getOverdueInvoices(organizationId),
      getUpcomingPayables(organizationId, 7),
      getOpenExceptions(organizationId),
      getRecentTransactions(organizationId, 10),
    ]);

    try {
      const payload = await callLLMForJSON<LLMBriefPayload>([
        {
          role: "system",
          content:
            "You are Finova's Analysis Agent. Given a JSON snapshot of a company's real financial data, produce a " +
            "grounded executive brief. Only reference figures present in the data - never invent numbers. " +
            'Respond ONLY as JSON matching: {"summary": string, "healthStatus": "STABLE"|"WATCHLIST"|"CRITICAL"|"OPTIMAL", ' +
            '"observations": [{"id": string, "type": "REVENUE"|"EXPENSE"|"PAYABLE"|"RECEIVABLE"|"CASH_FLOW"|"ANOMALY", "title": string, ' +
            '"detail": string, "changePercentage": number, "impact": "POSITIVE"|"NEGATIVE"|"NEUTRAL"|"WARNING", "metricRef": string}], ' +
            '"recommendedActions": [{"id": string, "action": string, "priority": "HIGH"|"MEDIUM"|"LOW", ' +
            '"category": "CASH_PRESERVATION"|"AR_COLLECTION"|"EXPENSE_REDUCTION"|"RECONCILIATION", "potentialImpact": string, "routeTo": string}]}',
        },
        {
          role: "user",
          content: JSON.stringify({ summary, overdueInvoices, upcomingPayables, exceptions, recentTransactions }),
        },
      ]);

      const brief: FinancialBrief = {
        generatedAt: new Date().toISOString(),
        ...payload,
        modelInfo: {
          engine: getModelName(),
          mode: "LLM_SYNTHESIS",
          confidenceScore: 0.9,
        },
      };

      await logAgentActivity({
        agentName: "analysis-agent",
        taskType: "FINANCIAL_BRIEF",
        status: "COMPLETED",
        summary: brief.summary,
        output: brief,
        confidenceScore: brief.modelInfo.confidenceScore,
        mode: "LLM_SYNTHESIS",
        organizationId: organizationId || "comp_arcova",
      });

      return brief;
    } catch (error) {
      console.error("LLM financial brief generation failed, falling back to rule engine:", error);
      const brief = await this.fallback.generateFinancialBrief(organizationId);
      await logAgentActivity({
        agentName: "analysis-agent",
        taskType: "FINANCIAL_BRIEF",
        status: "COMPLETED",
        summary: `${brief.summary} (LLM unavailable, used rule engine fallback)`,
        output: brief,
        confidenceScore: brief.modelInfo.confidenceScore,
        mode: "RULE_ENGINE",
        organizationId: organizationId || "comp_arcova",
      });
      return brief;
    }
  }
}
