"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Bot, Send, User } from "lucide-react";
import styles from "./AICFOPage.module.css";

interface RecommendedAction {
  action: string;
  routeTo?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendedActions?: RecommendedAction[];
  mode?: "RULE_ENGINE" | "LLM_SYNTHESIS";
}

const SUGGESTIONS = [
  "What changed in our cash position this month?",
  "Which invoices are overdue right now?",
  "What should I prioritize this week?",
  "Are there any anomalies I should know about?",
];

let messageCounter = 0;
function nextId() {
  messageCounter += 1;
  return `msg-${messageCounter}`;
}

export default function AICFOPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nextId(),
      role: "assistant",
      content:
        "I'm Finova's AI CFO. Ask me about cash flow, revenue, overdue invoices, or anything else in the ledger and I'll answer using your real financial data.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = { id: nextId(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const json = await res.json();

      if (json.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            content: json.data.answer,
            recommendedActions: json.data.recommendedActions,
            mode: json.data.mode,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "assistant", content: "I couldn't reach the financial data right now. Please try again." },
        ]);
      }
    } catch (error) {
      console.error("AI CFO chat request failed:", error);
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", content: "Something went wrong reaching the AI CFO. Please try again." },
      ]);
    } finally {
      setIsSending(false);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconBox}>
          <Bot size={20} />
        </div>
        <div>
          <h2 className={styles.title}>FINOVA AI CFO</h2>
          <p className={styles.subtitle}>Grounded answers, insights and recommendations from your live ledger.</p>
        </div>
      </div>

      <div className={styles.chatPanel}>
        <div className={styles.messages} ref={scrollRef}>
          {messages.map((m) => (
            <div key={m.id} className={`${styles.messageRow} ${m.role === "user" ? styles.messageRowUser : ""}`}>
              <div className={`${styles.avatar} ${m.role === "user" ? styles.avatarUser : styles.avatarAI}`}>
                {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div>
                <div className={`${styles.bubble} ${m.role === "user" ? styles.bubbleUser : ""}`}>{m.content}</div>
                {m.recommendedActions && m.recommendedActions.length > 0 && (
                  <div className={styles.actionRow}>
                    {m.recommendedActions.map((action, i) =>
                      action.routeTo ? (
                        <Link key={i} href={action.routeTo} className={styles.actionLink}>
                          {action.action}
                        </Link>
                      ) : (
                        <span key={i} className={styles.actionLink}>
                          {action.action}
                        </span>
                      )
                    )}
                  </div>
                )}
                {m.mode && <span className={styles.modeTag}>{m.mode === "LLM_SYNTHESIS" ? "GLM-4.7 Flash" : "Rule engine"}</span>}
              </div>
            </div>
          ))}
          {isSending && (
            <div className={styles.messageRow}>
              <div className={`${styles.avatar} ${styles.avatarAI}`}>
                <Bot size={14} />
              </div>
              <div className={styles.bubble}>
                <div className={styles.typingDots}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <button key={s} className={styles.suggestionChip} onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          className={styles.inputBar}
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the AI CFO about your finances..."
            disabled={isSending}
          />
          <button type="submit" className={styles.sendBtn} disabled={isSending || !input.trim()}>
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
