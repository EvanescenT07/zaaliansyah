"use client";

import { useState, useEffect } from "react";
import { uploadMedia, getMediaFiles, deleteMedia } from "@/services/media";
import {
  UploadCloud,
  Copy,
  Trash2,
  Image as ImageIcon,
  FileAudio,
  File as FileIcon,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ModalConfirmation } from "@/components/ui/confirmation";
import imageCompression from "browser-image-compression";
import { BlobItemProps } from "@/types/data-types";

export default function MediaManager() {
  const [blobs, setBlobs] = useState<BlobItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [filterFolder, setFilterFolder] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blobToDelete, setBlobToDelete] = useState<string | null>(null);

  const fetchBlobs = async () => {
    setLoading(true);
    const res = await getMediaFiles();
    if (res.success) setBlobs(res.blobs as BlobItemProps[]);

    setLoading(false);
  };

  useEffect(() => {
    fetchBlobs();
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Stop page from refreshing!

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Extract the file directly from the form data
    let file = formData.get("file") as File;
    if (!file || file.size === 0) return;

    setUploading(true);

    try {
      if (file.type.startsWith("image/")) {
        const options = {
          maxSizeMB: 1,
          useWebWorker: true,
        };

        const compressedBlob = await imageCompression(file, options);
        // Convert the Blob back to a File object
        file = new File([compressedBlob], file.name, { type: file.type });

        // Overwrite the original uncompressed file in the FormData so Vercel gets the small one!
        formData.set("file", file);
      }

      const res = await uploadMedia(formData);

      if (res.success) {
        toast.success("File uploaded to Blob!");
        fetchBlobs();
        form.reset();
      } else {
        toast.error(res.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Compression or upload failed");
    } finally {
      setUploading(false); // Always resets the button, even if it crashes
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const confirmDelete = (url: string) => {
    setBlobToDelete(url);
    setIsModalOpen(true);
  };

  const executeDelete = async () => {
    if (!blobToDelete) return;

    const res = await deleteMedia(blobToDelete);
    if (res.success) {
      toast.success("File deleted successfully");
      fetchBlobs();
    } else {
      toast.error("Failed to delete");
    }
    setBlobToDelete(null);
  };

  const getFileIcon = (pathname: string) => {
    if (pathname.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i))
      return <ImageIcon className="text-blue-400" />;
    if (pathname.match(/\.(mp3|wav|ogg)$/i))
      return <FileAudio className="text-purple-400" />;
    return <FileIcon className="text-foreground/50" />;
  };

  // 1. Dynamically find all unique folders currently in Vercel Blob!
  const uniqueFolders = Array.from(
    new Set(
      blobs
        .filter((blob) => blob.pathname.includes("/"))
        .map((blob) => blob.pathname.split("/")[0]),
    ),
  ).sort();

  // 2. Case-insensitive filtering!
  const filteredBlobs =
    filterFolder === "all"
      ? blobs
      : blobs.filter((blob) => blob.pathname.startsWith(filterFolder + "/"));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ModalConfirmation
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={executeDelete}
        title="Delete File"
        message="Are you sure you want to delete this file forever from Vercel Blob? This action cannot be undone and might break images on your live site if they are currently in use."
        confirmText="Delete File"
        cancelText="Keep it"
        type="danger"
      />

      <div className="border-b border-foreground/10 pb-4">
        <h1 className="text-3xl font-bold font-comfortaa">Media Manager</h1>
        <p className="text-foreground/70 font-work-sans mt-2">
          Upload and manage files directly on Vercel Blob.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-background/30 p-6 rounded-2xl border border-foreground/10 shadow-lg">
        <h2 className="text-xl font-bold font-comfortaa mb-4 flex items-center gap-2">
          <UploadCloud className="text-primary" /> Upload New File
        </h2>
        <form
          onSubmit={handleUpload}
          className="flex flex-col lg:flex-row gap-4 items-end"
        >
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-semibold text-foreground/80">
              Target Folder
            </label>
            <select
              name="folder"
              className="w-full bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 text-foreground outline-none focus:border-primary transition-colors cursor-pointer appearance-none"
            >
              <option className="text-foreground dark:text-black" value="root">
                Root Folder (/)
              </option>
              <option
                className="text-foreground dark:text-black"
                value="Academic"
              >
                /Academic
              </option>
              <option
                className="text-foreground dark:text-black"
                value="Experience"
              >
                /Experience
              </option>
              <option className="text-foreground dark:text-black" value="PDF">
                /PDF
              </option>
              <option
                className="text-foreground dark:text-black"
                value="Playlist"
              >
                /Playlist
              </option>
              <option
                className="text-foreground dark:text-black"
                value="Project"
              >
                /Project
              </option>
            </select>
          </div>

          <div className="flex-[2] w-full space-y-2">
            <label className="text-sm font-semibold text-foreground/80">
              Select File
            </label>
            <input
              type="file"
              name="file"
              required
              className="w-full bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-2 text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 file:cursor-pointer outline-none cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full lg:w-auto h-12 px-8 flex items-center justify-center gap-2 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </form>
      </div>

      {/* File List Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold font-comfortaa">Your Cloud Files</h2>

          {/* DYNAMIC Filtering Dropdown */}
          <div className="flex items-center gap-2 bg-foreground/5 px-3 py-2 rounded-xl border border-foreground/10">
            <Filter size={16} className="text-foreground/50" />
            <select
              value={filterFolder}
              onChange={(e) => setFilterFolder(e.target.value)}
              className="bg-transparent text-sm font-semibold text-foreground outline-none cursor-pointer capitalize"
            >
              <option className="dark:text-black" value="all">
                View All Folders
              </option>
              {uniqueFolders.map((folder) => (
                <option className="dark:text-black" key={folder} value={folder}>
                  /{folder}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <p className="animate-pulse text-primary font-semibold">
              Loading your files from Vercel...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredBlobs.map((blob, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={blob.url}
                className="bg-background/40 border border-foreground/10 rounded-2xl p-5 flex flex-col justify-between group hover:border-primary/50 transition-all hover:shadow-xl"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-foreground/5 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                    {getFileIcon(blob.pathname)}
                  </div>
                  <div className="overflow-hidden">
                    <p
                      className="font-semibold text-sm truncate font-work-sans"
                      title={blob.pathname}
                    >
                      {blob.pathname}
                    </p>
                    <p className="text-xs text-foreground/50 mt-1 font-mono">
                      {(blob.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleCopy(blob.url)}
                    type="button"
                    className="flex-1 flex items-center justify-center h-10 text-xs font-semibold bg-foreground/10 hover:bg-primary hover:text-background text-foreground rounded-xl transition-all cursor-pointer"
                  >
                    <Copy size={14} className="mr-2" /> Copy URL
                  </button>
                  <button
                    onClick={() => confirmDelete(blob.url)}
                    type="button"
                    className="flex items-center justify-center h-10 w-12 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
            {filteredBlobs.length === 0 && (
              <p className="text-foreground/50 text-sm font-work-sans col-span-full text-center py-10 bg-foreground/5 rounded-2xl">
                No files found in this folder.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
