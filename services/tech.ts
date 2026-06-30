"use server";

import { prisma } from "@/lib/prisma";
import { CreateTechInput } from "@/types/data-types";
import { cookies } from "next/headers";

const checkAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (token !== process.env.ADMIN_SECRET_TOKEN)
    throw new Error("Unauthorized!");
};

export async function getTechs() {
  try {
    const techs = await prisma.techStack.findMany({
      orderBy: { category: "asc" },
    });
    return { success: true, techs };
  } catch {
    return { success: false, error: "Failed to fetch tech stack" };
  }
}

export async function createTech(data: CreateTechInput) {
  try {
    await checkAuth();
    await prisma.techStack.create({ data });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create tech stack record" };
  }
}

export async function updateTech(id: string, data: CreateTechInput) {
  try {
    await checkAuth();
    await prisma.techStack.update({ where: { id }, data });
    return { success: true };
  } catch (error) {
    console.error("Error updating tech stack record:", error);
    return { success: false, error: "Failed to update tech stack record" };
  }
}

export async function deleteTech(id: string) {
  try {
    await checkAuth();
    await prisma.techStack.delete({ where: { id } });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete tech stack record" };
  }
}
