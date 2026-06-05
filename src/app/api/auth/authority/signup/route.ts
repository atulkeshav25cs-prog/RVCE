import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Authority from "@/models/Authority";
import { hashPassword, encrypt } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { fullName, email, phone, department, authorityId, inviteCode, password } = data;

    if (!fullName || !email || !password || !inviteCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check invite code
    const configuredInviteCode = process.env.NEXT_PUBLIC_AUTHORITY_INVITE_CODE ?? "AEDFFD";
    if (inviteCode !== configuredInviteCode) {
      return NextResponse.json({ error: "Invalid invite code. Contact the system administrator or verify the code configured in .env.local." }, { status: 403 });
    }

    await dbConnect();

    // Check if user exists
    const existing = await Authority.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const role = "authority";

    const user = await Authority.create({
      fullName, email, passwordHash, department, authorityId, role
    });

    const id = user._id.toString();

    // Create session
    const token = await encrypt({ id, role, email });
    const response = NextResponse.json({ success: true, redirect: "/authority/dashboard" });
    
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 2, // 2 hours
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
