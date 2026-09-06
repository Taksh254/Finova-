"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Users } from "lucide-react";
import { formatINR, formatDate } from "@/lib/finance/formatting";
import styles from "./PayrollPage.module.css";

interface PayrollRecord {
  id: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  totalAmount: number;
  headcount: number;
  status: string;
  exceptions: number;
}

interface EmployeeRow {
  id: string;
  employeeCode: string;
  name: string;
  department: string | null;
  designation: string | null;
  status: string;
  hireDate: string;
  currentBaseSalary: number | null;
}

export default function PayrollPage() {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayroll = useCallback(async () => {
    try {
      const res = await fetch("/api/payroll");
      const json = await res.json();
      if (json.success) {
        setPayrollRecords(json.data.payrollRecords);
        setEmployees(json.data.employees);
      }
    } catch (error) {
      console.error("Failed to load payroll data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconBox}>
          <Users size={20} />
        </div>
        <div>
          <h2 className={styles.title}>Payroll</h2>
          <p className={styles.subtitle}>Monthly payroll runs and the employee roster.</p>
        </div>
      </div>

      <span className={styles.sectionTitle}>Payroll Run History</span>
      {loading ? (
        <div className={styles.emptyState}>Loading payroll runs...</div>
      ) : payrollRecords.length === 0 ? (
        <div className={styles.emptyState}>No payroll runs recorded yet.</div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Period</th>
                <th>Period Start</th>
                <th>Period End</th>
                <th>Headcount</th>
                <th>Exceptions</th>
                <th>Status</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {payrollRecords.map((r) => (
                <tr key={r.id}>
                  <td>{r.period}</td>
                  <td>{formatDate(r.periodStart)}</td>
                  <td>{formatDate(r.periodEnd)}</td>
                  <td>{r.headcount}</td>
                  <td>
                    <span className={`${styles.exceptionCount} ${r.exceptions > 0 ? styles.exceptionCountNonzero : ""}`}>
                      {r.exceptions}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.statusTag} ${
                        r.status === "PAID" ? styles.statusPaid : styles.statusPending
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className={styles.amount}>{formatINR(r.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <span className={styles.sectionTitle}>Employee Roster</span>
      {loading ? (
        <div className={styles.emptyState}>Loading employees...</div>
      ) : employees.length === 0 ? (
        <div className={styles.emptyState}>No employees on record.</div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee Code</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Hire Date</th>
                <th>Status</th>
                <th>Current Base Salary</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id}>
                  <td>{e.employeeCode}</td>
                  <td>{e.name}</td>
                  <td>{e.department ?? "—"}</td>
                  <td>{e.designation ?? "—"}</td>
                  <td>{formatDate(e.hireDate)}</td>
                  <td>
                    <span
                      className={`${styles.statusTag} ${
                        e.status === "ACTIVE" ? styles.statusActive : styles.statusInactive
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td className={styles.amount}>
                    {e.currentBaseSalary != null ? formatINR(e.currentBaseSalary) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
