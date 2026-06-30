"use server";

import { prisma } from "@/lib/prisma";
import { CreateAcademicInput } from "@/types/data-types";
import { cookies } from "next/headers";

const checkAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (token !== process.env.ADMIN_SECRET_TOKEN) {
    throw new Error("Unauthorized!");
  }
};

export async function getAcademics() {
  try {
    const academics = await prisma.academic.findMany({
      orderBy: { orderIndex: "asc" },
    });
    return { success: true, academics };
  } catch (error) {
    console.error("Failed to fetch academics:", error);
    return { success: false, error: "Failed to fetch academics" };
  }
}

export async function createAcademic(data: CreateAcademicInput) {
  try {
    await checkAuth();
    await prisma.academic.create({ data });
    return { success: true };
  } catch (error) {
    console.error("Error creating academic record:", error);
    return { success: false, error: "Failed to create academic record" };
  }
}

export async function updateAcademic(id: string, data: CreateAcademicInput) {
  try {
    await checkAuth();
    await prisma.academic.update({ where: { id }, data });
    return { success: true };
  } catch (error) {
    console.error("Error updating academic record:", error);
    return { success: false, error: "Failed to update academic record" };
  }
}

export async function deleteAcademic(id: string) {
  try {
    await checkAuth();
    await prisma.academic.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Error deleting academic record:", error);
    return { success: false, error: "Failed to delete academic record" };
  }
}
