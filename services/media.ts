"use server";

import { del, list, put } from "@vercel/blob";
import { verifyAdminAuth } from "@/lib/auth-guard";

const checkAuth = verifyAdminAuth;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function uploadMedia(formData: FormData) {
  await checkAuth();

  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "root";

  if (!file || file.size === 0) {
    return {
      error: "No file provided",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      error: "File size exceeds the 10MB limit",
    };
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return {
      error: "Invalid file type. Only JPEG, PNG, WebP, GIF, and PDF are allowed.",
    };
  }

  // Sanitize path against directory traversal
  const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
  const path =
    !sanitizedFolder || sanitizedFolder === "root"
      ? sanitizedFileName
      : `${sanitizedFolder}/${sanitizedFileName}`;

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
    return { error: "Delete failed" };
  }
}
