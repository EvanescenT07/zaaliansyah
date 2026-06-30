"use server";

import { prisma } from "@/lib/prisma";
import { CreateProjectInput } from "@/types/data-types";
import { cookies } from "next/headers";

const checkAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (token !== process.env.ADMIN_SECRET_TOKEN) {
    throw new Error("Unauthorized!");
  }
};

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { orderIndex: "asc" },
      include: { techStacks: true },
    });
    return { success: true, projects };
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function createProject(data: CreateProjectInput) {
  try {
    await checkAuth();
    await prisma.project.create({ data });
    return { success: true };
  } catch (error) {
    console.error("Error creating project record:", error);
    return { success: false, error: "Failed to create project record" };
  }
}

export async function updateProject(id: string, data: CreateProjectInput) {
  try {
    await checkAuth();
    await prisma.project.update({ where: { id }, data });
    return { success: true };
  } catch (error) {
    console.error("Error updating project record:", error);
    return { success: false, error: "Failed to update project record" };
  }
}

export async function deleteProject(id: string) {
  try {
    await checkAuth();
    await prisma.project.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Error deleting project record:", error);
    return { success: false, error: "Failed to delete project record" };
  }
}
