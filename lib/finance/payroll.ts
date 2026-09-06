/**
 * Deterministic payroll calculation. This is the one place gross/net pay
 * numbers are computed - the Payroll Agent's tools only call into this file
 * and report the result; the LLM never sees raw salary/attendance rows and
 * never does arithmetic on them (see AGENTS.md Phase 4).
 */

import prisma from "@/lib/db/prisma";
import { periodBounds, weekdaysInMonth } from "./period";

export interface EmployeePayrollLine {
  employeeId: string;
  employeeCode: string;
  name: string;
  baseSalary: number;
  allowances: number;
  grossMonthly: number;
  workingDays: number;
  daysPresent: number;
  daysOnLeave: number;
  daysAbsent: number;
  attendanceRatio: number;
  proratedGross: number;
  deductions: number;
  netPay: number;
  breakdown: { earnings: Record<string, number>; deductions: Record<string, number> };
}

export interface PayrollCalculationResult {
  period: string;
  workingDays: number;
  employees: EmployeePayrollLine[];
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  headcount: number;
  skipped: Array<{ employeeId: string; employeeCode: string; name: string; reason: string }>;
}

function sumJsonAmounts(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    const n = Number(v);
    if (Number.isFinite(n)) out[k] = n;
  }
  return out;
}

function sumValues(record: Record<string, number>): number {
  return Object.values(record).reduce((s, v) => s + v, 0);
}

/**
 * Computes (but does not persist) payroll for every active employee in a
 * period, prorated by attendance. Business rule: an employee is paid for
 * PRESENT + approved-leave days out of the month's weekdays; unexplained
 * absence reduces gross pay proportionally. This mirrors standard Indian
 * payroll practice (LOP - loss of pay for unapproved absence) without
 * modeling every statutory nuance.
 */
export async function calculatePayrollForPeriod(organizationId: string, period: string): Promise<PayrollCalculationResult> {
  const { start, end } = periodBounds(period);
  const [year, month] = period.split("-").map(Number);
  const workingDays = weekdaysInMonth(year, month).length;

  const employees = await prisma.employee.findMany({
    where: {
      organizationId,
      status: { not: "TERMINATED" },
      hireDate: { lte: end },
      OR: [{ terminationDate: null }, { terminationDate: { gte: start } }],
    },
    include: {
      salaryStructures: { where: { effectiveFrom: { lte: end } }, orderBy: { effectiveFrom: "desc" }, take: 1 },
      attendance: { where: { date: { gte: start, lte: end } } },
      leaves: { where: { status: "APPROVED", startDate: { lte: end }, endDate: { gte: start } } },
    },
    orderBy: { employeeCode: "asc" },
  });

  const lines: EmployeePayrollLine[] = [];
  const skipped: PayrollCalculationResult["skipped"] = [];

  for (const emp of employees) {
    const structure = emp.salaryStructures[0];
    if (!structure) {
      skipped.push({ employeeId: emp.id, employeeCode: emp.employeeCode, name: emp.name, reason: "No salary structure on record" });
      continue;
    }

    const daysPresent = emp.attendance.filter((a) => a.status === "PRESENT" || a.status === "HALF_DAY").length;
    const daysOnLeave = emp.attendance.filter((a) => a.status === "ON_LEAVE").length;
    const daysAbsent = Math.max(0, workingDays - daysPresent - daysOnLeave);

    const paidDays = daysPresent + daysOnLeave;
    const attendanceRatio = workingDays > 0 ? Math.min(1, paidDays / workingDays) : 1;

    const baseSalary = Number(structure.baseSalary);
    const allowances = sumJsonAmounts(structure.allowances);
    const allowancesTotal = sumValues(allowances);
    const grossMonthly = baseSalary + allowancesTotal;

    const proratedGross = Math.round(grossMonthly * attendanceRatio);
    const deductions = sumJsonAmounts(structure.deductions);
    const deductionsTotal = sumValues(deductions);
    const netPay = Math.round(proratedGross - deductionsTotal);

    lines.push({
      employeeId: emp.id,
      employeeCode: emp.employeeCode,
      name: emp.name,
      baseSalary,
      allowances: allowancesTotal,
      grossMonthly,
      workingDays,
      daysPresent,
      daysOnLeave,
      daysAbsent,
      attendanceRatio: Math.round(attendanceRatio * 1000) / 1000,
      proratedGross,
      deductions: deductionsTotal,
      netPay,
      breakdown: {
        earnings: { baseSalary: Math.round(baseSalary * attendanceRatio), ...allowances },
        deductions,
      },
    });
  }

  return {
    period,
    workingDays,
    employees: lines,
    totalGross: lines.reduce((s, l) => s + l.proratedGross, 0),
    totalDeductions: lines.reduce((s, l) => s + l.deductions, 0),
    totalNet: lines.reduce((s, l) => s + l.netPay, 0),
    headcount: lines.length,
    skipped,
  };
}

/** Upserts only the company-level PayrollRecord aggregate for a period. */
async function upsertPayrollRecord(organizationId: string, calculation: PayrollCalculationResult) {
  const { start, end } = periodBounds(calculation.period);
  return prisma.payrollRecord.upsert({
    where: { id: `payroll_${organizationId}_${calculation.period}` },
    create: {
      id: `payroll_${organizationId}_${calculation.period}`,
      organizationId,
      period: calculation.period,
      periodStart: start,
      periodEnd: end,
      totalAmount: calculation.totalNet,
      headcount: calculation.headcount,
      status: "PROCESSING",
      exceptions: calculation.skipped.length,
    },
    update: {
      totalAmount: calculation.totalNet,
      headcount: calculation.headcount,
      status: "PROCESSING",
      exceptions: calculation.skipped.length,
    },
  });
}

