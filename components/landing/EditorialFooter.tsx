"use client";

import React from "react";
import Link from "next/link";
import styles from "./EditorialFooter.module.css";

export function EditorialFooter() {
  return (
    <footer className={styles.footerRoot} aria-label="FINOVA Footer">
      <div className={styles.footerContainer}>
        {/* Left: Hexagon Brand Logo */}
        <Link href="/" className={styles.brandLeft} aria-label="FINOVA Home">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--color-forest-deep)" }}
          >
            <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" />
          </svg>
          <span className={styles.brandText}>FINOVA</span>
        </Link>

        {/* Center-left: Copyright */}
        <div className={styles.copyright}>
          &copy; 2026 FINOVA. Built for financial clarity.
        </div>

        {/* Center-right: Links */}
        <ul className={styles.linksGroup}>
          <li>
            <Link href="#what-finova-does" className={styles.linkItem}>
              Privacy
            </Link>
          </li>
          <li>
            <Link href="#control-loop" className={styles.linkItem}>
              Terms
            </Link>
          </li>
          <li>
            <Link href="#early-access" className={styles.linkItem}>
              Contact
            </Link>
          </li>
        </ul>

        {/* Right: Poetic Tagline */}
        <div className={styles.taglineRight}>
          <span>&mdash;</span>
          <span>A more grounded tomorrow.</span>
        </div>
      </div>
    </footer>
  );
}
