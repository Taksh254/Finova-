"use client";

import React, { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import styles from "./Toast.module.css";

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={styles.toast}>
      <CheckCircle2 size={16} className={styles.icon} />
      <span className={styles.message}>{message}</span>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Dismiss toast">
        <X size={14} />
      </button>
    </div>
  );
}
