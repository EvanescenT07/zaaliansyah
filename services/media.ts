"use server";

import { del, list, put } from "@vercel/blob";
import { cookies } from "next/headers";

// Security Check Helper
const checkAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (token !== process.env.ADMIN_SECRET_TOKEN) {
    throw new Error("Unauthorized!");
  }
};

export async function uploadMedia(formData: FormData) {
  await checkAuth();

  const file = formData.get("file") as File;
  const folder = formData.get("folder") as string;

  if (!file || file.size === 0) {
    return {
      error: "No file provided",
    };
  }

  // Construct path based on folder selection
  const path = folder === "root" ? file.name : `${folder}/${file.name}`;

  try {
    const blob = await put(path, file, {
      access: "public",
    });
    return { success: true, url: blob.url };
  } catch {
    return { error: "Upload failed" };
  }
}

export async function getMediaFiles() {
  await checkAuth();
  try {
    const { blobs } = await list();
    return {
      success: true,
      blobs,
    };
  } catch {
    return {
      error: "Failed to list files",
    };
  }
}

export async function deleteMedia(url: string) {
  await checkAuth();
  try {
    await del(url);
    return { success: true };
  } catch {
    return { error: "Failed to delete file" };
  }
}
