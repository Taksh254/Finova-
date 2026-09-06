import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Lock, Zap } from "lucide-react";
import styles from "./CtaBanner.module.css";

export function CtaBanner() {
  return (
    <section className={styles.ctaWrapper}>
      <div className={styles.container}>
        <div className={styles.bannerCard}>
          <div className={styles.glowDecor} aria-hidden="true" />

          <div className={styles.bannerBadge}>
            <Zap size={14} />
            <span>Stop The Leakage Today</span>
          </div>

          <h2 className={styles.bannerTitle}>
            Ready to Protect Your Margins and Eliminate Cash Flow Blindspots?
          </h2>

          <p className={styles.bannerSubtitle}>
            Join 620+ high-retention small business founders who sleep soundly knowing every single rupee is accounted for down to the transaction ID.
          </p>

          <div className={styles.buttonGroup}>
            <Link href="/payout-truth" className={styles.primaryBtn}>
              <span>Launch Free Live Sandbox</span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/overview" className={styles.secondaryBtn}>
              <span>Explore Dashboard</span>
            </Link>
          </div>

          <div className={styles.securityNote}>
            <span>🔒 Bank-grade 256-bit encryption</span>
            <span>•</span>
            <span>🏛️ RBI compliant read-only bank feeds</span>
            <span>•</span>
            <span>⚡ Setup takes under 4 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
