"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, AlertTriangle, Percent, ChevronRight, ShieldAlert } from "lucide-react";
import styles from "./AIInsightsRow.module.css";

export interface AIInsightData {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: string;
  confidence: number;
  actionRouteTo?: string | null;
}

interface AIInsightsRowProps {
  insights?: AIInsightData[];
  onSelectInsight?: (id: string) => void;
}

const ICON_BY_TYPE: Record<string, typeof TrendingUp> = {
  REVENUE: TrendingUp,
  CASH: Percent,
  EXPENSE: AlertTriangle,
  RISK: ShieldAlert,
  RECONCILIATION: AlertTriangle,
  GENERAL: TrendingUp,
};

export function AIInsightsRow({ insights = [], onSelectInsight }: AIInsightsRowProps) {
  const topInsights = insights.slice(0, 3);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>AI Insights</h3>
        <Link href="/ai-cfo" className={styles.viewAllLink}>
          <span>View all</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className={styles.cardsGrid}>
        {topInsights.length === 0 && (
          <div className={styles.insightCard}>
            <div className={styles.cardTop}>
              <div className={styles.iconBadge}>
                <TrendingUp size={16} />
              </div>
              <div className={styles.cardHeaderInfo}>
                <h4 className={styles.cardTitle}>No urgent insights right now</h4>
              </div>
            </div>
            <p className={styles.cardText}>
              Run the Agent Orchestrator sync to have Finova&apos;s specialist agents scan your ledger for anomalies and risks.
            </p>
          </div>
        )}

        {topInsights.map((insight) => {
          const Icon = ICON_BY_TYPE[insight.type] || TrendingUp;
          const content = (
            <>
              <div className={styles.cardTop}>
                <div className={styles.iconBadge}>
                  <Icon size={16} />
                </div>
                <div className={styles.cardHeaderInfo}>
                  <h4 className={styles.cardTitle}>{insight.title}</h4>
                  <span className={styles.confidenceBadge}>{Math.round(insight.confidence * 100)}% confidence</span>
                </div>
              </div>
              <p className={styles.cardText}>{insight.description}</p>
            </>
          );

          return (
            <div className={styles.insightCard} key={insight.id}>
              {content}
              {insight.actionRouteTo ? (
                <Link
                  href={insight.actionRouteTo}
                  className={styles.cardLink}
                  onClick={() => onSelectInsight && onSelectInsight(insight.id)}
                >
                  <span>See details</span>
                  <ArrowRight size={12} />
                </Link>
              ) : (
                <button className={styles.cardLink} onClick={() => onSelectInsight && onSelectInsight(insight.id)}>
                  <span>See details</span>
                  <ArrowRight size={12} />
                </button>
              )}
            </div>
          );
        })}

        {/* Brand Banner */}
        <div className={styles.brandBannerCard}>
          <div className={styles.bannerTop}>
            <span className={styles.bannerBrand}>FINOVA</span>
          </div>
          <h4 className={styles.bannerHeading}>Your entire financial operation, understood by AI.</h4>
          <div className={styles.bannerFooter}>
            <span className={styles.bannerPillars}>OBSERVE &bull; UNDERSTAND &bull; DECIDE &bull; GROW</span>
            <Link href="/ai-agents" className={styles.bannerArrowBtn}>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
