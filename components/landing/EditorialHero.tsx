import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import styles from "./EditorialHero.module.css";

export function EditorialHero() {
  return (
    <section className={styles.heroRoot} aria-label="Hero — The Financial Operating System">
      {/* 1. Architectural Villa Terrace & Misty Mountain Background */}
      <div className={styles.atmosphereBackdrop}>
        <Image
          src="/apple_hero_bg.jpg"
          alt="Modern architectural pavilion terrace overlooking misty mountains and calm lake"
          fill
          priority
          className={styles.atmosphereImage}
        />
        <div className={styles.atmosphereOverlay} />
      </div>

      <div className={styles.heroContainer}>
        {/* ================= 3. HEADLINE & INTRO ================= */}
        <div className={styles.headerBlock}>
          <h1 className={styles.headline}>
            THE FINANCIAL EXCEPTIONS,
            <br />
            <span className={styles.headlineAccent}>HANDLED.</span>
          </h1>

          <p className={styles.supportingCopy}>
            FINOVA investigates unmatched transactions, proposes the right resolution,
            and keeps every financial decision under human control.
          </p>
        </div>

        {/* ================= 4. REAL FINOVA WORKBENCH TOUR ================= */}
        <div className={styles.workspaceWrapper}>
          <Link
            href="/overview"
            className={styles.videoFrame}
            aria-label="Open the interactive FINOVA Controller Workbench"
          >
            <video
              className={styles.workbenchVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/finova-workbench-poster.png"
              aria-hidden="true"
            >
              <source src="/finova-workbench-tour.mp4" type="video/mp4" />
            </video>
          </Link>

          <div className={styles.floorReflection} aria-hidden="true" />
        </div>

        {/* ================= 5. CTAS ANCHORED BELOW WORKSPACE ================= */}
        <div className={styles.ctaRow}>
          <Link href="/overview" className={styles.primaryCta}>
            <span>Get early access</span>
            <ArrowRight size={13} strokeWidth={2.4} />
          </Link>

          <a href="#what-finova-does" className={styles.secondaryCta}>
            <div className={styles.playIconCircle}>
              <Play size={11} fill="currentColor" strokeWidth={1} />
            </div>
            <span>See how it works</span>
          </a>
        </div>
      </div>
    </section>
  );
}
