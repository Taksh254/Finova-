import { NextResponse } from "next/server";
import { getPayoutService } from "@/lib/finance/payoutService";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const scenario = body.scenario as "FULL" | "PARTIAL" | "NONE" | undefined;

    const payoutService = getPayoutService();
    const result = await payoutService.investigatePayout(id, { scenario });

    if (!result) {
      return NextResponse.json(
        { success: false, error: `Payout ${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        investigation: result.investigation,
        payout: result.payout,
      },
      message: `Investigation completed. Conclusion: ${result.investigation.conclusion}.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Investigation failed to execute.",
      },
      { status: 500 }
    );
  }
}
