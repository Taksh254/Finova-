"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LiquidGlassNavigation } from "./LiquidGlassNavigation";
import styles from "./EditorialNavbar.module.css";

export function EditorialNavbar() {
  return (
    <header className={styles.navWrapper}>
      {/* 1. Brand Logo on Left */}
      <Link href="/" className={styles.brandArea} aria-label="FINOVA Home">
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.hexagonIcon}
        >
          <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" />
        </svg>
        <span className={styles.brandText}>FINOVA</span>
      </Link>

      {/* 2. Interactive Apple-Inspired Liquid Glass Navigation */}
      <LiquidGlassNavigation />

      {/* 3. Primary Glass Pill Action on Right */}
      <Link href="/overview" className={styles.earlyAccessBtn}>
        <span>Get early access</span>
        <ArrowRight size={13} strokeWidth={2.4} />
      </Link>
    </header>
  );
}
