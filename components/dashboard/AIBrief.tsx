"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { FinancialBrief } from "@/lib/ai/types";
import styles from "./AIBrief.module.css";

interface AIBriefProps {
  brief: FinancialBrief;
}

export function AIBrief({ brief }: AIBriefProps) {
  const isStable = brief.healthStatus === "STABLE";

  return (
    <section className={styles.container} aria-label="Finova Intelligence Brief">
      <div className={styles.header}>
        <div className={styles.brandPill}>
          <div className={styles.aiIcon}>
            <Sparkles size={13} />
          </div>
          <span className={styles.title}>FINOVA INTELLIGENCE</span>
        </div>

        <div
          className={`${styles.healthBadge} ${
            isStable ? styles.healthStable : styles.healthWatchlist
          }`}
        >
          <span className={styles.healthPulse} />
          <span>Financial health: {brief.healthStatus}</span>
        </div>
      </div>

      {/* Observations Grid */}
      <div className={styles.observationsGrid}>
        {brief.observations.map((obs) => (
          <div key={obs.id} className={styles.obsCard}>
            <div className={styles.obsTitle}>
              {obs.impact === "POSITIVE" ? (
                <CheckCircle2 size={14} color="var(--color-positive)" />
              ) : (
                <AlertCircle size={14} color="var(--color-warning)" />
              )}
              <span>{obs.title}</span>
            </div>
            <p className={styles.obsDetail}>{obs.detail}</p>
          </div>
        ))}
      </div>

      {/* Recommended Action */}
      <div className={styles.recommendedSection}>
        <div className={styles.recHeader}>
          <Sparkles size={12} />
          <span>Recommended Action</span>
        </div>
        <div className={styles.actionList}>
          {brief.recommendedActions.map((rec) => (
            <div key={rec.id} className={styles.actionItem}>
              <div className={styles.actionText}>
                <span className={styles.actionDot} />
                <span>{rec.action}</span>
              </div>
              {rec.routeTo && (
                <Link href={rec.routeTo} className={styles.actionLink}>
                  <span>Execute</span>
                  <ArrowRight size={11} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.modelTag}>{brief.modelInfo.engine}</span>
        <span>Confidence: {Math.round(brief.modelInfo.confidenceScore * 100)}% &bull; Live Synthesis</span>
      </div>
    </section>
  );
}
