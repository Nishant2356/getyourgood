import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, bio, avatar } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        bio,
        avatar,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
