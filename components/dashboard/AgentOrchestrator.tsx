"use client";

import React, { useState } from "react";
import {
  Bot,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
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

const initialAgents: AgentNode[] = [
  {
    id: "cfo-agent",
    name: "CFO Agent",
    role: "Liquidity & Capital Strategy",
    status: "running",
    statusText: "Running",
    activity: "Simulating 60-day cash buffer against ₹8.6L projected revenue",
    metrics: "3 risks detected",
  },
  {
    id: "analysis-agent",
    name: "Analysis Agent",
    role: "Variance & Spend Intelligence",
    status: "completed",
    statusText: "Completed",
    activity: "Flagged +18% marketing expense acceleration vs 3-mo baseline",
    metrics: "4 anomalies scanned",
  },
  {
    id: "reconciliation-agent",
    name: "Reconciliation Agent",
    role: "Bank & Ledger Matching",
    status: "waiting",
    statusText: "Waiting for approval",
    activity: "82 transactions reconciled; 3 ledger mismatches pending review",
    metrics: "82 matched / 3 pending",
  },
  {
    id: "invoice-agent",
    name: "Invoice Agent",
    role: "Receivables & Vendor Intake",
    status: "running",
    statusText: "Running",
    activity: "Processed 14 client invoices; auto-matched 9 payment receipts",
    metrics: "14 processed",
  },
  {
    id: "reporting-agent",
    name: "Reporting Agent",
    role: "Tax & Financial Statements",
    status: "completed",
    statusText: "Completed",
    activity: "August 2025 provisional P&L and GST summary ledger compiled",
    metrics: "Audit-ready",
  },
];

interface AgentOrchestratorProps {
  onTriggerSync?: () => void;
  onApproveBatch?: () => void;
}

export function AgentOrchestrator({ onTriggerSync, onApproveBatch }: AgentOrchestratorProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [agents, setAgents] = useState(initialAgents);

  const handleSync = () => {
    setIsSyncing(true);
    if (onTriggerSync) onTriggerSync();
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
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
            title="Force synchronization across all 5 agents"
          >
            <RefreshCw size={13} className={isSyncing ? styles.spinIcon : ""} />
            <span>{isSyncing ? "Syncing Pipeline..." : "Sync All Agents"}</span>
          </button>
          <button
            className={styles.approveBtn}
            onClick={onApproveBatch}
            title="Approve pending Reconciliation Agent batch"
          >
            <CheckCircle2 size={13} />
            <span>Approve Batch (3)</span>
          </button>
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
