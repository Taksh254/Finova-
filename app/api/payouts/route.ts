import { NextResponse } from "next/server";
import { getPayoutService } from "@/lib/finance/payoutService";

export async function GET() {
  try {
    const service = getPayoutService();
    const [summary, payouts] = await Promise.all([
      service.getSummary(),
      service.getPayoutsList(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        summary,
        payouts,
      },
    });
  } catch (error) {
    console.error("Failed to fetch payouts list:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve payouts" },
      { status: 500 }
    );
  }
}
