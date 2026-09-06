"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileSpreadsheet,
  AlertCircle,
  FileCheck,
  BarChart3,
  CheckCircle2,
  RotateCcw,
  Shield,
  Layers,
} from "lucide-react";
import { CloseRunStage } from "./stages/CloseRunStage";
import { ExceptionQueueStage } from "./stages/ExceptionQueueStage";
import { InvestigationStage } from "./stages/InvestigationStage";
import { ProposedCorrectionStage } from "./stages/ProposedCorrectionStage";
import { PolicyProposalStage } from "./stages/PolicyProposalStage";
import { PolicyBacktestStage } from "./stages/PolicyBacktestStage";
import { OctoberReplayStage } from "./stages/OctoberReplayStage";
import { AuditTrailStage } from "./stages/AuditTrailStage";
import { EvaluationStage } from "./stages/EvaluationStage";
import { WorkbenchState, INITIAL_AUDIT_TRAIL } from "@/lib/finance/workbenchService";
import styles from "./WorkbenchShell.module.css";

const STAGES_NAV = [
  { stage: 1, label: "1 Close run" },
  { stage: 2, label: "2 Exceptions" },
  { stage: 3, label: "3 Investigation" },
  { stage: 4, label: "4 Proposed entry" },
  { stage: 5, label: "5 Policy proposal" },
  { stage: 6, label: "6 Policy backtest" },
  { stage: 7, label: "7 October replay" },
  { stage: 8, label: "8 Audit trail" },
  { stage: 9, label: "9 Evaluation" },
];

