"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import styles from "./RoiCalculator.module.css";

export function RoiCalculator() {
  const [gmv, setGmv] = useState<number>(2500000); // 25 Lakhs default
  const [transactions, setTransactions] = useState<number>(850); // 850 orders default

  // Financial Calculations
  const gatewayLeakage = Math.round(gmv * 0.0035); // 0.35% average overcharged fees & unnotified deductions
  const itcRecovery = Math.round(gmv * 0.02 * 0.18); // 18% GST on 2% MDR recovered as Input Tax Credit
  const hoursSaved = transactions > 2000 ? 28 : transactions > 800 ? 18 : 10;
  const timeValue = hoursSaved * 1200; // conservative ₹1,200/hr founder or finance lead time

  const totalMonthlyBenefit = gatewayLeakage + itcRecovery + timeValue;
  const subscriptionCost = 2999;
  const roiMultiplier = (totalMonthlyBenefit / subscriptionCost).toFixed(1);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className={styles.calculatorSection} id="roi-calculator">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tag}>Interactive Margin Calculator</span>
          <h2 className={styles.title}>
            See How Much Silent Cash Bleed FINOVA Recovers for Your Business
          </h2>
          <p className={styles.subtitle}>
            Adjust your monthly gross volume and transactions to estimate real, recoverable rupees and time saved.
          </p>
        </div>

        <div className={styles.calcCard}>
          {/* Controls */}
          <div className={styles.sliderPanel}>
            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <label htmlFor="gmv-range" className={styles.sliderLabel}>
                  Monthly Online Volume / GMV
                </label>
                <span className={`${styles.sliderValueDisplay} tabular-nums`}>
                  {formatCurrency(gmv)}
                </span>
              </div>
              <input
                id="gmv-range"
                type="range"
                min={200000}
                max={10000000}
                step={100000}
                value={gmv}
                onChange={(e) => setGmv(Number(e.target.value))}
                className={styles.rangeInput}
              />
              <div className={styles.rangeLabels}>
                <span>₹2 Lakhs</span>
                <span>₹50 Lakhs</span>
                <span>₹1 Crore</span>
              </div>
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <label htmlFor="tx-range" className={styles.sliderLabel}>
                  Monthly Gateway Transactions
                </label>
                <span className={`${styles.sliderValueDisplay} tabular-nums`}>
                  {transactions.toLocaleString("en-IN")} orders
                </span>
              </div>
              <input
                id="tx-range"
                type="range"
                min={100}
                max={5000}
                step={50}
                value={transactions}
                onChange={(e) => setTransactions(Number(e.target.value))}
                className={styles.rangeInput}
              />
              <div className={styles.rangeLabels}>
                <span>100 orders</span>
                <span>2,500 orders</span>
                <span>5,000 orders</span>
              </div>
            </div>

            <div className={styles.trustNote}>
              Based on empirical audit data from 620+ Indian small businesses across Razorpay, Stripe, and Cashfree merchant accounts.
            </div>
          </div>

          {/* Results Display */}
          <div className={styles.resultPanel}>
            <div>
              <div className={styles.resultTitle}>Projected Monthly Value Unlocked</div>
              <div className={`${styles.highlightAmount} tabular-nums`}>
                {formatCurrency(totalMonthlyBenefit)}
              </div>
              <div className={styles.highlightSubtext}>
                Added directly back to your company bank balance every month
              </div>

              <div className={styles.breakdownList}>
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Hidden Fee Leakage Recovered</span>
                  <span className={`${styles.breakdownVal} tabular-nums`}>
                    +{formatCurrency(gatewayLeakage)}/mo
                  </span>
                </div>
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>18% GST Input Credit Claimed</span>
                  <span className={`${styles.breakdownVal} tabular-nums`}>
                    +{formatCurrency(itcRecovery)}/mo
                  </span>
                </div>
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Manual Reconciliation Time Saved</span>
                  <span className={`${styles.breakdownVal} tabular-nums`}>
                    {hoursSaved} hrs/mo ({formatCurrency(timeValue)})
                  </span>
                </div>
              </div>

              <div className={styles.roiMultiplierBadge}>
                <Sparkles size={14} />
                <span>Estimated {roiMultiplier}x ROI on FINOVA</span>
              </div>
            </div>

            <Link href="/payout-truth" className={styles.calcCtaBtn}>
              <span>Plug Your Leaks in Sandbox</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
