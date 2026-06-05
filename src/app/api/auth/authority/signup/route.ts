import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hashPassword, encrypt } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { fullName, email, phone, department, authorityId, inviteCode, password } = data;

    if (!fullName || !email || !password || !inviteCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check invite code
    if (inviteCode !== process.env.NEXT_PUBLIC_AUTHORITY_INVITE_CODE) {
      return NextResponse.json({ error: "Invalid official invite code" }, { status: 403 });
    }

    // Check if user exists
    const existing = db.prepare("SELECT email FROM users WHERE email = ?").get(email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const id = "auth_" + Date.now() + Math.random().toString(36).substring(2, 9);
    const role = "authority";

    const stmt = db.prepare(`
      INSERT INTO users (id, role, email, password_hash, full_name, phone, department, authority_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, role, email, passwordHash, fullName, phone, department, authorityId);

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
