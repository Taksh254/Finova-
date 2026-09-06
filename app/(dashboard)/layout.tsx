import React from "react";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import styles from "../layout.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
