import prisma from "@/lib/db/prisma";
import { resolveScopedOrganizationId } from "@/lib/auth/companyScope";
import { ok, handleApiError } from "@/lib/api/http";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = await resolveScopedOrganizationId(searchParams.get("organizationId"));

    const [payrollRecords, employees] = await Promise.all([
      prisma.payrollRecord.findMany({
        where: { organizationId: orgId },
        orderBy: { periodStart: "desc" },
      }),
      prisma.employee.findMany({
        where: { organizationId: orgId },
        include: {
          salaryStructures: {
            orderBy: { effectiveFrom: "desc" },
            take: 1,
          },
        },
        orderBy: { name: "asc" },
      }),
    ]);

    const employeeRoster = employees.map((e) => ({
      id: e.id,
      employeeCode: e.employeeCode,
      name: e.name,
      department: e.department,
      designation: e.designation,
      status: e.status,
      hireDate: e.hireDate,
      currentBaseSalary: e.salaryStructures[0]?.baseSalary ?? null,
    }));

    return ok({ payrollRecords, employees: employeeRoster });
  } catch (error) {
    return handleApiError(error, "PAYROLL_FETCH_FAILED", "Failed to fetch payroll data");
  }
}
