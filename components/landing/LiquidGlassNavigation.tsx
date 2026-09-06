"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Layers,
  Search,
  FileText,
  CheckCircle2,
  Zap,
  Building,
  UserCheck,
  PieChart,
  ShieldCheck,
  Lock,
  X,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import styles from "./LiquidGlassNavigation.module.css";

export type NavPanelId = "product" | "how-it-works" | "use-cases" | "customers" | "about";

interface NavigationItemProps {
  id: NavPanelId;
  label: string;
  isActive: boolean;
  onSelect: (id: NavPanelId) => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
}

export function NavigationItem({ id, label, isActive, onSelect, buttonRef }: NavigationItemProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={() => onSelect(id)}
      aria-expanded={isActive}
      aria-controls="liquid-glass-popover"
      className={`${styles.navItemBtn} ${isActive ? styles.navItemActive : ""}`}
    >
      <span className={styles.navItemLabel}>{label}</span>
      {isActive && <span className={styles.activePillIndicator} />}
    </button>
  );
}

interface GlassPopoverProps {
  activePanel: NavPanelId;
  stemLeft: number;
  onClose: () => void;
  children: React.ReactNode;
}

export function GlassPopover({ activePanel, stemLeft, onClose, children }: GlassPopoverProps) {
  return (
    <div
      id="liquid-glass-popover"
      className={styles.glassPanelContainer}
      role="region"
      aria-label={`${activePanel} Details`}
    >
      {/* 1. Dynamic Luminous Liquid Glass Stem Bridge connected to the active nav item */}
      <div
        className={styles.glassStemBridge}
        style={{ left: `${stemLeft}px` }}
        aria-hidden="true"
      >
        <div className={styles.stemLightGleam} />
      </div>

      {/* 2. Main Spatial Liquid Glass Surface */}
      <div className={styles.spatialGlassPanel}>
        {/* Soft radial glow right under the active stem */}
        <div
          className={styles.panelStemGlow}
          style={{ left: `${stemLeft}px` }}
          aria-hidden="true"
        />

        {/* Specular sheen gradient across top portion */}
        <div className={styles.specularSheen} aria-hidden="true" />

        {/* Close Button */}
        <button
          type="button"
          className={styles.panelCloseBtn}
          onClick={onClose}
          aria-label="Close navigation panel"
        >
          <X size={13} strokeWidth={2.4} />
        </button>

        {/* Inner Content Container */}
        <div className={styles.panelInner}>{children}</div>
      </div>
    </div>
  );
}

interface PanelContentProps {
  activePanel: NavPanelId;
  activeLoopStep: number;
  onSelectLoopStep: (step: number) => void;
}

