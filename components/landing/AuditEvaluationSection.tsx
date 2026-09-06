"use client";

import React from "react";
import { History, BarChart3, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import styles from "./AuditEvaluationSection.module.css";

const timelineEvents = [
  { time: "09:42", text: "Agent investigated transaction", isBlocked: false },
  { time: "09:43", text: "Invoice evidence found", isBlocked: false },
  { time: "09:43", text: "Journal entry proposed", isBlocked: false },
  { time: "09:44", text: "Safety checks passed", isBlocked: false },
  { time: "09:45", text: "Controller approved entry", isBlocked: false },
  { time: "09:46", text: "Policy proposed", isBlocked: false },
  { time: "09:47", text: "Backtest completed", isBlocked: false },
  { time: "09:48", text: "Policy activated", isBlocked: false },
  { time: "09:51", text: "October transaction auto-cleared", isBlocked: false },
  { time: "09:52", text: "₹7,00,000 transaction blocked", isBlocked: true },
];

export function AuditEvaluationSection() {
  return (
    <section id="audit-trail" className={styles.auditSectionRoot} aria-label="Audit Trail and System Evaluation">
      <div className={styles.auditContainer}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>
            <span>◆</span> VERIFIABILITY &amp; SYSTEM EVALUATION
          </span>
          <h2 className={styles.headline}>
            Zero black boxes.
            <br />
            An immutable <span className={styles.italicHeadline}>audit trail.</span>
          </h2>
          <p className={styles.supportingText}>
            Every investigation query, invoice lookup, mathematical assertion and human approval is cryptographically logged with sub-second timestamps.
          </p>
        </div>

        <div className={styles.splitGrid}>
          {/* ================= SECTION 12: FLOATING GLASS AUDIT DRAWER ================= */}
          <div className={styles.auditDrawerGlass}>
            <div className={styles.drawerHeader}>
              <div className={styles.drawerTitle}>
                <History size={16} strokeWidth={2} />
                <span>AUDIT TRAIL</span>
              </div>
              <span className={styles.timelineStatusBadge}>LIVE FEED</span>
            </div>

            <div className={styles.timelineTrack}>
              {timelineEvents.map((item, idx) => (
                <div key={idx} className={styles.timelineItem}>
                  <div
                    className={`${styles.timelineNode} ${
                      item.isBlocked ? styles.timelineNodeBlocked : ""
                    }`}
                  />
                  <span className={styles.timelineTime}>{item.time}</span>
                  <span className={styles.timelineText}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ================= SECTION 13: CLEAN GLASS EVALUATION PANEL ================= */}
          <div className={styles.evaluationGlassCard}>
            <div className={styles.evalHeader}>
              <div className={styles.evalTitle}>
                <BarChart3 size={16} strokeWidth={2} />
                <span>SYSTEM EVALUATION</span>
              </div>
              <span className={styles.groundTruthPill}>PRODUCTION TRUTH</span>
            </div>

            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <span className={`${styles.metricValue} ${styles.metricValueHighlight}`}>
                  0
                </span>
                <span className={styles.metricLabel}>Unsafe automatic resolutions</span>
                <span className={styles.metricSub}>All exceptions verified by rules</span>
              </div>

              <div className={styles.metricCard}>
                <span className={`${styles.metricValue} ${styles.metricValueHighlight}`}>
                  0
                </span>
                <span className={styles.metricLabel}>Unbalanced entries accepted</span>
                <span className={styles.metricSub}>Hard deterministic block on net ≠ 0</span>
              </div>

              <div className={styles.metricCard}>
                <span className={`${styles.metricValue} ${styles.metricValueHighlight}`}>
                  100%
                </span>
                <span className={styles.metricLabel}>Required escalations caught</span>
                <span className={styles.metricSub}>No silent passes on missing evidence</span>
              </div>

              <div className={styles.metricCard}>
                <span className={styles.metricValue}>-78%</span>
                <span className={styles.metricLabel}>AI calls after policy activation</span>
                <span className={styles.metricSub}>Deterministic matching takes over</span>
              </div>

              <div className={styles.metricRowWide}>
                <div>
                  <div className={styles.metricLabel}>Manual reviews before / after</div>
                  <div className={styles.metricSub}>Close cycle intervention dropped from 50 to 1 review</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.4rem", fontWeight: 700, color: "var(--color-forest-dark)" }}>
                  50 → 1
                </div>
              </div>

              <div className={styles.metricRowWide}>
                <div>
                  <div className={styles.metricLabel}>Long-tail multi-currency latency</div>
                  <div className={styles.metricSub}>Exotic FX conversion edge case speed benchmarking</div>
                </div>
                <div className={styles.unmeasuredBadge}>
                  NOT YET MEASURED
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
