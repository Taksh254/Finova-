import prisma from "@/lib/db/prisma";

export class UnauthorizedOrganizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedOrganizationError";
  }
}

/**
 * Finova is currently a single-tenant demo deployment - one seeded organization,
 * no login flow in the frontend. We still never trust a client-supplied
 * organizationId blindly: if one is provided it MUST resolve to a real organization,
 * otherwise the request is rejected rather than silently falling through to
 * someone else's data. This is the seam multi-tenant membership checks
 * (verify the requesting user belongs to this organization) would slot into once
 * real auth exists.
 */
export async function resolveScopedOrganizationId(requestedOrganizationId?: string | null): Promise<string> {
  if (requestedOrganizationId) {
    const organization = await prisma.organization.findUnique({ where: { id: requestedOrganizationId } });
    if (!organization) throw new UnauthorizedOrganizationError(`Unknown or inaccessible organization: ${requestedOrganizationId}`);
    return organization.id;
  }
  const organization = await prisma.organization.findFirst();
  if (!organization) throw new UnauthorizedOrganizationError("No organization is configured for this workspace");
  return organization.id;
}
