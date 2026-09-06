"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CreditCard,
  AlertCircle,
  Sparkles,
  FileText,
  ShieldCheck,
  UserCheck,
  FileSpreadsheet,
  TestTube,
  CheckCircle2,
  Zap,
  ArrowRight,
} from "lucide-react";
import styles from "./GovernanceSection.module.css";

export function GovernanceSection() {
  return (
    <section id="control-loop" className={styles.controlLoopSection} aria-label="The FINOVA Control Loop">
      {/* Background landscape texture */}
      <div className={styles.backdropTexture}>
        <Image
          src="/island_hero_bg.jpg"
          alt="Cinematic background texture"
          fill
          className={styles.backdropImage}
        />
        <div className={styles.backdropGradient} />
      </div>

      <div className={styles.sectionContainer}>
        {/* ================= LEFT COLUMN ================= */}
        <div className={styles.leftCol}>
          <span className={styles.eyebrow}>THE FINOVA CONTROL LOOP</span>
          <h2 className={styles.headline}>
            AI recommends.
            <br />
            Finance <span className={styles.italicHeadline}>decides.</span>
          </h2>
          <p className={styles.subtitle}>
            A clear, safe and controllable path from transaction to automation.
          </p>
          <Link href="/overview" className={styles.actionBtn}>
            <span>See it in action</span>
            <ArrowRight size={13} strokeWidth={2.4} />
          </Link>
        </div>

        {/* ================= CENTER: 3 ROWS OF PILL NODES ================= */}
        <div className={styles.centerWorkflow}>
          {/* Row 1 */}
          <div className={styles.workflowRow}>
            <div className={styles.workflowNode}>
              <CreditCard size={14} className={styles.nodeIcon} />
              <span>Transaction</span>
            </div>
            <span className={styles.arrowRight}>→</span>

            <div className={styles.workflowNode}>
              <AlertCircle size={14} className={styles.nodeIcon} />
              <span>Exception</span>
            </div>
            <span className={styles.arrowRight}>→</span>

            <div className={styles.workflowNode}>
              <Sparkles size={14} className={styles.nodeIcon} />
              <span>AI investigation</span>
            </div>
          </div>

          {/* Row 2 */}
          <div className={styles.workflowRow}>
            <div className={styles.workflowNode}>
              <FileText size={14} className={styles.nodeIcon} />
              <span>Proposed entry</span>
            </div>
            <span className={styles.arrowRight}>→</span>

            <div className={styles.workflowNode}>
              <ShieldCheck size={14} className={styles.nodeIcon} />
              <span>Safety checks</span>
            </div>
            <span className={styles.arrowRight}>→</span>

            <div className={styles.workflowNode}>
              <UserCheck size={14} className={styles.nodeIcon} />
              <span>Controller approval</span>
            </div>
          </div>

          {/* Row 3 */}
          <div className={styles.workflowRow}>
            <div className={styles.workflowNode}>
              <FileSpreadsheet size={14} className={styles.nodeIcon} />
              <span>Policy proposal</span>
            </div>
            <span className={styles.arrowRight}>→</span>

            <div className={styles.workflowNode}>
              <TestTube size={14} className={styles.nodeIcon} />
              <span>Backtest</span>
            </div>
            <span className={styles.arrowRight}>→</span>

            <div className={styles.workflowNode}>
              <CheckCircle2 size={14} className={styles.nodeIcon} />
              <span>Policy activation</span>
            </div>
            <span className={styles.arrowRight}>→</span>

            <div className={styles.workflowNode}>
              <Zap size={14} className={styles.nodeIcon} />
              <span>Future automation</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: 3 METRICS ================= */}
        <div className={styles.rightMetrics}>
          <div className={styles.metricItem}>
            <div className={styles.metricBig}>100%</div>
            <div className={styles.metricLabel}>Human approval for postings</div>
          </div>

          <div className={styles.metricItem}>
            <div className={styles.metricBig}>0</div>
            <div className={styles.metricLabel}>Uncontrolled automation</div>
          </div>

          <div className={styles.metricItem}>
            <div className={styles.metricBig}>Full</div>
            <div className={styles.metricLabel}>Audit trail for every decision</div>
          </div>
        </div>
      </div>
    </section>
  );
}
