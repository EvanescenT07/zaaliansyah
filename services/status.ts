"use server";

import { prisma } from "@/lib/prisma";
import { CreateStatusInput } from "@/types/data-types";
import { cookies } from "next/headers";

const checkAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (token !== process.env.ADMIN_SECRET_TOKEN) throw new Error("Unauthorized!");
};

export async function getStatuses() {
  try {
    const statuses = await prisma.status.findMany({ orderBy: { orderIndex: 'asc' } });
    return { success: true, statuses };
  } catch  {
    return { success: false, error: "Failed to fetch statuses" };
  }
}

export async function createStatus(data: CreateStatusInput) {
  try {
    await checkAuth();
    await prisma.status.create({ data });
    return { success: true };
  } catch  {
    return { success: false, error: "Failed to create status record" };
  }
}

export async function updateStatus(id: string, data: CreateStatusInput) {
  try {
    await checkAuth();
    await prisma.status.update({ where: { id }, data });
    return { success: true };
  } catch (error) {
    console.error("Error updating status record:", error);
    return { success: false, error: "Failed to update status record" };
  }
}

export async function deleteStatus(id: string) {
  try {
    await checkAuth();
    await prisma.status.delete({ where: { id } });
    return { success: true };
  } catch  {
    return { success: false, error: "Failed to delete status record" };
  }
}