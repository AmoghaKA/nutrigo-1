// app/api/auth/signup/route.ts
import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function makeUserIdFromEmail(email: string) {
  return "user_" + crypto.createHash("sha256").update(email).digest("hex").slice(0, 12);
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: "All fields required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const id = makeUserIdFromEmail(email);

    // Mock user creation - in production, save to database
    return NextResponse.json({
      success: true,
      data: {
        id,
        name,
        email,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
