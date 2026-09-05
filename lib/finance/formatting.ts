/**
 * Indian currency & number formatting utilities for FINOVA
 */

export function formatINR(amount: number, compact: boolean = false): string {
  if (isNaN(amount)) return "₹0";

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  if (compact) {
    if (absAmount >= 10000000) {
      const cr = absAmount / 10000000;
      return `${isNegative ? "-" : ""}₹${cr.toFixed(2).replace(/\.00$/, "")} Cr`;
    }
    if (absAmount >= 100000) {
      const lk = absAmount / 100000;
      return `${isNegative ? "-" : ""}₹${lk.toFixed(2).replace(/\.00$/, "")}L`;
    }
    if (absAmount >= 1000) {
      const k = absAmount / 1000;
      return `${isNegative ? "-" : ""}₹${k.toFixed(1).replace(/\.0$/, "")}k`;
    }
    return `${isNegative ? "-" : ""}₹${absAmount.toLocaleString("en-IN")}`;
  }

  // Standard Indian comma format
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(absAmount);

  return `${isNegative ? "-" : ""}₹${formatted}`;
}

export function formatPercentage(pct: number, includeSign: boolean = true): string {
  const sign = includeSign && pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}
