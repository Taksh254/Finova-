import React from "react";
import styles from "./RetentionStatsBar.module.css";

const stats = [
  {
    number: "98.4%",
    highlight: true,
    label: "Small Business Retention",
    desc: "Founders stay because FINOVA delivers clear ROI within 7 days.",
  },
  {
    number: "₹4.8 Cr+",
    highlight: false,
    label: "Leaked Margins Recovered",
    desc: "Opaque gateway deductions and duplicate fees returned to clients.",
  },
  {
    number: "18 Days",
    highlight: true,
    label: "Forward Runway Foresight",
    desc: "Zero payroll surprises with predictive cash flow simulations.",
  },
  {
    number: "38%",
    highlight: false,
    label: "Faster Cash Collection",
    desc: "Autonomous courteous follow-ups reduce days sales outstanding.",
  },
];

export function RetentionStatsBar() {
  return (
    <section className={styles.barWrapper} aria-label="Key Performance Outcomes">
      <div className={styles.barContent}>
        {stats.map((stat, idx) => (
          <div key={idx} className={styles.statItem}>
            <div
              className={`${styles.statNumber} tabular-nums ${
                stat.highlight ? styles.statNumberHighlight : ""
              }`}
            >
              {stat.number}
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={styles.statDescription}>{stat.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
