"use client";

import React from "react";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import styles from "./LandingNavbar.module.css";

export function LandingNavbar() {
  return (
    <header className={styles.headerWrapper}>
      <nav className={styles.navContainer} aria-label="Main Navigation">
        {/* Brand Header */}
        <Link href="/" className={styles.brandArea}>
          <div className={styles.logoIcon} aria-hidden="true">
            <span className={`${styles.logoBar} ${styles.logoBar1}`} />
            <span className={`${styles.logoBar} ${styles.logoBar2}`} />
            <span className={`${styles.logoBar} ${styles.logoBar3}`} />
          </div>
          <div className={styles.brandInfo}>
            <span className={styles.brandName}>FINOVA</span>
            <span className={styles.brandSubline}>
              Finance Operations For What&apos;s Next
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <ul className={styles.navLinks}>
          <li className={styles.navItem}>
            <Link href="/" className={`${styles.navLink} ${styles.navLinkActive}`}>
              Home
            </Link>
            <span className={styles.activeIndicator} aria-hidden="true" />
          </li>
          <li className={styles.navItem}>
            <Link href="/payout-truth" className={styles.navLink}>
              Payout Truth
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/overview" className={styles.navLink}>
              Dashboard
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/invoices" className={styles.navLink}>
              Invoices
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/reports" className={styles.navLink}>
              Reports
            </Link>
          </li>
        </ul>

        {/* Right Actions */}
        <div className={styles.rightActions}>
          <button
            type="button"
            className={styles.searchButton}
            aria-label="Search transactions or payouts"
            suppressHydrationWarning
          >
            <Search size={16} strokeWidth={2} />
          </button>

          <Link href="/overview" className={styles.profileChip}>
            <div className={styles.avatarCircle}>A</div>
            <div className={styles.profileMeta}>
              <span className={styles.orgName}>Arcova Technologies</span>
              <span className={styles.roleLabel}>CFO View</span>
            </div>
            <ChevronDown size={14} className={styles.chevronIcon} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
