"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  ArrowLeftRight,
  FileText,
  Receipt,
  TrendingUp,
  Landmark,
  GitCompare,
  BarChart3,
  Bot,
  Settings,
  Sparkles,
} from "lucide-react";
import styles from "./Sidebar.module.css";

interface NavItemConfig {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeType?: "normal" | "alert" | "ai";
}

interface NavSection {
  title?: string;
  items: NavItemConfig[];
}

const navSections: NavSection[] = [
  {
    items: [
      { label: "Overview", href: "/overview", icon: LayoutDashboard },
      { label: "Payout Truth", href: "/payout-truth", icon: ShieldCheck, badge: "Flagship", badgeType: "ai" },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
      { label: "Invoices", href: "/invoices", icon: FileText, badge: "12" },
      { label: "Expenses", href: "/expenses", icon: Receipt },
      { label: "Cash Flow", href: "/cash-flow", icon: TrendingUp },
      { label: "Accounts", href: "/accounts", icon: Landmark },
      { label: "Reconciliation", href: "/reconciliation", icon: GitCompare, badge: "3", badgeType: "alert" },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { label: "Reports", href: "/reports", icon: BarChart3 },
      { label: "AI Agents", href: "/ai-agents", icon: Bot, badge: "5 Active", badgeType: "ai" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {/* Brand Header */}
      <div className={styles.brandArea}>
        <div className={styles.logoMark}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
        <div className={styles.brandText}>
          <span className={styles.brandName}>FINOVA</span>
          <span className={styles.brandTagline}>Clarity compounds.</span>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className={styles.navContainer}>
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className={styles.navSection}>
            {section.title && (
              <span className={styles.sectionTitle}>{section.title}</span>
            )}
            <div className={styles.navItemsList}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href === "/overview" && (pathname === "/" || pathname === "/overview"));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  >
                    <div className={styles.navItemContent}>
                      <Icon size={16} className={styles.navIcon} />
                      <span className={styles.navLabel}>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`${styles.navBadge} ${
                          item.badgeType === "alert"
                            ? styles.navBadgeAlert
                            : item.badgeType === "ai"
                            ? styles.navBadgeAi
                            : styles.navBadgeNormal
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Profile & AI Status Card */}
      <div className={styles.bottomSection}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>TS</div>
          <div className={styles.userMeta}>
            <div className={styles.companyName}>Acme Corp.</div>
            <div className={styles.userName}>Taksh Sehrawat</div>
          </div>
        </div>
        <div className={styles.aiStatusPill}>
          <span className={styles.statusPulse} />
          <span className={styles.statusText}>AI CFO Online</span>
          <Sparkles size={11} className={styles.statusSparkle} />
        </div>
      </div>
    </aside>
  );
}
