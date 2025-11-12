import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = parseInt(searchParams.get("userId") || "0");
  if (!userId) return NextResponse.json({ error: "Invalid user" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { addresses: true },
  });

  return NextResponse.json({ addresses: user?.addresses || [] });
}

export async function POST(req: Request) {
  const { userId, addresses } = await req.json();
  if (!userId || !Array.isArray(addresses))
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { addresses },
  });

  return NextResponse.json({ success: true, addresses: updated.addresses });
}
