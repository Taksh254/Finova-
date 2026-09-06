import React from "react";
import { X, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import styles from "./SmePainVsFinovaSection.module.css";

const oldWayPoints = [
  {
    title: "Black-Box Gateway Settlements",
    desc: "Razorpay or Stripe dumps a bulk deposit into your bank. You have no clue if fees, disputed reserves, or currency conversions were overcharged.",
  },
  {
    title: "Payroll & Rent Cash Surprises",
    desc: "Founders only discover cash shortfalls 3 days before month-end because legacy tools look backward instead of projecting 18 days forward.",
  },
  {
    title: "14+ Hours Lost in CSV Hell",
    desc: "Manual VLOOKUPs between bank passbooks, gateway reports, and Tally ledgers. One typo breaks month-end reconciliation.",
  },
  {
    title: "Lost GST Input Tax Credit (ITC)",
    desc: "Small businesses routinely fail to claim 18% GST paid on gateway fees due to missing tax invoices, bleeding tens of thousands annually.",
  },
];

const finovaPoints = [
  {
    title: "Autonomous Payout Truth",
    desc: "FINOVA reconstructs every settlement rupee by rupee against transaction IDs. Caught discrepancies are flagged with auto-generated dispute claims.",
  },
  {
    title: "18-Day Runway Radar",
    desc: "Predictive cash flow modeling forecasts your exact bank cushion before vendor bills and payroll land. Sleep with total peace of mind.",
  },
  {
    title: "2-Second Automated Ledger Sync",
    desc: "Balanced double-entry journal vouchers are auto-generated with verified UTRs, fee splits, and GST breakdowns ready for Tally or Zoho.",
  },
  {
    title: "100% Recaptured Tax Credits",
    desc: "FINOVA auto-collates and matches gateway GSTR-2B credit invoices, ensuring every rupee of eligible GST input credit is claimed.",
  },
];

export function SmePainVsFinovaSection() {
  return (
    <section className={styles.sectionWrapper} id="retention-pillars">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>The Retention Secret</span>
          <h2 className={styles.sectionTitle}>
            Why Small Businesses Bleed Cash on Old Accounting—and Why They Never Leave FINOVA
          </h2>
          <p className={styles.sectionSubtitle}>
            Traditional software forces founders to be manual data entry clerks.
            FINOVA functions as an autonomous CFO that catches revenue leaks before they hurt your business.
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {/* The Old Way */}
          <div className={`${styles.comparisonCard} ${styles.cardOld}`}>
            <div className={styles.cardOldHeader}>
              <span className={styles.badgeOld}>Legacy Status Quo</span>
              <h3 className={styles.cardTitle}>Tally, Spreadsheets & Blind Faith</h3>
            </div>

            <ul className={styles.pointsList}>
              {oldWayPoints.map((pt, i) => (
                <li key={i} className={styles.pointItem}>
                  <div className={styles.iconWrapRed}>
                    <X size={14} strokeWidth={2.5} />
                  </div>
                  <div className={styles.pointContent}>
                    <h4 className={styles.pointHeading}>{pt.title}</h4>
                    <p className={styles.pointText}>{pt.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.finovaOutcomePill} style={{ background: "#FEF2F2", borderColor: "#FECACA" }}>
              <span className={styles.outcomeText}>Average Annual Margin Bleed</span>
              <span className={styles.outcomeValue} style={{ color: "#DC2626" }}>
                2.4% – 3.8% of GMV
              </span>
            </div>
          </div>

          {/* The FINOVA Way */}
          <div className={`${styles.comparisonCard} ${styles.cardFinova}`}>
            <div className={styles.cardFinovaHeader}>
              <span className={styles.badgeFinova}>The FINOVA Engine</span>
              <h3 className={styles.cardTitle}>Autonomous FinOps with Mathematical Proof</h3>
            </div>

            <ul className={styles.pointsList}>
              {finovaPoints.map((pt, i) => (
                <li key={i} className={styles.pointItem}>
                  <div className={styles.iconWrapGreen}>
                    <Check size={14} strokeWidth={2.5} />
                  </div>
                  <div className={styles.pointContent}>
                    <h4 className={styles.pointHeading}>{pt.title}</h4>
                    <p className={styles.pointText}>{pt.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.finovaOutcomePill}>
              <span className={styles.outcomeText}>Net 12-Month SME Retention</span>
              <span className={styles.outcomeValue}>
                98.4% (Founders Never Cancel)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
