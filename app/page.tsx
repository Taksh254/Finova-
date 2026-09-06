import React from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { RetentionStatsBar } from "@/components/landing/RetentionStatsBar";
import { SmePainVsFinovaSection } from "@/components/landing/SmePainVsFinovaSection";
import { PillarsSection } from "@/components/landing/PillarsSection";
import { RoiCalculator } from "@/components/landing/RoiCalculator";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { LandingFooter } from "@/components/landing/LandingFooter";
import styles from "./page.module.css";

export default function LandingPage() {
  return (
    <div className={styles.landingMain}>
      <LandingNavbar />
      <main>
        <HeroSection />
        <RetentionStatsBar />
        <SmePainVsFinovaSection />
        <PillarsSection />
        <RoiCalculator />
        <TestimonialsSection />
        <CtaBanner />
      </main>
      <LandingFooter />
    </div>
  );
}
