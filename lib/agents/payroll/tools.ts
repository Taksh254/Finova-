/**
 * Payroll Agent tools. Reads are thin wrappers over lib/finance/payroll.ts;
 * the two write tools (calculatePayroll, generatePayslip) perform an actual
 * financial mutation, so both require confirmation and write an AuditLog
 * entry (AGENTS.md Phase 6).
 */

import { toolRegistry } from "../registry";
import type { ToolContext } from "../types";
import * as payroll from "@/lib/finance/payroll";
import { logAudit } from "@/lib/orchestrator/activityLog";

export function registerPayrollTools(): void {
  toolRegistry.register({
    name: "getEmployees",
    agent: "payroll",
    description: "List employees, optionally filtered by status/department.",
    isWrite: false,
    handler: (params: { status?: string; department?: string }, ctx: ToolContext) => payroll.getEmployees(ctx.companyId, params ?? {}),
  });

  toolRegistry.register({
    name: "getEmployee",
    agent: "payroll",
    description: "Look up a single employee (with salary structure history) by id.",
    isWrite: false,
    handler: (params: { employeeId: string }, ctx: ToolContext) => payroll.getEmployeeById(ctx.companyId, params.employeeId),
  });

  toolRegistry.register({
    name: "getAttendance",
    agent: "payroll",
    description: "Attendance records, optionally filtered by employee and date range.",
    isWrite: false,
    handler: (params: { employeeId?: string; from?: string; to?: string }, ctx: ToolContext) =>
      payroll.getAttendanceRecords(ctx.companyId, {
        employeeId: params?.employeeId,
        from: params?.from ? new Date(params.from) : undefined,
        to: params?.to ? new Date(params.to) : undefined,
      }),
  });

  toolRegistry.register({
    name: "getLeave",
    agent: "payroll",
    description: "Leave records, optionally filtered by employee and status.",
    isWrite: false,
    handler: (params: { employeeId?: string; status?: string }, ctx: ToolContext) => payroll.getLeaveRecords(ctx.companyId, params ?? {}),
  });

  toolRegistry.register({
    name: "getSalaryStructure",
    agent: "payroll",
    description: "The active salary structure for an employee.",
    isWrite: false,
    handler: (params: { employeeId: string; asOf?: string }, ctx: ToolContext) =>
      payroll.getCurrentSalaryStructure(ctx.companyId, params.employeeId, params?.asOf ? new Date(params.asOf) : undefined),
  });

  toolRegistry.register({
    name: "previewPayrollCalculation",
    agent: "payroll",
    description: "Computes (without persisting) what a payroll run for a period would produce.",
    isWrite: false,
    handler: (params: { period: string }, ctx: ToolContext) => payroll.calculatePayrollForPeriod(ctx.companyId, params.period),
  });

  toolRegistry.register({
    name: "calculatePayroll",
    agent: "payroll",
    description: "Calculates and finalizes a full company-wide payroll run for a period. Sensitive write - requires confirm: true.",
    isWrite: true,
    requiresConfirmation: true,
    minRole: "ADMIN",
    handler: async (params: { period: string }, ctx: ToolContext) => {
      const calculation = await payroll.calculatePayrollForPeriod(ctx.companyId, params.period);
      const { record, payslips } = await payroll.persistPayrollRun(ctx.companyId, calculation);
      await logAudit({
        organizationId: ctx.companyId,
        userId: ctx.userId,
        action: "PAYROLL_CALCULATED",
        entityType: "PayrollRecord",
        entityId: record.id,
        metadata: { period: params.period, headcount: calculation.headcount, totalNet: calculation.totalNet, skipped: calculation.skipped },
      });
      return { calculation, record, payslipCount: payslips.length };
    },
  });

  toolRegistry.register({
    name: "getPayroll",
    agent: "payroll",
    description: "The finalized payroll record and payslips for a period, if one has been run.",
    isWrite: false,
    handler: (params: { period: string }, ctx: ToolContext) => payroll.getPayrollByPeriod(ctx.companyId, params.period),
  });

  toolRegistry.register({
    name: "generatePayslip",
    agent: "payroll",
    description: "Generates (or regenerates) one employee's payslip for a period. Sensitive write - requires confirm: true.",
    isWrite: true,
    requiresConfirmation: true,
    minRole: "ADMIN",
    handler: async (params: { employeeId: string; period: string }, ctx: ToolContext) => {
      const payslip = await payroll.generatePayslipForEmployee(ctx.companyId, params.employeeId, params.period);
      await logAudit({
        organizationId: ctx.companyId,
        userId: ctx.userId,
        action: "PAYSLIP_GENERATED",
        entityType: "Payslip",
        entityId: payslip.id,
        metadata: { employeeId: params.employeeId, period: params.period, netPay: Number(payslip.netPay) },
      });
      return payslip;
    },
  });

  toolRegistry.register({
    name: "getPayrollHistory",
    agent: "payroll",
    description: "Recent payroll runs for the company, most recent first.",
    isWrite: false,
    handler: (params: { limit?: number }, ctx: ToolContext) => payroll.getPayrollHistory(ctx.companyId, params?.limit),
  });
}
