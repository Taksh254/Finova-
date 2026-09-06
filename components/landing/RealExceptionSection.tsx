"use client";

import React from "react";
import Link from "next/link";
import {
  Landmark,
  Shield,
  Check,
  ArrowRight,
} from "lucide-react";
import styles from "./RealExceptionSection.module.css";

export function RealExceptionSection() {
  return (
    <section id="a-real-example" className={styles.realExampleSection} aria-label="A Real Example">
      <div className={styles.sectionContainer}>
        {/* ================= LEFT COLUMN ================= */}
        <div className={styles.leftCol}>
          <span className={styles.eyebrow}>A REAL EXAMPLE</span>
          <h2 className={styles.headline}>
            One exception.
            <br />
            A safer future.
          </h2>
          <Link href="/overview" className={styles.exploreBtn}>
            <span>Explore the workflow</span>
            <ArrowRight size={13} strokeWidth={2.4} />
          </Link>
        </div>

        {/* ================= RIGHT: 2 FLOATING GLASS CARDS ================= */}
        <div className={styles.cardsWrapper}>
          {/* Card 1: Exception Resolution */}
          <div className={styles.exceptionCard}>
            <div className={styles.cardHeaderTop}>
              <div className={styles.vendorHeaderLeft}>
                <div className={styles.vendorIconCircle}>
                  <Landmark size={16} strokeWidth={1.8} />
                </div>
                <div className={styles.vendorInfo}>
                  <span className={styles.vendorTitle}>CLOUDFLARE*PRO</span>
                  <div className={styles.vendorAmountRow}>
                    <span className={styles.vendorAmount}>₹1,00,000</span>
                    <span className={styles.vendorDate}>12 Sep 2026</span>
                  </div>
                </div>
              </div>
              <span className={styles.unmatchedPill}>Unmatched</span>
            </div>

            <div className={styles.checklist}>
              {/* Checklist item 1 */}
              <div className={styles.checkItem}>
                <div className={styles.checkIconCircle}>
                  <Check size={11} strokeWidth={2.6} />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Invoice found</div>
                  <div className={styles.checkSubText}>INV-CF-0926</div>
                </div>
              </div>

              {/* Checklist item 2: Proposed Entry */}
              <div className={styles.checkItem}>
                <div className={styles.checkIconCircle}>
                  <Check size={11} strokeWidth={2.6} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>Proposed entry</div>
                  <div className={styles.journalEntryBox}>
                    <div className={styles.journalDr}>
                      <span>Dr 6110 Software Expense</span>
                      <span>₹1,00,000</span>
                    </div>
                    <div className={styles.journalCr}>
                      <span>Cr 1001 Bank</span>
                      <span>₹1,00,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist item 3: Safety Checks */}
              <div className={styles.checkItem}>
                <div className={styles.checkIconCircle}>
                  <Check size={11} strokeWidth={2.6} />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Safety checks</div>
                  <div className={styles.checkSubText}>5 of 5 passed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Curved Connector Arrow */}
          <div className={styles.curvedArrowContainer} aria-hidden="true">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              stroke="#6b7280"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 6 34 C 14 10, 34 10, 42 24" />
              <path d="M 35 22 L 42 24 L 41 16" />
            </svg>
          </div>

          {/* Card 2: Bounded Policy for Future Transactions */}
          <div className={styles.policyCard}>
            <div className={styles.policyHeaderTop}>
              <div className={styles.policyTitleTag}>
                <Shield size={14} strokeWidth={2} />
                <span>Policy for future transactions</span>
              </div>
              <span className={styles.proposedBadge}>PROPOSED</span>
            </div>

            <div className={styles.policyHeadline}>
              Cloudflare payments below ₹1,50,000
            </div>

            <div className={styles.attributesGrid}>
              <div className={styles.attrItem}>
                <span className={styles.attrLabel}>Company</span>
                <span className={styles.attrValue}>US entity</span>
              </div>
              <div className={styles.attrItem}>
                <span className={styles.attrLabel}>Currency</span>
                <span className={styles.attrValue}>USD</span>
              </div>
              <div className={styles.attrItem}>
                <span className={styles.attrLabel}>Invoice</span>
                <span className={styles.attrValue}>Required</span>
              </div>
              <div className={styles.attrItem}>
                <span className={styles.attrLabel}>Account</span>
                <span className={styles.attrValue}>Software Expense &mdash; 6110</span>
              </div>
              <div className={styles.attrItem}>
                <span className={styles.attrLabel}>Bank</span>
                <span className={styles.attrValue}>1001</span>
              </div>
            </div>

            <Link href="/overview" className={styles.policyActionBtn}>
              <span>View policy &amp; backtest</span>
              <ArrowRight size={13} strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
