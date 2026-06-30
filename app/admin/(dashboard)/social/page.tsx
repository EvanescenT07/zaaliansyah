"use client";

import { useState, useEffect, createElement } from "react";
import {
  getSocials,
  createSocial,
  deleteSocial,
  updateSocial,
} from "@/services/social";
import type { SocialMedia } from "@/lib/generated/prisma/client";
import { Share2, Trash2, Plus, Edit2, X } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ModalConfirmation } from "@/components/ui/confirmation";
import { CreateSocialInput } from "@/types/data-types";
import { IconType } from "react-icons";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";

const ICONS: Record<string, IconType> = {
  ...SiIcons,
  ...FaIcons,
} as Record<string, IconType>;

export default function SocialMediaManager() {
  const [socials, setSocials] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<SocialMedia | null>(null);
  const fetchRecords = async () => {
    setFetching(true);
    const res = await getSocials();
    if (res.success && res.socials) setSocials(res.socials);
    setFetching(false);
  };
  useEffect(() => {
    fetchRecords();
  }, []);
  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: CreateSocialInput = {
      name: formData.get("name") as string,
      url: formData.get("url") as string,
      iconName: formData.get("iconName") as string,
      orderIndex: Number(formData.get("orderIndex")),
    };
    let res;
    if (editingRecord) {
      res = await updateSocial(editingRecord.id, data);
    } else {
      res = await createSocial(data);
    }
    if (res.success) {
      toast.success(editingRecord ? "Link updated!" : "Social link added!");
      fetchRecords();
      setEditingRecord(null);
    } else {
      toast.error(res.error || "Failed to save link");
    }
    setLoading(false);
  };
  const handleEdit = (record: SocialMedia) => {
    setEditingRecord(record);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const confirmDelete = (id: string) => {
    setRecordToDelete(id);
    setIsDeleteModalOpen(true);
  };
  const executeDelete = async () => {
    if (!recordToDelete) return;
    const res = await deleteSocial(recordToDelete);
    if (res.success) {
      toast.success("Link deleted");
      fetchRecords();
    } else {
      toast.error("Failed to delete link");
    }
    setRecordToDelete(null);
  };
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ModalConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="Delete Social Link"
        message="Are you sure you want to permanently delete this link? This cannot be undone."
        type="danger"
      />
      <div className="border-b border-foreground/10 pb-4">
        <h1 className="text-3xl font-bold font-comfortaa flex items-center gap-3">
          <Share2 className="text-primary" size={32} /> Social Media Links
        </h1>
        <p className="text-foreground/70 font-work-sans mt-2">
          Manage your external social profiles and contact links.
        </p>
      </div>
      <form
        key={editingRecord ? editingRecord.id : "new"}
        onSubmit={handleCreateOrUpdate}
        className="bg-background/30 p-6 rounded-2xl border border-foreground/10 shadow-lg space-y-6 transition-all"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-comfortaa flex items-center gap-2">
            {editingRecord ? (
              <Edit2 className="text-primary" />
            ) : (
              <Plus className="text-primary" />
            )}
            {editingRecord ? "Edit Link" : "Add New Link"}
          </h2>
          {editingRecord && (
            <button
              type="button"
              onClick={() => setEditingRecord(null)}
              className="text-foreground/50 hover:text-foreground text-sm flex items-center gap-1 cursor-pointer"
            >
              <X size={16} /> Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            defaultValue={editingRecord?.name || ""}
            required
            placeholder="Platform Name (e.g. LinkedIn)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="iconName"
            defaultValue={editingRecord?.iconName || ""}
            required
            placeholder="Lucide Icon Name (e.g. Linkedin)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="url"
            defaultValue={editingRecord?.url || ""}
            required
            placeholder="Full URL (https://...)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm md:col-span-2"
          />
          <input
            name="orderIndex"
            type="number"
            defaultValue={editingRecord?.orderIndex ?? 0}
            required
            placeholder="Display Order (0 is first)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm md:col-span-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="h-12 px-8 flex items-center justify-center bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer w-full md:w-auto"
        >
          {loading ? "Saving..." : editingRecord ? "Update Link" : "Save Link"}
        </button>
      </form>
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-comfortaa">Active Links</h2>
        {fetching ? (
          <p className="animate-pulse text-primary font-semibold">
            Loading links...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {socials.map((social, idx) => {
              const Icon = ICONS[social.iconName];
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={social.id}
                  className={`bg-background/40 border rounded-2xl p-5 flex flex-col justify-between transition-colors group ${editingRecord?.id === social.id ? "border-primary ring-1 ring-primary" : "border-foreground/10"}`}
                >
                  <div className="flex items-start gap-3">
                    {Icon &&
                      createElement(Icon, {
                        className: "text-foreground shrink-0 mt-1",
                        size: 24,
                      })}
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-md font-comfortaa truncate">
                        {social.name}
                      </h3>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline font-mono truncate block mt-1"
                      >
                        {social.url}
                      </a>
                      <p className="text-xs text-foreground/50 font-mono mt-1 truncate">
                        Icon: {social.iconName}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-foreground/10">
                    <span className="text-xs text-foreground/40 font-mono">
                      Order: {social.orderIndex}
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(social)}
                        className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => confirmDelete(social.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {socials.length === 0 && (
              <p className="text-foreground/50 text-sm py-8 bg-foreground/5 rounded-2xl text-center col-span-full">
                No social links found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
