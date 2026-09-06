import React from "react";
import { ShieldCheck, TrendingUp, Zap, FileSpreadsheet, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import styles from "./PillarsSection.module.css";

const pillars = [
  {
    icon: ShieldCheck,
    badge: "Flagship Feature",
    title: "Autonomous Payout Truth Engine",
    desc: "Reconcile payment settlements across Razorpay, Stripe, Cashfree, and PayU down to the transaction ID. Catch hidden MDR rate increases, unexplained fee variances, and delayed refund reserves in under 2 seconds.",
    benefit: "Recovers an average of ₹22,400 monthly in silent gateway leakages.",
    href: "/payout-truth",
  },
  {
    icon: TrendingUp,
    badge: "Predictive Intelligence",
    title: "18-Day Forward Cash Radar",
    desc: "Simulate cash inflows, recurring vendor dues, GST quarterly deadlines, and payroll disbursements. Receive high-confidence proactive alerts 18 days before any potential cash squeeze.",
    benefit: "Eliminates month-end salary and vendor payment anxiety entirely.",
    href: "/cash-flow",
  },
  {
    icon: Zap,
    badge: "High-Retention FinOps",
    title: "Courteous Receivables & Auto-Dunning",
    desc: "Recover outstanding invoices without friction. Automated, brand-aligned WhatsApp and email reminders with instant payment links sent at optimal times when client finance teams disburse funds.",
    benefit: "Accelerates invoice cash conversion cycle by 38%.",
    href: "/invoices",
  },
  {
    icon: FileSpreadsheet,
    badge: "Auditor & CA Favorite",
    title: "1-Click Double-Entry Accounting Sync",
    desc: "Generate perfectly balanced double-entry accounting journals with matched bank UTRs, gross sales, MDR fees, and 18% GST input credit breakdown ready for direct import into Tally Prime or Zoho Books.",
    benefit: "Saves founders and finance managers 14 hours every month.",
    href: "/overview",
  },
];

export function PillarsSection() {
  return (
    <section className={styles.sectionWrapper} id="cash-radar">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Core Platform Architecture</span>
          <h2 className={styles.sectionTitle}>
            Four Autonomous Engines Built Specifically for Small Business Margins
          </h2>
          <p className={styles.sectionSubtitle}>
            Engineered to replace fragmented spreadsheets, manual reconciliation, and guesswork with deterministic mathematical proof.
          </p>
        </div>

        <div className={styles.pillarsGrid}>
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className={styles.pillarCard}>
                <div>
                  <div className={styles.pillarHeader}>
                    <div className={styles.iconBox}>
                      <Icon size={22} color="var(--color-primary)" />
                    </div>
                    <span className={styles.pillarBadge}>{pillar.badge}</span>
                  </div>

                  <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                  <p className={styles.pillarText}>{pillar.desc}</p>
                </div>

                <div className={styles.pillarBenefit}>
                  <CheckCircle size={16} color="var(--color-positive)" />
                  <span>{pillar.benefit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
