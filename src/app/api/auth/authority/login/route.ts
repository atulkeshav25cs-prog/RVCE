import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyPassword, encrypt } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, password } = data;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = db.prepare("SELECT * FROM users WHERE email = ? AND role = 'authority'").get(email) as any;
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create session
    const token = await encrypt({ id: user.id, role: user.role, email: user.email });
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
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
