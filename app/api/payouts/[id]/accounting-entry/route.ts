import { NextResponse } from "next/server";
import { getPayoutService } from "@/lib/finance/payoutService";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const user = body.user || "Taksh (Finance Controller)";

    const service = getPayoutService();
    const updatedPayout = await service.createAccountingEntry(id, user);

    if (!updatedPayout) {
      return NextResponse.json(
        { success: false, error: "Payout not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPayout,
      message: `Accounting entry ${updatedPayout.accountingEntry.entryNumber} created successfully.`,
    });
  } catch (error: any) {
    console.error("Failed to create accounting entry:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create accounting entry" },
      { status: 400 }
    );
  }
}
