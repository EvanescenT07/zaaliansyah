"use server";

import { prisma } from "@/lib/prisma";
import { CreateSocialInput } from "@/types/data-types";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const checkAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (token !== process.env.ADMIN_SECRET_TOKEN)
    throw new Error("Unauthorized!");
};

export async function getSocials() {
  try {
    const socials = await prisma.socialMedia.findMany({
      orderBy: { orderIndex: "asc" },
    });
    return { success: true, socials };
  } catch {
    return { success: false, error: "Failed to fetch social media" };
  }
}

export async function updateSocial(id: string, data: CreateSocialInput) {
  try {
    await checkAuth();
    await prisma.socialMedia.update({ where: { id }, data });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error updating social record:", error);
    return { success: false, error: "Failed to update social record" };
  }
}

export async function createSocial(data: CreateSocialInput) {
  try {
    await checkAuth();
    await prisma.socialMedia.create({ data });
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create social record" };
  }
}

export async function deleteSocial(id: string) {
  try {
    await checkAuth();
    await prisma.socialMedia.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete social record" };
  }
}
