import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ success: false, message: "Not logged in" }),
        { status: 401 }
      );
    }

    const body = await req.json();
    const { listingId, items, commission, total, deliveryTime, address, userId } = body;

    // Validate fields
    if (
      listingId === undefined ||
      !items ||
      commission === undefined ||
      total === undefined ||
      !deliveryTime ||
      userId === undefined
    ) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        listingId: Number(listingId),         // ✅ must be number
        items,                               // JSON
        commission: Number(commission),       // Float
        total: Number(total),                 // Float
        deliveryTime: String(deliveryTime),
        address: address || {},
        acceptedById: Number(session.user.id), // Delivery agent
        userId: Number(userId),               // Listing creator
      },
    });

    return new Response(JSON.stringify({ success: true, order }), { status: 200 });
  } catch (err) {
    console.error("Error creating order:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