export function WorkbenchShell() {
  const [state, setState] = useState<WorkbenchState>({
    stage: 1,
    activeTab: "close",
    period: "September 2026",
    reconciliationRun: false,
    selectedExceptionId: "exc-cloudflare",
    entryApproved: false,
    policyProposed: false,
    policyBacktested: false,
    policyActive: false,
    octoberReplayed: false,
    auditTrail: INITIAL_AUDIT_TRAIL,
  });

  const [loading, setLoading] = useState(false);

  // Sync state from server on mount
  useEffect(() => {
    async function fetchState() {
      try {
        const res = await fetch("/api/workbench");
        const json = await res.json();
        if (json.success && json.state) {
          setState(json.state);
        }
      } catch (err) {
        console.warn("Using client workbench state:", err);
      }
    }
    fetchState();
  }, []);

  const sendAction = useCallback(async (action: string, payload?: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/workbench", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      const json = await res.json();
      if (json.success && json.state) {
        setState(json.state);
      }
    } catch (err) {
      console.warn("Action fell back to optimistic update:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handlers for Workbench flow
  const handleSetStage = (stageNum: number) => {
    let tab: "close" | "exceptions" | "audit" | "evaluation" = "close";
    if (stageNum >= 2 && stageNum <= 7) tab = "exceptions";
    else if (stageNum === 8) tab = "audit";
    else if (stageNum === 9) tab = "evaluation";

    setState((prev) => ({
      ...prev,
      stage: stageNum,
      activeTab: tab,
      period: stageNum === 7 ? "October 2026" : "September 2026",
    }));
    sendAction("set_stage", { stage: stageNum });
  };

  const handleSetTab = (tab: "close" | "exceptions" | "audit" | "evaluation") => {
    let newStage = 1;
    if (tab === "close") newStage = 1;
    else if (tab === "exceptions") newStage = state.stage >= 2 && state.stage <= 7 ? state.stage : 2;
    else if (tab === "audit") newStage = 8;
    else if (tab === "evaluation") newStage = 9;

    setState((prev) => ({
      ...prev,
      activeTab: tab,
      stage: newStage,
    }));
    sendAction("set_tab", { tab });
  };

  const handleRunReconciliation = () => {
    setState((prev) => ({
      ...prev,
      reconciliationRun: true,
      stage: 2,
      activeTab: "exceptions",
    }));
    sendAction("reconcile");
  };

  const handleSelectException = (id: string) => {
    setState((prev) => ({ ...prev, selectedExceptionId: id }));
    sendAction("select_exception", { id });
  };

  const handleInvestigate = (id: string) => {
    setState((prev) => ({
      ...prev,
      selectedExceptionId: id,
      stage: 3,
    }));
    sendAction("set_stage", { stage: 3 });
  };

  const handleProceedFromInvestigation = () => {
    setState((prev) => ({ ...prev, stage: 4 }));
    sendAction("set_stage", { stage: 4 });
  };

  const handleApproveEntry = () => {
    setState((prev) => ({
      ...prev,
      entryApproved: true,
      policyProposed: true,
      stage: 5,
    }));
    sendAction("approve_entry");
  };

  const handleBacktestPolicy = () => {
    setState((prev) => ({
      ...prev,
      policyBacktested: true,
      stage: 6,
    }));
    sendAction("backtest_policy");
  };

  const handleActivatePolicy = () => {
    setState((prev) => ({
      ...prev,
      policyActive: true,
      octoberReplayed: true,
      period: "October 2026",
      stage: 7,
    }));
    sendAction("activate_policy");
  };

  const handleViewAuditTrail = () => {
    setState((prev) => ({ ...prev, stage: 8, activeTab: "audit" }));
    sendAction("set_stage", { stage: 8 });
  };

  const handleViewEvaluation = () => {
    setState((prev) => ({ ...prev, stage: 9, activeTab: "evaluation" }));
    sendAction("set_stage", { stage: 9 });
  };

  const handleReset = () => {
    setState({
      stage: 1,
      activeTab: "close",
      period: "September 2026",
      reconciliationRun: false,
      selectedExceptionId: "exc-cloudflare",
      entryApproved: false,
      policyProposed: false,
      policyBacktested: false,
      policyActive: false,
      octoberReplayed: false,
      auditTrail: INITIAL_AUDIT_TRAIL,
    });
    sendAction("reset");
  };

  return (
    <div className={styles.workbenchRoot}>
      {/* Physical Environment Backdrop */}
      <div className={styles.environmentLayer}>
        <Image
          src="/island_hero_bg.jpg"
          alt="Finova Architectural Environment"
          fill
          priority
          quality={90}
          className={styles.environmentImage}
        />
        <div className={styles.environmentAtmosphere} />
      </div>

      <div className={styles.workbenchViewport}>
        {/* LEVEL 2 — Controller Workbench Floating Glass Sidebar */}
        <aside className={styles.sidebar}>
          <div>
            <Link href="/" className={styles.brandLogo}>
              <Shield size={20} color="#FFFFFF" strokeWidth={2.2} />
              <span className={styles.brandText}>FINOVA</span>
            </Link>

            <nav>
              <ul className={styles.navMenu}>
                <li>
                  <button
                    type="button"
                    className={`${styles.navBtn} ${
                      state.activeTab === "close" ? styles.navBtnActive : ""
                    }`}
                    onClick={() => handleSetTab("close")}
                  >
                    <div className={styles.navBtnLeft}>
                      <FileSpreadsheet size={16} />
                      <span>Close</span>
                    </div>
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className={`${styles.navBtn} ${
                      state.activeTab === "exceptions" ? styles.navBtnActive : ""
                    }`}
                    onClick={() => handleSetTab("exceptions")}
                  >
                    <div className={styles.navBtnLeft}>
                      <AlertCircle size={16} />
                      <span>Exceptions</span>
                    </div>
                    <span className={styles.navBadge}>2</span>
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className={`${styles.navBtn} ${
                      state.activeTab === "audit" ? styles.navBtnActive : ""
                    }`}
                    onClick={() => handleSetTab("audit")}
                  >
                    <div className={styles.navBtnLeft}>
                      <FileCheck size={16} />
                      <span>Audit</span>
                    </div>
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className={`${styles.navBtn} ${
                      state.activeTab === "evaluation" ? styles.navBtnActive : ""
                    }`}
                    onClick={() => handleSetTab("evaluation")}
                  >
                    <div className={styles.navBtnLeft}>
                      <BarChart3 size={16} />
                      <span>Evaluation</span>
                    </div>
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className={styles.sidebarFooter}>
            <div className={styles.periodBadge}>
              <span style={{ color: "var(--color-cleared-green)" }}>●</span>
              <span>{state.period}</span>
            </div>
            <div className={styles.controllerRole}>
              Priya Sharma • Controller
            </div>
          </div>
        </aside>

        {/* LEVEL 2 — Main Workspace Stage (Large Floating Glass Surface) */}
        <main className={styles.stageWrapper}>
          {/* LEVEL 1 — Floating Glass Navigation Bar (Suspended Pill) */}
          <div className={styles.stageHeaderContainer}>
            <div className={styles.stageHeader}>
              <div className={styles.stageProgressPills}>
                {STAGES_NAV.map((s) => (
                  <button
                    key={s.stage}
                    type="button"
                    className={`${styles.stepPill} ${
                      state.stage === s.stage ? styles.stepPillActive : ""
                    }`}
                    onClick={() => handleSetStage(s.stage)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className={styles.headerRight}>
                <div className={styles.periodDropdown}>
                  {state.period}
                </div>
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={handleReset}
                  title="Reset Demo to Step 1"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* LEVEL 3 — Scrollable Stage Content (Suspended Glass Context Panels) */}
          <div className={styles.stageScrollArea}>
            {state.stage === 1 && (
              <CloseRunStage onRunReconciliation={handleRunReconciliation} />
            )}

            {state.stage === 2 && (
              <ExceptionQueueStage
                selectedId={state.selectedExceptionId}
                onSelect={handleSelectException}
                onInvestigate={handleInvestigate}
              />
            )}

            {state.stage === 3 && (
              <InvestigationStage
                selectedId={state.selectedExceptionId}
                onSelectException={handleSelectException}
                onProceed={handleProceedFromInvestigation}
              />
            )}

            {state.stage === 4 && (
              <ProposedCorrectionStage
                selectedId={state.selectedExceptionId}
                onSelectException={handleSelectException}
                onApproveEntry={handleApproveEntry}
                onReject={() => handleSetStage(2)}
              />
            )}

            {state.stage === 5 && (
              <PolicyProposalStage onBacktestPolicy={handleBacktestPolicy} />
            )}

            {state.stage === 6 && (
              <PolicyBacktestStage onActivatePolicy={handleActivatePolicy} />
            )}

            {state.stage === 7 && (
              <OctoberReplayStage onViewAuditTrail={handleViewAuditTrail} />
            )}

            {state.stage === 8 && (
              <AuditTrailStage
                auditTrail={state.auditTrail}
                onViewEvaluation={handleViewEvaluation}
              />
            )}

            {state.stage === 9 && (
              <EvaluationStage
                onReset={handleReset}
                onReturnToClose={() => handleSetStage(1)}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
