"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Bot,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  RefreshCw,
} from "lucide-react";
import styles from "./AgentOrchestrator.module.css";

interface AgentNode {
  id: string;
  name: string;
  role: string;
  status: "running" | "completed" | "waiting" | "attention";
  statusText: string;
  activity: string;
  metrics: string;
}

interface AgentActivityRecord {
  id: string;
  agentName: string;
  taskType: string;
  status: string;
  summary: string;
  confidenceScore: number | null;
  mode: string;
  createdAt: string;
}

interface ReconciliationMatch {
  id: string;
  status: string;
}

const AGENT_DEFS: Array<{ id: string; agentName: string; name: string; role: string }> = [
  { id: "cash-agent", agentName: "cash-agent", name: "Cash Agent", role: "Liquidity & Runway" },
  { id: "expense-agent", agentName: "expense-agent", name: "Expense Agent", role: "Spend Pattern Intelligence" },
  { id: "revenue-agent", agentName: "revenue-agent", name: "Revenue Agent", role: "Growth & Receivables" },
  { id: "reconciliation-agent", agentName: "reconciliation-agent", name: "Reconciliation Agent", role: "Bank & Ledger Matching" },
  { id: "risk-agent", agentName: "risk-agent", name: "Risk Agent", role: "Signal Triage & Severity" },
];

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function buildAgentNodes(activityByAgent: Map<string, AgentActivityRecord>): AgentNode[] {
  return AGENT_DEFS.map((def) => {
    const latest = activityByAgent.get(def.agentName);

    if (!latest) {
      return {
        id: def.id,
        name: def.name,
        role: def.role,
        status: "waiting",
        statusText: "Idle",
        activity: "Not yet wired to a live workflow in this build.",
        metrics: "No runs yet",
      };
    }

    const status: AgentNode["status"] =
      latest.status === "NEEDS_APPROVAL" ? "waiting" : latest.status === "FAILED" ? "attention" : "completed";
    const statusText =
      latest.status === "NEEDS_APPROVAL" ? "Waiting for approval" : latest.status === "FAILED" ? "Needs attention" : "Completed";

    return {
      id: def.id,
      name: def.name,
      role: def.role,
      status,
      statusText,
      activity: latest.summary,
      metrics: `${latest.mode === "LLM_SYNTHESIS" ? "LLM" : "Rule engine"} · ${timeAgo(latest.createdAt)}`,
    };
  });
}

interface AgentOrchestratorProps {
  onTriggerSync?: () => void;
  onApproveBatch?: () => void;
}

export function AgentOrchestrator({ onTriggerSync }: AgentOrchestratorProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [agents, setAgents] = useState<AgentNode[]>(buildAgentNodes(new Map()));
  const [pendingCount, setPendingCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const [activityRes, matchesRes] = await Promise.all([
        fetch("/api/orchestrator/activity?limit=50"),
        fetch("/api/reconciliation/matches"),
      ]);
      const activityJson = await activityRes.json();
      const matchesJson = await matchesRes.json();

      if (activityJson.success) {
        const byAgent = new Map<string, AgentActivityRecord>();
        for (const record of activityJson.data as AgentActivityRecord[]) {
          if (!byAgent.has(record.agentName)) byAgent.set(record.agentName, record);
        }
        setAgents(buildAgentNodes(byAgent));
      }

      if (matchesJson.success) {
        const pending = (matchesJson.data as ReconciliationMatch[]).filter((m) => m.status === "PROPOSED").length;
        setPendingCount(pending);
      }
    } catch (error) {
      console.error("Failed to refresh agent orchestrator state:", error);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleSync = async () => {
    setIsSyncing(true);
    if (onTriggerSync) onTriggerSync();
    try {
      await fetch("/api/agents/run", { method: "POST" });
      await refresh();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.badgeRow}>
            <span className={styles.orchestratorTag}>
              <Sparkles size={12} />
              Autonomous Finance OS
            </span>
            <span className={styles.systemStatus}>
              <span className={styles.pulsingDot} />
              Finova AI is coordinating 5 finance agents
            </span>
          </div>
          <h3 className={styles.title}>AI Agent Orchestrator</h3>
          <p className={styles.subtitle}>
            Specialized autonomous finance agents collaborate continuously in the background to keep ledgers balanced and risks mitigated.
          </p>
        </div>

        <div className={styles.actionsGroup}>
          <button
            className={`${styles.syncBtn} ${isSyncing ? styles.syncing : ""}`}
            onClick={handleSync}
            disabled={isSyncing}
            title="Run the Reconciliation and Analysis agents now"
          >
            <RefreshCw size={13} className={isSyncing ? styles.spinIcon : ""} />
            <span>{isSyncing ? "Syncing Pipeline..." : "Sync All Agents"}</span>
          </button>
          <Link href="/reconciliation" className={styles.approveBtn} title="Review pending reconciliation matches">
            <CheckCircle2 size={13} />
            <span>Review Pending ({pendingCount})</span>
          </Link>
        </div>
      </div>

      {/* Connected Workflow Pipeline */}
      <div className={styles.pipeline}>
        {agents.map((agent, index) => {
          return (
            <React.Fragment key={agent.id}>
              <div className={styles.agentCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.agentIdentity}>
                    <div className={styles.botIcon}>
                      <Bot size={15} />
                    </div>
                    <div>
                      <h4 className={styles.agentName}>{agent.name}</h4>
                      <span className={styles.agentRole}>{agent.role}</span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <span
                    className={`${styles.statusBadge} ${
                      agent.status === "running"
                        ? styles.statusRunning
                        : agent.status === "completed"
                        ? styles.statusCompleted
                        : agent.status === "waiting"
                        ? styles.statusWaiting
                        : styles.statusAttention
                    }`}
                  >
                    {agent.status === "running" && <span className={styles.runDot} />}
                    {agent.status === "completed" && <CheckCircle2 size={10} />}
                    {agent.status === "waiting" && <Clock size={10} />}
                    {agent.status === "attention" && <AlertTriangle size={10} />}
                    <span>{agent.statusText}</span>
                  </span>
                </div>

                <p className={styles.activityDesc}>{agent.activity}</p>

                <div className={styles.cardFooter}>
                  <span className={styles.metricTag}>
                    <Layers size={10} />
                    {agent.metrics}
                  </span>
                </div>
              </div>

              {/* Connecting Pipe / Arrow */}
              {index < agents.length - 1 && (
                <div className={styles.pipelineConnector}>
                  <div className={styles.connectorLine}>
                    <div className={styles.dataPulse} />
                  </div>
                  <ArrowRight size={14} className={styles.connectorArrow} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
