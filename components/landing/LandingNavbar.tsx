"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./LandingNavbar.module.css";

export function LandingNavbar() {
  return (
    <header className={styles.headerWrapper}>
      <nav className={styles.navContainer} aria-label="Main Navigation">
        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link href="/" className={styles.brandArea}>
            <div className={styles.logoMark} aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 4C3 3.44772 3.44772 3 4 3H19C19.5523 3 20 3.44772 20 4C20 4.55228 19.5523 5 19 5H5V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H5V20C5 20.5523 4.55228 21 4 21C3.44772 21 3 20.5523 3 20V4Z"
                  fill="#FFFFFF"
                />
                <path
                  d="M10 8L20 8C20.5523 8 21 8.44772 21 9C21 9.55228 20.5523 10 20 10L10 10V8Z"
                  fill="#93C5FD"
                />
              </svg>
            </div>
            <div className={styles.brandMeta}>
              <span className={styles.brandName}>FINOVA</span>
              <span className={styles.brandTagline}>Clarity compounds.</span>
            </div>
          </Link>

          <div className={styles.liveBadge}>
            <span className={styles.pulseDot} />
            Autonomous FinOps v2.4
          </div>
        </div>

        {/* Navigation Links */}
        <ul className={styles.navLinks}>
          <li>
            <Link href="/payout-truth" className={styles.navLink}>
              Payout Truth
              <span className={styles.flagshipPill}>Flagship</span>
            </Link>
          </li>
          <li>
            <a href="#cash-radar" className={styles.navLink}>
              Cash Radar
            </a>
          </li>
          <li>
            <a href="#retention-pillars" className={styles.navLink}>
              Why Small Businesses Retain
            </a>
          </li>
          <li>
            <a href="#roi-calculator" className={styles.navLink}>
              Leakage Calculator
            </a>
          </li>
          <li>
            <a href="#case-studies" className={styles.navLink}>
              Outcomes
            </a>
          </li>
        </ul>

        {/* Right Action CTAs */}
        <div className={styles.actionsArea}>
          <Link href="/overview" className={styles.secondaryBtn}>
            Enter App
          </Link>
          <Link href="/payout-truth" className={styles.primaryCta}>
            <span>Live Sandbox</span>
            <ArrowUpRight size={16} strokeWidth={2} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
