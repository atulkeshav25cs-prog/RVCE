import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_super_secret_key_for_dev_only_123!"
);

const citizenProtected = ["/citizen/dashboard"];
const authorityProtected = ["/authority/dashboard"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const isCitizenProtected = citizenProtected.some(route => path.startsWith(route));
  const isAuthorityProtected = authorityProtected.some(route => path.startsWith(route));

  if (!isCitizenProtected && !isAuthorityProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;
  let payload = null;

  if (token) {
    try {
      const verified = await jwtVerify(token, SECRET_KEY, { algorithms: ["HS256"] });
      payload = verified.payload;
    } catch (err) {
      payload = null;
    }
  }

  if (isCitizenProtected) {
    if (!payload || payload.role !== "citizen") {
      return NextResponse.redirect(new URL("/citizen/login", request.url));
    }
  }

  if (isAuthorityProtected) {
    if (!payload || payload.role !== "authority") {
      return NextResponse.redirect(new URL("/authority/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
