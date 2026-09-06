"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { formatINR } from "@/lib/finance/formatting";
import styles from "./CashFlowPage.module.css";

interface CashFlowEntryRecord {
  id: string;
  period: string;
  label: string;
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  balance: number;
}

export default function CashFlowPage() {
  const [entries, setEntries] = useState<CashFlowEntryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/dashboard/cashflow")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success) setEntries(json.data);
        else setError("Failed to load cash flow entries.");
      })
      .catch((err) => {
        console.error("Failed to load cash flow entries:", err);
        if (!cancelled) setError("Failed to load cash flow entries due to a network error.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalInflow = entries.reduce((sum, e) => sum + e.inflow, 0);
  const totalOutflow = entries.reduce((sum, e) => sum + e.outflow, 0);
  const netChange = totalInflow - totalOutflow;
  const openingBalance = entries.length > 0 ? entries[0].balance - entries[0].netFlow : 0;
  const closingBalance = entries.length > 0 ? entries[entries.length - 1].balance : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}>
            <TrendingUp size={20} />
          </div>
          <div>
            <h2 className={styles.title}>Cash Flow Dynamics &amp; Liquidity</h2>
            <p className={styles.subtitle}>Monthly cash inflow, outflow, and running balance across all accounts.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.emptyState}>Loading cash flow data...</div>
      ) : error ? (
        <div className={styles.emptyState}>{error}</div>
      ) : entries.length === 0 ? (
        <div className={styles.emptyState}>No cash flow entries recorded yet.</div>
      ) : (
        <>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Opening Balance</span>
              <div className={styles.summaryValue}>{formatINR(openingBalance, true)}</div>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Closing Balance</span>
              <div className={styles.summaryValue}>{formatINR(closingBalance, true)}</div>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Total Inflow</span>
              <div className={`${styles.summaryValue} ${styles.positive}`}>{formatINR(totalInflow, true)}</div>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Total Outflow</span>
              <div className={styles.summaryValue}>{formatINR(totalOutflow, true)}</div>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Net Change</span>
              <div className={`${styles.summaryValue} ${netChange >= 0 ? styles.positive : styles.negative}`}>
                {netChange >= 0 ? "+" : ""}
                {formatINR(netChange, true)}
              </div>
            </div>
          </div>

          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Monthly Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={entries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#EAE4D6" vertical={false} />
                <XAxis dataKey="label" stroke="#8E877A" fontSize={11} tickLine={false} axisLine={{ stroke: "#E2DCD0" }} />
                <YAxis
                  stroke="#8E877A"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatINR(v, true)}
                />
                <Tooltip formatter={(value: number) => formatINR(value)} />
                <Legend />
                <Bar dataKey="inflow" name="Inflow" fill="#1D3B8F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflow" name="Outflow" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="balance" name="Balance" stroke="#0F172A" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Inflow</th>
                  <th>Outflow</th>
                  <th>Net Flow</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td>{e.label}</td>
                    <td className={styles.positive}>+{formatINR(e.inflow)}</td>
                    <td>-{formatINR(e.outflow)}</td>
                    <td className={e.netFlow >= 0 ? styles.positive : styles.negative}>
                      {e.netFlow >= 0 ? "+" : ""}
                      {formatINR(e.netFlow)}
                    </td>
                    <td>{formatINR(e.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