/** Upserts one Payslip per given line. Idempotent per (employeeId, period). */
async function upsertPayslips(organizationId: string, period: string, lines: EmployeePayrollLine[], payrollRecordId?: string) {
  return prisma.$transaction(
    lines.map((line) =>
      prisma.payslip.upsert({
        where: { employeeId_period: { employeeId: line.employeeId, period } },
        create: {
          organizationId,
          employeeId: line.employeeId,
          payrollRecordId,
          period,
          grossPay: line.proratedGross,
          totalDeductions: line.deductions,
          netPay: line.netPay,
          daysPresent: line.daysPresent,
          daysOnLeave: line.daysOnLeave,
          breakdown: line.breakdown,
          status: "GENERATED",
        },
        update: {
          ...(payrollRecordId ? { payrollRecordId } : {}),
          grossPay: line.proratedGross,
          totalDeductions: line.deductions,
          netPay: line.netPay,
          daysPresent: line.daysPresent,
          daysOnLeave: line.daysOnLeave,
          breakdown: line.breakdown,
        },
      })
    )
  );
}

/**
 * Persists a full company-wide calculated payroll run: the PayrollRecord
 * aggregate plus one Payslip per employee. Idempotent per (employeeId,
 * period) - safe to re-run without duplicating payslips.
 */
export async function persistPayrollRun(organizationId: string, calculation: PayrollCalculationResult) {
  const record = await upsertPayrollRecord(organizationId, calculation);
  const payslips = await upsertPayslips(organizationId, calculation.period, calculation.employees, record.id);
  return { record, payslips };
}

export async function getEmployees(organizationId: string, filters: { status?: string; department?: string } = {}) {
  return prisma.employee.findMany({
    where: { organizationId, ...(filters.status ? { status: filters.status as never } : {}), ...(filters.department ? { department: filters.department } : {}) },
    orderBy: { employeeCode: "asc" },
  });
}

export async function getEmployeeById(organizationId: string, employeeId: string) {
  return prisma.employee.findFirst({
    where: { id: employeeId, organizationId },
    include: { salaryStructures: { orderBy: { effectiveFrom: "desc" } } },
  });
}

export async function getAttendanceRecords(organizationId: string, filters: { employeeId?: string; from?: Date; to?: Date } = {}) {
  return prisma.attendance.findMany({
    where: {
      employee: { organizationId },
      ...(filters.employeeId ? { employeeId: filters.employeeId } : {}),
      ...(filters.from || filters.to
        ? { date: { ...(filters.from ? { gte: filters.from } : {}), ...(filters.to ? { lte: filters.to } : {}) } }
        : {}),
    },
    include: { employee: true },
    orderBy: { date: "desc" },
  });
}

export async function getLeaveRecords(organizationId: string, filters: { employeeId?: string; status?: string } = {}) {
  return prisma.leave.findMany({
    where: {
      employee: { organizationId },
      ...(filters.employeeId ? { employeeId: filters.employeeId } : {}),
      ...(filters.status ? { status: filters.status as never } : {}),
    },
    include: { employee: true },
    orderBy: { startDate: "desc" },
  });
}

export async function getCurrentSalaryStructure(organizationId: string, employeeId: string, asOf: Date = new Date()) {
  return prisma.salaryStructure.findFirst({
    where: { employeeId, employee: { organizationId }, effectiveFrom: { lte: asOf } },
    orderBy: { effectiveFrom: "desc" },
  });
}

export async function getPayrollByPeriod(organizationId: string, period: string) {
  const record = await prisma.payrollRecord.findFirst({ where: { organizationId, period } });
  const payslips = await prisma.payslip.findMany({ where: { organizationId, period }, include: { employee: true } });
  return { record, payslips };
}

export async function getPayrollHistory(organizationId: string, limit = 12) {
  return prisma.payrollRecord.findMany({ where: { organizationId }, orderBy: { period: "desc" }, take: limit });
}

/**
 * Calculates and persists a payslip for a single employee for a period -
 * used when a payslip is requested outside of a full company-wide payroll
 * run. Reuses calculatePayrollForPeriod's per-employee logic so the math is
 * identical either way. Deliberately does NOT touch the company-level
 * PayrollRecord aggregate (only persistPayrollRun/calculatePayroll owns
 * that) - it links to one if it already exists, but never creates or
 * overwrites it with a single employee's numbers.
 */
export async function generatePayslipForEmployee(organizationId: string, employeeId: string, period: string) {
  const full = await calculatePayrollForPeriod(organizationId, period);
  const line = full.employees.find((e) => e.employeeId === employeeId);
  if (!line) {
    const skippedReason = full.skipped.find((s) => s.employeeId === employeeId)?.reason;
    throw new Error(skippedReason ? `Cannot generate payslip: ${skippedReason}` : `Employee ${employeeId} not found or not active for period ${period}`);
  }

  const existingRecord = await prisma.payrollRecord.findFirst({ where: { organizationId, period } });
  const [payslip] = await upsertPayslips(organizationId, period, [line], existingRecord?.id);
  return payslip;
}
