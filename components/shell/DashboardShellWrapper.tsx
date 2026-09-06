"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import styles from "../../app/layout.module.css";

interface DashboardShellWrapperProps {
  children: React.ReactNode;
}

export function DashboardShellWrapper({ children }: DashboardShellWrapperProps) {
  const pathname = usePathname();

  // For Controller Workbench, render full-screen custom workbench shell
  if (pathname === "/overview" || pathname === "/workbench") {
    return <>{children}</>;
  }

  return (
    <div className={styles.layoutContainer}>
      <Sidebar />
      <div className={styles.mainWrapper}>
        <TopBar />
        <main className={styles.contentRegion}>{children}</main>
      </div>
    </div>
  );
}
