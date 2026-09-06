"use client";

import React from "react";
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

export interface CashFlowInsight {
  title: string;
  description: string;
}

interface CashFlowChartProps {
  data: CashFlowDataPoint[];
  insight?: CashFlowInsight | null;
  onAskCFO?: () => void;
}

export function CashFlowChart({ data, insight, onAskCFO }: CashFlowChartProps) {
  // Real seeded data is monthly (CashFlowEntry), so there's no sub-month
  // resolution to select between - every period shows the same real series
  // rather than faking a daily/weekly breakdown we don't have.
  const activeSeries = data.map((d) => ({
    label: d.label,
    date: d.label,
    revenue: Math.round((d.inflow / 100000) * 100) / 100,
    expenses: Math.round((d.outflow / 100000) * 100) / 100,
    netCash: Math.round((d.netFlow / 100000) * 100) / 100,
  }));
  const maxValue = Math.max(10, ...activeSeries.map((d) => Math.max(d.revenue, d.expenses)));
  const yDomainMax = Math.ceil((maxValue * 1.15) / 10) * 10;

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
            <p className={styles.subtitle}>Revenue, expenses and net cash flow by month.</p>
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
                domain={[0, yDomainMax]}
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

        {insight ? (
          <>
            <h4 className={styles.insightTitle}>{insight.title}</h4>
            <p className={styles.insightDesc}>{insight.description}</p>
          </>
        ) : (
          <>
            <h4 className={styles.insightTitle}>No AI insights yet.</h4>
            <p className={styles.insightDesc}>
              Run the Agent Orchestrator sync to have Finova&apos;s specialist agents scan your ledger for anomalies and risks.
            </p>
          </>
        )}

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
