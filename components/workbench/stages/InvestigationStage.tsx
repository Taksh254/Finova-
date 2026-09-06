"use client";

import React, { useState } from "react";
import {
  FileText,
  FileQuestion,
  Receipt,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  X,
} from "lucide-react";
import styles from "./InvestigationStage.module.css";

interface InvestigationStageProps {
  selectedId: string;
  onSelectException: (id: string) => void;
  onProceed: () => void;
}

export function InvestigationStage({
  selectedId,
  onSelectException,
  onProceed,
}: InvestigationStageProps) {
  const [activeTab, setActiveTab] = useState<"investigation" | "related" | "reason">("investigation");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const isCloudflare = selectedId === "exc-cloudflare";

  return (
    <div className={styles.container}>
      <div className={styles.stageHeader}>
        <div>
          <span className={styles.stageEyebrow}>3/9 Exception investigation</span>
          <h1 className={styles.stageTitle}>Review all available evidence</h1>
        </div>
      </div>

      <div className={styles.layoutGrid}>
        {/* Left Mini Queue */}
        <aside className={styles.miniQueue}>
          <span className={styles.miniQueueTitle}>Exception queue</span>
          <div
            className={`${styles.miniCard} ${isCloudflare ? styles.miniCardActive : ""}`}
            onClick={() => onSelectException("exc-cloudflare")}
          >
            <div className={styles.miniCardName}>
              <span style={{ color: "var(--color-exception-red)" }}>•</span>
              <span>CLOUDFLARE*PRO</span>
            </div>
            <div className={styles.miniCardAmount}>₹1,00,000</div>
          </div>

          <div
            className={`${styles.miniCard} ${!isCloudflare ? styles.miniCardActive : ""}`}
            onClick={() => onSelectException("exc-duplicate")}
          >
            <div className={styles.miniCardName}>
              <span style={{ color: "#D97706" }}>•</span>
              <span>Duplicate payment</span>
            </div>
            <div className={styles.miniCardAmount}>₹50,000</div>
          </div>
        </aside>

        {/* Right Main Investigation */}
        <div className={styles.investigationMain}>
          {/* Tabs Row */}
          <div className={styles.tabsRow}>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "investigation" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("investigation")}
            >
              Investigation
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "related" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("related")}
            >
              Related transactions
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "reason" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("reason")}
            >
              Reason
            </button>
          </div>

          {/* 3 Evidence Cards Row */}
          <div className={styles.cardsRow}>
            {/* Card 1: Bank Transaction */}
            <div className={styles.evidenceCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardHeaderTitle}>Bank transaction</span>
              </div>
              <div className={styles.evidenceFields}>
                <div className={styles.fieldRow}>
                  <span className={styles.fieldKey}>Description</span>
                  <span className={styles.fieldValBold}>CLOUDFLARE*PRO</span>
                </div>
                <div className={styles.fieldRow}>
                  <span className={styles.fieldKey}>Amount</span>
                  <span className={styles.fieldValBold} style={{ fontFamily: "var(--font-mono-numbers)" }}>
                    ₹1,00,000
                  </span>
                </div>
                <div className={styles.fieldRow}>
                  <span className={styles.fieldKey}>Date</span>
                  <span className={styles.fieldVal}>Sep 12, 2026</span>
                </div>
                <div className={styles.fieldRow}>
                  <span className={styles.fieldKey}>Reference</span>
                  <span className={styles.fieldVal} style={{ fontFamily: "var(--font-mono-numbers)" }}>
                    CF-928374
                  </span>
                </div>
                <div className={styles.fieldRow}>
                  <span className={styles.fieldKey}>Account</span>
                  <span className={styles.fieldVal}>•••• 4582</span>
                </div>
              </div>
            </div>

            {/* Card 2: Vendor Invoice */}
            <div className={styles.evidenceCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardHeaderTitle}>Vendor invoice</span>
                <button
                  type="button"
                  className={styles.viewInvoiceLink}
                  onClick={() => setShowInvoiceModal(true)}
                >
                  View invoice →
                </button>
              </div>
              <div className={styles.evidenceFields}>
                <div className={styles.fieldRow}>
                  <span className={styles.fieldKey}>Invoice no.</span>
                  <span className={styles.fieldVal} style={{ fontFamily: "var(--font-mono-numbers)" }}>
                    INV-CF-0926
                  </span>
                </div>
                <div className={styles.fieldRow}>
                  <span className={styles.fieldKey}>Date</span>
                  <span className={styles.fieldVal}>Sep 12, 2026</span>
                </div>
                <div className={styles.fieldRow}>
                  <span className={styles.fieldKey}>Amount</span>
                  <span className={styles.fieldValBold} style={{ fontFamily: "var(--font-mono-numbers)" }}>
                    ₹1,00,000
                  </span>
                </div>
                <div className={styles.fieldRow}>
                  <span className={styles.fieldKey}>Vendor</span>
                  <span className={styles.fieldVal}>Cloudflare</span>
                </div>
                <div className={styles.fieldRow}>
                  <span className={styles.fieldKey}>Status</span>
                  <span className={styles.fieldVal} style={{ color: "var(--color-cleared-green)" }}>
                    Verified PDF
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: General Ledger */}
            <div className={styles.evidenceCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardHeaderTitle}>General ledger</span>
              </div>
              <div className={styles.emptyGlBox}>
                <FileQuestion size={28} strokeWidth={1.5} color="var(--text-editorial-light)" />
                <div className={styles.emptyGlTitle}>No matching entry found</div>
                <p className={styles.emptyGlSub}>
                  No transaction found with the same amount, date or reference.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Split */}
          <div className={styles.bottomRow}>
            {/* Previous Related Transactions */}
            <div className={styles.relatedBox}>
              <h3 className={styles.relatedHeading}>Previous related transactions</h3>
              <div className={styles.relatedSub}>3 past transactions with Cloudflare</div>
              <table className={styles.relatedTable}>
                <tbody>
                  <tr>
                    <td style={{ color: "var(--text-editorial-muted)" }}>Jun 12, 2026</td>
                    <td style={{ fontFamily: "var(--font-mono-numbers)" }}>₹72,450</td>
                    <td>Cloudflare</td>
                    <td style={{ textAlign: "right" }}>
                      <span className={styles.clearedPill}>Matched</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--text-editorial-muted)" }}>Jul 15, 2026</td>
                    <td style={{ fontFamily: "var(--font-mono-numbers)" }}>₹48,200</td>
                    <td>Cloudflare</td>
                    <td style={{ textAlign: "right" }}>
                      <span className={styles.clearedPill}>Matched</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--text-editorial-muted)" }}>Aug 10, 2026</td>
                    <td style={{ fontFamily: "var(--font-mono-numbers)" }}>₹91,300</td>
                    <td>Cloudflare</td>
                    <td style={{ textAlign: "right" }}>
                      <span className={styles.clearedPill}>Matched</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Why it could not be matched */}
            <div className={styles.whyBox}>
              <h3 className={styles.whyHeading}>Why it could not be matched</h3>
              <ul className={styles.reasonsList}>
                <li className={styles.reasonItem}>
                  <span className={styles.bulletDot}>•</span>
                  <span>No exact match in GL records</span>
                </li>
                <li className={styles.reasonItem}>
                  <span className={styles.bulletDot}>•</span>
                  <span>Reference format is new (CF-928374)</span>
                </li>
                <li className={styles.reasonItem}>
                  <span className={styles.bulletDot}>•</span>
                  <span>Vendor name not present in existing automated rules</span>
                </li>
                <li className={styles.reasonItem}>
                  <span className={styles.bulletDot}>•</span>
                  <span>Amount differs from past transaction history</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Bar */}
          <div className={styles.actionBar}>
            <button type="button" className={styles.proceedBtn} onClick={onProceed}>
              <span>Proceed to proposed correction</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Modal Preview */}
      {showInvoiceModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setShowInvoiceModal(false)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "2rem",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Invoice INV-CF-0926</h3>
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                style={{ cursor: "pointer", border: "none", background: "none" }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.88rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-editorial-muted)" }}>Vendor</span>
                <strong>Cloudflare, Inc.</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-editorial-muted)" }}>Billing Date</span>
                <span>Sep 12, 2026</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-editorial-muted)" }}>Total Amount</span>
                <span style={{ fontFamily: "var(--font-mono-numbers)", fontWeight: 700 }}>₹1,00,000</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-editorial-muted)" }}>Service Description</span>
                <span>Enterprise Edge Security & Bot Management</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-editorial-muted)" }}>Payment Method</span>
                <span>Corporate Visa Debit (••4582)</span>
              </div>
            </div>
            <div style={{ marginTop: "1.75rem", textAlign: "right" }}>
              <button
                type="button"
                className={styles.proceedBtn}
                style={{ padding: "0.6rem 1.25rem", fontSize: "0.84rem" }}
                onClick={() => setShowInvoiceModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
