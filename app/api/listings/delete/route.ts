import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ success: false, message: "Not logged in" }), { status: 401 });
    }

    const body = await req.json();
    const { listingId } = body;

    if (!listingId) {
      return new Response(JSON.stringify({ success: false, message: "Missing listing ID" }), { status: 400 });
    }

    // ✅ Check if listing exists and belongs to the user
    const listing = await prisma.listing.findFirst({
      where: {
        id: Number(listingId),
        creatorId: Number(session.user.id),
      },
      include: {
        orders: true, // include orders to check
      },
    });

    if (!listing) {
      return new Response(JSON.stringify({ success: false, message: "Listing not found or not authorized" }), { status: 404 });
    }

    // ✅ Check if listing has any accepted or ongoing orders
    const hasTakenOrder = listing.orders.some(
      (order) => order.status === "accepted" || order.status === "in-progress"
    );

    if (hasTakenOrder) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Cannot delete — someone has already taken the order for this listing.",
        }),
        { status: 400 }
      );
    }

    // ✅ Delete the listing safely
    await prisma.listing.delete({
      where: { id: Number(listingId) },
    });

    return new Response(JSON.stringify({ success: true, message: "Listing deleted successfully." }), { status: 200 });
  } catch (err) {
    console.error("Error deleting listing:", err);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}
