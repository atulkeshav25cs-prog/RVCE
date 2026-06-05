import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

// Fallback secret for local development
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_super_secret_key_for_dev_only_123!"
);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(SECRET_KEY);
}

export async function decrypt(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession(request?: NextRequest) {
  const token = request 
    ? request.cookies.get("auth_token")?.value 
    : (await cookies()).get("auth_token")?.value;
    
  if (!token) return null;
  return await decrypt(token);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
