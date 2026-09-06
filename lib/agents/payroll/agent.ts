/**
 * Payroll Agent - employee payroll questions, attendance/leave-based payroll
 * calculations, salary calculations, payroll summaries, and payslip
 * generation. calculatePayroll/generatePayslip are sensitive writes: this
 * agent always previews the deterministic result first and only executes
 * the write once explicitly confirmed (params.confirm === true).
 */

import type { Agent, AgentAnswer, ToolContext, ToolCallRecord } from "../types";
import { toolRegistry, ConfirmationRequiredError } from "../registry";
import { registerPayrollTools } from "./tools";
import { synthesizeAnswer } from "../synthesize";
import { logAgentActivity } from "@/lib/orchestrator/activityLog";
import { formatINR } from "@/lib/finance/formatting";
import { resolvePeriodFromText } from "@/lib/finance/period";

registerPayrollTools();

const SYSTEM_INSTRUCTIONS =
  "You are Finova's Payroll Agent. You answer questions about employees, attendance, leave, salary structures, and " +
  "payroll runs. Payroll figures are already computed deterministically from attendance and salary records - " +
  "explain and contextualize them, never recompute or adjust them yourself.";

const ALLOWED_TOOLS = [
  "getEmployees", "getEmployee", "getAttendance", "getLeave", "getSalaryStructure",
  "calculatePayroll", "getPayroll", "generatePayslip", "getPayrollHistory",
];

interface GatherResult {
  data: Record<string, unknown>;
  calls: ToolCallRecord[];
  needsConfirmation?: { tool: string; message: string };
  taskType: "PAYROLL_QUERY" | "PAYROLL_CALCULATION";
}

async function call(name: string, params: unknown, ctx: ToolContext, calls: ToolCallRecord[]) {
  const { result, record } = await toolRegistry.execute(name, params as any, ctx);
  calls.push(record);
  return result;
}

async function gatherContext(message: string, ctx: ToolContext, params: Record<string, unknown>): Promise<GatherResult> {
  const lower = message.toLowerCase();
  const calls: ToolCallRecord[] = [];
  const data: Record<string, unknown> = {};
  const period = (params?.period as string) || resolvePeriodFromText(message);
  const confirm = params?.confirm === true;

  const wantsCalculate = /calculat|run payroll|process payroll|finalize payroll/.test(lower);
  const wantsPayslip = /payslip/.test(lower);
  const wantsAttendance = /attendance/.test(lower);
  const wantsLeave = /\bleave\b/.test(lower);
  const wantsHistory = /history|past (payroll|run)/.test(lower);

  if (wantsCalculate) {
    const preview = (await call("previewPayrollCalculation", { period }, ctx, calls)) as any;
    data.period = period;
    data.preview = preview;

    if (!confirm) {
      return {
        data, calls, taskType: "PAYROLL_QUERY",
        needsConfirmation: {
          tool: "calculatePayroll",
          message:
            `This will calculate and finalize payroll for ${period}: ${preview.headcount} employee(s), ` +
            `total net pay ${formatINR(preview.totalNet)}` +
            (preview.skipped.length ? `, ${preview.skipped.length} employee(s) skipped (no salary structure on record)` : "") +
            `. Send confirm: true to proceed.`,
        },
      };
    }

    data.result = await call("calculatePayroll", { period, confirm: true }, ctx, calls);
    return { data, calls, taskType: "PAYROLL_CALCULATION" };
  }

  if (wantsPayslip) {
    const employeeId = params?.employeeId as string | undefined;
    if (!employeeId) {
      data.error = "employeeId is required to generate a payslip - please specify which employee.";
      return { data, calls, taskType: "PAYROLL_QUERY" };
    }

    if (confirm) {
      data.payslip = await call("generatePayslip", { employeeId, period, confirm: true }, ctx, calls);
      return { data, calls, taskType: "PAYROLL_CALCULATION" };
    }

    const preview = (await call("previewPayrollCalculation", { period }, ctx, calls)) as any;
    const line = preview.employees.find((e: any) => e.employeeId === employeeId);
    if (!line) {
      data.error = `No payroll line for employee ${employeeId} in ${period} (not active, or no salary structure).`;
      return { data, calls, taskType: "PAYROLL_QUERY" };
    }
    data.preview = line;
    return {
      data, calls, taskType: "PAYROLL_QUERY",
      needsConfirmation: {
        tool: "generatePayslip",
        message: `This will generate a payslip for ${line.name} (${period}): net pay ${formatINR(line.netPay)}. Send confirm: true to proceed.`,
      },
    };
  }

  if (wantsAttendance) {
    data.attendance = await call("getAttendance", { employeeId: params?.employeeId }, ctx, calls);
    return { data, calls, taskType: "PAYROLL_QUERY" };
  }

  if (wantsLeave) {
    data.leave = await call("getLeave", { employeeId: params?.employeeId }, ctx, calls);
    return { data, calls, taskType: "PAYROLL_QUERY" };
  }

  if (wantsHistory) {
    data.history = await call("getPayrollHistory", {}, ctx, calls);
    return { data, calls, taskType: "PAYROLL_QUERY" };
  }

  data.payroll = await call("getPayroll", { period }, ctx, calls);
  data.employees = await call("getEmployees", {}, ctx, calls);
  return { data, calls, taskType: "PAYROLL_QUERY" };
}

