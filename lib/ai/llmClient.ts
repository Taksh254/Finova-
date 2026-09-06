/**
 * Thin wrapper around Groq's OpenAI-compatible chat completions endpoint.
 * Keeps the LLM provider isolated behind one interface so it can be swapped
 * (per the Finova build brief) without touching orchestrator/agent code.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Override via GROQ_MODEL in .env if you want a different model.
const DEFAULT_MODEL = "openai/gpt-oss-120b";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMCallOptions {
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export function isLLMAvailable(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

export function getModelName(): string {
  return process.env.GROQ_MODEL || DEFAULT_MODEL;
}

/**
 * Calls the LLM and returns the raw text content of the response.
 * Throws if GROQ_API_KEY is not configured or the API call fails -
 * callers are expected to catch and fall back to deterministic logic.
 */
export async function callLLM(messages: LLMMessage[], options: LLMCallOptions = {}): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: getModelName(),
        messages,
        temperature: options.temperature ?? 0.2,
        max_tokens: options.maxTokens ?? 1200,
        ...(options.jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`Groq API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.length) {
      throw new Error("Groq API returned an empty response");
    }
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Calls the LLM expecting a JSON object response and parses it.
 * Strips markdown code fences defensively in case the model wraps its output.
 */
export async function callLLMForJSON<T>(messages: LLMMessage[], options: LLMCallOptions = {}): Promise<T> {
  const raw = await callLLM(messages, { ...options, jsonMode: true });
  const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  return JSON.parse(cleaned) as T;
}
