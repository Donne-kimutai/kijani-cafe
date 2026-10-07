import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = process.env.SESSION_SECRET;
if (!secret) throw new Error("SESSION_SECRET is not set in .env");
const key = new TextEncoder().encode(secret);

const COOKIE_NAME = "session";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export async function createSession(adminId: number) {
  const expiresAt = new Date(Date.now() + SEVEN_DAYS);

  const token = await new SignJWT({ adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function getSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return { adminId: payload.adminId as number };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}