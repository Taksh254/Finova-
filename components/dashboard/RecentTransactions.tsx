"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./RecentTransactions.module.css";

interface TransactionItem {
  id: string;
  date: string;
  description: string;
  iconBg: string;
  iconLetter: string;
  category: string;
  account: string;
  status: "Completed" | "Received" | "Pending";
  amount: number;
  isCredit: boolean;
}

const defaultTransactions: TransactionItem[] = [
  {
    id: "tx-1",
    date: "Sep 05",
    description: "AWS Cloud Services",
    iconBg: "#FF9900",
    iconLetter: "A",
    category: "Infrastructure",
    account: "HDFC Business",
    status: "Completed",
    amount: 42800,
    isCredit: false,
  },
  {
    id: "tx-2",
    date: "Sep 04",
    description: "Google Workspace",
    iconBg: "#4285F4",
    iconLetter: "G",
    category: "Software",
    account: "ICICI Current",
    status: "Completed",
    amount: 10400,
    isCredit: false,
  },
  {
    id: "tx-3",
    date: "Sep 03",
    description: "Client Payment — Acme Corp",
    iconBg: "#1D3B8F",
    iconLetter: "A",
    category: "Revenue",
    account: "HDFC Business",
    status: "Received",
    amount: 240000,
    isCredit: true,
  },
  {
    id: "tx-4",
    date: "Sep 02",
    description: "Razorpay Fees",
    iconBg: "#0C2340",
    iconLetter: "R",
    category: "Payments",
    account: "HDFC Business",
    status: "Completed",
    amount: 2480,
    isCredit: false,
  },
  {
    id: "tx-5",
    date: "Sep 01",
    description: "Office Rent — DLF CyberCity",
    iconBg: "#64748B",
    iconLetter: "O",
    category: "Admin",
    account: "ICICI Current",
    status: "Completed",
    amount: 60000,
    isCredit: false,
  },
];

export function RecentTransactions() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Transactions</h3>
        <Link href="/transactions" className={styles.viewAllLink}>
          <span>View all</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Description</th>
              <th className={styles.th}>Category</th>
              <th className={styles.th}>Account</th>
              <th className={styles.th}>Status</th>
              <th className={`${styles.th} ${styles.thAmount}`}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {defaultTransactions.map((tx) => (
              <tr key={tx.id} className={styles.tr}>
                <td className={styles.tdDate}>{tx.date}</td>
                <td className={styles.tdDesc}>
                  <div className={styles.descCell}>
                    <div
                      className={styles.vendorIcon}
                      style={{ backgroundColor: tx.iconBg }}
                    >
                      {tx.iconLetter}
                    </div>
                    <span className={styles.descText}>{tx.description}</span>
                  </div>
                </td>
                <td className={styles.tdCategory}>{tx.category}</td>
                <td className={styles.tdAccount}>{tx.account}</td>
                <td className={styles.tdStatus}>
                  <span
                    className={`${styles.statusPill} ${
                      tx.status === "Received"
                        ? styles.statusReceived
                        : styles.statusCompleted
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className={`${styles.tdAmount} tabular-nums`}>
                  <span
                    className={tx.isCredit ? styles.amountCredit : styles.amountDebit}
                  >
                    {tx.isCredit ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
