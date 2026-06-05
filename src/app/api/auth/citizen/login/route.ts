import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Citizen from "@/models/Citizen";
import { verifyPassword, encrypt } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, password } = data;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    await dbConnect();

    const user = await Citizen.findOne({ email, role: 'citizen' });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create session
    const token = await encrypt({ id: user._id.toString(), role: user.role, email: user.email });
    const response = NextResponse.json({ success: true, redirect: "/citizen/dashboard" });
    
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
