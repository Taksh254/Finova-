import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FINOVA — Clarity across your financial reality",
  description: "FINOVA helps modern finance teams reconcile, investigate and resolve financial exceptions — so they can move forward with confidence.",
  keywords: [
    "Bank reconciliation",
    "AI financial operations",
    "Exception management",
    "Month-end close",
    "Accounting automation",
    "Deterministic financial controls"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
