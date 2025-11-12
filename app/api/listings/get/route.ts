import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        // Only include listings with NO orders
        orders: {
          none: {}, // ✅ ensures no related orders exist
        },
      },
      orderBy: { createdAt: "desc" },
      include: { creator: true }, // still fetch creator info
    });

    return NextResponse.json({ success: true, listings }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
