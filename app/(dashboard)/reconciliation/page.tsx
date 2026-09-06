"use client";

import React, { useCallback, useEffect, useState } from "react";
import { GitCompare, RefreshCw, ArrowRight, Check, X } from "lucide-react";
import styles from "./ReconciliationPage.module.css";
import { formatINR, formatDate } from "@/lib/finance/formatting";

interface TransactionSummary {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  reference: string | null;
}

interface InvoiceSummary {
  id: string;
  invoiceNumber: string;
  vendorClient: string;
  amount: number;
  dueDate: string;
  type: string;
}

interface ReconciliationMatch {
  id: string;
  confidenceScore: number;
  matchType: string;
  reasoning: string;
  evidence: string | null;
  status: "PROPOSED" | "APPROVED" | "REJECTED";
  decidedBy: string | null;
  decidedAt: string | null;
  createdAt: string;
  transaction: TransactionSummary;
  invoice: InvoiceSummary;
}

function confidenceClass(score: number) {
  if (score >= 0.75) return styles.confidenceHigh;
  if (score >= 0.5) return styles.confidenceMedium;
  return styles.confidenceLow;
}

export default function ReconciliationPage() {
  const [matches, setMatches] = useState<ReconciliationMatch[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [decidingId, setDecidingId] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch("/api/reconciliation/matches");
      const json = await res.json();
      if (json.success) setMatches(json.data);
    } catch (error) {
      console.error("Failed to load reconciliation matches:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const scan = async () => {
    setIsScanning(true);
    try {
      await fetch("/api/reconciliation/matches", { method: "POST" });
      await fetchMatches();
    } finally {
      setIsScanning(false);
    }
  };

  const decide = async (id: string, decision: "APPROVED" | "REJECTED") => {
    setDecidingId(id);
    try {
      await fetch(`/api/reconciliation/matches/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, decidedBy: "You" }),
      });
      await fetchMatches();
    } finally {
      setDecidingId(null);
    }
  };

  const pending = matches.filter((m) => m.status === "PROPOSED");
  const decided = matches.filter((m) => m.status !== "PROPOSED");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}>
            <GitCompare size={20} />
          </div>
          <div>
            <h2 className={styles.title}>Reconciliation Engine</h2>
            <p className={styles.subtitle}>
              The Reconciliation Agent proposes matches between bank transactions and invoices — you approve or reject.
            </p>
          </div>
        </div>
        <button className={styles.scanBtn} onClick={scan} disabled={isScanning}>
          <RefreshCw size={14} className={isScanning ? styles.spinIcon : ""} />
          {isScanning ? "Scanning..." : "Scan for New Matches"}
        </button>
      </div>

      <span className={styles.sectionTitle}>Pending Approval ({pending.length})</span>

      {isLoading ? (
        <div className={styles.emptyState}>Loading reconciliation matches...</div>
      ) : pending.length === 0 ? (
        <div className={styles.emptyState}>
          No matches waiting for review. Click &ldquo;Scan for New Matches&rdquo; to have the Reconciliation Agent look for new candidates.
        </div>
      ) : (
        <div className={styles.matchList}>
          {pending.map((match) => {
            const evidence: string[] = match.evidence ? JSON.parse(match.evidence) : [];
            return (
              <div className={styles.matchCard} key={match.id}>
                <div className={styles.matchTop}>
                  <span className={`${styles.confidenceBadge} ${confidenceClass(match.confidenceScore)}`}>
                    {Math.round(match.confidenceScore * 100)}% confidence
                  </span>
                  <span className={styles.matchTypeTag}>{match.matchType.replace("_", " ")}</span>
                </div>

                <div className={styles.pairGrid}>
                  <div className={styles.pairSide}>
                    <div className={styles.pairLabel}>Bank Transaction</div>
                    <div className={styles.pairAmount}>{formatINR(match.transaction.amount)}</div>
                    <div className={styles.pairMeta}>{match.transaction.description}</div>
                    <div className={styles.pairMeta}>{formatDate(match.transaction.date)}</div>
                  </div>
                  <ArrowRight className={styles.pairArrow} size={18} />
                  <div className={styles.pairSide}>
                    <div className={styles.pairLabel}>{match.invoice.type} Invoice</div>
                    <div className={styles.pairAmount}>{formatINR(match.invoice.amount)}</div>
                    <div className={styles.pairMeta}>
                      {match.invoice.invoiceNumber} — {match.invoice.vendorClient}
                    </div>
                    <div className={styles.pairMeta}>Due {formatDate(match.invoice.dueDate)}</div>
                  </div>
                </div>

                <p className={styles.reasoning}>{match.reasoning}</p>

                {evidence.length > 0 && (
                  <div className={styles.evidenceList}>
                    {evidence.map((e, i) => (
                      <div className={styles.evidenceItem} key={i}>
                        <span>•</span>
                        <span>{e}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.actionsRow}>
                  <button
                    className={styles.approveBtn}
                    onClick={() => decide(match.id, "APPROVED")}
                    disabled={decidingId === match.id}
                  >
                    <Check size={13} /> Approve
                  </button>
                  <button
                    className={styles.rejectBtn}
                    onClick={() => decide(match.id, "REJECTED")}
                    disabled={decidingId === match.id}
                  >
                    <X size={13} /> Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {decided.length > 0 && (
        <>
          <span className={styles.sectionTitle}>Decision History</span>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Invoice</th>
                <th>Confidence</th>
                <th>Decision</th>
                <th>Decided By</th>
              </tr>
            </thead>
            <tbody>
              {decided.map((m) => (
                <tr key={m.id}>
                  <td>{m.transaction.description}</td>
                  <td>{m.invoice.invoiceNumber}</td>
                  <td>{Math.round(m.confidenceScore * 100)}%</td>
                  <td className={m.status === "APPROVED" ? styles.statusApproved : styles.statusRejected}>{m.status}</td>
                  <td>{m.decidedBy || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
