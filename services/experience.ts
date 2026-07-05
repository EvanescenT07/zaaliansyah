"use server";

import { prisma } from "@/lib/prisma";
import { CreateExperienceInput } from "@/types/data-types";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const checkAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (token !== process.env.ADMIN_SECRET_TOKEN) {
    throw new Error("Unauthorized!");
  }
};

export async function getExperiences() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { orderIndex: "asc" },
    });
    return { success: true, experiences };
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    return { success: false, error: "Failed to fetch experiences" };
  }
}

export async function createExperience(data: CreateExperienceInput) {
  try {
    await checkAuth();

    await prisma.$transaction(async (tx) => {
      await tx.experience.updateMany({
        where: { orderIndex: { gte: data.orderIndex } },
        data: { orderIndex: { increment: 1 } },
      });

      await tx.experience.create({ data });
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error creating experience record:", error);
    return { success: false, error: "Failed to create experience record" };
  }
}

export async function updateExperience(
  id: string,
  data: CreateExperienceInput,
) {
  try {
    await checkAuth();

    await prisma.$transaction(async (tx) => {
      const current = await tx.experience.findUniqueOrThrow({
        where: { id },
        select: { orderIndex: true },
      });

      const oldIndex = current.orderIndex;
      const newIndex = data.orderIndex;

      if (oldIndex !== newIndex) {
        if (newIndex < oldIndex) {
          await tx.experience.updateMany({
            where: {
              orderIndex: { gte: newIndex, lt: oldIndex },
              id: { not: id },
            },
            data: { orderIndex: { increment: 1 } },
          });
        } else {
          await tx.experience.updateMany({
            where: {
              orderIndex: { gt: oldIndex, lte: newIndex },
              id: { not: id },
            },
            data: { orderIndex: { decrement: 1 } },
          });
        }
      }

      await tx.experience.update({ where: { id }, data });
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error updating experience record:", error);
    return { success: false, error: "Failed to update experience record" };
  }
}

export async function deleteExperience(id: string) {
  try {
    await checkAuth();

    await prisma.$transaction(async (tx) => {
      const experience = await tx.experience.findUniqueOrThrow({
        where: { id },
        select: { orderIndex: true },
      });

      await tx.experience.delete({ where: { id } });

      await tx.experience.updateMany({
        where: { orderIndex: { gt: experience.orderIndex } },
        data: { orderIndex: { decrement: 1 } },
      });
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error deleting experience record:", error);
    return { success: false, error: "Failed to delete experience record" };
  }
}
