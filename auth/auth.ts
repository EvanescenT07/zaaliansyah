"use server";

import { cookies, headers } from "next/headers";
import crypto from "crypto";

const rateLimitMap = new Map<string, { attempts: number; lockUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 5 * 60 * 1000;

function safeCompare(a: string, b: string): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function loginWithPin(formData: FormData) {
  // Get User IP
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown_ip";

  const record = rateLimitMap.get(ip) || { attempts: 0, lockUntil: 0 };
  const now = Date.now();

  if (record.lockUntil > now) {
    const minutesLeft = Math.ceil((record.lockUntil - now) / 60000);
    return {
      success: false,
      error: `Locked out. Try again in ${minutesLeft} mins.`,
    };
  }

  const pin = formData.get("pin") as string;
  const adminPin = process.env.ADMIN_SECRET_PIN;
  const adminToken = process.env.ADMIN_SECRET_TOKEN;

  // Strict check: environment credentials must be configured
  if (adminPin && adminToken && pin && safeCompare(pin, adminPin)) {
    rateLimitMap.delete(ip);

    const cookieStore = await cookies();
    cookieStore.set("admin_session", adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    return { success: true };
  }

  // Failure Case: Increment attempts
  record.attempts += 1;

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockUntil = now + LOCK_TIME_MS;
  }
  rateLimitMap.set(ip, record);

  const attemptsLeft = MAX_ATTEMPTS - record.attempts;
  return {
    success: false,
    error:
      record.attempts >= MAX_ATTEMPTS
        ? "Account locked for 5 minutes."
        : `Invalid PIN. ${attemptsLeft} attempts remaining.`,
  };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
