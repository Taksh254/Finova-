"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Sparkles, ArrowRight } from "lucide-react";
import styles from "./CashFlowChart.module.css";

export interface CashFlowDataPoint {
  id: string;
  period: string;
  label: string;
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  balance: number;
}

interface CashFlowChartProps {
  data: CashFlowDataPoint[];
  onAskCFO?: () => void;
}

// 30-day realistic trajectory matching the reference curve
const thirtyDaySeries = [
  { label: "Sep 1", date: "Sep 1, 2026", revenue: 18.2, expenses: 6.4, netCash: 11.8 },
  { label: "Sep 5", date: "Sep 5, 2026", revenue: 19.8, expenses: 7.1, netCash: 12.7 },
  { label: "Sep 10", date: "Sep 10, 2026", revenue: 23.4, expenses: 6.9, netCash: 16.5 },
  { label: "Sep 15", date: "Sep 15, 2026", revenue: 21.0, expenses: 7.8, netCash: 13.2 },
  { label: "Sep 16", date: "Sep 16, 2026", revenue: 28.4, expenses: 7.2, netCash: 21.2 },
  { label: "Sep 20", date: "Sep 20, 2026", revenue: 24.1, expenses: 8.4, netCash: 15.7 },
  { label: "Sep 25", date: "Sep 25, 2026", revenue: 29.5, expenses: 8.9, netCash: 20.6 },
  { label: "Sep 30", date: "Sep 30, 2026", revenue: 34.2, expenses: 9.6, netCash: 24.6 },
];

const sevenDaySeries = [
  { label: "Mon", date: "Sep 24, 2026", revenue: 4.8, expenses: 1.2, netCash: 3.6 },
  { label: "Tue", date: "Sep 25, 2026", revenue: 5.2, expenses: 1.5, netCash: 3.7 },
  { label: "Wed", date: "Sep 26, 2026", revenue: 6.1, expenses: 2.1, netCash: 4.0 },
  { label: "Thu", date: "Sep 27, 2026", revenue: 5.8, expenses: 1.4, netCash: 4.4 },
  { label: "Fri", date: "Sep 28, 2026", revenue: 7.4, expenses: 2.6, netCash: 4.8 },
  { label: "Sat", date: "Sep 29, 2026", revenue: 3.1, expenses: 0.8, netCash: 2.3 },
  { label: "Sun", date: "Sep 30, 2026", revenue: 4.5, expenses: 0.9, netCash: 3.6 },
];

export function CashFlowChart({ data, onAskCFO }: CashFlowChartProps) {
  const [timeframe, setTimeframe] = useState<"7D" | "30D" | "3M" | "6M" | "1Y">("30D");

  // Determine active chart series
  const activeSeries = timeframe === "7D" ? sevenDaySeries : thirtyDaySeries;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className={styles.tooltipCard}>
          <span className={styles.tooltipDate}>{item.date || label}</span>
          <div className={styles.tooltipDivider} />
          <div className={styles.tooltipRow}>
            <span className={styles.revDot} />
            <span className={styles.tooltipLabel}>Revenue:</span>
            <span className={styles.tooltipValue}>₹{item.revenue}L</span>
          </div>
          <div className={styles.tooltipRow}>
            <span className={styles.expDot} />
            <span className={styles.tooltipLabel}>Expenses:</span>
            <span className={styles.tooltipValue}>₹{item.expenses}L</span>
          </div>
          <div className={styles.tooltipRow}>
            <span className={styles.netDot} />
            <span className={styles.tooltipLabel}>Net Cash Flow:</span>
            <span className={styles.tooltipValueHighlight}>₹{item.netCash}L</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.cardContainer}>
      {/* Main Chart Column (approx 70%) */}
      <div className={styles.chartColumn}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>Cash Flow</h2>
            <p className={styles.subtitle}>Revenue, expenses and net cash flow over time.</p>
          </div>

          <div className={styles.timeframePills}>
            {(["7D", "30D", "3M", "6M", "1Y"] as const).map((t) => (
              <button
                key={t}
                className={`${styles.pillBtn} ${timeframe === t ? styles.pillBtnActive : ""}`}
                onClick={() => setTimeframe(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legendRow}>
          <div className={styles.legendItem}>
            <span className={styles.legendLineBlue} />
            <span>Revenue</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendLineLightBlue} />
            <span>Expenses</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendLineDashed} />
            <span>Net Cash Flow</span>
          </div>
        </div>

        {/* Area Chart with SVG Curves */}
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={activeSeries} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="finovaRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1D3B8F" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#1D3B8F" stopOpacity="0.01" />
                </linearGradient>
                <linearGradient id="finovaExpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.01" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#EAE4D6" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#8E877A"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#E2DCD0" }}
                dy={8}
              />
              <YAxis
                stroke="#8E877A"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}L`}
                domain={[0, 40]}
                ticks={[10, 20, 30, 40]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#1D3B8F"
                strokeWidth={2.5}
                fill="url(#finovaRevGrad)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#60A5FA"
                strokeWidth={2}
                fill="url(#finovaExpGrad)"
              />
              <Line
                type="monotone"
                dataKey="netCash"
                name="Net Cash Flow"
                stroke="#1D3B8F"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: "#1D3B8F" }}
                activeDot={{ r: 6, fill: "#1D3B8F", stroke: "#FFFFFF", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Embedded AI Insight Panel (approx 30%) */}
      <div className={styles.aiInsightColumn}>
        <div className={styles.insightBadge}>
          <Sparkles size={13} className={styles.sparkleIcon} />
          <span>AI Insight</span>
        </div>

        <h4 className={styles.insightTitle}>
          Cash position is trending <strong className={styles.highlight}>14% higher</strong> than your previous quarter.
        </h4>
        <p className={styles.insightDesc}>
          Collections are the primary driver. Enterprise accounts receivable turnover accelerated by 6.4 days.
        </p>

        <button
          className={styles.askCFOButton}
          onClick={onAskCFO}
          title="Consult Finova AI CFO"
        >
          <span>Ask AI CFO</span>
          <ArrowRight size={14} />
        </button>

        {/* Decorative Wave Motif */}
        <div className={styles.waveDecoration}>
          <svg viewBox="0 0 200 80" preserveAspectRatio="none" className={styles.waveSvg}>
            <path
              d="M0,40 C50,10 100,70 150,30 C180,10 200,45 200,45 L200,80 L0,80 Z"
              fill="rgba(29, 59, 143, 0.05)"
            />
            <path
              d="M0,55 C40,35 110,65 160,40 C185,25 200,55 200,55 L200,80 L0,80 Z"
              fill="rgba(29, 59, 143, 0.08)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
