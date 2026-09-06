"use client";

import React, { useState } from "react";
import { ArrowRight, Download, ShieldCheck, CheckCircle2 } from "lucide-react";
import { AuditEvent } from "@/lib/finance/workbenchService";
import styles from "./AuditTrailStage.module.css";

interface AuditTrailStageProps {
  auditTrail: AuditEvent[];
  onViewEvaluation: () => void;
}

export function AuditTrailStage({ auditTrail, onViewEvaluation }: AuditTrailStageProps) {
  const [filter, setFilter] = useState<string>("all");

  const filteredEvents = auditTrail.filter((e) => {
    if (filter === "all") return true;
    if (filter === "human") return e.actor.includes("Priya");
    if (filter === "policy") return e.actor.includes("Policy");
    if (filter === "safety") return e.actor.includes("Safety");
    return true;
  });

  const getActorClass = (actor: string) => {
    if (actor.includes("System")) return styles.actorSystem;
    if (actor.includes("Agent")) return styles.actorAgent;
    if (actor.includes("Safety")) return styles.actorSafety;
    if (actor.includes("Priya")) return styles.actorHuman;
    if (actor.includes("Policy")) return styles.actorPolicy;
    return styles.actorSystem;
  };

  const exportLog = () => {
    const jsonStr = JSON.stringify(auditTrail, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finova_audit_trail_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.stageHeaderRow}>
        <div>
          <span className={styles.stageEyebrow}>8/9 Audit trail</span>
          <h1 className={styles.stageTitle}>Immutable audit trail &amp; provenance</h1>
          <p className={styles.stageSubtitle}>
            Complete cryptographic record of proposals, safety checks, approvals, and automated policy executions
          </p>
        </div>

        <button type="button" className={styles.exportBtn} onClick={exportLog}>
          <Download size={14} />
          <span>Export audit log (JSON)</span>
        </button>
      </div>

      {/* Main Audit Card */}
      <div className={styles.auditCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.auditTable}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor / Engine</th>
                <th>Action Taken</th>
                <th>Version</th>
                <th>Provenance &amp; Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((ev) => (
                <tr key={ev.id}>
                  <td className={styles.timeCell}>{ev.timeDisplay}</td>
                  <td>
                    <span className={`${styles.actorPill} ${getActorClass(ev.actor)}`}>
                      {ev.actor}
                    </span>
                  </td>
                  <td className={styles.actionCell}>{ev.action}</td>
                  <td>
                    {ev.policyVersion ? (
                      <span className={styles.policyVersion}>{ev.policyVersion}</span>
                    ) : (
                      <span style={{ color: "var(--text-editorial-muted)" }}>—</span>
                    )}
                  </td>
                  <td className={styles.detailsCell}>{ev.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <button
          type="button"
          className={styles.evalBtn}
          onClick={onViewEvaluation}
        >
          <span>View operational evaluation metrics</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
