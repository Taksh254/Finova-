import React from "react";
import Link from "next/link";
import styles from "./LandingFooter.module.css";

export function LandingFooter() {
  return (
    <footer className={styles.footerWrapper} aria-label="Site Footer">
      <div className={styles.container}>
        <div className={styles.topGrid}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <div className={styles.brandLogoArea}>
              <div className={styles.logoMark} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
              <span className={styles.brandName}>FINOVA</span>
            </div>

            <p className={styles.brandBio}>
              The autonomous financial operating system purpose-built for small businesses, D2C merchants, and growing agencies.
            </p>
          </div>

          {/* Column 1: Core Platform */}
          <div>
            <h4 className={styles.colTitle}>Flagship Platform</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/payout-truth" className={styles.footerLink}>
                  Payout Truth Engine
                </Link>
              </li>
              <li>
                <Link href="/cash-flow" className={styles.footerLink}>
                  18-Day Cash Radar
                </Link>
              </li>
              <li>
                <Link href="/invoices" className={styles.footerLink}>
                  Smart Collections
                </Link>
              </li>
              <li>
                <Link href="/overview" className={styles.footerLink}>
                  Executive Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Supported Integrations */}
          <div>
            <h4 className={styles.colTitle}>Ecosystem</h4>
            <ul className={styles.linkList}>
              <li>
                <span className={styles.footerLink}>Razorpay Settlement API</span>
              </li>
              <li>
                <span className={styles.footerLink}>Stripe Connect & Payouts</span>
              </li>
              <li>
                <span className={styles.footerLink}>Cashfree AutoCollect</span>
              </li>
              <li>
                <span className={styles.footerLink}>Tally Prime XML Sync</span>
              </li>
              <li>
                <span className={styles.footerLink}>Zoho Books Integration</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Compliance */}
          <div>
            <h4 className={styles.colTitle}>Trust & Security</h4>
            <ul className={styles.linkList}>
              <li>
                <span className={styles.footerLink}>256-Bit SSL Encryption</span>
              </li>
              <li>
                <span className={styles.footerLink}>RBI Read-Only Direct Feeds</span>
              </li>
              <li>
                <span className={styles.footerLink}>SOC-2 Type II Certified</span>
              </li>
              <li>
                <span className={styles.footerLink}>GDPR & DPDP Act Compliant</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className={styles.bottomRow}>
          <div>
            © {new Date().getFullYear()} FINOVA FinOps Systems Inc. All rights reserved.
          </div>
          <div>
            Built with deterministic math • Clarity compounds.
          </div>
        </div>
      </div>
    </footer>
  );
}
