import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FINOVA — AI-Powered Autonomous Finance for Small Businesses",
  description: "The autonomous financial operating system built for high-retention SMEs. Reconcile payouts, predict cash runways, and stop silent gateway leaks.",
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
