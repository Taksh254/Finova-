/**
 * Shared "explain this already-computed data" step for every agent. Never
 * asked to calculate anything - only to narrate numbers already produced by
 * a tool. If no LLM key is configured, or the call fails, callers fall back
 * to a deterministic templated answer so the feature never silently
 * degrades into a broken response.
 */

import { isLLMAvailable, callLLMForJSON } from "@/lib/ai/llmClient";

const GROUNDING_CLAUSE =
  "You must never invent, estimate, or guess a financial figure. Only cite numbers present verbatim in the JSON " +
  "context you are given. If the context does not contain enough information to answer, say so explicitly instead " +
  'of fabricating a number. Respond ONLY as JSON: {"answer": string, "confidenceScore": number between 0 and 1}.';

export interface SynthesisResult {
  answer: string;
  confidenceScore: number;
  mode: "RULE_ENGINE" | "LLM_SYNTHESIS";
}

export async function synthesizeAnswer(params: {
  systemInstructions: string;
  question: string;
  context: Record<string, unknown>;
  fallback: () => string;
}): Promise<SynthesisResult> {
  if (!isLLMAvailable()) {
    return { answer: params.fallback(), confidenceScore: 0.7, mode: "RULE_ENGINE" };
  }

  try {
    const result = await callLLMForJSON<{ answer: string; confidenceScore: number }>([
      { role: "system", content: `${params.systemInstructions}\n\n${GROUNDING_CLAUSE}` },
      { role: "user", content: JSON.stringify({ question: params.question, context: params.context }) },
    ]);
    return {
      answer: result.answer,
      confidenceScore: typeof result.confidenceScore === "number" ? result.confidenceScore : 0.85,
      mode: "LLM_SYNTHESIS",
    };
  } catch (error) {
    console.error("Agent LLM synthesis failed, falling back to deterministic answer:", error);
    return { answer: params.fallback(), confidenceScore: 0.7, mode: "RULE_ENGINE" };
  }
}
