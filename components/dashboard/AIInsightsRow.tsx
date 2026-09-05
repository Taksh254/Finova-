"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, AlertTriangle, Percent, ChevronRight } from "lucide-react";
import styles from "./AIInsightsRow.module.css";

interface AIInsightsRowProps {
  onSelectInsight?: (id: string) => void;
}

export function AIInsightsRow({ onSelectInsight }: AIInsightsRowProps) {
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
        {/* Card 1 */}
        <div className={styles.insightCard}>
          <div className={styles.cardTop}>
            <div className={styles.iconBadge}>
              <TrendingUp size={16} />
            </div>
            <div className={styles.cardHeaderInfo}>
              <h4 className={styles.cardTitle}>Revenue is accelerating</h4>
              <span className={styles.confidenceBadge}>92% confidence</span>
            </div>
          </div>
          <p className={styles.cardText}>
            Your revenue has grown 24% over the last 3 months, driven by 3 enterprise clients.
          </p>
          <button
            className={styles.cardLink}
            onClick={() => onSelectInsight && onSelectInsight("revenue-accelerating")}
          >
            <span>See details</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Card 2 */}
        <div className={styles.insightCard}>
          <div className={styles.cardTop}>
            <div className={styles.iconBadge}>
              <AlertTriangle size={16} />
            </div>
            <div className={styles.cardHeaderInfo}>
              <h4 className={styles.cardTitle}>3 vendors have increased pricing</h4>
              <span className={styles.confidenceBadge}>87% confidence</span>
            </div>
          </div>
          <p className={styles.cardText}>
            AWS, Notion and Figma have increased their pricing in the last 60 days.
          </p>
          <button
            className={styles.cardLink}
            onClick={() => onSelectInsight && onSelectInsight("vendor-pricing")}
          >
            <span>Review vendors</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Card 3 */}
        <div className={styles.insightCard}>
          <div className={styles.cardTop}>
            <div className={styles.iconBadge}>
              <Percent size={16} />
            </div>
            <div className={styles.cardHeaderInfo}>
              <h4 className={styles.cardTitle}>Reduce monthly software spend by ₹28,000</h4>
              <span className={styles.confidenceBadge}>78% confidence</span>
            </div>
          </div>
          <p className={styles.cardText}>
            You have 4 underutilized subscriptions that can be downgraded or cancelled.
          </p>
          <button
            className={styles.cardLink}
            onClick={() => onSelectInsight && onSelectInsight("software-spend")}
          >
            <span>View recommendations</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Card 4: Finova Brand Banner */}
        <div className={styles.brandBannerCard}>
          <div className={styles.bannerTop}>
            <span className={styles.bannerBrand}>FINOVA</span>
          </div>
          <h4 className={styles.bannerHeading}>
            Your entire financial operation, understood by AI.
          </h4>
          <div className={styles.bannerFooter}>
            <span className={styles.bannerPillars}>
              OBSERVE &bull; UNDERSTAND &bull; DECIDE &bull; GROW
            </span>
            <Link href="/ai-agents" className={styles.bannerArrowBtn}>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
