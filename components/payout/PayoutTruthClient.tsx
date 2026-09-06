"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  RefreshCw,
  Search,
  Sparkles,
  Layers,
  FileCheck2,
} from "lucide-react";
import {
  PayoutSummary,
  PayoutListItem,
  PayoutDetail,
} from "@/lib/finance/payoutService";
import { formatINR, formatDate } from "@/lib/finance/formatting";
import { PayoutDetailView } from "./PayoutDetailView";
import { Toast } from "@/components/dashboard/Toast";
import styles from "./PayoutTruthClient.module.css";

interface PayoutTruthClientProps {
  initialSummary: PayoutSummary;
  initialPayouts: PayoutListItem[];
}

export function PayoutTruthClient({
  initialSummary,
  initialPayouts,
}: PayoutTruthClientProps) {
  const [summary, setSummary] = useState<PayoutSummary>(initialSummary);
  const [payouts, setPayouts] = useState<PayoutListItem[]>(initialPayouts);
  const [selectedPayoutId, setSelectedPayoutId] = useState<string | null>(null);
  const [selectedPayoutDetail, setSelectedPayoutDetail] = useState<PayoutDetail | null>(null);
  const [filter, setFilter] = useState<"ALL" | "NEEDS_REVIEW" | "RECONCILED" | "PROCESSING">("ALL");
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load payout detail when selected
  const loadPayoutDetail = async (id: string) => {
    try {
      setIsLoadingDetail(true);
      setSelectedPayoutId(id);
      const res = await fetch(`/api/payouts/${id}`);
      const json = await res.json();
      if (json.success) {
        setSelectedPayoutDetail(json.data);
      } else {
        setToastMessage("Failed to load payout detail.");
      }
    } catch (err) {
      setToastMessage("Network error fetching payout details.");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Refresh all payouts and summary
  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/payouts");
      const json = await res.json();
      if (json.success) {
        setSummary(json.data.summary);
        setPayouts(json.data.payouts);
        setToastMessage("Payout truth pipeline updated.");
      }
    } catch (err) {
      setToastMessage("Failed to refresh payouts.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filtered table rows
  const filteredPayouts = payouts.filter((p) => {
    if (filter === "ALL") return true;
    return p.status === filter;
  });

  return (
    <div className={styles.container}>
      {/* 1. Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleGroup}>
          <div className={styles.badgeTag}>
            <Sparkles size={12} />
            <span>Autonomous Reconciliation Engine</span>
          </div>
          <h1 className={styles.title}>Payout Truth</h1>
          <p className={styles.subtitle}>Know exactly where every rupee went.</p>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.refreshBtn}
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={isRefreshing ? styles.spinIcon : ""} />
            <span>{isRefreshing ? "Refreshing..." : "Sync Gateways"}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className={styles.summaryGrid}>
        {/* Card 1: Payouts to reconcile */}
        <div className={styles.summaryCard}>
          <div className={styles.cardTop}>
            <span className={styles.cardLabel}>Payouts to Reconcile</span>
            <div className={`${styles.cardIconCircle} ${styles.iconBlue}`}>
              <Clock size={16} />
            </div>
          </div>
          <span className={styles.cardValue}>{summary.payoutsToReconcile}</span>
          <span className={styles.cardSubtext}>Awaiting gateway statement clearance</span>
        </div>

        {/* Card 2: Successfully reconciled */}
        <div className={styles.summaryCard}>
          <div className={styles.cardTop}>
            <span className={styles.cardLabel}>Successfully Reconciled</span>
            <div className={`${styles.cardIconCircle} ${styles.iconGreen}`}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <span className={styles.cardValue}>{summary.successfullyReconciled}</span>
          <span className={styles.cardSubtext}>100% matched to bank credit</span>
        </div>

        {/* Card 3: Exceptions / Needs Review */}
        <div className={styles.summaryCard}>
          <div className={styles.cardTop}>
            <span className={styles.cardLabel}>Exceptions / Review</span>
            <div className={`${styles.cardIconCircle} ${styles.iconRed}`}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <span className={styles.cardValue} style={{ color: "var(--color-negative)" }}>
            {summary.exceptionsCount}
          </span>
          <span className={styles.cardSubtext}>Unexplained gap requiring human sign-off</span>
        </div>

        {/* Card 4: Total value reconciled */}
        <div className={styles.summaryCard}>
          <div className={styles.cardTop}>
            <span className={styles.cardLabel}>Total Value Reconciled</span>
            <div className={`${styles.cardIconCircle} ${styles.iconPurple}`}>
              <ShieldCheck size={16} />
            </div>
          </div>
          <span className={styles.cardValue}>{formatINR(summary.totalValueReconciled, true)}</span>
          <span className={styles.cardSubtext}>Verified rupee settlement volume</span>
        </div>
      </div>

      {/* 3. Detail View OR Recent Payouts Table */}
      {selectedPayoutId && selectedPayoutDetail ? (
        <PayoutDetailView
          payout={selectedPayoutDetail}
          onBack={() => {
            setSelectedPayoutId(null);
            setSelectedPayoutDetail(null);
          }}
          onSwitchPayout={(newId) => loadPayoutDetail(newId)}
          onPayoutUpdated={(updated, msg) => {
            setSelectedPayoutDetail(updated);
            setToastMessage(msg);
            refreshData();
          }}
        />
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableHeaderBar}>
            <div className={styles.tableHeadingGroup}>
              <h2 className={styles.tableTitle}>Recent Payouts</h2>
              <p className={styles.tableSubtitle}>
                Select a merchant settlement batch to inspect transaction-level deduction truth.
              </p>
            </div>

            {/* Filter Pills */}
            <div className={styles.filterPills}>
              {(["ALL", "NEEDS_REVIEW", "RECONCILED", "PROCESSING"] as const).map((f) => (
                <button
                  key={f}
                  className={`${styles.filterPill} ${filter === f ? styles.filterPillActive : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "ALL" && "All Payouts"}
                  {f === "NEEDS_REVIEW" && "Needs Review (1)"}
                  {f === "RECONCILED" && "Reconciled (1)"}
                  {f === "PROCESSING" && "Processing (1)"}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Payout ID</th>
                  <th>Merchant / Gateway</th>
                  <th>Settlement Date</th>
                  <th className={styles.thRight}>Gross Amount</th>
                  <th className={styles.thRight}>Expected Payout</th>
                  <th className={styles.thRight}>Actual Received</th>
                  <th className={styles.thRight}>Difference</th>
                  <th>Status</th>
                  <th style={{ textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayouts.map((p) => {
                  return (
                    <tr key={p.id}>
                      <td>
                        <span className={styles.payoutIdCode}>{p.id}</span>
                      </td>

                      <td>
                        <div className={styles.merchantCell}>
                          <span className={styles.merchantName}>{p.merchant}</span>
                          <span className={styles.txCount}>{p.transactionsCount} underlying transactions</span>
                        </div>
                      </td>

                      <td className={styles.dateCell}>{formatDate(p.date)}</td>

                      <td className={`${styles.amountNum} tabular-nums`}>
                        {formatINR(p.grossAmount)}
                      </td>

                      <td className={`${styles.amountNum} tabular-nums`}>
                        {formatINR(p.expectedPayout)}
                      </td>

                      <td className={`${styles.amountNum} tabular-nums`}>
                        {p.actualReceived > 0 ? formatINR(p.actualReceived) : "—"}
                      </td>

                      <td className={p.difference > 0 ? styles.diffMismatch : styles.diffExact}>
                        {p.difference > 0 ? `-${formatINR(p.difference)}` : "₹0"}
                      </td>

                      <td>
                        {p.status === "RECONCILED" && (
                          <span className={`${styles.statusPill} ${styles.statusReconciled}`}>
                            <CheckCircle2 size={12} />
                            <span>Reconciled</span>
                          </span>
                        )}
                        {p.status === "NEEDS_REVIEW" && (
                          <span className={`${styles.statusPill} ${styles.statusReview}`}>
                            <AlertTriangle size={12} />
                            <span>Needs Review</span>
                          </span>
                        )}
                        {p.status === "PROCESSING" && (
                          <span className={`${styles.statusPill} ${styles.statusProcessing}`}>
                            <Clock size={12} />
                            <span>Processing</span>
                          </span>
                        )}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <Link
                          href={`/payout-truth/${p.id}`}
                          className={styles.investigateBtn}
                          title="Open deep Payout Truth investigation"
                        >
                          <span>Investigate</span>
                          <ArrowRight size={13} />
                        </Link>
                        {p.hasAccountingEntry && (
                          <span className={styles.bookedBadge}>
                            <FileCheck2 size={12} />
                            <span>Booked</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floating Feedback Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
