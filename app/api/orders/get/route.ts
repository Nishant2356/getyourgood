import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ success: false, message: "Not logged in" }),
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id, 10);

    const orders = await prisma.order.findMany({
      where: {
        acceptedById: userId,
      },
      include: {
        user: true, // 👈 include the creator of the order
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    

    return new Response(JSON.stringify({ success: true, orders }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}

