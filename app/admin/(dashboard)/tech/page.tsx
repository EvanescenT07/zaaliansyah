"use client";

import { useState, useEffect } from "react";
import { getTechs, createTech, deleteTech, updateTech } from "@/services/tech";
import type { TechStack } from "@/lib/generated/prisma/client";
import { Code2, Trash2, Plus, Edit2, X } from "lucide-react";
import { createElement } from "react";
import type { IconType } from "react-icons";
import * as SiIcons from "react-icons/si";
import * as GiIcons from "react-icons/gi";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as BiIcons from "react-icons/bi";
import * as AiIcons from "react-icons/ai";
import * as TbIcons from "react-icons/tb";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ModalConfirmation } from "@/components/ui/confirmation";
import { CreateTechInput } from "@/types/data-types";

const ALL_ICONS: Record<string, IconType> = {
  ...SiIcons,
  ...GiIcons,
  ...FaIcons,
  ...MdIcons,
  ...BiIcons,
  ...AiIcons,
  ...TbIcons,
} as Record<string, IconType>;

export default function TechStackManager() {
  const [techs, setTechs] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  // NEW: Track the currently editing record
  const [editingRecord, setEditingRecord] = useState<TechStack | null>(null);

  const fetchRecords = async () => {
    setFetching(true);
    const res = await getTechs();
    if (res.success && res.techs) setTechs(res.techs);
    setFetching(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: CreateTechInput = {
      name: formData.get("name") as string,
      iconName: formData.get("iconName") as string,
      category: Number(formData.get("category")),
    };

    let res;
    if (editingRecord) {
      res = await updateTech(editingRecord.id, data);
    } else {
      res = await createTech(data);
    }

    if (res.success) {
      toast.success(
        editingRecord ? "Technology updated!" : "Technology added!",
      );
      fetchRecords();
      setEditingRecord(null);
    } else {
      toast.error(
        res.error || "Failed to save technology (name must be unique!)",
      );
    }
    setLoading(false);
  };

  const handleEdit = (record: TechStack) => {
    setEditingRecord(record);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = (id: string) => {
    setRecordToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!recordToDelete) return;
    const res = await deleteTech(recordToDelete);
    if (res.success) {
      toast.success("Record deleted");
      fetchRecords();
    } else {
      toast.error("Failed to delete record");
    }
    setRecordToDelete(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ModalConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="Delete Tech Stack"
        message="Are you sure you want to permanently delete this technology? This cannot be undone."
        type="danger"
      />

      <div className="border-b border-foreground/10 pb-4">
        <h1 className="text-3xl font-bold font-comfortaa flex items-center gap-3">
          <Code2 className="text-primary" size={32} /> Tech Stack Manager
        </h1>
        <p className="text-foreground/70 font-work-sans mt-2">
          Manage the technologies, languages, and tools you use.
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
            {editingRecord ? "Edit Technology" : "Add New Technology"}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            defaultValue={editingRecord?.name || ""}
            required
            placeholder="Name (e.g. React.js)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="iconName"
            defaultValue={editingRecord?.iconName || ""}
            required
            placeholder="Lucide Icon Name (e.g. Code2)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="category"
            defaultValue={editingRecord?.category ?? ""}
            type="number"
            required
            placeholder="Category (e.g. 1 = Frontend, 2 = Backend)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 px-8 flex items-center justify-center bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer w-full md:w-auto"
        >
          {loading
            ? "Saving..."
            : editingRecord
              ? "Update Technology"
              : "Save Technology"}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-bold font-comfortaa">
          Existing Technologies
        </h2>
        {fetching ? (
          <p className="animate-pulse text-primary font-semibold">
            Loading technologies...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {techs.map((tech, idx) => {
              const Icon = ALL_ICONS[tech.iconName];
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={tech.id}
                  className={`bg-background/40 border rounded-2xl p-5 flex flex-col justify-between transition-colors group ${editingRecord?.id === tech.id ? "border-primary ring-1 ring-primary" : "border-foreground/10"}`}
                >
                  <div className="flex items-center gap-3">
                    {Icon &&
                      createElement(Icon, {
                        className: "text-foreground shrink-0",
                        size: 32,
                      })}
                    <div>
                      <h3 className="font-bold text-md font-comfortaa">
                        {tech.name}
                      </h3>
                      <p className="text-xs text-foreground/50 mt-1 font-mono">
                        Icon: {tech.iconName}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-foreground/10">
                    <span className="text-xs text-foreground/40 font-mono">
                      Category ID: {tech.category}
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(tech)}
                        className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => confirmDelete(tech.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {techs.length === 0 && (
              <p className="text-foreground/50 text-sm py-8 bg-foreground/5 rounded-2xl text-center col-span-full">
                No technologies found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
