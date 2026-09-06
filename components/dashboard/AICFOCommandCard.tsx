"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, AlertCircle, TrendingUp, ShieldAlert, Sparkles } from "lucide-react";
import styles from "./AICFOCommandCard.module.css";

interface RecommendedAction {
  id: string;
  action: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  potentialImpact?: string;
  routeTo?: string;
}

interface FinancialBrief {
  summary: string;
  recommendedActions: RecommendedAction[];
}

interface AICFOCommandCardProps {
  onAction?: (actionType: string) => void;
}

const BADGE_BY_PRIORITY: Record<RecommendedAction["priority"], { className: string; Icon: typeof ShieldAlert }> = {
  HIGH: { className: styles.redBadge, Icon: ShieldAlert },
  MEDIUM: { className: styles.amberBadge, Icon: AlertCircle },
  LOW: { className: styles.emeraldBadge, Icon: TrendingUp },
};

export function AICFOCommandCard({ onAction }: AICFOCommandCardProps) {
  const [brief, setBrief] = useState<FinancialBrief | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ai/brief")
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.success) setBrief(json.data);
      })
      .catch((error) => console.error("Failed to load AI CFO brief:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const actions = brief?.recommendedActions.slice(0, 3) || [];

  return (
    <div className={styles.card}>
      {/* Background Orbital Rings Graphic */}
      <div className={styles.orbitalAura}>
        <div className={styles.ring1} />
        <div className={styles.ring2} />
        <div className={styles.ring3} />
        <div className={styles.glowingCore} />
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>AI CFO</h3>
            <span className={styles.monitoringBadge}>
              <span className={styles.greenDot} />
              Monitoring
            </span>
          </div>
          <p className={styles.attentionCount}>
            {loading
              ? "Analyzing live financial data..."
              : actions.length > 0
              ? `${actions.length} thing${actions.length === 1 ? "" : "s"} need${actions.length === 1 ? "s" : ""} your attention.`
              : "No urgent items right now."}
          </p>
        </div>
      </div>

      {/* Priority Alerts List */}
      <div className={styles.alertList}>
        {actions.map((item) => {
          const { className, Icon } = BADGE_BY_PRIORITY[item.priority];
          return (
            <div className={styles.alertItem} key={item.id}>
              <div className={`${styles.iconBadge} ${className}`}>
                <Icon size={14} />
              </div>
              <div className={styles.alertContent}>
                <div className={styles.alertTitle}>{item.action}</div>
                {item.potentialImpact && <div className={styles.alertSubtext}>{item.potentialImpact}</div>}
                {item.routeTo && (
                  <Link
                    href={item.routeTo}
                    className={styles.actionLink}
                    onClick={() => onAction && onAction(item.id)}
                  >
                    <span>View</span>
                    <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Motto */}
      <div className={styles.footer}>
        <span className={styles.footerMotto}>&ldquo;Proactive insights. Real impact.&rdquo;</span>
        <Sparkles size={13} className={styles.footerSparkle} />
      </div>
    </div>
  );
}
