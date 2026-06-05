import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Citizen from "@/models/Citizen";
import { hashPassword, encrypt } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { fullName, email, phone, gender, age, bloodGroup, password } = data;

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // Check if user exists
    const existing = await Citizen.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const role = "citizen";

    const user = await Citizen.create({
      fullName, email, passwordHash, phone, gender, age, bloodGroup, role
    });

    const id = user._id.toString();

    // Create session
    const token = await encrypt({ id, role, email });
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
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
