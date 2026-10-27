import { cookies } from "next/headers";
import crypto from "crypto";

function safeCompare(a: string, b: string): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function verifyAdminAuth(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const adminToken = process.env.ADMIN_SECRET_TOKEN;

  if (!adminToken || !token || !safeCompare(token, adminToken)) {
    throw new Error("Unauthorized access: missing or invalid session.");
  }
}

