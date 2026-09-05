import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "FINOVA — AI-Powered Finance Operations Platform",
  description: "Enterprise finance operations, reconciliation, invoice intelligence, and automated cash management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className={styles.layoutContainer}>
          <Sidebar />
          <div className={styles.mainWrapper}>
            <TopBar />
            <main className={styles.contentRegion}>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
