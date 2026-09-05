import React from "react";
import {
  FileText,
  CheckCircle,
  AlertOctagon,
  ArrowDownLeft,
  TrendingUp,
} from "lucide-react";
import { ActivityEvent } from "@/lib/finance/metrics";
import { formatRelativeTime } from "@/lib/finance/formatting";
import styles from "./RecentActivity.module.css";

interface RecentActivityProps {
  events: ActivityEvent[];
}

export function RecentActivity({ events }: RecentActivityProps) {
  const getEventIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "INVOICE":
        return <FileText size={14} color="#60a5fa" />;
      case "TRANSACTION":
        return <CheckCircle size={14} color="#34d399" />;
      case "EXCEPTION":
        return <AlertOctagon size={14} color="#f43f5e" />;
      case "TREASURY":
        return <TrendingUp size={14} color="#a78bfa" />;
      default:
        return <ArrowDownLeft size={14} color="#94a3b8" />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <span className={styles.statusDot} />
          <h3 className={styles.title}>RECENT FINANCIAL ACTIVITY</h3>
        </div>
      </div>

      <div className={styles.list}>
        {events.map((event) => (
          <div key={event.id} className={styles.item}>
            <div className={styles.iconCol}>{getEventIcon(event.type)}</div>
            <div className={styles.contentCol}>
              <div className={styles.topRow}>
                <span className={styles.eventTitle}>{event.title}</span>
                <span className={styles.timestamp}>{formatRelativeTime(event.timestamp)}</span>
              </div>
              <p className={styles.eventDescription}>{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