function fallbackAnswer(data: Record<string, unknown>): string {
  if (data.error) return String(data.error);

  const result = data.result as any;
  if (result) {
    return `Payroll for ${data.period} finalized: ${result.calculation.headcount} employee(s), total net pay ${formatINR(result.calculation.totalNet)}.`;
  }
  const payslip = data.payslip as any;
  if (payslip) {
    return `Payslip generated for ${payslip.period}: net pay ${formatINR(Number(payslip.netPay))}.`;
  }
  const payrollView = data.payroll as any;
  if (payrollView?.record) {
    return `Payroll for ${payrollView.record.period}: ${payrollView.record.headcount} employee(s), total ${formatINR(Number(payrollView.record.totalAmount))}, status ${payrollView.record.status}.`;
  }
  if (payrollView) {
    return `No finalized payroll run found for this period yet.`;
  }
  const attendance = data.attendance as any[] | undefined;
  if (attendance) return `${attendance.length} attendance record(s) found.`;
  const leave = data.leave as any[] | undefined;
  if (leave) return `${leave.length} leave record(s) found.`;
  const history = data.history as any[] | undefined;
  if (history) return `${history.length} past payroll run(s) on record.`;
  return "No matching payroll data was found for this query.";
}

export const payrollAgent: Agent = {
  name: "payroll",
  description: "Handles employee payroll, attendance/leave-based calculations, salary structures, and payslips.",
  systemInstructions: SYSTEM_INSTRUCTIONS,
  allowedTools: ALLOWED_TOOLS,

  async execute(message: string, ctx: ToolContext, params: Record<string, unknown> = {}): Promise<AgentAnswer> {
    let gathered: GatherResult;
    try {
      gathered = await gatherContext(message, ctx, params);
    } catch (error) {
      if (error instanceof ConfirmationRequiredError) {
        gathered = { data: {}, calls: [error.record], needsConfirmation: { tool: error.toolName, message: error.message }, taskType: "PAYROLL_QUERY" };
      } else {
        throw error;
      }
    }

    if (gathered.needsConfirmation) {
      await logAgentActivity({
        agentName: "payroll-agent",
        taskType: gathered.taskType,
        status: "NEEDS_APPROVAL",
        summary: gathered.needsConfirmation.message,
        input: { message, params },
        organizationId: ctx.companyId,
        mode: "RULE_ENGINE",
        confidenceScore: 1,
      });
      return {
        agent: "payroll",
        answer: gathered.needsConfirmation.message,
        data: gathered.data,
        toolCalls: gathered.calls,
        confidenceScore: 1,
        mode: "RULE_ENGINE",
        needsConfirmation: gathered.needsConfirmation,
      };
    }

    const synthesis = await synthesizeAnswer({
      systemInstructions: SYSTEM_INSTRUCTIONS,
      question: message,
      context: gathered.data,
      fallback: () => fallbackAnswer(gathered.data),
    });

    await logAgentActivity({
      agentName: "payroll-agent",
      taskType: gathered.taskType,
      status: "COMPLETED",
      summary: `Answered: "${message.slice(0, 120)}"`,
      input: { message, params },
      output: { answer: synthesis.answer, toolCalls: gathered.calls.map((c) => c.tool) },
      confidenceScore: synthesis.confidenceScore,
      mode: synthesis.mode,
      organizationId: ctx.companyId,
    });

    return {
      agent: "payroll",
      answer: synthesis.answer,
      data: gathered.data,
      toolCalls: gathered.calls,
      confidenceScore: synthesis.confidenceScore,
      mode: synthesis.mode,
    };
  },
};
