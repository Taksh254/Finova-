"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, ArrowRight } from "lucide-react";
import styles from "./FinalCtaSection.module.css";

export function FinalCtaSection() {
  return (
    <section id="early-access" className={styles.ctaSectionRoot} aria-label="Final Call to Action">
      {/* Background Terrace & Lake Landscape */}
      <div className={styles.panoramaBackdrop}>
        <Image
          src="/terrace_cta_bg.jpg"
          alt="Cinematic luxury terrace overlooking calm water and tropical mountain islands"
          fill
          priority
          className={styles.panoramaImage}
        />
        <div className={styles.panoramaOverlay} />
      </div>

      <div className={styles.sectionContainer}>
        {/* Left Column: CTA Content */}
        <div className={styles.ctaLeftCol}>
          <span className={styles.eyebrow}>CLOSE WITH CONFIDENCE</span>

          <h2 className={styles.headline}>
            Turn complex transactions
            <br />
            into clear, accountable decisions.
          </h2>

          <p className={styles.subtitle}>
            Solve it once. Automate it safely.
          </p>

          <div className={styles.ctaButtonsRow}>
            <Link href="/overview" className={styles.primaryBtn}>
              <span>Get early access</span>
              <ArrowRight size={13} strokeWidth={2.4} />
            </Link>

            <a href="#what-finova-does" className={styles.storyBtn} aria-label="Watch the 2 min story">
              <div className={styles.playCircle}>
                <Play size={11} fill="currentColor" strokeWidth={1} />
              </div>
              <span>Watch the 2 min story</span>
            </a>
          </div>
        </div>

        {/* Right Column: Editorial Quote */}
        <div className={styles.rightEditorialQuote}>
          &ldquo;Better financial
          <br />
          operations for a stronger
          <br />
          tomorrow.&rdquo;
        </div>
      </div>
    </section>
  );
}