export function PanelContent({ activePanel, activeLoopStep, onSelectLoopStep }: PanelContentProps) {
  const howItWorksSteps = [
    {
      num: "01",
      title: "RECONCILE",
      desc: "Match bank transactions with internal ledger records automatically.",
    },
    {
      num: "02",
      title: "INVESTIGATE",
      desc: "Find evidence behind unmatched transactions across ERPs and invoices.",
    },
    {
      num: "03",
      title: "PROPOSE",
      desc: "Propose balanced double-entry journal postings with deterministic checks.",
    },
    {
      num: "04",
      title: "APPROVE",
      desc: "Keep accounting decisions under human control with 1-click verified sign-off.",
    },
    {
      num: "05",
      title: "LEARN",
      desc: "Turn approved decisions into bounded, testable policies for future cycles.",
    },
  ];

  switch (activePanel) {
    case "product":
      return (
        <div className={styles.contentFade}>
          <div className={styles.panelHeader}>
            <span className={styles.panelEyebrow}>PRODUCT</span>
            <h3 className={styles.panelTitle}>Financial operations, without the guesswork.</h3>
          </div>

          <div className={styles.productItemsGrid}>
            <div className={styles.productItem}>
              <div className={styles.itemIconWrap}>
                <Layers size={15} />
              </div>
              <div className={styles.itemContent}>
                <h4 className={styles.itemTitle}>RECONCILIATION</h4>
                <p className={styles.itemDesc}>Match bank transactions with internal accounting records.</p>
              </div>
            </div>

            <div className={styles.productItem}>
              <div className={styles.itemIconWrap}>
                <Search size={15} />
              </div>
              <div className={styles.itemContent}>
                <h4 className={styles.itemTitle}>INVESTIGATION</h4>
                <p className={styles.itemDesc}>Find evidence behind unmatched transactions.</p>
              </div>
            </div>

            <div className={styles.productItem}>
              <div className={styles.itemIconWrap}>
                <FileText size={15} />
              </div>
              <div className={styles.itemContent}>
                <h4 className={styles.itemTitle}>EXCEPTION RESOLUTION</h4>
                <p className={styles.itemDesc}>Understand what happened before anything is recorded.</p>
              </div>
            </div>

            <div className={styles.productItem}>
              <div className={styles.itemIconWrap}>
                <CheckCircle2 size={15} />
              </div>
              <div className={styles.itemContent}>
                <h4 className={styles.itemTitle}>HUMAN APPROVAL</h4>
                <p className={styles.itemDesc}>Keep accounting decisions under human control.</p>
              </div>
            </div>

            <div className={styles.productItem}>
              <div className={styles.itemIconWrap}>
                <Zap size={15} />
              </div>
              <div className={styles.itemContent}>
                <h4 className={styles.itemTitle}>SAFE AUTOMATION</h4>
                <p className={styles.itemDesc}>Turn approved decisions into bounded, testable policies.</p>
              </div>
            </div>
          </div>
        </div>
      );

    case "how-it-works":
      return (
        <div className={styles.contentFade}>
          <div className={styles.panelHeader}>
            <span className={styles.panelEyebrow}>HOW IT WORKS</span>
            <h3 className={styles.panelTitle}>The deterministic financial loop.</h3>
          </div>

          {/* 5-step horizontal progression loop */}
          <div className={styles.loopProgressionRow} role="tablist" aria-label="Finova Loop Steps">
            {howItWorksSteps.map((step, idx) => {
              const isSelected = activeLoopStep === idx;
              return (
                <React.Fragment key={step.num}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => onSelectLoopStep(idx)}
                    className={`${styles.loopStepBtn} ${isSelected ? styles.loopStepActive : ""}`}
                  >
                    <span className={styles.loopNum}>{step.num}</span>
                    <span className={styles.loopLabel}>{step.title}</span>
                  </button>
                  {idx < howItWorksSteps.length - 1 && (
                    <span className={styles.loopConnectorArrow} aria-hidden="true">
                      &rarr;
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Detailed step explanation card */}
          <div className={styles.activeStepCard}>
            <div className={styles.stepCardTop}>
              <span className={styles.stepBadge}>{howItWorksSteps[activeLoopStep].num}</span>
              <strong className={styles.stepCardTitle}>{howItWorksSteps[activeLoopStep].title}</strong>
            </div>
            <p className={styles.stepCardDesc}>{howItWorksSteps[activeLoopStep].desc}</p>
          </div>
        </div>
      );

    case "use-cases":
      return (
        <div className={styles.contentFade}>
          <div className={styles.panelHeader}>
            <span className={styles.panelEyebrow}>USE CASES</span>
            <h3 className={styles.panelTitle}>Focused on financial operations.</h3>
          </div>

          <div className={styles.useCasesGrid}>
            <div className={styles.useCaseCard}>
              <div className={styles.useCaseIcon}>
                <Building size={16} />
              </div>
              <div className={styles.useCaseContent}>
                <h4 className={styles.useCaseTitle}>BANK RECONCILIATION</h4>
                <p className={styles.useCaseDesc}>Resolve unmatched bank transactions.</p>
              </div>
            </div>

            <div className={styles.useCaseCard}>
              <div className={styles.useCaseIcon}>
                <Search size={16} />
              </div>
              <div className={styles.useCaseContent}>
                <h4 className={styles.useCaseTitle}>FINANCIAL EXCEPTIONS</h4>
                <p className={styles.useCaseDesc}>Investigate transactions that don&apos;t match.</p>
              </div>
            </div>

            <div className={styles.useCaseCard}>
              <div className={styles.useCaseIcon}>
                <FileText size={16} />
              </div>
              <div className={styles.useCaseContent}>
                <h4 className={styles.useCaseTitle}>ACCOUNTING REVIEW</h4>
                <p className={styles.useCaseDesc}>Propose corrections while keeping humans in control.</p>
              </div>
            </div>

            <div className={styles.useCaseCard}>
              <div className={styles.useCaseIcon}>
                <Zap size={16} />
              </div>
              <div className={styles.useCaseContent}>
                <h4 className={styles.useCaseTitle}>RECURRING TRANSACTIONS</h4>
                <p className={styles.useCaseDesc}>Safely automate previously approved patterns.</p>
              </div>
            </div>
          </div>
        </div>
      );

    case "customers":
      return (
        <div className={styles.contentFade}>
          <div className={styles.panelHeader}>
            <span className={styles.panelEyebrow}>BUILT FOR FINANCE TEAMS</span>
            <h3 className={styles.panelTitle}>Engineered for teams that require accountability.</h3>
          </div>

          <div className={styles.customerTiersGrid}>
            <div className={styles.customerTierCard}>
              <div className={styles.customerTierIcon}>
                <UserCheck size={18} />
              </div>
              <h4 className={styles.customerTierTitle}>CONTROLLERS</h4>
              <p className={styles.customerTierDesc}>For teams responsible for financial accuracy.</p>
            </div>

            <div className={styles.customerTierCard}>
              <div className={styles.customerTierIcon}>
                <Layers size={18} />
              </div>
              <h4 className={styles.customerTierTitle}>ACCOUNTING TEAMS</h4>
              <p className={styles.customerTierDesc}>For teams handling reconciliation and exceptions.</p>
            </div>

            <div className={styles.customerTierCard}>
              <div className={styles.customerTierIcon}>
                <PieChart size={18} />
              </div>
              <h4 className={styles.customerTierTitle}>FINANCE LEADERS</h4>
              <p className={styles.customerTierDesc}>For teams that need accountable automation.</p>
            </div>
          </div>
        </div>
      );

    case "about":
      return (
        <div className={styles.contentFade}>
          <div className={styles.panelHeader}>
            <span className={styles.panelEyebrow}>ABOUT FINOVA</span>
            <h3 className={styles.panelTitle}>Financial automation with boundaries.</h3>
          </div>

          <p className={styles.aboutParagraph}>
            FINOVA is an AI-native financial operations system designed to handle routine financial work while keeping important decisions accountable and under human control.
          </p>

          <div className={styles.principlesGrid}>
            <div className={styles.principleItem}>
              <span className={styles.pulseDot} />
              <span className={styles.principleText}>AI recommends.</span>
            </div>
            <div className={styles.principleItem}>
              <ShieldCheck size={14} className={styles.iconGreen} />
              <span className={styles.principleText}>Deterministic checks verify.</span>
            </div>
            <div className={styles.principleItem}>
              <UserCheck size={14} className={styles.iconGreen} />
              <span className={styles.principleText}>Humans approve.</span>
            </div>
            <div className={styles.principleItem}>
              <Lock size={14} className={styles.iconGreen} />
              <span className={styles.principleText}>Policies automate what has been proven safe.</span>
            </div>
          </div>

          <div className={styles.aboutQuoteBox}>
            &ldquo;Financial automation with boundaries.&rdquo;
          </div>
        </div>
      );

    default:
      return null;
  }
}

export function LiquidGlassNavigation() {
  const [activePanel, setActivePanel] = useState<NavPanelId | null>(null);
  const [activeLoopStep, setActiveLoopStep] = useState<number>(0);
  const [stemLeft, setStemLeft] = useState<number>(310);

  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<NavPanelId, HTMLButtonElement | null>>({
    product: null,
    "how-it-works": null,
    "use-cases": null,
    customers: null,
    about: null,
  });

  const updateStemPosition = useCallback((panelId: NavPanelId) => {
    const btn = buttonRefs.current[panelId];
    const container = containerRef.current;
    if (btn && container) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const center = btnRect.left + btnRect.width / 2 - containerRect.left;
      setStemLeft(center);
    }
  }, []);

  const handleSelect = (id: NavPanelId) => {
    if (activePanel === id) {
      setActivePanel(null);
    } else {
      setActivePanel(id);
      // Synchronously update stem position
      updateStemPosition(id);
    }
  };

  // Re-calculate stem position on resize or activePanel change
  useEffect(() => {
    if (activePanel) {
      updateStemPosition(activePanel);
    }
  }, [activePanel, updateStemPosition]);

  useEffect(() => {
    const handleResize = () => {
      if (activePanel) {
        updateStemPosition(activePanel);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activePanel, updateStemPosition]);

  // Handle Escape key and outside clicks
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActivePanel(null);
      }
    }

    function handlePointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActivePanel(null);
      }
    }

    if (activePanel) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handlePointerDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [activePanel]);

  const navItems: { id: NavPanelId; label: string }[] = [
    { id: "product", label: "Product" },
    { id: "how-it-works", label: "How it works" },
    { id: "use-cases", label: "Use cases" },
    { id: "customers", label: "Customers" },
    { id: "about", label: "About" },
  ];

  return (
    <>
      {/* Subtle Spatial Environment Response Backdrop: adds slight blur and soft depth shift without darkening */}
      {activePanel && (
        <div
          className={styles.spatialBackdrop}
          onClick={() => setActivePanel(null)}
          aria-hidden="true"
        />
      )}

      <div ref={containerRef} className={styles.liquidNavContainer}>
        {/* Navigation Capsule Pill */}
        <nav ref={pillRef} aria-label="Main navigation" className={styles.centerPill}>
          {navItems.map((item) => (
            <NavigationItem
              key={item.id}
              id={item.id}
              label={item.label}
              isActive={activePanel === item.id}
              onSelect={handleSelect}
              buttonRef={(el) => {
                buttonRefs.current[item.id] = el;
              }}
            />
          ))}
        </nav>

        {/* Emerging Liquid Glass Popover */}
        {activePanel && (
          <GlassPopover
            activePanel={activePanel}
            stemLeft={stemLeft}
            onClose={() => setActivePanel(null)}
          >
            <PanelContent
              activePanel={activePanel}
              activeLoopStep={activeLoopStep}
              onSelectLoopStep={setActiveLoopStep}
            />
          </GlassPopover>
        )}
      </div>
    </>
  );
}
