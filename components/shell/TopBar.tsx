"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, Calendar, ArrowLeft } from "lucide-react";
import styles from "./TopBar.module.css";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Good morning, Taksh.",
    subtitle: "Here's what is happening across your business.",
  },
  "/overview": {
    title: "Good morning, Taksh.",
    subtitle: "Here's what is happening across your business.",
  },
  "/transactions": {
    title: "Transactions",
    subtitle: "Multi-account double-entry transaction feed with automated classification.",
  },
  "/invoices": {
    title: "Invoices",
    subtitle: "Manage accounts receivable and upcoming vendor payables.",
  },
  "/expenses": {
    title: "Expenses",
    subtitle: "Corporate spend management, category allocation, and trend anomalies.",
  },
  "/cash-flow": {
    title: "Cash Flow Dynamics",
    subtitle: "Liquidity forecasting, net cash burn, and runway projection.",
  },
  "/accounts": {
    title: "Accounts & Banking",
    subtitle: "Integrated operational bank feeds and automated balance reconciliation.",
  },
  "/reconciliation": {
    title: "Bank Reconciliation",
    subtitle: "AI-assisted matching across bank statements and internal ledgers.",
  },
  "/reports": {
    title: "Financial Reports",
    subtitle: "Audited P&L, balance sheets, and real-time management statements.",
  },
  "/ai-agents": {
    title: "AI Agent Orchestrator",
    subtitle: "Finova AI is coordinating 5 autonomous finance agents.",
  },
  "/settings": {
    title: "Workspace Settings",
    subtitle: "Entity policies, approval matrices, and banking integrations.",
  },
};

export function TopBar() {
  const pathname = usePathname();
  const current = pageTitles[pathname] || {
    title: "Good morning, Taksh.",
    subtitle: "Here's what is happening across your business.",
  };
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className={styles.topbar}>
      <div className={styles.leftSection}>
        <button className={styles.backButton} aria-label="Go back" title="Previous page">
          <ArrowLeft size={16} />
        </button>
        <div className={styles.titleGroup}>
          <h1 className={styles.pageTitle}>{current.title}</h1>
          <p className={styles.pageSubtitle}>{current.subtitle}</p>
        </div>
      </div>

      <div className={styles.rightSection}>
        {/* Search */}
        <div className={styles.searchWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search transactions, invoices, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className={styles.searchShortcut}>⌘K</span>
        </div>

        {/* Date Range Selector */}
        <div className={styles.dateSelector} title="Selected Operating Period">
          <Calendar size={13} className={styles.calendarIcon} />
          <span>Sep 1, 2026 – Sep 30, 2026</span>
        </div>

        {/* Notifications */}
        <button className={styles.iconButton} aria-label="Notifications" title="3 alerts pending">
          <Bell size={16} />
          <span className={styles.notificationDot} />
        </button>

        {/* User Profile Pill */}
        <div className={styles.avatarPill} title="Taksh Sehrawat">
          <span>TS</span>
        </div>

        {/* Header Motto */}
        <div className={styles.quoteWrapper}>
          <span className={styles.mottoText}>&ldquo;Smarter finance for bolder tomorrows.&rdquo;</span>
          <div className={styles.mottoLine} />
        </div>
      </div>
    </header>
  );
}
