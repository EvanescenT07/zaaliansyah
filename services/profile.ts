"use server";

import { prisma } from "@/lib/prisma";
import { UpsertProfileInput } from "@/types/data-types";
import { cookies } from "next/headers";

const checkAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (token !== process.env.ADMIN_SECRET_TOKEN) {
    throw new Error("Unauthorized!");
  }
};

export async function getProfile() {
  try {
    const profile = await prisma.profile.findFirst();
    return { success: true, profile };
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return { success: false, error: "Failed to fetch profile" };
  }
}

export async function upsertProfile(data: UpsertProfileInput) {
  try {
    await checkAuth();
    
    const existing = await prisma.profile.findFirst();
    
    if (existing) {
      await prisma.profile.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.profile.create({ data });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error saving profile:", error);
    return { success: false, error: "Failed to save profile" };
  }
}