// app/api/listings/mine/route.ts (example)
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ success: false, message: "Not logged in" }), { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);

  const listings = await prisma.listing.findMany({
    where: { creatorId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        take: 1, // Only need first accepted order
        include: {
          user: true, // Include user details who accepted
        },
      },
    },
  });

  return new Response(JSON.stringify({ success: true, listings }), { status: 200 });
}
