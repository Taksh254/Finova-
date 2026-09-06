"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Play,
  Check,
  Ban,
  Search,
  MoreHorizontal,
  FileText,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  History,
  Lock,
  FileCheck,
} from "lucide-react";
import styles from "./EditorialHero.module.css";

type TabMode = "reconciliation" | "investigation" | "audit";

export function EditorialHero() {
  const [activeTab, setActiveTab] = useState<TabMode>("reconciliation");

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

      {/* 2. Side Editorial Phrase (as in reference image) */}
      <aside className={styles.sideEditorial} aria-hidden="true">
        <div className={styles.sideEditorialLine} />
        <div className={styles.sideEditorialText}>
          <span>BUILT</span>
          <span>FOR</span>
          <span>CONTROLLERS</span>
          <div className={styles.sideEditorialSpacer} />
          <span>DESIGNED</span>
          <span>FOR WHAT</span>
          <span>MATTERS</span>
        </div>
      </aside>

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

        {/* ================= 4. FLOATING FINOVA LIQUID GLASS WORKSPACE ================= */}
        <div className={styles.workspaceWrapper}>
          <div className={styles.spatialGlassChassis}>
            {/* Specular Beveled Glass Edge Ring */}
            <div className={styles.glassRimHighlight} />

            {/* Top Liquid Glass Window Header Bar */}
            <div className={styles.windowHeaderBar}>
              {/* macOS Traffic Dots + FINOVA OS */}
              <div className={styles.windowControls}>
                <div className={styles.dotsGroup}>
                  <span className={`${styles.controlDot} ${styles.dotClose}`} />
                  <span className={`${styles.controlDot} ${styles.dotMin}`} />
                  <span className={`${styles.controlDot} ${styles.dotMax}`} />
                </div>
                <div className={styles.brandTitle}>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" />
                  </svg>
                  <span>FINOVA OS</span>
                </div>
              </div>

              {/* Centered Segmented Mode Switcher */}
              <div className={styles.glassSegmentSwitcher} role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "reconciliation"}
                  onClick={() => setActiveTab("reconciliation")}
                  className={`${styles.segmentTab} ${activeTab === "reconciliation" ? styles.segmentActive : ""}`}
                >
                  Reconciliation
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "investigation"}
                  onClick={() => setActiveTab("investigation")}
                  className={`${styles.segmentTab} ${activeTab === "investigation" ? styles.segmentActive : ""}`}
                >
                  Investigation
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "audit"}
                  onClick={() => setActiveTab("audit")}
                  className={`${styles.segmentTab} ${activeTab === "audit" ? styles.segmentActive : ""}`}
                >
                  Audit Trail
                </button>
              </div>

              {/* Right Action Icons: Search & More */}
              <div className={styles.windowActions}>
                <button type="button" className={styles.glassIconBtn} aria-label="Search records">
                  <Search size={13} strokeWidth={2.2} />
                </button>
                <button type="button" className={styles.glassIconBtn} aria-label="More options">
                  <MoreHorizontal size={14} strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {/* Split Two-Pane Spatial Architecture */}
            <div className={styles.windowBody}>
              {/* ================= RECONCILIATION TAB CONTENT (DEFAULT) ================= */}
              {activeTab === "reconciliation" && (
                <>
                  {/* Left Pane: Bank Transactions Feed */}
                  <div className={styles.ledgerPane}>
                    <div className={styles.paneHeader}>
                      <span className={styles.paneLabel}>BANK TRANSACTIONS FEED</span>
                    </div>

                    <div className={styles.transactionList}>
                      {/* Row 1 */}
                      <div className={styles.txRow}>
                        <div className={styles.txLeft}>
                          <FileText size={14} className={styles.txFileIcon} />
                          <div className={styles.skeletonBar} style={{ width: "90px" }} />
                        </div>
                        <div className={styles.txRight}>
                          <div className={styles.badgeMatchedSkeleton} />
                        </div>
                      </div>

                      {/* Row 2: Selected Exception (Warm Glowing Rose Glass) */}
                      <div className={`${styles.txRow} ${styles.txRowActiveException}`}>
                        <div className={styles.txLeft}>
                          <FileText size={14} className={styles.txFileIconActive} />
                          <div className={styles.skeletonBarActive} style={{ width: "120px" }} />
                        </div>
                        <div className={styles.txRight}>
                          <div className={styles.badgeExceptionSkeleton} />
                        </div>
                      </div>

                      {/* Row 3 */}
                      <div className={styles.txRow}>
                        <div className={styles.txLeft}>
                          <FileText size={14} className={styles.txFileIcon} />
                          <div className={styles.skeletonBar} style={{ width: "105px" }} />
                        </div>
                        <div className={styles.txRight}>
                          <div className={styles.badgeMatchedSkeleton} />
                        </div>
                      </div>

                      {/* Row 4 */}
                      <div className={styles.txRow}>
                        <div className={styles.txLeft}>
                          <FileText size={14} className={styles.txFileIcon} />
                          <div className={styles.skeletonBar} style={{ width: "115px" }} />
                        </div>
                        <div className={styles.txRight}>
                          <div className={styles.badgeMatchedSkeleton} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Pane: Autonomous Resolution Spatial Panel */}
                  <div className={styles.inspectorGlassPane}>
                    <div className={styles.inspectorHeader}>
                      <div className={styles.inspectorTitleBlock}>
                        <Sparkles size={14} className={styles.sparkleIcon} />
                        <span className={styles.inspectorTitle}>Autonomous Resolution</span>
                      </div>
                      <div className={styles.safetyShieldPill}>
                        <ShieldCheck size={12} className={styles.shieldIcon} />
                        <div className={styles.safetyBar} />
                      </div>
                    </div>

                    <div className={styles.subtleHeaderBar} />

                    {/* Verified Evidence Rows */}
                    <div className={styles.evidenceSection}>
                      <div className={styles.evidenceItem}>
                        <Check size={12} className={styles.checkIcon} strokeWidth={2.6} />
                        <div className={styles.evidenceBar} style={{ width: "82%" }} />
                      </div>
                      <div className={styles.evidenceItem}>
                        <Check size={12} className={styles.checkIcon} strokeWidth={2.6} />
                        <div className={styles.evidenceBar} style={{ width: "68%" }} />
                      </div>
                    </div>

                    <div className={styles.subtleHeaderBar} />

                    {/* Proposed Balanced Journal Entry Box */}
                    <div className={styles.journalEntryBox}>
                      <div className={styles.journalLineDr}>
                        <div className={styles.drBar} style={{ width: "65%" }} />
                      </div>
                      <div className={styles.journalLineCr}>
                        <div className={styles.crBar} style={{ width: "50%" }} />
                      </div>
                    </div>

                    {/* Approve & Record Entry Tactile Glass Button */}
                    <button type="button" className={styles.approveGlassBtn}>
                      <span>Approve &amp; Record Entry</span>
                      <ChevronRight size={13} strokeWidth={2.4} />
                    </button>
                  </div>
                </>
              )}

              {/* ================= INVESTIGATION TAB CONTENT ================= */}
              {activeTab === "investigation" && (
                <>
                  <div className={styles.ledgerPane}>
                    <div className={styles.paneHeader}>
                      <span className={styles.paneLabel}>EVIDENCE DOSSIER &middot; CLOUDFLARE</span>
                    </div>
                    <div className={styles.investigationDetailsList}>
                      <div className={styles.investigationItem}>
                        <FileCheck size={14} className={styles.checkIcon} />
                        <div>
                          <div className={styles.investigationItemTitle}>OCR Invoice INV-CF-0926</div>
                          <div className={styles.investigationItemDesc}>Matched billing address, tax ID &amp; gross amount</div>
                        </div>
                      </div>
                      <div className={styles.investigationItem}>
                        <History size={14} className={styles.checkIcon} />
                        <div>
                          <div className={styles.investigationItemTitle}>Recurring Vendor Frequency</div>
                          <div className={styles.investigationItemDesc}>Monthly recurring on 30th since Jan 2025</div>
                        </div>
                      </div>
                      <div className={styles.investigationItem}>
                        <Lock size={14} className={styles.checkIcon} />
                        <div>
                          <div className={styles.investigationItemTitle}>Policy Rule #CF-04 Active</div>
                          <div className={styles.investigationItemDesc}>Auto-classify Cloudflare software expenses &lt; ₹1.5L</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.inspectorGlassPane}>
                    <div className={styles.inspectorHeader}>
                      <div className={styles.inspectorTitleBlock}>
                        <Sparkles size={14} className={styles.sparkleIcon} />
                        <span className={styles.inspectorTitle}>Forensic Match Verified</span>
                      </div>
                      <span className={styles.verifiedTextBadge}>100% Deterministic</span>
                    </div>
                    <p className={styles.tabExplainText}>
                      Evidence conclusively supports debiting <strong>6110 Software Expense</strong> and crediting <strong>1001 Operating Bank</strong>.
                    </p>
                    <button type="button" className={styles.approveGlassBtn} onClick={() => setActiveTab("reconciliation")}>
                      <span>Return to Resolution</span>
                      <ChevronRight size={13} strokeWidth={2.4} />
                    </button>
                  </div>
                </>
              )}

              {/* ================= AUDIT TRAIL TAB CONTENT ================= */}
              {activeTab === "audit" && (
                <>
                  <div className={styles.ledgerPane}>
                    <div className={styles.paneHeader}>
                      <span className={styles.paneLabel}>IMMUTABLE DECISION LOG</span>
                    </div>
                    <div className={styles.investigationDetailsList}>
                      <div className={styles.investigationItem}>
                        <Lock size={14} className={styles.txFileIconActive} />
                        <div>
                          <div className={styles.investigationItemTitle}>SHA-256 State Anchor</div>
                          <div className={styles.investigationItemDesc}>Block #948291 &middot; Timestamp: 30-Sep-2026 18:24:00</div>
                        </div>
                      </div>
                      <div className={styles.investigationItem}>
                        <ShieldCheck size={14} className={styles.checkIcon} />
                        <div>
                          <div className={styles.investigationItemTitle}>Controller Approval Certificate</div>
                          <div className={styles.investigationItemDesc}>Human reviewed &amp; cryptographically signed</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.inspectorGlassPane}>
                    <div className={styles.inspectorHeader}>
                      <div className={styles.inspectorTitleBlock}>
                        <ShieldCheck size={14} className={styles.sparkleIcon} />
                        <span className={styles.inspectorTitle}>SOC 2 / ISO 27001 Ready</span>
                      </div>
                      <span className={styles.verifiedTextBadge}>Immutable</span>
                    </div>
                    <p className={styles.tabExplainText}>
                      Every AI recommendation, underlying evidence document, and controller decision is preserved for external auditors.
                    </p>
                    <button type="button" className={styles.approveGlassBtn} onClick={() => setActiveTab("reconciliation")}>
                      <span>Export Audit Package</span>
                      <ChevronRight size={13} strokeWidth={2.4} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Floor Reflection on Terrace Below Floating Window */}
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
