import React from "react";
import { EditorialNavbar } from "@/components/landing/EditorialNavbar";
import { EditorialHero } from "@/components/landing/EditorialHero";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { GovernanceSection } from "@/components/landing/GovernanceSection";
import { RealExceptionSection } from "@/components/landing/RealExceptionSection";
import { PolicyReplaySection } from "@/components/landing/PolicyReplaySection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { EditorialFooter } from "@/components/landing/EditorialFooter";

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: "var(--bg-editorial-ivory)", minHeight: "100vh", position: "relative" }}>
      {/* 1. FLOATING APPLE LIQUID GLASS NAVBAR */}
      <EditorialNavbar />

      <main>
        {/* 01 — HERO & HERO PRODUCT INTERFACE */}
        <EditorialHero />

        {/* 02 — WHAT FINOVA DOES (5 CONNECTED GLASS STAGES) */}
        <WorkflowSection />

        {/* 03 — FINOVA CONTROL LOOP (DARK FOREST-GREEN ENVIRONMENT + WORKFLOW PILLS) */}
        <GovernanceSection />

        {/* 04 — REAL EXAMPLE (UNMATCHED EXCEPTION + BOUNDED POLICY CARDS) */}
        <RealExceptionSection />

        {/* 05 — SAFE AUTOMATION / POLICY REPLAY */}
        <PolicyReplaySection />

        {/* 06 — FINAL CTA (CINEMATIC TERRACE & LAKE PANORAMA) */}
        <FinalCtaSection />
      </main>

      {/* 07 — FOOTER (MINIMALIST 1-ROW EDITORIAL FOOTER) */}
      <EditorialFooter />
    </div>
  );
}
