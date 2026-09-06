import { NextResponse } from "next/server";
import { UnauthorizedOrganizationError } from "@/lib/auth/companyScope";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(code: string, message: string, status = 400) {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}

/**
 * Standard error mapper for route handlers - keeps every endpoint's catch
 * block down to one line while still returning the right HTTP status for
 * validation vs. authorization vs. unexpected failures.
 */
export function handleApiError(error: unknown, fallbackCode: string, fallbackMessage: string) {
  if (error instanceof UnauthorizedOrganizationError) {
    return fail("UNAUTHORIZED_ORGANIZATION", error.message, 403);
  }
  if (error instanceof ValidationError) {
    return fail(error.code, error.message, 400);
  }
  console.error(`${fallbackCode}:`, error);
  return fail(fallbackCode, fallbackMessage, 500);
}

export class ValidationError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "ValidationError";
  }
}
