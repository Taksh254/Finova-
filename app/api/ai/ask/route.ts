/**
 * Alias for /api/ai/chat matching the build brief's documented endpoint name
 * (POST /api/ai/ask). Same handler - kept as a thin re-export so there's one
 * implementation of "ask the CFO agent a question".
 */
export { POST } from "../chat/route";
