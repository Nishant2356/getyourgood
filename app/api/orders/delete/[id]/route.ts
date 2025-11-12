import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ success: false, message: "Not logged in" }),
        { status: 401 }
      );
    }

    const orderId = parseInt(params.id, 10);

    // Make sure the user owns this order
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.acceptedById !== parseInt(session.user.id, 10)) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 403 }
      );
    }

    await prisma.order.delete({ where: { id: orderId } });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}
