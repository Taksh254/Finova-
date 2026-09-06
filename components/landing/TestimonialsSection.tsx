import React from "react";
import { CheckCircle2 } from "lucide-react";
import styles from "./TestimonialsSection.module.css";

const testimonials = [
  {
    quote:
      "Before FINOVA, we blindly trusted Razorpay's weekly settlement deposits. In our first 10 days, Payout Truth flagged ₹38,400 in duplicate processing fees and invalid international card charges that our gateway refunded. FINOVA pays for itself within 48 hours every single month.",
    metric: "₹38,400 Leaked Fees Recovered",
    name: "Ananya Sharma",
    role: "Co-Founder & COO, Zest Wellness (D2C Brand)",
    initials: "AS",
  },
  {
    quote:
      "Cash flow anxiety used to haunt my Sundays on the 27th of every month before payroll. The 18-Day Runway Radar simulated our exact balance and gave us the confidence to hire 4 new senior engineers without sweating salary disbursement dates.",
    metric: "14 Months Zero Payroll Panic",
    name: "Karan Verma",
    role: "Founder, HyperScale Digital (Tech Agency)",
    initials: "KV",
  },
  {
    quote:
      "Our Chartered Accountant used to spend 3 days every quarter sorting out unverified UTR numbers and GST input credit discrepancies. With FINOVA, verified double-entry journals sync directly into our ledger with complete audit attachments.",
    metric: "18 Hours Monthly Saved",
    name: "Vikramaditya Rao",
    role: "Managing Director, Nova Craft Supplies",
    initials: "VR",
  },
];

export function TestimonialsSection() {
  return (
    <section className={styles.sectionWrapper} id="case-studies">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tag}>Proven SME Outcomes</span>
          <h2 className={styles.title}>
            Why High-Growth Small Businesses Rely on FINOVA Month After Month
          </h2>
          <p className={styles.subtitle}>
            Hear directly from founders and operators who converted unpredictable financial stress into deterministic margin growth.
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((t, idx) => (
            <div key={idx} className={styles.card}>
              <div>
                <div className={styles.outcomeBadge}>
                  <CheckCircle2 size={13} />
                  <span>{t.metric}</span>
                </div>
                <p className={styles.quoteText}>{`"${t.quote}"`}</p>
              </div>

              <div className={styles.authorRow}>
                <div className={styles.avatarCircle}>{t.initials}</div>
                <div className={styles.authorMeta}>
                  <span className={styles.authorName}>{t.name}</span>
                  <span className={styles.authorTitle}>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
