import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { items, commission, deliveryTime, address, creatorId } = await req.json();

    // Validation
    if (!Array.isArray(items) || commission === undefined || !deliveryTime || typeof address !== "object" || !creatorId) {
      return NextResponse.json({ success: false, message: "Missing or invalid fields" }, { status: 400 });
    }

    // Create listing
    const newListing = await prisma.listing.create({
      data: {
        items,                 // array of objects
        commission,
        deliveryTime,
        address,               // object
        creatorId: parseInt(creatorId),
      },
      include: {
        creator: true,         // fetch full creator details
      },
    });

    return NextResponse.json({ success: true, listing: newListing }, { status: 201 });
  } catch (err) {
    console.error("Failed to create listing:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
